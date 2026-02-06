import { NextRequest } from "next/server";
import { db } from "@/server/db";
import { withAuth } from "../../_lib/middleware";
import { success, error } from "../../_lib/response";
import * as errors from "../../_lib/errors";
import { updateActionItemSchema } from "../../_lib/validation";

type RouteParams = { params: Promise<{ itemId: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await withAuth(request);
    const { itemId } = await params;

    const actionItem = await db.actionItem.findUnique({
      where: { id: itemId },
      include: {
        assignee: {
          select: { id: true, name: true, image: true },
        },
        meeting: {
          select: { id: true, title: true, roomId: true },
        },
        sourceTranscript: {
          select: {
            id: true,
            content: true,
            startTime: true,
            speakerName: true,
          },
        },
      },
    });

    if (!actionItem) {
      return error(errors.NOT_FOUND, "Action item not found", 404);
    }

    return success(actionItem);
  } catch (err) {
    if (err && typeof err === "object" && "status" in err) throw err;
    console.error("[API] Get action item error:", err);
    return error(errors.INTERNAL_ERROR, "Internal server error", 500);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await withAuth(request);
    const { itemId } = await params;

    const body = await request.json();
    const parsed = updateActionItemSchema.safeParse(body);

    if (!parsed.success) {
      const fields: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path.join(".");
        fields[key] = fields[key] || [];
        fields[key].push(issue.message);
      }
      return error(errors.VALIDATION_ERROR, "Invalid request body", 400, fields);
    }

    const existing = await db.actionItem.findUnique({
      where: { id: itemId },
      include: { meeting: true },
    });

    if (!existing) {
      return error(errors.NOT_FOUND, "Action item not found", 404);
    }

    // Check if user can update (assignee or meeting host)
    const canUpdate =
      existing.assigneeId === user.id ||
      existing.meeting.hostId === user.id;

    if (!canUpdate) {
      return error(errors.FORBIDDEN, "You cannot update this action item", 403);
    }

    const input = parsed.data;
    const actionItem = await db.actionItem.update({
      where: { id: itemId },
      data: {
        title: input.title,
        description: input.description,
        assigneeId: input.assigneeId,
        dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
        status: input.status,
        priority: input.priority,
      },
      include: {
        assignee: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    return success(actionItem);
  } catch (err) {
    if (err && typeof err === "object" && "status" in err) throw err;
    console.error("[API] Update action item error:", err);
    return error(errors.INTERNAL_ERROR, "Internal server error", 500);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await withAuth(request);
    const { itemId } = await params;

    const existing = await db.actionItem.findUnique({
      where: { id: itemId },
      include: { meeting: true },
    });

    if (!existing) {
      return error(errors.NOT_FOUND, "Action item not found", 404);
    }

    if (existing.meeting.hostId !== user.id) {
      return error(
        errors.FORBIDDEN,
        "Only the meeting host can delete action items",
        403
      );
    }

    await db.actionItem.delete({ where: { id: itemId } });

    return success({ message: "Action item deleted" });
  } catch (err) {
    if (err && typeof err === "object" && "status" in err) throw err;
    console.error("[API] Delete action item error:", err);
    return error(errors.INTERNAL_ERROR, "Internal server error", 500);
  }
}
