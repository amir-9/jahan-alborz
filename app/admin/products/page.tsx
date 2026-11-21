import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import {
  CircleExclamationPoint,
  Inbox,
  Package,
  Plus,
  TriangleAlert,
} from "lucide-react";
import {
  AdminFilterBar,
  AdminSelectFilter,
} from "@/components/admin/filter-bar";
import { ProductRowActions } from "@/components/admin/product-row-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAdminProducts } from "@/lib/data/admin-repository";
import { requireAdminPage } from "@/lib/auth/session";
import { formatNumber, formatPrice } from "@/lib/utils/format";
import { ProductVisual } from "@/components/shared/product-visual";
import type { ProductVisual as ProductVisualVariant } from "@/lib/data/catalog";

export const metadata: Metadata = {
  title: "محصولات",
};

/** Product lists are read per request so stock and prices stay current. */
export const instant = false;

type AdminProductsPageProps = {
  searchParams: Promise<{
    search?: string;
    status?: string;
    categoryId?: string;
  }>;
};

const statusOptions = [
  { value: "ACTIVE", label: "فعال" },
  { value: "HIDDEN", label: "پنهان" },
];

function toVisual(value: string): ProductVisualVariant {
  if (
    value === "boiler" ||
    value === "radiator" ||
    value === "parts" ||
    value === "installation"
  ) {
    return value;
  }

  return "boiler";
}

export default async function AdminProductsPage({
  searchParams,
}: AdminProductsPageProps) {
  await connection();
  await requireAdminPage("products:read", "/admin/products");

  const params = await searchParams;

  let result: Awaited<ReturnType<typeof getAdminProducts>> | null = null;

  try {
    result = await getAdminProducts({
      search: params.search,
      status: params.status,
      categoryId: params.categoryId,
    });
  } catch (error) {
    console.error("[admin] products query failed", error);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-extrabold text-primary sm:text-xl">
            مدیریت محصولات
          </h1>
          <p className="mt-1.5 text-caption leading-6 text-muted-foreground">
            محصولات، قیمت، موجودی و دسته‌بندی را مدیریت کنید. حذف محصول، آن را از
            فروشگاه پنهان می‌کند و سوابق سفارش‌ها حفظ می‌شود.
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4" aria-hidden="true" />
            محصول جدید
          </Link>
        </Button>
      </div>

      <AdminFilterBar
        action="/admin/products"
        searchValue={params.search}
        searchPlaceholder="نام، نامک، برند یا کد کالا"
        resetHref="/admin/products"
      >
        <AdminSelectFilter
          name="status"
          label="وضعیت"
          value={params.status}
          options={statusOptions}
        />
        <AdminSelectFilter
          name="categoryId"
          label="دسته‌بندی"
          value={params.categoryId}
          options={(result?.categories ?? []).map((category) => ({
            value: category.id,
            label: category.name,
          }))}
        />
      </AdminFilterBar>

      <p className="flex items-center gap-1.5 rounded-xl border border-dashed border-border bg-surface px-3 py-2 text-caption leading-5 text-muted-foreground">
        <TriangleAlert className="h-3.5 w-3.5 shrink-0 text-secondary" aria-hidden="true" />
        محصولات کم‌موجود (۳ عدد یا کمتر) در داشبورد نمایش داده می‌شوند. مدیریت
        گالری تصاویر واقعی در این نسخه فعال نیست.
      </p>

      {!result ? (
        <div className="flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-caption leading-6 text-amber-800">
          <CircleExclamationPoint
            className="mt-0.5 h-4 w-4 shrink-0"
            aria-hidden="true"
          />
          دریافت محصولات در حال حاضر ممکن نیست. اتصال پایگاه داده را بررسی کنید.
        </div>
      ) : result.products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface px-5 py-12 text-center shadow-soft">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary">
            <Inbox className="h-6 w-6" aria-hidden="true" />
          </span>
          <p className="mt-4 text-caption font-bold text-primary">
            محصولی با این فیلترها یافت نشد
          </p>
          <p className="mt-1.5 text-caption text-muted-foreground">
            فیلترها را تغییر دهید یا محصول جدیدی ایجاد کنید.
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2.5">
            {result.products.map((product) => {
              const price = Number(product.price);
              const discounted = product.discountedPrice
                ? Number(product.discountedPrice)
                : null;
              const lowStock = product.inventory <= 3;

              return (
                <article
                  key={product.id}
                  className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-3.5 shadow-soft sm:flex-row sm:items-center"
                >
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-primary-50/60 to-surface">
                    <ProductVisual
                      variant={toVisual(product.visual)}
                      className="h-16 w-16"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="text-caption font-bold text-primary hover:underline"
                      >
                        {product.name}
                      </Link>
                      <Badge variant={product.isActive ? "success" : "outline"}>
                        {product.isActive ? "فعال" : "پنهان"}
                      </Badge>
                      {product.isFeatured ? (
                        <Badge variant="secondary">ویژه</Badge>
                      ) : null}
                      {product.isBestSeller ? (
                        <Badge variant="secondary">پرفروش</Badge>
                      ) : null}
                    </div>

                    <p className="mt-1 break-words text-caption text-muted-foreground [overflow-wrap:anywhere]">
                      <span dir="ltr">{product.slug}</span>
                      {product.category ? ` · ${product.category.name}` : " · بدون دسته"}
                      {product.brand ? ` · ${product.brand}` : ""}
                      {product.sku ? ` · کد ${product.sku}` : ""}
                    </p>

                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-caption">
                      <span className="font-semibold text-primary">
                        {formatPrice(discounted ?? price)}
                        {discounted ? (
                          <span className="ms-1.5 text-caption font-normal text-muted-foreground line-through">
                            {formatPrice(price)}
                          </span>
                        ) : null}
                      </span>
                      <span
                        className={
                          lowStock
                            ? "inline-flex items-center gap-1 font-semibold text-amber-700"
                            : "text-muted-foreground"
                        }
                      >
                        {lowStock ? (
                          <TriangleAlert className="h-3 w-3" aria-hidden="true" />
                        ) : (
                          <Package className="h-3 w-3" aria-hidden="true" />
                        )}
                        موجودی: {formatNumber(product.inventory)}
                      </span>
                      <span className="text-muted-foreground">
                        {product.purchasingMode === "QUOTE"
                          ? "استعلام قیمت"
                          : "قیمت ثابت"}
                      </span>
                    </div>
                  </div>

                  <ProductRowActions
                    productId={product.id}
                    isActive={product.isActive}
                  />
                </article>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-caption text-muted-foreground">
            <p>
              نمایش {formatNumber(result.products.length)} محصول از{" "}
              {formatNumber(result.total)} مورد مطابق فیلتر.
            </p>
            <p className="text-caption">
              فهرست محصولات تا ۱۰۰ مورد را در یک صفحه نمایش می‌دهد؛ برای محدوده
              بزرگ‌تر از جستجو استفاده کنید.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
