import { z } from "zod";

const markTeamAttendanceSchema = z.object({
    teamId: z.string(),
    eventId: z.string(),
})

export {
    markTeamAttendanceSchema

}