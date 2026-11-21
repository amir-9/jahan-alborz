import Link from "next/link";
import { ArrowLeft, Sparkles, TrendingUp } from "lucide-react";
import { ProductVisual } from "@/components/shared/product-visual";
import { StarRating } from "@/components/shared/star-rating";
import { AddToCartButton } from "@/components/shop/add-to-cart-button";
import { Badge } from "@/components/ui/badge";
import { productCategories, type Product } from "@/lib/data/catalog";
import { cn } from "@/lib/utils/cn";
import {
  formatPercent,
  formatPrice,
  getDiscountPercent,
} from "@/lib/utils/format";

type ProductCardProps = {
  product: Product;
  className?: string;
  compact?: boolean;
};

export function ProductCard({
  product,
  className,
  compact = false,
}: ProductCardProps) {
  const category =
    product.categoryName ??
    productCategories.find((item) => item.slug === product.categorySlug)?.name ??
    "محصول";
  const finalPrice = product.discountedPrice ?? product.price;
  const discount = getDiscountPercent(product.price, product.discountedPrice);

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-soft",
        "transition-[transform,box-shadow,border-color] duration-300",
        "hover:-translate-y-1 hover:border-primary/20 hover:shadow-lift",
        className,
      )}
    >
      <div className="relative overflow-hidden border-b border-border bg-surface-muted">
        <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-2 p-3">
          <div className="flex flex-col items-start gap-1.5">
            {discount ? (
              <Badge variant="secondary">{formatPercent(discount)} تخفیف</Badge>
            ) : null}
            {product.isBestSeller ? (
              <Badge variant="outline">
                <TrendingUp className="h-3 w-3" aria-hidden="true" />
                پرفروش
              </Badge>
            ) : null}
          </div>
          {product.isFeatured && !product.isBestSeller ? (
            <Badge variant="default">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              پیشنهاد ویژه
            </Badge>
          ) : null}
        </div>

        <Link
          href={`/products/${product.slug}`}
          className={cn(
            "relative block overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
            compact ? "aspect-[5/4]" : "aspect-[4/3]",
          )}
          aria-label={product.name}
        >
          <ProductVisual
            variant={product.visual}
            className="transition-transform duration-500 ease-out group-hover:scale-[1.05]"
          />
        </Link>
      </div>

      <div className={cn("flex flex-1 flex-col", compact ? "p-4" : "p-5")}>
        <div className="flex items-center justify-between gap-2 text-caption font-medium text-muted-foreground">
          <span>{category}</span>
          <span>{product.brand}</span>
        </div>

        <h3
          className={cn(
            "mt-2 font-bold leading-7 text-foreground transition-colors group-hover:text-primary",
            compact ? "text-sm" : "text-base",
          )}
        >
          <Link
            href={`/products/${product.slug}`}
            className="focus-visible:outline-none focus-visible:underline"
          >
            {product.name}
          </Link>
        </h3>

        <div className="mt-2">
          <StarRating value={product.rating} reviewCount={product.reviewCount} />
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          {product.purchasingMode === "QUOTE" ? (
            <div>
              <p className="text-sm font-bold text-primary">استعلام قیمت</p>
              <p className="mt-0.5 text-caption text-muted-foreground">
                بر اساس مدل و ظرفیت
              </p>
            </div>
          ) : (
            <div>
              {discount ? (
                <p className="text-caption text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </p>
              ) : null}
              <p className="text-base font-extrabold text-primary">
                {formatPrice(finalPrice)}
              </p>
            </div>
          )}
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-primary transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`جزئیات ${product.name}`}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <AddToCartButton
          product={product}
          className="mt-4"
          fullWidth
          withIcon={false}
          size="sm"
        />
      </div>
    </article>
  );
}
