import type { Role } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { db } from "~/server/db";

export async function findEventIfExistById(eventId: string) {
  const existingEvent = await db.event.findUnique({
    where: { id: eventId },
  });

  if (!existingEvent) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Event not found",
    });
  }

  return existingEvent;
}
export const checkOrganiser = async (
  userId: string,
  eventId: string,
  role: Role,
) => {
  const organiser = await db.organiser.findFirst({
    where: {
      userId,
      eventId,
    },
  });

  if (!organiser || role !== "ADMIN") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "User is not an organiser for this event",
    });
  }
};
