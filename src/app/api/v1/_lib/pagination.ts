import { NextRequest } from "next/server";

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
  take: number;
  sort?: string;
  order: "asc" | "desc";
}

/**
 * Parse pagination query params from a request.
 * Defaults: page=1, limit=20, max limit=100
 */
export function parsePagination(
  request: NextRequest,
  defaults?: { limit?: number; sort?: string; order?: "asc" | "desc" }
): PaginationParams {
  const url = request.nextUrl;
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10) || 1);
  const rawLimit = parseInt(url.searchParams.get("limit") || String(defaults?.limit ?? 20), 10) || 20;
  const limit = Math.min(Math.max(1, rawLimit), 100);
  const sort = url.searchParams.get("sort") || defaults?.sort;
  const rawOrder = url.searchParams.get("order");
  const order: "asc" | "desc" =
    rawOrder === "asc" || rawOrder === "desc" ? rawOrder : (defaults?.order ?? "desc");

  return {
    page,
    limit,
    skip: (page - 1) * limit,
    take: limit,
    sort,
    order,
  };
}

/**
 * Build Prisma orderBy from pagination params.
 */
export function buildOrderBy(
  params: PaginationParams,
  allowedFields: string[] = ["createdAt"]
): Record<string, "asc" | "desc"> | undefined {
  if (!params.sort) return undefined;
  if (!allowedFields.includes(params.sort)) return undefined;
  return { [params.sort]: params.order };
}
