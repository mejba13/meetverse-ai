import { NextRequest } from "next/server";
import { db } from "@/server/db";
import { withAuth } from "../../_lib/middleware";
import { paginated, error } from "../../_lib/response";
import * as errors from "../../_lib/errors";
import { parsePagination } from "../../_lib/pagination";

export async function GET(request: NextRequest) {
  try {
    const user = await withAuth(request);

    if (!user.organizationId) {
      return error(errors.NOT_FOUND, "You are not part of an organization", 404);
    }

    const { page, limit, skip, take } = parsePagination(request);
    const search = request.nextUrl.searchParams.get("search");

    const where = {
      organizationId: user.organizationId,
      ...(search && {
        OR: [
          { name: { contains: search } },
          { email: { contains: search } },
        ],
      }),
    };

    const [members, total] = await Promise.all([
      db.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          createdAt: true,
        },
        orderBy: { name: "asc" },
        skip,
        take,
      }),
      db.user.count({ where }),
    ]);

    return paginated(members, { page, limit, total });
  } catch (err) {
    if (err && typeof err === "object" && "status" in err) throw err;
    console.error("[API] List members error:", err);
    return error(errors.INTERNAL_ERROR, "Internal server error", 500);
  }
}
