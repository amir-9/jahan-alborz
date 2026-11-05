import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "تماس با ما",
  description: "تماس با فروشگاه جهان البرز، تلفن، واتساپ و آدرس فروشگاه.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            تماس با ما
          </h1>
          <p className="mt-3 text-sm leading-8 text-muted-foreground">
            برای اطلاع از قیمت، موجودی یا رزرو زمان تعمیر، با ما در تماس
            باشید.
          </p>

          <div className="mt-10 space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Phone className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  تلفن
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {siteConfig.contact.phone}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MessageCircle className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  واتساپ
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {siteConfig.contact.whatsapp}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Mail className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  ایمیل
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {siteConfig.contact.email}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MapPin className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  فروشگاه
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {siteConfig.address.fullAddress}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button asChild>
              <Link href="/services/request">ثبت درخواست خدمات</Link>
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold text-foreground">
            آدرس فروشگاه
          </h2>
          <p className="mt-3 text-sm leading-8 text-muted-foreground">
            {siteConfig.address.fullAddress}
          </p>
          <div className="mt-6 aspect-video w-full rounded-lg bg-primary/5" />
          <p className="mt-3 text-xs text-muted-foreground">
            نقشه این‌جانب در این مرحله اولیه طراحی سایت پیاده‌سازی نشده است.
          </p>
        </div>
      </div>
    </div>
  );
}
