"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MapPin,
  ShoppingBag,
  UserRound,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const items = [
  { href: "/account", label: "نمای کلی", icon: LayoutDashboard, exact: true },
  { href: "/account/orders", label: "سفارش‌ها", icon: ShoppingBag },
  { href: "/account/services", label: "درخواست خدمات", icon: Wrench },
  { href: "/account/addresses", label: "آدرس‌ها", icon: MapPin },
  { href: "/account/profile", label: "اطلاعات حساب", icon: UserRound },
];

export function AccountNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="بخش‌های حساب کاربری"
      className="flex gap-1 overflow-x-auto rounded-2xl border border-border bg-surface p-1.5 shadow-soft lg:flex-col lg:overflow-visible"
    >
      {items.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-caption font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-surface-muted hover:text-primary",
            )}
          >
            <item.icon className="h-4 w-4" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
