import { z } from "zod";

const getUserLinksZ = z.object({ userId: z.string() });

const createUserLinkZ = z.object({
  url: z.string(),
  linkName: z.string(),
  userId: z.string(),
});
const deleteUserLinkZ = z.object({ id: z.string() });

export { getUserLinksZ, createUserLinkZ, deleteUserLinkZ };
