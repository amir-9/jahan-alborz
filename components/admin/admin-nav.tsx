"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageCircleQuestion,
  Newspaper,
  Package,
  ShoppingBag,
  Tags,
  Users,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type AdminNavItem = {
  href: string;
  label: string;
  icon:
    | "dashboard"
    | "orders"
    | "services"
    | "products"
    | "categories"
    | "faq"
    | "blog"
    | "users";
  exact?: boolean;
};

const icons = {
  dashboard: LayoutDashboard,
  orders: ShoppingBag,
  services: Wrench,
  products: Package,
  categories: Tags,
  faq: MessageCircleQuestion,
  blog: Newspaper,
  users: Users,
};

export function AdminNav({ items }: { items: AdminNavItem[] }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="بخش‌های مدیریت"
      className="flex gap-1 overflow-x-auto rounded-2xl border border-border bg-surface p-1.5 shadow-soft lg:flex-col lg:overflow-visible"
    >
      {items.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = icons[item.icon];

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-[11.5px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-surface-muted hover:text-primary",
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
