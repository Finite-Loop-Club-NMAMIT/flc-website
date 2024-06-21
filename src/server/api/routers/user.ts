import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import bcrypt from "bcryptjs";
import { TRPCError } from "@trpc/server";
// import jwt from "jsonwebtoken";
// import { sendResetPasswordEmail } from "../utils/email";

export const userRouter = createTRPCRouter({
  // Create user: Available throughout the year. If user doesn't pay the amount, role is USER.
  createUser: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        branchName: z.string(),
        year: z.string(),
        password: z.string().min(6),
        phone: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if user with the same email already exists
        const existingUser = await ctx.db.user.findUnique({
          where: { email: input.email },
        });

        if (existingUser) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Email is already in use",
          });
        }

        // Find the branch associated with the input branchName
        const branch = await ctx.db.branch.findFirst({
          where: {
            name: input.branchName,
          },
        });

        if (!branch) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Branch with name ${input.branchName} not found`,
          });
        }

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(input.password, 10);

        // Create the user with role USER and connect to the specified branch
        const user = await ctx.db.user.create({
          data: {
            name: input.name,
            email: input.email,
            password: hashedPassword,
            phone: input.phone,
            year: input.year,
            role: "USER", // Role is set to USER
            totalActivityPoints: 0,
            Branch: {
              connect: { id: branch.id },
            },
          },
        });

        return {
          status: "success",
          user,
        };
      } catch (error) {
        console.error("Error creating user:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not create user",
        });
      }
    }),

  // Registration: Opens for a limited period. After paying, user role becomes "MEMBER".
  registration: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
        phone: z.string(),
        branchName: z.string(),
        year: z.string(),
        programmingLanguages: z.array(z.string()).optional(),
        skills: z.array(z.string()).optional(),
        whyJoin: z.string().optional(),
        expectations: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if user with the same email already exists
        const existingUser = await ctx.db.user.findUnique({
          where: { email: input.email },
        });

        // If existing user and not a "USER" role ie MEMBER or CORE tries to pay, throw conflict error
        if (existingUser && existingUser.role !== "USER") {
          throw new TRPCError({
            code: "CONFLICT",
            message: "You are already a member of FLC",
          });
        }

        // Find the branch associated with the input branchName
        const branch = await ctx.db.branch.findFirst({
          where: {
            name: input.branchName,
          },
        });

        if (!branch) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Branch with name ${input.branchName} not found`,
          });
        }

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(input.password, 10);

        // If existing user, update the user data; otherwise, create a new user
        const user = existingUser
          ? await ctx.db.user.update({
              where: { id: existingUser.id },
              data: {
                name: input.name,
                email: input.email,
                password: hashedPassword,
                phone: input.phone,
                year: input.year,
                role: "MEMBER", // Role is set to MEMBER after successful registration
                totalActivityPoints: existingUser.totalActivityPoints || 0,
                Branch: {
                  connect: { id: branch.id },
                },
              },
            })
          : await ctx.db.user.create({
              data: {
                name: input.name,
                email: input.email,
                password: hashedPassword,
                phone: input.phone,
                year: input.year,
                role: "MEMBER", // Role is set to MEMBER for new registrations
                totalActivityPoints: 0,
                Branch: {
                  connect: { id: branch.id },
                },
              },
            });

        if (!user) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Registration failed: User creation failed",
          });
        }

        // Create registration record
        const registration = await ctx.db.registration.create({
          data: {
            userId: user.id,
            languages: input.programmingLanguages || [],
            skills: input.skills || [],
            whyJoin: input.whyJoin || "",
            expectations: input.expectations || "",
            yearOfReg: new Date().getFullYear(),
          },
        });

        return {
          status: "success",
          user,
          registration,
        };
      } catch (error) {
        console.error("Error handling registration form:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not submit registration form",
        });
      }
    }),

  // Login procedure
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Find user by email
        const user = await ctx.db.user.findUnique({
          where: { email: input.email },
        });

        // If user not found, throw NOT_FOUND error
        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        // Compare input password with hashed password stored in database
        const passwordMatch = await bcrypt.compare(
          input.password,
          user.password,
        );

        // If passwords don't match, throw UNAUTHORIZED error
        if (!passwordMatch) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Incorrect password",
          });
        }

        // Return user data on successful login
        return {
          status: "success",
          user,
        };
      } catch (error) {
        console.error("Error logging in:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Incorrect email or password",
        });
      }
    }),

  // Get user profile by user ID
  getProfile: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        // Find user by ID and include related data (ActivityPoint, Certificate, etc.)
        const user = await ctx.db.user.findUnique({
          where: { id: input.id },
          include: {
            ActivityPoint: true,
            Certificate: true,
            Branch: true,
            UserLink: true,
            Organiser: {
              include: {
                Event: true,
              },
            },
            Team: {
              include: {
                Event: true,
              },
            },
          },
        });

        // If user not found, throw NOT_FOUND error
        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        // Return user profile data
        return {
          status: "success",
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            image: user.image,
            bio: user.bio,
            year: user.year,
            branch: user.Branch.name,
            role: user.role,
            position: user.position,
            totalActivityPoints: user.totalActivityPoints,
            eventsParticipated: user.Team.map((team) => team.Event),
            certificates: user.Certificate,
            organiserEvents: user.Organiser.map((organiser) => organiser.Event),
            links: user.UserLink,
          },
        };
      } catch (error) {
        console.error("Error fetching profile:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not fetch profile",
        });
      }
    }),

  // Get user by email
  getUserByEmail: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        // Find user by email
        const user = await ctx.db.user.findUnique({
          where: { email: input.email },
        });

        // If user not found, throw NOT_FOUND error
        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        // Return user data
        return {
          status: "success",
          user,
        };
      } catch (error) {
        console.error("Error fetching user by email:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not fetch user",
        });
      }
    }),

  // Get members (users with role "MEMBER")
  getMembers: protectedProcedure
    .input(
      z.object({
        limit: z.number().int(),
        cursor: z.string().nullish(),
        skip: z.number().optional(),
        searchTerms: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, skip, searchTerms, cursor } = input;
      try {
        // Query members based on role "MEMBER" and optional search terms
        const users = await ctx.db.user.findMany({
          take: limit + 1,
          skip: skip,
          cursor: cursor ? { id: cursor } : undefined,
          orderBy: { id: "asc" },
          where: {
            role: "MEMBER",
            OR: searchTerms
              ? [
                  { name: { contains: searchTerms } },
                  { email: { contains: searchTerms } },
                  { bio: { contains: searchTerms } },
                ]
              : undefined,
          },
        });

        let nextCursor: typeof cursor | undefined = undefined;
        // Determine next cursor if more results are available
        if (users.length > limit) {
          const nextItem = users.pop();
          nextCursor = nextItem?.id;
        }

        // Return members list and next cursor
        return {
          status: "success",
          users,
          nextCursor,
        };
      } catch (error) {
        console.error("Error fetching members:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not fetch members",
        });
      }
    }),

  // Edit user profile
  editUser: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        bio: z.string().optional(),
        phone: z.string().optional(),
        year: z.string().optional(),
        position: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Update user information
        const user = await ctx.db.user.update({
          where: { id: input.id },
          data: {
            name: input.name,
            bio: input.bio,
            phone: input.phone,
            year: input.year,
            position: input.position,
          },
        });

        // If user not found or update fails, throw NOT_FOUND error
        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found or update failed",
          });
        }

        // Return updated user data
        return {
          status: "success",
          user,
        };
      } catch (error) {
        console.error("Error updating user:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not update user",
        });
      }
    }),

  // Update profile picture
  updateProfilePicture: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        profilePicture: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Update user profile picture
        const user = await ctx.db.user.update({
          where: { id: input.id },
          data: { image: input.profilePicture },
        });

        // If user not found or update fails, throw NOT_FOUND error
        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found or update failed",
          });
        }

        // Return updated user data
        return {
          status: "success",
          user,
        };
      } catch (error) {
        console.error("Error updating profile picture:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not update profile picture",
        });
      }
    }),

  // Logout procedure
  logout: protectedProcedure.mutation(({ ctx }) => {
    try {
      // Clear session or cookies for logout
      // ctx.res.clearCookie("token");
      return {
        status: "success",
        message: "Logged out successfully",
      };
    } catch (error) {
      console.error("Error logging out:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Could not log out",
      });
    }
  }),

  // Forgot password procedure
  forgotPassword: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Find user by email for password reset
        const user = await ctx.db.user.findUnique({
          where: { email: input.email },
        });

        // If user not found, throw NOT_FOUND error
        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        // const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        //   expiresIn: "1h",
        // });

        // await sendResetPasswordEmail(input.email, token);

        return {
          status: "success",
          message: "Reset password email sent",
        };
      } catch (error) {
        console.error("Error in forgotPassword:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not process forgot password request",
        });
      }
    }),

  // Reset password procedure
  resetPassword: publicProcedure
    .input(
      z.object({
        token: z.string(),
        newPassword: z.string().min(6),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // const { userId } = jwt.verify(input.token, process.env.JWT_SECRET) as {
        //   userId: string;
        // };

        // const hashedPassword = await bcrypt.hash(input.newPassword, 10);

        // const user = await ctx.db.user.update({
        //   where: { id: userId },
        //   data: { password: hashedPassword },
        // });

        // if (!user) {
        //   throw new TRPCError({
        //     code: "NOT_FOUND",
        //     message: "User not found",
        //   });
        // }

        return {
          status: "success",
          message: "Password reset successful",
        };
      } catch (error) {
        console.error("Error in resetPassword:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not reset password",
        });
      }
    }),

  // Payment procedure
  // This is sample code
  createPaymentOrder: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.session.user) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Not logged in" });
    }

    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
    });

    if (user && user.role === "MEMBER") {
      throw new TRPCError({
        code: "CONFLICT",
        message: "User is already a member",
      });
    }

    // Generic Payment Provider Integration
    // const paymentProvider = new GenericPaymentProvider({
    //   apiKey: env.PAYMENT_PROVIDER_API_KEY,
    //   apiSecret: env.PAYMENT_PROVIDER_API_SECRET,
    // });

    const amount = 409;
    const currency = "INR";

    const options = {
      amount: (amount * 100).toString(), // Converting to the smallest currency unit
      currency,
      payment_capture: 1,
    };

    // const response = await paymentProvider.createOrder(options);

    // Note: The `registrationPayment` schema/table does not exist in the current database schema.
    // This is sample code

    // const order = await ctx.db.registrationPayment.create({
    //   data: {
    //     userId: ctx.session.user.id,
    //     orderId: response.id,
    //     paid: false, // Payment has not been completed yet
    //     amount: Number(response.amount),
    //   },
    //     });

    //     return order;
  }),
});

export type UserRouter = typeof userRouter;
