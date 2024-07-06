import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";
import { createBranchZ, deleteBranchZ } from "~/zod/branchZ";

//switch to protectedProcedure after auth is done
export const branchRouter = createTRPCRouter({
  getAllBranch: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.branch.findMany({});
  }),

  createBranch: adminProcedure
    .input(createBranchZ)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.branch.create({
        data: {
          name: input.branchName,
        },
      });
    }),

  deleteBranch: adminProcedure
    .input(deleteBranchZ)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.branch.delete({
        where: {
          id: input.branchId,
        },
      });
    }),
});
