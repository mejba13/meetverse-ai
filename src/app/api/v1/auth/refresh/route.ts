import { NextRequest } from "next/server";
import { encode } from "next-auth/jwt";
import crypto from "crypto";
import { db } from "@/server/db";
import { success, error } from "../../_lib/response";
import * as errors from "../../_lib/errors";
import { refreshTokenSchema } from "../../_lib/validation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = refreshTokenSchema.safeParse(body);

    if (!parsed.success) {
      return error(errors.VALIDATION_ERROR, "Invalid request body", 400);
    }

    const { refreshToken } = parsed.data;

    // Find the refresh token
    const storedToken = await db.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken) {
      return error(errors.TOKEN_INVALID, "Invalid refresh token", 401);
    }

    if (storedToken.revokedAt) {
      return error(errors.TOKEN_INVALID, "Refresh token has been revoked", 401);
    }

    if (storedToken.expiresAt < new Date()) {
      return error(errors.TOKEN_EXPIRED, "Refresh token has expired", 401);
    }

    const secret = process.env.AUTH_SECRET;
    if (!secret) {
      return error(errors.INTERNAL_ERROR, "Server configuration error", 500);
    }

    // Rotate: revoke old token
    await db.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    });

    // Issue new access token (15 min)
    const accessToken = await encode({
      token: {
        id: storedToken.user.id,
        email: storedToken.user.email,
        role: storedToken.user.role,
      },
      secret,
      salt: "",
      maxAge: 15 * 60,
    });

    // Issue new refresh token (30 days)
    const newRefreshTokenValue = crypto.randomBytes(48).toString("hex");
    await db.refreshToken.create({
      data: {
        userId: storedToken.userId,
        token: newRefreshTokenValue,
        deviceId: storedToken.deviceId,
        userAgent: request.headers.get("user-agent") || storedToken.userAgent,
        ipAddress: request.headers.get("x-forwarded-for") || storedToken.ipAddress,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    return success({
      accessToken,
      refreshToken: newRefreshTokenValue,
      expiresIn: 900,
    });
  } catch (err) {
    console.error("[API] Refresh token error:", err);
    return error(errors.INTERNAL_ERROR, "Internal server error", 500);
  }
}
