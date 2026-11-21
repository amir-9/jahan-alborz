import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import {
  ArrowLeft,
  CircleExclamationPoint,
  Coins,
  Package,
  ShoppingBag,
  TrendingUp,
  TriangleAlert,
  Users,
  Wrench,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAdminDashboard } from "@/lib/data/admin-repository";
import { requireAdminPage } from "@/lib/auth/session";
import {
  orderStatusLabels,
  orderStatusTones,
  serviceStatusLabels,
  serviceStatusTones,
} from "@/lib/constants/status";
import { formatDate, formatNumber, formatPrice } from "@/lib/utils/format";

export const metadata: Metadata = {
  title: "داشبورد",
};

/** Dashboard metrics are read from the database on every request. */
export const instant = false;

export default async function AdminDashboardPage() {
  await connection();
  await requireAdminPage(undefined, "/admin");

  let data: Awaited<ReturnType<typeof getAdminDashboard>> | null = null;

  try {
    data = await getAdminDashboard();
  } catch (error) {
    console.error("[admin] dashboard query failed", error);
  }

  if (!data) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-caption leading-6 text-amber-800">
        <p className="flex items-center gap-2 font-bold">
          <CircleExclamationPoint className="h-4 w-4" aria-hidden="true" />
          اطلاعات داشبورد در حال حاضر قابل دریافت نیست.
        </p>
        <p className="mt-1.5">
          اتصال پایگاه داده را بررسی کنید. تا زمانی که داده‌ای خوانده نشود، هیچ
          آمار ساختگی نمایش داده نمی‌شود.
        </p>
      </div>
    );
  }

  const cards = [
    {
      label: "کل سفارش‌ها",
      value: formatNumber(data.totalOrders),
      icon: ShoppingBag,
      hint: `از این تعداد ${formatNumber(data.paidOrderCount)} سفارش پرداخت‌شده در ۶ ماه اخیر`,
      href: "/admin/orders",
    },
    {
      label: "درآمد تأییدشده",
      value: formatPrice(data.totalRevenue),
      icon: Coins,
      hint: "فقط سفارش‌های با پرداخت تأییدشده و بدون لغو",
      href: "/admin/orders?status=DELIVERED",
    },
    {
      label: "سفارش‌های در جریان",
      value: formatNumber(data.pendingOrders),
      icon: TrendingUp,
      hint: "در انتظار بررسی، پرداخت یا تأیید",
      href: "/admin/orders?status=PENDING",
    },
    {
      label: "درخواست‌های خدمات باز",
      value: formatNumber(data.pendingServices),
      icon: Wrench,
      hint: "در انتظار بررسی، تأیید یا ارجاع",
      href: "/admin/services",
    },
    {
      label: "محصولات فعال",
      value: formatNumber(data.totalProducts),
      icon: Package,
      hint: "نمایش‌داده‌شده در فروشگاه",
      href: "/admin/products",
    },
    {
      label: "کالاهای کم‌موجود",
      value: formatNumber(data.lowStockCount),
      icon: TriangleAlert,
      hint: "موجودی ۳ عدد یا کمتر",
      href: "/admin/products?status=ACTIVE",
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-caption font-semibold text-secondary">نمای کلی</p>
        <h1 className="mt-1 text-xl font-extrabold text-primary sm:text-2xl">
          داشبورد مدیریت
        </h1>
        <p className="mt-2 max-w-2xl text-caption leading-6 text-muted-foreground">
          وضعیت سفارش‌ها، درآمد تأییدشده، درخواست‌های خدمات و موجودی محصولات را
          در یک نگاه بررسی کنید.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="group rounded-2xl border border-border bg-surface p-4 shadow-soft transition-[border-color,transform] hover:-translate-y-0.5 hover:border-primary/25"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary">
                <card.icon className="h-4.5 w-4.5" aria-hidden="true" />
              </span>
              <ArrowLeft
                className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-x-0.5 group-hover:text-primary"
                aria-hidden="true"
              />
            </div>
            <p className="mt-3 text-caption text-muted-foreground">{card.label}</p>
            <p className="mt-1 text-xl font-extrabold text-primary">
              {card.value}
            </p>
            <p className="mt-1.5 text-caption leading-5 text-muted-foreground">
              {card.hint}
            </p>
          </Link>
        ))}
      </div>

      <section className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-primary">
              فروش تأییدشده ۶ ماه اخیر
            </h2>
            <p className="mt-1 text-caption text-muted-foreground">
              بر اساس مبلغ سفارش‌هایی که پرداخت آن‌ها تأیید شده است.
            </p>
          </div>
          <Badge variant="outline">
            <Users className="h-3 w-3" aria-hidden="true" />
            {formatNumber(data.paidOrderCount)} سفارش
          </Badge>
        </div>

        <div className="mt-5 flex h-44 items-end gap-2 sm:gap-4">
          {data.salesByMonth.map((month) => (
            <div
              key={month.label}
              className="flex h-full flex-1 flex-col items-center justify-end gap-1.5"
            >
              <span className="text-caption font-semibold text-muted-foreground">
                {month.total > 0 ? formatNumber(Math.round(month.total / 1000)) + " هزار" : ""}
              </span>
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-primary to-primary-600/70 transition-[height] duration-500"
                style={{
                  height: `${Math.max(month.ratio * 100, month.total > 0 ? 6 : 1.5)}%`,
                }}
                aria-hidden="true"
              />
              <span className="text-caption text-muted-foreground">
                {month.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-2">
        <section className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-bold text-primary">آخرین سفارش‌ها</h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/orders">
                همه سفارش‌ها
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </Button>
          </div>

          {data.recentOrders.length === 0 ? (
            <p className="mt-4 rounded-xl border border-dashed border-border px-4 py-6 text-center text-caption text-muted-foreground">
              هنوز سفارشی ثبت نشده است.
            </p>
          ) : (
            <div className="mt-3 flex flex-col gap-2">
              {data.recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border px-3.5 py-2.5 transition-colors hover:border-primary/25 hover:bg-primary-50/30"
                >
                  <div className="min-w-0">
                    <p className="text-caption font-bold text-foreground">
                      {order.customerName}
                    </p>
                    <p className="text-caption text-muted-foreground">
                      <span dir="ltr">{order.orderNumber}</span> ·{" "}
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-caption font-semibold text-primary">
                      {formatPrice(Number(order.total))}
                    </span>
                    <Badge variant={orderStatusTones[order.status]}>
                      {orderStatusLabels[order.status]}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-bold text-primary">
              آخرین درخواست‌های خدمات
            </h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/services">
                همه درخواست‌ها
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </Button>
          </div>

          {data.recentServices.length === 0 ? (
            <p className="mt-4 rounded-xl border border-dashed border-border px-4 py-6 text-center text-caption text-muted-foreground">
              هنوز درخواست خدماتی ثبت نشده است.
            </p>
          ) : (
            <div className="mt-3 flex flex-col gap-2">
              {data.recentServices.map((request) => (
                <Link
                  key={request.id}
                  href={`/admin/services/${request.id}`}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border px-3.5 py-2.5 transition-colors hover:border-primary/25 hover:bg-primary-50/30"
                >
                  <div className="min-w-0">
                    <p className="text-caption font-bold text-foreground">
                      {request.serviceType}
                    </p>
                    <p className="text-caption text-muted-foreground">
                      {request.customerName} ·{" "}
                      <span dir="ltr">{request.customerPhone}</span>
                    </p>
                  </div>
                  <Badge variant={serviceStatusTones[request.status]}>
                    {serviceStatusLabels[request.status]}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      <p className="rounded-2xl border border-dashed border-border bg-surface px-4 py-3 text-caption leading-6 text-muted-foreground">
        آمار این صفحه فقط از داده‌های واقعی پایگاه داده محاسبه می‌شود. اگر
        پایگاه داده در دسترس نباشد، به‌جای نمایش اعداد ساختگی، پیام خطا نمایش
        داده می‌شود.
      </p>
    </div>
  );
}
