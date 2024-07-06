/* eslint-disable */
import { PrismaAdapter } from "@auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import bcrypt from "bcryptjs";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";

import { db } from "~/server/db";

import { getUserByEmail } from "~/utils/auth/auth";
import {
  getRefreshTokenExpiry,
  isJwtExpired,
  rotateTokens,
} from "~/utils/auth/jwt";
import { login } from "~/services/auth.service";

import { User, Role } from "@prisma/client";
import { LoginZ } from "~/zod/authZ";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface User {
    accessToken: string;
    refreshToken: string;
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: Role;
  }

  interface AdapterUser {
    accessToken: string;
    refreshToken: string;
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: Role;
  }

  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      // ...other properties
      role: Role;
    };
    accessToken: string;
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}
declare module "next-auth/jwt" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface JWT {
    iat: number;
    exp: number;
    role: Role;
    accessToken: string;
    refreshToken: string;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    async jwt({ token, user, trigger, session }): Promise<any> {
      if (!token.sub) return token;

      console.log("TOKEN FROM CLIENT COOKIES", token.accessToken);

      if (user && trigger === "signIn") {
        token = {
          ...token,
          sub: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          iat: Math.floor(Date.now() / 1000),
          exp: getRefreshTokenExpiry(user.refreshToken),
        };
        console.log("Token from user", token);
        return token;
      } else if (trigger === "update" && session) {
        console.log("SESSIONN", session);
        console.log("SESSION ACCESSTOKEN", session.accessToken);
        token = {
          ...token,
          accessToken: session.accessToken,
        };

        return token;
      } else if (isJwtExpired(String(token.accessToken))) {
        // user signed in before and to check if the token is expired
        console.log("expired, refreshing token");
        console.log("Refresh tokennnnnn", token.refreshToken);

        const [newAccessToken, newRefreshToken] = await rotateTokens(
          String(token.refreshToken),
        );
        console.log(
          "newAccessToken",
          newAccessToken,
          "newRefreshToken",
          newRefreshToken,
        );
        console.log("old token", token);
        if (newAccessToken && newRefreshToken) {
          token = {
            ...token,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            exp: getRefreshTokenExpiry(newRefreshToken),
          };
          console.log("token.accessToken", token.accessToken);
          console.log("token.refreshToken", token.refreshToken);
          console.log("token.exp", token.exp);

          console.log("token-new-token-attached", token);
          if (token.accessToken === newAccessToken) {
            return token;
          } else {
            return null;
          }
        } else {
          console.log("unable to refresh token");

          return null;
        }
      }
      console.log("RETURNING TOKEN");
      console.log(token);

      return token;
    },
    async session({ session, token, trigger }) {
      console.log("Hi from session");

      if (token.sub && session.user) {
        console.log("TOKEN FROM CALLBACK EXISTS");
        session.user.id = token.sub;
        session.user.name = token.name;
        session.user.email = token.email!;
        session.user.role = token.role;
        session.accessToken = token.accessToken;
      }

      console.log("Session", session);
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    CredentialsProvider({
      credentials: {},
      async authorize(credentials: any, req: any): Promise<any> {
        const validateFields = LoginZ.safeParse(credentials);
        if (!validateFields.success) {
          console.log("Invalid fields", validateFields.error);
          return null;
        }
        if (validateFields.success) {
          const { email, password } = validateFields.data;
          const data = await login({ email, password });
          if (!data) return null;
          const { accessToken, refreshToken } = data;
          const existingUser: User | null = await getUserByEmail(email);
          if (!existingUser) return null;
          const passwordMatch = await bcrypt.compare(
            password,
            existingUser.password,
          );

          if (!passwordMatch) return null;
          const user = {
            ...existingUser,
            refreshToken: refreshToken,
            accessToken: accessToken,
          };
          console.log("User", user);

          return user;
        }
        return null;
      },
    }),

    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
