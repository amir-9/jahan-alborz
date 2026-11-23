import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import {
  CircleCheck,
  CircleExclamationPoint,
  MapPin,
  Package,
  Phone,
  Truck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/lib/config/site";
import { getOrderByNumber } from "@/lib/data/account-repository";
import { getSession, toSessionUser } from "@/lib/auth/session";
import { hasOrderAccess } from "@/lib/orders/access";
import {
  orderStatusLabels,
  orderStatusTones,
  paymentMethodLabels,
  paymentStatusLabels,
  shippingMethodLabels,
} from "@/lib/constants/status";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { formatDate, formatNumber, formatPrice, toTelHref } from "@/lib/utils/format";

type ConfirmationPageProps = {
  params: Promise<{ orderNumber: string }>;
};

export const metadata: Metadata = buildPageMetadata({
  title: "تأیید سفارش",
  description: "جزئیات سفارش ثبت‌شده در جهان البرز.",
  path: "/checkout/confirmation",
  noIndex: true,
});

/** The confirmation page reads the order and its access cookie per request. */
export const instant = false;

export default async function CheckoutConfirmationPage({
  params,
}: ConfirmationPageProps) {
  await connection();

  const { orderNumber } = await params;
  const user = toSessionUser(await getSession());

  let order: Awaited<ReturnType<typeof getOrderByNumber>> = null;

  try {
    order = await getOrderByNumber(orderNumber);
  } catch (error) {
    console.error("[checkout] confirmation query failed", error);
  }

  if (!order) {
    notFound();
  }

  const allowed = await hasOrderAccess(
    order.orderNumber,
    order.userId,
    user?.id ?? null,
  );

  // Hide the record rather than leaking another customer's order.
  if (!allowed) {
    notFound();
  }

  const isAwaitingPayment = order.paymentStatus === "PENDING" && order.paymentMethod === "ONLINE";

  return (
    <div className="page-shell page-container pb-16 pt-6 sm:pt-8">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-3xl border border-border bg-surface p-6 text-center shadow-soft sm:p-9">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 text-success">
            <CircleCheck className="h-8 w-8" aria-hidden="true" />
          </span>
          <p className="mt-4 text-caption font-semibold text-success">
            سفارش در سامانه ثبت شد
          </p>
          <h1 className="mt-1 text-2xl font-extrabold text-primary">
            سفارش شما دریافت شد
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-caption leading-7 text-muted-foreground">
            برای بررسی موجودی و هماهنگی هزینه ارسال با شما تماس می‌گیریم. شماره
            سفارش را برای پیگیری نگه دارید.
          </p>

          <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-2 rounded-2xl bg-surface-muted px-4 py-3">
            <span className="text-caption text-muted-foreground">
              شماره سفارش
            </span>
            <span
              dir="ltr"
              className="text-base font-extrabold tracking-wide text-primary"
            >
              {order.orderNumber}
            </span>
            <Badge variant={orderStatusTones[order.status]}>
              {orderStatusLabels[order.status]}
            </Badge>
          </div>
        </div>

        {isAwaitingPayment ? (
          <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-caption leading-6 text-amber-800">
            <CircleExclamationPoint
              className="mt-0.5 h-4 w-4 shrink-0"
              aria-hidden="true"
            />
            <span>
              درگاه پرداخت آنلاین در این نسخه فعال نشده است؛ بنابراین سفارش شما
              در وضعیت «در انتظار پرداخت» ثبت شده و پرداخت‌شده محسوب نمی‌شود.
              برای هماهنگی پرداخت با فروشگاه تماس بگیرید.
            </span>
          </div>
        ) : null}

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <section className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
            <h2 className="flex items-center gap-2 text-sm font-bold text-primary">
              <Package className="h-4 w-4 text-secondary" aria-hidden="true" />
              اقلام سفارش
            </h2>
            <div className="mt-3 flex flex-col gap-2">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-2 border-b border-border pb-2 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="text-caption font-semibold text-foreground">
                      {item.productName}
                    </p>
                    <p className="text-caption text-muted-foreground">
                      {formatNumber(item.quantity)} ×{" "}
                      {formatPrice(Number(item.productPrice))}
                    </p>
                  </div>
                  <p className="text-caption font-semibold text-primary">
                    {formatPrice(Number(item.lineTotal))}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
            <h2 className="flex items-center gap-2 text-sm font-bold text-primary">
              <MapPin className="h-4 w-4 text-secondary" aria-hidden="true" />
              اطلاعات تحویل
            </h2>
            <div className="mt-3 space-y-1.5 text-caption leading-6 text-muted-foreground">
              <p className="font-semibold text-foreground">
                {order.customerName}
              </p>
              <p dir="ltr" className="text-start">
                {order.customerPhone}
              </p>
              <p>
                {[order.province, order.city, order.shippingAddress]
                  .filter(Boolean)
                  .join("، ")}
              </p>
              <p className="inline-flex items-center gap-1.5 rounded-lg bg-surface-muted px-2.5 py-1 text-caption">
                <Truck className="h-3.5 w-3.5" aria-hidden="true" />
                {shippingMethodLabels[order.shippingMethod]}
              </p>
              <p>روش پرداخت: {paymentMethodLabels[order.paymentMethod]}</p>
              <p>وضعیت پرداخت: {paymentStatusLabels[order.paymentStatus]}</p>
            </div>
          </section>
        </div>

        <section className="mt-4 rounded-2xl border border-border bg-surface p-5 shadow-soft">
          <dl className="flex flex-col gap-2 text-caption">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">جمع کالاها</dt>
              <dd className="font-semibold text-foreground">
                {formatPrice(Number(order.subtotal))}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">هزینه ارسال</dt>
              <dd className="text-caption text-muted-foreground">
                پس از تأیید فروشگاه
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">تاریخ ثبت</dt>
              <dd className="text-foreground">{formatDate(order.createdAt)}</dd>
            </div>
            <Separator className="my-1" />
            <div className="flex items-center justify-between">
              <dt className="font-bold text-primary">مبلغ قابل پرداخت</dt>
              <dd className="text-sm font-extrabold text-primary">
                {formatPrice(Number(order.total))}
              </dd>
            </div>
          </dl>
        </section>

        <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
          {user ? (
            <Button asChild>
              <Link href={`/account/orders/${order.id}`}>
                مشاهده سفارش در حساب کاربری
              </Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href="/auth/login?callbackUrl=%2Faccount%2Forders">
                ورود برای پیگیری سفارش
              </Link>
            </Button>
          )}
          <Button asChild variant="outline">
            <a href={toTelHref(siteConfig.contact.phone)} dir="ltr">
              <Phone className="h-4 w-4" aria-hidden="true" />
              {siteConfig.contact.phone}
            </a>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/shop">ادامه خرید</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
