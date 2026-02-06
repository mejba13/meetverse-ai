import { NextRequest } from "next/server";
import { db } from "@/server/db";
import { withAuth } from "../../_lib/middleware";
import { success, error } from "../../_lib/response";
import * as errors from "../../_lib/errors";
import { updateMeetingSchema } from "../../_lib/validation";

type RouteParams = { params: Promise<{ meetingId: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await withAuth(request);
    const { meetingId } = await params;

    const meeting = await db.meeting.findUnique({
      where: { id: meetingId },
      include: {
        host: {
          select: { id: true, name: true, email: true, image: true },
        },
        participants: {
          include: {
            user: {
              select: { id: true, name: true, image: true },
            },
          },
        },
        _count: {
          select: { actionItems: true, transcripts: true },
        },
      },
    });

    if (!meeting) {
      return error(errors.NOT_FOUND, "Meeting not found", 404);
    }

    // Check access: host, participant, or org member
    const isHost = meeting.hostId === user.id;
    const isParticipant = meeting.participants.some(
      (p) => p.userId === user.id
    );

    if (!isHost && !isParticipant) {
      return error(errors.FORBIDDEN, "You do not have access to this meeting", 403);
    }

    return success({
      ...meeting,
      settings: JSON.parse(meeting.settings),
    });
  } catch (err) {
    if (err && typeof err === "object" && "status" in err) throw err;
    console.error("[API] Get meeting error:", err);
    return error(errors.INTERNAL_ERROR, "Internal server error", 500);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await withAuth(request);
    const { meetingId } = await params;

    const body = await request.json();
    const parsed = updateMeetingSchema.safeParse(body);

    if (!parsed.success) {
      const fields: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path.join(".");
        fields[key] = fields[key] || [];
        fields[key].push(issue.message);
      }
      return error(errors.VALIDATION_ERROR, "Invalid request body", 400, fields);
    }

    const existing = await db.meeting.findUnique({
      where: { id: meetingId },
    });

    if (!existing) {
      return error(errors.NOT_FOUND, "Meeting not found", 404);
    }

    if (existing.hostId !== user.id) {
      return error(errors.FORBIDDEN, "Only the host can update this meeting", 403);
    }

    const input = parsed.data;
    const meeting = await db.meeting.update({
      where: { id: meetingId },
      data: {
        title: input.title,
        description: input.description,
        scheduledStart: input.scheduledStart
          ? new Date(input.scheduledStart)
          : undefined,
        scheduledEnd: input.scheduledEnd
          ? new Date(input.scheduledEnd)
          : undefined,
        settings: input.settings
          ? JSON.stringify({
              ...JSON.parse(existing.settings),
              ...input.settings,
            })
          : undefined,
      },
    });

    return success({
      ...meeting,
      settings: JSON.parse(meeting.settings),
    });
  } catch (err) {
    if (err && typeof err === "object" && "status" in err) throw err;
    console.error("[API] Update meeting error:", err);
    return error(errors.INTERNAL_ERROR, "Internal server error", 500);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
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
      return error(errors.FORBIDDEN, "Only the host can delete this meeting", 403);
    }

    await db.meeting.update({
      where: { id: meetingId },
      data: {
        deletedAt: new Date(),
        status: "CANCELLED",
      },
    });

    return success({ message: "Meeting deleted" });
  } catch (err) {
    if (err && typeof err === "object" && "status" in err) throw err;
    console.error("[API] Delete meeting error:", err);
    return error(errors.INTERNAL_ERROR, "Internal server error", 500);
  }
}
