import { EventCategory, EventState, EventType } from "@prisma/client";
import { z } from "zod";

const createEventSchema = z.object({
    name: z.string(),
    imgSrc: z.string().optional(),  // default-->
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
  const updateEventSchema = z.object({
    eventId: z.string().optional(),
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
  const setEventStateSchema = z.object({
    id: z.string(),
    state: z.nativeEnum(EventState),
  });
  const setEventLegacySchema = z.object({
    id: z.string(),
    isLegacy: z.boolean(),
  });
  const getEventByStateSchema = z.object({
    state: z.enum(["DRAFT", "PUBLISHED", "COMPLETED"]),
  });
  
  export {
    updateEventSchema,
    createEventSchema,
    setEventStateSchema,
    setEventLegacySchema,
    getEventByStateSchema,
  }
  