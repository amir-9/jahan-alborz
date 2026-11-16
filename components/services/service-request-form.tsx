"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  CircleCheck,
  CircleExclamationPoint,
  LoaderCircle,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { siteConfig } from "@/lib/config/site";
import type { RepairService } from "@/lib/data/catalog";
import {
  submitServiceRequest,
  type ServiceRequestResult,
} from "@/lib/actions/service-request";
import {
  serviceRequestSchema,
  type ServiceRequestValues,
} from "@/lib/validation/service-request";
import { cn } from "@/lib/utils/cn";
import { toTelHref } from "@/lib/utils/format";

type ServiceRequestFormProps = {
  services: RepairService[];
};

type FieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
};

function Field({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
  className,
}: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={htmlFor}>
        {label}
        {required ? (
          <span className="ms-1 text-danger" aria-hidden="true">
            *
          </span>
        ) : null}
      </Label>
      {children}
      {hint ? (
        <p className="text-[10.5px] leading-5 text-muted-foreground">{hint}</p>
      ) : null}
      {error ? (
        <p className="text-[10.5px] font-medium text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ServiceRequestForm({ services }: ServiceRequestFormProps) {
  const [result, setResult] = useState<ServiceRequestResult | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ServiceRequestValues>({
    resolver: zodResolver(serviceRequestSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      serviceType: "",
      city: siteConfig.business.serviceCoverageCity,
      address: "",
      brand: "",
      problemDescription: "",
      preferredVisitDate: "",
    },
  });

  async function onSubmit(values: ServiceRequestValues) {
    setResult(null);
    const response = await submitServiceRequest(values);
    setResult(response);

    if (response.ok) {
      reset();
    }
  }

  if (result?.ok) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6 text-center shadow-soft sm:p-10">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-success">
          <CircleCheck className="h-7 w-7" aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-lg font-extrabold text-primary">
          درخواست شما ثبت شد
        </h2>
        <p className="mx-auto mt-2 max-w-md text-[12.5px] leading-7 text-muted-foreground">
          {result.message}
        </p>
        <p className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-primary-50 px-3 py-1.5 text-[11px] font-semibold text-primary">
          کد پیگیری: <span dir="ltr">{result.requestId.slice(0, 8)}</span>
        </p>
        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          <Button variant="outline" onClick={() => setResult(null)}>
            ثبت درخواست دیگر
          </Button>
          <Button asChild variant="ghost">
            <a href={toTelHref(siteConfig.contact.phone)} dir="ltr">
              {siteConfig.contact.phone}
            </a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="rounded-2xl border border-border bg-surface p-5 shadow-soft sm:p-7"
    >
      {result && !result.ok ? (
        <div
          className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[11.5px] leading-6 text-danger"
          role="alert"
        >
          <CircleExclamationPoint
            className="mt-0.5 h-4 w-4 shrink-0"
            aria-hidden="true"
          />
          <div>
            <p>{result.message}</p>
            <a
              href={toTelHref(siteConfig.contact.phone)}
              className="mt-1 inline-block font-bold underline underline-offset-4"
              dir="ltr"
            >
              {siteConfig.contact.phone}
            </a>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="نام و نام خانوادگی"
          htmlFor="customerName"
          required
          error={errors.customerName?.message}
        >
          <Input
            id="customerName"
            autoComplete="name"
            placeholder="مثلاً علی رضایی"
            aria-invalid={Boolean(errors.customerName)}
            {...register("customerName")}
          />
        </Field>

        <Field
          label="شماره موبایل"
          htmlFor="customerPhone"
          required
          error={errors.customerPhone?.message}
          hint="برای هماهنگی زمان بازدید با این شماره تماس می‌گیریم."
        >
          <Input
            id="customerPhone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="۰۹xxxxxxxxx"
            dir="ltr"
            aria-invalid={Boolean(errors.customerPhone)}
            {...register("customerPhone")}
          />
        </Field>

        <Field
          label="نوع خدمت"
          htmlFor="serviceType"
          required
          error={errors.serviceType?.message}
        >
          <Select
            id="serviceType"
            aria-invalid={Boolean(errors.serviceType)}
            {...register("serviceType")}
          >
            <option value="">انتخاب کنید…</option>
            {services.map((service) => (
              <option key={service.slug} value={service.name}>
                {service.name}
              </option>
            ))}
            <option value="سایر موارد">سایر موارد</option>
          </Select>
        </Field>

        <Field
          label="شهر"
          htmlFor="city"
          required
          error={errors.city?.message}
          hint={`خدمات میدانی در ${siteConfig.business.serviceCoverageCity} ارائه می‌شود.`}
        >
          <Input
            id="city"
            autoComplete="address-level2"
            aria-invalid={Boolean(errors.city)}
            {...register("city")}
          />
        </Field>

        <Field
          label="آدرس"
          htmlFor="address"
          error={errors.address?.message}
          className="sm:col-span-2"
          hint="آدرس دقیق برای مراجعه تکنسین؛ در صورت نیاز به هماهنگی تلفنی تکمیل کنید."
        >
          <Input
            id="address"
            autoComplete="street-address"
            placeholder="محله، خیابان، پلاک"
            aria-invalid={Boolean(errors.address)}
            {...register("address")}
          />
        </Field>

        <Field
          label="برند و مدل دستگاه"
          htmlFor="brand"
          error={errors.brand?.message}
          hint="در صورت اطلاع، مدل پکیج یا رادیاتور را بنویسید."
        >
          <Input
            id="brand"
            placeholder="مثلاً بوتان، مدل …"
            aria-invalid={Boolean(errors.brand)}
            {...register("brand")}
          />
        </Field>

        <Field
          label="تاریخ پیشنهادی بازدید"
          htmlFor="preferredVisitDate"
          error={errors.preferredVisitDate?.message}
          hint="اختیاری؛ زمان دقیق پس از تماس هماهنگ می‌شود."
        >
          <Input
            id="preferredVisitDate"
            type="date"
            dir="ltr"
            aria-invalid={Boolean(errors.preferredVisitDate)}
            {...register("preferredVisitDate")}
          />
        </Field>

        <Field
          label="توضیح مشکل"
          htmlFor="problemDescription"
          error={errors.problemDescription?.message}
          className="sm:col-span-2"
          hint="علائم، زمان شروع مشکل و اقداماتی که انجام داده‌اید را بنویسید."
        >
          <Textarea
            id="problemDescription"
            rows={5}
            placeholder="مثلاً آب گرم کافی نیست، فشار پکیج پایین آمده یا صدای غیرعادی شنیده می‌شود…"
            aria-invalid={Boolean(errors.problemDescription)}
            {...register("problemDescription")}
          />
        </Field>
      </div>

      <div className="mt-5 rounded-xl bg-surface-muted px-4 py-3 text-[10.5px] leading-5 text-muted-foreground">
        با ثبت این فرم، درخواست شما برای هماهنگی در سامانه ثبت می‌شود. این فرم
        تأیید قطعی زمان مراجعه نیست و زمان نهایی تلفنی اعلام می‌شود.
      </div>

      <Button
        type="submit"
        size="lg"
        variant="secondary"
        className="mt-4 w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
            در حال ارسال…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" aria-hidden="true" />
            ثبت درخواست خدمات
          </>
        )}
      </Button>
    </form>
  );
}
