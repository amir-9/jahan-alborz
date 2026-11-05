import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Flame, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddToCartButton } from "@/components/shop/add-to-cart-button";
import { customerReviews, products, productCategories } from "@/lib/data/catalog";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);

  return {
    title: product?.name ?? "محصول",
    description: product?.description ?? "محصولات فروشگاه جهان البرز",
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    notFound();
  }

  const category = productCategories.find(
    (item) => item.slug === product.categorySlug,
  );
  const relatedProducts = products.filter(
    (item) => item.categorySlug === product.categorySlug && item.id !== product.id,
  );

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-primary">
              خانه
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/shop" className="hover:text-primary">
              فروشگاه
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>{category?.name ?? "عمومی"}</li>
        </ol>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div className="aspect-square w-full rounded-xl bg-primary/5">
          <Flame
            className="mx-auto mt-1/2 h-24 w-24 text-primary/30"
            aria-hidden="true"
          />
        </div>

        <div>
          <span className="inline-flex items-center rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary">
            {product.brand}
          </span>
          <h1 className="mt-4 text-3xl font-bold text-foreground sm:text-4xl">
            {product.name}
          </h1>

          {product.purchasingMode === "QUOTE" ? (
            <p className="mt-4 text-lg font-medium text-foreground">
              قیمت این محصول به‌ازای نیاز شما اعتبارنامه‌شده است.
            </p>
          ) : (
            <div className="mt-4 flex items-center gap-3">
              {product.discountedPrice ? (
                <span className="text-xl text-muted-foreground line-through">
                  {product.discountedPrice.toLocaleString("fa-IR")} تومان
                </span>
              ) : null}
              <span className="text-2xl font-bold text-primary">
                {product.price.toLocaleString("fa-IR")} تومان
              </span>
            </div>
          )}

          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            {product.description}
          </p>

          <div className="mt-6 flex items-center gap-3">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                product.inventory > 0
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {product.inventory > 0
                ? `موجودی: ${product.inventory} عدد`
                : "ناموجود"}
            </span>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            {product.purchasingMode === "FIXED" ? (
              <AddToCartButton />
            ) : (
              <Button asChild>
                <Link href="/services/request">درخواست قیمت و مشاوره</Link>
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link href="/services/request">درخواست خدمات نصب</Link>
            </Button>
          </div>

          {product.purchasingMode === "FIXED" ? (
            <p className="mt-4 text-sm text-muted-foreground">
              <ShieldCheck className="mr-2 inline h-4 w-4 text-secondary" aria-hidden="true" />
              گارانتی اصالت کالا و پشتیبانی فنی پس از فروش.
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-16 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-bold text-foreground">توضیحات محصول</h2>
          <p className="mt-4 text-sm leading-8 text-muted-foreground">
            {product.description}
          </p>

          <h2 className="mt-10 text-xl font-bold text-foreground">
            مشخصات محصول
          </h2>
          <dl className="mt-4 divide-y divide-border rounded-xl border border-border">
            {product.specifications.map((spec) => (
              <div
                key={spec.label}
                className="flex items-center justify-between px-6 py-3"
              >
                <dt className="text-sm text-muted-foreground">{spec.label}</dt>
                <dd className="text-sm font-medium text-foreground">
                  {spec.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <h2 className="text-xl font-bold text-foreground">نظرات مشتریان</h2>
          <div className="mt-4 space-y-4">
            {customerReviews.map((review) => (
              <div
                key={review.id}
                className="rounded-xl border border-border bg-surface p-6"
              >
                <p className="text-sm font-medium text-foreground">
                  {review.title} — {review.author}
                </p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 ? (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-foreground">محصولات مرتبط</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((related) => (
              <div
                key={related.id}
                className="rounded-xl border border-border bg-surface p-6"
              >
                <h3 className="text-base font-semibold text-foreground">
                  <Link href={`/products/${related.slug}`} className="hover:text-primary">
                    {related.name}
                  </Link>
                </h3>
                <span className="mt-2 block text-sm text-muted-foreground">
                  {related.brand}
                </span>
                <span className="mt-3 block text-lg font-bold text-primary">
                  {related.discountedPrice ?? related.price
                    ? `${(related.discountedPrice ?? related.price).toLocaleString("fa-IR")} تومان`
                    : "قیمت اعتبارنامه‌شده"}
                </span>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
