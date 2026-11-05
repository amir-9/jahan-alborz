"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { repairServices } from "@/lib/data/catalog";

type ServiceRequestFormProps = {
  services: typeof repairServices;
};

export function ServiceRequestForm({ services }: ServiceRequestFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [serviceType, setServiceType] = useState("");

  return (
    <div className="rounded-xl border border-border bg-surface p-6 sm:p-8">
      {submitted ? (
        <div className="text-center">
          <CheckCircle2
            className="mx-auto h-12 w-12 text-secondary"
            aria-hidden="true"
          />
          <h2 className="mt-4 text-xl font-bold text-foreground">
            درخواست شما ثبت شد
          </h2>
          <p className="mt-3 text-sm leading-8 text-muted-foreground">
            تیم ما به‌زودی با شما برای همکاری در تعمیر/نگهداری تماس خواهد
            گرفت.
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="mt-6 text-sm font-medium text-primary hover:underline"
          >
            ثبت درخواست جدید
          </button>
        </div>
      ) : (
        <form
          className="grid gap-6"
          onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(true);
          }}
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="service-full-name"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                نام کامل *
              </label>
              <input
                id="service-full-name"
                name="fullName"
                required
                className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="service-mobile"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                شماره موبایل *
              </label>
              <input
                id="service-mobile"
                name="mobile"
                type="tel"
                required
                dir="ltr"
                className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="service-type"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              نوع خدمت *
            </label>
            <select
              id="service-type"
              name="serviceType"
              required
              value={serviceType}
              onChange={(event) => setServiceType(event.target.value)}
              className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">انتخاب کنید</option>
              {services.map((service) => (
                <option key={service.slug} value={service.name}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="service-city"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                شهر و آدرس
              </label>
              <input
                id="service-city"
                name="city"
                className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="service-brand"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                برند پکیج یا رادیاتور (اختیاری)
              </label>
              <input
                id="service-brand"
                name="brand"
                className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="service-problem"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              توضیح مشکل *
            </label>
            <textarea
              id="service-problem"
              name="problem"
              required
              rows={4}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="service-preferred-date"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              تاریخ اولویت برای بازدید
            </label>
            <input
              id="service-preferred-date"
              name="preferredVisitDate"
              type="date"
              className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="service-notes"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              توضیحات تکمیلی
            </label>
            <textarea
              id="service-notes"
              name="notes"
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              ارسال درخواست
            </button>
            <a
              href={`tel:${"۹۱۰"}`}
              className="inline-flex h-12 items-center justify-center rounded-md border border-primary/30 px-6 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
            >
              تماس با ما
            </a>
          </div>
        </form>
      )}
    </div>
  );
}
