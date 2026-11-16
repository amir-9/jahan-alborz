import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Wrench,
} from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/lib/config/site";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { toTelHref, toWhatsAppHref } from "@/lib/utils/format";

export const metadata: Metadata = buildPageMetadata({
  title: "تماس با ما",
  description:
    "راه‌های تماس با فروشگاه جهان البرز در قزوین؛ تلفن، واتساپ، ایمیل و آدرس فروشگاه.",
  path: "/contact",
});

export default function ContactPage() {
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${siteConfig.address.street}, ${siteConfig.address.city}, ${siteConfig.address.country}`,
  )}`;

  const contactItems = [
    {
      icon: Phone,
      title: "تلفن فروشگاه",
      value: siteConfig.contact.phone,
      href: toTelHref(siteConfig.contact.phone),
      description: "برای استعلام موجودی، قیمت و هماهنگی خدمات",
    },
    {
      icon: MessageCircle,
      title: "واتساپ",
      value: siteConfig.contact.whatsapp,
      href: toWhatsAppHref(
        siteConfig.contact.whatsapp,
        "سلام، برای مشاوره خرید یا خدمات گرمایشی پیام می‌دهم.",
      ),
      description: "ارسال پیام و تصویر دستگاه برای بررسی اولیه",
      external: true,
    },
    {
      icon: Mail,
      title: "ایمیل",
      value: siteConfig.contact.email,
      href: `mailto:${siteConfig.contact.email}`,
      description: "برای مکاتبات و درخواست‌های غیرفوری",
    },
  ];

  return (
    <div className="page-container pb-16 pt-6 sm:pt-8">
      <Breadcrumbs items={[{ name: "تماس با ما" }]} />

      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <Badge variant="secondary">در دسترس شما</Badge>
          <h1 className="mt-3 text-2xl font-extrabold text-primary sm:text-3xl">
            تماس با جهان البرز
          </h1>
          <p className="mt-3 text-[13px] leading-8 text-muted-foreground">
            برای اطلاع از قیمت، موجودی، شرایط ارسال یا رزرو زمان خدمات، با ما
            در تماس باشید. پیش از مراجعه حضوری، هماهنگی تلفنی توصیه می‌شود.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Button asChild variant="secondary">
            <a href={toTelHref(siteConfig.contact.phone)} dir="ltr">
              <Phone className="h-4 w-4" aria-hidden="true" />
              تماس تلفنی
            </a>
          </Button>
          <Button asChild variant="outline">
            <Link href="/services/request">ثبت درخواست خدمات</Link>
          </Button>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-3">
          {contactItems.map((item) => (
            <a
              key={item.title}
              href={item.href}
              {...(item.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="flex items-start gap-4 rounded-2xl border border-border bg-surface p-5 shadow-soft transition-colors hover:border-primary/25"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary">
                <item.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] text-muted-foreground">{item.title}</p>
                <p
                  className="mt-0.5 truncate text-[13px] font-bold text-foreground"
                  dir="ltr"
                >
                  {item.value}
                </p>
                <p className="mt-1 text-[10.5px] text-muted-foreground">
                  {item.description}
                </p>
              </div>
              <ArrowLeft
                className="ms-auto mt-1 h-4 w-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
            </a>
          ))}

          <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary">
                <Clock className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-[11px] text-muted-foreground">ساعت کاری</p>
                <p className="mt-0.5 text-[13px] font-bold text-foreground">
                  {siteConfig.business.workHours.days}
                </p>
                <p className="mt-1 text-[10.5px] text-muted-foreground">
                  {siteConfig.business.workHours.hours} —{" "}
                  {siteConfig.business.workHours.friday}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary">
                <Wrench className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-[11px] text-muted-foreground">
                  محدوده خدمات
                </p>
                <p className="mt-0.5 text-[13px] font-bold text-foreground">
                  خدمات میدانی در {siteConfig.business.serviceCoverageCity}
                </p>
                <p className="mt-1 text-[10.5px] leading-5 text-muted-foreground">
                  فروش محصولات به {siteConfig.business.productCoverage} انجام
                  می‌شود.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative min-h-[24rem] overflow-hidden rounded-3xl border border-border bg-primary-50 shadow-soft">
          <div className="absolute inset-0 bg-grid opacity-80" aria-hidden="true" />
          <div
            className="absolute inset-0 bg-gradient-to-t from-primary-900/10 to-transparent"
            aria-hidden="true"
          />

          <div className="absolute start-6 top-6 rounded-xl border border-border bg-surface/95 px-3.5 py-2 text-[11px] font-semibold text-primary shadow-soft backdrop-blur">
            {siteConfig.address.city}، {siteConfig.address.street}
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <span
                className="absolute -inset-6 animate-ping rounded-full bg-secondary/15"
                aria-hidden="true"
              />
              <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary text-secondary shadow-lift">
                <MapPin className="h-7 w-7" aria-hidden="true" />
              </span>
            </div>
          </div>

          <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-border bg-surface p-4 shadow-soft">
            <p className="text-[11px] font-bold text-foreground">
              {siteConfig.address.fullAddress}
            </p>
            <p className="mt-1.5 text-[10.5px] leading-5 text-muted-foreground">
              موقعیت دقیق روی نقشه در این نسخه ثبت نشده است. برای مسیریابی از
              لینک زیر استفاده کنید یا پیش از مراجعه تماس بگیرید.
            </p>
            <a
              href={mapHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-bold text-primary transition-colors hover:text-secondary-600"
            >
              مسیریابی در نقشه
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-surface p-6 shadow-soft">
        <h2 className="text-sm font-bold text-primary">
          درخواست خدمات یا بازدید فنی
        </h2>
        <p className="mt-1.5 max-w-2xl text-[11.5px] leading-6 text-muted-foreground">
          برای ثبت جزئیات مشکل، نوع دستگاه و زمان پیشنهادی بازدید، از فرم درخواست
          خدمات استفاده کنید. این فرم برای هماهنگی اولیه است و زمان نهایی تلفنی
          تأیید می‌شود.
        </p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/services/request">
            فرم درخواست خدمات
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
