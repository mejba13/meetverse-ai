import { NextRequest } from "next/server";
import { db } from "@/server/db";
import { optionalAuth } from "../../../_lib/middleware";
import { success, error } from "../../../_lib/response";
import * as errors from "../../../_lib/errors";
import {
  generateRoomToken,
  isLiveKitConfigured,
} from "@/server/services/livekit";

type RouteParams = { params: Promise<{ meetingId: string }> };

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { meetingId } = await params;
    const user = await optionalAuth(request);

    // Parse optional body for guest info
    let guestName: string | undefined;
    try {
      const body = await request.json();
      guestName = body?.guestName;
    } catch {
      // No body is fine
    }

    if (!user && !guestName) {
      return error(errors.UNAUTHORIZED, "Authentication or guest name required", 401);
    }

    const meeting = await db.meeting.findUnique({
      where: { id: meetingId },
      include: {
        _count: { select: { participants: true } },
      },
    });

    if (!meeting) {
      return error(errors.NOT_FOUND, "Meeting not found", 404);
    }

    if (meeting.status === "CANCELLED") {
      return error(errors.MEETING_CANCELLED, "This meeting has been cancelled", 410);
    }

    if (meeting.status === "ENDED") {
      return error(errors.MEETING_ENDED, "This meeting has ended", 410);
    }

    // Check capacity
    const settings = JSON.parse(meeting.settings);
    if (
      settings.maxParticipants &&
      meeting._count.participants >= settings.maxParticipants
    ) {
      return error(errors.MEETING_FULL, "This meeting is at capacity", 403);
    }

    const isHost = user ? meeting.hostId === user.id : false;
    const participantId = user?.id || `guest_${Date.now()}`;
    const participantName =
      (user?.name ?? guestName) || "Guest";

    // Upsert participant record
    if (user) {
      await db.meetingParticipant.upsert({
        where: {
          meetingId_userId: {
            meetingId: meeting.id,
            userId: user.id,
          },
        },
        create: {
          meetingId: meeting.id,
          userId: user.id,
          role: isHost ? "HOST" : "PARTICIPANT",
        },
        update: {
          leftAt: null,
        },
      });
    } else {
      await db.meetingParticipant.create({
        data: {
          meetingId: meeting.id,
          guestName,
          role: "GUEST",
        },
      });
    }

    // Generate LiveKit token if configured
    let token: string | null = null;
    let serverUrl: string | null = null;

    if (isLiveKitConfigured()) {
      token = await generateRoomToken({
        roomId: meeting.roomId,
        participantId,
        participantName,
        isHost,
      });
      serverUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || null;
    }

    return success({
      token,
      serverUrl,
      roomId: meeting.roomId,
      roomName: meeting.roomId,
      meetingId: meeting.id,
      meetingTitle: meeting.title,
      participantId,
      participantName,
      isHost,
    });
  } catch (err) {
    if (err && typeof err === "object" && "status" in err) throw err;
    console.error("[API] Join meeting error:", err);
    return error(errors.INTERNAL_ERROR, "Internal server error", 500);
  }
}
