import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { eventRouter } from "./routers/event";
import { feedbackRouter } from "./routers/feedback";
import { attendanceRouter } from "./routers/attendance";
import { teamRouter } from "./routers/team";
import { authRouter } from "./routers/auth";
import { winnerRouter } from "./routers/winner";
import { certificateRouter } from "./routers/certificate";
import { activityPointsRouter } from "./routers/activitypoints";
import { organiserRouter } from "./routers/organiser";
import { branchRouter } from "./routers/branch";
import { userLinkRouter } from "./routers/userLink";
import { payment } from "./routers/payment";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  event: eventRouter,
  feedback: feedbackRouter,
  attendance: attendanceRouter,
  team: teamRouter,
  auth: authRouter,
  winner: winnerRouter,
  certificate: certificateRouter,
  activitypoints: activityPointsRouter,
  organiser: organiserRouter,
  branch: branchRouter,
  userLink: userLinkRouter,
  payment: payment,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
