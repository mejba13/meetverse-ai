import { NextRequest } from "next/server";
import { encode } from "next-auth/jwt";
import crypto from "crypto";
import { db } from "@/server/db";
import { verifyPassword } from "@/server/auth";
import { success, error } from "../../_lib/response";
import * as errors from "../../_lib/errors";
import { loginSchema } from "../../_lib/validation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      const fields: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path.join(".");
        fields[key] = fields[key] || [];
        fields[key].push(issue.message);
      }
      return error(errors.VALIDATION_ERROR, "Invalid request body", 400, fields);
    }

    const { email, password } = parsed.data;

    const user = await db.user.findUnique({
      where: { email },
      include: {
        organization: {
          select: { id: true, name: true, slug: true, logoUrl: true },
        },
      },
    });

    if (!user || !user.passwordHash) {
      return error(errors.INVALID_CREDENTIALS, "Invalid email or password", 401);
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return error(errors.INVALID_CREDENTIALS, "Invalid email or password", 401);
    }

    const secret = process.env.AUTH_SECRET;
    if (!secret) {
      return error(errors.INTERNAL_ERROR, "Server configuration error", 500);
    }

    // Generate access token (15 min)
    const accessToken = await encode({
      token: { id: user.id, email: user.email, role: user.role },
      secret,
      salt: "",
      maxAge: 15 * 60,
    });

    // Generate refresh token (30 days)
    const refreshTokenValue = crypto.randomBytes(48).toString("hex");
    await db.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshTokenValue,
        userAgent: request.headers.get("user-agent") || null,
        ipAddress: request.headers.get("x-forwarded-for") || null,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    return success({
      accessToken,
      refreshToken: refreshTokenValue,
      expiresIn: 900,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        role: user.role,
        subscriptionTier: user.subscriptionTier,
        organization: user.organization,
      },
    });
  } catch (err) {
    console.error("[API] Login error:", err);
    return error(errors.INTERNAL_ERROR, "Internal server error", 500);
  }
}
