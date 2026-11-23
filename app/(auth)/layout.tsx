import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { siteConfig } from "@/lib/config/site";
import { toTelHref } from "@/lib/utils/format";

type AuthLayoutProps = {
  children: ReactNode;
};

/**
 * Login and registration read the session and search parameters per request,
 * so authentication routes must not be prerendered at build time.
 */
export const instant = false;

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative isolate flex min-h-screen flex-col overflow-hidden bg-background">
      <div className="absolute inset-0 bg-mesh-soft" aria-hidden="true" />
      <div
        className="animate-mesh-drift pointer-events-none absolute -start-32 -top-40 h-[28rem] w-[28rem] rounded-full bg-secondary/10 blur-[100px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -end-40 top-1/3 h-[30rem] w-[30rem] rounded-full bg-primary-500/10 blur-[110px]"
        aria-hidden="true"
      />

      <header className="relative border-b border-border/70 bg-surface/80 backdrop-blur">
        <div className="page-container flex h-16 items-center justify-between gap-3">
          <Logo />
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-caption font-semibold text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
            بازگشت به فروشگاه
          </Link>
        </div>
      </header>

      <main className="relative flex flex-1 items-start justify-center px-4 py-10 sm:items-center sm:py-14">
        {children}
      </main>

      <footer className="relative border-t border-border/70 bg-surface/60">
        <div className="page-container flex flex-col items-center justify-between gap-3 py-5 text-center text-caption text-muted-foreground sm:flex-row sm:text-start">
          <p className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-success" aria-hidden="true" />
            اطلاعات ورود شما به‌صورت امن نگهداری می‌شود.
          </p>
          <p>
            پشتیبانی:{" "}
            <a
              href={toTelHref(siteConfig.contact.phone)}
              dir="ltr"
              className="font-semibold text-primary hover:underline"
            >
              {siteConfig.contact.phone}
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
