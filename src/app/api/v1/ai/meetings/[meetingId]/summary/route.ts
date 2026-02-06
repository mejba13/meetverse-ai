import { NextRequest } from "next/server";
import { db } from "@/server/db";
import { withAuth } from "../../../../_lib/middleware";
import { success, error } from "../../../../_lib/response";
import * as errors from "../../../../_lib/errors";
import {
  generateMeetingSummary,
  isAIConfigured,
} from "@/server/services/ai";
import { getTranscript } from "@/server/services/transcription";

type RouteParams = { params: Promise<{ meetingId: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await withAuth(request);
    const { meetingId } = await params;

    const meeting = await db.meeting.findUnique({
      where: { id: meetingId },
      select: {
        id: true,
        title: true,
        aiSummary: true,
        aiSummaryFormat: true,
      },
    });

    if (!meeting) {
      return error(errors.NOT_FOUND, "Meeting not found", 404);
    }

    if (!meeting.aiSummary) {
      return success(null);
    }

    try {
      return success(JSON.parse(meeting.aiSummary));
    } catch {
      return success({ raw: meeting.aiSummary });
    }
  } catch (err) {
    if (err && typeof err === "object" && "status" in err) throw err;
    console.error("[API] Get summary error:", err);
    return error(errors.INTERNAL_ERROR, "Internal server error", 500);
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await withAuth(request);
    const { meetingId } = await params;

    if (!isAIConfigured()) {
      return error(errors.AI_NOT_CONFIGURED, "AI service is not configured", 503);
    }

    const meeting = await db.meeting.findUnique({
      where: { id: meetingId },
    });

    if (!meeting) {
      return error(errors.NOT_FOUND, "Meeting not found", 404);
    }

    if (meeting.hostId !== user.id) {
      return error(errors.FORBIDDEN, "Only the host can generate summaries", 403);
    }

    const transcript = await getTranscript(meetingId);
    if (!transcript) {
      return error(errors.NO_TRANSCRIPT, "No transcript available for this meeting", 400);
    }

    const summary = await generateMeetingSummary(transcript, meeting.title);

    await db.meeting.update({
      where: { id: meetingId },
      data: {
        aiSummary: JSON.stringify(summary),
        aiSummaryFormat: "json",
      },
    });

    return success(summary);
  } catch (err) {
    if (err && typeof err === "object" && "status" in err) throw err;
    console.error("[API] Generate summary error:", err);
    return error(errors.INTERNAL_ERROR, "Internal server error", 500);
  }
}
