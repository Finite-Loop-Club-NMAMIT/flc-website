import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import {
  confirmTeamZ,
  createTeamZ,
  deleteTeamZ,
  getTeamById,
  joinTeamZ,
  leaveTeamZ,
} from "~/zod/teamZ";

export const teamRouter = createTRPCRouter({
  createTeam: protectedProcedure
    .input(createTeamZ)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        include: {
          Team: true,
        },
      });

      const alreadyInTeam = user?.Team.find(
        (team) => team.eventId === input.eventId,
      );

      if (alreadyInTeam) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are already in a team for this event",
        });
        return;
      }

      await ctx.db.attendance.create({
        data: {
          eventId: input.eventId,
          userId: ctx.session.user.id,
        },
      });

      return await ctx.db.team.create({
        data: {
          name: input.teamName,
          eventId: input.eventId,
          Members: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),

  jointeam: protectedProcedure
    .input(joinTeamZ)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        include: {
          Team: true,
        },
      });

      const alreadyInTeam = user?.Team.find(
        (team) => team.eventId === input.eventId,
      );

      if (alreadyInTeam) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are already in this team for this event",
        });
        return;
      }

      const team = await ctx.db.team.findUnique({
        where: {
          id: input.teamId,
        },
        include: {
          Event: true,
          Members: true,
        },
      });

      if ((team?.Members.length ?? 0) >= (team?.Event.maxTeamSize ?? 0)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Team is full",
        });
        return;
      }

      await ctx.db.attendance.create({
        data: {
          eventId: input.eventId,
          userId: ctx.session.user.id,
        },
      });

      return await ctx.db.team.update({
        where: {
          id: input.teamId,
        },
        data: {
          Members: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),

  leaveTeam: protectedProcedure
    .input(leaveTeamZ)
    .mutation(async ({ ctx, input }) => {
      const team = await ctx.db.team.findUnique({
        where: {
          id: input.teamId,
        },
        include: {
          Event: true,
        },
      });

      if (team?.isConfirmed ?? team?.Event.isLegacy) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot leave this team anymore!",
        });
      }

      await ctx.db.attendance.delete({
        where: {
          userId_eventId: {
            userId: ctx.session.user.id,
            eventId: team?.Event.id ?? "",
          },
        },
      });

      return await ctx.db.team.update({
        where: {
          id: input.teamId,
        },
        data: {
          Members: {
            disconnect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),

  deleteTeam: protectedProcedure
    .input(deleteTeamZ)
    .mutation(async ({ ctx, input }) => {
      const team = await ctx.db.team.findUnique({
        where: {
          id: input.teamId,
        },
        include: {
          Event: true,
        },
      });
      if (team?.isConfirmed ?? team?.Event.isLegacy) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot leave this team anymore!",
        });
      }

      await ctx.db.attendance.delete({
        where: {
          userId_eventId: {
            userId: ctx.session.user.id,
            eventId: team?.Event.id ?? "",
          },
        },
      });

      return await ctx.db.team.delete({
        where: {
          id: input.teamId,
        },
      });
    }),

  confirmTeam: protectedProcedure
    .input(confirmTeamZ)
    .mutation(async ({ ctx, input }) => {
      const team = await ctx.db.team.findUnique({
        where: {
          id: input.teamId,
        },
        include: {
          Members: true,
          Event: true,
        },
      });

      if ((team?.Members.length ?? 0) < (team?.Event.minTeamSize ?? 0)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `You need a minimum of ${team?.Event.minTeamSize} members to confirm the team`,
        });
      }

      return await ctx.db.team.update({
        where: {
          id: input.teamId,
        },
        data: {
          isConfirmed: true,
        },
      });
    }),

  // Retrieve

  getTeamById: protectedProcedure
    .input(getTeamById)
    .query(async ({ ctx, input }) => {
      return await ctx.db.team.findUnique({
        where: {
          id: input.teamId,
        },
        include: {
          Members: true,
        },
      });
    }),
});
