import { NextRequest } from "next/server";
import { db } from "@/server/db";
import { withAuth } from "../../../../_lib/middleware";
import { success, error } from "../../../../_lib/response";
import * as errors from "../../../../_lib/errors";

type RouteParams = { params: Promise<{ meetingId: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await withAuth(request);
    const { meetingId } = await params;

    const q = request.nextUrl.searchParams.get("q");
    if (!q || q.length < 1) {
      return error(errors.VALIDATION_ERROR, "Search query 'q' is required", 400);
    }

    const meeting = await db.meeting.findUnique({
      where: { id: meetingId },
      select: { id: true },
    });

    if (!meeting) {
      return error(errors.NOT_FOUND, "Meeting not found", 404);
    }

    const segments = await db.transcriptSegment.findMany({
      where: {
        meetingId,
        content: { contains: q },
      },
      select: {
        id: true,
        speakerName: true,
        content: true,
        startTime: true,
        endTime: true,
      },
      orderBy: { startTime: "asc" },
      take: 50,
    });

    return success({
      query: q,
      results: segments,
      count: segments.length,
    });
  } catch (err) {
    if (err && typeof err === "object" && "status" in err) throw err;
    console.error("[API] Search transcript error:", err);
    return error(errors.INTERNAL_ERROR, "Internal server error", 500);
  }
}
