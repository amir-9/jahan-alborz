import NextAuth from "next-auth/next";

const opts = {
  session: { strategy: "jwt" as const, maxAge: 60 * 60 },
  callbacks: {
    session: async ({ session, token }) => {
      return session;
    },
  },
};

export const handler = NextAuth(opts);
export type Handler = typeof handler;
