import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { LoginForm } from "@/components/auth/login-form";
import { getSession, toSessionUser } from "@/lib/auth/session";
import { isAdminRole } from "@/lib/auth/permissions";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { safeInternalPath } from "@/lib/utils/url";

export const metadata: Metadata = buildPageMetadata({
  title: "ورود به حساب",
  description: "ورود مشتریان و کارکنان جهان البرز.",
  path: "/auth/login",
  noIndex: true,
});

type LoginPageProps = {
  searchParams: Promise<{
    callbackUrl?: string;
    error?: string;
  }>;
};

const errorMessages: Record<string, string> = {
  CredentialsSignin: "اطلاعات ورود نادرست است یا نشست منقضی شده است.",
  forbidden: "برای دسترسی به این بخش مجوز ندارید.",
  SessionRequired: "برای مشاهده این صفحه باید وارد شوید.",
};

/** Login reads the session and search parameters per request. */
export const instant = false;

export default async function LoginPage({ searchParams }: LoginPageProps) {
  await connection();

  const params = await searchParams;
  const callbackUrl = safeInternalPath(params.callbackUrl, "/account");
  const user = toSessionUser(await getSession());

  if (user) {
    redirect(isAdminRole(user.role) ? "/admin" : callbackUrl);
  }

  return (
    <LoginForm
      callbackUrl={callbackUrl}
      initialError={
        params.error
          ? (errorMessages[params.error] ??
            "ورود انجام نشد. لطفاً دوباره تلاش کنید.")
          : undefined
      }
    />
  );
}
