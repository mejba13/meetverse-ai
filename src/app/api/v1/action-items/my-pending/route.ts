import { NextRequest } from "next/server";
import { db } from "@/server/db";
import { withAuth } from "../../_lib/middleware";
import { success, error } from "../../_lib/response";
import * as errors from "../../_lib/errors";

export async function GET(request: NextRequest) {
  try {
    const user = await withAuth(request);

    const actionItems = await db.actionItem.findMany({
      where: {
        assigneeId: user.id,
        status: { in: ["PENDING", "IN_PROGRESS"] },
      },
      include: {
        meeting: {
          select: { id: true, title: true },
        },
      },
      orderBy: [{ priority: "desc" }, { dueDate: "asc" }],
      take: 20,
    });

    return success(actionItems);
  } catch (err) {
    if (err && typeof err === "object" && "status" in err) throw err;
    console.error("[API] My pending action items error:", err);
    return error(errors.INTERNAL_ERROR, "Internal server error", 500);
  }
}
