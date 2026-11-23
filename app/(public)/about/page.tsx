import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Headset,
  MapPin,
  PackageCheck,
  ShieldCheck,
  Truck,
  Wrench,
} from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ProductVisual } from "@/components/shared/product-visual";
import { SectionHeading } from "@/components/shared/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config/site";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { toTelHref } from "@/lib/utils/format";

export const metadata: Metadata = buildPageMetadata({
  title: "درباره ما",
  description:
    "درباره جهان البرز؛ فروشگاه تخصصی تجهیزات گرمایشی در قزوین با خدمات فروش، نصب، سرویس و تأمین قطعات.",
  path: "/about",
});

const values = [
  {
    icon: Headset,
    title: "مشاوره به‌جای فروش سریع",
    description:
      "پیش از پیشنهاد محصول، نیاز فنی و محدودیت‌های محل را بررسی می‌کنیم تا انتخاب متناسب‌تری انجام شود.",
  },
  {
    icon: ShieldCheck,
    title: "شفافیت در شرایط",
    description:
      "قیمت، موجودی، زمان ارسال و محدوده هزینه خدمات پیش از نهایی‌سازی اعلام می‌شود.",
  },
  {
    icon: PackageCheck,
    title: "تأمین قطعات و لوازم",
    description:
      "قطعات مصرفی و یدکی پکیج و رادیاتور با هماهنگی مدل و موجودی تأمین می‌شود.",
  },
  {
    icon: Wrench,
    title: "همراهی پس از خرید",
    description:
      "برای سوالات فنی، سرویس دوره‌ای و پیگیری وضعیت سفارش در دسترس هستیم.",
  },
];

export default function AboutPage() {
  return (
    <div className="page-shell page-container pb-16 pt-6 sm:pt-8">
      <Breadcrumbs items={[{ name: "درباره ما" }]} />

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <Badge variant="secondary">درباره جهان البرز</Badge>
          <h1 className="animate-rise mt-4 text-2xl font-extrabold leading-[1.5] tracking-tight text-primary sm:text-3xl">
            تجهیزات گرمایشی، با نگاهی فنی و همراهی واقعی
          </h1>
          <p className="mt-4 text-caption leading-8 text-muted-foreground">
            جهان البرز یک فروشگاه تخصصی تجهیزات گرمایشی در قزوین است؛ با تمرکز
            بر فروش پکیج، رادیاتور، قطعات یدکی و لوازم نصب، همراه با خدمات
            تعمیر، سرویس دوره‌ای و نصب.
          </p>
          <p className="mt-3 text-caption leading-8 text-muted-foreground">
            هدف ما ساده است: انتخاب درست، توضیح شفاف و پیگیری پس از فروش. خرید
            تجهیزات گرمایشی فقط یک تراکنش نیست؛ نحوه نصب و نگهداری در عملکرد
            بلندمدت سیستم اثر مستقیم دارد.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/shop">مشاهده فروشگاه</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/services">خدمات ما</Link>
            </Button>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-border bg-surface p-6 shadow-soft">
          <div className="absolute inset-0 bg-grid opacity-40" aria-hidden="true" />
          <div className="relative grid grid-cols-2 gap-3">
            <div className="flex h-32 items-center justify-center rounded-2xl bg-primary-50 p-3">
              <ProductVisual variant="boiler" />
            </div>
            <div className="flex h-32 items-center justify-center rounded-2xl bg-secondary-50 p-3">
              <ProductVisual variant="radiator" />
            </div>
            <div className="flex h-32 items-center justify-center rounded-2xl bg-secondary-50 p-3">
              <ProductVisual variant="parts" />
            </div>
            <div className="flex h-32 items-center justify-center rounded-2xl bg-primary-50 p-3">
              <ProductVisual variant="installation" />
            </div>
          </div>
          <div className="relative mt-4 flex items-center gap-2 rounded-xl border border-border bg-surface/90 px-3.5 py-2.5 text-caption text-muted-foreground backdrop-blur">
            <MapPin className="h-4 w-4 shrink-0 text-secondary" aria-hidden="true" />
            {siteConfig.address.fullAddress}
          </div>
        </div>
      </div>

      <section className="mt-14" aria-labelledby="about-values">
        <SectionHeading
          eyebrow="اصول کاری"
          title="چه چیزی برای ما اهمیت دارد"
          description="این اصول، چارچوب تصمیم‌گیری ما در فروش و ارائه خدمات است."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <div
              key={value.title}
              className="rounded-2xl border border-border bg-surface p-5 shadow-soft"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary">
                <value.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-caption font-bold text-primary">
                {value.title}
              </h3>
              <p className="mt-2 text-caption leading-6 text-muted-foreground">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14 overflow-hidden rounded-3xl border border-border bg-primary-900 text-primary-foreground shadow-soft">
        <div className="relative grid gap-8 bg-grid-light p-6 sm:p-9 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-xl font-extrabold leading-[1.6] sm:text-2xl">
              محدوده فعالیت
            </h2>
            <p className="mt-3 max-w-md text-caption leading-7 text-on-primary-muted">
              فروش محصولات به سراسر ایران انجام می‌شود. خدمات تعمیر، سرویس و
              نصب به‌صورت میدانی در شهر {siteConfig.business.serviceCoverageCity}{" "}
              ارائه می‌شود. برای شهرهای دیگر، امکان هماهنگی تأمین قطعات و
              مشاوره فنی وجود دارد.
            </p>

            <ul className="mt-5 space-y-2.5">
              {[
                "فروش و ارسال محصولات به سراسر ایران",
                `خدمات تعمیر و نصب در ${siteConfig.business.serviceCoverageCity}`,
                "مشاوره فنی پیش از خرید و پس از نصب",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-caption text-on-primary-muted"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary/20 text-secondary">
                    <Check className="h-3 w-3" aria-hidden="true" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
              <Truck className="h-6 w-6 text-secondary" aria-hidden="true" />
              <p className="mt-3 text-caption font-bold">ارسال کشوری</p>
              <p className="mt-1.5 text-caption leading-6 text-on-primary-muted">
                روش و هزینه ارسال بر اساس مقصد و ابعاد محموله هماهنگ می‌شود.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
              <Wrench className="h-6 w-6 text-secondary" aria-hidden="true" />
              <p className="mt-3 text-caption font-bold">خدمات میدانی</p>
              <p className="mt-1.5 text-caption leading-6 text-on-primary-muted">
                بازدید، نصب و سرویس با زمان‌بندی هماهنگ‌شده در قزوین.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl border border-border bg-surface p-6 shadow-soft sm:flex-row sm:items-center">
        <div>
          <h2 className="text-sm font-bold text-primary">
            برای هماهنگی یا سوال فنی تماس بگیرید
          </h2>
          <p className="mt-1.5 text-caption leading-6 text-muted-foreground">
            پیش از مراجعه حضوری، تماس بگیرید تا زمان دقیق و موجودی هماهنگ شود.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <a href={toTelHref(siteConfig.contact.phone)} dir="ltr">
              {siteConfig.contact.phone}
            </a>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">
              تماس با ما
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
