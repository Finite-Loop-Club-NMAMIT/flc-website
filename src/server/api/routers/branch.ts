import {z} from "zod"

import { createTRPCRouter,protectedProcedure,publicProcedure } from "../trpc"
import type { Prisma } from "@prisma/client";


//switch to protectedProcedure after auth is done
export const branchRouter = createTRPCRouter({
  getAllBranch: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.branch.findMany({});
  }),

  createBranch: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.branch.create({
        data: {
          name: input.name,
        },
      });
    }),

  deleteBranch: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id: branchId } = (await ctx.db.branch.findFirst({
        where: {
          name: input.name,
        },
      })) as { id: string };
      return await ctx.db.branch.delete({
        where: {
          id: branchId,
        },
      });
    }),

  getOnePopulatedBranch: protectedProcedure
    .input(z.object({ branchId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.branch.findUniqueOrThrow({
        where: {
          id: input.branchId,
        },
        include: {
          User: true,
        },
      });
    }),

  updateBranch: protectedProcedure //can add AdminProcedure if needed
    .input(
      z.object({
        id: z.string().optional(),
        name: z.string().optional(),
        newName: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const branch = await ctx.db.branch.findFirst({
        where: {
          name: input.name,
          id: input.id,
        } as Prisma.BranchWhereInput,
      });
      console.log(branch);

      const whereClause: Prisma.BranchWhereUniqueInput = {
        id: input.id ?? branch?.id,
        name: input.name ?? branch?.name,
      };

      if (branch!.name == input.newName) {
        throw new Error("Branch with new name already exists");
      }

      if (input.id) {
        whereClause.id = input.id;
      }

      return await ctx.db.branch.update({
        where: {
          id: whereClause.id,
          name: whereClause.name,
        } as Prisma.BranchWhereUniqueInput,
        data: {
          name: input.newName,
        },
      });
    }),
});