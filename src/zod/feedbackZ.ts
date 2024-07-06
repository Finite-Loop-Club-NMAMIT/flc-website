import { AnswerType, FeedbackTemplateState } from "@prisma/client";
import { z } from "zod";

const createFeedbackTemplateZ = z.object({
  eventId: z.string(),
  questions: z.array(z.string()),
  answers: z.array(z.string()),
  answerstype: z.array(z.nativeEnum(AnswerType)),
});

const editFeedbackTemplateZ = z.object({
  id: z.string(),
  eventId: z.string(),
  questions: z.array(z.string()),
  answers: z.array(z.string()),
  answerstype: z.array(z.nativeEnum(AnswerType)),
});

const deleteFeedbackTemplateZ = z.object({
  templateId: z.string(),
  eventId: z.string(),
});

const toggleTemplateStateZ = z.object({
  templateId: z.string(),
  eventId: z.string(),
  state: z.nativeEnum(FeedbackTemplateState),
});

const submitFeedbackZ = z.object({
  templateId: z.string(),
  answers: z.array(z.string()),
  userId: z.string(),
});

const getFeedbackTemplateZ = z.object({
  templateId: z.string(),
});

const responseForEventZ = z.object({
  templateId: z.string(),
  eventId: z.string(),
});

export {
  createFeedbackTemplateZ,
  editFeedbackTemplateZ,
  deleteFeedbackTemplateZ,
  toggleTemplateStateZ,
  submitFeedbackZ,
  responseForEventZ,
  getFeedbackTemplateZ,
};
