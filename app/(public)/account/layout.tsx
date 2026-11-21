import { connection } from "next/server";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { AccountNav } from "@/components/account/account-nav";
import { requireUserPage } from "@/lib/auth/session";

export const instant = false;

type AccountLayoutProps = {
  children: React.ReactNode;
};

export default async function AccountLayout({ children }: AccountLayoutProps) {
  await connection();

  const user = await requireUserPage("/account");
  const initial = user.name?.trim().charAt(0) || "م";

  return (
    <div className="page-container pb-16 pt-6 sm:pt-8">
      <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-soft">
        <div className="relative flex flex-wrap items-center justify-between gap-4 bg-gradient-to-l from-primary-50 via-surface to-surface p-5 sm:p-6">
          <div className="absolute inset-0 bg-grid opacity-40" aria-hidden="true" />
          <div className="relative flex items-center gap-3">
            <span
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-lg font-extrabold text-primary-foreground"
              aria-hidden="true"
            >
              {initial}
            </span>
            <div>
              <p className="text-caption text-muted-foreground">حساب کاربری</p>
              <h1 className="text-base font-extrabold text-primary">
                {user.name?.trim() || "مشتری جهان البرز"}
              </h1>
              {user.phone ? (
                <p className="mt-0.5 text-caption text-muted-foreground" dir="ltr">
                  {user.phone}
                </p>
              ) : null}
            </div>
          </div>
          <div className="relative">
            <SignOutButton />
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[15rem_1fr]">
        <div>
          <AccountNav />
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
