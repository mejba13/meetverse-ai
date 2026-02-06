import { NextRequest } from "next/server";
import { db } from "@/server/db";
import { withAuth } from "../../../_lib/middleware";
import { success, error } from "../../../_lib/response";
import * as errors from "../../../_lib/errors";

type RouteParams = { params: Promise<{ meetingId: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await withAuth(request);
    const { meetingId } = await params;

    const meeting = await db.meeting.findUnique({
      where: { id: meetingId },
      include: {
        participants: {
          where: { userId: user.id },
          take: 1,
        },
      },
    });

    if (!meeting) {
      return error(errors.NOT_FOUND, "Meeting not found", 404);
    }

    const isHost = meeting.hostId === user.id;
    const isParticipant = meeting.participants.length > 0;

    if (!isHost && !isParticipant) {
      return error(errors.FORBIDDEN, "You do not have access to this meeting", 403);
    }

    if (!meeting.recordingUrl) {
      return error(errors.NOT_FOUND, "No recording available for this meeting", 404);
    }

    return success({
      recordingUrl: meeting.recordingUrl,
      meetingId: meeting.id,
      title: meeting.title,
    });
  } catch (err) {
    if (err && typeof err === "object" && "status" in err) throw err;
    console.error("[API] Get recording error:", err);
    return error(errors.INTERNAL_ERROR, "Internal server error", 500);
  }
}
