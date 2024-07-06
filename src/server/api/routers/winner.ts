import { createTRPCRouter, protectedProcedure } from "../trpc";
import { checkOrganiser } from "~/utils/helper";
// import { findEventIfExistById, checkOrganiser } from "~/utils/helper";
import {
  getWinnersByEventIdZ,
  makeTeamWinnerZ,
  removeWinnerZ,
} from "~/zod/winnerZ";

export const winnerRouter = createTRPCRouter({
  //Mutations
  makeTeamWinner: protectedProcedure
    .input(makeTeamWinnerZ)
    .mutation(async ({ ctx, input }) => {
      const reqUser = ctx.session.user;
      await checkOrganiser(reqUser.id, input.eventId, reqUser.role);
      await ctx.db.winner.create({
        data: {
          eventId: input.eventId,
          teamId: input.teamId,
          winnerType: input.winnerType,
        },
      });
    }),

  removeWinner: protectedProcedure
    .input(removeWinnerZ)
    .mutation(async ({ ctx, input }) => {
      const reqUser = ctx.session.user;
      await checkOrganiser(reqUser.id, input.eventId, reqUser.role);

      await ctx.db.winner.delete({
        where: {
          id: input.winnerId,
        },
      });
    }),

  //Queries
  getWinnersByEventId: protectedProcedure
    .input(getWinnersByEventIdZ)
    .query(async ({ ctx, input }) => {
      const reqUser = ctx.session.user;
      await checkOrganiser(reqUser.id, input.eventId, reqUser.role);

      const winners = await ctx.db.winner.findMany({
        where: {
          eventId: input.eventId,
        },
        include: {
          Team: true,
        },
      });

      const sortedWinners = winners.sort((a, b) => {
        if (a.winnerType === "WINNER") {
          return -1;
        } else if (b.winnerType === "RUNNER_UP") {
          return 1;
        } else {
          return 0;
        }
      });

      return sortedWinners;
    }),
});
