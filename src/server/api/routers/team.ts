import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { findEventIfExistById } from '~/utils/helper/findEventById';
import { createTeamZ, joinTeamZ, leaveTeamSchema, searchTeamForEventz } from '~/server/schema/zod-schema';





export const teamRouter = createTRPCRouter({

    // Create a team for a specific event
    createTeam: protectedProcedure
        .input(createTeamZ)
        .mutation(async ({ input, ctx }) => {
            const { eventId, teamName, userId } = input;

            try {
                // Check if the event exists
                await findEventIfExistById(eventId);

                // Check if the team name already exists for the event
                const existingTeam = await ctx.db.team.findFirst({
                    where: { eventId, name: teamName },
                });

                if (existingTeam) {
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: 'Team already exists for this event',
                    });
                }

                // Check if the user is already in a team for the event
                const userTeam = await ctx.db.team.findFirst({
                    where: {
                        eventId,
                        Members: {
                            some: {
                                id: userId,
                            },
                        },
                    },
                });

                if (userTeam) {
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: 'User is already in a team for this event',
                    });
                }

                // Create the new team and add the user as a member
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

                // Check if the user is already in the team
                if (team.Members.some(member => member.id === userId)) {
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: 'User already in the team',
                    });
                }

                // Check if the user is already in another team for the same event
                const userTeamsForEvent = await ctx.db.team.findMany({
                    where: {
                        eventId: team.eventId,
                        Members: {
                            some: {
                                id: userId,
                            },
                        },
                    },
                });

                if (userTeamsForEvent.length > 0) {
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: 'User is already in another team for this event',
                    });
                }

                // Check if the team is full based on event type
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


    // confrim team 
    confirmTeam: protectedProcedure
        .input(z.object({
            teamId: z.string(),
        }))
        .mutation(async ({ input, ctx }) => {
            const { teamId } = input;

            try {
                // Fetch the team and include its members and associated event details
                const team = await ctx.db.team.findUnique({
                    where: { id: teamId },
                    include: { Members: true, Event: true },
                });

                // Check if the team exists
                if (!team) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: 'Team not found',
                    });
                }

                // Check the event type and member count
                if (team.Event.type === 'SOLO') {
                    if (team.Members.length !== 1) {
                        throw new TRPCError({
                            code: 'BAD_REQUEST',
                            message: 'Solo events must have exactly one member',
                        });
                    }
                } else if (team.Event.type === 'TEAM') {
                    if (team.Members.length < team.Event.minTeamSize || team.Members.length > team.Event.maxTeamSize) {
                        throw new TRPCError({
                            code: 'BAD_REQUEST',
                            message: `Team size must be between ${team.Event.minTeamSize} and ${team.Event.maxTeamSize}`,
                        });
                    }
                } else {
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: 'Invalid event type',
                    });
                }

                // Mark the team as confirmed
                await ctx.db.team.update({
                    where: { id: teamId },
                    data: {
                        isConfirmed: true,
                    },
                });

                return { success: true, message: 'Team confirmed successfully' };
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

                if (team.isConfirmed == true) {
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: 'Cannot leave the team, has it is confrimed',
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

    // Endpoint to list teams for an event that are not full,(user searching for a team which is empty that he can join in last Min)
    listAvailableTeams: protectedProcedure
        .input(searchTeamForEventz)
        .query(async ({ input, ctx }) => {
            const { eventId, userId } = input;

            try {
                // Fetch the event to ensure it exists
                const event = await ctx.db.event.findUnique({
                    where: { id: eventId },
                });

                if (!event) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: 'Event not found',
                    });
                }

                // Fetch all teams for the event
                const teams = await ctx.db.team.findMany({
                    where: { eventId },
                    include: { Members: true, Event: true },
                });

                // Get the IDs of teams that the user is already a member of
                const userTeams = teams
                    .filter(team => team.Members.some(member => member.id === userId))
                    .map(team => team.id);

                // Filter out teams that are full or already include the user
                const availableTeams = teams.filter(team =>
                    team.Event.type === 'TEAM' &&
                    team.Members.length < event.maxTeamSize &&
                    !userTeams.includes(team.id)
                );

                console.log("Available teams:", availableTeams); // Debugging output

                return { success: true, availableTeams };
            } catch (error) {
                console.error("Error fetching available teams:", error);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'An unexpected error occurred',
                    cause: error,
                });
            }
        }),




    // Get all team list with info of a particular event
    getTeamsByEventIdForAdmin: protectedProcedure
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
