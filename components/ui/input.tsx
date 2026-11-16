import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border border-input bg-surface px-3.5 text-sm text-foreground shadow-sm",
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

Input.displayName = "Input";
