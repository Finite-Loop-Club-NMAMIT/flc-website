import { TRPCError } from '@trpc/server';
import { db } from '~/server/db';



export async function findEventIfExistById(eventId: string) {
  const existingEvent = await db.event.findUnique({
    where: { id: eventId },
  });

  if (!existingEvent) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Event not found',
    });
  }

  return existingEvent;
}
