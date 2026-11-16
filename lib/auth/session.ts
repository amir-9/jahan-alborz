import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { UserRole } from "@/lib/generated/prisma/enums";
import { authOptions } from "@/lib/auth/options";
import {
  hasPermission,
  isAdminRole,
  type Permission,
} from "@/lib/auth/permissions";
import type { Session } from "next-auth";

export type SessionUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  phone?: string;
  role?: UserRole;
};

export async function getSession(): Promise<Session | null> {
  return getServerSession(authOptions);
}

export function toSessionUser(session: Session | null): SessionUser | null {
  const user = session?.user;

  if (!user?.id) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role as UserRole | undefined,
  };
}

function buildLoginUrl(callbackPath?: string): string {
  if (!callbackPath) {
    return "/auth/login";
  }

  return `/auth/login?callbackUrl=${encodeURIComponent(callbackPath)}`;
}

/** Page-level guard for customer pages. */
export async function requireUserPage(
  callbackPath?: string,
): Promise<SessionUser> {
  const user = toSessionUser(await getSession());

  if (!user) {
    redirect(buildLoginUrl(callbackPath));
  }

  return user;
}

/** Page-level guard for administrator pages. */
export async function requireAdminPage(
  permission?: Permission,
  callbackPath?: string,
): Promise<SessionUser> {
  const user = toSessionUser(await getSession());

  if (!user) {
    redirect(buildLoginUrl(callbackPath ?? "/admin"));
  }

  if (
    !isAdminRole(user.role) ||
    (permission !== undefined && !hasPermission(user.role, permission))
  ) {
    redirect("/account?error=forbidden");
  }

  return user;
}

/**
 * Authorization helper for server actions. Actions cannot redirect the way a
 * page can, so callers receive `null` and must return an honest error result.
 */
export async function getAdminActionUser(
  permission?: Permission,
): Promise<SessionUser | null> {
  const user = toSessionUser(await getSession());

  if (!user || !isAdminRole(user.role)) {
    return null;
  }

  if (permission !== undefined && !hasPermission(user.role, permission)) {
    return null;
  }

  return user;
}
