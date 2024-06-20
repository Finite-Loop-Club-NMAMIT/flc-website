import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { markTeamAttendanceSchema } from '~/server/schema/zod-schema';
import { findEventIfExistById } from '~/utils/findEventById';

export const attendanceRouter = createTRPCRouter({

    // Mark  Team attendance(solo/team both )-->
    markTeamAttendanceOfPerticularEvent: publicProcedure
        .input(markTeamAttendanceSchema)
        .mutation(async ({ input, ctx }) => {
            try {
                const event = await findEventIfExistById(input.eventId);

                // Check if the event state is appropriate
                if (event.state !== 'PUBLISHED' && event.state !== 'COMPLETED') {
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: 'Cannot mark attendance for an event that is not PUBLISHED or COMPLETED',
                    });
                }

                const team = await ctx.db.team.findUnique({
                    where: {
                        id: input.teamId,
                    },
                    include: {
                        Members: true,
                    },
                });

                if (!team) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: 'Team not found',
                    });
                }

                if (!team.isConfirmed) {
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: 'Team is not confirmed for the event',
                    });
                }

                // Check if the team has at least one member
                if (team.Members.length === 0) {
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: 'Team must have at least one member',
                    });
                }

                // Mark attendance for the team
                await ctx.db.team.update({
                    where: {
                        id: input.teamId,
                    },
                    data: {
                        hasAttended: true,
                    },
                });

                // Mark attendance for all team members
                for (const member of team.Members) {
                    const existingAttendance = await ctx.db.attendence.findFirst({
                        where: {
                            userId: member.id,
                            eventId: input.eventId,
                        },
                    });

                    if (!existingAttendance) {
                        await ctx.db.attendence.create({
                            data: {
                                userId: member.id,
                                eventId: input.eventId,
                                hasAttended: true,
                            },
                        });
                    }
                }

                return { success: true };
            } catch (error) {
                console.error('Mark Solo Attendance Error:', error);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Something went wrong while marking attendance',
                });
            }
        }),
    // Get teams with members whose attendance is true for a particular event
    getTeamsWithAttendanceTrue: publicProcedure
        .input(z.object({
            eventId: z.string(),
        }))
        .query(async ({ input, ctx }) => {
            try {
                // Use the helper function to fetch and check if the event exists
                await findEventIfExistById(input.eventId);

                // Fetch teams where attendance is true
                const teamsWithAttendanceTrue = await ctx.db.team.findMany({
                    where: {
                        eventId: input.eventId,
                        isConfirmed: true,
                        hasAttended: true,
                    },
                    include: {
                        Members: true,
                    },
                });

                return teamsWithAttendanceTrue;
            } catch (error) {
                console.error('Get Teams with Attendance True Error:', error);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Something went wrong while fetching teams with attendance true',
                });
            }
        }),

    // Get teams with members whose attendance is false for a particular event
    getTeamsWithAttendanceFalse: publicProcedure
        .input(z.object({
            eventId: z.string(),
        }))
        .query(async ({ input, ctx }) => {
            try {
                // Use the helper function to fetch and check if the event exists
                await findEventIfExistById(input.eventId);

                // Fetch teams where attendance is false
                const teamsWithAttendanceFalse = await ctx.db.team.findMany({
                    where: {
                        eventId: input.eventId,
                        isConfirmed: true,
                        hasAttended: false,
                    },
                    include: {
                        Members: true,
                    },
                });

                return teamsWithAttendanceFalse;
            } catch (error) {
                console.error('Get Teams with Attendance False Error:', error);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Something went wrong while fetching teams with attendance false',
                });
            }
        }),
});
