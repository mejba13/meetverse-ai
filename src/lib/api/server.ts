/**
 * Server-side tRPC Caller
 *
 * Use this to call tRPC procedures from server components.
 */

import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { appRouter, type AppRouter } from "@/server/api/root";
import { createCallerFactory, createTRPCContext } from "@/server/api/trpc";

/**
 * Create a server-side tRPC caller
 * This is cached per request for efficiency
 */
export const createCaller = cache(async () => {
  const heads = new Headers(await headers());
  heads.set("x-trpc-source", "rsc");

  const callerFactory = createCallerFactory(appRouter);
  return callerFactory(
    await createTRPCContext({
      req: new Request("https://localhost", { headers: heads }),
      resHeaders: heads,
    })
  );
});

/**
 * Server-side API caller
 * Use this in server components to call tRPC procedures
 *
 * @example
 * const meetings = await api.meeting.list({ limit: 10 });
 */
export const api = new Proxy({} as ReturnType<typeof appRouter.createCaller>, {
  get: (_, path) => {
    return new Proxy(
      {},
      {
        get: (_, method) => {
          return async (...args: unknown[]) => {
            const caller = await createCaller();
            // @ts-expect-error - dynamic access
            return caller[path][method](...args);
          };
        },
      }
    );
  },
});
