import { NextRequest } from "next/server";
import { db } from "@/server/db";
import { withAuth } from "../../_lib/middleware";
import { success, error } from "../../_lib/response";
import * as errors from "../../_lib/errors";
import { updateOrgSettingsSchema } from "../../_lib/validation";

export async function GET(request: NextRequest) {
  try {
    const user = await withAuth(request);

    if (!user.organizationId) {
      return error(errors.NOT_FOUND, "You are not part of an organization", 404);
    }

    if (user.role !== "ADMIN" && user.role !== "OWNER") {
      return error(errors.FORBIDDEN, "Only admins can view organization settings", 403);
    }

    const org = await db.organization.findUnique({
      where: { id: user.organizationId },
    });

    if (!org) {
      return error(errors.NOT_FOUND, "Organization not found", 404);
    }

    return success({
      id: org.id,
      name: org.name,
      slug: org.slug,
      logoUrl: org.logoUrl,
      settings: JSON.parse(org.settings),
    });
  } catch (err) {
    if (err && typeof err === "object" && "status" in err) throw err;
    console.error("[API] Get org settings error:", err);
    return error(errors.INTERNAL_ERROR, "Internal server error", 500);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await withAuth(request);

    if (!user.organizationId) {
      return error(errors.NOT_FOUND, "You are not part of an organization", 404);
    }

    if (user.role !== "ADMIN" && user.role !== "OWNER") {
      return error(errors.FORBIDDEN, "Only admins can update organization settings", 403);
    }

    const body = await request.json();
    const parsed = updateOrgSettingsSchema.safeParse(body);

    if (!parsed.success) {
      const fields: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path.join(".");
        fields[key] = fields[key] || [];
        fields[key].push(issue.message);
      }
      return error(errors.VALIDATION_ERROR, "Invalid request body", 400, fields);
    }

    const org = await db.organization.findUnique({
      where: { id: user.organizationId },
    });

    if (!org) {
      return error(errors.NOT_FOUND, "Organization not found", 404);
    }

    const input = parsed.data;
    const currentSettings = JSON.parse(org.settings);

    const updated = await db.organization.update({
      where: { id: user.organizationId },
      data: {
        ...(input.name && { name: input.name }),
        ...(input.settings && {
          settings: JSON.stringify({ ...currentSettings, ...input.settings }),
        }),
      },
    });

    return success({
      id: updated.id,
      name: updated.name,
      slug: updated.slug,
      logoUrl: updated.logoUrl,
      settings: JSON.parse(updated.settings),
    });
  } catch (err) {
    if (err && typeof err === "object" && "status" in err) throw err;
    console.error("[API] Update org settings error:", err);
    return error(errors.INTERNAL_ERROR, "Internal server error", 500);
  }
}
