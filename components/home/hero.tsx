import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductVisual } from "@/components/shared/product-visual";
import { siteConfig } from "@/lib/config/site";
import type { Product } from "@/lib/data/catalog";
import { formatPrice, toTelHref } from "@/lib/utils/format";

const highlights = [
  { icon: Truck, label: "ارسال به سراسر ایران" },
  { icon: MapPin, label: "خدمات در قزوین" },
  { icon: ShieldCheck, label: "مشاوره فنی شفاف" },
];

type HeroProps = {
  featuredProduct?: Product | null;
};

export function Hero({ featuredProduct }: HeroProps) {
  const heroProduct =
    featuredProduct &&
    featuredProduct.purchasingMode === "FIXED" &&
    featuredProduct.inventory > 0
      ? featuredProduct
      : null;
  return (
    <section className="relative overflow-hidden bg-primary-900 text-primary-foreground">
      <div
        className="absolute inset-0 bg-grid-light opacity-70"
        aria-hidden="true"
      />
      <div
        className="absolute -start-32 -top-32 h-[26rem] w-[26rem] rounded-full bg-secondary/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -end-24 bottom-0 h-[22rem] w-[22rem] rounded-full bg-primary-500/40 blur-3xl"
        aria-hidden="true"
      />

      <div className="page-container relative grid items-center gap-12 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:py-24">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[11px] font-medium text-white/80 backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-secondary" />
            </span>
            فروشگاه تخصصی تجهیزات گرمایشی در قزوین
          </span>

          <h1 className="mt-6 max-w-xl text-[2rem] font-extrabold leading-[1.4] tracking-tight sm:text-4xl lg:text-[2.9rem] lg:leading-[1.35]">
            گرمای مطمئن خانه،
            <br className="hidden sm:block" /> با{" "}
            <span className="relative inline-block text-secondary">
              انتخابی درست
              <svg
                className="absolute -bottom-2 start-0 h-2 w-full text-secondary/60"
                viewBox="0 0 200 8"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M2 6c40-4 80-4 120-1s40 2 76-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-[13px] leading-8 text-white/70 sm:text-sm sm:leading-8">
            از پکیج و رادیاتور تا قطعات یدکی، نصب و سرویس دوره‌ای؛ جهان البرز
            در تمام مسیر گرمایش خانه در کنار شماست. پیش از خرید، نیاز فنی
            فضای‌تان را با ما بررسی کنید.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild variant="secondary" size="lg">
              <Link href="/shop">
                مشاهده فروشگاه
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/25 bg-white/5 text-white hover:border-white/40 hover:bg-white/10 hover:text-white"
            >
              <Link href="/services/request">درخواست خدمات</Link>
            </Button>
            <a
              href={toTelHref(siteConfig.contact.phone)}
              className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-white/75 transition-colors hover:text-secondary"
              dir="ltr"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              {siteConfig.contact.phone}
            </a>
          </div>

          <ul className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-[11px] text-white/70">
            {highlights.map((item) => (
              <li key={item.label} className="inline-flex items-center gap-2">
                <item.icon
                  className="h-4 w-4 text-secondary"
                  aria-hidden="true"
                />
                {item.label}
              </li>
            ))}
          </ul>
        </div>

        <div
          className="relative mx-auto w-full max-w-md animate-fade-up lg:max-w-none"
          style={{ animationDelay: "120ms" }}
        >
          <div className="relative rounded-3xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm sm:p-6">
            <div className="flex items-center justify-between px-1 pb-4">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-white/80">
                <Sparkles className="h-3.5 w-3.5 text-secondary" aria-hidden="true" />
                {heroProduct ? "پیشنهاد ویژه فروشگاه" : "فروشگاه تجهیزات گرمایشی"}
              </span>
              <span className="rounded-full bg-secondary/15 px-2.5 py-1 text-[10px] font-bold text-secondary">
                {heroProduct ? "قابل سفارش" : "مشاوره پیش از خرید"}
              </span>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
              <div className="flex items-center justify-center rounded-xl bg-gradient-to-b from-primary-50 to-surface p-3">
                <ProductVisual
                  variant={heroProduct?.visual ?? "boiler"}
                  className="max-h-52"
                />
              </div>

              <div className="mt-5">
                {heroProduct ? (
                  <>
                    <p className="text-[11px] text-muted-foreground">
                      {heroProduct.brand}
                    </p>
                    <h2 className="mt-1 text-base font-bold text-primary">
                      {heroProduct.name}
                    </h2>
                    <div className="mt-3 flex items-end justify-between gap-3">
                      <div>
                        {heroProduct.discountedPrice ? (
                          <p className="text-[11px] text-muted-foreground line-through">
                            {formatPrice(heroProduct.price)}
                          </p>
                        ) : null}
                        <p className="text-lg font-extrabold text-primary">
                          {formatPrice(
                            heroProduct.discountedPrice ?? heroProduct.price,
                          )}
                        </p>
                      </div>
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/products/${heroProduct.slug}`}>
                          جزئیات
                          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                        </Link>
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-[11px] text-muted-foreground">
                      انتخاب ظرفیت و مدل
                    </p>
                    <h2 className="mt-1 text-base font-bold text-primary">
                      پکیج و رادیاتور متناسب با فضای شما
                    </h2>
                    <p className="mt-2 text-[11.5px] leading-6 text-muted-foreground">
                      محصولات فروشگاه در حال به‌روزرسانی است. برای استعلام
                      موجودی و قیمت با ما تماس بگیرید.
                    </p>
                    <Button asChild size="sm" variant="outline" className="mt-3">
                      <Link href="/shop">
                        مشاهده فروشگاه
                        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3.5 py-2.5 text-[11px] text-white/75">
              <ShieldCheck className="h-4 w-4 shrink-0 text-secondary" aria-hidden="true" />
              قیمت و موجودی پیش از تأیید نهایی سفارش توسط فروشگاه بررسی می‌شود.
            </div>
          </div>

          <div className="absolute -start-4 top-24 hidden animate-fade-up items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2.5 text-[11px] font-semibold text-foreground shadow-lift sm:flex" style={{ animationDelay: "320ms" }}>
            <BadgeCheck className="h-4 w-4 text-teal-600" aria-hidden="true" />
            قطعات یدکی موجود
          </div>

          <div className="absolute -end-3 bottom-16 hidden animate-fade-up items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2.5 text-[11px] font-semibold text-foreground shadow-lift sm:flex" style={{ animationDelay: "440ms" }}>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary-50 text-secondary-600">
              <Phone className="h-3 w-3" aria-hidden="true" />
            </span>
            مشاوره تلفنی
          </div>
        </div>
      </div>
    </section>
  );
}
