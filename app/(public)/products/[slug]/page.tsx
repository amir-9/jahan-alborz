import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import {
  ArrowLeft,
  Check,
  Headset,
  PackageCheck,
  Phone,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { JsonLd } from "@/components/shared/json-ld";
import { ProductVisual } from "@/components/shared/product-visual";
import { StarRating } from "@/components/shared/star-rating";
import { ProductCard } from "@/components/shop/product-card";
import { ProductPurchasePanel } from "@/components/shop/product-purchase-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/lib/config/site";
import { customerReviews, purchasingModeLabels } from "@/lib/data/catalog";
import {
  getCategories,
  getProductBySlug,
  getProducts,
} from "@/lib/data/catalog-repository";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getBreadcrumbSchema } from "@/lib/seo/structured-data";
import {
  formatNumber,
  formatPrice,
  getDiscountPercent,
  toTelHref,
} from "@/lib/utils/format";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

/** Product data is read from the database per request. */
export const instant = false;

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "محصول یافت نشد" };
  }

  return buildPageMetadata({
    title: product.name,
    description: product.description,
    path: `/products/${product.slug}`,
  });
}

const trustItems = [
  { icon: Truck, label: "ارسال به سراسر ایران" },
  { icon: PackageCheck, label: "تأمین قطعات و لوازم" },
  { icon: Headset, label: "مشاوره پیش از خرید" },
  { icon: ShieldCheck, label: "هماهنگی شرایط پیش از سفارش" },
];

export default async function ProductPage({ params }: ProductPageProps) {
  await connection();

  const { slug } = await params;
  const [product, products, productCategories] = await Promise.all([
    getProductBySlug(slug),
    getProducts(),
    getCategories(),
  ]);

  if (!product) {
    notFound();
  }

  const category =
    productCategories.find((item) => item.slug === product.categorySlug) ??
    null;
  const finalPrice = product.discountedPrice ?? product.price;
  const discount = getDiscountPercent(product.price, product.discountedPrice);

  const relatedProducts = products
    .filter(
      (item) =>
        item.id !== product.id && item.categorySlug === product.categorySlug,
    )
    .slice(0, 4);
  const relatedFallback = products
    .filter((item) => item.id !== product.id && item.isFeatured)
    .slice(0, 4);
  const suggestions =
    relatedProducts.length > 0 ? relatedProducts : relatedFallback;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    category: category?.name,
    url: `${siteConfig.url}/products/${product.slug}`,
    offers:
      product.purchasingMode === "FIXED"
        ? {
            "@type": "Offer",
            priceCurrency: "IRR",
            price: finalPrice,
            availability:
              product.inventory > 0
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
            seller: {
              "@type": "Organization",
              name: siteConfig.name,
            },
          }
        : undefined,
  };

  return (
    <div className="page-container pb-16 pt-6 sm:pt-8">
      <Breadcrumbs
        items={[
          { name: "فروشگاه", href: "/shop" },
          ...(category
            ? [{ name: category.name, href: `/categories/${category.slug}` }]
            : []),
          { name: product.name },
        ]}
      />
      <JsonLd data={productSchema} />
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "خانه", href: "/" },
          { name: "فروشگاه", href: "/shop" },
          ...(category
            ? [{ name: category.name, href: `/categories/${category.slug}` }]
            : []),
          { name: product.name, href: `/products/${product.slug}` },
        ])}
      />

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        {/* Visual */}
        <div className="lg:sticky lg:top-28">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-primary-50 via-surface to-surface p-6 shadow-soft sm:p-10">
            <div className="absolute inset-0 bg-grid opacity-40" aria-hidden="true" />
            <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
              <div className="flex flex-col gap-2">
                {discount ? (
                  <Badge variant="secondary">
                    {formatNumber(discount)}٪ تخفیف
                  </Badge>
                ) : null}
                <Badge variant="outline">{purchasingModeLabels[product.purchasingMode]}</Badge>
              </div>
              <Badge variant="default">تصویر شماتیک</Badge>
            </div>

            <div className="relative flex aspect-[4/3] items-center justify-center pt-6">
              <ProductVisual variant={product.visual} className="max-h-[22rem]" />
            </div>

            <p className="relative mt-4 text-center text-[10.5px] leading-5 text-muted-foreground">
              تصویر نمایشی و شماتیک است؛ تصویر واقعی محصول پس از افزودن
              گالری در پنل مدیریت نمایش داده می‌شود.
            </p>
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            {category ? (
              <Link
                href={`/categories/${category.slug}`}
                className="text-[11px] font-semibold text-secondary-600 transition-colors hover:text-secondary"
              >
                {category.name}
              </Link>
            ) : null}
            <span className="text-muted-foreground/40" aria-hidden="true">
              /
            </span>
            <span className="text-[11px] text-muted-foreground">
              {product.brand}
            </span>
          </div>

          <h1 className="mt-2 text-2xl font-extrabold leading-[1.5] text-primary sm:text-3xl">
            {product.name}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground">
            <StarRating
              value={product.rating}
              reviewCount={product.reviewCount}
              size="md"
            />
            <span className="h-3 w-px bg-border" aria-hidden="true" />
            <span>کد کالا: {product.sku}</span>
            <span className="h-3 w-px bg-border" aria-hidden="true" />
            <span
              className={
                product.inventory > 0
                  ? "font-semibold text-success"
                  : "font-semibold text-danger"
              }
            >
              {product.inventory > 0
                ? `موجود در انبار (${formatNumber(product.inventory)} عدد)`
                : "ناموجود"}
            </span>
          </div>

          <p className="mt-5 text-[13px] leading-8 text-muted-foreground">
            {product.description}
          </p>

          <div className="mt-6 rounded-2xl border border-border bg-surface p-5 shadow-soft">
            {product.purchasingMode === "FIXED" ? (
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-[11px] text-muted-foreground">قیمت</p>
                  <div className="mt-1 flex flex-wrap items-baseline gap-2">
                    <p className="text-xl font-extrabold text-primary sm:text-2xl">
                      {formatPrice(finalPrice)}
                    </p>
                    {discount ? (
                      <p className="text-[12px] text-muted-foreground line-through">
                        {formatPrice(product.price)}
                      </p>
                    ) : null}
                  </div>
                </div>
                {discount ? (
                  <span className="rounded-lg bg-secondary-50 px-2.5 py-1 text-[11px] font-bold text-secondary-600">
                    {formatNumber(discount)}٪ تخفیف
                  </span>
                ) : null}
              </div>
            ) : (
              <div>
                <p className="text-[11px] text-muted-foreground">قیمت</p>
                <p className="mt-1 text-lg font-extrabold text-primary">
                  استعلام قیمت
                </p>
                <p className="mt-1 text-[11px] leading-6 text-muted-foreground">
                  قیمت این محصول بر اساس مدل، ظرفیت و موجودی اعلام می‌شود.
                </p>
              </div>
            )}

            <Separator className="my-4" />

            <ProductPurchasePanel product={product} />

            <a
              href={toTelHref(siteConfig.contact.phone)}
              className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-[11px] font-semibold text-foreground transition-colors hover:border-primary/30 hover:text-primary"
              dir="ltr"
            >
              <Phone className="h-4 w-4 text-secondary" aria-hidden="true" />
              {siteConfig.contact.phone}
            </a>
          </div>

          <ul className="mt-6 grid grid-cols-2 gap-3">
            {trustItems.map((item) => (
              <li
                key={item.label}
                className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2.5 text-[11px] text-muted-foreground"
              >
                <item.icon className="h-4 w-4 shrink-0 text-secondary" aria-hidden="true" />
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Description & specs */}
      <div className="mt-12 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section aria-labelledby="product-specs">
          <h2
            id="product-specs"
            className="text-base font-bold text-primary"
          >
            مشخصات فنی
          </h2>
          <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-surface shadow-soft">
            <dl className="divide-y divide-border">
              {product.specifications.map((spec, index) => (
                <div
                  key={spec.label}
                  className={
                    index % 2 === 0
                      ? "grid grid-cols-2 gap-4 px-5 py-3.5"
                      : "grid grid-cols-2 gap-4 bg-surface-muted px-5 py-3.5"
                  }
                >
                  <dt className="text-[12px] text-muted-foreground">
                    {spec.label}
                  </dt>
                  <dd className="text-[12px] font-semibold text-foreground">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <p className="mt-3 text-[10.5px] leading-5 text-muted-foreground">
            مشخصات جدول بر اساس اطلاعات نمونه است و پیش از خرید نهایی باید با
            دفترچه فنی محصول تطبیق داده شود.
          </p>
        </section>

        <section aria-labelledby="product-notes">
          <h2 id="product-notes" className="text-base font-bold text-primary">
            نکات خرید و نصب
          </h2>
          <div className="mt-4 space-y-3">
            {[
              "پیش از خرید، ظرفیت گرمایشی و شرایط نصب محل را بررسی کنید.",
              "برای محصولات استعلامی، مدل و ظرفیت دقیق را با کارشناس هماهنگ کنید.",
              "زمان ارسال یا مراجعه تکنسین پس از تأیید سفارش هماهنگ می‌شود.",
              "شرایط گارانتی به برند و مدل محصول وابسته است و پیش از خرید اعلام می‌شود.",
            ].map((note) => (
              <div
                key={note}
                className="flex items-start gap-2.5 rounded-xl border border-border bg-surface px-4 py-3 text-[12px] leading-6 text-muted-foreground"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary-50 text-secondary-600">
                  <Check className="h-3 w-3" aria-hidden="true" />
                </span>
                {note}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Reviews */}
      <section className="mt-12" aria-labelledby="product-reviews">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="product-reviews" className="text-base font-bold text-primary">
              نظرات کاربران
            </h2>
            <p className="mt-1 text-[11px] text-muted-foreground">
              نظرات زیر نمونه نمایشی هستند و تأیید هویت یا صحت آن‌ها انجام
              نشده است.
            </p>
          </div>
          <Badge variant="outline">نمونه نمایشی</Badge>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {customerReviews.map((review) => (
            <article
              key={review.id}
              className="rounded-2xl border border-border bg-surface p-5 shadow-soft"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-[12px] font-bold text-foreground">
                  {review.author}، {review.city}
                </p>
                <StarRating value={review.rating} />
              </div>
              <p className="mt-2 text-[11.5px] leading-6 text-muted-foreground">
                {review.comment}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Related */}
      <section className="mt-12" aria-labelledby="related-products">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 id="related-products" className="text-base font-bold text-primary">
              محصولات مرتبط
            </h2>
            <p className="mt-1 text-[11px] text-muted-foreground">
              گزینه‌های دیگر در همین دسته یا پیشنهادهای فروشگاه
            </p>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/shop">
              همه محصولات
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {suggestions.map((item) => (
            <ProductCard key={item.id} product={item} compact />
          ))}
        </div>
      </section>
    </div>
  );
}
