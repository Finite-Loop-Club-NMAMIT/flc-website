import { WinnerType } from "@prisma/client";
import { z } from "zod";

const makeTeamWinnerZ = z.object({
  eventId: z.string(),
  teamId: z.string(),
  winnerType: z.nativeEnum(WinnerType),
});

const removeWinnerZ = z.object({
  eventId: z.string(),
  winnerId: z.string(),
});

const getWinnersByEventIdZ = z.object({
  eventId: z.string(),
});
export { makeTeamWinnerZ, removeWinnerZ, getWinnersByEventIdZ };
