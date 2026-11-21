import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarCheck,
  Check,
  ClipboardList,
  MapPin,
  Phone,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { ServiceCard } from "@/components/services/service-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config/site";
import { repairServices } from "@/lib/data/catalog";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { toTelHref } from "@/lib/utils/format";

export const metadata: Metadata = buildPageMetadata({
  title: "خدمات",
  description:
    "خدمات تعمیر پکیج، سرویس دوره‌ای، نصب رادیاتور، رسوب‌زدایی و عیب‌یابی تجهیزات گرمایشی در قزوین.",
  path: "/services",
});

const visitSteps = [
  {
    icon: ClipboardList,
    title: "ثبت درخواست",
    description:
      "نوع خدمت، محدوده و توضیح مشکل را در فرم بنویسید یا تلفنی هماهنگ کنید.",
  },
  {
    icon: CalendarCheck,
    title: "هماهنگی زمان",
    description:
      "برای بررسی شرایط و تعیین زمان مراجعه با شما تماس می‌گیریم.",
  },
  {
    icon: Wrench,
    title: "بازدید و اجرا",
    description:
      "تکنسین پس از بررسی، عیب و گزینه‌های تعمیر را توضیح می‌دهد و کار را انجام می‌دهد.",
  },
  {
    icon: ShieldCheck,
    title: "بررسی نهایی",
    description:
      "عملکرد دستگاه پس از کار بررسی و نکات نگهداری به شما توضیح داده می‌شود.",
  },
];

export default function ServicesPage() {
  return (
    <div className="page-container pb-16 pt-6 sm:pt-8">
      <Breadcrumbs items={[{ name: "خدمات" }]} />

      <div className="mt-6 overflow-hidden rounded-3xl border border-border bg-primary-900 text-primary-foreground shadow-soft">
        <div className="relative grid gap-8 bg-grid-light p-6 sm:p-9 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <Badge variant="secondary">پوشش خدمات: {siteConfig.business.serviceCoverageCity}</Badge>
            <h1 className="mt-4 text-2xl font-extrabold leading-[1.5] sm:text-3xl">
              تعمیر، سرویس و نصب تجهیزات گرمایشی
            </h1>
            <p className="mt-4 max-w-xl text-caption leading-8 text-on-primary-muted">
              از عیب‌یابی و تعویض قطعه تا سرویس دوره‌ای و نصب استاندارد؛ خدمات
              میدانی با هماهنگی قبلی در شهر قزوین انجام می‌شود. پیش از مراجعه،
              محدوده هزینه و زمان تقریبی اعلام می‌شود.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="secondary">
                <Link href="/services/request" >
                  ثبت درخواست خدمات
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white/25 bg-transparent text-white hover:border-white/40 hover:bg-white/10 hover:text-white"
              >
                <a href={toTelHref(siteConfig.contact.phone)} dir="ltr">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {siteConfig.contact.phone}
                </a>
              </Button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {[
              { icon: MapPin, label: "خدمات میدانی در قزوین" },
              { icon: CalendarCheck, label: "زمان‌بندی با هماهنگی قبلی" },
              { icon: ShieldCheck, label: "توضیح شفاف عیب و هزینه" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-caption text-on-primary-muted backdrop-blur-sm"
              >
                <item.icon className="h-4 w-4 shrink-0 text-secondary" aria-hidden="true" />
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="mt-14" aria-labelledby="services-list">
        <Reveal>
          <SectionHeading
            eyebrow="فهرست خدمات"
            title="خدماتی که ارائه می‌دهیم"
            description="نوع خدمت مورد نیاز خود را انتخاب کنید. اگر مطمئن نیستید، با توضیح مشکل، درخواست بازدید ثبت کنید."
          />
        </Reveal>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {repairServices.map((service, index) => (
            <Reveal key={service.slug} delay={index * 0.05}>
              <ServiceCard service={service} className="h-full" />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-3xl border border-border bg-surface p-6 shadow-soft sm:p-9">
        <Reveal>
          <SectionHeading
            eyebrow="فرایند مراجعه"
            title="از درخواست تا بررسی نهایی"
            description="مراحل کار را ساده و قابل پیگیری نگه داشته‌ایم تا بدانید در هر مرحله چه اتفاقی می‌افتد."
          />
        </Reveal>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {visitSteps.map((step, index) => (
            <div key={step.title} className="relative rounded-2xl border border-border bg-surface-muted p-5">
              <span className="absolute end-4 top-4 text-2xl font-extrabold text-primary/10">
                {new Intl.NumberFormat("fa-IR").format(index + 1)}
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-secondary">
                <step.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-caption font-bold text-primary">
                {step.title}
              </h3>
              <p className="mt-2 text-caption leading-6 text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14 grid gap-6 lg:grid-cols-2" aria-label="نکات مهم خدمات">
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
          <h2 className="flex items-center gap-2 text-base font-bold text-primary">
            <ShieldCheck className="h-5 w-5 text-secondary" aria-hidden="true" />
            نکات مهم پیش از مراجعه
          </h2>
          <ul className="mt-4 space-y-3">
            {[
              "پیش از مراجعه، مدل دستگاه و علائم مشکل را آماده کنید.",
              "در صورت نشتی گاز، شیر اصلی را ببندید و از خارج ساختمان با امداد گاز تماس بگیرید.",
              "هزینه بازدید و قطعات پیش از انجام کار به‌صورت شفاف اعلام می‌شود.",
              "هرگونه دخالت در مسیر گاز و محفظه احتراق باید توسط تکنسین مجاز انجام شود.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-caption leading-7 text-muted-foreground">
                <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-secondary-50 text-secondary-700">
                  <Check className="h-2.5 w-2.5" aria-hidden="true" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-border bg-primary-900 p-6 text-primary-foreground shadow-soft">
          <div>
            <h2 className="text-base font-bold">نوع خدمت را پیدا نکردید؟</h2>
            <p className="mt-2 text-caption leading-7 text-on-primary-muted">
              مشکل دستگاه یا نیاز نصب خود را توضیح دهید؛ پس از بررسی اولیه،
              نزدیک‌ترین خدمت مناسب را پیشنهاد می‌دهیم. برای سوالات فنی هم
              می‌توانید تلفنی تماس بگیرید.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-2.5">
            <Button asChild variant="secondary">
              <Link href="/services/request">ثبت درخواست</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white/25 bg-transparent text-white hover:border-white/40 hover:bg-white/10 hover:text-white"
            >
              <a href={toTelHref(siteConfig.contact.phone)} dir="ltr">
                <Phone className="h-4 w-4" aria-hidden="true" />
                تلفن فروشگاه
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
