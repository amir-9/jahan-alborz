"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  CircleCheck,
  CircleExclamationPoint,
  LoaderCircle,
  UserPlus,
} from "lucide-react";
import { FormField } from "@/components/auth/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerCustomer } from "@/lib/actions/auth";
import { registerSchema } from "@/lib/validation/auth";

type RegisterFormProps = {
  callbackUrl: string;
};

const initialValues = {
  name: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

export function RegisterForm({ callbackUrl }: RegisterFormProps) {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string[] | undefined>
  >({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, setPending] = useState(false);

  function update(field: keyof typeof initialValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
    setError(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const parsed = registerSchema.safeParse(values);

    if (!parsed.success) {
      setFieldErrors(parsed.error.flatten().fieldErrors);
      return;
    }

    setPending(true);

    try {
      const result = await registerCustomer(parsed.data);

      if (!result.ok) {
        setError(result.message);
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }
        return;
      }

      const signInResult = await signIn("customer-password", {
        identifier: parsed.data.phone,
        password: parsed.data.password,
        redirect: false,
        callbackUrl,
      });

      setSuccess(true);

      if (signInResult && !signInResult.error) {
        router.push(callbackUrl);
        router.refresh();
      } else {
        router.push(
          `/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`,
        );
      }
    } catch {
      setError("ثبت‌نام انجام نشد. اتصال اینترنت را بررسی و دوباره تلاش کنید.");
    } finally {
      setPending(false);
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-md rounded-3xl border border-border bg-surface p-7 text-center shadow-soft">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-success">
          <CircleCheck className="h-7 w-7" aria-hidden="true" />
        </span>
        <h1 className="mt-4 text-lg font-extrabold text-primary">
          حساب شما ساخته شد
        </h1>
        <p className="mt-2 text-[12px] leading-7 text-muted-foreground">
          در حال انتقال به حساب کاربری هستید. اگر انتقال انجام نشد، از صفحه ورود
          وارد شوید.
        </p>
        <Button asChild className="mt-5">
          <Link href={`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}>
            رفتن به صفحه ورود
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-3xl border border-border bg-surface p-6 shadow-soft sm:p-8">
      <div className="text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary">
          <UserPlus className="h-6 w-6" aria-hidden="true" />
        </span>
        <h1 className="mt-4 text-xl font-extrabold text-primary">
          ساخت حساب کاربری
        </h1>
        <p className="mt-2 text-[12px] leading-6 text-muted-foreground">
          با شماره موبایل ثبت‌نام کنید تا سفارش‌ها و درخواست‌های خدمات خود را
          پیگیری کنید.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-4">
        {error ? (
          <div
            className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-[11px] leading-6 text-danger"
            role="alert"
          >
            <CircleExclamationPoint
              className="mt-0.5 h-4 w-4 shrink-0"
              aria-hidden="true"
            />
            <span>{error}</span>
          </div>
        ) : null}

        <FormField
          label="نام و نام خانوادگی"
          htmlFor="register-name"
          required
          error={fieldErrors.name?.[0]}
        >
          <Input
            id="register-name"
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
            required
          />
        </FormField>

        <FormField
          label="شماره موبایل"
          htmlFor="register-phone"
          required
          error={fieldErrors.phone?.[0]}
          hint="این شماره برای ورود و پیگیری سفارش استفاده می‌شود."
        >
          <Input
            id="register-phone"
            name="phone"
            type="tel"
            dir="ltr"
            inputMode="tel"
            autoComplete="tel"
            className="text-left"
            placeholder="09123456789"
            value={values.phone}
            onChange={(event) => update("phone", event.target.value)}
            required
          />
        </FormField>

        <FormField
          label="رمز عبور"
          htmlFor="register-password"
          required
          error={fieldErrors.password?.[0]}
          hint="حداقل ۸ کاراکتر شامل حرف و رقم."
        >
          <Input
            id="register-password"
            name="password"
            type="password"
            dir="ltr"
            autoComplete="new-password"
            className="text-left"
            value={values.password}
            onChange={(event) => update("password", event.target.value)}
            required
          />
        </FormField>

        <FormField
          label="تکرار رمز عبور"
          htmlFor="register-confirm-password"
          required
          error={fieldErrors.confirmPassword?.[0]}
        >
          <Input
            id="register-confirm-password"
            name="confirmPassword"
            type="password"
            dir="ltr"
            autoComplete="new-password"
            className="text-left"
            value={values.confirmPassword}
            onChange={(event) => update("confirmPassword", event.target.value)}
            required
          />
        </FormField>

        <Button type="submit" size="lg" disabled={pending} className="mt-1 w-full">
          {pending ? (
            <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <UserPlus className="h-4 w-4" aria-hidden="true" />
          )}
          ثبت‌نام
        </Button>
      </form>

      <p className="mt-5 text-center text-[11.5px] text-muted-foreground">
        قبلاً ثبت‌نام کرده‌اید؟{" "}
        <Link
          href={`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
          className="font-semibold text-primary hover:underline"
        >
          ورود
        </Link>
      </p>
    </div>
  );
}
