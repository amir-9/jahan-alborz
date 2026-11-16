import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { CircleExclamationPoint, MessageCircleQuestion } from "lucide-react";
import { FaqForm, FaqRowActions } from "@/components/admin/faq-forms";
import { Badge } from "@/components/ui/badge";
import { getAdminFaqs } from "@/lib/data/admin-repository";
import { requireAdminPage } from "@/lib/auth/session";
import { formatNumber } from "@/lib/utils/format";

export const metadata: Metadata = {
  title: "سوالات متداول",
};

/** FAQ content is read from the database per request. */
export const instant = false;

export default async function AdminFaqPage() {
  await connection();
  await requireAdminPage("content:write", "/admin/faq");

  let faqs: Awaited<ReturnType<typeof getAdminFaqs>> | null = null;

  try {
    faqs = await getAdminFaqs();
  } catch (error) {
    console.error("[admin] faq query failed", error);
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-extrabold text-primary sm:text-xl">
          سوالات متداول
        </h1>
        <p className="mt-1.5 text-[11.5px] leading-6 text-muted-foreground">
          سوالات فعال در صفحه عمومی سوالات متداول و داده ساختاریافته FAQ نمایش
          داده می‌شوند. پاسخ‌ها باید دقیق و بدون وعده تضمین باشند.
        </p>
      </div>

      <FaqForm />

      {!faqs ? (
        <div className="flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-[11.5px] leading-6 text-amber-800">
          <CircleExclamationPoint
            className="mt-0.5 h-4 w-4 shrink-0"
            aria-hidden="true"
          />
          دریافت سوالات در حال حاضر ممکن نیست. اتصال پایگاه داده را بررسی کنید.
        </div>
      ) : faqs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface px-5 py-12 text-center shadow-soft">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary">
            <MessageCircleQuestion className="h-6 w-6" aria-hidden="true" />
          </span>
          <p className="mt-4 text-[12.5px] font-bold text-primary">
            هنوز سوالی ثبت نشده است
          </p>
          <p className="mt-1.5 text-[11px] text-muted-foreground">
            با فرم بالا نخستین سوال متداول را ایجاد کنید.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {faqs.map((faq) => (
            <article
              key={faq.id}
              className="rounded-2xl border border-border bg-surface p-4 shadow-soft"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Link
                      href={`/admin/faq/${faq.id}`}
                      className="text-[12px] font-bold text-primary hover:underline"
                    >
                      {faq.question}
                    </Link>
                    <Badge variant={faq.isActive ? "success" : "outline"}>
                      {faq.isActive ? "فعال" : "پنهان"}
                    </Badge>
                    <Badge variant="secondary">ترتیب {formatNumber(faq.sortOrder)}</Badge>
                    {faq.category ? (
                      <Badge variant="outline">{faq.category}</Badge>
                    ) : null}
                  </div>
                  <p className="mt-1.5 text-[11px] leading-6 text-muted-foreground">
                    {faq.answer}
                  </p>
                </div>

                <FaqRowActions faqId={faq.id} isActive={faq.isActive} />
              </div>
            </article>
          ))}

          <p className="text-[10.5px] text-muted-foreground">
            مجموع {formatNumber(faqs.length)} سوال ثبت شده است.
          </p>
        </div>
      )}
    </div>
  );
}
