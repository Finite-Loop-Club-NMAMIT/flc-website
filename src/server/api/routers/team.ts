import { z } from 'zod';
import { adminProcedure, createTRPCRouter, protectedProcedure} from '../trpc';
import { TRPCError } from '@trpc/server';
import { findEventIfExistById } from '~/utils/helper/findEventById';
import { createTeamZ, joinTeamZ, leaveTeamSchema } from '~/server/schema/zod-schema';





export const teamRouter = createTRPCRouter({

    // Create a team for a specific event
    createTeam: protectedProcedure
        .input(createTeamZ)
        .mutation(async ({ input, ctx }) => {
            const { eventId, teamName, userId } = input;

            try {
                await findEventIfExistById(eventId); // Checking if event exists

                const existingTeam = await ctx.db.team.findFirst({
                    where: { eventId, name: teamName },
                });

                if (existingTeam) {
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: 'Team already exists for this event',
                    });
                }

                const team = await ctx.db.team.create({
                    data: {
                        name: teamName,
                        eventId,
                        Members: {
                            connect: [{ id: userId }],
                        },
                    },
                });

                return { success: true, team };
            } catch (error) {
                if (error instanceof TRPCError) {
                    throw error; // Re-throw known TRPC errors
                } else {
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: 'An unexpected error occurred',
                        cause: error,
                    });
                }
            }
        }),

    //join team
    joinTeam: protectedProcedure
        .input(joinTeamZ)
        .mutation(async ({ input, ctx }) => {
            const { teamId, userId } = input;

            try {
                const team = await ctx.db.team.findUnique({
                    where: { id: teamId },
                    include: { Members: true, Event: true },
                });

                if (!team) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: 'Team not found',
                    });
                }

                if (team.Members.some(member => member.id === userId)) {
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: 'User already in the team',
                    });
                }

                if (team.Event.type === 'SOLO' && team.Members.length === 1) {
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: 'Solo events can only have one member',
                    });
                }

                if (team.Event.type === 'TEAM' && team.Members.length === team.Event.maxTeamSize) {
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: `Team is full. Maximum team size is ${team.Event.maxTeamSize}`,
                    });
                }

                // Add user to the team
                await ctx.db.team.update({
                    where: { id: teamId },
                    data: {
                        Members: {
                            connect: { id: userId },
                        },
                    },
                });

                // Fetch updated team members count
                const updatedTeam = await ctx.db.team.findUnique({
                    where: { id: teamId },
                    include: { Members: true },
                });

                if (!updatedTeam) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: 'Team not found after joining',
                    });
                }

                // Confirm the team if conditions are met
                let isConfirmed = false;
                if (team.Event.type === 'SOLO' && updatedTeam.Members.length === 1) {
                    isConfirmed = true;
                } else if (team.Event.type === 'TEAM' && updatedTeam.Members.length >= team.Event.minTeamSize) {
                    isConfirmed = true;
                }

                if (isConfirmed) {
                    await ctx.db.team.update({
                        where: { id: teamId },
                        data: { isConfirmed: true },
                    });
                }

                return { success: true, team: updatedTeam };
            } catch (error) {
                if (error instanceof TRPCError) {
                    throw error; // Re-throw known TRPC errors
                } else {
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: 'An unexpected error occurred',
                        cause: error,
                    });
                }
            }
        }),


    // Leave a team for a specific event
    leaveTeam: protectedProcedure
        .input(leaveTeamSchema)
        .mutation(async ({ input, ctx }) => {
            const { teamId, userId } = input;

            try {
                const team = await ctx.db.team.findUnique({
                    where: { id: teamId },
                    include: { Members: true, Event: true },
                });

                if (!team) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: 'Team not found',
                    });
                }

                if (team.Members.length <= team.Event.minTeamSize) {
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: 'Cannot leave the team, it will fall below the minimum team size',
                    });
                }

                await ctx.db.team.update({
                    where: { id: teamId },
                    data: {
                        Members: {
                            disconnect: [{ id: userId }],
                        },
                    },
                });

                return { success: true };
            } catch (error) {
                if (error instanceof TRPCError) {
                    throw error; // Re-throw known TRPC errors
                } else {
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: 'An unexpected error occurred',
                        cause: error,
                    });
                }
            }
        }),

    //delete team by team id
    deleteTeam: protectedProcedure
        .input(z.object({
            teamId: z.string(),
        }))
        .mutation(async ({ input, ctx }) => {
            const { teamId } = input;

            try {
                // Check if the team exists
                const team = await ctx.db.team.findUnique({
                    where: { id: teamId },
                });

                if (!team) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: 'Team not found',
                    });
                }

                // Delete the team
                await ctx.db.team.delete({
                    where: { id: teamId },
                });

                return { success: true, message: 'Team deleted successfully' };
            } catch (error) {
                if (error instanceof TRPCError) {
                    throw error; // Re-throw known TRPC errors
                } else {
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: 'An unexpected error occurred',
                        cause: error,
                    });
                }
            }
        }),

    // Get all teams with team details of a particular user
    getTeamsByUserId: protectedProcedure
        .input(z.string())
        .query(async ({ input, ctx }) => {
            try {
                const teams = await ctx.db.team.findMany({
                    where: {
                        Members: { some: { id: input } },
                    },
                    include: { Members: true, Event: true },
                });

                return { success: true, teams };
            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'An unexpected error occurred while fetching teams by user ID',
                    cause: error,
                });
            }
        }),

    // Get all team list with info of a particular event
    getTeamsByEventIdForAdmin: adminProcedure
        .input(z.string())
        .query(async ({ input, ctx }) => {
            try {
                const teams = await ctx.db.team.findMany({
                    where: { eventId: input },
                    include: { Members: true, Event: true },
                });

                return { success: true, teams };
            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'An unexpected error occurred while fetching teams by event ID',
                    cause: error,
                });
            }
        }),

});
