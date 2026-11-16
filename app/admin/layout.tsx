import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { AdminNav, type AdminNavItem } from "@/components/admin/admin-nav";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Logo } from "@/components/layout/logo";
import { Badge } from "@/components/ui/badge";
import { hasPermission } from "@/lib/auth/permissions";
import { requireAdminPage } from "@/lib/auth/session";
import { roleLabels } from "@/lib/constants/roles";

export const metadata: Metadata = {
  title: {
    default: "مدیریت",
    template: "%s | پنل مدیریت جهان البرز",
  },
  robots: { index: false, follow: false },
};

export const instant = false;

const items: (AdminNavItem & { permission?: Parameters<typeof hasPermission>[1] })[] =
  [
    { href: "/admin", label: "داشبورد", icon: "dashboard", exact: true },
    {
      href: "/admin/orders",
      label: "سفارش‌ها",
      icon: "orders",
      permission: "orders:read",
    },
    {
      href: "/admin/services",
      label: "درخواست خدمات",
      icon: "services",
      permission: "services:read",
    },
    {
      href: "/admin/products",
      label: "محصولات",
      icon: "products",
      permission: "products:read",
    },
    {
      href: "/admin/categories",
      label: "دسته‌بندی‌ها",
      icon: "categories",
      permission: "products:read",
    },
    {
      href: "/admin/blog",
      label: "وبلاگ",
      icon: "blog",
      permission: "content:write",
    },
    {
      href: "/admin/faq",
      label: "سوالات متداول",
      icon: "faq",
      permission: "content:write",
    },
    {
      href: "/admin/users",
      label: "کاربران و نقش‌ها",
      icon: "users",
      permission: "users:manage",
    },
  ];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connection();

  const user = await requireAdminPage(undefined, "/admin");
  const visibleItems = items
    .filter(
      (item) =>
        item.permission === undefined ||
        hasPermission(user.role, item.permission),
    )
    .map(({ href, label, icon, exact }) => ({ href, label, icon, exact }));

  const initial = user.name?.trim().charAt(0) || "م";

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border/80 bg-surface/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[110rem] items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Logo withCaption={false} />
            <span className="hidden h-6 w-px bg-border sm:block" aria-hidden="true" />
            <span className="hidden items-center gap-1.5 text-[11.5px] font-bold text-primary sm:inline-flex">
              <ShieldCheck className="h-4 w-4 text-secondary" aria-hidden="true" />
              پنل مدیریت
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="hidden items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-semibold text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:inline-flex"
            >
              مشاهده سایت
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-2.5 py-1.5">
              <span
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-[11px] font-extrabold text-primary-foreground"
                aria-hidden="true"
              >
                {initial}
              </span>
              <div className="hidden text-start sm:block">
                <p className="text-[10.5px] font-bold leading-4 text-foreground">
                  {user.name?.trim() || "کاربر مدیریت"}
                </p>
                <p className="text-[9.5px] leading-4 text-muted-foreground">
                  {user.role ? roleLabels[user.role] : "مدیر"}
                </p>
              </div>
            </div>
            <SignOutButton size="sm" variant="ghost" className="px-2.5" />
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-[110rem] gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[15rem_1fr] lg:items-start lg:py-7">
        <aside className="lg:sticky lg:top-24">
          <AdminNav items={visibleItems} />

          <div className="mt-3 hidden rounded-2xl border border-border bg-surface p-4 shadow-soft lg:block">
            <p className="text-[10.5px] font-bold text-primary">دسترسی شما</p>
            <Badge variant="default" className="mt-2">
              {user.role ? roleLabels[user.role] : "مدیر"}
            </Badge>
            <p className="mt-2 text-[10px] leading-5 text-muted-foreground">
              بخش‌های غیرمجاز برای نقش شما در منو نمایش داده نمی‌شوند و در سرور
              نیز مسدود هستند.
            </p>
          </div>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
