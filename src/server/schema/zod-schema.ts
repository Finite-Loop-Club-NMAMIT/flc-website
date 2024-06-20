import { z } from 'zod';
import { EVENT_TYPE, EVENT_CATEGOERY, EVENT_STATE, ANSWER_TYPE, FEEEDBACK_TEMPLATE_STATE } from "@prisma/client";
//Event management
const createEventSchema = z.object({
  name: z.string(),
  imgSrc: z.string().optional(),
  deadline: z.date().optional(),
  fromDate: z.date(),
  toDate: z.date(),
  description: z.string().optional(),
  venue: z.string().optional(),
  type: z.nativeEnum(EVENT_TYPE),
  minTeamSize: z.number(),
  maxTeamSize: z.number(),
  maxTeams: z.number(),
  category: z.nativeEnum(EVENT_CATEGOERY),
  amount: z.number(),
  state: z.nativeEnum(EVENT_STATE),
  isLegacy: z.boolean(),
});
const updateEventSchema = z.object({
  eventId: z.string().optional(),
  name: z.string().optional(),
  imgSrc: z.string().optional(),
  deadline: z.date().optional(),
  fromDate: z.date().optional(),
  toDate: z.date().optional(),
  description: z.string().optional(),
  venue: z.string().optional(),
  type: z.nativeEnum(EVENT_TYPE).optional(),
  minTeamSize: z.number().optional(),
  maxTeamSize: z.number().optional(),
  maxTeams: z.number().optional(),
  category: z.nativeEnum(EVENT_CATEGOERY).optional(),
  amount: z.number().optional(),
  state: z.nativeEnum(EVENT_STATE).optional(),
  isLegacy: z.boolean().optional(),
});
const setEventStateSchema = z.object({
  id: z.string(),
  state: z.nativeEnum(EVENT_STATE).optional(),
});
const setEventLegacySchema = z.object({
  id: z.string(),
  isLegacy: z.boolean(),
});
const getEventByStateSchema = z.object({
  state: z.nativeEnum(EVENT_STATE).optional(),
});


//FeedbackTemplete
const createFeedbackTemplateSchema = z.object({
  eventId: z.string(),
});

const createQuestionSchema = z.object({
  qs: z.string(),
  answerType: z.nativeEnum(ANSWER_TYPE),
  feedbackTemplateId: z.string(),
});

const updateQuestionSchema = z.object({
  questionId: z.string(),
  qs: z.string().optional(),
  answerType: z.nativeEnum(ANSWER_TYPE).optional(),
});

const createAnswerSchema = z.object({
  questionId: z.string(),
  userId: z.string(),
  ans: z.string(),
});

const publishFeedbackTempleteSchema = z.object({
  id: z.string(),
  templateState: z.nativeEnum(FEEEDBACK_TEMPLATE_STATE)
})
const getQuestionsByFeedbackTemplateIdSchema = z.object({
  feedbackTemplateId: z.string(),
});
// attendence mangement
const markTeamAttendanceSchema =z.object({
  teamId: z.string(),
  eventId: z.string(),
})

// team
const createTeamZ = z.object({
  eventId: z.string(),
  teamName: z.string(),
  userId: z.string(),
});

const joinTeamZ = z.object({
  teamId: z.string(),
  userId: z.string(),
});

const leaveTeamSchema = z.object({
  teamId: z.string(),
  userId: z.string(),
});

const deleteTeamInput = z.object({
  teamId: z.string(),
});

const getUserTeamsInput = z.object({
  userId: z.string(),
});


export {
  updateEventSchema,
  createEventSchema,
  setEventStateSchema,
  setEventLegacySchema,
  getEventByStateSchema,
  createFeedbackTemplateSchema,
  createQuestionSchema,
  updateQuestionSchema,
  createAnswerSchema,
  publishFeedbackTempleteSchema,
  getQuestionsByFeedbackTemplateIdSchema,
  markTeamAttendanceSchema,
  createTeamZ ,
  joinTeamZ,
  leaveTeamSchema ,
  deleteTeamInput,
  getUserTeamsInput

}
