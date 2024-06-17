import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { TRPCError } from "@trpc/server";
import { createAnswerSchema, createFeedbackTemplateSchema, createQuestionSchema, getQuestionsByFeedbackTemplateIdSchema, publishFeedbackTempleteSchema, updateQuestionSchema } from '~/server/schema/zod-schema';
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

    //get all question of perticular FeedbackTemplete
    getQuestionsByFeedbackTemplateId: publicProcedure
    .input(getQuestionsByFeedbackTemplateIdSchema)
    .query(async ({ input, ctx }) => {
      try {
        const questions = await ctx.db.question.findMany({
          where: { feedbackTemplateId: input.feedbackTemplateId },
        });
        return questions;
      } catch (error) {
        console.error('Get Questions Error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong while fetching questions',
        });
      }
    }),


  //Publish and Draft FeedbackTemplete of perticular event
  publishAndDraftFeedbackTemplete: publicProcedure.input(publishFeedbackTempleteSchema).mutation(async ({ input, ctx }) => {
    const { id, templateState } = input;
    await findTemplateAndCheckQuestions(id);//checking  if question exists in Templete or not
    const updatedTemplate = await ctx.db.feedbackTemplate.update({
      where: { id },
      data: { templateState },
    });

    return updatedTemplate;
  }),


  //get All Published FeedbackTemplets with questions 
  getAllPublishedFeedbackTemplatesWithQuestions: publicProcedure
  .query(async ({ ctx }) => {
    try {
      const feedbackTemplates = await ctx.db.feedbackTemplate.findMany({
        where: { templateState: 'PUBLISHED' }, 
        include: {
          Questions: true,
        },
      });
      return feedbackTemplates;
    } catch (error) {
      console.error('Get All Feedback Templates Error:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong while fetching feedback templates',
      });
    }
  }),
  
  // Submit an answer to a question
  submitAnswerToQuestion: publicProcedure
    .input(createAnswerSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const answer = await ctx.db.answer.create({
          data: {
            questionId: input.questionId,
            ans: input.ans,
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
  viewUserFeedbackResponceForEvent: publicProcedure
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
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong while fetching feedback templates',
        });
      }
    }),

  

  //  Delete a feedback template
  deleteFeedbackTemplate: publicProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      try {
        const templateToDelete = await ctx.db.feedbackTemplate.delete({
          where: { id: input },
        });
        if (!templateToDelete) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'FeedbackTemplate not found',
          });
        }

        if (templateToDelete.templateState === 'PUBLISHED') {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Cannot delete a template in "PUBLISHED" state',
          });
        }
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
