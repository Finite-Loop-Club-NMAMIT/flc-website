import { error } from "console";
import { db } from "~/server/db";
import { compareHashedPassword, getUserByEmail } from "~/utils/auth/auth";
import { hashToken } from "~/utils/auth/hashToken";

import { v4 as uuidv4 } from "uuid";
import { generateTokens } from "~/utils/auth/jwt";
import { LoginSchema } from "~/server/schema/zod-schema";

const addVerificationTokenToWhitelist = async ({
  userId,
}: {
  userId: string;
}) => {
  try {
    const token = await db.verificationToken.create({
      data: {
        userId,
      },
    });
    return token;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const revokeVerificationToken = async (id: string) => {
  try {
    return await db.verificationToken.update({
      where: {
        id,
      },
      data: {
        revoked: true,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const addRefreshTokenToWhitelist = async ({
  jti,
  refreshToken,
  userId,
}: {
  jti: string;
  refreshToken: string;
  userId: string;
}) => {
  try {
    return await db.refreshToken.create({
      data: {
        id: jti,
        hashedToken: hashToken(refreshToken),
        userId,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const login = async (input: { email: string; password: string }) => {
  try {
    const validateFields = LoginSchema.safeParse(input);
    if (!validateFields.success) {
      console.error(validateFields.error);
      throw validateFields.error;
    }
    const { email, password } = validateFields.data;
    const existingUser = await getUserByEmail(email);
    if (!existingUser) {
      console.error("User not found");
      throw error("User not found");
    }
    const validPassword = await compareHashedPassword(
      password,
      existingUser.password,
    );

    if (!validPassword) {
      console.error("Invalid password");
      throw error("Invalid password");
    }
    if (!existingUser.emailVerified) {
      console.error("Email not verified");
      throw error("Email not verified");
    }

    const jti = uuidv4();
    const { accessToken, refreshToken } = generateTokens(existingUser, jti);
    await addRefreshTokenToWhitelist({
      jti,
      refreshToken,
      userId: existingUser.id,
    });

    return {
      refreshToken,
      accessToken,
    };
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export {
  addVerificationTokenToWhitelist,
  revokeVerificationToken,
  addRefreshTokenToWhitelist,
  login,
};
