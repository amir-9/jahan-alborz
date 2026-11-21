import Link from "next/link";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { siteConfig } from "@/lib/config/site";

type LogoProps = {
  className?: string;
  variant?: "default" | "light";
  withCaption?: boolean;
};

export function Logo({
  className,
  variant = "default",
  withCaption = true,
}: LogoProps) {
  const isLight = variant === "light";

  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-lg",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2",
        isLight ? "focus-visible:ring-offset-primary-900" : "focus-visible:ring-offset-surface",
        className,
      )}
      aria-label={`${siteConfig.name} — صفحه اصلی`}
    >
      <span
        className={cn(
          "relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-sm transition-transform duration-300 group-hover:-rotate-3",
          isLight ? "bg-white/10 ring-1 ring-white/15" : "bg-primary",
        )}
      >
        <Flame
          className={cn("h-6 w-6", isLight ? "text-secondary" : "text-secondary")}
          strokeWidth={2.2}
          aria-hidden="true"
        />
        <span className="absolute -bottom-1 -left-1 h-3 w-3 rounded-full border-2 border-surface bg-secondary" />
      </span>
      <span className="flex flex-col leading-tight">
        <span
          className={cn(
            "text-lg font-extrabold tracking-tight",
            isLight ? "text-white" : "text-primary",
          )}
        >
          {siteConfig.name}
        </span>
        {withCaption ? (
          <span
            className={cn(
              "text-caption font-medium",
              isLight ? "text-on-primary-muted" : "text-muted-foreground",
            )}
          >
            تجهیزات گرمایشی
          </span>
        ) : null}
      </span>
    </Link>
  );
}
