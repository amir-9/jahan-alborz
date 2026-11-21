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
      <ol className="flex flex-wrap items-center gap-1 text-caption text-muted-foreground">
        <li>
          <Link
            href="/"
            className="transition-colors hover:text-primary focus-visible:outline-none focus-visible:underline"
          >
            خانه
          </Link>
        </li>
        {items.map((item) => (
          <li key={item.name} className="flex items-center gap-1">
            <ChevronLeft className="h-3 w-3 text-muted-foreground/50" aria-hidden="true" />
            {item.href ? (
              <Link
                href={item.href}
                className="transition-colors hover:text-primary focus-visible:outline-none focus-visible:underline"
              >
                {item.name}
              </Link>
            ) : (
              <span className="font-medium text-foreground" aria-current="page">
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
