"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  CircleCheck,
  CircleExclamationPoint,
  LoaderCircle,
  Plus,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  createCategory,
  toggleCategoryActive,
} from "@/lib/actions/admin-products";
import type { ProductVisual } from "@/lib/data/catalog";

type CategoryFormProps = {
  visualOptions: { value: ProductVisual; label: string }[];
};

export function CategoryForm({ visualOptions }: CategoryFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [visual, setVisual] = useState<ProductVisual>("boiler");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const result = await createCategory({ name, slug, description, visual });

      if (!result.ok) {
        setError(result.message);
        return;
      }

      setName("");
      setSlug("");
      setDescription("");
      setVisual("boiler");
      setSuccess(result.message);
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-surface p-5 shadow-soft"
    >
      <h2 className="flex items-center gap-2 text-sm font-bold text-primary">
        <Plus className="h-4 w-4 text-secondary" aria-hidden="true" />
        افزودن دسته‌بندی
      </h2>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="category-name">نام دسته</Label>
          <Input
            id="category-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="category-slug">نامک (slug)</Label>
          <Input
            id="category-slug"
            dir="ltr"
            className="text-left"
            value={slug}
            onChange={(event) =>
              setSlug(
                event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
              )
            }
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="category-visual">تصویر شماتیک</Label>
          <Select
            id="category-visual"
            value={visual}
            onChange={(event) => setVisual(event.target.value as ProductVisual)}
          >
            {visualOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="category-description">توضیح کوتاه (اختیاری)</Label>
          <Textarea
            id="category-description"
            rows={2}
            maxLength={300}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>
      </div>

      {error ? (
        <p
          className="mt-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-caption leading-5 text-danger"
          role="alert"
        >
          <CircleExclamationPoint className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}

      {success ? (
        <p
          className="mt-3 flex items-start gap-2 rounded-xl border border-teal-200 bg-teal-50 px-3 py-2 text-caption leading-5 text-teal-800"
          role="status"
        >
          <CircleCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {success}
        </p>
      ) : null}

      <Button
        type="submit"
        size="sm"
        className="mt-3"
        disabled={pending || name.trim().length < 2 || slug.trim().length < 2}
      >
        {pending ? (
          <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
        ) : (
          <Save className="h-3.5 w-3.5" aria-hidden="true" />
        )}
        ایجاد دسته
      </Button>
    </form>
  );
}

type CategoryToggleProps = {
  categoryId: string;
  isActive: boolean;
};

export function CategoryToggle({
  categoryId,
  isActive,
}: CategoryToggleProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleToggle() {
    setError(null);

    startTransition(async () => {
      const result = await toggleCategoryActive({
        categoryId,
        isActive: !isActive,
      });

      if (!result.ok) {
        setError(result.message);
        return;
      }

      router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleToggle}
        disabled={pending}
      >
        {pending ? (
          <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
        ) : null}
        {isActive ? "غیرفعال‌سازی" : "فعال‌سازی"}
      </Button>
      {error ? (
        <p className="text-caption text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
