import { NextResponse } from "next/server";

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export function success<T>(data: T, meta?: Record<string, unknown>) {
  return NextResponse.json(
    { success: true, data, ...(meta ? { meta } : {}) },
    { status: 200 }
  );
}

export function created<T>(data: T) {
  return NextResponse.json({ success: true, data }, { status: 201 });
}

export function paginated<T>(
  items: T[],
  { page, limit, total }: { page: number; limit: number; total: number }
) {
  const totalPages = Math.ceil(total / limit);
  const meta: PaginationMeta = {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };

  return NextResponse.json({ success: true, data: items, meta }, { status: 200 });
}

export function error(
  code: string,
  message: string,
  status: number,
  fields?: Record<string, string[]>
) {
  return NextResponse.json(
    {
      success: false,
      error: { code, message, ...(fields ? { fields } : {}) },
    },
    { status }
  );
}
