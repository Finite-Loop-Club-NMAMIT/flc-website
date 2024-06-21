import { createTRPCRouter, publicProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { createWinnerZ, editWinnerTypeZ, getWinnersByEventIdZ } from '~/server/schema/zod-schema';
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

                // Check if the winner type already exists for the event
                const existingWinner = await ctx.db.winner.findFirst({
                    where: {
                        eventId: eventId,
                        winnerType: winnerType,
                    },
                });

                if (existingWinner) {
                    throw new TRPCError({
                        code: 'CONFLICT',
                        message: `Winner type ${winnerType} for this event is already mentioned`,
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

    //edit winnerType by winnerId
    editWinnerType: publicProcedure
        .input(editWinnerTypeZ)
        .mutation(async ({ input, ctx }) => {
            const { winnerId, winnerType } = input;

            try {
                // Find the existing winner by winnerId
                const existingWinner = await ctx.db.winner.findUnique({
                    where: { id: winnerId },
                });

                if (!existingWinner) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: 'Winner not found',
                    });
                }

                // Update the winnerType
                const updatedWinner = await ctx.db.winner.update({
                    where: { id: winnerId },
                    data: { winnerType },
                });

                return { success: true, winner: updatedWinner };
            } catch (error) {
                if (error instanceof TRPCError) {
                    throw error;
                } else {
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: 'An error occurred while editing winner type',
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
                await findEventIfExistById(input)

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