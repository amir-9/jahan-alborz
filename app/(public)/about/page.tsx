import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "درباره ما",
  description: "درباره فروشگاه جهان البرز و خدمات گرمایشی.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
          درباره جهان البرز
        </h1>
        <p className="mt-4 text-sm leading-8 text-muted-foreground">
          جهان البرز یک فروشگاه تخصصی تجهیزات گرمایشی است که در قزوین فعالیت
          می‌کند؛ با تمرکز بر فروش پکیج، رادیاتور، قطعات یدکی و خدمات
          تعمیر و نگهداری.
        </p>
        <p className="mt-4 text-sm leading-8 text-muted-foreground">
          تیم ما ترکیبی از تجربه فنی و توجه به جزئیات است: از انتخاب صحیح
          محصول تا اجرای ایمن نصب و سرویس‌های دوره‌ای.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-6">
          <Wrench className="h-8 w-8 text-secondary" aria-hidden="true" />
          <h2 className="mt-4 text-lg font-semibold text-foreground">
            تعمیر و نگهداری
          </h2>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            خدمات فنی در قزوین با استفاده از ابزارهای تخصصی و قطعات یدکی.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-6">
          <ShieldCheck className="h-8 w-8 text-secondary" aria-hidden="true" />
          <h2 className="mt-4 text-lg font-semibold text-foreground">
            اطمینان از کیفیت
          </h2>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            انتخاب محصول باکیفیت و گارانتی اصالت کالا.
          </p>
        </div>
      </div>

      <div className="mt-12 flex flex-col gap-4 sm:flex-row">
        <Button asChild>
          <Link href="/services/request">ثبت درخواست خدمات</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/contact">تماس با ما</Link>
        </Button>
      </div>
    </div>
  );
}
