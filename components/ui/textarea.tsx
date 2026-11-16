import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, rows = 4, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          "w-full rounded-xl border border-input bg-surface px-3.5 py-2.5 text-sm leading-7 text-foreground shadow-sm",
          "placeholder:text-muted-foreground/70",
          "transition-[border-color,box-shadow] duration-200",
          "hover:border-primary/40",
          "focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10",
          "disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-70",
          "aria-invalid:border-danger aria-invalid:ring-danger/10",
          className,
        )}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";
