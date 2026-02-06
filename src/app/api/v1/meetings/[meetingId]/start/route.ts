import { NextRequest } from "next/server";
import { db } from "@/server/db";
import { withAuth } from "../../../_lib/middleware";
import { success, error } from "../../../_lib/response";
import * as errors from "../../../_lib/errors";

type RouteParams = { params: Promise<{ meetingId: string }> };

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await withAuth(request);
    const { meetingId } = await params;

    const meeting = await db.meeting.findUnique({
      where: { id: meetingId },
    });

    if (!meeting) {
      return error(errors.NOT_FOUND, "Meeting not found", 404);
    }

    if (meeting.hostId !== user.id) {
      return error(errors.FORBIDDEN, "Only the host can start this meeting", 403);
    }

    if (meeting.status === "LIVE") {
      return success(meeting);
    }

    if (meeting.status !== "SCHEDULED") {
      return error(
        errors.MEETING_ENDED,
        "Only scheduled meetings can be started",
        400
      );
    }

    const updated = await db.meeting.update({
      where: { id: meetingId },
      data: {
        status: "LIVE",
        actualStart: new Date(),
      },
    });

    return success(updated);
  } catch (err) {
    if (err && typeof err === "object" && "status" in err) throw err;
    console.error("[API] Start meeting error:", err);
    return error(errors.INTERNAL_ERROR, "Internal server error", 500);
  }
}
