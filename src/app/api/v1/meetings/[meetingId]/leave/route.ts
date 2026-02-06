import { NextRequest } from "next/server";
import { db } from "@/server/db";
import { withAuth } from "../../../_lib/middleware";
import { success, error } from "../../../_lib/response";
import * as errors from "../../../_lib/errors";

type RouteParams = { params: Promise<{ meetingId: string }> };

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await withAuth(request);
    const { meetingId } = await params;

    const participant = await db.meetingParticipant.findFirst({
      where: {
        meetingId,
        userId: user.id,
        leftAt: null,
      },
    });

    if (!participant) {
      return error(errors.NOT_FOUND, "You are not in this meeting", 404);
    }

    await db.meetingParticipant.update({
      where: { id: participant.id },
      data: { leftAt: new Date() },
    });

    return success({ message: "Left meeting" });
  } catch (err) {
    if (err && typeof err === "object" && "status" in err) throw err;
    console.error("[API] Leave meeting error:", err);
    return error(errors.INTERNAL_ERROR, "Internal server error", 500);
  }
}
