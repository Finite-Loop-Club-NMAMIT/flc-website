import { adminProcedure, createTRPCRouter } from "../trpc";
import {
  addActivityPointsZ,
  createActivityForEventZ,
  deleteActivityZ,
  removeActivityPointsZ,
} from "~/zod/activityPointsZ";

export const activityPointsRouter = createTRPCRouter({
  createActivityForEventZ: adminProcedure
    .input(createActivityForEventZ)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.activityPoint.create({
        data: {
          name: input.name,
          point: input.point,
          eventId: input.eventId,
        },
      });
    }),

  deleteActivity: adminProcedure
    .input(deleteActivityZ)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.activityPoint.delete({
        where: {
          id: input.activityId,
        },
      });
    }),

  addActivityPoints: adminProcedure
    .input(addActivityPointsZ)
    .mutation(async ({ ctx, input }) => {
      const activity = await ctx.db.activityPoint.findUnique({
        where: {
          id: input.activityId,
        },
      });

      return await ctx.db.$transaction(async (db) => {
        const promises = input.users.map((userId) => {
          return db.activityPoint.update({
            where: {
              id: input.activityId,
            },
            data: {
              User: {
                connect: {
                  id: userId,
                },
                update: {
                  where: {
                    id: userId,
                  },
                  data: {
                    totalActivityPoints: {
                      increment: activity?.point,
                    },
                  },
                },
              },
            },
          });
        });

        return Promise.all(promises);
      });
    }),

  removeActivityPoints: adminProcedure
    .input(removeActivityPointsZ)
    .mutation(async ({ ctx, input }) => {
      const activity = await ctx.db.activityPoint.findUnique({
        where: {
          id: input.activityId,
        },
      });

      return await ctx.db.$transaction(async (db) => {
        const promises = input.users.map((userId) => {
          return db.activityPoint.update({
            where: {
              id: input.activityId,
            },
            data: {
              User: {
                disconnect: {
                  id: userId,
                },
                update: {
                  where: {
                    id: userId,
                  },
                  data: {
                    totalActivityPoints: {
                      decrement: activity?.point,
                    },
                  },
                },
              },
            },
          });
        });

        return Promise.all(promises);
      });
    }),
});
