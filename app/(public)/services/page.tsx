import type { Metadata } from "next";
import Link from "next/link";
import { Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { repairServices } from "@/lib/data/catalog";

export const metadata: Metadata = {
  title: "خدمات",
  description:
    "خدمات تعمیر، نگهداری، نصب و رسوب‌زدایی تجهیزات گرمایشی در قزوین.",
};

export default function ServicesPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            خدمات گرمایشی
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-8 text-muted-foreground">
            تعمیر، سرویس دوره‌ای، نصب و رسوب‌زدایی تجهیزات گرمایشی با پوشش
            خدمات در شهر قزوین.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {repairServices.map((service) => (
            <div
              key={service.slug}
              className="rounded-xl border border-border bg-surface p-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Wrench className="h-6 w-6" aria-hidden="true" />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-foreground">
                {service.name}
              </h2>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                {service.description}
              </p>
              <Button variant="outline" className="mt-6" asChild>
                <Link href="/services/request">ثبت درخواست</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
