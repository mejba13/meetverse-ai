import { NextRequest } from "next/server";
import { withAuth } from "../../../../_lib/middleware";
import { success, error } from "../../../../_lib/response";
import * as errors from "../../../../_lib/errors";
import { getProcessingStatus } from "@/server/services/post-meeting-processor";

type RouteParams = { params: Promise<{ meetingId: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await withAuth(request);
    const { meetingId } = await params;

    const status = await getProcessingStatus(meetingId);

    return success(status);
  } catch (err) {
    if (err && typeof err === "object" && "status" in err) throw err;
    console.error("[API] Processing status error:", err);
    return error(errors.INTERNAL_ERROR, "Internal server error", 500);
  }
}
