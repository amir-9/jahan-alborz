import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { cn } from "@/lib/utils/cn";

type BreadcrumbItem = {
  name: string;
  href?: string;
};

type PageHeroProps = {
  items: BreadcrumbItem[];
  title: ReactNode;
  description?: ReactNode;
  /** Badges or a short label rendered above the title. */
  eyebrow?: ReactNode;
  /** Optional highlights, filters or actions aligned to the end on large screens. */
  side?: ReactNode;
  className?: string;
};

/**
 * Shared atmospheric header for public pages.
 * Decorative layers are non-interactive and never hide the content.
 */
export function PageHero({
  items,
  title,
  description,
  eyebrow,
  side,
  className,
}: PageHeroProps) {
  return (
    <section className={cn("relative isolate overflow-hidden", className)}>
      <div className="absolute inset-0 bg-mesh-soft" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -start-24 -top-32 h-80 w-80 rounded-full bg-secondary/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -end-32 top-0 h-72 w-72 rounded-full bg-primary-500/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="page-container relative pb-4 pt-6 sm:pt-8">
        <Breadcrumbs items={items} />

        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            {eyebrow ? <div className="flex flex-wrap items-center gap-2">{eyebrow}</div> : null}
            <h1 className="animate-rise mt-3 text-2xl font-extrabold leading-[1.4] tracking-tight text-primary sm:text-3xl lg:text-[2.15rem]">
              {title}
            </h1>
            {description ? (
              <p className="animate-rise stagger-1 mt-3 text-caption leading-8 text-pretty text-muted-foreground sm:text-sm">
                {description}
              </p>
            ) : null}
          </div>

          {side ? <div className="shrink-0">{side}</div> : null}
        </div>

        <div className="hairline mt-8" />
      </div>
    </section>
  );
}
