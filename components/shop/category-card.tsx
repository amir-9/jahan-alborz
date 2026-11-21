import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ProductCategory } from "@/lib/data/catalog";
import { getCategoryMedia } from "@/lib/media/catalog-media";
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
  const media = getCategoryMedia(category.slug);

  return (
    <Link
      href={`/categories/${category.slug}`}
      className={
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-soft transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
        (className ?? "")
      }
    >
      <div className="relative h-32 overflow-hidden bg-primary-50">
        <Image
          src={media.src}
          alt={media.alt}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-primary-900/45 via-transparent to-transparent"
          aria-hidden="true"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-bold text-primary">{category.name}</h3>
        <p className="mt-1.5 line-clamp-2 text-caption leading-6 text-muted-foreground">
          {category.description}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
          <span className="text-caption text-muted-foreground">
            {productCount === undefined
              ? "مشاهده محصولات"
              : `${formatNumber(productCount)} محصول`}
          </span>
          <span className="inline-flex items-center gap-1 text-caption font-bold text-secondary-700">
            مشاهده
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}
