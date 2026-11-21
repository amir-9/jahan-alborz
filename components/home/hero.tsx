import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config/site";
import type { Product } from "@/lib/data/catalog";
import { heroMedia } from "@/lib/media/catalog-media";
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

      <div className="page-container relative grid items-center gap-12 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:py-24">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-caption font-medium text-on-primary-muted backdrop-blur">
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

          <p className="mt-6 max-w-lg text-caption leading-8 text-on-primary-muted sm:text-sm sm:leading-8">
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
              className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-on-primary-muted transition-colors hover:text-secondary"
              dir="ltr"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              {siteConfig.contact.phone}
            </a>
          </div>

          <ul className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-caption text-on-primary-muted">
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
          <div className="relative h-[28rem] overflow-hidden rounded-3xl border border-white/10 shadow-lift sm:h-[32rem]">
            <Image
              src={heroMedia.src}
              alt={heroMedia.alt}
              fill
              preload
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="object-cover"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/40 to-primary-900/5"
              aria-hidden="true"
            />

            <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-primary-900/50 px-3 py-1.5 text-caption font-semibold text-on-primary-muted backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-secondary" aria-hidden="true" />
                {heroProduct ? "پیشنهاد ویژه فروشگاه" : "فروشگاه تجهیزات گرمایشی"}
              </span>
              <span className="shrink-0 rounded-full bg-secondary px-2.5 py-1.5 text-caption font-bold text-secondary-foreground">
                {heroProduct ? "قابل سفارش" : "مشاوره پیش از خرید"}
              </span>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
              {heroProduct ? (
                <>
                  <p className="text-caption font-semibold text-on-primary-muted">
                    {heroProduct.brand}
                  </p>
                  <h2 className="mt-1 text-title-sm font-bold text-white">
                    {heroProduct.name}
                  </h2>
                  <div className="mt-3 flex items-end justify-between gap-3">
                    <div>
                      {heroProduct.discountedPrice ? (
                        <p className="text-caption text-on-primary-muted line-through" dir="ltr">
                          {formatPrice(heroProduct.price)}
                        </p>
                      ) : null}
                      <p className="text-xl font-extrabold text-white" dir="ltr">
                        {formatPrice(
                          heroProduct.discountedPrice ?? heroProduct.price,
                        )}
                      </p>
                    </div>
                    <Button asChild size="sm" variant="secondary">
                      <Link href={`/products/${heroProduct.slug}`}>
                        جزئیات
                        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-caption font-semibold text-on-primary-muted">
                    انتخاب ظرفیت و مدل
                  </p>
                  <h2 className="mt-1 text-title-sm font-bold text-white">
                    پکیج و رادیاتور متناسب با فضای شما
                  </h2>
                  <p className="mt-2 text-caption leading-6 text-on-primary-muted">
                    محصولات فروشگاه در حال بهروزرسانی است. برای استعلام موجودی
                    و قیمت با ما تماس بگیرید.
                  </p>
                  <Button asChild size="sm" variant="secondary" className="mt-3">
                    <Link href="/shop">
                      مشاهده فروشگاه
                      <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </Button>
                </>
              )}

              <p className="mt-4 flex items-start gap-2 border-t border-white/15 pt-3 text-caption leading-6 text-on-primary-muted">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-secondary" aria-hidden="true" />
                تصویر نمونه است. قیمت و موجودی پیش از تأیید نهایی سفارش توسط
                فروشگاه بررسی میشود.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
