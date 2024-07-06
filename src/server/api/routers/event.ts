import { TRPCError } from "@trpc/server";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../trpc";

import {
  createEventZ,
  deleteEventZ,
  getEventByIdZ,
  setEventStateZ,
  toggleEventLegacyZ,
  updateEventZ,
} from "~/zod/eventZ";
import { findEventIfExistById } from "~/utils/helper";

export const eventRouter = createTRPCRouter({
  createEvent: adminProcedure
    .input(createEventZ)
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
        const existingEvent = await findEventIfExistById(input.eventId ?? "");
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
        const eventexists = await findEventIfExistById(input.eventId);

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
        const event = await findEventIfExistById(input.eventId);
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
  getAllEvents: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.event.findMany({
      where: {
        AND: [
          {
            state: "PUBLISHED",
          },
          {
            isLegacy: true,
          },
        ],
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

  getEventById: publicProcedure
    .input(getEventByIdZ)
    .query(async ({ ctx, input }) => {
      const event = await ctx.db.event.findUnique({
        where: { id: input.eventId },
      });
      if (!event) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Event not found",
        });
      }
    }),
});
