import type { Metadata } from "next";
import Link from "next/link";
import { CircleExclamationPoint, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCustomerServiceRequests } from "@/lib/data/account-repository";
import { requireUserPage } from "@/lib/auth/session";
import {
  serviceStatusLabels,
  serviceStatusTones,
} from "@/lib/constants/status";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { formatDate } from "@/lib/utils/format";

export const metadata: Metadata = buildPageMetadata({
  title: "درخواست‌های خدمات من",
  description: "پیگیری درخواست‌های تعمیر و سرویس مشتریان جهان البرز.",
  path: "/account/services",
  noIndex: true,
});

/** Service request history is read from the database per request. */
export const instant = false;

export default async function AccountServicesPage() {
  const user = await requireUserPage("/account/services");

  let requests: Awaited<ReturnType<typeof getCustomerServiceRequests>> = [];
  let failed = false;

  try {
    requests = await getCustomerServiceRequests(user.id);
  } catch (error) {
    console.error("[account] service requests query failed", error);
    failed = true;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-base font-extrabold text-primary">
            درخواست‌های خدمات
          </h2>
          <p className="mt-1 text-caption leading-6 text-muted-foreground">
            وضعیت درخواست‌های تعمیر، سرویس و نصب خود را پیگیری کنید. زمان مراجعه
            پس از تأیید تلفنی قطعی می‌شود.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/services/request">درخواست جدید</Link>
        </Button>
      </div>

      {failed ? (
        <div className="flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-caption leading-6 text-amber-800">
          <CircleExclamationPoint
            className="mt-0.5 h-4 w-4 shrink-0"
            aria-hidden="true"
          />
          دریافت درخواست‌ها در حال حاضر ممکن نیست. لطفاً کمی بعد دوباره تلاش
          کنید.
        </div>
      ) : null}

      {!failed && requests.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface px-5 py-12 text-center shadow-soft">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary">
            <Wrench className="h-6 w-6" aria-hidden="true" />
          </span>
          <p className="mt-4 text-caption font-bold text-primary">
            هنوز درخواست خدماتی ثبت نشده است
          </p>
          <p className="mx-auto mt-1.5 max-w-sm text-caption leading-6 text-muted-foreground">
            برای تعمیر، سرویس دوره‌ای یا نصب تجهیزات گرمایشی، فرم درخواست خدمات
            را تکمیل کنید.
          </p>
          <Button asChild className="mt-5">
            <Link href="/services/request">ثبت درخواست</Link>
          </Button>
        </div>
      ) : null}

      <div className="flex flex-col gap-3">
        {requests.map((request) => (
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
                  ثبت در {formatDate(request.createdAt)}
                  {request.city ? ` · ${request.city}` : ""}
                </p>
              </div>
              <Badge variant={serviceStatusTones[request.status]}>
                {serviceStatusLabels[request.status]}
              </Badge>
            </div>

            {request.problemDescription ? (
              <p className="mt-2 line-clamp-3 rounded-xl bg-surface-muted px-3 py-2 text-caption leading-6 text-muted-foreground">
                {request.problemDescription}
              </p>
            ) : null}

            <p className="mt-2 text-caption text-muted-foreground">
              کد پیگیری:{" "}
              <span dir="ltr" className="font-semibold text-foreground">
                {request.id.slice(0, 8)}
              </span>
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
