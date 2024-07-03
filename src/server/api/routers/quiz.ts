import { adminProcedure, createTRPCRouter, protectedProcedure } from '../trpc';
import { TRPCError } from "@trpc/server";
import {
  createQuizTemplateSchema,
  updateQuizTemplateNameSchema,
  createQuizQuestionSchema,
  updateQuizQuestionSchema,
  changeQuizTemplateStateSchema,
  getQuestionsByQuizTemplateIdSchema,
  getQuizResultsForUserSchema,
  getAllQuizTemplatesByStateSchema,
  submitQuizSchema,
  getQuizScoresSchema,
} from '~/zod/quizeZ'; // Adjust the import path based on your project structure

export const quizRouter = createTRPCRouter({
  // Create a quiz template
  createQuizTemplate: adminProcedure
    .input(createQuizTemplateSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const quizTemplate = await ctx.db.quizTemplate.create({
          data: {
            title: input.title,
            timeLimit: input.timeLimit,
          },
        });
        return quizTemplate;
      } catch (error) {
        console.error('Create QuizTemplate Error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong while creating quiz template',
        });
      }
    }),

  // Update quiz template name
  updateQuizTemplateName: protectedProcedure
    .input(updateQuizTemplateNameSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const updatedTemplate = await ctx.db.quizTemplate.update({
          where: { id: input.quizTemplateId },
          data: {
            title: input.newTitle,
            timeLimit: input.timeLimit
          },
        });
        return updatedTemplate;
      } catch (error) {
        console.error('Update QuizTemplate Name Error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong while updating quiz template name',
        });
      }
    }),

  // Add a question to a quiz template
  addQuestionToQuizTemplate: adminProcedure
    .input(createQuizQuestionSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        // Validate input using Zod schema
        const validatedInput = createQuizQuestionSchema.parse(input);

        const quizTemplate = await ctx.db.quizTemplate.findUnique({
          where: { id: validatedInput.quizTemplateId },
          select: { quizState: true },
        });

        if (!quizTemplate) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Quiz template not found',
          });
        }

        if (quizTemplate.quizState !== 'DRAFT') {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Quiz template must be in draft state to add questions',
          });
        }

        // Create question and options
        const createdQuestion = await ctx.db.quizQuestion.create({
          data: {
            text: validatedInput.text,
            correctAnswerText: validatedInput.correctAnswerText,
            answerType: validatedInput.answerType,
            quizTemplateId: validatedInput.quizTemplateId,
            QuizeQuestionOption: {
              create: (validatedInput.options ?? []).map(option => ({
                text: option,
              })),
            },
          },
          include: { QuizeQuestionOption: true },
        });

        // Determine correctOptionId based on correctOptionIndex
        if (validatedInput.correctOptionIndex !== undefined) {
          const options = createdQuestion.QuizeQuestionOption;
          const correctOption = options[validatedInput.correctOptionIndex];
          if (correctOption) {
            const correctOptionId = correctOption.id;

            // Update correctOptionId if provided and valid
            await ctx.db.quizQuestion.update({
              where: { id: createdQuestion.id },
              data: { correctOptionId: correctOptionId },
            });
          } else {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'Correct option index does not exist in question options',
            });
          }
        }

        return createdQuestion;
      } catch (error) {
        console.error('Add Question Error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong while adding question',
        });
      }
    }),

  //updates the question /mcqs/correct-options
  updateQuestionInQuizTemplate: adminProcedure
    .input(updateQuizQuestionSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        // Validate input using Zod schema
        const validatedInput = updateQuizQuestionSchema.parse(input);

        const existingQuestion = await ctx.db.quizQuestion.findUnique({
          where: { id: validatedInput.questionId },
          include: { QuizeQuestionOption: true },
        });

        if (!existingQuestion) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Question not found',
          });
        }

        // Update question and options
        const updatedQuestion = await ctx.db.quizQuestion.update({
          where: { id: validatedInput.questionId },
          data: {
            text: validatedInput.text ?? existingQuestion.text,
            correctAnswerText: validatedInput.correctAnswerText ?? existingQuestion.correctAnswerText,
            answerType: validatedInput.answerType ?? existingQuestion.answerType,
            QuizeQuestionOption: {
              deleteMany: {}, // Remove existing options
              create: (validatedInput.options ?? []).map(option => ({
                text: option,
              })),
            },
          },
          include: { QuizeQuestionOption: true },
        });

        // Determine correctOptionId based on correctOptionIndex
        if (validatedInput.correctOptionIndex !== undefined) {
          const options = updatedQuestion.QuizeQuestionOption;
          const correctOption = options[validatedInput.correctOptionIndex];
          if (correctOption) {
            const correctOptionId = correctOption.id;

            // Update correctOptionId if provided and valid
            await ctx.db.quizQuestion.update({
              where: { id: updatedQuestion.id },
              data: { correctOptionId: correctOptionId },
            });
          } else {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'Correct option index does not exist in question options',
            });
          }
        }

        return updatedQuestion;
      } catch (error) {
        console.error('Update Question Error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong while updating question',
        });
      }
    }),

  // Change state of a quiz template (DRAFT, LIVE, COMPLETED)
  changeQuizTemplateState: adminProcedure
    .input(changeQuizTemplateStateSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { quizTemplateId, quizState } = input;

        const updatedTemplate = await ctx.db.quizTemplate.update({
          where: { id: quizTemplateId },
          data: { quizState },
        });

        return updatedTemplate;
      } catch (error) {
        console.error('Change QuizTemplate State Error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong while changing quiz template state',
        });
      }
    }),


  // Get all questions of a quiz template
  getQuestionsByQuizTemplateId: adminProcedure
    .input(getQuestionsByQuizTemplateIdSchema)
    .query(async ({ input, ctx }) => {
      try {
        const questions = await ctx.db.quizQuestion.findMany({
          where: { quizTemplateId: input.quizTemplateId },
          include: {
            QuizeQuestionOption: true
          }
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


  // Get all live quiz templates
  getAllLiveQuizTemplates: protectedProcedure
    .query(async ({ ctx }) => {
      try {
        const liveTemplates = await ctx.db.quizTemplate.findMany({
          where: { quizState: 'LIVE' },
          include: {
            QuizQuestion: {
              include: {
                QuizeQuestionOption: true
              }
            }
          }
        });
        return liveTemplates;
      } catch (error) {
        console.error('Get All Live Quiz Templates Error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong while fetching live quiz templates',
        });
      }
    }),

  // Get all quiz templates by state (DRAFT, LIVE, COMPLETED)
  getAllQuizTemplatesByState: protectedProcedure
    .input(getAllQuizTemplatesByStateSchema)
    .query(async ({ input, ctx }) => {
      try {
        const templates = await ctx.db.quizTemplate.findMany({
          where: { quizState: input.quizState },
          include: {
            QuizQuestion: {
              include: {
                QuizeQuestionOption: true
              }
            }
          }
        });
        return templates;
      } catch (error) {
        console.error('Get All Quiz Templates by State Error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong while fetching quiz templates by state',
        });
      }
    }),
  //user's quize result
  userSubmitQuiz: protectedProcedure
    .input(submitQuizSchema)
    .mutation(async ({ input, ctx }) => {
      const { quizTemplateId, answers } = input;
      const userId = ctx.session.user.id;

      try {
        const quizTemplate = await ctx.db.quizTemplate.findUnique({
          where: { id: quizTemplateId },
          include: { QuizQuestion: { include: { QuizeQuestionOption: true } } },
        });

        if (!quizTemplate) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Quiz template not found',
          });
        }

        if (quizTemplate.quizState !== 'LIVE') {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Quiz is not in a live state',
          });
        }

        let score = 0;

        const userQuizResponse = await ctx.db.userQuizResponse.create({
          data: {
            quizTemplateId,
            userId,
            UserQuizeAnswer: {
              create: answers.map(answer => {
                const question = quizTemplate.QuizQuestion.find(q => q.id === answer.questionId);
                let isCorrect = false;

                if (question) {
                  if (question.answerType === 'MCQ') {
                    isCorrect = question.correctOptionId === answer.selectedOptionId;
                  } else if (question.answerType === 'TEXT') {
                    isCorrect = question.correctAnswerText?.toLowerCase() === answer.answerText?.toLowerCase();
                  }
                }

                if (isCorrect) {
                  score += 1; // Assuming each correct answer gives 1 point
                }

                return {
                  quizQuestionId: answer.questionId,
                  selectedOptionId: answer.selectedOptionId,
                  answerText: answer.answerText,
                };
              }),
            },
            score,
          },
        });

        return userQuizResponse;
      } catch (error) {
        console.error('User Submit Quiz Error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong while submitting the quiz',
        });
      }
    }),
  // Retrieve detailed user quiz results for a specific quiz
  getQuizResultsReviewForUser: protectedProcedure
    .input(getQuizResultsForUserSchema) // Define your input schema if needed
    .query(async ({ input, ctx }) => {
      const { quizTemplateId } = input;
      const userId = ctx.session.user.id;

      try {
        // Find the quiz template including questions and options
        const quizTemplate = await ctx.db.quizTemplate.findUnique({
          where: { id: quizTemplateId },
          include: {
            QuizQuestion: {
              include: {
                QuizeQuestionOption: true,
              },
            },
          },
        });

        if (!quizTemplate) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Quiz template not found',
          });
        }

        // Find user's responses for the quiz
        const userResponses = await ctx.db.userQuizResponse.findMany({
          where: {
            quizTemplateId,
            userId,
          },
          include: {
            UserQuizeAnswer: {
              include: {
                QuizQuestion: {
                  include: {
                    QuizeQuestionOption: true,
                  },
                },
              },
            },
          },
        });

        if (!userResponses || userResponses.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User quiz responses not found',
          });
        }

        // Extract necessary details from user responses
        const formattedUserResponses = userResponses.map(response => {
          return {
            quizTemplateId: response.quizTemplateId,
            question: response.UserQuizeAnswer.map(answer => {
              const question = answer.QuizQuestion;

              // Handle potential undefined cases
              const formattedAnswer = {
                questionId: answer.quizQuestionId,
                selectedOptionId: answer.selectedOptionId ?? '',
                correctOptionId: question.correctOptionId ?? '',
                answerText: answer.answerText ?? null,
                options: question.QuizeQuestionOption.map(option => ({
                  optionId: option.id,
                  text: option.text,
                })),
              }

              return formattedAnswer;
            }),

          };
        });


        const totalScore = userResponses.reduce((acc, response) => acc + response.score, 0);

        return {
          quizTemplateId,
          userResponses: formattedUserResponses,
          totalScore,
        };
      } catch (error) {
        console.error('Get Quiz Results for User Error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong while fetching quiz results for user',
        });
      }
    }),


  // Retrieve quiz scores in descending order
  getQuizScores: protectedProcedure
    .input(getQuizScoresSchema) // Define your input schema if needed
    .query(async ({ input, ctx }) => {
      const { quizTemplateId } = input;

      try {
        const quizScores = await ctx.db.userQuizResponse.findMany({
          where: { quizTemplateId },
          orderBy: {
            score: 'desc',
          },
          include: {
            user: true, // Assuming you want to include user details with scores
          },
        });

        return quizScores;
      } catch (error) {
        console.error('Get Quiz Scores Error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong while fetching quiz scores',
        });
      }
    })

});
