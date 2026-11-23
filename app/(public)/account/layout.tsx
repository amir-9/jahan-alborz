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
    <div className="page-shell page-container pb-16 pt-6 sm:pt-8">
      <div className="animate-rise overflow-hidden rounded-3xl border border-border bg-surface shadow-float">
        <div className="relative flex flex-wrap items-center justify-between gap-4 bg-gradient-to-l from-primary-900 via-primary-700 to-primary-900 p-5 text-primary-foreground sm:p-6">
          <div className="absolute inset-0 bg-grid-light opacity-60" aria-hidden="true" />
          <div
            className="animate-mesh-drift pointer-events-none absolute -start-16 -top-20 h-56 w-56 rounded-full bg-secondary/20 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative flex items-center gap-3">
            <span
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-lg font-extrabold text-secondary-foreground shadow-glow"
              aria-hidden="true"
            >
              {initial}
            </span>
            <div>
              <p className="text-caption text-on-primary-muted">حساب کاربری</p>
              <h1 className="text-base font-extrabold text-white">
                {user.name?.trim() || "مشتری جهان البرز"}
              </h1>
              {user.phone ? (
                <p className="mt-0.5 text-caption text-on-primary-muted" dir="ltr">
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
