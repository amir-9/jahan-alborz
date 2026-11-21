"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  CircleCheck,
  CircleExclamationPoint,
  Eye,
  EyeOff,
  LoaderCircle,
  Plus,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveFaq, setFaqActive } from "@/lib/actions/admin-content";
import { adminFaqSchema } from "@/lib/validation/admin-content";

export type FaqFormInitial = {
  id?: string;
  question: string;
  answer: string;
  category: string;
  sortOrder: string;
  isActive: boolean;
};

const emptyValues: FaqFormInitial = {
  question: "",
  answer: "",
  category: "",
  sortOrder: "0",
  isActive: true,
};

type Result =
  | { ok: true; message: string }
  | { ok: false; message: string }
  | null;

export function FaqForm({ initial }: { initial?: FaqFormInitial }) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const [values, setValues] = useState<FaqFormInitial>(initial ?? emptyValues);
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string[] | undefined>
  >({});
  const [result, setResult] = useState<Result>(null);
  const [pending, startTransition] = useTransition();

  function update<K extends keyof FaqFormInitial>(
    field: K,
    value: FaqFormInitial[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
    setResult(null);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult(null);

    const parsed = adminFaqSchema.safeParse(values);

    if (!parsed.success) {
      setFieldErrors(parsed.error.flatten().fieldErrors);
      setResult({ ok: false, message: "لطفاً خطاهای فرم را بررسی کنید." });
      return;
    }

    startTransition(async () => {
      const response = await saveFaq({
        ...parsed.data,
        ...(isEdit && initial?.id ? { faqId: initial.id } : {}),
      });

      if (!response.ok) {
        setResult({ ok: false, message: response.message });

        if (response.fieldErrors) {
          setFieldErrors(response.fieldErrors);
        }
        return;
      }

      setResult({ ok: true, message: response.message });

      if (isEdit) {
        router.refresh();
      } else {
        setValues(emptyValues);
        router.refresh();
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-border bg-surface p-5 shadow-soft"
    >
      <h2 className="flex items-center gap-2 text-sm font-bold text-primary">
        <Plus className="h-4 w-4 text-secondary" aria-hidden="true" />
        {isEdit ? "ویرایش سوال متداول" : "افزودن سوال متداول"}
      </h2>

      <div className="mt-3 grid gap-3 lg:grid-cols-[1.5fr_1fr] lg:items-start">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="faq-question">سوال</Label>
            <Input
              id="faq-question"
              value={values.question}
              onChange={(event) => update("question", event.target.value)}
              maxLength={200}
              required
            />
            {fieldErrors.question ? (
              <p className="text-caption text-danger">{fieldErrors.question[0]}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="faq-answer">پاسخ</Label>
            <Textarea
              id="faq-answer"
              value={values.answer}
              onChange={(event) => update("answer", event.target.value)}
              rows={5}
              maxLength={2000}
              required
            />
            {fieldErrors.answer ? (
              <p className="text-caption text-danger">{fieldErrors.answer[0]}</p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="faq-category">دسته‌بندی (اختیاری)</Label>
            <Input
              id="faq-category"
              value={values.category}
              onChange={(event) => update("category", event.target.value)}
              maxLength={60}
              placeholder="مثلاً ارسال و تحویل"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="faq-sort">ترتیب نمایش</Label>
            <Input
              id="faq-sort"
              type="number"
              inputMode="numeric"
              min={0}
              max={999}
              dir="ltr"
              className="text-left"
              value={values.sortOrder}
              onChange={(event) => update("sortOrder", event.target.value)}
            />
            <p className="text-caption leading-5 text-muted-foreground">
              عدد کوچک‌تر بالاتر نمایش داده می‌شود.
            </p>
            {fieldErrors.sortOrder ? (
              <p className="text-caption text-danger">{fieldErrors.sortOrder[0]}</p>
            ) : null}
          </div>

          <label className="flex items-center gap-2 rounded-xl border border-border px-3 py-2.5 text-caption font-semibold text-foreground">
            <input
              type="checkbox"
              checked={values.isActive}
              onChange={(event) => update("isActive", event.target.checked)}
              className="h-4 w-4 rounded border-input accent-primary"
            />
            نمایش در صفحه سوالات متداول
          </label>
        </div>
      </div>

      {result ? (
        <p
          className={`mt-3 flex items-start gap-2 rounded-xl border px-3 py-2 text-caption leading-5 ${
            result.ok
              ? "border-teal-200 bg-teal-50 text-teal-800"
              : "border-red-200 bg-red-50 text-danger"
          }`}
          role={result.ok ? "status" : "alert"}
        >
          {result.ok ? (
            <CircleCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          ) : (
            <CircleExclamationPoint
              className="mt-0.5 h-3.5 w-3.5 shrink-0"
              aria-hidden="true"
            />
          )}
          {result.message}
        </p>
      ) : null}

      <Button
        type="submit"
        size="sm"
        className="mt-3"
        disabled={
          pending ||
          values.question.trim().length < 5 ||
          values.answer.trim().length < 10
        }
      >
        {pending ? (
          <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
        ) : (
          <Save className="h-3.5 w-3.5" aria-hidden="true" />
        )}
        {isEdit ? "ذخیره تغییرات" : "ایجاد سوال"}
      </Button>
    </form>
  );
}

export function FaqRowActions({
  faqId,
  isActive,
}: {
  faqId: string;
  isActive: boolean;
}) {
  const router = useRouter();
  const [result, setResult] = useState<Result>(null);
  const [pending, startTransition] = useTransition();

  function handleToggle() {
    setResult(null);

    startTransition(async () => {
      const response = await setFaqActive({ faqId, isActive: !isActive });
      setResult(response);

      if (response.ok) {
        router.refresh();
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={handleToggle}
        disabled={pending}
      >
        {pending ? (
          <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
        ) : isActive ? (
          <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
        ) : (
          <Eye className="h-3.5 w-3.5" aria-hidden="true" />
        )}
        {isActive ? "پنهان‌سازی" : "نمایش"}
      </Button>

      {result && !result.ok ? (
        <p className="max-w-[12rem] text-end text-caption leading-4 text-danger">
          {result.message}
        </p>
      ) : null}
    </div>
  );
}
