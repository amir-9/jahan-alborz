import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CircleCheck,
  CircleExclamationPoint,
  Clock,
  MapPin,
  Package,
  Truck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getCustomerOrder } from "@/lib/data/account-repository";
import { requireUserPage } from "@/lib/auth/session";
import {
  orderStatusLabels,
  orderStatusTones,
  paymentMethodLabels,
  paymentStatusLabels,
  paymentStatusTones,
  shippingMethodLabels,
} from "@/lib/constants/status";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { formatDate, formatNumber, formatPrice } from "@/lib/utils/format";

type OrderDetailPageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = buildPageMetadata({
  title: "جزئیات سفارش",
  description: "جزئیات سفارش مشتریان جهان البرز.",
  path: "/account/orders",
  noIndex: true,
});

/** Order details are read from the database per request. */
export const instant = false;

export default async function AccountOrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const user = await requireUserPage("/account/orders");
  const { id } = await params;

  let order: Awaited<ReturnType<typeof getCustomerOrder>> = null;
  let failed = false;

  try {
    // The query is scoped by userId, so another customer's id returns null.
    order = await getCustomerOrder(user.id, id);
  } catch (error) {
    console.error("[account] order detail query failed", error);
    failed = true;
  }

  if (!failed && !order) {
    notFound();
  }

  if (failed || !order) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6 text-center shadow-soft">
        <CircleExclamationPoint
          className="mx-auto h-7 w-7 text-amber-600"
          aria-hidden="true"
        />
        <p className="mt-3 text-caption font-semibold text-primary">
          دریافت جزئیات سفارش در حال حاضر ممکن نیست.
        </p>
        <Button asChild variant="outline" size="sm" className="mt-4">
          <Link href="/account/orders">بازگشت به سفارش‌ها</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-1 text-caption font-semibold text-muted-foreground hover:text-primary"
          >
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            همه سفارش‌ها
          </Link>
          <h2 className="mt-1 text-base font-extrabold text-primary">
            سفارش{" "}
            <span dir="ltr" className="font-bold">
              {order.orderNumber}
            </span>
          </h2>
          <p className="mt-1 text-caption text-muted-foreground">
            ثبت‌شده در {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Badge variant={orderStatusTones[order.status]}>
            {orderStatusLabels[order.status]}
          </Badge>
          <Badge variant={paymentStatusTones[order.paymentStatus]}>
            {paymentStatusLabels[order.paymentStatus]}
          </Badge>
        </div>
      </div>

      {order.paymentStatus === "PENDING" &&
      order.paymentMethod === "ONLINE" ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-caption leading-6 text-amber-800">
          درگاه پرداخت آنلاین در این نسخه فعال نشده است. سفارش شما ثبت شده و برای
          هماهنگی پرداخت با شما تماس می‌گیریم. سفارش تا زمان تأیید پرداخت، پرداخت
          نشده محسوب می‌شود.
        </div>
      ) : null}

      <section className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
        <h3 className="flex items-center gap-2 text-sm font-bold text-primary">
          <Package className="h-4 w-4 text-secondary" aria-hidden="true" />
          اقلام سفارش
        </h3>

        <div className="mt-3 flex flex-col gap-2">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border px-3.5 py-3"
            >
              <div className="min-w-0">
                <Link
                  href={`/products/${item.productSlug}`}
                  className="text-caption font-semibold text-primary hover:underline"
                >
                  {item.productName}
                </Link>
                <p className="mt-0.5 text-caption text-muted-foreground">
                  {formatNumber(item.quantity)} عدد ×{" "}
                  {formatPrice(Number(item.productPrice))}
                </p>
              </div>
              <p className="text-caption font-bold text-primary">
                {formatPrice(Number(item.lineTotal))}
              </p>
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        <dl className="flex flex-col gap-2 text-caption">
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">جمع کالاها</dt>
            <dd className="font-semibold text-foreground">
              {formatPrice(Number(order.subtotal))}
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">هزینه ارسال</dt>
            <dd className="font-semibold text-foreground">
              {Number(order.shippingCost) > 0
                ? formatPrice(Number(order.shippingCost))
                : "پس از تأیید فروشگاه"}
            </dd>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-2">
            <dt className="font-bold text-primary">مبلغ قابل پرداخت</dt>
            <dd className="text-sm font-extrabold text-primary">
              {formatPrice(Number(order.total))}
            </dd>
          </div>
        </dl>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <section className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
          <h3 className="flex items-center gap-2 text-sm font-bold text-primary">
            <MapPin className="h-4 w-4 text-secondary" aria-hidden="true" />
            اطلاعات تحویل
          </h3>
          <div className="mt-3 space-y-1.5 text-caption leading-6 text-muted-foreground">
            <p className="font-semibold text-foreground">{order.customerName}</p>
            <p dir="ltr" className="text-start">
              {order.customerPhone}
            </p>
            <p>
              {[order.province, order.city, order.shippingAddress]
                .filter(Boolean)
                .join("، ")}
            </p>
            {order.postalCode ? (
              <p>
                کد پستی:{" "}
                <span dir="ltr">{order.postalCode}</span>
              </p>
            ) : null}
            <p className="inline-flex items-center gap-1.5 rounded-lg bg-surface-muted px-2.5 py-1 text-caption">
              <Truck className="h-3.5 w-3.5" aria-hidden="true" />
              روش ارسال: {shippingMethodLabels[order.shippingMethod]}
            </p>
            {order.shipping?.trackingCode ? (
              <p>
                کد رهگیری:{" "}
                <span dir="ltr" className="font-semibold text-foreground">
                  {order.shipping.trackingCode}
                </span>
              </p>
            ) : null}
            {order.payment ? (
              <p>
                روش پرداخت: {paymentMethodLabels[order.payment.method]}
              </p>
            ) : null}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
          <h3 className="flex items-center gap-2 text-sm font-bold text-primary">
            <Clock className="h-4 w-4 text-secondary" aria-hidden="true" />
            روند سفارش
          </h3>
          <ol className="mt-3 space-y-3">
            {order.statusHistory.length === 0 ? (
              <li className="text-caption text-muted-foreground">
                هنوز رویدادی ثبت نشده است.
              </li>
            ) : (
              order.statusHistory.map((event, index) => (
                <li key={event.id} className="flex gap-2.5">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary">
                    {index === order.statusHistory.length - 1 ? (
                      <CircleCheck className="h-3 w-3" aria-hidden="true" />
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    )}
                  </span>
                  <div>
                    <p className="text-caption font-semibold text-foreground">
                      {orderStatusLabels[event.status]}
                    </p>
                    <p className="text-caption text-muted-foreground">
                      {formatDate(event.createdAt)}
                    </p>
                  </div>
                </li>
              ))
            )}
          </ol>
        </section>
      </div>

      {order.notes ? (
        <p className="rounded-2xl border border-dashed border-border bg-surface px-4 py-3 text-caption leading-6 text-muted-foreground">
          یادداشت سفارش: {order.notes}
        </p>
      ) : null}
    </div>
  );
}
