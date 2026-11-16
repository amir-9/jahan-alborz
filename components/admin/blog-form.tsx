"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CircleCheck,
  CircleExclamationPoint,
  Eye,
  EyeOff,
  LoaderCircle,
  Plus,
  Save,
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveBlogPost, setBlogPublished } from "@/lib/actions/admin-content";
import { adminBlogPostSchema } from "@/lib/validation/admin-content";

export type BlogSectionInput = {
  heading: string;
  paragraphs: string;
};

export type BlogFormInitial = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  author: string;
  sections: BlogSectionInput[];
  isPublished: boolean;
};

const emptySection: BlogSectionInput = { heading: "", paragraphs: "" };

const emptyValues: BlogFormInitial = {
  slug: "",
  title: "",
  excerpt: "",
  category: "",
  readTime: "4",
  author: "",
  sections: [emptySection],
  isPublished: false,
};

type Result =
  | { ok: true; message: string }
  | { ok: false; message: string }
  | null;

function toPayload(values: BlogFormInitial) {
  return {
    slug: values.slug,
    title: values.title,
    excerpt: values.excerpt,
    category: values.category,
    readTime: values.readTime,
    author: values.author,
    isPublished: values.isPublished,
    sections: values.sections.map((section) => ({
      heading: section.heading,
      paragraphs: section.paragraphs
        .split("\n")
        .map((paragraph) => paragraph.trim())
        .filter(Boolean),
    })),
  };
}

export function BlogForm({ initial }: { initial?: BlogFormInitial }) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const [values, setValues] = useState<BlogFormInitial>(initial ?? emptyValues);
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string[] | undefined>
  >({});
  const [result, setResult] = useState<Result>(null);
  const [pending, startTransition] = useTransition();

  function update<K extends keyof BlogFormInitial>(
    field: K,
    value: BlogFormInitial[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
    setResult(null);
  }

  function updateSection(
    index: number,
    field: keyof BlogSectionInput,
    value: string,
  ) {
    setValues((current) => ({
      ...current,
      sections: current.sections.map((section, sectionIndex) =>
        sectionIndex === index ? { ...section, [field]: value } : section,
      ),
    }));
    setResult(null);
  }

  function addSection() {
    setValues((current) => ({
      ...current,
      sections: [...current.sections, { ...emptySection }],
    }));
  }

  function removeSection(index: number) {
    setValues((current) => ({
      ...current,
      sections: current.sections.filter(
        (_, sectionIndex) => sectionIndex !== index,
      ),
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult(null);

    const payload = toPayload(values);
    const parsed = adminBlogPostSchema.safeParse(payload);

    if (!parsed.success) {
      setFieldErrors(parsed.error.flatten().fieldErrors);
      setResult({
        ok: false,
        message: "لطفاً خطاهای فرم مطلب را بررسی کنید.",
      });
      return;
    }

    startTransition(async () => {
      const response = await saveBlogPost({
        ...parsed.data,
        ...(isEdit && initial?.id ? { postId: initial.id } : {}),
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
      } else if (response.id) {
        router.push(`/admin/blog/${response.id}`);
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-4"
    >
      {!isEdit ? (
        <Link
          href="/admin/blog"
          className="inline-flex w-fit items-center gap-1 text-[10.5px] font-semibold text-muted-foreground hover:text-primary"
        >
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          همه مطالب
        </Link>
      ) : null}

      {result ? (
        <p
          className={`flex items-start gap-2 rounded-2xl px-4 py-3 text-[11px] leading-6 ${
            result.ok
              ? "border border-teal-200 bg-teal-50 text-teal-800"
              : "border border-red-200 bg-red-50 text-danger"
          }`}
          role={result.ok ? "status" : "alert"}
        >
          {result.ok ? (
            <CircleCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          ) : (
            <CircleExclamationPoint
              className="mt-0.5 h-4 w-4 shrink-0"
              aria-hidden="true"
            />
          )}
          {result.message}
        </p>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr] xl:items-start">
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 shadow-soft">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="post-title">عنوان مطلب</Label>
            <Input
              id="post-title"
              value={values.title}
              onChange={(event) => update("title", event.target.value)}
              maxLength={160}
              required
            />
            {fieldErrors.title ? (
              <p className="text-[10px] text-danger">{fieldErrors.title[0]}</p>
            ) : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="post-slug">نامک (آدرس صفحه)</Label>
              <Input
                id="post-slug"
                dir="ltr"
                className="text-left"
                value={values.slug}
                onChange={(event) => update("slug", event.target.value)}
                placeholder="boiler-maintenance"
                maxLength={100}
                required
              />
              {fieldErrors.slug ? (
                <p className="text-[10px] text-danger">{fieldErrors.slug[0]}</p>
              ) : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="post-category">دسته‌بندی (اختیاری)</Label>
              <Input
                id="post-category"
                value={values.category}
                onChange={(event) => update("category", event.target.value)}
                maxLength={60}
                placeholder="نگهداری و تعمیر"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="post-excerpt">خلاصه مطلب</Label>
            <Textarea
              id="post-excerpt"
              value={values.excerpt}
              onChange={(event) => update("excerpt", event.target.value)}
              rows={3}
              maxLength={400}
              required
            />
            {fieldErrors.excerpt ? (
              <p className="text-[10px] text-danger">{fieldErrors.excerpt[0]}</p>
            ) : null}
          </div>

          <div className="rounded-xl border border-dashed border-border bg-surface-muted/60 p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] font-bold text-primary">بخش‌های مطلب</p>
              <Button type="button" size="sm" variant="outline" onClick={addSection}>
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                بخش جدید
              </Button>
            </div>

            <div className="mt-3 flex flex-col gap-3">
              {values.sections.map((section, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-border bg-surface p-3"
                >
                  <div className="flex items-end gap-2">
                    <div className="flex flex-1 flex-col gap-1.5">
                      <Label htmlFor={`section-heading-${index}`}>
                        عنوان بخش {index + 1}
                      </Label>
                      <Input
                        id={`section-heading-${index}`}
                        value={section.heading}
                        onChange={(event) =>
                          updateSection(index, "heading", event.target.value)
                        }
                        maxLength={150}
                      />
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => removeSection(index)}
                      disabled={values.sections.length === 1}
                      aria-label={`حذف بخش ${index + 1}`}
                    >
                      <Trash className="h-3.5 w-3.5" aria-hidden="true" />
                    </Button>
                  </div>

                  <div className="mt-2 flex flex-col gap-1.5">
                    <Label htmlFor={`section-paragraphs-${index}`}>
                      پاراگراف‌ها (هر پاراگراف در یک خط)
                    </Label>
                    <Textarea
                      id={`section-paragraphs-${index}`}
                      value={section.paragraphs}
                      onChange={(event) =>
                        updateSection(index, "paragraphs", event.target.value)
                      }
                      rows={5}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5 shadow-soft">
            <p className="text-[11px] font-bold text-primary">تنظیمات انتشار</p>

            <label className="flex items-center gap-2 rounded-xl border border-border px-3 py-2.5 text-[11px] font-semibold text-foreground">
              <input
                type="checkbox"
                checked={values.isPublished}
                onChange={(event) =>
                  update("isPublished", event.target.checked)
                }
                className="h-4 w-4 rounded border-input accent-primary"
              />
              انتشار در وبلاگ عمومی
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="post-read-time">زمان مطالعه (دقیقه)</Label>
                <Input
                  id="post-read-time"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={120}
                  dir="ltr"
                  className="text-left"
                  value={values.readTime}
                  onChange={(event) => update("readTime", event.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="post-author">نویسنده (اختیاری)</Label>
                <Input
                  id="post-author"
                  value={values.author}
                  onChange={(event) => update("author", event.target.value)}
                  maxLength={80}
                  placeholder="تیم فنی جهان البرز"
                />
              </div>
            </div>

            <p className="text-[10px] leading-5 text-muted-foreground">
              مطلب منتشرنشده در وبلاگ نمایش داده نمی‌شود. تاریخ انتشار نخستین
              انتشار حفظ می‌شود.
            </p>

            <Button
              type="submit"
              size="sm"
              disabled={pending}
            >
              {pending ? (
                <LoaderCircle
                  className="h-3.5 w-3.5 animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <Save className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {isEdit ? "ذخیره تغییرات" : "ایجاد مطلب"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

export function BlogRowActions({
  postId,
  isPublished,
}: {
  postId: string;
  isPublished: boolean;
}) {
  const router = useRouter();
  const [result, setResult] = useState<Result>(null);
  const [pending, startTransition] = useTransition();

  function handleToggle() {
    setResult(null);

    startTransition(async () => {
      const response = await setBlogPublished({
        postId,
        isPublished: !isPublished,
      });
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
        ) : isPublished ? (
          <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
        ) : (
          <Eye className="h-3.5 w-3.5" aria-hidden="true" />
        )}
        {isPublished ? "لغو انتشار" : "انتشار"}
      </Button>

      {result && !result.ok ? (
        <p className="max-w-[12rem] text-end text-[9.5px] leading-4 text-danger">
          {result.message}
        </p>
      ) : null}
    </div>
  );
}
