"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type RevealVariant = "up" | "scale" | "start" | "end";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
  variant?: RevealVariant;
};

function hiddenTransform(variant: RevealVariant, distance: number): string {
  switch (variant) {
    case "scale":
      return `scale(${Math.max(0.9, 1 - distance / 220)})`;
    case "start":
      return `translateX(${distance}px)`;
    case "end":
      return `translateX(${-distance}px)`;
    default:
      return `translateY(${distance}px)`;
  }
}

/**
 * Scroll-triggered entrance with a visibility-first fallback.
 *
 * The content is always visible in the server-rendered HTML and stays visible
 * when JavaScript, IntersectionObserver or animation frames are unavailable
 * (background tabs, static screenshot tools, reduced motion). The entrance is
 * applied only after mount as a progressive enhancement: a subtle transform
 * and an opacity never lower than 0.88, with a safety timer that clears both
 * even if the observer never fires.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 18,
  once = true,
  variant = "up",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    node.style.transform = hiddenTransform(variant, y);
    node.style.opacity = "0.88";

    const show = () => {
      node.style.transitionDelay = `${delay}s`;
      node.style.transform = "";
      node.style.opacity = "";
    };

    const safety = window.setTimeout(show, 1500);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          window.clearTimeout(safety);
          show();
          if (once) observer.disconnect();
        }
      },
      { rootMargin: "-64px" },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      window.clearTimeout(safety);
      node.style.transform = "";
      node.style.opacity = "";
      node.style.transitionDelay = "";
    };
  }, [delay, y, once, variant]);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-[transform,opacity] duration-700 ease-out motion-reduce:transition-none",
        className,
      )}
    >
      {children}
    </div>
  );
}
