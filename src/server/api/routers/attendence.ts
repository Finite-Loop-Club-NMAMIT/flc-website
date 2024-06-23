import { z } from 'zod';
import { adminProcedure, createTRPCRouter, protectedProcedure, } from '../trpc';
import { TRPCError } from '@trpc/server';
import { markTeamAttendanceSchema } from '~/server/schema/zod-schema';
import { findEventIfExistById } from '~/utils/helper/findEventById';
import { checkOrganiser } from '~/utils/helper/organiserCheck';

export const attendanceRouter = createTRPCRouter({

    // Mark  Team attendance(solo/team both )-->
    markTeamAttendanceOfPerticularEvent: protectedProcedure
        .input(markTeamAttendanceSchema)
        .mutation(async ({ input, ctx }) => {
            try {
                const userId = ctx.session.user.id;

                await checkOrganiser(userId, input.eventId); // checks if the user is the organiser of the event or not 
                const event = await findEventIfExistById(input.eventId);

                // Check if the event state is appropriate
                if (event.state !== 'PUBLISHED') {
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: 'Cannot mark attendance for an event that is not PUBLISHED or COMPLETED',
                    });
                }

                const team = await ctx.db.team.findUnique({
                    where: {
                        id: input.teamId,
                        eventId: input.eventId
                    },
                    include: {
                        Members: true,
                    },
                });

                if (!team) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: 'Team not found or team is not registered for this event',
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

    // this endpoint renders the user info of the team which iscomfrimed for perticular event 
    manuallyRenderUsersOfConfirmedTeams: protectedProcedure
        .input(z.object({
            eventId: z.string(),
        }))
        .query(async ({ input, ctx }) => {
            try {
                const event = await ctx.db.event.findUnique({
                    where: { id: input.eventId },
                });

                if (!event) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: 'Event not found',
                    });
                }

                const teams = await ctx.db.team.findMany({
                    where: {
                        eventId: input.eventId,
                        isConfirmed: true,
                    },
                    include: {
                        Members: true,
                    },
                });

                return { success: true, teams };
            } catch (error) {
                console.error('Render Users of Confirmed Teams Error:', error);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Something went wrong while fetching team users',
                    cause: error,
                });
            }
        }),
    //marking attendence manuvaly for a user 
    manuallyMarkUserAttendanceForConfirmedTeams: protectedProcedure
        .input(z.object({
            eventId: z.string(),
            userId: z.string(),
            hasAttended: z.boolean(),
        }))
        .mutation(async ({ input, ctx }) => {
            try {
                // Check if the event exists
                const event = await ctx.db.event.findUnique({
                    where: { id: input.eventId },
                });

                if (!event) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: 'Event not found',
                    });
                }

                // Fetch all teams for the event that are confirmed and include members
                const teams = await ctx.db.team.findMany({
                    where: {
                        eventId: input.eventId,
                        isConfirmed: true,
                    },
                    include: {
                        Members: true,
                    },
                });

                // Find the team where the user is a member
                const userTeam = teams.find(team => team.Members.some(member => member.id === input.userId));

                if (!userTeam) {
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: 'User is not a member of any confirmed team for this event',
                    });
                }

                // Update or create attendance record for the user
                let existingAttendance = await ctx.db.attendence.findFirst({
                    where: {
                        userId: input.userId,
                        eventId: input.eventId,
                    },
                });

                if (!existingAttendance) {
                    // Create new attendance record
                    existingAttendance = await ctx.db.attendence.create({
                        data: {
                            userId: input.userId,
                            eventId: input.eventId,
                            hasAttended: input.hasAttended,
                        },
                    });
                } else {
                    // Update existing attendance record
                    existingAttendance = await ctx.db.attendence.update({
                        where: { id: existingAttendance.id },
                        data: {
                            hasAttended: input.hasAttended,
                        },
                    });
                }

                return { success: true };
            } catch (error) {
                console.error('Mark User Attendance Error:', error);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Something went wrong while marking user attendance',
                    cause: error,
                });
            }
        }),

    // Get teams with members whose attendance is true for a particular event
    getTeamsWithAttendanceTrue: adminProcedure
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
    getTeamsWithAttendanceFalse: adminProcedure
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
