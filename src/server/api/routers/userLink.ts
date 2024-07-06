import {
  createUserLinkZ,
  deleteUserLinkZ,
  getUserLinksZ,
} from "~/zod/userLinkZ";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const userLinkRouter = createTRPCRouter({
  createUserLink: protectedProcedure
    .input(createUserLinkZ)
    .mutation(async ({ ctx, input }) => {
      const duplicate = await ctx.db.userLink.findFirst({
        where: {
          ...input,
        },
      });

      if (duplicate) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `This link alreadty exist with id: ${duplicate.id}`,
        });
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

  getUserLinks: protectedProcedure
    .input(getUserLinksZ)
    .query(async ({ ctx, input }) => {
      return await ctx.db.userLink.findMany({
        where: {
          userId: input.userId,
        },
        include: {
          User: true,
        },
      });
    }),

  deleteUserLink: protectedProcedure
    .input(deleteUserLinkZ)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.userLink.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
