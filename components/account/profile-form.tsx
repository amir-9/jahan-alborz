"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CircleCheck, CircleExclamationPoint, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile } from "@/lib/actions/auth";

type ProfileFormProps = {
  initialName: string;
  initialEmail: string;
  phone: string;
};

export function ProfileForm({
  initialName,
  initialEmail,
  phone,
}: ProfileFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await updateProfile({ name, email });

      if (!result.ok) {
        setError(result.fieldErrors?.name?.[0] ?? result.fieldErrors?.email?.[0] ?? result.message);
        return;
      }

      setSuccess(result.message);
      router.refresh();
    } catch {
      setError("ذخیره اطلاعات انجام نشد. لطفاً دوباره تلاش کنید.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-border bg-surface p-5 shadow-soft sm:p-6"
    >
      <h2 className="text-sm font-bold text-primary">اطلاعات شخصی</h2>
      <p className="mt-1 text-caption leading-6 text-muted-foreground">
        نام شما در سفارش‌ها و پیگیری خدمات استفاده می‌شود. شماره موبایل حساب
        قابل ویرایش نیست.
      </p>

      {error ? (
        <div
          className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-caption leading-6 text-danger"
          role="alert"
        >
          <CircleExclamationPoint
            className="mt-0.5 h-4 w-4 shrink-0"
            aria-hidden="true"
          />
          <span>{error}</span>
        </div>
      ) : null}

      {success ? (
        <div
          className="mt-4 flex items-start gap-2 rounded-xl border border-teal-200 bg-teal-50 px-3.5 py-2.5 text-caption leading-6 text-teal-800"
          role="status"
        >
          <CircleCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{success}</span>
        </div>
      ) : null}

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="profile-name">
            نام و نام خانوادگی
            <span className="ms-1 text-danger" aria-hidden="true">
              *
            </span>
          </Label>
          <Input
            id="profile-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="profile-phone">شماره موبایل</Label>
          <Input
            id="profile-phone"
            value={phone}
            dir="ltr"
            className="text-left"
            readOnly
            disabled
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="profile-email">ایمیل (اختیاری)</Label>
          <Input
            id="profile-email"
            type="email"
            value={email}
            dir="ltr"
            className="text-left"
            autoComplete="email"
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
      </div>

      <Button type="submit" className="mt-5" disabled={pending}>
        {pending ? (
          <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : null}
        ذخیره تغییرات
      </Button>
    </form>
  );
}
