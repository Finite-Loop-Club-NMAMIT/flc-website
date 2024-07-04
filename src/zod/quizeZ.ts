import { z } from 'zod';

// Schema for creating a quiz template
const createQuizTemplateSchema = z.object({
  title: z.string(),
  timeLimit: z.number().int().positive(),
});

// Schema for updating the name of a quiz template
const updateQuizTemplateNameSchema = z.object({
  quizTemplateId: z.string(),
  newTitle: z.string().optional(),
  timeLimit: z.number().int().positive().optional(),
});

const createQuizQuestionSchema = z.object({
  text: z.string(),
  correctAnswerText: z.string().optional(),
  answerType: z.enum(['MCQ', 'TEXT']),
  quizTemplateId: z.string(),
  options: z.array(z.string()).optional(),
  correctOptionIndex: z.number().optional(),
  score: z.number().min(0)
});
const updateQuizQuestionSchema = z.object({
  questionId: z.string(),
  text: z.string().optional(),
  correctAnswerText: z.string().optional(),
  answerType: z.enum(['MCQ', 'TEXT']).optional(),
  options: z.array(z.string()).optional(),
  correctOptionIndex: z.number().optional(),
  score: z.number().min(0).optional()
});


const changeQuizTemplateStateSchema = z.object({
  quizTemplateId: z.string(),
  quizState: z.enum(['DRAFT', 'LIVE', 'COMPLETED']),
});

const getQuestionsByQuizTemplateIdSchema = z.object({
  quizTemplateId: z.string(),
});

const deleteQuestionFromQuizTemplateSchema = z.object({
  questionId: z.string(),
});

const getAllQuizTemplatesByStateSchema = z.object({
  quizState: z.enum(['DRAFT', 'LIVE', 'COMPLETED']),
});
const submitQuizSchema = z.object({
  quizTemplateId: z.string(),
  answers: z.array(
    z.object({
      questionId: z.string(),
      selectedOptionId: z.string(),
      answerText: z.string().optional(),
    })
  ),
});
const getQuizScoresSchema = z.object({
  quizTemplateId: z.string()
})
const getQuizResultsForUserSchema = z.object({
  quizTemplateId: z.string(),

});
const getTextAnswersForQuiz = z.object({
  quizTemplateId: z.string(),
})
const addScoreManually = z.object({
  userId: z.string(),
  quizTemplateId: z.string(),
  userQuizAnswer: z.array(
    z.object({
      quizQuestionId: z.string(),
      score: z.number().min(0),
    })
  )
})

export {
  addScoreManually,
  getTextAnswersForQuiz,
  createQuizTemplateSchema,
  updateQuizTemplateNameSchema,
  createQuizQuestionSchema,
  updateQuizQuestionSchema,
  changeQuizTemplateStateSchema,
  getQuestionsByQuizTemplateIdSchema,
  deleteQuestionFromQuizTemplateSchema,
  getAllQuizTemplatesByStateSchema,
  submitQuizSchema,
  getQuizScoresSchema,
  getQuizResultsForUserSchema
};












