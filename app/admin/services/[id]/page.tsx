import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import {
  ArrowRight,
  CircleExclamationPoint,
  MapPin,
  Phone,
  UserRound,
  Wrench,
} from "lucide-react";
import {
  ServiceNoteForm,
  ServiceStatusForm,
} from "@/components/admin/service-forms";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAdminServiceRequest } from "@/lib/data/admin-repository";
import { requireAdminPage } from "@/lib/auth/session";
import {
  serviceStatusLabels,
  serviceStatusTones,
} from "@/lib/constants/status";
import { formatDate, toTelHref } from "@/lib/utils/format";

export const metadata: Metadata = {
  title: "جزئیات درخواست خدمت",
};

/** Service detail always reflects the latest notes and assignment. */
export const instant = false;

type AdminServiceDetailProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminServiceDetailPage({
  params,
}: AdminServiceDetailProps) {
  await connection();
  await requireAdminPage("services:read", "/admin/services");

  const { id } = await params;

  let request: Awaited<ReturnType<typeof getAdminServiceRequest>> = null;
  let failed = false;

  try {
    request = await getAdminServiceRequest(id);
  } catch (error) {
    console.error("[admin] service detail query failed", error);
    failed = true;
  }

  if (!failed && !request) {
    notFound();
  }

  if (failed || !request) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-caption leading-6 text-amber-800">
        <p className="flex items-center gap-2 font-bold">
          <CircleExclamationPoint className="h-4 w-4" aria-hidden="true" />
          دریافت جزئیات درخواست در حال حاضر ممکن نیست.
        </p>
        <Button asChild variant="outline" size="sm" className="mt-3">
          <Link href="/admin/services">بازگشت به درخواست‌ها</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link
            href="/admin/services"
            className="inline-flex items-center gap-1 text-caption font-semibold text-muted-foreground hover:text-primary"
          >
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            همه درخواست‌ها
          </Link>
          <h1 className="mt-1 text-lg font-extrabold text-primary sm:text-xl">
            {request.serviceType}
          </h1>
          <p className="mt-1 text-caption text-muted-foreground">
            ثبت‌شده در {formatDate(request.createdAt)} · کد پیگیری{" "}
            <span dir="ltr">{request.id.slice(0, 8)}</span>
          </p>
        </div>
        <Badge variant={serviceStatusTones[request.status]}>
          {serviceStatusLabels[request.status]}
        </Badge>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr] xl:items-start">
        <div className="flex flex-col gap-4">
          <section className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
            <h2 className="flex items-center gap-2 text-sm font-bold text-primary">
              <UserRound className="h-4 w-4 text-secondary" aria-hidden="true" />
              مشخصات مشتری
            </h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border px-3.5 py-3 text-caption leading-6">
                <p className="font-bold text-foreground">
                  {request.customerName}
                </p>
                <a
                  href={toTelHref(request.customerPhone)}
                  dir="ltr"
                  className="mt-1 flex items-center gap-1.5 text-start text-primary hover:underline"
                >
                  <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                  {request.customerPhone}
                </a>
                <p className="mt-1 text-caption text-muted-foreground">
                  {request.customer
                    ? `حساب کاربری: ${request.customer.name ?? "بدون نام"}`
                    : "درخواست بدون حساب کاربری"}
                </p>
              </div>

              <div className="rounded-xl border border-border px-3.5 py-3 text-caption leading-6">
                <p className="flex items-center gap-1.5 font-bold text-foreground">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  {request.city ?? "شهر ثبت نشده"}
                </p>
                <p className="mt-1 text-caption leading-6 text-muted-foreground">
                  {request.address ?? "آدرسی ثبت نشده است."}
                </p>
                {request.brand ? (
                  <p className="mt-1 text-caption text-muted-foreground">
                    برند تجهیز: {request.brand}
                  </p>
                ) : null}
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
            <h2 className="flex items-center gap-2 text-sm font-bold text-primary">
              <Wrench className="h-4 w-4 text-secondary" aria-hidden="true" />
              شرح درخواست
            </h2>
            <p className="mt-3 whitespace-pre-line break-words rounded-xl bg-surface-muted px-3.5 py-3 text-caption leading-7 text-muted-foreground [overflow-wrap:anywhere]">
              {request.problemDescription?.trim() ||
                "مشتری توضیح تکمیلی ثبت نکرده است."}
            </p>
            {request.preferredVisitDate ? (
              <p className="mt-2 text-caption text-muted-foreground">
                زمان پیشنهادی مراجعه:{" "}
                {formatDate(request.preferredVisitDate)}
              </p>
            ) : null}
            {request.notes ? (
              <p className="mt-2 break-words text-caption leading-6 text-muted-foreground [overflow-wrap:anywhere]">
                یادداشت ثبت‌شده هنگام درخواست: {request.notes}
              </p>
            ) : null}
          </section>

          <section className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
            <h2 className="text-sm font-bold text-primary">
              یادداشت‌های داخلی
            </h2>
            {request.serviceNotes.length === 0 ? (
              <p className="mt-3 rounded-xl border border-dashed border-border px-3.5 py-5 text-center text-caption text-muted-foreground">
                هنوز یادداشتی ثبت نشده است.
              </p>
            ) : (
              <ol className="mt-3 flex flex-col gap-2">
                {request.serviceNotes.map((note) => (
                  <li
                    key={note.id}
                    className="rounded-xl border border-border px-3.5 py-2.5"
                  >
                    <p className="break-words text-caption leading-6 text-foreground [overflow-wrap:anywhere]">
                      {note.note}
                    </p>
                    <p className="mt-1 text-caption text-muted-foreground">
                      {note.author ?? "سیستم"} · {formatDate(note.createdAt)}
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>

        <div className="flex flex-col gap-4 xl:sticky xl:top-24">
          <ServiceStatusForm
            requestId={request.id}
            currentStatus={request.status}
            currentAssignee={request.assignedTo ?? ""}
          />
          <ServiceNoteForm requestId={request.id} />
        </div>
      </div>
    </div>
  );
}
