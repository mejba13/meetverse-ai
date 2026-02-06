import { NextRequest } from "next/server";
import { db } from "@/server/db";
import { success, error } from "../../../_lib/response";
import * as errors from "../../../_lib/errors";

type RouteParams = { params: Promise<{ roomId: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { roomId } = await params;

    const meeting = await db.meeting.findUnique({
      where: { roomId },
      include: {
        host: {
          select: { id: true, name: true, image: true },
        },
        _count: {
          select: { participants: true },
        },
      },
    });

    if (!meeting) {
      return error(errors.NOT_FOUND, "Meeting not found", 404);
    }

    return success({
      id: meeting.id,
      roomId: meeting.roomId,
      title: meeting.title,
      description: meeting.description,
      host: meeting.host,
      status: meeting.status,
      scheduledStart: meeting.scheduledStart,
      participantCount: meeting._count.participants,
      settings: JSON.parse(meeting.settings),
    });
  } catch (err) {
    console.error("[API] Get meeting by room ID error:", err);
    return error(errors.INTERNAL_ERROR, "Internal server error", 500);
  }
}
