import type { Metadata } from "next";
import { connection } from "next/server";
import { CircleExclamationPoint, Tags } from "lucide-react";
import {
  CategoryForm,
  CategoryToggle,
} from "@/components/admin/category-forms";
import { Badge } from "@/components/ui/badge";
import { getAdminCategories } from "@/lib/data/admin-repository";
import { requireAdminPage } from "@/lib/auth/session";
import { formatNumber } from "@/lib/utils/format";
import type { ProductVisual } from "@/lib/data/catalog";

export const metadata: Metadata = {
  title: "دسته‌بندی‌ها",
};

/** Reads the category list per request, so blocking navigation is expected. */
export const instant = false;

const visualOptions: { value: ProductVisual; label: string }[] = [
  { value: "boiler", label: "پکیج / آبگرمکن" },
  { value: "radiator", label: "رادیاتور" },
  { value: "parts", label: "قطعات و لوازم" },
  { value: "installation", label: "تجهیزات نصب" },
];

export default async function AdminCategoriesPage() {
  await connection();
  await requireAdminPage("products:read", "/admin/categories");

  let categories: Awaited<ReturnType<typeof getAdminCategories>> | null = null;

  try {
    categories = await getAdminCategories();
  } catch (error) {
    console.error("[admin] categories query failed", error);
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-extrabold text-primary sm:text-xl">
          دسته‌بندی محصولات
        </h1>
        <p className="mt-1.5 text-caption leading-6 text-muted-foreground">
          دسته‌بندی‌های فعال در فهرست دسته‌ها و منوی فروشگاه نمایش داده می‌شوند.
          غیرفعال‌سازی دسته، محصولات آن را پنهان نمی‌کند اما دسته را از فهرست
          عمومی برمی‌دارد.
        </p>
      </div>

      <CategoryForm visualOptions={visualOptions} />

      {!categories ? (
        <div className="flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-caption leading-6 text-amber-800">
          <CircleExclamationPoint
            className="mt-0.5 h-4 w-4 shrink-0"
            aria-hidden="true"
          />
          دریافت دسته‌بندی‌ها در حال حاضر ممکن نیست. اتصال پایگاه داده را بررسی
          کنید.
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface px-5 py-12 text-center shadow-soft">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary">
            <Tags className="h-6 w-6" aria-hidden="true" />
          </span>
          <p className="mt-4 text-caption font-bold text-primary">
            هنوز دسته‌بندی‌ای ثبت نشده است
          </p>
          <p className="mt-1.5 text-caption text-muted-foreground">
            با فرم بالا نخستین دسته‌بندی را ایجاد کنید.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-soft">
          <div className="hidden grid-cols-[1.4fr_1fr_0.7fr_auto] gap-3 border-b border-border bg-surface-muted px-4 py-2.5 text-caption font-bold text-muted-foreground md:grid">
            <span>نام / نامک</span>
            <span>توضیح</span>
            <span>تعداد محصول</span>
            <span className="text-end">وضعیت</span>
          </div>

          <div className="divide-y divide-border">
            {categories.map((category) => (
              <div
                key={category.id}
                className="grid gap-2 px-4 py-3.5 md:grid-cols-[1.4fr_1fr_0.7fr_auto] md:items-center md:gap-3"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <p className="text-caption font-bold text-foreground">
                      {category.name}
                    </p>
                    <Badge variant={category.isActive ? "success" : "outline"}>
                      {category.isActive ? "فعال" : "غیرفعال"}
                    </Badge>
                  </div>
                  <p
                    dir="ltr"
                    className="mt-0.5 text-start text-caption text-muted-foreground"
                  >
                    {category.slug}
                  </p>
                </div>

                <p className="text-caption leading-5 text-muted-foreground">
                  {category.description?.trim() || "—"}
                </p>

                <p className="text-caption text-muted-foreground">
                  {formatNumber(category._count.products)} محصول
                </p>

                <CategoryToggle
                  categoryId={category.id}
                  isActive={category.isActive}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-caption leading-5 text-muted-foreground">
        حذف دسته‌بندی در این نسخه پیاده‌سازی نشده است تا محصولات مرتبط بدون دسته
        نمانند؛ به‌جای حذف، دسته را غیرفعال کنید.
      </p>
    </div>
  );
}
