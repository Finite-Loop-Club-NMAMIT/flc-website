import { z } from "zod";

const signUpZ = z
  .object({
    name: z.string().min(3, {
      message: "Name is required",
    }),
    email: z
      .string()
      .email({
        message: "Email is required",
      })
      .refine((email) => !email.endsWith("@nmamit.in"), {
        message: "Use your personal email",
      }),
    phone: z.string().regex(/^\d{10}$/, { message: "Invalid phone number" }),
    usn: z.string().min(1, {
      message: "USN is required",
    }),
    year: z.string(),
    branchId: z.string().min(1, {
      message: "Please select a branch",
    }),
    password: z.string().min(8, {
      message: "Password should consist of minimum 8 characters",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const loginZ = z.object({
  email: z.string().email(),
  password: z.string(),
});

const registerZ = z.object({
  reasonToJoin: z.string().min(10, {
    message: "Answer should be atleast 10 characters",
  }),
  expectations: z.string().min(10, {
    message: "Answer should be atleast 10 characters",
  }),
  contribution: z.string().min(10, {
    message: "Answer should be atleast 10 characters",
  }),
  paymentId: z.string().min(1, {
    message: "Payment ID is required",
  }),
  githubLink: z
    .string()
    .url()
    .refine((url) => url.includes("github.com")),
});

const sendVerifyEmailZ = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

const sendPasswordResetZ = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

const resetPasswordZ = z
  .object({
    token: z.string(),
    newPassword: z.string(),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const verifyEmailZ = z.object({
  token: z.string(),
});

const refreshTokenZ = z.object({
  refreshToken: z.string(),
});

const eventZ = z
  .object({
      name: z.string().min(3, {
      message: "Name is required",
    }),
    description:z.string(),
    venue:z.string(),
    maxTeams:z.string(),
    minTeamSize:z.string(),
    maxTeamSize:z.string(),
    flcAmount:z.string(),
    nonFlcAmount:z.string(),
    fromDate:z.string(),
    toDate:z.string(),
    deadline:z.string(),
    isMembersOnly:z.string(),
    state:z.string(),
    isLegacy:z.string(),
    category:z.string(),
    eventType:z.string(),
  });

export {
  eventZ,
  signUpZ,
  loginZ,
  registerZ,
  sendVerifyEmailZ,
  sendPasswordResetZ,
  resetPasswordZ,
  verifyEmailZ,
  refreshTokenZ,
};
