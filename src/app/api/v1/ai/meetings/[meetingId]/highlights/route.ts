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

    const meeting = await db.meeting.findUnique({
      where: { id: meetingId },
      select: { id: true },
    });

    if (!meeting) {
      return error(errors.NOT_FOUND, "Meeting not found", 404);
    }

    const highlights = await db.meetingHighlight.findMany({
      where: { meetingId },
      orderBy: { timestamp: "asc" },
    });

    return success(highlights);
  } catch (err) {
    if (err && typeof err === "object" && "status" in err) throw err;
    console.error("[API] Get highlights error:", err);
    return error(errors.INTERNAL_ERROR, "Internal server error", 500);
  }
}
