/**
 * Upload API Route
 *
 * Handles file uploads for profile images.
 * Currently stores as data URL - can be upgraded to R2 when configured.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/server/auth";

// Max file size: 2MB (reasonable for profile images)
const MAX_FILE_SIZE = 2 * 1024 * 1024;

// Allowed image types
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse the request body
    const body = await request.json();
    const { image, type } = body as { image: string; type: string };

    // Validate image data
    if (!image || typeof image !== "string") {
      return NextResponse.json(
        { error: "No image data provided" },
        { status: 400 }
      );
    }

    // Validate type
    if (!type || !ALLOWED_TYPES.includes(type)) {
      return NextResponse.json(
        { error: "Invalid image type. Allowed: JPEG, PNG, GIF, WebP" },
        { status: 400 }
      );
    }

    // Check if it's a data URL
    if (!image.startsWith("data:")) {
      return NextResponse.json(
        { error: "Invalid image format" },
        { status: 400 }
      );
    }

    // Estimate size from base64 (rough estimate)
    const base64Data = image.split(",")[1];
    if (base64Data) {
      const estimatedSize = (base64Data.length * 3) / 4;
      if (estimatedSize > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: "Image too large. Maximum size is 2MB" },
          { status: 400 }
        );
      }
    }

    // For now, return the data URL directly
    // In production, you would upload to R2/S3 and return the CDN URL
    //
    // Example R2 upload (when configured):
    // const buffer = Buffer.from(base64Data, 'base64');
    // const key = `avatars/${session.user.id}/${Date.now()}.${extension}`;
    // await r2Client.putObject({ Bucket, Key: key, Body: buffer, ContentType: type });
    // return NextResponse.json({ url: `${CDN_URL}/${key}` });

    return NextResponse.json({
      url: image,
      message: "Image uploaded successfully",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to process upload" },
      { status: 500 }
    );
  }
}
