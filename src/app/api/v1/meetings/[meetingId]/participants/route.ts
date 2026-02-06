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
      select: { id: true, hostId: true },
    });

    if (!meeting) {
      return error(errors.NOT_FOUND, "Meeting not found", 404);
    }

    const participants = await db.meetingParticipant.findMany({
      where: { meetingId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: { joinedAt: "asc" },
    });

    const data = participants.map((p) => ({
      id: p.id,
      userId: p.userId,
      guestName: p.guestName,
      guestEmail: p.guestEmail,
      role: p.role,
      joinedAt: p.joinedAt,
      leftAt: p.leftAt,
      user: p.user,
      isHost: p.userId === meeting.hostId,
      isOnline: !p.leftAt,
    }));

    return success(data);
  } catch (err) {
    if (err && typeof err === "object" && "status" in err) throw err;
    console.error("[API] Get participants error:", err);
    return error(errors.INTERNAL_ERROR, "Internal server error", 500);
  }
}
