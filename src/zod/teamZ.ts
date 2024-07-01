import { z } from "zod";

const createTeamZ = z.object({
    eventId: z.string(),
    teamName: z.string(),
    // userId: from session
});

const joinTeamZ = z.object({
    teamId: z.string(),
    // userId: from session 
});

const leaveTeamSchema = z.object({
    teamId: z.string(),
    // userId: from session 
});

const deleteTeamInput = z.object({
    teamId: z.string(),
});

const getUserTeamsInput = z.object({
    userId: z.string(),
});
const searchTeamForEventz = z.object({
    eventId: z.string(),
    // userId:  from session 
});
export {
    createTeamZ,
    joinTeamZ,
    searchTeamForEventz,
    leaveTeamSchema,
    getUserTeamsInput,
  deleteTeamInput,
}