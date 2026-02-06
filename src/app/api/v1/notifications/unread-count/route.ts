import { NextRequest } from "next/server";
import { withAuth } from "../../_lib/middleware";
import { success, error } from "../../_lib/response";
import * as errors from "../../_lib/errors";
import { getUnreadCount } from "@/server/services/notifications";

export async function GET(request: NextRequest) {
  try {
    const user = await withAuth(request);

    const count = await getUnreadCount(user.id);

    return success({ count });
  } catch (err) {
    if (err && typeof err === "object" && "status" in err) throw err;
    console.error("[API] Unread count error:", err);
    return error(errors.INTERNAL_ERROR, "Internal server error", 500);
  }
}
