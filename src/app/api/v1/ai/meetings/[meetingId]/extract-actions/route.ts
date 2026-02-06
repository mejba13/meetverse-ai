import { NextRequest } from "next/server";
import { db } from "@/server/db";
import { withAuth } from "../../../../_lib/middleware";
import { success, error } from "../../../../_lib/response";
import * as errors from "../../../../_lib/errors";
import {
  extractActionItems,
  isAIConfigured,
} from "@/server/services/ai";
import { getTranscript } from "@/server/services/transcription";

type RouteParams = { params: Promise<{ meetingId: string }> };

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
      return error(errors.FORBIDDEN, "Only the host can extract action items", 403);
    }

    const transcript = await getTranscript(meetingId);
    if (!transcript) {
      return error(errors.NO_TRANSCRIPT, "No transcript available for this meeting", 400);
    }

    const actionItems = await extractActionItems(transcript);

    // Save action items to database
    const createdItems = [];
    for (const item of actionItems) {
      const created = await db.actionItem.create({
        data: {
          meetingId,
          title: item.title,
          description: item.description,
          priority: item.priority,
          status: "PENDING",
          assigneeId: meeting.hostId,
          dueDate: item.dueDate ? new Date(item.dueDate) : null,
          aiGenerated: true,
        },
      });
      createdItems.push(created);
    }

    return success({
      count: createdItems.length,
      items: createdItems,
    });
  } catch (err) {
    if (err && typeof err === "object" && "status" in err) throw err;
    console.error("[API] Extract actions error:", err);
    return error(errors.INTERNAL_ERROR, "Internal server error", 500);
  }
}
