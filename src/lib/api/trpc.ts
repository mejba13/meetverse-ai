/**
 * tRPC React Client
 *
 * Provides React Query hooks for tRPC procedures.
 */

"use client";

import { createTRPCReact } from "@trpc/react-query";
import { type AppRouter } from "@/server/api/root";

/**
 * tRPC React client
 * Use this to call tRPC procedures from React components
 */
export const api = createTRPCReact<AppRouter>();
