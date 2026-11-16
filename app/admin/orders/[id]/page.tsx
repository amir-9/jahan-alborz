import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import {
  ArrowRight,
  CircleExclamationPoint,
  Clock,
  MapPin,
  Package,
  Phone,
  UserRound,
} from "lucide-react";
import {
  OrderPaymentForm,
  OrderShippingForm,
  OrderStatusForm,
} from "@/components/admin/order-forms";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getAdminOrder } from "@/lib/data/admin-repository";
import { requireAdminPage } from "@/lib/auth/session";
import {
  orderStatusLabels,
  orderStatusTones,
  paymentMethodLabels,
  paymentStatusLabels,
  paymentStatusTones,
  shippingMethodLabels,
} from "@/lib/constants/status";
import { formatDate, formatNumber, formatPrice, toTelHref } from "@/lib/utils/format";

export const metadata: Metadata = {
  title: "جزئیات سفارش",
};

/** Order detail always reflects the latest status and payment records. */
export const instant = false;

type AdminOrderDetailProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminOrderDetailPage({
  params,
}: AdminOrderDetailProps) {
  await connection();
  await requireAdminPage("orders:read", "/admin/orders");

  const { id } = await params;

  let order: Awaited<ReturnType<typeof getAdminOrder>> = null;
  let failed = false;

  try {
    order = await getAdminOrder(id);
  } catch (error) {
    console.error("[admin] order detail query failed", error);
    failed = true;
  }

  if (!failed && !order) {
    notFound();
  }

  if (failed || !order) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-[11.5px] leading-6 text-amber-800">
        <p className="flex items-center gap-2 font-bold">
          <CircleExclamationPoint className="h-4 w-4" aria-hidden="true" />
          دریافت جزئیات سفارش در حال حاضر ممکن نیست.
        </p>
        <Button asChild variant="outline" size="sm" className="mt-3">
          <Link href="/admin/orders">بازگشت به سفارش‌ها</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-muted-foreground hover:text-primary"
          >
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            همه سفارش‌ها
          </Link>
          <h1 className="mt-1 text-lg font-extrabold text-primary sm:text-xl">
            سفارش{" "}
            <span dir="ltr" className="font-bold">
              {order.orderNumber}
            </span>
          </h1>
          <p className="mt-1 text-[10.5px] text-muted-foreground">
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
          <Badge variant="outline">
            {paymentMethodLabels[order.paymentMethod]}
          </Badge>
        </div>
      </div>

      {order.status === "AWAITING_PAYMENT" ? (
        <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-[10.5px] leading-6 text-amber-800">
          این سفارش در انتظار پرداخت آنلاین است. درگاه پرداخت در نسخه فعلی فعال
          نیست؛ پرداخت فقط پس از تأیید واقعی واریز، دستی ثبت شود.
        </p>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr] xl:items-start">
        <div className="flex flex-col gap-4">
          <section className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
            <h2 className="flex items-center gap-2 text-sm font-bold text-primary">
              <Package className="h-4 w-4 text-secondary" aria-hidden="true" />
              اقلام سفارش
            </h2>

            <div className="mt-3 flex flex-col gap-2">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border px-3.5 py-3"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/products/${item.productSlug}`}
                      className="text-[11.5px] font-semibold text-primary hover:underline"
                    >
                      {item.productName}
                    </Link>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      {formatNumber(item.quantity)} عدد ×{" "}
                      {formatPrice(Number(item.productPrice))}
                    </p>
                  </div>
                  <p className="text-[11px] font-bold text-primary">
                    {formatPrice(Number(item.lineTotal))}
                  </p>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <dl className="flex flex-col gap-2 text-[11.5px]">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">جمع کالاها</dt>
                <dd className="font-semibold text-foreground">
                  {formatPrice(Number(order.subtotal))}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">تخفیف</dt>
                <dd className="font-semibold text-foreground">
                  {formatPrice(Number(order.discount))}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">هزینه ارسال</dt>
                <dd className="font-semibold text-foreground">
                  {formatPrice(Number(order.shippingCost))}
                </dd>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-2">
                <dt className="font-bold text-primary">مبلغ کل</dt>
                <dd className="text-sm font-extrabold text-primary">
                  {formatPrice(Number(order.total))}
                </dd>
              </div>
            </dl>

            {order.notes ? (
              <p className="mt-4 rounded-xl bg-surface-muted px-3.5 py-2.5 text-[10.5px] leading-6 text-muted-foreground">
                یادداشت مشتری: {order.notes}
              </p>
            ) : null}
          </section>

          <section className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
            <h2 className="flex items-center gap-2 text-sm font-bold text-primary">
              <MapPin className="h-4 w-4 text-secondary" aria-hidden="true" />
              اطلاعات تحویل و مشتری
            </h2>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border px-3.5 py-3 text-[11px] leading-6">
                <p className="flex items-center gap-1.5 font-bold text-foreground">
                  <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
                  {order.customerName}
                </p>
                <a
                  href={toTelHref(order.customerPhone)}
                  dir="ltr"
                  className="mt-1 flex items-center gap-1.5 text-start text-primary hover:underline"
                >
                  <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                  {order.customerPhone}
                </a>
                {order.customerEmail ? (
                  <p className="mt-1 text-[10.5px] text-muted-foreground" dir="ltr">
                    {order.customerEmail}
                  </p>
                ) : null}
                <p className="mt-1 text-[10.5px] text-muted-foreground">
                  {order.user
                    ? `حساب کاربری: ${order.user.name ?? "بدون نام"} (${order.user.isActive ? "فعال" : "غیرفعال"})`
                    : "خرید مهمان بدون حساب کاربری"}
                </p>
              </div>

              <div className="rounded-xl border border-border px-3.5 py-3 text-[11px] leading-6">
                <p className="font-bold text-foreground">
                  {[order.province, order.city].filter(Boolean).join("، ")}
                </p>
                <p className="mt-1 text-muted-foreground">
                  {order.shippingAddress}
                </p>
                {order.postalCode ? (
                  <p className="mt-1 text-[10.5px] text-muted-foreground">
                    کد پستی: <span dir="ltr">{order.postalCode}</span>
                  </p>
                ) : null}
                <p className="mt-1 text-[10.5px] text-muted-foreground">
                  روش ارسال: {shippingMethodLabels[order.shippingMethod]}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
            <h2 className="flex items-center gap-2 text-sm font-bold text-primary">
              <Clock className="h-4 w-4 text-secondary" aria-hidden="true" />
              تاریخچه وضعیت
            </h2>
            <ol className="mt-3 space-y-3">
              {order.statusHistory.length === 0 ? (
                <li className="text-[11px] text-muted-foreground">
                  هنوز رویدادی ثبت نشده است.
                </li>
              ) : (
                order.statusHistory.map((event, index) => (
                  <li key={event.id} className="flex gap-2.5">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary">
                      {index === order.statusHistory.length - 1 ? (
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      ) : (
                        <span className="h-1 w-1 rounded-full bg-primary/50" />
                      )}
                    </span>
                    <div>
                      <p className="text-[11px] font-semibold text-foreground">
                        {orderStatusLabels[event.status]}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {formatDate(event.createdAt)}
                        {event.note ? ` · ${event.note}` : ""}
                      </p>
                    </div>
                  </li>
                ))
              )}
            </ol>
          </section>
        </div>

        <div className="flex flex-col gap-4 xl:sticky xl:top-24">
          <OrderStatusForm
            orderId={order.id}
            currentStatus={order.status}
            isCancelled={order.status === "CANCELLED"}
          />

          <OrderPaymentForm
            orderId={order.id}
            currentStatus={order.paymentStatus}
          />

          <OrderShippingForm
            orderId={order.id}
            currentMethod={order.shippingMethod}
            currentCost={Number(order.shippingCost)}
            currentTrackingCode={order.shipping?.trackingCode ?? ""}
            currentNotes={order.shipping?.notes ?? ""}
            disabled={order.paymentStatus === "PAID"}
          />

          {order.payment ? (
            <div className="rounded-2xl border border-border bg-surface p-4 shadow-soft">
              <p className="text-[10.5px] font-bold text-primary">
                اطلاعات پرداخت ثبت‌شده
              </p>
              <dl className="mt-2 space-y-1 text-[10.5px] text-muted-foreground">
                <div className="flex justify-between gap-2">
                  <dt>مبلغ</dt>
                  <dd className="font-semibold text-foreground">
                    {formatPrice(Number(order.payment.amount))}
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt>روش</dt>
                  <dd>{paymentMethodLabels[order.payment.method]}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt>درگاه</dt>
                  <dd>{order.payment.provider ?? "ثبت دستی"}</dd>
                </div>
                {order.payment.paidAt ? (
                  <div className="flex justify-between gap-2">
                    <dt>زمان تأیید</dt>
                    <dd>{formatDate(order.payment.paidAt)}</dd>
                  </div>
                ) : null}
              </dl>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
