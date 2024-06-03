import {z} from "zod"
import  { EVENT_TYPE,EVENT_CATEGORY,EVENT_STATE } from "@prisma/client";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

//switch to protectedProcedure after auth is done

const createType = z.object({
  name: z.string(),
  imgSrc: z.string().optional(),
  deadline: z.date().optional(),
  fromDate: z.date(),
  toDate: z.date(),
  description: z.string().optional(),
  venue: z.string().optional(),
  type: z.nativeEnum(EVENT_TYPE),
  minTeamSize: z.number(),
  maxTeamSize: z.number(),
  maxTeams: z.number(),
  category: z.nativeEnum(EVENT_CATEGORY),
  amount: z.number(),
  state: z.nativeEnum(EVENT_STATE),
  isLegacy: z.boolean(),
  
});

 export const eventRouter = createTRPCRouter({

   getAll: publicProcedure.query(async ({ ctx }) => {
     return await ctx.db.event.findMany({});
   }),

   create: publicProcedure
     .input(createType)
     .mutation(async ({ ctx, input }) => {
       const data = {
         ...input,
         deadline: input.deadline ? new Date(input.deadline) : undefined,
         fromDate: new Date(input.fromDate),
         toDate: new Date(input.toDate),
       };
       const duplicate = await ctx.db.event.findFirst({
         where:{
             name:input.name,
             venue:input.venue
         }
       })

        if(duplicate){
            throw new Error("Bruh!...event with same name and venue already exists")
        }

       return await ctx.db.event.create({ data });
     }),

    delete: publicProcedure  // protectedProcedure after auth?
    .input(z.object({eventId:z.string()}))
    .mutation(async({ctx,input})=>{
        const eventexists= await ctx.db.event.findFirst({where:{id:input.eventId}})

         if(!eventexists){
            throw new Error("No Event with that ID exists")
         }
        
        return await ctx.db.event.delete({
            where:{id:input.eventId}
        })
    }) 
 });