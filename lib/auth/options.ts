import NextAuth from "next-auth/next";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { createOtp, verifyOtp } from "@/lib/auth/otp";
import { getSmsProvider } from "@/lib/sms/sms";

const CUSTOMER_PURPOSE_LOGIN = "login";
const CUSTOMER_PURPOSE_REGISTER = "register";

export const authOptions = {
  providers: [
    Credentials({
      id: "customer-password",
      name: "Customer",
      credentials: {
        identifier: { label: "Phone Number", type: "tel" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const identifier = credentials?.identifier;
        const password = credentials?.password;

        if (!identifier || !password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { phone: identifier },
        });

        if (!user?.passwordHash) {
          return null;
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          phone: user.phone,
          role: user.role,
        };
      },
    }),
    Credentials({
      id: "customer-otp",
      name: "Customer OTP",
      credentials: {
        identifier: { label: "Phone Number", type: "tel" },
        password: { label: "OTP Code", type: "password" },
      },
      async authorize(credentials) {
        const identifier = credentials?.identifier;
        const code = credentials?.password;

        if (!identifier || !code) {
          return null;
        }

        const verification = await verifyOtp(
          identifier,
          code,
          CUSTOMER_PURPOSE_LOGIN,
        );

        if (!verification.valid) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { phone: identifier },
        });

        if (!user) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          phone: user.phone,
          role: user.role,
        };
      },
    }),
    Credentials({
      id: "admin",
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (!email || !password) {
          return null;
        }

        const adminUser = await prisma.user.findFirst({
          where: { email, role: { in: ["ADMIN", "SUPER_ADMIN"] } },
        });

        if (!adminUser?.passwordHash) {
          return null;
        }

        const isValid = await bcrypt.compare(password, adminUser.passwordHash);
        if (!isValid) {
          return null;
        }

        return {
          id: adminUser.id,
          name: adminUser.name,
          email: adminUser.email,
          role: adminUser.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
    maxAge: 60 * 60,
  },
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({
      token,
      user,
      account,
      profile,
      trigger,
      isNewUser,
      session,
    }: {
      token: JWT;
      user: User;
      account: { provider?: string; providerAccountId?: string } | null;
      profile?: { sub?: string; name?: string; email?: string; picture?: string };
      trigger?: "signIn" | "signUp" | "update";
      isNewUser?: boolean;
      session?: unknown;
    }): Promise<JWT> {
      if (user) {
        token.id = user.id;
        token.phone = user.phone;
        token.role = user.role;
      }
      return token;
    },
    async session({
      session,
      token,
      user,
      newSession,
      trigger,
    }: {
      session: Session;
      token: JWT;
      user: User;
      newSession: unknown;
      trigger: "update";
    }): Promise<Session> {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.phone = token.phone as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
