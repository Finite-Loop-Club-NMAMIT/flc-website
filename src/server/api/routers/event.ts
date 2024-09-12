import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createEventZ,
  deleteEventZ,
  getEventByIdZ,
  getEventByStateZ,
  setEventStateZ,
  toggleEventLegacyZ,
  updateEventZ,
} from "~/zod/eventZ";

import {
  adminProcedure,
  createTRPCRouter,
  organiserProcedure,
  protectedProcedure,
  publicProcedure,
} from "../trpc";

const eventRouter = createTRPCRouter({
  createEvent: adminProcedure
    .input(createEventZ)
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.event.create({
          data: {
            ...input,
          },
        });
      } catch (error) {
        console.error("Create Event Error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong while creating the event",
        });
      }
    }),

  updateEvent: adminProcedure
    .input(updateEventZ)
    .mutation(async ({ ctx, input }) => {
      try {
        const existingEvent = await ctx.db.event.findUniqueOrThrow({
          where: { id: input.id },
        });

        if (existingEvent.state !== "DRAFT") {
          //Can only be edited when in draft
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Cannot update event unless it's in draft",
          });
        }

        return await ctx.db.event.update({
          where: { id: existingEvent.id },
          data: {
            ...input,
            fromDate: input.fromDate
              ? new Date(input.fromDate)
              : existingEvent.fromDate,
            deadline: input.deadline
              ? new Date(input.deadline)
              : existingEvent.deadline,
            toDate: input.toDate
              ? new Date(input.toDate)
              : existingEvent.toDate,
          },
        });
      } catch (error) {
        console.error("Update Event Error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong while updating the event",
        });
      }
    }),

  deleteEvent: adminProcedure
    .input(deleteEventZ)
    .mutation(async ({ ctx, input }) => {
      try {
        const eventexists = await ctx.db.event.findUniqueOrThrow({
          where: { id: input.eventId },
        });

        if (eventexists.state !== "DRAFT") {
          throw new Error("Event can't be deleted unless in draft");
        }

        return await ctx.db.event.delete({
          where: { id: input.eventId },
        });
      } catch (error) {
        console.error("Delete event Error", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong while deleting Event",
        });
      }
    }),

  setEventState: adminProcedure
    .input(setEventStateZ)
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.event.update({
        where: {
          id: input.eventId,
        },
        data: {
          state: input.state,
        },
      });
    }),

  // Set Event Legacy to True Or flase (Admin)-->
  toggleEventLegacy: adminProcedure
    .input(toggleEventLegacyZ)
    .mutation(async ({ input, ctx }) => {
      try {
        const event = await ctx.db.event.findUniqueOrThrow({
          where: { id: input.eventId },
        });
        await ctx.db.event.update({
          where: { id: input.eventId },
          data: {
            isLegacy: !event?.isLegacy,
          },
        });
      } catch (error) {
        console.error("Set Event Legacy Error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong while setting the event isLegacy",
        });
      }
    }),

  //Retrieve
  getLegacyEvents: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.event.findMany({
      where: {
        isLegacy: true,
      },
      include: {
        ActivityPoint: true,
        Organiser: true,
      },
      orderBy: {
        fromDate: "desc",
      },
    });
  }),

  getPublishedEvents: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.event.findMany({
      where: {
        AND: [
          {
            state: "PUBLISHED",
          },
        ],
      },
      include: {
        ActivityPoint: true,
        Organiser: true,
      },
    });
  }),

  getAllEventsForUser: publicProcedure
    .input(z.object({ year: z.string() }))
    .query(async ({ input, ctx }) => {
      const { year } = input;

      const startDate = new Date(`${year}-07-01T00:00:00.000Z`); // Start of the academic year
      const endDate = new Date(`${parseInt(year) + 1}-05-31T23:59:59.999Z`); // End of the academic year

      const fetchedEvents = await ctx.db.event.findMany({
        where: {
          state: {
            not: "DRAFT",
          },
          fromDate: {
            gte: startDate,
            lt: endDate,
          },
        },
        include: {
          ActivityPoint: true,
          Organiser: true,
        },
        orderBy: {
          fromDate: "desc",
        },
      });

      return fetchedEvents;
    }),

  getAllEventsForAdmin: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.event.findMany({
      include: {
        ActivityPoint: true,
        Organiser: true,
      },
      orderBy: {
        fromDate: "desc",
      },
    });
  }),
  getAllEventsForAdminByState: adminProcedure
    .input(getEventByStateZ)
    .query(async ({ input, ctx }) => {
      const { state } = input;
      return ctx.db.event.findMany({
        where: {
          state: state,
        },
        include: {
          _count: {
            select: {
              Team: true,
            },
          },
        },

        orderBy: {
          fromDate: "desc",
        },
      });
    }),

  getAllEventsForOrganiser: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.event.findMany({
      where: {
        Organiser: {
          some: {
            userId: ctx.session?.user?.id,
          },
        },
      },
      orderBy: {
        fromDate: "desc",
      },
    });
  }),

  getEventById:organiserProcedure
  .input(getEventByIdZ)
  .query(async ({ ctx, input }) => {
    const event = await ctx.db.event.findUnique({ 
      where: { id: input.eventId }, 
      include:{
        Team : {
          include: {
            Members: true,
          }
        }
      }
    })
    if (!event) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Event not found",
      });
    }
    return event
  }),

  getAvatarGroup: publicProcedure
    .input(getEventByIdZ)
    .query(async ({ ctx, input }) => {
      const event = await ctx.db.event.findUnique({
        where: { id: input.eventId },
        include: {
          Organiser: {
            select: {
              User: {
                select: {
                  name: true,
                  email: true,
                  phone: true,
                },
              },
            },
          },
          Team: {
            select: {
              Members: {
                where: {
                  image: {
                    not: null,
                  },
                },
                select: {
                  image: true,
                },
                orderBy: {
                  id: "asc",
                },
                take: 4,
              },
            },
          },
        },
      });

      if (!event) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Event not found",
        });
      }

      const images = event?.Team.flatMap((team) =>
        team.Members.map((member) => member.image),
      );

      const teamCount = await ctx.db.team.count({
        where: {
          eventId: input.eventId,
        },
      });

      console.log(
        "HELLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLO",
        event,
        "Images",
        images,
      );

      return { ...event, teamCount, selectedImages: images };
    }),
});

export default eventRouter;
