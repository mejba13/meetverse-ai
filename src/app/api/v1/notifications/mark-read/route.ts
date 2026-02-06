import { NextRequest } from "next/server";
import { withAuth } from "../../_lib/middleware";
import { success, error } from "../../_lib/response";
import * as errors from "../../_lib/errors";
import { markReadSchema } from "../../_lib/validation";
import { markAsRead } from "@/server/services/notifications";

export async function POST(request: NextRequest) {
  try {
    const user = await withAuth(request);

    const body = await request.json();
    const parsed = markReadSchema.safeParse(body);

    if (!parsed.success) {
      return error(errors.VALIDATION_ERROR, "Invalid request body", 400);
    }

    const { ids, all } = parsed.data;

    if (!ids && !all) {
      return error(
        errors.VALIDATION_ERROR,
        "Either 'ids' or 'all: true' must be provided",
        400
      );
    }

    const result = await markAsRead(user.id, { ids, all: all || false });

    return success({ marked: result });
  } catch (err) {
    if (err && typeof err === "object" && "status" in err) throw err;
    console.error("[API] Mark read error:", err);
    return error(errors.INTERNAL_ERROR, "Internal server error", 500);
  }
}
