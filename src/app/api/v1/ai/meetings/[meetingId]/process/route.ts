import { NextRequest } from "next/server";
import { db } from "@/server/db";
import { withAuth } from "../../../../_lib/middleware";
import { success, error } from "../../../../_lib/response";
import * as errors from "../../../../_lib/errors";
import { processMeetingSchema } from "../../../../_lib/validation";
import { queueMeetingForProcessing } from "@/server/services/post-meeting-processor";

type RouteParams = { params: Promise<{ meetingId: string }> };

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await withAuth(request);
    const { meetingId } = await params;

    let audioUrl: string | undefined;
    let notifyParticipants = false;
    try {
      const body = await request.json();
      const parsed = processMeetingSchema.safeParse(body);
      if (parsed.success) {
        audioUrl = parsed.data.audioUrl;
        notifyParticipants = parsed.data.notifyParticipants;
      }
    } catch {
      // Empty body is fine
    }

    const meeting = await db.meeting.findUnique({
      where: { id: meetingId },
    });

    if (!meeting) {
      return error(errors.NOT_FOUND, "Meeting not found", 404);
    }

    if (meeting.hostId !== user.id) {
      return error(errors.FORBIDDEN, "Only the host can trigger processing", 403);
    }

    const result = await queueMeetingForProcessing(meetingId, {
      audioUrl,
      notifyParticipants,
    });

    return success(result);
  } catch (err) {
    if (err && typeof err === "object" && "status" in err) throw err;
    console.error("[API] Process meeting error:", err);
    return error(errors.INTERNAL_ERROR, "Internal server error", 500);
  }
}
