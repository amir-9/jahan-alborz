import NextAuth from "next-auth/next";
import { authOptions } from "@/lib/auth/options";

/**
 * next-auth v4 exposes one handler that detects the App Router route context
 * (the second argument with `params`) and returns a Web `Response`. Exporting
 * `.GET`/`.POST` from the handler object does not exist in v4 and yields 405.
 */
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
