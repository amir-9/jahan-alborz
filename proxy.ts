import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOGIN_PATH = "/auth/login";

const SESSION_COOKIE_NAMES = [
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
] as const;

/**
 * Optimistic edge check only.
 *
 * The presence of a session cookie is a cheap early filter. Real authentication
 * and role/permission checks happen in the admin layout and in every server
 * action, because a cookie can be missing, expired or forged.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAccountRoute =
    pathname === "/account" || pathname.startsWith("/account/");

  if (isAdminRoute || isAccountRoute) {
    const sessionToken = SESSION_COOKIE_NAMES.map((name) =>
      request.cookies.get(name),
    ).find((cookie) => Boolean(cookie?.value));

    if (!sessionToken) {
      const loginUrl = new URL(LOGIN_PATH, request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/account", "/account/:path*"],
};
