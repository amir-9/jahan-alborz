import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  CircleExclamationPoint,
  PackageCheck,
  ShoppingBag,
  Wrench,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCustomerOrderSummary } from "@/lib/data/account-repository";
import { requireUserPage } from "@/lib/auth/session";
import { orderStatusLabels, orderStatusTones } from "@/lib/constants/status";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { formatDate, formatNumber, formatPrice } from "@/lib/utils/format";

export const metadata: Metadata = buildPageMetadata({
  title: "حساب کاربری",
  description: "نمای کلی حساب کاربری مشتریان جهان البرز.",
  path: "/account",
  noIndex: true,
});

/** Account data is read from the database per request. */
export const instant = false;

export default async function AccountPage() {
  const user = await requireUserPage("/account");

  let summary: Awaited<ReturnType<typeof getCustomerOrderSummary>> | null = null;
  let failed = false;

  try {
    summary = await getCustomerOrderSummary(user.id);
  } catch (error) {
    console.error("[account] summary query failed", error);
    failed = true;
  }

  const cards = [
    {
      label: "سفارش‌های ثبت‌شده",
      value: summary ? formatNumber(summary.orderCount) : "—",
      icon: ShoppingBag,
      href: "/account/orders",
    },
    {
      label: "سفارش‌های در انتظار",
      value: summary ? formatNumber(summary.pendingOrders) : "—",
      icon: PackageCheck,
      href: "/account/orders",
    },
    {
      label: "درخواست‌های خدمات",
      value: summary ? formatNumber(summary.serviceCount) : "—",
      icon: Wrench,
      href: "/account/services",
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      {failed ? (
        <div className="flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-[11.5px] leading-6 text-amber-800">
          <CircleExclamationPoint
            className="mt-0.5 h-4 w-4 shrink-0"
            aria-hidden="true"
          />
          اطلاعات سفارش‌ها در حال حاضر قابل دریافت نیست. لطفاً کمی بعد صفحه را
          دوباره بارگذاری کنید.
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="group rounded-2xl border border-border bg-surface p-4 shadow-soft transition-[border-color,transform] hover:-translate-y-0.5 hover:border-primary/25"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary">
              <card.icon className="h-4.5 w-4.5" aria-hidden="true" />
            </span>
            <p className="mt-3 text-[11px] text-muted-foreground">{card.label}</p>
            <p className="mt-1 text-xl font-extrabold text-primary">{card.value}</p>
          </Link>
        ))}
      </div>

      <section className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-bold text-primary">آخرین سفارش</h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/account/orders">
              همه سفارش‌ها
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        {!summary?.latestOrder ? (
          <div className="mt-4 rounded-xl border border-dashed border-border bg-surface-muted px-4 py-8 text-center">
            <p className="text-[12px] font-semibold text-primary">
              هنوز سفارشی ثبت نکرده‌اید.
            </p>
            <p className="mt-1.5 text-[11px] leading-6 text-muted-foreground">
              محصولات فروشگاه را مرور کنید یا برای انتخاب تجهیزات مناسب از مشاوره
              پیش از خرید استفاده کنید.
            </p>
            <Button asChild size="sm" className="mt-4">
              <Link href="/shop">مشاهده فروشگاه</Link>
            </Button>
          </div>
        ) : (
          <Link
            href={`/account/orders/${summary.latestOrder.id}`}
            className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border px-4 py-3 transition-colors hover:border-primary/25 hover:bg-primary-50/30"
          >
            <div>
              <p className="text-[11px] text-muted-foreground">
                شماره سفارش{" "}
                <span dir="ltr" className="font-semibold text-foreground">
                  {summary.latestOrder.orderNumber}
                </span>
              </p>
              <p className="mt-1 text-[12px] font-semibold text-primary">
                {formatPrice(Number(summary.latestOrder.total))}
              </p>
              <p className="mt-0.5 text-[10.5px] text-muted-foreground">
                {formatDate(summary.latestOrder.createdAt)} ·{" "}
                {formatNumber(summary.latestOrder.items.length)} قلم
              </p>
            </div>
            <Badge variant={orderStatusTones[summary.latestOrder.status]}>
              {orderStatusLabels[summary.latestOrder.status]}
            </Badge>
          </Link>
        )}
      </section>

      <section className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
        <h2 className="text-sm font-bold text-primary">دسترسی سریع</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <Link
            href="/account/profile"
            className="rounded-xl border border-border px-4 py-3 text-[11.5px] font-semibold text-muted-foreground transition-colors hover:border-primary/25 hover:text-primary"
          >
            تکمیل اطلاعات حساب
          </Link>
          <Link
            href="/account/addresses"
            className="rounded-xl border border-border px-4 py-3 text-[11.5px] font-semibold text-muted-foreground transition-colors hover:border-primary/25 hover:text-primary"
          >
            مدیریت آدرس‌های تحویل
          </Link>
          <Link
            href="/services/request"
            className="rounded-xl border border-border px-4 py-3 text-[11.5px] font-semibold text-muted-foreground transition-colors hover:border-primary/25 hover:text-primary"
          >
            ثبت درخواست تعمیر یا سرویس
          </Link>
          <Link
            href="/faq"
            className="rounded-xl border border-border px-4 py-3 text-[11.5px] font-semibold text-muted-foreground transition-colors hover:border-primary/25 hover:text-primary"
          >
            سوالات متداول ارسال و پرداخت
          </Link>
        </div>
      </section>
    </div>
  );
}
