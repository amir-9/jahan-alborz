import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { ArrowLeft, CircleExclamationPoint, Inbox, Phone } from "lucide-react";
import {
  AdminFilterBar,
  AdminPagination,
  AdminSelectFilter,
} from "@/components/admin/filter-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAdminServiceRequests } from "@/lib/data/admin-repository";
import { requireAdminPage } from "@/lib/auth/session";
import {
  serviceStatusLabels,
  serviceStatusOptions,
  serviceStatusTones,
} from "@/lib/constants/status";
import { formatDate, formatNumber, toTelHref } from "@/lib/utils/format";

export const metadata: Metadata = {
  title: "درخواست خدمات",
};

/** Service request lists are read per request with live filters. */
export const instant = false;

type AdminServicesPageProps = {
  searchParams: Promise<{ search?: string; status?: string; page?: string }>;
};

export default async function AdminServicesPage({
  searchParams,
}: AdminServicesPageProps) {
  await connection();
  await requireAdminPage("services:read", "/admin/services");

  const params = await searchParams;
  const page = Number.parseInt(params.page ?? "1", 10) || 1;

  let result: Awaited<ReturnType<typeof getAdminServiceRequests>> | null = null;

  try {
    result = await getAdminServiceRequests({
      search: params.search,
      status: params.status,
      page,
    });
  } catch (error) {
    console.error("[admin] services query failed", error);
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-extrabold text-primary sm:text-xl">
          درخواست‌های خدمات
        </h1>
        <p className="mt-1.5 text-caption leading-6 text-muted-foreground">
          درخواست‌های تعمیر، سرویس و نصب را بررسی، به تکنسین ارجاع و وضعیت آن‌ها
          را پیگیری کنید.
        </p>
      </div>

      <AdminFilterBar
        action="/admin/services"
        searchValue={params.search}
        searchPlaceholder="نام مشتری، موبایل، نوع خدمت یا شهر"
        resetHref="/admin/services"
      >
        <AdminSelectFilter
          name="status"
          label="وضعیت درخواست"
          value={params.status}
          options={serviceStatusOptions}
        />
      </AdminFilterBar>

      {!result ? (
        <div className="flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-caption leading-6 text-amber-800">
          <CircleExclamationPoint
            className="mt-0.5 h-4 w-4 shrink-0"
            aria-hidden="true"
          />
          دریافت درخواست‌ها در حال حاضر ممکن نیست. اتصال پایگاه داده را بررسی
          کنید.
        </div>
      ) : result.requests.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface px-5 py-12 text-center shadow-soft">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary">
            <Inbox className="h-6 w-6" aria-hidden="true" />
          </span>
          <p className="mt-4 text-caption font-bold text-primary">
            درخواستی با این فیلترها یافت نشد
          </p>
          <p className="mt-1.5 text-caption text-muted-foreground">
            فیلتر وضعیت را تغییر دهید یا عبارت جستجو را حذف کنید.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-3 lg:grid-cols-2">
            {result.requests.map((request) => (
              <article
                key={request.id}
                className="rounded-2xl border border-border bg-surface p-4 shadow-soft"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-caption font-bold text-primary">
                      {request.serviceType}
                    </p>
                    <p className="mt-1 text-caption text-muted-foreground">
                      {formatDate(request.createdAt)}
                      {request.city ? ` · ${request.city}` : ""}
                    </p>
                  </div>
                  <Badge variant={serviceStatusTones[request.status]}>
                    {serviceStatusLabels[request.status]}
                  </Badge>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {request.customerName}
                  </span>
                  <a
                    href={toTelHref(request.customerPhone)}
                    dir="ltr"
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    <Phone className="h-3 w-3" aria-hidden="true" />
                    {request.customerPhone}
                  </a>
                  {request.assignedTo ? (
                    <span>مسئول: {request.assignedTo}</span>
                  ) : (
                    <span className="text-amber-700">بدون تکنسین</span>
                  )}
                </div>

                {request.problemDescription ? (
                  <p className="mt-2 line-clamp-2 rounded-xl bg-surface-muted px-3 py-2 text-caption leading-5 text-muted-foreground">
                    {request.problemDescription}
                  </p>
                ) : null}

                <div className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-3">
                  <p className="text-caption text-muted-foreground">
                    کد پیگیری:{" "}
                    <span dir="ltr" className="font-semibold text-foreground">
                      {request.id.slice(0, 8)}
                    </span>
                  </p>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/services/${request.id}`}>
                      مدیریت درخواست
                      <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>

          <AdminPagination
            basePath="/admin/services"
            params={{ search: params.search, status: params.status }}
            page={result.page}
            pageCount={result.pageCount}
            total={result.total}
          />
        </>
      )}

      <p className="text-caption text-muted-foreground">
        مجموع درخواست‌های مطابق فیلتر: {result ? formatNumber(result.total) : "—"}
      </p>
    </div>
  );
}
