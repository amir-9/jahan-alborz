import { Star } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatNumber } from "@/lib/utils/format";

type StarRatingProps = {
  value: number;
  reviewCount?: number;
  className?: string;
  size?: "sm" | "md";
};

export function StarRating({
  value,
  reviewCount,
  className,
  size = "sm",
}: StarRatingProps) {
  const iconClass = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <span
      className={cn("inline-flex items-center gap-1", className)}
      aria-label={`امتیاز ${formatNumber(value)} از ۵`}
    >
      <span className="flex items-center gap-0.5" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={cn(
              iconClass,
              index < Math.round(value)
                ? "fill-secondary text-secondary"
                : "fill-muted text-muted",
            )}
          />
        ))}
      </span>
      <span className="text-caption font-semibold text-foreground">
        {formatNumber(value)}
      </span>
      {typeof reviewCount === "number" ? (
        <span className="text-caption text-muted-foreground">
          ({formatNumber(reviewCount)})
        </span>
      ) : null}
    </span>
  );
}
