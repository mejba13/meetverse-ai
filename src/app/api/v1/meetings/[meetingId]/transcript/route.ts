import { NextRequest } from "next/server";
import { db } from "@/server/db";
import { withAuth } from "../../../_lib/middleware";
import { paginated, error } from "../../../_lib/response";
import * as errors from "../../../_lib/errors";
import { parsePagination } from "../../../_lib/pagination";

type RouteParams = { params: Promise<{ meetingId: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await withAuth(request);
    const { meetingId } = await params;
    const { page, limit, skip, take } = parsePagination(request, {
      limit: 50,
    });

    // Verify access
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

    const [segments, total] = await Promise.all([
      db.transcriptSegment.findMany({
        where: { meetingId },
        select: {
          id: true,
          speakerName: true,
          content: true,
          startTime: true,
          endTime: true,
          confidence: true,
          language: true,
        },
        orderBy: { startTime: "asc" },
        skip,
        take,
      }),
      db.transcriptSegment.count({ where: { meetingId } }),
    ]);

    return paginated(segments, { page, limit, total });
  } catch (err) {
    if (err && typeof err === "object" && "status" in err) throw err;
    console.error("[API] Get transcript error:", err);
    return error(errors.INTERNAL_ERROR, "Internal server error", 500);
  }
}
