import { NextRequest } from "next/server";
import { db } from "@/server/db";
import { withAuth } from "../_lib/middleware";
import { success, error } from "../_lib/response";
import * as errors from "../_lib/errors";

export async function GET(request: NextRequest) {
  try {
    const user = await withAuth(request);

    if (!user.organizationId) {
      return success(null);
    }

    const org = await db.organization.findUnique({
      where: { id: user.organizationId },
      include: {
        _count: {
          select: { users: true, meetings: true },
        },
      },
    });

    if (!org) {
      return error(errors.NOT_FOUND, "Organization not found", 404);
    }

    return success({
      ...org,
      settings: JSON.parse(org.settings),
    });
  } catch (err) {
    if (err && typeof err === "object" && "status" in err) throw err;
    console.error("[API] Get organization error:", err);
    return error(errors.INTERNAL_ERROR, "Internal server error", 500);
  }
}
