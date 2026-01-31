/**
 * tRPC Server Configuration
 *
 * This file sets up the tRPC context, middleware, and procedure helpers.
 */

import { initTRPC, TRPCError } from "@trpc/server";
import { type FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import superjson from "superjson";
import { ZodError } from "zod";
import { db } from "@/server/db";
import { auth } from "@/server/auth";

/**
 * Context creation - runs for each request
 */
export const createTRPCContext = async (
  opts: Partial<FetchCreateContextFnOptions> = {}
) => {
  const session = await auth();

  return {
    db,
    session,
    req: opts.req,
    resHeaders: opts.resHeaders,
  };
};

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

/**
 * Initialize tRPC
 */
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Create a tRPC router
 */
export const createTRPCRouter = t.router;

/**
 * Middleware for logging
 */
const loggerMiddleware = t.middleware(async ({ path, type, next }) => {
  const start = Date.now();
  const result = await next();
  const duration = Date.now() - start;

  if (result.ok) {
    console.log(`[tRPC] ${type} ${path} - ${duration}ms`);
  } else {
    console.error(`[tRPC] ${type} ${path} - ${duration}ms - ERROR`);
  }

  return result;
});

/**
 * Public procedure - no authentication required
 */
export const publicProcedure = t.procedure.use(loggerMiddleware);

/**
 * Middleware that enforces authentication
 */
const enforceAuth = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
      user: ctx.session.user,
    },
  });
});

/**
 * Protected procedure - requires authentication
 */
export const protectedProcedure = t.procedure
  .use(loggerMiddleware)
  .use(enforceAuth);

/**
 * Create a caller for server-side usage
 */
export const createCallerFactory = t.createCallerFactory;
