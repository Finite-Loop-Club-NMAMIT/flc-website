import { z } from "zod";
import { createTRPCRouter, publicProcedure,protectedProcedure } from "../trpc";
import type { Prisma } from "@prisma/client";

const createType= z.object({
        url: z.string(),
        linkName: z.string(),
        userId: z.string(),
      })

const updateType = z.object({
  id:z.string(),
  newUrl: z.string().optional(),
  newLinkName: z.string().optional(),
  newUserId: z.string().optional(),
});



//switch to protectedProcedure after auth is done
export const userLinkRouter = createTRPCRouter({
  create: publicProcedure.input(createType).mutation(async ({ ctx, input }) => {
    const duplicate = await ctx.db.userLink.findFirst({
      where: {
        ...input,
      },
    });

    if (duplicate) {
      throw new Error(`This link alreadty exist with id: ${duplicate.id}`);
    }
    const newUserLink = await ctx.db.userLink.create({
      data: {
        url: input.url,
        linkName: input.linkName,
        userId: input.userId,
      },
    });
    return newUserLink;
  }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.userLink.findMany();
  }),

  getOne: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.userLink.findFirst({
        where: {
          userId: input.userId,
        },
        include: {
          User: true,
        },
      });
    }),

  update: protectedProcedure
    .input(updateType)
    .mutation(async ({ ctx, input }) => {
      const userUrl = await ctx.db.userLink.findFirst({
        where: { id: input.id },
      });
      if (!userUrl) {
        throw new Error("No such UserUrl entity");
      }

      return await ctx.db.userLink.update({
        where: {
          id: input.id,
        },
        data: {
          url: input.newUrl ?? userUrl.url,
          linkName: input.newLinkName ?? userUrl.linkName,
          userId: input.newUserId ?? userUrl.userId,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string(), url: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.userLink.delete({
        where: {
          ...input,
        } as Prisma.UserLinkWhereUniqueInput,
      });
    }),
});
