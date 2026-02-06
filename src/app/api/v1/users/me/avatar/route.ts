import { NextRequest } from "next/server";
import { db } from "@/server/db";
import { withAuth } from "../../../_lib/middleware";
import { success, error } from "../../../_lib/response";
import * as errors from "../../../_lib/errors";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

export async function POST(request: NextRequest) {
  try {
    const authUser = await withAuth(request);

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return error(errors.VALIDATION_ERROR, "No file provided", 400);
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return error(
        errors.VALIDATION_ERROR,
        "Invalid file type. Allowed: JPEG, PNG, GIF, WebP",
        400
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return error(errors.VALIDATION_ERROR, "File size exceeds 2MB limit", 400);
    }

    // Convert to base64 data URL for storage
    // In production, this would upload to R2/S3
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;

    // Update user image
    await db.user.update({
      where: { id: authUser.id },
      data: { image: dataUrl },
    });

    return success({ image: dataUrl });
  } catch (err) {
    if (err && typeof err === "object" && "status" in err) throw err;
    console.error("[API] Avatar upload error:", err);
    return error(errors.INTERNAL_ERROR, "Internal server error", 500);
  }
}
