import { TRPCError } from "@trpc/server";

import { toggleTeamAttendanceZ, toggleAttendanceZ } from "~/zod/attendanceZ";

import {
  createTRPCRouter,
  organiserProcedure,
  protectedProcedure,
} from "../trpc";

const attendanceRouter = createTRPCRouter({
  toggleAttendance: organiserProcedure
    .input(toggleAttendanceZ)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          id: input.userId,
        },
        include: {
          Attendance: true,
          Team: {
            include: {
              Members: {
                include: {
                  Attendance: true,
                },
              },
            },
          },
        },
      });

      const team = user?.Team.find((t) => t.eventId === input.eventId);

      const attendance = user?.Attendance.find(
        (a) => a.eventId === input.eventId,
      );

      const updatedAttendance = await ctx.db.attendance.update({
        where: {
          userId_eventId: {
            ...input,
          },
        },
        data: {
          hasAttended: !attendance?.hasAttended,
        },
      });

      let teamAttendance = true;

      team?.Members.forEach((member) => {
        if (
          !member.Attendance.find((a) => a.eventId === input.eventId)
            ?.hasAttended
        ) {
          teamAttendance = false;
        }
      });

      if (teamAttendance) {
        await ctx.db.team.update({
          where: {
            id: team?.id,
          },
          data: {
            hasAttended: true,
          },
        });
      }

      return updatedAttendance;
    }),

  toggleTeamAttendance: protectedProcedure
    .input(toggleTeamAttendanceZ)
    .mutation(async ({ ctx, input }) => {
      const team = await ctx.db.team.findUnique({
        where: {
          id: input.teamId,
          eventId: input.eventId,
        },
      });
      return await ctx.db.team.update({
        where: {
          id: input.teamId,
          eventId: input.eventId,
        },
        data: {
          hasAttended: !team?.hasAttended,
        },
      });
    }),

  markTeamAttendance: protectedProcedure
    .input(toggleTeamAttendanceZ)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.team.update({
        where: {
          id: input.teamId,
          eventId: input.eventId,
        },
        data: {
          hasAttended: true,
        },
      });
    }),

  getAttendanceByUserId: protectedProcedure.query(async ({ ctx }) => {
    const totalEvents = await ctx.db.event.count();
    const user = await ctx.db.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      include: {
        Attendance: true,
      },
    });
    if (!user) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Couldn't find user",
      });
    }
    const attendedEvents = user.Attendance.filter((event) => {
      return event.hasAttended;
    });
    return (attendedEvents.length / totalEvents) * 100;
  }),
});

export default attendanceRouter;
