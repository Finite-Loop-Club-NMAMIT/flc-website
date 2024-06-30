import { z } from "zod";

const createFeedbackTemplateSchema = z.object({
    eventId: z.string(),
  });
  
  const createQuestionSchema = z.object({
    qs: z.string(),
    answerType: z.enum(["BOOLEAN","RATING","COMMENT"]),
    feedbackTemplateId: z.string(),
  });
  
  const updateQuestionSchema = z.object({
    questionId: z.string(),
    qs: z.string().optional(),
    answerType: z.enum(["BOOLEAN","RATING","COMMENT"]).optional(),
  });
  
  const createAnswerSchema = z.object({
    questionId: z.string(),
    // userId: from session
    ans: z.string(),
  });
  
  const publishFeedbackTempleteSchema = z.object({
    id: z.string(),
    templateState: z.enum(["DRAFT","PUBLISHED"])
  })
  const getQuestionsByFeedbackTemplateIdSchema = z.object({
    feedbackTemplateId: z.string(),
  });
  const submitFeedbackSchema = z.object({
    feedbackTemplateId: z.string(),
    answers: z.array(
      z.object({
        questionId: z.string(),
        ans: z.string(),
      })
    ),
  });

  export {
    createFeedbackTemplateSchema,
    createQuestionSchema,
    updateQuestionSchema,
    createAnswerSchema,
    submitFeedbackSchema ,
    publishFeedbackTempleteSchema,
    getQuestionsByFeedbackTemplateIdSchema,
  }