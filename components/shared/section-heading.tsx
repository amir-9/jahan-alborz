import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  align?: "start" | "center";
  tone?: "default" | "light";
  /** Heading level for the title. Use "h1" on pages where this is the main heading. */
  as?: "h1" | "h2";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "start",
  tone = "default",
  as: Heading = "h2",
  className,
}: SectionHeadingProps) {
  const isLight = tone === "light";

  return (
    <div
      className={cn(
        "flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "sm:flex-col sm:items-center sm:text-center",
        className,
      )}
    >
      <div
        className={cn(
          "max-w-2xl",
          align === "center" && "mx-auto text-center",
        )}
      >
        {eyebrow ? (
          <div
            className={cn(
              "flex items-center gap-2 text-xs font-semibold",
              isLight ? "text-secondary" : "text-secondary-700",
              align === "center" && "justify-center",
            )}
          >
            <span className="h-px w-6 bg-current" aria-hidden="true" />
            {eyebrow}
          </div>
        ) : null}
        <Heading
          className={cn(
            "mt-3 text-2xl font-extrabold leading-[1.5] sm:text-3xl lg:text-[2rem]",
            isLight ? "text-white" : "text-primary",
          )}
        >
          {title}
        </Heading>
        {description ? (
          <p
            className={cn(
              "mt-3 text-sm leading-8 text-pretty sm:text-base",
              isLight ? "text-on-primary-muted" : "text-muted-foreground",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
