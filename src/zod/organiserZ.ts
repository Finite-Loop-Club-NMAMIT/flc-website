import { z } from "zod";

const addOrganiserZ = z.object({
  userId: z.string(),
  eventId: z.string(),
});

const removeOrganiserZ = z.object({
  organiserId: z.string(),
});

export { addOrganiserZ, removeOrganiserZ };
