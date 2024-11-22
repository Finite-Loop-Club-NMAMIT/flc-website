import { z } from "zod";

const createTeamZ = z.object({
  eventId: z.number().int(),
  teamName: z.string().min(3, "Team name must be at least 3 characters"),
});

const joinTeamZ = z.object({
  eventId: z.number().int(),
  teamId: z.string(),
});

const leaveTeamZ = z.object({
  teamId: z.string(),
});

const RemoveFromTeamZ = z.object({
  teamId: z.string(),
  userId: z.number(),
});

const deleteTeamZ = z.object({
  teamId: z.string(),
});

const confirmTeamZ = z.object({
  teamId: z.string(),
});

const getTeamByIdZ = z.object({
  teamId: z.string(),
});

export {
  createTeamZ,
  joinTeamZ,
  leaveTeamZ,
  deleteTeamZ,
  confirmTeamZ,
  getTeamByIdZ,
  RemoveFromTeamZ,
};
