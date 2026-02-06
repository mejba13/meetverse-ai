import { NextRequest } from "next/server";
import { withAuth } from "../../_lib/middleware";
import { success, error } from "../../_lib/response";
import * as errors from "../../_lib/errors";
import { isAIConfigured } from "@/server/services/ai";
import { isLiveKitConfigured } from "@/server/services/livekit";

export async function GET(request: NextRequest) {
  try {
    await withAuth(request);

    const aiConfigured = isAIConfigured();

    return success({
      isConfigured: aiConfigured,
      features: {
        summarization: aiConfigured,
        actionItemExtraction: aiConfigured,
        realTimeInsights: aiConfigured,
        liveKit: isLiveKitConfigured(),
      },
    });
  } catch (err) {
    if (err && typeof err === "object" && "status" in err) throw err;
    console.error("[API] AI status error:", err);
    return error(errors.INTERNAL_ERROR, "Internal server error", 500);
  }
}
