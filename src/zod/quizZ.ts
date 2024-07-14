import { QuizState } from "@prisma/client";
import { z } from "zod";

const questionSchema = z.object({
  id: z.string(),
  text: z.string(),
  options: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
    }),
  ),
  correctOptionId: z.string(),
});

const answerSchema = z.object({
  questionId: z.string(),
  selectedOptionId: z.string(),
  scoreRewarded: z.number().min(0),
});

const createQuizZ = z.object({
  title: z.string(),
  timeLimit: z.number().min(0),
  state: z.nativeEnum(QuizState).optional().default("DRAFT"),
  questions: z.array(questionSchema),
});

const updateQuizZ = z.object({
  quizId: z.string(),
  title: z.string().optional(),
  timeLimit: z.number().min(0).optional(),
  state: z.nativeEnum(QuizState).optional(),
  questions: z.array(questionSchema).optional(),
});

const getQuizByIdZ = z.object({
  quizId: z.string(),
});

const deleteQuizZ = z.object({
  quizId: z.string(),
});

const createQuizResponseZ = z.object({
  quizId: z.string(),
  userId: z.string(),
  answers: z.array(answerSchema),
  totalScore: z.number().optional().default(0),
});

const getQuizResponseByIdZ = z.object({
  responseId: z.string(),
  userId: z.string(),
});

export {
  createQuizZ,
  updateQuizZ,
  getQuizByIdZ,
  deleteQuizZ,
  createQuizResponseZ,
  getQuizResponseByIdZ,
};
