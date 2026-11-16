import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { RegisterForm } from "@/components/auth/register-form";
import { getSession, toSessionUser } from "@/lib/auth/session";
import { isAdminRole } from "@/lib/auth/permissions";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { safeInternalPath } from "@/lib/utils/url";

export const metadata: Metadata = buildPageMetadata({
  title: "ثبت‌نام",
  description: "ساخت حساب کاربری مشتریان جهان البرز.",
  path: "/auth/register",
  noIndex: true,
});

type RegisterPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

/** Registration reads the current session per request. */
export const instant = false;

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  await connection();

  const params = await searchParams;
  const callbackUrl = safeInternalPath(params.callbackUrl, "/account");
  const user = toSessionUser(await getSession());

  if (user) {
    redirect(isAdminRole(user.role) ? "/admin" : callbackUrl);
  }

  return <RegisterForm callbackUrl={callbackUrl} />;
}
