"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type QuantityStepperProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "default";
  label?: string;
  className?: string;
};

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 20,
  size = "default",
  label = "تعداد",
  className,
}: QuantityStepperProps) {
  const isSmall = size === "sm";
  const buttonClass = cn(
    "flex items-center justify-center text-muted-foreground transition-colors",
    "hover:bg-muted hover:text-primary",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
    "disabled:pointer-events-none disabled:opacity-40",
    isSmall ? "h-8 w-8" : "h-10 w-10",
  );

  return (
    <div
      className={cn(
        "inline-flex items-center overflow-hidden rounded-xl border border-border bg-surface",
        className,
      )}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        className={buttonClass}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={`کاهش ${label}`}
      >
        <Minus className={isSmall ? "h-3.5 w-3.5" : "h-4 w-4"} aria-hidden="true" />
      </button>
      <span
        className={cn(
          "min-w-9 text-center font-semibold tabular-nums text-foreground",
          isSmall ? "text-xs" : "text-sm",
        )}
        aria-live="polite"
      >
        {new Intl.NumberFormat("fa-IR").format(value)}
      </span>
      <button
        type="button"
        className={buttonClass}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label={`افزایش ${label}`}
      >
        <Plus className={isSmall ? "h-3.5 w-3.5" : "h-4 w-4"} aria-hidden="true" />
      </button>
    </div>
  );
}
