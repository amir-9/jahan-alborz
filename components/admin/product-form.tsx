"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CircleCheck,
  CircleExclamationPoint,
  LoaderCircle,
  Save,
} from "lucide-react";
import { ProductVisual } from "@/components/shared/product-visual";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createProduct, updateProduct } from "@/lib/actions/admin-products";
import type { ProductVisual as ProductVisualVariant } from "@/lib/data/catalog";
import { adminProductSchema } from "@/lib/validation/admin-product";

type CategoryOption = {
  id: string;
  name: string;
};

export type ProductFormInitial = {
  id?: string;
  name: string;
  slug: string;
  categoryId: string;
  description: string;
  brand: string;
  sku: string;
  price: string;
  discountedPrice: string;
  inventory: string;
  purchasingMode: "FIXED" | "QUOTE";
  visual: ProductVisualVariant;
  isActive: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
};

type ProductFormProps = {
  categories: CategoryOption[];
  initial?: ProductFormInitial;
};

const emptyValues: ProductFormInitial = {
  name: "",
  slug: "",
  categoryId: "",
  description: "",
  brand: "",
  sku: "",
  price: "",
  discountedPrice: "",
  inventory: "0",
  purchasingMode: "FIXED",
  visual: "boiler",
  isActive: true,
  isFeatured: false,
  isBestSeller: false,
};

const visualOptions: { value: ProductVisualVariant; label: string }[] = [
  { value: "boiler", label: "پکیج / آبگرمکن" },
  { value: "radiator", label: "رادیاتور" },
  { value: "parts", label: "قطعات و لوازم" },
  { value: "installation", label: "تجهیزات نصب" },
];

export function ProductForm({ categories, initial }: ProductFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const [values, setValues] = useState<ProductFormInitial>(
    initial ?? emptyValues,
  );
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string[] | undefined>
  >({});
  const [result, setResult] = useState<
    { ok: true; message: string } | { ok: false; message: string } | null
  >(null);
  const [pending, startTransition] = useTransition();

  function update<K extends keyof ProductFormInitial>(
    field: K,
    value: ProductFormInitial[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
    setResult(null);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult(null);

    const parsed = adminProductSchema.safeParse(values);

    if (!parsed.success) {
      setFieldErrors(parsed.error.flatten().fieldErrors);
      setResult({
        ok: false,
        message: "لطفاً خطاهای فرم محصول را بررسی کنید.",
      });
      return;
    }

    startTransition(async () => {
      const response =
        isEdit && initial?.id
          ? await updateProduct({ ...parsed.data, productId: initial.id })
          : await createProduct(parsed.data);

      if (!response.ok) {
        setResult({ ok: false, message: response.message });

        if (response.fieldErrors) {
          setFieldErrors(response.fieldErrors);
        }
        return;
      }

      setResult({ ok: true, message: response.message });
      router.refresh();

      if (!isEdit) {
        router.push("/admin/products");
      }
    });
  }

  const effectivePrice = Number(values.discountedPrice) || Number(values.price) || 0;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="grid gap-4 xl:grid-cols-[1.6fr_1fr] xl:items-start"
    >
      <div className="flex flex-col gap-4">
        {result ? (
          <p
            className={`flex items-start gap-2 rounded-2xl px-4 py-3 text-caption leading-6 ${
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

        <section className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
          <h2 className="text-sm font-bold text-primary">اطلاعات پایه</h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field
              label="نام محصول"
              htmlFor="product-name"
              required
              error={fieldErrors.name?.[0]}
              className="sm:col-span-2"
            >
              <Input
                id="product-name"
                value={values.name}
                onChange={(event) => update("name", event.target.value)}
                required
              />
            </Field>

            <Field
              label="نامک (slug)"
              htmlFor="product-slug"
              required
              error={fieldErrors.slug?.[0]}
              hint="باید یکتا باشد و فقط شامل حروف کوچک انگلیسی، رقم و خط تیره."
            >
              <Input
                id="product-slug"
                dir="ltr"
                className="text-left"
                value={values.slug}
                onChange={(event) =>
                  update(
                    "slug",
                    event.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]/g, ""),
                  )
                }
                required
              />
            </Field>

            <Field
              label="کد کالا (SKU)"
              htmlFor="product-sku"
              error={fieldErrors.sku?.[0]}
              hint="اختیاری؛ در صورت تکرار ذخیره نمی‌شود."
            >
              <Input
                id="product-sku"
                dir="ltr"
                className="text-left"
                value={values.sku}
                onChange={(event) => update("sku", event.target.value)}
              />
            </Field>

            <Field label="دسته‌بندی" htmlFor="product-category">
              <Select
                id="product-category"
                value={values.categoryId}
                onChange={(event) => update("categoryId", event.target.value)}
              >
                <option value="">بدون دسته‌بندی</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="برند" htmlFor="product-brand">
              <Input
                id="product-brand"
                value={values.brand}
                onChange={(event) => update("brand", event.target.value)}
              />
            </Field>

            <Field
              label="توضیحات"
              htmlFor="product-description"
              required
              error={fieldErrors.description?.[0]}
              className="sm:col-span-2"
            >
              <Textarea
                id="product-description"
                rows={5}
                value={values.description}
                onChange={(event) => update("description", event.target.value)}
                required
              />
            </Field>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
          <h2 className="text-sm font-bold text-primary">قیمت و موجودی</h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field
              label="قیمت (تومان)"
              htmlFor="product-price"
              required
              error={fieldErrors.price?.[0]}
            >
              <Input
                id="product-price"
                inputMode="numeric"
                dir="ltr"
                className="text-left"
                value={values.price}
                onChange={(event) =>
                  update("price", event.target.value.replace(/\D/g, ""))
                }
                required
              />
            </Field>

            <Field
              label="قیمت با تخفیف (تومان)"
              htmlFor="product-discounted-price"
              error={fieldErrors.discountedPrice?.[0]}
              hint="اختیاری و باید کمتر از قیمت اصلی باشد."
            >
              <Input
                id="product-discounted-price"
                inputMode="numeric"
                dir="ltr"
                className="text-left"
                value={values.discountedPrice}
                onChange={(event) =>
                  update(
                    "discountedPrice",
                    event.target.value.replace(/\D/g, ""),
                  )
                }
              />
            </Field>

            <Field
              label="موجودی"
              htmlFor="product-inventory"
              required
              error={fieldErrors.inventory?.[0]}
            >
              <Input
                id="product-inventory"
                inputMode="numeric"
                dir="ltr"
                className="text-left"
                value={values.inventory}
                onChange={(event) =>
                  update("inventory", event.target.value.replace(/\D/g, ""))
                }
                required
              />
            </Field>

            <Field
              label="نوع خرید"
              htmlFor="product-mode"
              hint="محصول استعلامی در سبد خرید قابل پرداخت مستقیم نیست."
              className="sm:col-span-2"
            >
              <Select
                id="product-mode"
                value={values.purchasingMode}
                onChange={(event) =>
                  update(
                    "purchasingMode",
                    event.target.value as "FIXED" | "QUOTE",
                  )
                }
              >
                <option value="FIXED">قیمت ثابت</option>
                <option value="QUOTE">استعلام قیمت</option>
              </Select>
            </Field>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
          <h2 className="text-sm font-bold text-primary">نمایش و وضعیت</h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="تصویر شماتیک" htmlFor="product-visual">
              <Select
                id="product-visual"
                value={values.visual}
                onChange={(event) =>
                  update("visual", event.target.value as ProductVisualVariant)
                }
              >
                {visualOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>

            <div className="flex flex-col justify-end gap-2">
              <label className="flex items-center gap-2 text-caption font-semibold text-foreground">
                <input
                  type="checkbox"
                  checked={values.isActive}
                  onChange={(event) =>
                    update("isActive", event.target.checked)
                  }
                  className="h-4 w-4 accent-[var(--primary)]"
                />
                نمایش در فروشگاه
              </label>
              <label className="flex items-center gap-2 text-caption font-semibold text-foreground">
                <input
                  type="checkbox"
                  checked={values.isFeatured}
                  onChange={(event) =>
                    update("isFeatured", event.target.checked)
                  }
                  className="h-4 w-4 accent-[var(--primary)]"
                />
                محصول ویژه
              </label>
              <label className="flex items-center gap-2 text-caption font-semibold text-foreground">
                <input
                  type="checkbox"
                  checked={values.isBestSeller}
                  onChange={(event) =>
                    update("isBestSeller", event.target.checked)
                  }
                  className="h-4 w-4 accent-[var(--primary)]"
                />
                پرفروش
              </label>
            </div>
          </div>
        </section>
      </div>

      <aside className="flex flex-col gap-4 xl:sticky xl:top-24">
        <div className="rounded-2xl border border-border bg-surface p-4 shadow-soft">
          <p className="text-caption font-bold text-primary">پیش‌نمایش</p>
          <div className="mt-2 flex h-32 items-center justify-center rounded-xl bg-gradient-to-b from-primary-50/60 to-surface">
            <ProductVisual variant={values.visual} className="h-28 w-28" />
          </div>
          <p className="mt-3 truncate text-caption font-bold text-primary">
            {values.name.trim() || "نام محصول"}
          </p>
          <p className="mt-1 text-caption font-extrabold text-secondary">
            {effectivePrice > 0
              ? `${new Intl.NumberFormat("fa-IR").format(effectivePrice)} تومان`
              : "قیمت تعیین نشده"}
          </p>
          <p className="mt-1 text-caption text-muted-foreground">
            {values.purchasingMode === "QUOTE"
              ? "خرید استعلامی"
              : "خرید با قیمت ثابت"}
            {values.isActive ? " · نمایش فعال" : " · پنهان از فروشگاه"}
          </p>
        </div>

        <Button type="submit" size="lg" disabled={pending}>
          {pending ? (
            <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Save className="h-4 w-4" aria-hidden="true" />
          )}
          {isEdit ? "ذخیره تغییرات" : "ایجاد محصول"}
        </Button>

        <Button asChild variant="outline">
          <Link href="/admin/products">بازگشت به فهرست محصولات</Link>
        </Button>

        <p className="rounded-xl bg-surface-muted px-3 py-2 text-caption leading-5 text-muted-foreground">
          مدیریت گالری تصاویر واقعی در این نسخه پیاده‌سازی نشده است؛ محصولات با
          تصویر شماتیک محلی نمایش داده می‌شوند.
        </p>
      </aside>
    </form>
  );
}

type FieldProps = {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
};

function Field({
  label,
  htmlFor,
  required,
  error,
  hint,
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
      {hint ? (
        <p className="text-caption leading-5 text-muted-foreground">{hint}</p>
      ) : null}
      {error ? (
        <p className="text-caption font-medium text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
