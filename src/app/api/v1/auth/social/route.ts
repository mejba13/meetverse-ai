import { NextRequest } from "next/server";
import { encode } from "next-auth/jwt";
import crypto from "crypto";
import { db } from "@/server/db";
import { success, error } from "../../_lib/response";
import * as errors from "../../_lib/errors";
import { socialAuthSchema } from "../../_lib/validation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = socialAuthSchema.safeParse(body);

    if (!parsed.success) {
      const fields: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path.join(".");
        fields[key] = fields[key] || [];
        fields[key].push(issue.message);
      }
      return error(errors.VALIDATION_ERROR, "Invalid request body", 400, fields);
    }

    const { provider, accessToken: providerToken } = parsed.data;

    // Look up the user by their OAuth account link
    const account = await db.account.findFirst({
      where: {
        provider,
        access_token: providerToken,
      },
      include: {
        user: {
          include: {
            organization: {
              select: { id: true, name: true, slug: true, logoUrl: true },
            },
          },
        },
      },
    });

    if (!account) {
      return error(
        errors.INVALID_CREDENTIALS,
        "No account linked to this provider token. Please sign in via the web app first.",
        401
      );
    }

    const user = account.user;
    const secret = process.env.AUTH_SECRET;
    if (!secret) {
      return error(errors.INTERNAL_ERROR, "Server configuration error", 500);
    }

    // Generate access token (15 min)
    const jwtToken = await encode({
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
      accessToken: jwtToken,
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
    console.error("[API] Social auth error:", err);
    return error(errors.INTERNAL_ERROR, "Internal server error", 500);
  }
}
