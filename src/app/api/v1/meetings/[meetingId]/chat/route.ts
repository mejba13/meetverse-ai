import { NextRequest } from "next/server";
import { db } from "@/server/db";
import { withAuth } from "../../../_lib/middleware";
import { success, created, paginated, error } from "../../../_lib/response";
import * as errors from "../../../_lib/errors";
import { parsePagination } from "../../../_lib/pagination";
import { sendChatMessageSchema } from "../../../_lib/validation";

type RouteParams = { params: Promise<{ meetingId: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await withAuth(request);
    const { meetingId } = await params;
    const { page, limit, skip, take } = parsePagination(request, {
      limit: 50,
    });

    const meeting = await db.meeting.findUnique({
      where: { id: meetingId },
      select: { id: true },
    });

    if (!meeting) {
      return error(errors.NOT_FOUND, "Meeting not found", 404);
    }

    const [messages, total] = await Promise.all([
      db.chatMessage.findMany({
        where: {
          meetingId,
          OR: [
            { isPrivate: false },
            { senderId: user.id },
            { recipientId: user.id },
          ],
        },
        include: {
          replyTo: {
            select: {
              id: true,
              senderName: true,
              content: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      db.chatMessage.count({
        where: {
          meetingId,
          OR: [
            { isPrivate: false },
            { senderId: user.id },
            { recipientId: user.id },
          ],
        },
      }),
    ]);

    return paginated(messages.reverse(), { page, limit, total });
  } catch (err) {
    if (err && typeof err === "object" && "status" in err) throw err;
    console.error("[API] Get chat messages error:", err);
    return error(errors.INTERNAL_ERROR, "Internal server error", 500);
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await withAuth(request);
    const { meetingId } = await params;

    const body = await request.json();
    const parsed = sendChatMessageSchema.safeParse(body);

    if (!parsed.success) {
      const fields: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path.join(".");
        fields[key] = fields[key] || [];
        fields[key].push(issue.message);
      }
      return error(errors.VALIDATION_ERROR, "Invalid request body", 400, fields);
    }

    const meeting = await db.meeting.findUnique({
      where: { id: meetingId },
      select: { id: true },
    });

    if (!meeting) {
      return error(errors.NOT_FOUND, "Meeting not found", 404);
    }

    const input = parsed.data;
    const message = await db.chatMessage.create({
      data: {
        meetingId,
        senderId: user.id,
        senderName: user.name || user.email,
        content: input.content,
        type: input.type,
        replyToId: input.replyToId,
        isPrivate: input.isPrivate,
        recipientId: input.recipientId,
      },
    });

    return created(message);
  } catch (err) {
    if (err && typeof err === "object" && "status" in err) throw err;
    console.error("[API] Send chat message error:", err);
    return error(errors.INTERNAL_ERROR, "Internal server error", 500);
  }
}
