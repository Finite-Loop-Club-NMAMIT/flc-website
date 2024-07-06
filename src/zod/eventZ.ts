import { EventCategory, EventState, EventType } from "@prisma/client";
import { z } from "zod";

const createEventZ = z.object({
  name: z.string(),
  imgSrc: z.string().optional(), // default-->
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

const updateEventZ = z.object({
  eventId: z.string(),
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

const deleteEventZ = z.object({ eventId: z.string() });

const setEventStateZ = z.object({
  eventId: z.string(),
  state: z.nativeEnum(EventState),
});

const toggleEventLegacyZ = z.object({
  eventId: z.string(),
});

const getEventByIdZ = z.object({
  eventId: z.string(),
});
export {
  updateEventZ,
  createEventZ,
  deleteEventZ,
  setEventStateZ,
  toggleEventLegacyZ,
  getEventByIdZ,
};
