import { adminProcedure, createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import {
  createQuizZ,
  updateQuizZ,
  getQuizByIdZ,
  deleteQuizZ,
  createQuizResponseZ,
  getQuizResponseByIdZ,
} from "~/zod/quizZ";

export const quizRouter = createTRPCRouter({
  createQuiz: adminProcedure
    .input(createQuizZ)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.quiz.create({
        data: {
          ...input,
        },
      });
    }),

  updateQuiz: adminProcedure
    .input(updateQuizZ)
    .mutation(async ({ ctx, input }) => {
      const quiz = await ctx.db.quiz.findUnique({
        where: { id: input.quizId },
      });

      if (!quiz || quiz.state !== "DRAFT") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot update quiz unless it's in draft",
        });
      }

      return await ctx.db.quiz.update({
        where: { id: input.quizId },
        data: {
          ...input,
        },
      });
    }),

  deleteQuiz: adminProcedure
    .input(deleteQuizZ)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.quiz.delete({
        where: { id: input.quizId },
      });
    }),

  getQuizById: protectedProcedure
    .input(getQuizByIdZ)
    .query(async ({ ctx, input }) => {
      const quiz = await ctx.db.quiz.findFirst({
        where: {
          id: input.quizId,
          state: "PUBLISHED",
        },
      });

      if (!quiz) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Quiz not found",
        });
      }

      return quiz;
    }),

  adminGetQuizById: adminProcedure
    .input(getQuizByIdZ)
    .query(async ({ ctx, input }) => {
      const quiz = await ctx.db.quiz.findUnique({
        where: { id: input.quizId },
      });

      if (!quiz) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Quiz not found",
        });
      }

      return quiz;
    }),

  createQuizResponse: protectedProcedure
    .input(createQuizResponseZ)
    .mutation(async ({ ctx, input }) => {
      const existingResponse = await ctx.db.quizResponse.findFirst({
        where: {
          quizId: input.quizId,
          userId: input.userId,
        },
      });

      if (existingResponse) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Quiz response already exists. You cannot submit again.",
        });
      }

      return await ctx.db.quizResponse.create({
        data: {
          ...input,
        },
      });
    }),

  getQuizResponseById: protectedProcedure
    .input(getQuizResponseByIdZ)
    .query(async ({ ctx, input }) => {
      const quizResponse = await ctx.db.quizResponse.findFirst({
        where: {
          id: input.responseId,
          userId: input.userId,
        },
      });

      if (!quizResponse) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Quiz response not found",
        });
      }

      return quizResponse;
    }),

  getAllQuizzes: protectedProcedure.query(async ({ ctx }) => {
    const quizzes = await ctx.db.quiz.findMany({
      where: { state: "PUBLISHED" },
    });

    if (!quizzes || quizzes.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No quizzes found",
      });
    }

    return quizzes;
  }),

  adminGetAllQuizzes: adminProcedure.query(async ({ ctx }) => {
    const quizzes = await ctx.db.quiz.findMany();

    if (!quizzes || quizzes.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No quizzes found",
      });
    }

    return quizzes;
  }),
});
