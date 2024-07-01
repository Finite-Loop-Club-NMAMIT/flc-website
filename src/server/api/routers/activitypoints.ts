import { z } from "zod";
import { adminProcedure, createTRPCRouter, protectedProcedure, } from "../trpc";
import { TRPCError } from "@trpc/server";
import { sendActivityPointsUpdateEmail } from "~/utils/nodemailer/nodemailer";


export const activityPointsRouter = createTRPCRouter({
    addActivityPointsForEvent: adminProcedure
        .input(z.object({
            eventId: z.string(),
            points: z.number(),
        }))
        .mutation(async ({ input, ctx }) => {
            try {
                const { eventId, points } = input;

                // Check if there's already an ActivityPoint record for this event
                let activityPoint = await ctx.db.activityPoint.findFirst({
                    where: {
                        eventId: eventId,
                    },
                });

                if (activityPoint) {
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: `Activity points already exist for event ${eventId}`,
                    });
                }

                // Create new activity point record
                activityPoint = await ctx.db.activityPoint.create({
                    data: {
                        eventId: eventId,
                        point: points,
                        name: eventId, // Adjust based on your schema
                    },
                });

                return activityPoint;
            } catch (error) {
                console.error('Add Activity Points Error:', error);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Something went wrong while adding activity points',
                    cause: error,
                });
            }
        }),

    updateActivityPointsForEvent: adminProcedure
        .input(z.object({
            eventId: z.string(),
            points: z.number(),
        }))
        .mutation(async ({ input, ctx }) => {
            try {
                const { eventId, points } = input;

                // Check if there's already an ActivityPoint record for this event
                let activityPoint = await ctx.db.activityPoint.findFirst({
                    where: {
                        eventId: eventId,
                    },
                });

                if (!activityPoint) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: `Activity points do not exist for event ${eventId}`,
                    });
                }

                // Update existing activity point record
                activityPoint = await ctx.db.activityPoint.update({
                    where: {
                        id: activityPoint.id,
                    },
                    data: {
                        point: {
                            increment: points,
                        },
                    },
                });

                return activityPoint;
            } catch (error) {
                console.error('Update Activity Points Error:', error);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Something went wrong while updating activity points',
                    cause: error,
                });
            }
        }),
    // when this endpoint hits , it will go through all users , check ther certification with activity points , and calaculate toal acctivity points and adds
    calculateAndUpdateTotalActivityPoints: protectedProcedure
        .mutation(async ({ ctx }) => {
            try {
                // Fetch all users
                const users = await ctx.db.user.findMany();

                // Loop through each user
                for (const user of users) {
                    let totalActivityPoints = 0;

                    // Fetch certificates for the user
                    const certificates = await ctx.db.certificate.findMany({
                        where: {
                            userId: user.id,
                        },
                        select: {
                            id: true,
                            eventId: true,
                        },
                    });

                    // Loop through each certificate
                    for (const certificate of certificates) {
                        // Fetch activity points for the event related to the certificate
                        const activityPoint = await ctx.db.activityPoint.findFirst({
                            where: {
                                eventId: certificate.eventId,
                            },
                            select: {
                                id: true,
                                point: true,
                                Event: {
                                    select: {
                                        name: true,
                                    },
                                },
                                User: {
                                    select: {
                                        id: true,
                                    },
                                },
                            },
                        });

                        if (activityPoint) {
                            // Check if the user is already connected to the activity point
                            const isUserConnected = activityPoint.User.some(
                                (activityUser) => activityUser.id === user.id
                            );

                            if (!isUserConnected) {
                                // Connect the user to the activity point
                                await ctx.db.activityPoint.update({
                                    where: {
                                        id: activityPoint.id,
                                    },
                                    data: {
                                        User: {
                                            connect: {
                                                id: user.id,
                                            },
                                        },
                                    },
                                });
                                await sendActivityPointsUpdateEmail(user.email, user.name, activityPoint.point, activityPoint.Event?.name ?? "");
                            }

                            // Add activity points to totalActivityPoints
                            totalActivityPoints += activityPoint.point;
                        }

                    }
                    console.log(totalActivityPoints);

                    // Update the user's totalActivityPoints
                    await ctx.db.user.update({
                        where: {
                            id: user.id,
                        },
                        data: {
                            totalActivityPoints: totalActivityPoints,
                        },
                    });
                }

                return true; // Success
            } catch (error) {
                console.error('Calculate and Update Total Activity Points Error:', error);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Something went wrong while calculating and updating total activity points',
                    cause: error,
                });
            }
        }),
});
