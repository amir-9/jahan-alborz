import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ArrowLeft } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ProductVisual } from "@/components/shared/product-visual";
import { ShopCatalog } from "@/components/shop/shop-catalog";
import { Badge } from "@/components/ui/badge";
import { JsonLd } from "@/components/shared/json-ld";
import {
  getCategories,
  getCategoryBySlug,
  getProducts,
} from "@/lib/data/catalog-repository";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getBreadcrumbSchema } from "@/lib/seo/structured-data";
import { formatNumber } from "@/lib/utils/format";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

/** Category products are read from the database per request. */
export const instant = false;

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { title: "دسته‌بندی یافت نشد" };
  }

  return buildPageMetadata({
    title: category.name,
    description: category.description,
    path: `/categories/${category.slug}`,
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  await connection();

  const { slug } = await params;
  const [category, products, categories] = await Promise.all([
    getCategoryBySlug(slug),
    getProducts(),
    getCategories(),
  ]);

  if (!category) {
    notFound();
  }

  const categoryProducts = products.filter(
    (product) => product.categorySlug === category.slug,
  );
  const otherCategories = categories.filter(
    (item) => item.slug !== category.slug,
  );

  return (
    <div className="page-shell page-container pb-16 pt-6 sm:pt-8">
      <Breadcrumbs
        items={[
          { name: "دسته‌بندی محصولات", href: "/categories" },
          { name: category.name },
        ]}
      />
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "خانه", href: "/" },
          { name: "دسته‌بندی محصولات", href: "/categories" },
          { name: category.name, href: `/categories/${category.slug}` },
        ])}
      />

      <div className="mt-6 overflow-hidden rounded-3xl border border-border bg-surface shadow-soft">
        <div className="relative grid gap-6 bg-gradient-to-l from-primary-50 via-surface to-surface p-6 sm:p-8 lg:grid-cols-[1fr_18rem] lg:items-center">
          <div className="absolute inset-0 bg-grid opacity-50" aria-hidden="true" />
          <div className="relative">
            <Badge variant="secondary">
              {formatNumber(categoryProducts.length)} محصول
            </Badge>
            <h1 className="animate-rise mt-3 text-2xl font-extrabold tracking-tight text-primary sm:text-3xl">
              {category.name}
            </h1>
            <p className="mt-3 max-w-xl text-caption leading-8 text-muted-foreground">
              {category.description}
            </p>
            <p className="mt-2 text-caption text-muted-foreground">
              برای اطمینان از سازگاری مدل و ظرفیت، پیش از سفارش با ما هماهنگ
              کنید.
            </p>
          </div>

          <div className="relative flex h-40 items-center justify-center">
            <ProductVisual variant={category.visual} className="h-full w-auto" />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <ShopCatalog
          products={categoryProducts}
          categories={[category]}
          lockedCategory={category.slug}
          showCategoryFilter={false}
        />
      </div>

      {otherCategories.length > 0 ? (
        <div className="mt-10">
          <h2 className="text-sm font-bold text-primary">دسته‌بندی‌های دیگر</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {otherCategories.map((item) => (
              <Link
                key={item.slug}
                href={`/categories/${item.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-2 text-caption font-semibold text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
              >
                {item.name}
                <ArrowLeft className="h-3 w-3" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
