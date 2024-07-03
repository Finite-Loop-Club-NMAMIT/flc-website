import { z } from "zod";
import { adminProcedure, createTRPCRouter, protectedProcedure, } from "../trpc";
import { TRPCError } from "@trpc/server";
import { sendActivityPointsUpdateEmail } from "~/utils/nodemailer/nodemailer";


export const activityPointsRouter = createTRPCRouter({
    //remove activy points
    addActivityPointsForEvent: adminProcedure
        .input(z.object({
            name: z.string(),
            eventId: z.string(),
            points: z.number(),
        }))
        .mutation(async ({ input, ctx }) => {
            try {
                const { eventId, points, name } = input;
                // Create new activity point record
                const activityPoint = await ctx.db.activityPoint.create({
                    data: {
                        eventId: eventId,
                        point: points,
                        name: name, 
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
    //update activyPoints
    updateActivityPointsForEvent: adminProcedure
        .input(z.object({
            id: z.string(),
            name: z.string().optional(),
            eventId: z.string().optional(),
            points: z.number().optional(),
        }))
        .mutation(async ({ input, ctx }) => {
            try {
                const { id, name, eventId, points } = input;

                // Check if there's already an ActivityPoint record for this event
                let activityPoint = await ctx.db.activityPoint.findFirst({
                    where: {
                        id: id,
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
                        name: name,
                        eventId: eventId,
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
    //here   the users passed , will be connect to perticulae activitypoint model , and update there totalacitivy points
    manuallyAddUsersToActivityPoint: adminProcedure
        .input(z.object({
            activityPointId: z.string(),
            userIds: z.array(z.string()),
        }))
        .mutation(async ({ input, ctx }) => {
            try {
                const { activityPointId, userIds } = input;

                // Fetch the activity point to validate existence
                const activityPoint = await ctx.db.activityPoint.findUnique({
                    where: { id: activityPointId },
                    include: { User: true }, // Include users connected to this activity point
                });

                if (!activityPoint) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: `Activity point with ID ${activityPointId} not found`,
                    });
                }

                // Loop through user IDs and connect each to the activity point
                for (const userId of userIds) {
                    // Check if user is already connected to this activity point
                    const isUserConnected = activityPoint.User.some(user => user.id === userId);

                    if (!isUserConnected) {
                        // Connect the user to the activity point
                        await ctx.db.activityPoint.update({
                            where: { id: activityPointId },
                            data: {
                                User: {
                                    connect: { id: userId },
                                },
                            },
                        });

                        // Fetch user to update totalActivityPoints
                        const user = await ctx.db.user.findUnique({
                            where: { id: userId },
                        });

                        if (user) {
                            // Add points to user's totalActivityPoints
                            await ctx.db.user.update({
                                where: { id: userId },
                                data: {
                                    totalActivityPoints: user.totalActivityPoints + activityPoint.point,
                                },
                            });
                        }
                    }
                }

                return true; // Success
            } catch (error) {
                console.error('Add Users to Activity Point Error:', error);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Something went wrong while adding users to activity point',
                    cause: error,
                });
            }
        }),
    //when this hits , it removes all users from activy points and then add the users that r passed
    updateUsersActivityPointsForActivityPoint: adminProcedure
        .input(z.object({
            activityPointId: z.string(),
            userIds: z.array(z.string()),
        }))
        .mutation(async ({ input, ctx }) => {
            try {
                const { activityPointId, userIds } = input;

                // Fetch the activity point to validate existence
                const activityPoint = await ctx.db.activityPoint.findUnique({
                    where: { id: activityPointId },
                    include: { User: true }, // Include users connected to this activity point
                });

                if (!activityPoint) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: `Activity point with ID ${activityPointId} not found`,
                    });
                }

                // Disconnect all existing users from this activity point
                await ctx.db.activityPoint.update({
                    where: { id: activityPointId },
                    data: {
                        User: {
                            disconnect: activityPoint.User.map(user => ({ id: user.id })),
                        },
                    },
                });

                // Connect the new list of users to the activity point
                for (const userId of userIds) {
                    // Connect the user to the activity point
                    await ctx.db.activityPoint.update({
                        where: { id: activityPointId },
                        data: {
                            User: {
                                connect: { id: userId },
                            },
                        },
                    });

                    // Fetch user to update totalActivityPoints
                    const user = await ctx.db.user.findUnique({
                        where: { id: userId },
                    });

                    if (user) {
                        // Subtract points from user's totalActivityPoints
                        await ctx.db.user.update({
                            where: { id: userId },
                            data: {
                                totalActivityPoints: user.totalActivityPoints - activityPoint.point,
                            },
                        });
                    }
                }

                return true; // Success
            } catch (error) {
                console.error('Update Users Activity Points for Activity Point Error:', error);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Something went wrong while updating users activity points for activity point',
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
