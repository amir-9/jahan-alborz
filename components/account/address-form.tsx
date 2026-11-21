"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CircleCheck, CircleExclamationPoint, LoaderCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createAddress } from "@/lib/actions/addresses";
import { addressSchema } from "@/lib/validation/address";

const initialValues = {
  label: "",
  recipient: "",
  phone: "",
  province: "قزوین",
  city: "قزوین",
  street: "",
  postalCode: "",
};

export function AddressForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [isDefault, setIsDefault] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function update(field: keyof typeof initialValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setError(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const parsed = addressSchema.safeParse({ ...values, isDefault });

    if (!parsed.success) {
      setErrors(parsed.error.flatten().fieldErrors);
      return;
    }

    setPending(true);

    try {
      const result = await createAddress(parsed.data);

      if (!result.ok) {
        setError(result.message);
        if (result.fieldErrors) {
          setErrors(result.fieldErrors);
        }
        return;
      }

      setValues(initialValues);
      setIsDefault(false);
      setSuccess(result.message);
      setOpen(false);
      router.refresh();
    } catch {
      setError("ذخیره آدرس انجام نشد. لطفاً دوباره تلاش کنید.");
    } finally {
      setPending(false);
    }
  }

  if (!open) {
    return (
      <div>
        {success ? (
          <p className="mb-3 flex items-center gap-1.5 rounded-xl border border-teal-200 bg-teal-50 px-3.5 py-2.5 text-caption text-teal-800">
            <CircleCheck className="h-4 w-4" aria-hidden="true" />
            {success}
          </p>
        ) : null}
        <Button type="button" size="sm" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          افزودن آدرس جدید
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-border bg-surface p-5 shadow-soft sm:p-6"
    >
      <h2 className="text-sm font-bold text-primary">آدرس جدید</h2>

      {error ? (
        <div
          className="mt-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-caption leading-6 text-danger"
          role="alert"
        >
          <CircleExclamationPoint
            className="mt-0.5 h-4 w-4 shrink-0"
            aria-hidden="true"
          />
          <span>{error}</span>
        </div>
      ) : null}

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="عنوان آدرس (اختیاری)" htmlFor="address-label">
          <Input
            id="address-label"
            value={values.label}
            placeholder="خانه، محل کار"
            onChange={(event) => update("label", event.target.value)}
          />
        </Field>

        <Field
          label="نام تحویل‌گیرنده"
          htmlFor="address-recipient"
          required
          error={errors.recipient?.[0]}
        >
          <Input
            id="address-recipient"
            value={values.recipient}
            autoComplete="name"
            onChange={(event) => update("recipient", event.target.value)}
            required
          />
        </Field>

        <Field
          label="شماره موبایل"
          htmlFor="address-phone"
          required
          error={errors.phone?.[0]}
        >
          <Input
            id="address-phone"
            type="tel"
            dir="ltr"
            inputMode="tel"
            className="text-left"
            placeholder="09123456789"
            value={values.phone}
            onChange={(event) => update("phone", event.target.value)}
            required
          />
        </Field>

        <Field
          label="کد پستی (اختیاری)"
          htmlFor="address-postal-code"
          error={errors.postalCode?.[0]}
        >
          <Input
            id="address-postal-code"
            dir="ltr"
            inputMode="numeric"
            maxLength={10}
            className="text-left"
            value={values.postalCode}
            onChange={(event) => update("postalCode", event.target.value)}
          />
        </Field>

        <Field
          label="استان"
          htmlFor="address-province"
          required
          error={errors.province?.[0]}
        >
          <Input
            id="address-province"
            value={values.province}
            onChange={(event) => update("province", event.target.value)}
            required
          />
        </Field>

        <Field
          label="شهر"
          htmlFor="address-city"
          required
          error={errors.city?.[0]}
        >
          <Input
            id="address-city"
            value={values.city}
            onChange={(event) => update("city", event.target.value)}
            required
          />
        </Field>

        <Field
          label="نشانی کامل"
          htmlFor="address-street"
          required
          error={errors.street?.[0]}
          className="sm:col-span-2"
        >
          <Input
            id="address-street"
            value={values.street}
            autoComplete="street-address"
            onChange={(event) => update("street", event.target.value)}
            required
          />
        </Field>
      </div>

      <label className="mt-4 flex items-center gap-2 text-caption text-muted-foreground">
        <input
          type="checkbox"
          checked={isDefault}
          onChange={(event) => setIsDefault(event.target.checked)}
          className="h-4 w-4 rounded border-border text-primary accent-[var(--primary)]"
        />
        این آدرس پیش‌فرض باشد
      </label>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? (
            <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : null}
          ذخیره آدرس
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setOpen(false)}
        >
          انصراف
        </Button>
      </div>
    </form>
  );
}

type FieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
};

function Field({
  label,
  htmlFor,
  error,
  required,
  className,
  children,
}: FieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className ?? ""}`}>
      <Label htmlFor={htmlFor}>
        {label}
        {required ? (
          <span className="ms-1 text-danger" aria-hidden="true">
            *
          </span>
        ) : null}
      </Label>
      {children}
      {error ? (
        <p className="text-caption font-medium text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
