"use client";

import { useMemo, useState } from "react";
import { PackageSearch, Search, SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "@/components/shop/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { Product, ProductCategory } from "@/lib/data/catalog";
import { cn } from "@/lib/utils/cn";
import { formatNumber } from "@/lib/utils/format";

type SortKey = "featured" | "price-asc" | "price-desc" | "name";

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "featured", label: "مرتب‌سازی: پیشنهادی" },
  { value: "price-asc", label: "قیمت: کم به زیاد" },
  { value: "price-desc", label: "قیمت: زیاد به کم" },
  { value: "name", label: "نام محصول" },
];

const PAGE_SIZE = 8;

type ShopCatalogProps = {
  products: Product[];
  categories: ProductCategory[];
  lockedCategory?: string;
  showCategoryFilter?: boolean;
  className?: string;
};

export function ShopCatalog({
  products,
  categories,
  lockedCategory,
  showCategoryFilter = true,
  className,
}: ShopCatalogProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(lockedCategory ?? "all");
  const [sort, setSort] = useState<SortKey>("featured");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = products.filter((product) => {
      const matchesCategory =
        category === "all" || product.categorySlug === category;
      const matchesQuery =
        query.length === 0 ||
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);

      return matchesCategory && matchesQuery;
    });

    return [...result].sort((a, b) => {
      if (sort === "price-asc") {
        return (a.discountedPrice ?? a.price) - (b.discountedPrice ?? b.price);
      }
      if (sort === "price-desc") {
        return (b.discountedPrice ?? b.price) - (a.discountedPrice ?? a.price);
      }
      if (sort === "name") {
        return a.name.localeCompare(b.name, "fa");
      }
      return Number(b.isFeatured) - Number(a.isFeatured);
    });
  }, [products, category, search, sort]);

  const visible = filtered.slice(0, visibleCount);
  const hasActiveFilters =
    search.trim().length > 0 || (!lockedCategory && category !== "all");

  function resetFilters() {
    setSearch("");
    setCategory(lockedCategory ?? "all");
    setSort("featured");
    setVisibleCount(PAGE_SIZE);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="rounded-2xl border border-border bg-surface p-4 shadow-soft">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute inset-y-0 start-3.5 my-auto h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setVisibleCount(PAGE_SIZE);
              }}
              placeholder="جست‌وجو در نام، برند یا توضیح محصول…"
              className="ps-10"
              aria-label="جست‌وجوی محصولات"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">مرتب‌سازی</span>
            </div>
            <Select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
              aria-label="مرتب‌سازی محصولات"
              className="min-w-44"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {showCategoryFilter ? (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
            <button
              type="button"
              onClick={() => {
                setCategory("all");
                setVisibleCount(PAGE_SIZE);
              }}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                category === "all"
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-surface text-muted-foreground hover:border-primary/30 hover:text-primary",
              )}
            >
              همه محصولات
            </button>
            {categories.map((item) => (
              <button
                key={item.slug}
                type="button"
                onClick={() => {
                  setCategory(item.slug);
                  setVisibleCount(PAGE_SIZE);
                }}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  category === item.slug
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-surface text-muted-foreground hover:border-primary/30 hover:text-primary",
                )}
              >
                {item.name}
              </button>
            ))}

            {hasActiveFilters ? (
              <button
                type="button"
                onClick={resetFilters}
                className="ms-auto inline-flex items-center gap-1 rounded-full px-2 py-1.5 text-[11px] font-semibold text-danger transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="h-3 w-3" aria-hidden="true" />
                حذف فیلترها
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[12px] text-muted-foreground" aria-live="polite">
          {formatNumber(filtered.length)} محصول یافت شد
        </p>
        <Badge variant="outline">قیمت‌ها پیش از تأیید</Badge>
      </div>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-surface px-6 py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary">
            <PackageSearch className="h-7 w-7" aria-hidden="true" />
          </span>
          <div>
            <p className="font-bold text-foreground">محصولی پیدا نشد</p>
            <p className="mt-2 max-w-sm text-[12px] leading-6 text-muted-foreground">
              عبارت جست‌وجو یا دسته‌بندی را تغییر دهید. اگر محصول مورد نظر را
              پیدا نکردید، برای استعلام موجودی با ما تماس بگیرید.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <Button variant="outline" onClick={resetFilters}>
              پاک کردن فیلترها
            </Button>
            <Button asChild variant="ghost">
              <a href="/contact">تماس با فروشگاه</a>
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} className="h-full" />
            ))}
          </div>

          {visibleCount < filtered.length ? (
            <div className="flex justify-center pt-2">
              <Button
                variant="outline"
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
              >
                نمایش محصولات بیشتر
              </Button>
            </div>
          ) : null}
        </>
      )}

      <p className="rounded-xl border border-dashed border-border bg-surface px-4 py-3 text-[11px] leading-6 text-muted-foreground">
        قیمت، موجودی و زمان ارسال پیش از نهایی‌سازی سفارش توسط فروشگاه بررسی
        و در صورت نیاز با شما هماهنگ می‌شود.
      </p>
    </div>
  );
}
