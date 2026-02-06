import { NextRequest } from "next/server";
import { db } from "@/server/db";
import { withAuth } from "../_lib/middleware";
import { created, paginated, error } from "../_lib/response";
import * as errors from "../_lib/errors";
import { parsePagination } from "../_lib/pagination";
import { createActionItemSchema } from "../_lib/validation";

export async function GET(request: NextRequest) {
  try {
    const user = await withAuth(request);
    const { page, limit, skip, take } = parsePagination(request);

    const url = request.nextUrl;
    const meetingId = url.searchParams.get("meetingId");
    const status = url.searchParams.get("status");
    const assigneeId = url.searchParams.get("assigneeId");
    const priority = url.searchParams.get("priority");

    const where = {
      ...(meetingId && { meetingId }),
      ...(status && { status }),
      ...(assigneeId && { assigneeId }),
      ...(priority && { priority }),
      OR: [
        { assigneeId: user.id },
        { meeting: { hostId: user.id } },
        {
          meeting: {
            participants: {
              some: { userId: user.id },
            },
          },
        },
      ],
    };

    const [actionItems, total] = await Promise.all([
      db.actionItem.findMany({
        where,
        include: {
          assignee: {
            select: { id: true, name: true, image: true },
          },
          meeting: {
            select: { id: true, title: true },
          },
        },
        orderBy: [
          { status: "asc" },
          { priority: "desc" },
          { dueDate: "asc" },
          { createdAt: "desc" },
        ],
        skip,
        take,
      }),
      db.actionItem.count({ where }),
    ]);

    return paginated(actionItems, { page, limit, total });
  } catch (err) {
    if (err && typeof err === "object" && "status" in err) throw err;
    console.error("[API] List action items error:", err);
    return error(errors.INTERNAL_ERROR, "Internal server error", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await withAuth(request);

    const body = await request.json();
    const parsed = createActionItemSchema.safeParse(body);

    if (!parsed.success) {
      const fields: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path.join(".");
        fields[key] = fields[key] || [];
        fields[key].push(issue.message);
      }
      return error(errors.VALIDATION_ERROR, "Invalid request body", 400, fields);
    }

    const input = parsed.data;

    // Verify meeting exists
    const meeting = await db.meeting.findUnique({
      where: { id: input.meetingId },
    });

    if (!meeting) {
      return error(errors.NOT_FOUND, "Meeting not found", 404);
    }

    const actionItem = await db.actionItem.create({
      data: {
        meetingId: input.meetingId,
        title: input.title,
        description: input.description,
        assigneeId: input.assigneeId,
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
        priority: input.priority || "MEDIUM",
        aiGenerated: false,
      },
      include: {
        assignee: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    return created(actionItem);
  } catch (err) {
    if (err && typeof err === "object" && "status" in err) throw err;
    console.error("[API] Create action item error:", err);
    return error(errors.INTERNAL_ERROR, "Internal server error", 500);
  }
}
