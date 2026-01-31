/**
 * LiveKit Token Generation API
 *
 * Generates access tokens for joining LiveKit rooms.
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { generateRoomToken, isLiveKitConfigured } from "@/server/services/livekit";

const tokenRequestSchema = z.object({
  roomId: z.string(),
  displayName: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    // Check if LiveKit is configured
    if (!isLiveKitConfigured()) {
      return NextResponse.json(
        {
          error: {
            code: "NOT_CONFIGURED",
            message: "LiveKit is not configured. Please set LIVEKIT_API_KEY, LIVEKIT_API_SECRET, and NEXT_PUBLIC_LIVEKIT_URL.",
          },
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const parsed = tokenRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid request body",
            details: parsed.error.flatten().fieldErrors,
          },
        },
        { status: 400 }
      );
    }

    const { roomId, displayName } = parsed.data;

    // Get the meeting
    const meeting = await db.meeting.findUnique({
      where: { roomId },
      include: {
        host: {
          select: { id: true },
        },
      },
    });

    if (!meeting) {
      return NextResponse.json(
        {
          error: {
            code: "NOT_FOUND",
            message: "Meeting not found",
          },
        },
        { status: 404 }
      );
    }

    // Check if meeting is cancelled
    if (meeting.status === "CANCELLED") {
      return NextResponse.json(
        {
          error: {
            code: "MEETING_CANCELLED",
            message: "This meeting has been cancelled",
          },
        },
        { status: 400 }
      );
    }

    // Get session for authenticated users
    const session = await auth();
    const isAuthenticated = !!session?.user;
    const isHost = session?.user?.id === meeting.hostId;

    // Determine participant info
    let participantId: string;
    let participantName: string;

    if (isAuthenticated) {
      participantId = session.user.id;
      participantName = session.user.name || session.user.email || "Participant";
    } else {
      // Guest participant
      participantId = `guest_${crypto.randomUUID().slice(0, 8)}`;
      participantName = displayName || "Guest";
    }

    // Generate token
    const token = await generateRoomToken({
      roomId,
      participantId,
      participantName,
      isHost,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    // Record participant if authenticated
    if (isAuthenticated) {
      await db.meetingParticipant.upsert({
        where: {
          meetingId_userId: {
            meetingId: meeting.id,
            userId: session.user.id,
          },
        },
        create: {
          meetingId: meeting.id,
          userId: session.user.id,
          role: isHost ? "HOST" : "PARTICIPANT",
        },
        update: {
          leftAt: null, // Reset if rejoining
        },
      });
    }

    return NextResponse.json({
      token,
      serverUrl: process.env.NEXT_PUBLIC_LIVEKIT_URL,
      roomName: roomId,
      participantId,
      participantName,
      isHost,
    });
  } catch (error) {
    console.error("[LiveKit Token] Error:", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to generate room token",
        },
      },
      { status: 500 }
    );
  }
}
