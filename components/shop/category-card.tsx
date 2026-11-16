import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProductVisual } from "@/components/shared/product-visual";
import type { ProductCategory } from "@/lib/data/catalog";
import { formatNumber } from "@/lib/utils/format";

type CategoryCardProps = {
  category: ProductCategory;
  productCount?: number;
  className?: string;
};

export function CategoryCard({
  category,
  productCount,
  className,
}: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className={
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface p-5 shadow-soft transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
        (className ?? "")
      }
    >
      <div className="absolute -end-6 -top-6 h-24 w-24 rounded-full bg-secondary-50 transition-transform duration-500 group-hover:scale-125" aria-hidden="true" />

      <div className="relative flex h-24 items-center justify-center">
        <ProductVisual
          variant={category.visual}
          className="h-full w-auto max-w-[9rem] transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <h3 className="mt-3 text-base font-bold text-primary">{category.name}</h3>
      <p className="mt-1.5 line-clamp-2 text-xs leading-6 text-muted-foreground">
        {category.description}
      </p>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <span className="text-[11px] text-muted-foreground">
          {productCount === undefined
            ? "مشاهده محصولات"
            : `${formatNumber(productCount)} محصول`}
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-secondary-600">
          مشاهده
          <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
