import { NextRequest } from "next/server";
import { db } from "@/server/db";
import { generateRoomId } from "@/lib/utils";
import { withAuth } from "../_lib/middleware";
import { success, created, paginated, error } from "../_lib/response";
import * as errors from "../_lib/errors";
import { parsePagination } from "../_lib/pagination";
import { createMeetingSchema } from "../_lib/validation";

export async function GET(request: NextRequest) {
  try {
    const user = await withAuth(request);
    const { page, limit, skip, take } = parsePagination(request);

    const url = request.nextUrl;
    const status = url.searchParams.get("status") as
      | "SCHEDULED"
      | "LIVE"
      | "ENDED"
      | "CANCELLED"
      | null;
    const dateFrom = url.searchParams.get("dateFrom");
    const dateTo = url.searchParams.get("dateTo");

    const where = {
      OR: [
        { hostId: user.id },
        { participants: { some: { userId: user.id } } },
      ],
      ...(status && { status }),
      ...(dateFrom && { scheduledStart: { gte: new Date(dateFrom) } }),
      ...(dateTo && { scheduledStart: { lte: new Date(dateTo) } }),
      deletedAt: null,
    };

    const [meetings, total] = await Promise.all([
      db.meeting.findMany({
        where,
        include: {
          host: {
            select: { id: true, name: true, image: true },
          },
          _count: {
            select: { participants: true, actionItems: true },
          },
        },
        orderBy: [
          { status: "asc" },
          { scheduledStart: "asc" },
          { createdAt: "desc" },
        ],
        skip,
        take,
      }),
      db.meeting.count({ where }),
    ]);

    const data = meetings.map((m) => ({
      ...m,
      settings: JSON.parse(m.settings),
    }));

    return paginated(data, { page, limit, total });
  } catch (err) {
    if (err && typeof err === "object" && "status" in err) throw err;
    console.error("[API] List meetings error:", err);
    return error(errors.INTERNAL_ERROR, "Internal server error", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await withAuth(request);

    const body = await request.json();
    const parsed = createMeetingSchema.safeParse(body);

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
    const roomId = generateRoomId();

    const meeting = await db.meeting.create({
      data: {
        roomId,
        title: input.title,
        description: input.description,
        hostId: user.id,
        organizationId: user.organizationId,
        scheduledStart: input.scheduledStart
          ? new Date(input.scheduledStart)
          : null,
        scheduledEnd: input.scheduledEnd ? new Date(input.scheduledEnd) : null,
        settings: JSON.stringify(input.settings || {}),
        status: input.scheduledStart ? "SCHEDULED" : "LIVE",
      },
    });

    return created({
      id: meeting.id,
      roomId: meeting.roomId,
      title: meeting.title,
      inviteLink: `${process.env.NEXT_PUBLIC_APP_URL}/meeting/${meeting.roomId}`,
      status: meeting.status,
      createdAt: meeting.createdAt,
    });
  } catch (err) {
    if (err && typeof err === "object" && "status" in err) throw err;
    console.error("[API] Create meeting error:", err);
    return error(errors.INTERNAL_ERROR, "Internal server error", 500);
  }
}
