/**
 * tRPC Client
 *
 * Client-side tRPC hooks for React components.
 */

"use client";

import { createTRPCReact } from "@trpc/react-query";
import { type AppRouter } from "@/server/api/root";

/**
 * tRPC React hooks
 *
 * @example
 * const { data, isLoading } = trpc.meeting.list.useQuery({ limit: 10 });
 * const mutation = trpc.meeting.create.useMutation();
 */
export const trpc = createTRPCReact<AppRouter>();
