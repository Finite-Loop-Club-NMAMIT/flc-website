import { z } from 'zod';
import { EVENT_TYPE, EVENT_CATEGORY, EVENT_STATE, ANSWER_TYPE, FEEEDBACK_TEMPLATE_STATE } from "@prisma/client";
//Event management
const createEventSchema = z.object({
  name: z.string(),
  imgSrc: z.string().optional(),  // default-->
  deadline: z.date().optional(),
  fromDate: z.date(),
  toDate: z.date(),
  description: z.string().optional(),
  venue: z.string().optional(),
  type: z.nativeEnum(EVENT_TYPE),
  minTeamSize: z.number(),
  maxTeamSize: z.number(),
  maxTeams: z.number(),
  category: z.nativeEnum(EVENT_CATEGORY),
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
  category: z.nativeEnum(EVENT_CATEGORY).optional(),
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
  // userId: from session
  ans: z.string(),
});

const publishFeedbackTempleteSchema = z.object({
  id: z.string(),
  templateState: z.nativeEnum(FEEEDBACK_TEMPLATE_STATE)
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
// attendence mangement
const markTeamAttendanceSchema = z.object({
  teamId: z.string(),
  eventId: z.string(),
})

// team
const createTeamZ = z.object({
  eventId: z.string(),
  teamName: z.string(),
  // userId: from session
});

const joinTeamZ = z.object({
  teamId: z.string(),
  // userId: from session 
});

const leaveTeamSchema = z.object({
  teamId: z.string(),
  // userId: from session 
});

const deleteTeamInput = z.object({
  teamId: z.string(),
});

const getUserTeamsInput = z.object({
  userId: z.string(),
});
const searchTeamForEventz = z.object({
  eventId: z.string(),
  // userId:  from session 
});

//authSchema
const RegisterSchema = z
  .object({
    name: z.string().min(1, {
      message: "Name is required",
    }),
    email: z
      .string()
      .email({
        message: "Email is required",
      })
      .refine(
        (email) => {
          if (email.endsWith("@nmamit.in") || email.endsWith("@gmail.com")) {
            return true;
          }
          return false;
        },
        {
          message: "Email must be from NMAMIT",
        },
      ),
    phone: z.string().regex(/^[6-9]\d{9}$/, {
      message: "Invalid phone number. Must be a 10-digit number ",
    }),
    year: z.string(),
    branchId: z.string(),

    password: z.string().min(8, {
      message: "password should consist of minimum 6 characters",
    }),

    confirmPassword: z.string(),
  })
  .refine(
    (data) => {
      if (data.password === data.confirmPassword) {
        return true;
      }
      return false;
    },
    {
      path: ["confirmPassword"],
      message: "passwords dont match",
    },
  );

const LoginSchema = z.object({
  email: z
    .string()
    .email({
      message: "Email is required",
    })
    .refine(
      (email) => {
        if (email.endsWith("@nmamit.in") || email.endsWith("@gmail.com")) {
          return true;
        }
        return false;
      },
      {
        message: "Email must be from NMAMIT",
      },
    ),
  password: z.string().min(1, { message: "Password is required" }),
});

const SendVerifyEmailSchema = z.object({
  email: z
    .string()
    .email({
      message: "Email is required",
    })
    .refine(
      (email) => {
        if (email.endsWith("@nmamit.in") || email.endsWith("@gmail.com")) {
          return true;
        }
        return false;
      },
      {
        message: "Email must be from NMAMIT",
      },
    ),
});
const SendPasswordResetSchema = z.object({
  email: z
    .string()
    .email({
      message: "Email is required",
    })
    .refine(
      (email) => {
        if (email.endsWith("@nmamit.in")) {
          return true;
        }
        return false;
      },
      {
        message: "Email must be from NMAMIT",
      },
    ),
});
const ResetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string(),
});

const VerifyEmailSchema = z.object({
  token: z.string(),
});

const RefreshTokenSchema = z.object({
  refreshToken: z.string(),
});

//winner
const createWinnerZ = z.object({
  eventId: z.string(),
  teamId: z.string(),
  winnerType: z.enum(['WINNER', 'RUNNER_UP', 'SECOND_RUNNER_UP']),
});
const getWinnersByEventIdZ = z.string()
const editWinnerTypeZ = z.object({
  winnerId: z.string(),
  winnerType: z.enum(['WINNER', 'RUNNER_UP', 'SECOND_RUNNER_UP']),
});
//certificate
const issueCertificateByEventIdZ = z.object({
  eventId: z.string(),
});
const getCertificationDetailsByIdZ = z.object({
  certificateId: z.string(),
});

const getAllCertificationsByUserIdZ = z.object({
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
  submitFeedbackSchema ,
  publishFeedbackTempleteSchema,
  getQuestionsByFeedbackTemplateIdSchema,
  markTeamAttendanceSchema,
  createTeamZ,
  joinTeamZ,
  searchTeamForEventz,
  leaveTeamSchema,
  deleteTeamInput,
  getUserTeamsInput,
  LoginSchema,
  RegisterSchema,
  SendPasswordResetSchema,
  ResetPasswordSchema,
  SendVerifyEmailSchema,
  VerifyEmailSchema,
  RefreshTokenSchema,
  createWinnerZ,
  getWinnersByEventIdZ,
  editWinnerTypeZ,
  issueCertificateByEventIdZ,
  getCertificationDetailsByIdZ,
  getAllCertificationsByUserIdZ

}
