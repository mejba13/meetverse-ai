import { NextRequest } from "next/server";
import { db } from "@/server/db";
import { withAuth } from "../../../_lib/middleware";
import { success, error } from "../../../_lib/response";
import * as errors from "../../../_lib/errors";

export async function GET(request: NextRequest) {
  try {
    const authUser = await withAuth(request);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [meetingsThisMonth, totalMeetings, pendingActionItems] =
      await Promise.all([
        db.meeting.count({
          where: {
            hostId: authUser.id,
            createdAt: { gte: startOfMonth },
          },
        }),
        db.meeting.count({
          where: { hostId: authUser.id },
        }),
        db.actionItem.count({
          where: {
            assigneeId: authUser.id,
            status: "PENDING",
          },
        }),
      ]);

    // Calculate total meeting duration this month
    const meetings = await db.meeting.findMany({
      where: {
        hostId: authUser.id,
        status: "ENDED",
        actualStart: { gte: startOfMonth },
        actualEnd: { not: null },
      },
      select: {
        actualStart: true,
        actualEnd: true,
      },
    });

    const totalDurationMs = meetings.reduce((acc, m) => {
      if (m.actualStart && m.actualEnd) {
        return acc + (m.actualEnd.getTime() - m.actualStart.getTime());
      }
      return acc;
    }, 0);

    return success({
      meetingsThisMonth,
      totalMeetings,
      pendingActionItems,
      meetingHoursThisMonth:
        Math.round((totalDurationMs / (1000 * 60 * 60)) * 10) / 10,
    });
  } catch (err) {
    if (err && typeof err === "object" && "status" in err) throw err;
    console.error("[API] Get stats error:", err);
    return error(errors.INTERNAL_ERROR, "Internal server error", 500);
  }
}
