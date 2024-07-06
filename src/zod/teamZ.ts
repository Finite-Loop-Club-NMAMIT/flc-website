import { z } from "zod";

const createTeamZ = z.object({
  eventId: z.string(),
  teamName: z.string(),
});

const joinTeamZ = z.object({
  eventId: z.string(),
  teamId: z.string(),
});

const leaveTeamZ = z.object({
  teamId: z.string(),
});

const deleteTeamZ = z.object({
  teamId: z.string(),
});

const confirmTeamZ = z.object({
  teamId: z.string(),
});

const getTeamById = z.object({
  teamId: z.string(),
});

export {
  createTeamZ,
  joinTeamZ,
  leaveTeamZ,
  deleteTeamZ,
  confirmTeamZ,
  getTeamById,
};
