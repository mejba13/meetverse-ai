import { NextRequest } from "next/server";
import { withAuth } from "../_lib/middleware";
import { paginated, error } from "../_lib/response";
import * as errors from "../_lib/errors";
import { parsePagination } from "../_lib/pagination";
import { getNotifications } from "@/server/services/notifications";

export async function GET(request: NextRequest) {
  try {
    const user = await withAuth(request);
    const { page, limit, skip, take } = parsePagination(request);

    const isReadParam = request.nextUrl.searchParams.get("isRead");
    const isRead =
      isReadParam === "true" ? true : isReadParam === "false" ? false : undefined;

    const { notifications, total } = await getNotifications(user.id, {
      isRead,
      skip,
      take,
    });

    const data = notifications.map((n) => ({
      ...n,
      metadata: JSON.parse(n.metadata),
    }));

    return paginated(data, { page, limit, total });
  } catch (err) {
    if (err && typeof err === "object" && "status" in err) throw err;
    console.error("[API] List notifications error:", err);
    return error(errors.INTERNAL_ERROR, "Internal server error", 500);
  }
}
