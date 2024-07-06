import { z } from "zod";

const RegisterZ = z
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
          if (email.endsWith("@nmamit.in")) {
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

const LoginZ = z.object({
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
  password: z.string().min(1, { message: "Password is required" }),
});

const SendVerifyEmailZ = z.object({
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
const SendPasswordResetZ = z.object({
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
const ResetPasswordZ = z.object({
  token: z.string(),
  newPassword: z.string(),
});

const VerifyEmailZ = z.object({
  token: z.string(),
});

const RefreshTokenZ = z.object({
  refreshToken: z.string(),
});

export {
  LoginZ,
  RegisterZ,
  SendPasswordResetZ,
  ResetPasswordZ,
  SendVerifyEmailZ,
  VerifyEmailZ,
  RefreshTokenZ,
};
