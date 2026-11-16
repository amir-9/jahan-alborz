import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { ArrowRight, CircleExclamationPoint } from "lucide-react";
import { ProductForm } from "@/components/admin/product-form";
import { getAdminCategories } from "@/lib/data/admin-repository";
import { requireAdminPage } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "محصول جدید",
};

/** Category options are read from the database per request. */
export const instant = false;

export default async function AdminNewProductPage() {
  await connection();
  await requireAdminPage("products:write", "/admin/products");

  let categories: Awaited<ReturnType<typeof getAdminCategories>> = [];
  let failed = false;

  try {
    categories = await getAdminCategories();
  } catch (error) {
    console.error("[admin] new product categories query failed", error);
    failed = true;
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-muted-foreground hover:text-primary"
        >
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          همه محصولات
        </Link>
        <h1 className="mt-1 text-lg font-extrabold text-primary sm:text-xl">
          ایجاد محصول جدید
        </h1>
        <p className="mt-1.5 text-[11.5px] leading-6 text-muted-foreground">
          نامک باید یکتا باشد و آدرس صفحه محصول را می‌سازد. محصول استعلامی در سبد
          خرید قابل پرداخت مستقیم نیست و مسیر تماس را نمایش می‌دهد.
        </p>
      </div>

      {failed ? (
        <div className="flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-[11.5px] leading-6 text-amber-800">
          <CircleExclamationPoint
            className="mt-0.5 h-4 w-4 shrink-0"
            aria-hidden="true"
          />
          دریافت دسته‌بندی‌ها ممکن نیست؛ می‌توانید محصول را بدون دسته‌بندی
          ایجاد کنید یا بعداً اتصال پایگاه داده را بررسی کنید.
        </div>
      ) : null}

      <ProductForm
        categories={categories.map((category) => ({
          id: category.id,
          name: category.name,
        }))}
      />
    </div>
  );
}
