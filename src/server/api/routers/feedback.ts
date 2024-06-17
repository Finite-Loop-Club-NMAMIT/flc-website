import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { TRPCError } from "@trpc/server";
import { createAnswerSchema, createFeedbackTemplateSchema, createQuestionSchema, publishFeedbackTempleteSchema, updateQuestionSchema } from '~/server/schema/zod-schema';
import { findTemplateAndCheckQuestions } from '~/utils/findTemplateAndQuestions';


export const feedbackTemplateRouter = createTRPCRouter({

  // Create a feedback template for a specific event(amind)
  createFeedbackTemplate: publicProcedure
    .input(createFeedbackTemplateSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const feedbackTemplate = await ctx.db.feedbackTemplate.create({
          data: {
            eventId: input.eventId,
          },
        });
        return feedbackTemplate;
      } catch (error) {
        console.error('Create FeedbackTemplate Error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong while creating feedback template',
        });
      }
    }),


  // Add a question to a feedback template
  addQuestionToFeedbackTemplate: publicProcedure
    .input(createQuestionSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const question = await ctx.db.question.create({
          data: {
            qs: input.qs,
            answerType: input.answerType,
            feedbackTemplateId: input.feedbackTemplateId,
          },
        });
        return question;
      } catch (error) {
        console.error('Add Question Error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong while adding question',
        });
      }
    }),


  // Update a question in a feedback template
  updateQuestionInFeedbackTemplate: publicProcedure
    .input(updateQuestionSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const updatedQuestion = await ctx.db.question.update({
          where: { id: input.questionId },
          data: {
            qs: input.qs,
            answerType: input.answerType,
          },
        });
        return updatedQuestion;
      } catch (error) {
        console.error('Update Question Error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong while updating question',
        });
      }
    }),


  // Delete a question from a feedback template
  deleteQuestionFromFeedbackTemplate: publicProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.db.question.delete({
          where: { id: input },
        });
        return { success: true };
      } catch (error) {
        console.error('Delete Question Error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong while deleting question',
        });
      }
    }),


  //Publish FeedbackTemplete of perticular event
  publishFeedbackTemplete: publicProcedure.input(publishFeedbackTempleteSchema).mutation(async ({ input, ctx }) => {
    const { id, templateState } = input;
    await findTemplateAndCheckQuestions(id);
    const updatedTemplate = await ctx.db.feedbackTemplate.update({
      where: { id },
      data: { templateState },
    });

    return updatedTemplate;
  }),

  // Submit an answer to a question
  submitAnswerToQuestion: publicProcedure
    .input(createAnswerSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const answer = await ctx.db.answer.create({
          data: {
            ans: input.ans,
            questionId: input.questionId,
            userId: input.userId,
          },
        });
        return answer;
      } catch (error) {
        console.error('Submit Answer Error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong while submitting answer',
        });
      }
    }),


  // View all feedback templates for an event ()check
  viewFeedbackTemplatesByEvent: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      try {
        const feedbackTemplates = await ctx.db.feedbackTemplate.findMany({
          where: { eventId: input },
          include: {
            Questions: {
              include: {
                Answer: true
              }
            },
          }
        });
        return feedbackTemplates;
      } catch (error) {
        console.error('View FeedbackTemplates Error:', error);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong while fetching feedback templates',
        });
      }
    }),

  // View user feedback for a specific event
  viewUserFeedbackForEvent: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      try {
        const feedbackTemplates = await ctx.db.feedbackTemplate.findMany({
          where: { eventId: input },
          include: {
            Questions: {
              include: {
                Answer: {
                  include: {
                    User: true,
                  },
                },
              },
            },
            UserFeedback: true,
          },
        });
        return feedbackTemplates;
      } catch (error) {
        console.error('View User Feedback Error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong while fetching user feedback',
        });
      }
    }),

  //  Delete a feedback template
  deleteFeedbackTemplate: publicProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.db.feedbackTemplate.delete({
          where: { id: input },
        });
        return { success: true };
      } catch (error) {
        console.error('Delete FeedbackTemplate Error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong while deleting feedback template',
        });
      }
    }),
});
