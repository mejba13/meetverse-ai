/**
 * Post-Meeting Processor
 *
 * Orchestrates the processing pipeline after a meeting ends:
 * 1. Fetches/finalizes transcript
 * 2. Generates AI summary
 * 3. Extracts action items
 * 4. Sends notifications
 * 5. Updates meeting status
 */

import { db } from "@/server/db";
import {
  transcribeAudio,
  saveTranscription,
  getTranscript,
  isDeepgramConfigured,
  type TranscriptionResult,
} from "./transcription";
import {
  analyzeMeeting,
  saveMeetingAnalysis,
  isAIConfigured,
  type MeetingAnalysis,
} from "./ai";

export interface ProcessingResult {
  success: boolean;
  meetingId: string;
  transcriptSegmentCount?: number;
  summary?: MeetingAnalysis["summary"];
  actionItemCount?: number;
  errors: string[];
  processingTime: number;
}

export interface ProcessingOptions {
  skipTranscription?: boolean;
  skipAnalysis?: boolean;
  audioUrl?: string;
  existingTranscript?: string;
  notifyParticipants?: boolean;
}

/**
 * Process a completed meeting
 */
export async function processMeeting(
  meetingId: string,
  options: ProcessingOptions = {}
): Promise<ProcessingResult> {
  const startTime = Date.now();
  const errors: string[] = [];
  let transcriptSegmentCount: number | undefined;
  let analysis: MeetingAnalysis | undefined;

  try {
    // 1. Fetch meeting details
    const meeting = await db.meeting.findUnique({
      where: { id: meetingId },
      include: {
        host: { select: { id: true, name: true, email: true } },
        participants: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
        transcripts: {
          orderBy: { startTime: "asc" },
          take: 1,
        },
      },
    });

    if (!meeting) {
      return {
        success: false,
        meetingId,
        errors: ["Meeting not found"],
        processingTime: Date.now() - startTime,
      };
    }

    // Get participant names for AI analysis
    const participantNames = [
      meeting.host.name || meeting.host.email || "Host",
      ...meeting.participants
        .filter((p) => p.user)
        .map((p) => p.user!.name || p.user!.email || "Participant"),
    ];

    // 2. Get or generate transcript
    let transcriptContent = options.existingTranscript;

    if (!transcriptContent && !options.skipTranscription) {
      // Check if transcript already exists
      const existingTranscript = await getTranscript(meetingId);
      if (existingTranscript) {
        transcriptContent = existingTranscript;
      } else if (options.audioUrl && isDeepgramConfigured()) {
        // Transcribe from audio
        try {
          const transcriptionResult = await transcribeAudio(options.audioUrl, {
            diarize: true,
            punctuate: true,
            smartFormat: true,
          });

          const savedSegments = await saveTranscription(meetingId, transcriptionResult);
          transcriptSegmentCount = savedSegments.length;
          transcriptContent = formatTranscriptForAnalysis(transcriptionResult);
        } catch (err) {
          errors.push(`Transcription failed: ${err instanceof Error ? err.message : "Unknown error"}`);
        }
      } else if (!isDeepgramConfigured()) {
        errors.push("Transcription skipped: Deepgram not configured");
      }
    }

    // 3. Generate AI analysis
    if (transcriptContent && !options.skipAnalysis && isAIConfigured()) {
      try {
        analysis = await analyzeMeeting(
          transcriptContent,
          meeting.title,
          participantNames
        );

        // Save analysis to database
        await saveMeetingAnalysis(meetingId, analysis);
      } catch (err) {
        errors.push(`AI analysis failed: ${err instanceof Error ? err.message : "Unknown error"}`);
      }
    } else if (!isAIConfigured()) {
      errors.push("AI analysis skipped: Anthropic API not configured");
    }

    // 4. Update meeting status
    await db.meeting.update({
      where: { id: meetingId },
      data: {
        status: "ENDED",
        actualEnd: new Date(),
      },
    });

    // 5. Send notifications (if enabled)
    if (options.notifyParticipants && analysis) {
      await sendMeetingSummaryNotifications(
        {
          id: meeting.id,
          title: meeting.title,
          host: meeting.host,
          participants: meeting.participants,
        },
        analysis
      );
    }

    return {
      success: errors.length === 0,
      meetingId,
      transcriptSegmentCount,
      summary: analysis?.summary,
      actionItemCount: analysis?.actionItems.length,
      errors,
      processingTime: Date.now() - startTime,
    };
  } catch (err) {
    return {
      success: false,
      meetingId,
      errors: [err instanceof Error ? err.message : "Unknown processing error"],
      processingTime: Date.now() - startTime,
    };
  }
}

/**
 * Format transcription result for AI analysis
 */
function formatTranscriptForAnalysis(result: TranscriptionResult): string {
  return result.segments
    .map((seg) => {
      const timestamp = formatTimestamp(seg.start);
      const speaker = seg.speaker || "Speaker";
      return `[${timestamp}] ${speaker}: ${seg.text}`;
    })
    .join("\n");
}

/**
 * Format seconds to timestamp
 */
function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Send meeting summary notifications to participants
 */
async function sendMeetingSummaryNotifications(
  meeting: {
    id: string;
    title: string;
    host: { email: string | null; name: string | null };
    participants: Array<{
      user: { email: string | null; name: string | null } | null;
    }>;
  },
  analysis: MeetingAnalysis
): Promise<void> {
  // Collect all participant emails
  const emails = new Set<string>();

  if (meeting.host.email) {
    emails.add(meeting.host.email);
  }

  for (const participant of meeting.participants) {
    if (participant.user?.email) {
      emails.add(participant.user.email);
    }
  }

  // TODO: Implement email sending
  // This would integrate with an email service like SendGrid, Resend, etc.
  console.log("[Post-Meeting] Would send summary to:", Array.from(emails));
  console.log("[Post-Meeting] Summary:", {
    title: analysis.summary.title,
    overview: analysis.summary.overview,
    actionItemCount: analysis.actionItems.length,
  });
}

/**
 * Queue a meeting for processing (for async processing)
 */
export async function queueMeetingForProcessing(
  meetingId: string,
  options: ProcessingOptions = {}
): Promise<{ queued: boolean; jobId?: string }> {
  // For now, process synchronously
  // In production, this would queue to a job system like BullMQ, Inngest, etc.

  // Process in background (fire and forget for now)
  processMeeting(meetingId, options).catch((err) => {
    console.error(`[Post-Meeting] Background processing failed for ${meetingId}:`, err);
  });

  return {
    queued: true,
    jobId: `job_${meetingId}_${Date.now()}`,
  };
}

/**
 * Get processing status for a meeting
 */
export async function getProcessingStatus(meetingId: string): Promise<{
  status: "pending" | "processing" | "completed" | "failed";
  hasTranscript: boolean;
  hasSummary: boolean;
  actionItemCount: number;
}> {
  const meeting = await db.meeting.findUnique({
    where: { id: meetingId },
    include: {
      transcripts: { select: { id: true }, take: 1 },
      actionItems: { select: { id: true } },
    },
  });

  if (!meeting) {
    return {
      status: "pending",
      hasTranscript: false,
      hasSummary: false,
      actionItemCount: 0,
    };
  }

  const hasTranscript = meeting.transcripts.length > 0;
  const hasSummary = !!meeting.aiSummary;
  const actionItemCount = meeting.actionItems.length;

  let status: "pending" | "processing" | "completed" | "failed";

  if (meeting.status === "ENDED" && (hasTranscript || hasSummary)) {
    status = "completed";
  } else if (meeting.status === "LIVE") {
    status = "processing";
  } else if (meeting.status === "CANCELLED") {
    status = "failed";
  } else {
    status = "pending";
  }

  return {
    status,
    hasTranscript,
    hasSummary,
    actionItemCount,
  };
}

/**
 * Reprocess a meeting (regenerate summary/action items)
 */
export async function reprocessMeeting(meetingId: string): Promise<ProcessingResult> {
  // Get existing transcript
  const transcriptContent = await getTranscript(meetingId);

  if (!transcriptContent) {
    return {
      success: false,
      meetingId,
      errors: ["No transcript found for reprocessing"],
      processingTime: 0,
    };
  }

  // Delete existing action items
  await db.actionItem.deleteMany({
    where: { meetingId },
  });

  // Reprocess with existing transcript
  return processMeeting(meetingId, {
    skipTranscription: true,
    existingTranscript: transcriptContent,
  });
}
