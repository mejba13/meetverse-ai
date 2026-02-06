import { NextRequest } from "next/server";
import { db } from "@/server/db";
import { withAuth } from "../_lib/middleware";
import { success, error } from "../_lib/response";
import * as errors from "../_lib/errors";

export async function GET(request: NextRequest) {
  try {
    const user = await withAuth(request);

    const q = request.nextUrl.searchParams.get("q");
    const type = request.nextUrl.searchParams.get("type") || "all";

    if (!q || q.length < 1) {
      return error(errors.VALIDATION_ERROR, "Search query 'q' is required", 400);
    }

    const results: {
      meetings: unknown[];
      transcripts: unknown[];
      actionItems: unknown[];
    } = {
      meetings: [],
      transcripts: [],
      actionItems: [],
    };

    // Search meetings
    if (type === "all" || type === "meetings") {
      results.meetings = await db.meeting.findMany({
        where: {
          OR: [
            { title: { contains: q } },
            { description: { contains: q } },
          ],
          AND: {
            OR: [
              { hostId: user.id },
              { participants: { some: { userId: user.id } } },
            ],
          },
          deletedAt: null,
        },
        select: {
          id: true,
          roomId: true,
          title: true,
          description: true,
          status: true,
          scheduledStart: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      });
    }

    // Search transcripts
    if (type === "all" || type === "transcripts") {
      results.transcripts = await db.transcriptSegment.findMany({
        where: {
          content: { contains: q },
          meeting: {
            OR: [
              { hostId: user.id },
              { participants: { some: { userId: user.id } } },
            ],
          },
        },
        select: {
          id: true,
          content: true,
          speakerName: true,
          startTime: true,
          meeting: {
            select: { id: true, title: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      });
    }

    // Search action items
    if (type === "all" || type === "action_items") {
      results.actionItems = await db.actionItem.findMany({
        where: {
          OR: [
            { title: { contains: q } },
            { description: { contains: q } },
          ],
          AND: {
            OR: [
              { assigneeId: user.id },
              { meeting: { hostId: user.id } },
            ],
          },
        },
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          priority: true,
          meeting: {
            select: { id: true, title: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      });
    }

    return success({
      query: q,
      type,
      results,
      counts: {
        meetings: results.meetings.length,
        transcripts: results.transcripts.length,
        actionItems: results.actionItems.length,
      },
    });
  } catch (err) {
    if (err && typeof err === "object" && "status" in err) throw err;
    console.error("[API] Search error:", err);
    return error(errors.INTERNAL_ERROR, "Internal server error", 500);
  }
}
