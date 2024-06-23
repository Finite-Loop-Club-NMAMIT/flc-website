import { TRPCError } from '@trpc/server';
import { db } from '~/server/db';

export const checkOrganiser = async (userId: string, eventId: string) => {
    const organiser = await db.organiser.findFirst({
        where: {
            userId,
            eventId,
        },
    });

    if (!organiser) {
        throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'User is not an organiser for this event',
        });
    }
};
