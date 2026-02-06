import { NextRequest } from "next/server";
import { decode } from "next-auth/jwt";
import { db } from "@/server/db";
import { error } from "./response";
import * as errors from "./errors";

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: string;
  organizationId: string | null;
}

/**
 * Extract and validate JWT from Authorization: Bearer <token> header.
 * Returns the authenticated user or throws a 401 response.
 */
export async function requireAuth(
  request: NextRequest
): Promise<AuthenticatedUser> {
  const user = await optionalAuth(request);
  if (!user) {
    throw error(errors.UNAUTHORIZED, "Authentication required", 401);
  }
  return user;
}

/**
 * Extract and validate JWT from Authorization header.
 * Returns user or null (does not throw).
 */
export async function optionalAuth(
  request: NextRequest
): Promise<AuthenticatedUser | null> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.slice(7);
  if (!token) return null;

  try {
    const secret = process.env.AUTH_SECRET;
    if (!secret) return null;

    const decoded = await decode({ token, secret, salt: "" });
    if (!decoded || !decoded.id) return null;

    const user = await db.user.findUnique({
      where: { id: decoded.id as string },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
        organizationId: true,
      },
    });

    if (!user) return null;

    return user;
  } catch {
    return null;
  }
}

/**
 * Wrapper to handle auth errors thrown as NextResponse from requireAuth.
 * Use in route handlers: const user = await withAuth(request);
 */
export async function withAuth(request: NextRequest): Promise<AuthenticatedUser> {
  const user = await optionalAuth(request);
  if (!user) {
    throw error(errors.UNAUTHORIZED, "Authentication required", 401);
  }
  return user;
}
