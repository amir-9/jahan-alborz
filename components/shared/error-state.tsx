"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Home, RefreshCcw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

type ErrorStateProps = {
  error: unknown;
  retry: () => void;
  /** Admin boundaries are rendered inside the admin shell and skip the logo. */
  variant?: "public" | "admin";
};

type ErrorWithDigest = {
  digest?: string;
  message?: string;
};

function getDigest(error: unknown): string | undefined {
  if (error && typeof error === "object" && "digest" in error) {
    const digest = (error as ErrorWithDigest).digest;
    return typeof digest === "string" ? digest : undefined;
  }
  return undefined;
}

/** Shared, Persian-language fallback UI for route error boundaries. */
export function ErrorState({
  error,
  retry,
  variant = "public",
}: ErrorStateProps) {
  useEffect(() => {
    console.error("[app error]", error);
  }, [error]);

  const digest = getDigest(error);

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center px-4 text-center",
        variant === "public" ? "min-h-[60vh] py-16" : "py-12",
      )}
      role="alert"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-danger/10 text-danger">
        <TriangleAlert className="h-7 w-7" aria-hidden="true" />
      </div>

      <h1 className="mt-5 text-lg font-extrabold text-foreground sm:text-xl">
        مشکلی پیش آمد
      </h1>
      <p className="mt-2 max-w-md text-caption leading-7 text-muted-foreground">
        نتوانستیم این صفحه را بارگذاری کنیم. لطفاً دوباره تلاش کنید. اگر مشکل
        ادامه داشت، با پشتیبانی فروشگاه تماس بگیرید.
      </p>

      {digest ? (
        <p
          className="mt-2 max-w-md break-all font-mono text-caption text-muted-foreground/70"
          dir="ltr"
        >
          کد خطا: {digest}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <Button onClick={retry} type="button">
          <RefreshCcw className="h-4 w-4" aria-hidden="true" />
          تلاش دوباره
        </Button>
        <Button asChild variant="outline">
          <Link href="/">
            <Home className="h-4 w-4" aria-hidden="true" />
            بازگشت به صفحه اصلی
          </Link>
        </Button>
      </div>
    </div>
  );
}
