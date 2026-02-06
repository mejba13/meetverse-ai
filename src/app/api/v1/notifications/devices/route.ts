import { NextRequest } from "next/server";
import { withAuth } from "../../_lib/middleware";
import { success, created, error } from "../../_lib/response";
import * as errors from "../../_lib/errors";
import { registerDeviceSchema, unregisterDeviceSchema } from "../../_lib/validation";
import {
  registerDevice,
  unregisterDevice,
} from "@/server/services/notifications";

export async function POST(request: NextRequest) {
  try {
    const user = await withAuth(request);

    const body = await request.json();
    const parsed = registerDeviceSchema.safeParse(body);

    if (!parsed.success) {
      const fields: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path.join(".");
        fields[key] = fields[key] || [];
        fields[key].push(issue.message);
      }
      return error(errors.VALIDATION_ERROR, "Invalid request body", 400, fields);
    }

    const device = await registerDevice(user.id, parsed.data);

    return created(device);
  } catch (err) {
    if (err && typeof err === "object" && "status" in err) throw err;
    console.error("[API] Register device error:", err);
    return error(errors.INTERNAL_ERROR, "Internal server error", 500);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await withAuth(request);

    const body = await request.json();
    const parsed = unregisterDeviceSchema.safeParse(body);

    if (!parsed.success) {
      return error(errors.VALIDATION_ERROR, "Invalid request body", 400);
    }

    await unregisterDevice(user.id, parsed.data.token);

    return success({ message: "Device unregistered" });
  } catch (err) {
    if (err && typeof err === "object" && "status" in err) throw err;
    console.error("[API] Unregister device error:", err);
    return error(errors.INTERNAL_ERROR, "Internal server error", 500);
  }
}
