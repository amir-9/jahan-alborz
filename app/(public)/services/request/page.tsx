import type { Metadata } from "next";
import Link from "next/link";
import {
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  CircleExclamationPoint,
} from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ServiceRequestForm } from "@/components/services/service-request-form";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config/site";
import { repairServices } from "@/lib/data/catalog";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { toTelHref } from "@/lib/utils/format";

export const metadata: Metadata = buildPageMetadata({
  title: "درخواست خدمات",
  description:
    "فرم ثبت درخواست تعمیر، سرویس دوره‌ای، نصب یا عیب‌یابی تجهیزات گرمایشی در قزوین.",
  path: "/services/request",
});

const nextSteps = [
  "درخواست شما در سامانه ثبت و برای بررسی به تیم خدمات ارجاع می‌شود.",
  "برای هماهنگی زمان بازدید و اعلام محدوده هزینه با شما تماس می‌گیریم.",
  "زمان نهایی مراجعه پس از تأیید تلفنی قطعی می‌شود.",
];

export default function ServiceRequestPage() {
  return (
    <div className="page-container pb-16 pt-6 sm:pt-8">
      <Breadcrumbs
        items={[
          { name: "خدمات", href: "/services" },
          { name: "درخواست خدمات" },
        ]}
      />

      <div className="mt-6 max-w-3xl">
        <h1 className="text-2xl font-extrabold text-primary sm:text-3xl">
          درخواست خدمات گرمایشی
        </h1>
        <p className="mt-3 text-[13px] leading-8 text-muted-foreground">
          فرم زیر را تکمیل کنید تا برای بررسی شرایط و هماهنگی زمان بازدید با
          شما تماس بگیریم. خدمات میدانی در شهر {siteConfig.business.serviceCoverageCity}{" "}
          ارائه می‌شود.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-start">
        <ServiceRequestForm services={repairServices} />

        <aside className="space-y-4 lg:sticky lg:top-28">
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
            <h2 className="text-sm font-bold text-primary">
              پس از ثبت چه می‌شود؟
            </h2>
            <ol className="mt-4 space-y-3">
              {nextSteps.map((step, index) => (
                <li key={step} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {new Intl.NumberFormat("fa-IR").format(index + 1)}
                  </span>
                  <p className="text-[11.5px] leading-6 text-muted-foreground">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
            <h2 className="text-sm font-bold text-primary">تماس مستقیم</h2>
            <div className="mt-3 space-y-3 text-[11.5px] text-muted-foreground">
              <a
                href={toTelHref(siteConfig.contact.phone)}
                className="flex items-center gap-2.5 transition-colors hover:text-primary"
                dir="ltr"
              >
                <Phone className="h-4 w-4 shrink-0 text-secondary" aria-hidden="true" />
                {siteConfig.contact.phone}
              </a>
              <p className="flex items-start gap-2.5">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-secondary" aria-hidden="true" />
                خدمات در {siteConfig.business.serviceCoverageCity}
              </p>
              <p className="flex items-start gap-2.5">
                <Clock className="mt-1 h-4 w-4 shrink-0 text-secondary" aria-hidden="true" />
                {siteConfig.business.workHours.days}
                <br />
                {siteConfig.business.workHours.hours}
              </p>
            </div>
            <Button asChild variant="outline" className="mt-4 w-full">
              <Link href="/services">مشاهده فهرست خدمات</Link>
            </Button>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <h2 className="flex items-center gap-2 text-[12px] font-bold text-amber-900">
              <CircleExclamationPoint className="h-4 w-4 shrink-0" aria-hidden="true" />
              هشدار ایمنی
            </h2>
            <p className="mt-2 text-[11px] leading-6 text-amber-900/80">
              در صورت بوی گاز، شیر اصلی گاز را ببندید، از روشن یا خاموش کردن
              کلیدهای برق خودداری کنید، پنجره‌ها را باز کنید و محل را ترک کنید.
              سپس از خارج ساختمان با امداد گاز یا آتش‌نشانی تماس بگیرید.
            </p>
            <p className="mt-2 flex items-center gap-1.5 text-[10.5px] font-semibold text-amber-900/80">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              این فرم جایگزین تماس اضطراری نیست.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
