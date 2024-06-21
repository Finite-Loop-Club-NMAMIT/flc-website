import { createTRPCRouter, publicProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { createWinnerZ, getWinnersByEventIdZ } from '~/server/schema/zod-schema';
import { findEventIfExistById } from '~/utils/findEventById';




export const winnerRouter = createTRPCRouter({
    // Create a winner for a team in an event
    createWinner: publicProcedure
        .input(createWinnerZ)
        .mutation(async ({ input, ctx }) => {
            const { eventId, teamId, winnerType } = input;

            try {
                // Check if the event exists and is completed
                const event = await findEventIfExistById(eventId)

                if (event.state !== 'COMPLETED') {
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: 'Event must be in completed state to declare winners',
                    });
                }

                // Check if the team exists for the event and is confirmed and has attended
                const team = await ctx.db.team.findUnique({
                    where: { id: teamId, eventId },
                    include: { Event: true },
                });

                if (!team) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: 'Team not found for this event',
                    });
                }

                if (!team.isConfirmed) {
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: 'Team must be confirmed to declare as winner',
                    });
                }

                if (!team.hasAttended) {
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: 'Team must have attended the event to declare as winner',
                    });
                }

                // Create the winner record
                const winner = await ctx.db.winner.create({
                    data: {
                        winnerType,
                        eventId,
                        teamId,
                    },
                });

                return { success: true, winner };
            } catch (error) {
                if (error instanceof TRPCError) {
                    throw error;
                } else {
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: 'An error occurred while creating winner',
                    });
                }
            }
        }),

    // Get winners for a specific event
    getWinnersByEventId: publicProcedure
        .input(getWinnersByEventIdZ)
        .query(async ({ input, ctx }) => {
            try {
                // Check if the event exists
                const event = await ctx.db.event.findUnique({
                    where: { id: input },
                });

                if (!event) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: 'Event not found',
                    });
                }

                // Fetch winners for the event with team details including members
                const winners = await ctx.db.winner.findMany({
                    where: { eventId: input },
                    include: {
                        Event: true,
                        Team: {

                            include: { Members: true, Event: true },
                        },
                       
                    },
                });
                return { success: true, winners };
            } catch (error) {
                if (error instanceof TRPCError) {
                    throw error; // Rethrow TRPCError directly
                } else {
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: 'An error occurred while fetching winners',
                    });
                }
            }
        }),
});