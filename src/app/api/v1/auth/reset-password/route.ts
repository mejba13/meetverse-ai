import { NextRequest } from "next/server";
import { db } from "@/server/db";
import { hashPassword } from "@/server/auth";
import { success, error } from "../../_lib/response";
import * as errors from "../../_lib/errors";
import { resetPasswordSchema } from "../../_lib/validation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = resetPasswordSchema.safeParse(body);

    if (!parsed.success) {
      const fields: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path.join(".");
        fields[key] = fields[key] || [];
        fields[key].push(issue.message);
      }
      return error(errors.VALIDATION_ERROR, "Invalid request body", 400, fields);
    }

    const { token, password } = parsed.data;

    // Find the verification token
    const verificationToken = await db.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      return error(errors.TOKEN_INVALID, "Invalid or expired reset token", 400);
    }

    if (verificationToken.expires < new Date()) {
      // Clean up expired token
      await db.verificationToken.delete({
        where: { token },
      });
      return error(errors.TOKEN_EXPIRED, "Reset token has expired", 400);
    }

    // Find user by email
    const user = await db.user.findUnique({
      where: { email: verificationToken.identifier },
    });

    if (!user) {
      return error(errors.NOT_FOUND, "User not found", 404);
    }

    // Update password
    const passwordHash = await hashPassword(password);
    await db.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    // Delete the verification token
    await db.verificationToken.delete({
      where: { token },
    });

    // Revoke all existing refresh tokens for security
    await db.refreshToken.updateMany({
      where: { userId: user.id, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    return success({ message: "Password reset successfully" });
  } catch (err) {
    console.error("[API] Reset password error:", err);
    return error(errors.INTERNAL_ERROR, "Internal server error", 500);
  }
}
