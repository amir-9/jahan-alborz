"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import {
  productCategories,
  products,
  type Product,
} from "@/lib/data/catalog";

const PAGE_SIZE = 4;

type SortKey = "featured" | "price-asc" | "price-desc" | "name";

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "featured", label: "مرتب‌سازی پیش‌فرض" },
  { value: "price-asc", label: "قیمت: افزایش" },
  { value: "price-desc", label: "قیمت: کاهش" },
  { value: "name", label: "نام محصول" },
];

function formatPrice(value: number) {
  return `${value.toLocaleString("fa-IR")} تومان`;
}

function ProductCard({ product }: { product: Product }) {
  const category = productCategories.find(
    (item) => item.slug === product.categorySlug,
  );

  return (
    <article className="flex flex-col rounded-xl border border-border bg-surface p-6">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          {category?.name ?? "عمومی"}
        </span>
        {product.isBestSeller ? (
          <span className="inline-flex items-center rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary">
            پرفروش
          </span>
        ) : null}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">
        <Link href={`/products/${product.slug}`} className="hover:text-primary">
          {product.name}
        </Link>
      </h3>
      <p className="mt-2 text-sm leading-7 text-muted-foreground">
        {product.brand} — {product.description}
      </p>
      <div className="mt-6 mt-auto flex items-center justify-between">
        <span className="text-lg font-bold text-primary">
          {product.purchasingMode === "QUOTE"
            ? "قیمت اعتبارنامه‌شده"
            : formatPrice(product.discountedPrice ?? product.price)}
        </span>
        <span className="text-xs text-muted-foreground">
          {product.inventory > 0 ? `${product.inventory} عدد موجود` : "ناموجود"}
        </span>
      </div>
    </article>
  );
}

export function ShopProducts() {
  const [query, setQuery] = useState("");
  const [categorySlug, setCategorySlug] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [purchasingMode, setPurchasingMode] = useState<string>("");
  const [sort, setSort] = useState<SortKey>("featured");
  const [page, setPage] = useState(1);

  const filteredProducts = useMemo(() => {
    const priceLimit = maxPrice ? Number(maxPrice) : Infinity;

    const result = products.filter((product) => {
      const matchesQuery =
        product.name.includes(query) ||
        product.description.includes(query) ||
        product.brand.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = !categorySlug || product.categorySlug === categorySlug;
      const matchesPrice = product.price <= priceLimit;
      const matchesStock = !inStockOnly || product.inventory > 0;
      const matchesMode =
        !purchasingMode || product.purchasingMode === purchasingMode;

      return matchesQuery && matchesCategory && matchesPrice && matchesStock && matchesMode;
    });

    const sorted = [...result];
    if (sort === "price-asc") {
      sorted.sort((a, b) => (a.discountedPrice ?? a.price) - (b.discountedPrice ?? b.price));
    } else if (sort === "price-desc") {
      sorted.sort((a, b) => (b.discountedPrice ?? b.price) - (a.discountedPrice ?? a.price));
    } else if (sort === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name, "fa"));
    }

    return sorted;
  }, [query, categorySlug, maxPrice, inStockOnly, purchasingMode, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function resetFilters() {
    setQuery("");
    setCategorySlug("");
    setMaxPrice("");
    setInStockOnly(false);
    setPurchasingMode("");
    setSort("featured");
    setPage(1);
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
              فروشگاه محصولات
            </h1>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {filteredProducts.length} محصول با شرایط فعلی یافت شد.
            </p>
          </div>
          <button
            type="button"
            onClick={resetFilters}
            className="text-sm font-medium text-primary hover:underline"
          >
            بازنشانی فیلترها
          </button>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <label htmlFor="product-search" className="mb-2 block text-sm font-medium text-foreground">
                جستجو
              </label>
              <input
                id="product-search"
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
                placeholder="نام محصول، برند یا توضیحات"
                className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
              />
            </div>
            <div>
              <label htmlFor="product-category" className="mb-2 block text-sm font-medium text-foreground">
                دسته‌بندی
              </label>
              <select
                id="product-category"
                value={categorySlug}
                onChange={(event) => {
                  setCategorySlug(event.target.value);
                  setPage(1);
                }}
                className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">همه دسته‌بندی‌ها</option>
                {productCategories.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="product-max-price" className="mb-2 block text-sm font-medium text-foreground">
                حداکثر قیمت (تومان)
              </label>
              <input
                id="product-max-price"
                type="number"
                min={0}
                value={maxPrice}
                onChange={(event) => {
                  setMaxPrice(event.target.value);
                  setPage(1);
                }}
                placeholder="مثلاً 5000000"
                className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
              />
            </div>
            <div>
              <label htmlFor="product-sort" className="mb-2 block text-sm font-medium text-foreground">
                مرتب‌سازی
              </label>
              <select
                id="product-sort"
                value={sort}
                onChange={(event) => setSort(event.target.value as SortKey)}
                className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-6 border-t border-border pt-6">
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(event) => {
                  setInStockOnly(event.target.checked);
                  setPage(1);
                }}
                className="h-4 w-4 accent-primary"
              />
              فقط محصولات موجود
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={purchasingMode === "QUOTE"}
                onChange={(event) => {
                  setPurchasingMode(event.target.checked ? "QUOTE" : "");
                  setPage(1);
                }}
                className="h-4 w-4 accent-primary"
              />
              فقط قیمت‌به‌ازای محصولات
            </label>
          </div>
        </div>

        {paginatedProducts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-surface p-12 text-center">
            <PackageSearch className="mx-auto h-12 w-12 text-muted-foreground" aria-hidden="true" />
            <p className="mt-4 text-base font-medium text-foreground">
              هیچ محصولی با شرایط جستجو یافت نشد.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-6 text-sm font-medium text-primary hover:underline"
            >
              بازنشانی فیلترها
            </button>
          </div>
        )}

        {totalPages > 1 ? (
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className={cn(
                "h-10 rounded-md border border-border px-4 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50",
                currentPage === 1 ? "bg-muted text-muted-foreground" : "bg-surface text-foreground",
              )}
            >
              قبلی
            </button>
            <span className="text-sm text-muted-foreground">
              صفحه {currentPage} از {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              className={cn(
                "h-10 rounded-md border border-border px-4 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50",
                currentPage === totalPages ? "bg-muted text-muted-foreground" : "bg-surface text-foreground",
              )}
            >
              بعدی
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
