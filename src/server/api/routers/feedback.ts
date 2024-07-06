import {
  createFeedbackTemplateZ,
  deleteFeedbackTemplateZ,
  editFeedbackTemplateZ,
  getFeedbackTemplateZ,
  responseForEventZ,
  submitFeedbackZ,
  toggleTemplateStateZ,
} from "~/zod/feedbackZ";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { checkOrganiser } from "~/utils/helper";

export const feedbackRouter = createTRPCRouter({
  createFeedbackTemplate: protectedProcedure
    .input(createFeedbackTemplateZ)
    .mutation(async ({ ctx, input }) => {
      await checkOrganiser(
        ctx.session.user.id,
        input.eventId,
        ctx.session.user.role,
      );

      return await ctx.db.feedbackTemplate.create({
        data: {
          ...input,
        },
      });
    }),

  editFeedbackTemplate: protectedProcedure
    .input(editFeedbackTemplateZ)
    .mutation(async ({ ctx, input }) => {
      await checkOrganiser(
        ctx.session.user.id,
        input.eventId,
        ctx.session.user.role,
      );
      return await ctx.db.feedbackTemplate.update({
        where: {
          id: input.id,
        },
        data: {
          ...input,
        },
      });
    }),

  deleteFeedbackTemplate: protectedProcedure
    .input(deleteFeedbackTemplateZ)
    .mutation(async ({ ctx, input }) => {
      await checkOrganiser(
        ctx.session.user.id,
        input.eventId,
        ctx.session.user.role,
      );

      return await ctx.db.feedbackTemplate.delete({
        where: {
          id: input.templateId,
        },
      });
    }),

  toggleTemplateState: protectedProcedure
    .input(toggleTemplateStateZ)
    .mutation(async ({ ctx, input }) => {
      await checkOrganiser(
        ctx.session.user.id,
        input.eventId,
        ctx.session.user.role,
      );

      return await ctx.db.feedbackTemplate.update({
        where: {
          id: input.templateId,
        },
        data: {
          templateState: input.state,
        },
      });
    }),

  getFeedbackTemplate: protectedProcedure
    .input(getFeedbackTemplateZ)
    .query(async ({ ctx, input }) => {
      return await ctx.db.feedbackTemplate.findUnique({
        where: {
          id: input.templateId,
        },
      });
    }),

  submitFeedback: protectedProcedure
    .input(submitFeedbackZ)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.userFeedback.create({
        data: {
          Answers: input.answers,
          userId: input.userId,
          feedbackTemplateId: input.templateId,
        },
      });
    }),

  getResponseForTemplate: protectedProcedure
    .input(responseForEventZ)
    .query(async ({ ctx, input }) => {
      await checkOrganiser(
        ctx.session.user.id,
        input.eventId,
        ctx.session.user.role,
      );

      return await ctx.db.feedbackTemplate.findUnique({
        where: {
          id: input.templateId,
        },
        include: {
          UserFeedback: {
            include: {
              User: true,
            },
          },
        },
      });
    }),
});
