import { type User } from "@prisma/client";
import { db } from "~/server/db";
import bcrypt from "bcryptjs";
import { TRPCError } from "@trpc/server";

const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) return null;
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getUserById = async (id: string): Promise<User | null> => {
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) return null;
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const hashPassword = async (password: string): Promise<string | null> => {
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    if (!hashedPassword) {
      return null;
    }
    return hashedPassword;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const compareHashedPassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  try {
    const validPassword = await bcrypt.compare(password, hashedPassword);

    if (!validPassword) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Incorrect password",
      });
    }

    return validPassword;
  } catch (error) {
    console.error(error);

    if (error instanceof TRPCError) {
      throw error;
    }

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong",
    });
  }
};

export { getUserByEmail, hashPassword, compareHashedPassword, getUserById };
