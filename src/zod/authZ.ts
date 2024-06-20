import { z } from "zod";

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

const LoginSchema = z.object({
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

const SendVerifyEmailSchema = z.object({
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

const VerifyEmailSchema = z.object({
  token: z.string(),
});

const RefreshTokenSchema = z.object({
  refreshToken: z.string(),
});

export {
  LoginSchema,
  RegisterSchema,
  SendVerifyEmailSchema,
  VerifyEmailSchema,
  RefreshTokenSchema,
};
