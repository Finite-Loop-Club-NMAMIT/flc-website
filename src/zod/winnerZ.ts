import { z } from "zod";

const createWinnerZ = z.object({
    eventId: z.string(),
    teamId: z.string(),
    winnerType: z.enum(['WINNER', 'RUNNER_UP', 'SECOND_RUNNER_UP']),
  });
  const getWinnersByEventIdZ = z.string()
  const editWinnerTypeZ = z.object({
    winnerId: z.string(),
    winnerType: z.enum(['WINNER', 'RUNNER_UP', 'SECOND_RUNNER_UP']),
  });
export{
    createWinnerZ,
    getWinnersByEventIdZ,
    editWinnerTypeZ,
}