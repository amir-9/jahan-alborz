import { forwardRef, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

/**
 * Native select styled to match the design system. Native controls keep
 * keyboard and mobile behaviour predictable in RTL layouts.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            "h-11 w-full appearance-none rounded-xl border border-input bg-surface px-3.5 pe-10 text-sm text-foreground shadow-sm",
            "transition-[border-color,box-shadow] duration-200",
            "hover:border-primary/40",
            "focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10",
            "disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-70",
            "aria-invalid:border-danger aria-invalid:ring-danger/10",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute inset-y-0 left-3 my-auto h-4 w-4 text-muted-foreground"
          aria-hidden="true"
        />
      </div>
    );
  },
);

Select.displayName = "Select";
