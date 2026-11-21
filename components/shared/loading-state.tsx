import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils/cn";

type LoadingStateProps = {
  /** Admin boundaries are narrower and omit the full-page header scaffold. */
  variant?: "public" | "admin";
};

/** Lightweight Persian loading skeleton used by route loading boundaries. */
export function LoadingState({ variant = "public" }: LoadingStateProps) {
  return (
    <div
      className={cn(
        "w-full",
        variant === "public" ? "page-container py-10" : "py-4",
      )}
      role="status"
      aria-label="در حال بارگذاری"
    >
      <span className="sr-only">در حال بارگذاری…</span>

      <div className="space-y-3">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-9 w-2/3 max-w-md" />
        <Skeleton className="h-4 w-full max-w-lg" />
      </div>

      <div
        className={cn(
          "mt-8 grid gap-5",
          variant === "public"
            ? "sm:grid-cols-2 lg:grid-cols-3"
            : "sm:grid-cols-2 xl:grid-cols-3",
        )}
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-border bg-surface p-4"
          >
            <Skeleton className="aspect-[4/3] w-full rounded-xl" />
            <Skeleton className="mt-4 h-4 w-4/5" />
            <Skeleton className="mt-2 h-3 w-2/5" />
            <Skeleton className="mt-4 h-9 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
