import { z } from "zod";

const toggleAttendanceZ = z.object({
  eventId: z.string(),
  userId: z.string(),
});

const toggleTeamAttendanceZ = z.object({
  teamId: z.string(),
  eventId: z.string(),
});

export { toggleTeamAttendanceZ, toggleAttendanceZ };
