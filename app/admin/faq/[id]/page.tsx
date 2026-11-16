import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ArrowRight, CircleExclamationPoint } from "lucide-react";
import { FaqForm } from "@/components/admin/faq-forms";
import { Button } from "@/components/ui/button";
import { getAdminFaq } from "@/lib/data/admin-repository";
import { requireAdminPage } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "ویرایش سوال متداول",
};

/** FAQ content is read from the database per request. */
export const instant = false;

type AdminEditFaqPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditFaqPage({
  params,
}: AdminEditFaqPageProps) {
  await connection();
  await requireAdminPage("content:write", "/admin/faq");

  const { id } = await params;

  let faq: Awaited<ReturnType<typeof getAdminFaq>> = null;
  let failed = false;

  try {
    faq = await getAdminFaq(id);
  } catch (error) {
    console.error("[admin] edit faq query failed", error);
    failed = true;
  }

  if (!failed && !faq) {
    notFound();
  }

  if (failed || !faq) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-[11.5px] leading-6 text-amber-800">
        <p className="flex items-center gap-2 font-bold">
          <CircleExclamationPoint className="h-4 w-4" aria-hidden="true" />
          دریافت اطلاعات سوال در حال حاضر ممکن نیست.
        </p>
        <Button asChild variant="outline" size="sm" className="mt-3">
          <Link href="/admin/faq">بازگشت به سوالات متداول</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Link
          href="/admin/faq"
          className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-muted-foreground hover:text-primary"
        >
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          همه سوالات متداول
        </Link>
        <h1 className="mt-1 text-lg font-extrabold text-primary sm:text-xl">
          ویرایش سوال متداول
        </h1>
      </div>

      <FaqForm
        initial={{
          id: faq.id,
          question: faq.question,
          answer: faq.answer,
          category: faq.category ?? "",
          sortOrder: String(faq.sortOrder),
          isActive: faq.isActive,
        }}
      />
    </div>
  );
}
