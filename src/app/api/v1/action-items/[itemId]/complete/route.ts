import { NextRequest } from "next/server";
import { db } from "@/server/db";
import { withAuth } from "../../../_lib/middleware";
import { success, error } from "../../../_lib/response";
import * as errors from "../../../_lib/errors";

type RouteParams = { params: Promise<{ itemId: string }> };

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    await withAuth(request);
    const { itemId } = await params;

    const existing = await db.actionItem.findUnique({
      where: { id: itemId },
    });

    if (!existing) {
      return error(errors.NOT_FOUND, "Action item not found", 404);
    }

    const actionItem = await db.actionItem.update({
      where: { id: itemId },
      data: { status: "COMPLETED" },
    });

    return success(actionItem);
  } catch (err) {
    if (err && typeof err === "object" && "status" in err) throw err;
    console.error("[API] Complete action item error:", err);
    return error(errors.INTERNAL_ERROR, "Internal server error", 500);
  }
}
