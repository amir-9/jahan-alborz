import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type BreadcrumbItem = {
  name: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="مسیر صفحه" className={cn(className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-caption text-muted-foreground">
        <li>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg px-1.5 py-1 transition-colors hover:bg-primary-50 hover:text-primary focus-visible:outline-none focus-visible:underline"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-secondary" aria-hidden="true" />
            خانه
          </Link>
        </li>
        {items.map((item) => (
          <li key={item.name} className="flex items-center gap-1.5">
            <ChevronLeft className="h-3 w-3 text-muted-foreground/50" aria-hidden="true" />
            {item.href ? (
              <Link
                href={item.href}
                className="rounded-lg px-1.5 py-1 transition-colors hover:bg-primary-50 hover:text-primary focus-visible:outline-none focus-visible:underline"
              >
                {item.name}
              </Link>
            ) : (
              <span className="rounded-lg bg-primary-50/70 px-2 py-1 font-semibold text-primary" aria-current="page">
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
