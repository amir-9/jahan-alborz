"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Phone, X } from "lucide-react";
import { siteConfig } from "@/lib/config/site";
import { toTelHref, toWhatsAppHref } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

/**
 * Small, non-intrusive contact affordance for mobile visitors.
 * Phone numbers are read from the central site configuration.
 */
export function FloatingContact() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    function onScroll() {
      setIsVisible(window.scrollY > 420);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (isDismissed) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed bottom-4 start-4 z-30 flex flex-col items-center gap-2 transition-all duration-300 lg:hidden",
        isVisible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <button
        type="button"
        onClick={() => setIsDismissed(true)}
        className="surface-glass flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground"
        aria-label="بستن دکمه‌های تماس"
      >
        <X className="h-3.5 w-3.5" aria-hidden="true" />
      </button>

      <a
        href={toWhatsAppHref(
          siteConfig.contact.whatsapp,
          "سلام، برای مشاوره خرید یا خدمات گرمایشی پیام می‌دهم.",
        )}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-600 text-white shadow-lift transition-transform active:scale-95"
        aria-label="تماس از طریق واتساپ"
      >
        <MessageCircle className="h-5 w-5" aria-hidden="true" />
      </a>

      <a
        href={toTelHref(siteConfig.contact.phone)}
        className="animate-pulse-ring flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-[0_16px_36px_-14px_rgba(242,140,40,0.9)] transition-transform hover:scale-105 active:scale-95"
        aria-label="تماس تلفنی با فروشگاه"
      >
        <Phone className="h-5 w-5" aria-hidden="true" />
      </a>
    </div>
  );
}
