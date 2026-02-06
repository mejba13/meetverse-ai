import { NextRequest } from "next/server";
import { db } from "@/server/db";
import { withAuth } from "../../_lib/middleware";
import { success, error } from "../../_lib/response";
import * as errors from "../../_lib/errors";
import { refreshTokenSchema } from "../../_lib/validation";

export async function POST(request: NextRequest) {
  try {
    const user = await withAuth(request);

    const body = await request.json();
    const parsed = refreshTokenSchema.safeParse(body);

    if (!parsed.success) {
      return error(errors.VALIDATION_ERROR, "Invalid request body", 400);
    }

    const { refreshToken } = parsed.data;

    // Revoke the refresh token if it belongs to this user
    await db.refreshToken.updateMany({
      where: {
        token: refreshToken,
        userId: user.id,
        revokedAt: null,
      },
      data: { revokedAt: new Date() },
    });

    return success({ message: "Logged out successfully" });
  } catch (err) {
    if (err && typeof err === "object" && "status" in err) throw err;
    console.error("[API] Logout error:", err);
    return error(errors.INTERNAL_ERROR, "Internal server error", 500);
  }
}
