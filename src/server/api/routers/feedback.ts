import { z } from 'zod';
import { adminProcedure, createTRPCRouter, protectedProcedure } from '../trpc';
import { TRPCError } from "@trpc/server";
import {  createFeedbackTemplateSchema, createQuestionSchema, getQuestionsByFeedbackTemplateIdSchema, publishFeedbackTempleteSchema, submitFeedbackSchema, updateQuestionSchema } from '~/zod/feedbackZ';
import { findTemplateAndCheckQuestions } from '~/utils/helper';


export const feedbackRouter = createTRPCRouter({

  // Create a feedback template for a specific event(amind)
  createFeedbackTemplate: adminProcedure
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
  addQuestionToFeedbackTemplate: adminProcedure
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
  updateQuestionInFeedbackTemplate: adminProcedure
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
  deleteQuestionFromFeedbackTemplate: adminProcedure
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
  getQuestionsByFeedbackTemplateId: adminProcedure
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
  publishAndDraftFeedbackTemplete: adminProcedure.input(publishFeedbackTempleteSchema).mutation(async ({ input, ctx }) => {
    const { id, templateState } = input;
    await findTemplateAndCheckQuestions(id); //checking  if question exists in Templete or not
    const updatedTemplate = await ctx.db.feedbackTemplate.update({
      where: { id },
      data: { templateState },
    });

    return updatedTemplate;
  }),


  //get All Published FeedbackTemplets with questions 
  getAllPublishedFeedbackTemplatesWithQuestions: protectedProcedure
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
  // submit user feedback with there answers
  submitUserFeedback: protectedProcedure
    .input(submitFeedbackSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const userId = ctx.session.user.id;
        const { feedbackTemplateId, answers } = input;

        // Check if UserFeedback already exists
        let userFeedback = await ctx.db.userFeedback.findFirst({
          where: {
            userId: userId,
            feedbackTemplateId: feedbackTemplateId,
          },
        });

        // Create UserFeedback entry if it doesn't exist
        if (!userFeedback) {
          userFeedback = await ctx.db.userFeedback.create({
            data: {
              userId: userId,
              feedbackTemplateId: feedbackTemplateId,
            },
          });
        }

        // Create or update Answer entries and link them to UserFeedback
        for (const answer of answers) {
          await ctx.db.answer.create({
            data: {
              questionId: answer.questionId,
              ans: answer.ans,
              userId: userId,
              userFeedbackUserId: userFeedback.userId,
              userFeedbackFeedbackTemplateId: userFeedback.feedbackTemplateId,
            },
          });
        }

        return { success: true };
      } catch (error) {
        console.error('Submit Feedback Error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong while submitting feedback',
          cause: error,
        });
      }
    }),

  // View all feedback templates for an event ()check
  viewUserFeedbackResponceForEvent: adminProcedure
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
  deleteFeedbackTemplate: adminProcedure
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


