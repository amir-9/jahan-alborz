import type { Metadata } from "next";
import { connection } from "next/server";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CategoryCard } from "@/components/shop/category-card";
import { SectionHeading } from "@/components/shared/section-heading";
import {
  getCategories,
  getProducts,
} from "@/lib/data/catalog-repository";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "دسته‌بندی محصولات",
  description:
    "دسته‌بندی محصولات فروشگاه جهان البرز شامل پکیج، رادیاتور، قطعات یدکی و لوازم نصب.",
  path: "/categories",
});

/** Categories are read from the database per request. */
export const instant = false;

export default async function CategoriesPage() {
  await connection();

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  const productsPerCategory = new Map<string, number>();

  for (const product of products) {
    productsPerCategory.set(
      product.categorySlug,
      (productsPerCategory.get(product.categorySlug) ?? 0) + 1,
    );
  }

  return (
    <div className="page-container pb-16 pt-6 sm:pt-8">
      <Breadcrumbs items={[{ name: "دسته‌بندی محصولات" }]} />

      <div className="mt-6">
        <SectionHeading
          as="h1"
          eyebrow="دسته‌بندی‌ها"
          title="محصولات را بر اساس نیاز خود مرور کنید"
          description="هر دسته شامل توضیح کوتاه و فهرست محصولات مرتبط است. برای انتخاب دقیق‌تر، از مشاوره پیش از خرید استفاده کنید."
        />
      </div>

      {categories.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-border bg-surface px-5 py-8 text-center text-[12px] leading-7 text-muted-foreground">
          هنوز دسته‌بندی فعالی در فروشگاه ثبت نشده است. برای استعلام موجودی با
          فروشگاه تماس بگیرید.
        </p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.slug}
              category={category}
              productCount={productsPerCategory.get(category.slug) ?? 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
