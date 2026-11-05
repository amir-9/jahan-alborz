import type { Metadata } from "next";
import { ServiceRequestForm } from "@/components/services/service-request-form";
import { repairServices } from "@/lib/data/catalog";

export const metadata: Metadata = {
  title: "خدمات",
  description:
    "ثبت درخواست خدمات تعمیر، نگهداری، نصب و رسوب‌زدایی تجهیزات گرمایشی.",
};

export default function ServiceRequestPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
          درخواست خدمات تعمیر
        </h1>
        <p className="mt-3 text-sm leading-8 text-muted-foreground">
          با پر کردن فرم زیر، درخواست سرویس یا تعمیر خود را ثبت کنید. پوشش
          خدمات در شهر قزوین است.
        </p>
        <div className="mt-10">
          <ServiceRequestForm services={repairServices} />
        </div>
      </div>
    </div>
  );
}
