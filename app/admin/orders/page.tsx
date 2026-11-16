import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { ArrowLeft, CircleExclamationPoint, Inbox } from "lucide-react";
import {
  AdminFilterBar,
  AdminPagination,
  AdminSelectFilter,
} from "@/components/admin/filter-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAdminOrders } from "@/lib/data/admin-repository";
import { requireAdminPage } from "@/lib/auth/session";
import {
  orderStatusLabels,
  orderStatusOptions,
  orderStatusTones,
  paymentStatusLabels,
  paymentStatusTones,
} from "@/lib/constants/status";
import { formatDate, formatNumber, formatPrice } from "@/lib/utils/format";

export const metadata: Metadata = {
  title: "سفارش‌ها",
};

/** Order lists are read per request with live filters. */
export const instant = false;

type AdminOrdersPageProps = {
  searchParams: Promise<{ search?: string; status?: string; page?: string }>;
};

export default async function AdminOrdersPage({
  searchParams,
}: AdminOrdersPageProps) {
  await connection();
  await requireAdminPage("orders:read", "/admin/orders");

  const params = await searchParams;
  const page = Number.parseInt(params.page ?? "1", 10) || 1;

  let result: Awaited<ReturnType<typeof getAdminOrders>> | null = null;

  try {
    result = await getAdminOrders({
      search: params.search,
      status: params.status,
      page,
    });
  } catch (error) {
    console.error("[admin] orders query failed", error);
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-extrabold text-primary sm:text-xl">
          مدیریت سفارش‌ها
        </h1>
        <p className="mt-1.5 text-[11.5px] leading-6 text-muted-foreground">
          سفارش‌ها را بررسی کنید و وضعیت، پرداخت و اطلاعات ارسال را به‌روزرسانی
          کنید.
        </p>
      </div>

      <AdminFilterBar
        action="/admin/orders"
        searchValue={params.search}
        searchPlaceholder="شماره سفارش، نام مشتری یا موبایل"
        resetHref="/admin/orders"
      >
        <AdminSelectFilter
          name="status"
          label="وضعیت سفارش"
          value={params.status}
          options={orderStatusOptions}
        />
      </AdminFilterBar>

      {!result ? (
        <div className="flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-[11.5px] leading-6 text-amber-800">
          <CircleExclamationPoint
            className="mt-0.5 h-4 w-4 shrink-0"
            aria-hidden="true"
          />
          دریافت سفارش‌ها در حال حاضر ممکن نیست. اتصال پایگاه داده را بررسی کنید.
        </div>
      ) : result.orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface px-5 py-12 text-center shadow-soft">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary">
            <Inbox className="h-6 w-6" aria-hidden="true" />
          </span>
          <p className="mt-4 text-[12.5px] font-bold text-primary">
            سفارشی با این فیلترها یافت نشد
          </p>
          <p className="mt-1.5 text-[11px] text-muted-foreground">
            فیلترها را تغییر دهید یا عبارت جستجو را حذف کنید.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-soft">
            <div className="hidden grid-cols-[1.4fr_1.3fr_1fr_0.9fr_0.9fr_auto] gap-3 border-b border-border bg-surface-muted px-4 py-2.5 text-[10px] font-bold text-muted-foreground lg:grid">
              <span>شماره سفارش / مشتری</span>
              <span>تاریخ</span>
              <span>مبلغ</span>
              <span>پرداخت</span>
              <span>وضعیت</span>
              <span className="text-end">جزئیات</span>
            </div>

            <div className="divide-y divide-border">
              {result.orders.map((order) => (
                <div
                  key={order.id}
                  className="grid gap-2 px-4 py-3.5 transition-colors hover:bg-primary-50/20 lg:grid-cols-[1.4fr_1.3fr_1fr_0.9fr_0.9fr_auto] lg:items-center lg:gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-[11.5px] font-bold text-foreground">
                      {order.customerName}
                    </p>
                    <p
                      dir="ltr"
                      className="mt-0.5 text-start text-[10px] text-muted-foreground"
                    >
                      {order.orderNumber}
                    </p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground lg:hidden">
                      {formatDate(order.createdAt)} ·{" "}
                      {formatNumber(order.items.length)} قلم
                    </p>
                  </div>

                  <div className="hidden text-[10.5px] text-muted-foreground lg:block">
                    {formatDate(order.createdAt)}
                    <span className="mt-0.5 block text-[9.5px]">
                      {formatNumber(order.items.length)} قلم کالا
                    </span>
                  </div>

                  <p className="text-[11px] font-semibold text-primary">
                    {formatPrice(Number(order.total))}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge variant={paymentStatusTones[order.paymentStatus]}>
                      {paymentStatusLabels[order.paymentStatus]}
                    </Badge>
                    <Badge variant={orderStatusTones[order.status]}>
                      {orderStatusLabels[order.status]}
                    </Badge>
                  </div>

                  <div className="lg:text-end">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/orders/${order.id}`}>
                        مشاهده
                        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <AdminPagination
            basePath="/admin/orders"
            params={{ search: params.search, status: params.status }}
            page={result.page}
            pageCount={result.pageCount}
            total={result.total}
          />
        </>
      )}
    </div>
  );
}
