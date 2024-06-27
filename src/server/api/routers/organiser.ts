import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import type { Prisma } from "@prisma/client";

const createType = z.object({
  userId: z.string(),
  eventId: z.string(),
});


const updateType = z.object({
  userId: z.string().optional(),
  eventId: z.string(),
  newUserId: z.string().optional(),
  newEventId: z.string().optional(),
});

const getOneType = z.object({
  userId: z.string().optional(),
  eventId: z
    .string({ message: "include both Fields to get unique organiser" })
    .optional(),
});

export const organisorRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.organiser.findMany();
  }),

  create: protectedProcedure
    .input(createType)
    .mutation(async ({ ctx, input }) => {
      if (!input.userId || !input.eventId) {
        throw new Error("Both userId and eventId are needed");
      }

      if (
        await ctx.db.organiser.findFirst({
          where: {
            userId: input.userId,
            eventId: input.eventId,
          } as Prisma.OrganiserWhereInput,
        })
      ) {
        throw new Error("Organiser already exists");
      }

      return await ctx.db.organiser.create({
        data: { userId: input.userId, eventId: input.eventId },
      });
    }),

  //publicProcedure might be needed for users who want to get Organiser details without loggin in...i.e if in hurry
  getOne: publicProcedure.input(getOneType).query(async ({ ctx, input }) => {
    if (!input.userId && !input.eventId) {
      throw new Error("Either userId or eventId is needed as input");
    }
    const { userId, eventId } = input;
    return await ctx.db.organiser.findMany({
      where: {
        ...(userId && { userId }),
        ...(eventId && { eventId }),
      },
    });
  }),

  update: protectedProcedure
    .input(updateType)
    .mutation(async ({ ctx, input }) => {
      const { userId, eventId, newUserId, newEventId } = input;

      return await ctx.db.organiser.update({
        where: {
          ...(userId && { userId }),
          eventId,
        } as Prisma.OrganiserWhereUniqueInput,
        data: {
          ...(newUserId && { newUserId }),
          ...(newEventId && { newEventId }),
        } as Prisma.OrganiserUpdateInput,
      });
    }),

  delete: protectedProcedure
    .input(createType)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.organiser.delete({
        where: {
          userId: input.userId,
          eventId: input.eventId,
        } as Prisma.OrganiserWhereUniqueInput,
      });
    }),
});
