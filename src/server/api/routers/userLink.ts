import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";


//switch to protectedProcedure after auth is done
export const userUrlRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        url: z.string(),
        linkName: z.string(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
         await new Promise((resolve) => setTimeout(resolve, 1000));
     const newUserLink=  await ctx.db.userLink.create({
        data: {
          url: input.url,
          linkName: input.linkName,
          userId: input.userId,
        },
      });
      return newUserLink;
    }),

   getAll: publicProcedure.query(async({ctx})=>{
    return await ctx.db.userLink.findMany()
   }),
   
   getOne: publicProcedure
   .input(z.object({userId:z.string()}))
   .query(async({ctx,input})=>{
        return await ctx.db.userLink.findFirst({
            where:{
                userId:input.userId
            },
            include:{
                User:true
            }
        })
   })

});
