import { NextRequest } from "next/server";
import { db } from "@/server/db";
import { withAuth } from "../../_lib/middleware";
import { success, error } from "../../_lib/response";
import * as errors from "../../_lib/errors";
import { updateProfileSchema } from "../../_lib/validation";

export async function GET(request: NextRequest) {
  try {
    const authUser = await withAuth(request);

    const user = await db.user.findUnique({
      where: { id: authUser.id },
      include: {
        organization: {
          select: { id: true, name: true, slug: true, logoUrl: true },
        },
      },
    });

    if (!user) {
      return error(errors.NOT_FOUND, "User not found", 404);
    }

    return success({
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      subscriptionTier: user.subscriptionTier,
      role: user.role,
      organization: user.organization,
      preferences: JSON.parse(user.preferences),
      createdAt: user.createdAt,
    });
  } catch (err) {
    if (err && typeof err === "object" && "status" in err) throw err;
    console.error("[API] Get user error:", err);
    return error(errors.INTERNAL_ERROR, "Internal server error", 500);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authUser = await withAuth(request);

    const body = await request.json();
    const parsed = updateProfileSchema.safeParse(body);

    if (!parsed.success) {
      const fields: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path.join(".");
        fields[key] = fields[key] || [];
        fields[key].push(issue.message);
      }
      return error(errors.VALIDATION_ERROR, "Invalid request body", 400, fields);
    }

    const user = await db.user.update({
      where: { id: authUser.id },
      data: {
        name: parsed.data.name,
        image: parsed.data.image,
      },
    });

    return success({
      id: user.id,
      name: user.name,
      image: user.image,
    });
  } catch (err) {
    if (err && typeof err === "object" && "status" in err) throw err;
    console.error("[API] Update user error:", err);
    return error(errors.INTERNAL_ERROR, "Internal server error", 500);
  }
}
