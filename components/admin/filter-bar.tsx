import type { ReactNode } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { formatNumber } from "@/lib/utils/format";

type AdminFilterBarProps = {
  action: string;
  searchName?: string;
  searchValue?: string;
  searchPlaceholder?: string;
  resetHref: string;
  children?: ReactNode;
};

/**
 * Native GET form so filters work without client JavaScript and remain
 * bookmarkable/shareable. Search is a normal query parameter.
 */
export function AdminFilterBar({
  action,
  searchName = "search",
  searchValue,
  searchPlaceholder = "جستجو...",
  resetHref,
  children,
}: AdminFilterBarProps) {
  return (
    <form
      method="get"
      action={action}
      className="flex flex-wrap items-end gap-2 rounded-2xl border border-border bg-surface p-3 shadow-soft"
    >
      <label className="flex min-w-[12rem] flex-1 flex-col gap-1">
        <span className="text-caption font-semibold text-muted-foreground">
          جستجو
        </span>
        <span className="relative">
          <Search
            className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="search"
            name={searchName}
            defaultValue={searchValue ?? ""}
            placeholder={searchPlaceholder}
            className="h-10 w-full rounded-xl border border-input bg-surface px-3 pe-9 text-caption text-foreground shadow-sm transition-colors placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10"
          />
        </span>
      </label>

      {children}

      <button
        type="submit"
        className="h-10 rounded-xl bg-primary px-4 text-caption font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        اعمال فیلتر
      </button>

      <Link
        href={resetHref}
        className="inline-flex h-10 items-center rounded-xl px-3 text-caption font-semibold text-muted-foreground transition-colors hover:text-primary"
      >
        حذف فیلترها
      </Link>
    </form>
  );
}

type AdminSelectFilterProps = {
  name: string;
  label: string;
  value?: string;
  options: { value: string; label: string }[];
};

export function AdminSelectFilter({
  name,
  label,
  value,
  options,
}: AdminSelectFilterProps) {
  return (
    <label className="flex min-w-[9rem] flex-col gap-1">
      <span className="text-caption font-semibold text-muted-foreground">
        {label}
      </span>
      <select
        name={name}
        defaultValue={value ?? ""}
        className="h-10 w-full rounded-xl border border-input bg-surface px-3 text-caption text-foreground shadow-sm focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10"
      >
        <option value="">همه</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

type AdminPaginationProps = {
  basePath: string;
  params: Record<string, string | undefined>;
  page: number;
  pageCount: number;
  total: number;
};

export function AdminPagination({
  basePath,
  params,
  page,
  pageCount,
  total,
}: AdminPaginationProps) {
  if (pageCount <= 1) {
    return (
      <p className="text-caption text-muted-foreground">
        {total > 0 ? `${formatNumber(total)} مورد` : "موردی یافت نشد"}
      </p>
    );
  }

  function hrefFor(target: number) {
    const search = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
      if (value && key !== "page") {
        search.set(key, value);
      }
    }

    search.set("page", String(target));

    return `${basePath}?${search.toString()}`;
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-caption text-muted-foreground">
        {formatNumber(total)} مورد · صفحه {formatNumber(page)} از{" "}
        {formatNumber(pageCount)}
      </p>
      <div className="flex items-center gap-2">
        {page > 1 ? (
          <Link
            href={hrefFor(page - 1)}
            className="inline-flex h-8 items-center rounded-lg border border-border px-3 text-caption font-semibold text-foreground hover:border-primary/30 hover:text-primary"
          >
            صفحه قبل
          </Link>
        ) : null}
        {page < pageCount ? (
          <Link
            href={hrefFor(page + 1)}
            className="inline-flex h-8 items-center rounded-lg border border-border px-3 text-caption font-semibold text-foreground hover:border-primary/30 hover:text-primary"
          >
            صفحه بعد
          </Link>
        ) : null}
      </div>
    </div>
  );
}
