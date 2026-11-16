import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ArrowRight, CircleExclamationPoint, Eye } from "lucide-react";
import { ProductForm } from "@/components/admin/product-form";
import { Button } from "@/components/ui/button";
import {
  getAdminCategories,
  getAdminProduct,
} from "@/lib/data/admin-repository";
import { requireAdminPage } from "@/lib/auth/session";
import type { ProductVisual as ProductVisualVariant } from "@/lib/data/catalog";
import { formatNumber } from "@/lib/utils/format";

export const metadata: Metadata = {
  title: "ویرایش محصول",
};

/** Product data and categories are read from the database per request. */
export const instant = false;

type AdminEditProductPageProps = {
  params: Promise<{ id: string }>;
};

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

export default async function AdminEditProductPage({
  params,
}: AdminEditProductPageProps) {
  await connection();
  await requireAdminPage("products:write", "/admin/products");

  const { id } = await params;

  let product: Awaited<ReturnType<typeof getAdminProduct>> = null;
  let categories: Awaited<ReturnType<typeof getAdminCategories>> = [];
  let failed = false;

  try {
    [product, categories] = await Promise.all([
      getAdminProduct(id),
      getAdminCategories(),
    ]);
  } catch (error) {
    console.error("[admin] edit product query failed", error);
    failed = true;
  }

  if (!failed && !product) {
    notFound();
  }

  if (failed || !product) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-[11.5px] leading-6 text-amber-800">
        <p className="flex items-center gap-2 font-bold">
          <CircleExclamationPoint className="h-4 w-4" aria-hidden="true" />
          دریافت اطلاعات محصول در حال حاضر ممکن نیست.
        </p>
        <Button asChild variant="outline" size="sm" className="mt-3">
          <Link href="/admin/products">بازگشت به محصولات</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-muted-foreground hover:text-primary"
          >
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            همه محصولات
          </Link>
          <h1 className="mt-1 text-lg font-extrabold text-primary sm:text-xl">
            ویرایش محصول
          </h1>
          <p className="mt-1 text-[10.5px] text-muted-foreground">
            شناسه: <span dir="ltr">{product.id}</span> · موجودی فعلی:{" "}
            {formatNumber(product.inventory)} عدد
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href={`/products/${product.slug}`} target="_blank">
            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
            مشاهده در سایت
          </Link>
        </Button>
      </div>

      <ProductForm
        categories={categories.map((category) => ({
          id: category.id,
          name: category.name,
        }))}
        initial={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          categoryId: product.categoryId ?? "",
          description: product.description,
          brand: product.brand ?? "",
          sku: product.sku ?? "",
          price: String(Math.round(Number(product.price))),
          discountedPrice:
            product.discountedPrice && Number(product.discountedPrice) > 0
              ? String(Math.round(Number(product.discountedPrice)))
              : "",
          inventory: String(product.inventory),
          purchasingMode: product.purchasingMode,
          visual: toVisual(product.visual),
          isActive: product.isActive,
          isFeatured: product.isFeatured,
          isBestSeller: product.isBestSeller,
        }}
      />
    </div>
  );
}
