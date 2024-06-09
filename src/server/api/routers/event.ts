import {z} from "zod"
import  { EventType,EventCategory,EventState } from "@prisma/client";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

//switch to protectedProcedure after auth is done

//input types
const createType = z.object({
  name: z.string(),
  imgSrc: z.string().optional(),
  deadline: z.date().optional(),
  fromDate: z.date(),
  toDate: z.date(),
  description: z.string().optional(),
  venue: z.string().optional(),
  type: z.nativeEnum(EventType),
  minTeamSize: z.number(),
  maxTeamSize: z.number(),
  maxTeams: z.number(),
  category: z.nativeEnum(EventCategory),
  amount: z.number(),
  state: z.nativeEnum(EventState),
  isLegacy: z.boolean(),
});

const updateType = z.object({
  eventId:z.string(),
  name: z.string().optional(),
  imgSrc: z.string().optional(),
  deadline: z.date().optional(),
  fromDate: z.date().optional(),
  toDate: z.date().optional(),
  description: z.string().optional(),
  venue: z.string().optional(),
  type: z.nativeEnum(EventType).optional(),
  minTeamSize: z.number().optional(),
  maxTeamSize: z.number().optional(),
  maxTeams: z.number().optional(),
  category: z.nativeEnum(EventCategory).optional(),
  amount: z.number().optional(),
  state: z.nativeEnum(EventState).optional(),
  isLegacy: z.boolean().optional(),
});


//routers 
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
            throw new Error("event with same name and venue already exists")
        }

       return await ctx.db.event.create({ data });
     }),
    update: publicProcedure
    .input(updateType)
    .mutation(async ({ctx,input})=>{
      const event = await ctx.db.event.findUnique({
        where: { id: input.eventId },
      });

      if (!event?.name) {
        throw new Error("Event with given ID does not exist");
      }

      delete input?.eventId; //removed eventId to prevent interference with data:{} param

      return await ctx.db.event.update({
        where: { id: event.id },
        data: {
          ...input,
          fromDate: input.fromDate ? new Date(input.fromDate) : event.fromDate,
          deadline: input.deadline ? new Date(input.deadline) : event.deadline,
          toDate: input.toDate ? new Date(input.toDate) : event.toDate,
        },
      });
    }), 

    delete: protectedProcedure  
    .input(z.object({eventId:z.string()}))
    .mutation(async({ctx,input})=>{
        const eventexists= await ctx.db.event.findFirst({where:{id:input.eventId}})

         if(!eventexists){
            throw new Error("Event with the given id does not exist")
         }
        
        return await ctx.db.event.delete({
            where:{id:input.eventId}
        })
    }) 
 });