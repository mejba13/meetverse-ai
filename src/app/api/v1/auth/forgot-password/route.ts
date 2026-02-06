import { NextRequest } from "next/server";
import crypto from "crypto";
import { db } from "@/server/db";
import { success, error } from "../../_lib/response";
import * as errors from "../../_lib/errors";
import { forgotPasswordSchema } from "../../_lib/validation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = forgotPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return error(errors.VALIDATION_ERROR, "Invalid request body", 400);
    }

    const { email } = parsed.data;

    // Always return success to prevent email enumeration
    const user = await db.user.findUnique({ where: { email } });

    if (user) {
      // Generate reset token and store it
      const token = crypto.randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await db.verificationToken.create({
        data: {
          identifier: email,
          token,
          expires,
        },
      });

      // TODO: Send password reset email via email service
      console.log(`[API] Password reset token for ${email}: ${token}`);
    }

    return success({
      message: "If an account with that email exists, a password reset link has been sent.",
    });
  } catch (err) {
    console.error("[API] Forgot password error:", err);
    return error(errors.INTERNAL_ERROR, "Internal server error", 500);
  }
}
