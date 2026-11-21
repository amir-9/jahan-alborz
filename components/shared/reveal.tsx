"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
};

/**
 * Scroll-triggered entrance with a visibility-first fallback.
 *
 * The content is always visible in the server-rendered HTML and stays visible
 * when JavaScript, IntersectionObserver or animation frames are unavailable
 * (background tabs, static screenshot tools, reduced motion). The slide-in is
 * applied only after mount as a progressive enhancement, with a safety timer
 * that resets the transform even if the observer never fires.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 18,
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    node.style.transform = `translateY(${y}px)`;

    const show = () => {
      node.style.transitionDelay = `${delay}s`;
      node.style.transform = "";
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
      node.style.transitionDelay = "";
    };
  }, [delay, y, once]);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-transform duration-500 ease-out motion-reduce:transition-none",
        className,
      )}
    >
      {children}
    </div>
  );
}
