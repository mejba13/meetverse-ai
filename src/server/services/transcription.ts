/**
 * Transcription Service
 *
 * Integrates with Deepgram for real-time speech-to-text transcription.
 * Handles both streaming and batch transcription modes.
 */

import { db } from "@/server/db";

// Deepgram configuration
const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;
const DEEPGRAM_API_URL = "https://api.deepgram.com/v1";

export interface TranscriptionConfig {
  language?: string;
  model?: "nova-2" | "nova" | "enhanced" | "base";
  punctuate?: boolean;
  diarize?: boolean;
  smartFormat?: boolean;
  utterances?: boolean;
}

export interface TranscriptSegment {
  text: string;
  start: number;
  end: number;
  speaker?: string;
  confidence: number;
  words?: Array<{
    word: string;
    start: number;
    end: number;
    confidence: number;
  }>;
}

export interface TranscriptionResult {
  segments: TranscriptSegment[];
  fullText: string;
  duration: number;
  speakers: string[];
}

/**
 * Check if Deepgram is configured
 */
export function isDeepgramConfigured(): boolean {
  return !!DEEPGRAM_API_KEY;
}

/**
 * Transcribe audio from a URL or buffer
 */
export async function transcribeAudio(
  audioSource: string | Uint8Array,
  config: TranscriptionConfig = {}
): Promise<TranscriptionResult> {
  if (!isDeepgramConfigured()) {
    throw new Error("Deepgram is not configured. Please set DEEPGRAM_API_KEY.");
  }

  const {
    language = "en",
    model = "nova-2",
    punctuate = true,
    diarize = true,
    smartFormat = true,
    utterances = true,
  } = config;

  const queryParams = new URLSearchParams({
    language,
    model,
    punctuate: String(punctuate),
    diarize: String(diarize),
    smart_format: String(smartFormat),
    utterances: String(utterances),
  });

  const isUrl = typeof audioSource === "string";
  const url = `${DEEPGRAM_API_URL}/listen?${queryParams}`;

  // Handle body based on source type
  let body: BodyInit;
  if (isUrl) {
    body = JSON.stringify({ url: audioSource });
  } else {
    // Convert Uint8Array to ArrayBuffer for fetch compatibility
    body = audioSource.buffer.slice(
      audioSource.byteOffset,
      audioSource.byteOffset + audioSource.byteLength
    ) as ArrayBuffer;
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Token ${DEEPGRAM_API_KEY}`,
      "Content-Type": isUrl ? "application/json" : "audio/wav",
    },
    body,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Deepgram transcription failed: ${error}`);
  }

  const result = await response.json();
  return parseDeepgramResponse(result);
}

/**
 * Parse Deepgram API response into our format
 */
function parseDeepgramResponse(response: DeepgramResponse): TranscriptionResult {
  const channel = response.results?.channels?.[0];
  const alternatives = channel?.alternatives?.[0];

  if (!alternatives) {
    return {
      segments: [],
      fullText: "",
      duration: 0,
      speakers: [],
    };
  }

  const segments: TranscriptSegment[] = [];
  const speakersSet = new Set<string>();

  // Use utterances if available (includes speaker diarization)
  if (response.results?.utterances) {
    for (const utterance of response.results.utterances) {
      const speaker = `Speaker ${utterance.speaker}`;
      speakersSet.add(speaker);

      segments.push({
        text: utterance.transcript,
        start: utterance.start,
        end: utterance.end,
        speaker,
        confidence: utterance.confidence,
        words: utterance.words?.map((w) => ({
          word: w.word,
          start: w.start,
          end: w.end,
          confidence: w.confidence,
        })),
      });
    }
  } else if (alternatives.words) {
    // Fall back to word-level transcription
    let currentSegment: TranscriptSegment | null = null;

    for (const word of alternatives.words) {
      const speaker = word.speaker !== undefined ? `Speaker ${word.speaker}` : undefined;
      if (speaker) speakersSet.add(speaker);

      if (!currentSegment || currentSegment.speaker !== speaker) {
        if (currentSegment) {
          segments.push(currentSegment);
        }
        currentSegment = {
          text: word.word,
          start: word.start,
          end: word.end,
          speaker,
          confidence: word.confidence,
          words: [
            {
              word: word.word,
              start: word.start,
              end: word.end,
              confidence: word.confidence,
            },
          ],
        };
      } else {
        currentSegment.text += " " + word.word;
        currentSegment.end = word.end;
        currentSegment.words?.push({
          word: word.word,
          start: word.start,
          end: word.end,
          confidence: word.confidence,
        });
      }
    }

    if (currentSegment) {
      segments.push(currentSegment);
    }
  }

  return {
    segments,
    fullText: alternatives.transcript || "",
    duration: response.metadata?.duration || 0,
    speakers: Array.from(speakersSet),
  };
}

/**
 * Save transcription segments to database
 */
export async function saveTranscription(
  meetingId: string,
  result: TranscriptionResult
): Promise<string[]> {
  const segmentIds: string[] = [];

  for (const segment of result.segments) {
    const transcriptSegment = await db.transcriptSegment.create({
      data: {
        meetingId,
        content: segment.text,
        speakerName: segment.speaker || "Unknown",
        startTime: Math.floor(segment.start * 1000), // Convert to milliseconds
        endTime: Math.floor(segment.end * 1000),
        confidence: segment.confidence,
        language: "en",
        isFinal: true,
      },
    });
    segmentIds.push(transcriptSegment.id);
  }

  return segmentIds;
}

/**
 * Get full transcript for a meeting (all segments combined)
 */
export async function getTranscript(meetingId: string): Promise<string | null> {
  const segments = await db.transcriptSegment.findMany({
    where: { meetingId },
    orderBy: { startTime: "asc" },
  });

  if (segments.length === 0) {
    return null;
  }

  return segments
    .map((seg) => {
      const timestamp = formatTimestamp(seg.startTime / 1000);
      const speaker = seg.speakerName || "Unknown";
      return `[${timestamp}] ${speaker}: ${seg.content}`;
    })
    .join("\n");
}

/**
 * Get transcript segments for a meeting
 */
export async function getTranscriptSegments(meetingId: string) {
  return db.transcriptSegment.findMany({
    where: { meetingId },
    orderBy: { startTime: "asc" },
  });
}

/**
 * Format seconds to timestamp string
 */
function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

// Type definitions for Deepgram API response
interface DeepgramWord {
  word: string;
  start: number;
  end: number;
  confidence: number;
  speaker?: number;
}

interface DeepgramUtterance {
  start: number;
  end: number;
  confidence: number;
  channel: number;
  transcript: string;
  words: DeepgramWord[];
  speaker: number;
  id: string;
}

interface DeepgramResponse {
  metadata?: {
    duration?: number;
    channels?: number;
  };
  results?: {
    channels?: Array<{
      alternatives?: Array<{
        transcript?: string;
        confidence?: number;
        words?: DeepgramWord[];
      }>;
    }>;
    utterances?: DeepgramUtterance[];
  };
}

/**
 * Create a streaming transcription session (WebSocket-based)
 * Returns configuration for client-side WebSocket connection
 */
export function getStreamingConfig(_meetingId: string): {
  url: string;
  protocol: string;
} {
  if (!isDeepgramConfigured()) {
    throw new Error("Deepgram is not configured");
  }

  const params = new URLSearchParams({
    model: "nova-2",
    language: "en",
    punctuate: "true",
    diarize: "true",
    smart_format: "true",
    interim_results: "true",
    endpointing: "300",
  });

  return {
    url: `wss://api.deepgram.com/v1/listen?${params}`,
    protocol: `token:${DEEPGRAM_API_KEY}`,
  };
}
