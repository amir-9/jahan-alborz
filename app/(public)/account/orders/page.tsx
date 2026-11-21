import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CircleExclamationPoint, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCustomerOrders } from "@/lib/data/account-repository";
import { requireUserPage } from "@/lib/auth/session";
import {
  orderStatusLabels,
  orderStatusTones,
  paymentStatusLabels,
  paymentStatusTones,
} from "@/lib/constants/status";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { formatDate, formatNumber, formatPrice } from "@/lib/utils/format";

export const metadata: Metadata = buildPageMetadata({
  title: "سفارش‌های من",
  description: "تاریخچه سفارش‌های مشتریان جهان البرز.",
  path: "/account/orders",
  noIndex: true,
});

/** Order history is read from the database per request. */
export const instant = false;

export default async function AccountOrdersPage() {
  const user = await requireUserPage("/account/orders");

  let orders: Awaited<ReturnType<typeof getCustomerOrders>> = [];
  let failed = false;

  try {
    orders = await getCustomerOrders(user.id);
  } catch (error) {
    console.error("[account] orders query failed", error);
    failed = true;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-base font-extrabold text-primary">سفارش‌های من</h2>
          <p className="mt-1 text-caption leading-6 text-muted-foreground">
            وضعیت پرداخت، آماده‌سازی و ارسال هر سفارش را از این بخش پیگیری کنید.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/shop">خرید از فروشگاه</Link>
        </Button>
      </div>

      {failed ? (
        <div className="flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-caption leading-6 text-amber-800">
          <CircleExclamationPoint
            className="mt-0.5 h-4 w-4 shrink-0"
            aria-hidden="true"
          />
          دریافت سفارش‌ها در حال حاضر ممکن نیست. لطفاً کمی بعد دوباره تلاش کنید.
        </div>
      ) : null}

      {!failed && orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface px-5 py-12 text-center shadow-soft">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary">
            <ShoppingBag className="h-6 w-6" aria-hidden="true" />
          </span>
          <p className="mt-4 text-caption font-bold text-primary">
            هنوز سفارشی ثبت نشده است
          </p>
          <p className="mx-auto mt-1.5 max-w-sm text-caption leading-6 text-muted-foreground">
            پس از ثبت سفارش، شماره پیگیری و وضعیت آن در همین صفحه نمایش داده
            می‌شود.
          </p>
          <Button asChild className="mt-5">
            <Link href="/shop">مشاهده محصولات</Link>
          </Button>
        </div>
      ) : null}

      <div className="flex flex-col gap-3">
        {orders.map((order) => (
          <article
            key={order.id}
            className="rounded-2xl border border-border bg-surface p-4 shadow-soft sm:p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-caption text-muted-foreground">
                  شماره سفارش{" "}
                  <span dir="ltr" className="font-bold text-foreground">
                    {order.orderNumber}
                  </span>
                </p>
                <p className="mt-1 text-caption text-muted-foreground">
                  {formatDate(order.createdAt)} ·{" "}
                  {formatNumber(order.items.length)} قلم کالا
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge variant={orderStatusTones[order.status]}>
                  {orderStatusLabels[order.status]}
                </Badge>
                <Badge variant={paymentStatusTones[order.paymentStatus]}>
                  {paymentStatusLabels[order.paymentStatus]}
                </Badge>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
              <p className="text-caption font-extrabold text-primary">
                {formatPrice(Number(order.total))}
              </p>
              <Link
                href={`/account/orders/${order.id}`}
                className="inline-flex items-center gap-1 text-caption font-semibold text-primary hover:underline"
              >
                جزئیات سفارش
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
