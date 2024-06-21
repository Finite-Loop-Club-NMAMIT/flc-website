
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc"
import { EVENT_STATE } from "@prisma/client";
import { z } from "zod";
import { findEventIfExistById } from "~/utils/helper/findEventById";
import { createEventSchema, setEventLegacySchema, setEventStateSchema, updateEventSchema } from "~/server/schema/zod-schema";



export const eventRouter = createTRPCRouter({
    //Create New Event(Admin)--->
    createEvent: publicProcedure
        .input(createEventSchema)
        .mutation(async ({ ctx, input }) => {
            try {
                const data = {
                    ...input,
                    deadline: input.deadline ? new Date(input.deadline) : undefined,
                    fromDate: new Date(input.fromDate),
                    toDate: new Date(input.toDate),
                };

                return await ctx.db.event.create({ data });
            } catch (error) {
                console.error('Create Event Error:', error);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Something went wrong while creating the event',
                });
            }
        }),

    updateEvent: publicProcedure
        .input(updateEventSchema)
        .mutation(async ({ ctx, input }) => {
            try {
                const existingEvent = await findEventIfExistById(input.eventId ?? '')
                if (existingEvent.state === EVENT_STATE.PUBLISHED) { //IT can be edited if it's in DRAFT and COMPLETED state
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: 'Cannot update event when it is in "PUBLISHED" state',
                    });
                }

                delete input?.eventId; //removed eventId to prevent interference with data:{} param

                return await ctx.db.event.update({
                    where: { id: existingEvent.id },
                    data: {
                        ...input,
                        fromDate: input.fromDate ? new Date(input.fromDate) : existingEvent.fromDate,
                        deadline: input.deadline ? new Date(input.deadline) : existingEvent.deadline,
                        toDate: input.toDate ? new Date(input.toDate) : existingEvent.toDate,
                    },
                });
            } catch (error) {
                console.error('Update Event Error:', error);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Something went wrong while updating the event',
                });
            }
        }),

    //Delete Event By Its ID(Admin)--->   
    DeleteEvent: publicProcedure
        .input(z.object({ eventId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            try {
                const eventexists = await ctx.db.event.findFirst({ where: { id: input.eventId } })

                if (!eventexists) {
                    throw new Error("Event with the given id does not exist")
                }
                
            
                if (eventexists.state === EVENT_STATE.PUBLISHED) {
                    throw new Error("Event  can't be deleted when it's in Published state")
                }

                return await ctx.db.event.delete({
                    where: { id: input.eventId }
                })
            } catch (error) {
                console.error('Delete event Error', error);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Something went wrong while deleting Event'
                });
            }

        }),
    // Set Event state to "DRAFT","PUBLISHED","COMPLETED"(Admin)------>
    setEventState: publicProcedure
        .input(setEventStateSchema)
        .mutation(async ({ input, ctx }) => {
            // if (
            //     ctx.session.user.role !== "ADMIN"
            // ) {
            //     throw new TRPCError({
            //         code: "BAD_REQUEST",
            //         message: "Only Admins Can Create Events",
            //     });
            // }
            try {

                await findEventIfExistById(input.id);
                await ctx.db.event.update({
                    where: { id: input.id },
                    data: {
                        ...input,
                    },
                });
            } catch (error) {
                console.error('Set Event State Error:', error);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Something went wrong while setting the event state',
                });
            }
        }),
    // Set Event Legacy to True Or flase (Admin)-->
    setEventLegacy: publicProcedure
        .input(setEventLegacySchema)
        .mutation(async ({ input, ctx }) => {
            // if (
            //     ctx.session.user.role !== "ADMIN"
            // ) {
            //     throw new TRPCError({
            //         code: "BAD_REQUEST",
            //         message: "Only Admins Can Create Events",
            //     });
            // }
            try {
                await findEventIfExistById(input.id);
                await ctx.db.event.update({
                    where: { id: input.id },
                    data: {
                        isLegacy: input.isLegacy,
                    },
                });
            } catch (error) {
                console.error('Set Event Legacy Error:', error);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Something went wrong while setting the event isLegacy',
                });
            }
        }),
    // Get all events(All)--->
    getAllEvents: publicProcedure
        .query(async ({ ctx }) => {
            try {
                const events = await ctx.db.event.findMany();
                return events;
            } catch (error) {
                console.error('Get All Events Error:', error);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Something went wrong while fetching all events',
                });
            }
        }),
    //get all Published events(All)--->
    getAllPublishedEvents: publicProcedure
        .query(async ({ ctx }) => {
            try {
                const publishedEvents = await ctx.db.event.findMany({
                    where: { state: EVENT_STATE.PUBLISHED },
                });
                return publishedEvents;
            } catch (error) {
                console.error('Get All Published Events Error:', error);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Something went wrong while fetching all published events',
                });
            }
        }),
    //Get all Upcommming "DRAFT" events(All) -->
    getAllDraftEvents: publicProcedure
        .query(async ({ ctx }) => {
            try {
                // Fetch all draft events
                const draftEvents = await ctx.db.event.findMany({
                    where: { state: EVENT_STATE.DRAFT },
                });

                // Return the fetched draft events
                return draftEvents;
            } catch (error) {
                console.error('Get All Draft Events Error:', error);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Something went wrong while fetching all draft events',
                });
            }
        }),
    //Get all Completed events(All) -->
    getAllCompletedEvents: publicProcedure
        .query(async ({ ctx }) => {
            try {
                // Fetch all completed events
                const completedEvents = await ctx.db.event.findMany({
                    where: { state: EVENT_STATE.COMPLETED },
                });

                // Return the fetched completed events
                return completedEvents;
            } catch (error) {
                console.error('Get All Completed Events Error:', error);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Something went wrong while fetching all completed events',
                });
            }
        }),
    //get all events which are isLegacy
    getAllLegacyEvents: publicProcedure
        .query(async ({ ctx }) => {
            try {
                const legacyEvents = await ctx.db.event.findMany({
                    where: { isLegacy: true },
                });
                return legacyEvents;
            } catch (error) {
                console.error('Get All Legacy Events Error:', error);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Something went wrong while fetching all legacy events',
                });
            }
        }),
    // get all sorted "PUBLISHED" events
    getPublishedEvents: publicProcedure
        .query(async ({ ctx }) => {
            try {
                // Fetch published events sorted by date
                const publishedEvents = await ctx.db.event.findMany({
                    where: { state: EVENT_STATE.PUBLISHED },
                    orderBy: { fromDate: 'asc' }, // Sort by fromDate (date wise)
                });

                // Return the fetched published events
                return publishedEvents;
            } catch (error) {
                console.error('Get Published Events Error:', error);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Something went wrong while fetching published events',
                });
            }
        }),
    // get all sorted "PUBLISHED" events which are Legacy
    getPublishedAndLegacyEvents: publicProcedure
        .query(async ({ ctx }) => {
            try {
                // Fetch published and legacy events sorted by date
                const publishedAndLegacyEvents = await ctx.db.event.findMany({
                    where: {
                      state: EVENT_STATE.PUBLISHED,
                      isLegacy: true,
                    },
                    orderBy: [
                      { isLegacy: 'desc' }, 
                      { fromDate: 'asc' }, 
                    ],
                  });
                // Return the fetched published and legacy events
                return publishedAndLegacyEvents;
            } catch (error) {
                console.error('Get Published and Legacy Events Error:', error);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Something went wrong while fetching published and legacy events',
                });
            }
        }),
    //get all events by its State by input--->
    getEventByState: publicProcedure
        .input(setEventStateSchema)
        .query(async ({ input, ctx }) => {
            try {
                // Fetch events based on the specified state
                const events = await ctx.db.event.findMany({
                    where: { state: input.state },
                });

              
                return events;
            } catch (error) {
                console.error('Get Event By State Error:', error);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Something went wrong while fetching events by state',
                });
            }
        }),
});