import { NextRequest } from "next/server";
import { db } from "@/server/db";
import { withAuth } from "../../_lib/middleware";
import { success, error } from "../../_lib/response";
import * as errors from "../../_lib/errors";

export async function GET(request: NextRequest) {
  try {
    const user = await withAuth(request);

    const meetings = await db.meeting.findMany({
      where: {
        OR: [
          { hostId: user.id },
          { participants: { some: { userId: user.id } } },
        ],
        status: { in: ["SCHEDULED", "LIVE"] },
        deletedAt: null,
      },
      include: {
        host: {
          select: { id: true, name: true, image: true },
        },
        _count: {
          select: { participants: true },
        },
      },
      orderBy: [
        { status: "asc" },
        { scheduledStart: "asc" },
      ],
      take: 5,
    });

    const data = meetings.map((m) => ({
      ...m,
      settings: JSON.parse(m.settings),
    }));

    return success(data);
  } catch (err) {
    if (err && typeof err === "object" && "status" in err) throw err;
    console.error("[API] Upcoming meetings error:", err);
    return error(errors.INTERNAL_ERROR, "Internal server error", 500);
  }
}
