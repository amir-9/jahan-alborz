import type { ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils/cn";

type ButtonVariant = "default" | "secondary" | "outline";
type ButtonSize = "default" | "sm" | "lg";

const buttonVariants: Record<ButtonVariant, string> = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
  outline: "border border-primary/30 text-primary hover:bg-primary/5",
};

const buttonSizes: Record<ButtonSize, string> = {
  default: "h-11 px-6",
  sm: "h-9 rounded-md px-4",
  lg: "h-12 rounded-md px-8",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
};

export function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  type,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    "disabled:pointer-events-none disabled:opacity-50",
    buttonVariants[variant],
    buttonSizes[size],
    className,
  );

  if (asChild) {
    return <Slot className={classes} {...props} />;
  }

  return <button type={type ?? "button"} className={classes} {...props} />;
}
