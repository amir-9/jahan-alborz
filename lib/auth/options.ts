import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getPrisma } from "@/lib/db/prisma";
import { verifyOtp } from "@/lib/auth/otp";
import { verifyPassword } from "@/lib/auth/password";
import { isAdminRole } from "@/lib/auth/permissions";
import { consumeRateLimit } from "@/lib/security/rate-limit";
import {
  isValidIranMobile,
  normalizeIranMobile,
} from "@/lib/utils/normalize";

const CUSTOMER_OTP_PURPOSE = "login";

const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_PASSWORD_ATTEMPTS = 10;

async function isLoginRateLimited(key: string): Promise<boolean> {
  const result = await consumeRateLimit(
    key,
    MAX_PASSWORD_ATTEMPTS,
    LOGIN_WINDOW_MS,
  );

  return !result.allowed;
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      id: "customer-password",
      name: "Customer password",
      credentials: {
        identifier: { label: "Phone Number", type: "tel" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const rawIdentifier = credentials?.identifier?.trim();
        const password = credentials?.password;

        if (!rawIdentifier || !password || !isValidIranMobile(rawIdentifier)) {
          return null;
        }

        const phone = normalizeIranMobile(rawIdentifier);

        try {
          if (await isLoginRateLimited(`auth:password:${phone}`)) {
            return null;
          }

          const prisma = getPrisma();
          const user = await prisma.user.findUnique({ where: { phone } });

          if (!user?.passwordHash || !user.isActive) {
            return null;
          }

          const isValid = await verifyPassword(password, user.passwordHash);
          if (!isValid) {
            return null;
          }

          await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
          });

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
          };
        } catch (error) {
          console.error("[auth] password login failed", error);
          return null;
        }
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
        const rawIdentifier = credentials?.identifier?.trim();
        const code = credentials?.password?.trim();

        if (!rawIdentifier || !code || !isValidIranMobile(rawIdentifier)) {
          return null;
        }

        const phone = normalizeIranMobile(rawIdentifier);

        try {
          const verification = await verifyOtp(
            phone,
            code,
            CUSTOMER_OTP_PURPOSE,
          );

          if (!verification.valid) {
            return null;
          }

          const prisma = getPrisma();
          const user = await prisma.user.upsert({
            where: { phone },
            create: {
              phone,
              lastLoginAt: new Date(),
            },
            update: { lastLoginAt: new Date() },
          });

          if (!user.isActive) {
            return null;
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
          };
        } catch (error) {
          console.error("[auth] OTP login failed", error);
          return null;
        }
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
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;

        if (!email || !password) {
          return null;
        }

        try {
          if (await isLoginRateLimited(`auth:admin:${email}`)) {
            return null;
          }

          const prisma = getPrisma();
          const adminUser = await prisma.user.findUnique({ where: { email } });

          if (
            !adminUser?.passwordHash ||
            !adminUser.isActive ||
            !isAdminRole(adminUser.role)
          ) {
            return null;
          }

          const isValid = await verifyPassword(
            password,
            adminUser.passwordHash,
          );
          if (!isValid) {
            return null;
          }

          await prisma.user.update({
            where: { id: adminUser.id },
            data: { lastLoginAt: new Date() },
          });

          return {
            id: adminUser.id,
            name: adminUser.name,
            email: adminUser.email,
            phone: adminUser.phone,
            role: adminUser.role,
          };
        } catch (error) {
          console.error("[auth] admin login failed", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.phone = user.phone;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.phone = token.phone;
        session.user.role = token.role;
      }
      return session;
    },
  },
};

export default authOptions;
