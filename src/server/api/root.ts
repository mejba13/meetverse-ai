/**
 * Root tRPC Router
 *
 * All routers are merged here to create the main app router.
 */

import { createTRPCRouter } from "./trpc";
import { meetingRouter } from "./routers/meeting";
import { userRouter } from "./routers/user";
import { actionItemRouter } from "./routers/action-item";
import { aiRouter } from "./routers/ai";

export const appRouter = createTRPCRouter({
  meeting: meetingRouter,
  user: userRouter,
  actionItem: actionItemRouter,
  ai: aiRouter,
});

export type AppRouter = typeof appRouter;
