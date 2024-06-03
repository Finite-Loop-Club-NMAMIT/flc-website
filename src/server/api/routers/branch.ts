import {z} from "zod"

import { createTRPCRouter,protectedProcedure,publicProcedure } from "../trpc"


//switch to protectedProcedure after auth is done
export const branchRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.branch.findMany({});
  }),

  create: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.branch.create({
        data: {
          name: input.name,
        },
      });
    }),

  delete: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
        const {id:branchId} = await ctx.db.branch.findFirst({
            where:{
                name:input.name
            }
        }) as {id:string}
      return await ctx.db.branch.delete({
        where: {
          id: branchId,
        },
      });
    }),

    getOnePopulated: publicProcedure
    .input(z.object({branchId:z.string()}))
    .query(async({ctx,input})=>{

        return await ctx.db.branch.findUniqueOrThrow({
            where:{
                id:input.branchId
            },
            include:{
                User:true
            }
        })
    })
});