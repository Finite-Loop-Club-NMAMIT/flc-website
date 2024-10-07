import { TRPCError } from "@trpc/server";

import { getEventByIdZ } from "~/zod/eventZ";
import {
  confirmTeamZ,
  createTeamZ,
  deleteTeamZ,
  getTeamByIdZ,
  joinTeamZ,
  leaveTeamZ,
  RemoveFromTeamZ,
} from "~/zod/teamZ";

import { createTRPCRouter, protectedProcedure } from "../trpc";

const teamRouter = createTRPCRouter({
  createTeam: protectedProcedure
    .input(createTeamZ)
    .mutation(async ({ ctx, input }) => {
      const inTeam = await ctx.db.team.findFirst({
        where: {
          AND: [
            {
              eventId: input.eventId,
            },
            {
              Members: {
                some: {
                  id: ctx.session.user.id,
                },
              },
            },
          ],
        },
      });

      if (inTeam)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Already in a team for this event",
        });

      await ctx.db.team.create({
        data: {
          name: input.teamName,
          Event: {
            connect: {
              id: input.eventId,
            },
          },
          Leader: {
            connect: {
              id: ctx.session.user.id, // Leader ID to connect
            },
          },
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
      const inTeam = await ctx.db.team.findFirst({
        where: {
          AND: [
            {
              eventId: input.eventId,
            },
            {
              Members: {
                some: {
                  id: ctx.session.user.id,
                },
              },
            },
          ],
        },
      });

      if (inTeam)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Already in the team",
        });

      const team = await ctx.db.team.findUnique({
        where: {
          id: input.teamId,
        },
        select: {
          _count: {
            select: {
              Members: true,
            },
          },
          Event: true,
        },
      });

      if (!team)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team not found",
        });

      if (team && team.Event.id != input.eventId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Team does not belong to this event",
        });
      }

      if (team._count.Members >= team.Event.maxTeamSize)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Team is full",
        });

      await ctx.db.team.update({
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
        select: {
          isConfirmed: true,
          Event: {
            select: {
              id: true,
              isLegacy: true,
            },
          },
        },
      });

      if (!team)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team not found",
        });

      if (team.isConfirmed || team.Event.isLegacy)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You cannot leave this team anymore!",
        });

      await ctx.db.team.update({
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

  removeFromTeam: protectedProcedure
    .input(RemoveFromTeamZ)
    .mutation(async ({ ctx, input }) => {
      const team = await ctx.db.team.findUnique({
        where: {
          id: input.teamId,
        },
        select: {
          isConfirmed: true,
          Event: {
            select: {
              id: true,
              isLegacy: true,
            },
          },
        },
      });

      if (!team)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team not found",
        });

      if (team.isConfirmed || team.Event.isLegacy)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You cannot leave this team anymore!",
        });

      await ctx.db.team.update({
        where: {
          id: input.teamId,
        },
        data: {
          Members: {
            disconnect: {
              id: input.userId,
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
        select: {
          Event: true,
          isConfirmed: true,
        },
      });
      if (!team)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team not found",
        });

      if (team.isConfirmed)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot delete this team anymore!",
        });

      if (team.Event.eventType === "SOLO")
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Registrations cannot be cancelled for this event",
        });

      await ctx.db.team.delete({
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
          _count: {
            select: {
              Members: true,
            },
          },
          Event: {
            select: {
              minTeamSize: true,
            },
          },
        },
      });

      if (!team)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team not found",
        });

      if (team._count.Members < team.Event.minTeamSize)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Minimum team size is ${team.Event.minTeamSize}`,
        });

      await ctx.db.team.update({
        where: {
          id: input.teamId,
        },
        data: {
          isConfirmed: true,
        },
      });
    }),

  inATeamOfEvent: protectedProcedure
    .input(getEventByIdZ)
    .query(async ({ ctx, input }) => {
      const team = await ctx.db.team.findFirst({
        where: {
          AND: [
            {
              eventId: input.eventId,
            },
            {
              Members: {
                some: {
                  id: ctx.session.user.id,
                },
              },
            },
          ],
        },
        include: {
          Members: true,
          Leader: {
            select: {
              id: true,
            },
          },
        },
      });

      const isLeader: boolean = team?.Leader.id === ctx.session.user.id;

      if (!team) return null;
      return {
        ...team,
        isLeader,
        userId: ctx.session.user.id,
      };
    }),

  soloTeamRegistration: protectedProcedure
    .input(getEventByIdZ)
    .mutation(async ({ ctx, input }) => {
      const inTeam = await ctx.db.team.findFirst({
        where: {
          AND: [
            {
              eventId: input.eventId,
            },
            {
              Members: {
                some: {
                  id: ctx.session.user.id,
                },
              },
            },
          ],
        },
      });

      if (inTeam)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Already in a team for this event",
        });

      await ctx.db.team.create({
        data: {
          name: ctx.session.user.name,
          Event: {
            connect: {
              id: input.eventId,
            },
          },
          Leader: {
            connect: {
              id: ctx.session.user.id, // Leader ID to connect
            },
          },
          Members: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          isConfirmed: true,
        },
      });
    }),

  // Retrieve
  getTeamById: protectedProcedure
    .input(getTeamByIdZ)
    .query(async ({ ctx, input }) => {
      return await ctx.db.team.findUniqueOrThrow({
        where: {
          id: input.teamId,
        },
        include: {
          Members: true,
        },
      });
    }),
});

export default teamRouter;
