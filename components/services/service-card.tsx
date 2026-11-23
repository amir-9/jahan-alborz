import Link from "next/link";
import {
  ArrowLeft,
  Drill,
  Droplets,
  Gauge,
  Search,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { RepairService } from "@/lib/data/catalog";
import { cn } from "@/lib/utils/cn";

const serviceIcons: Record<RepairService["icon"], LucideIcon> = {
  wrench: Wrench,
  gauge: Gauge,
  install: Drill,
  droplets: Droplets,
  search: Search,
};

type ServiceCardProps = {
  service: RepairService;
  className?: string;
  showFeatures?: boolean;
};

export function ServiceCard({
  service,
  className,
  showFeatures = true,
}: ServiceCardProps) {
  const Icon = serviceIcons[service.icon];

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-soft",
        "transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1.5 hover:border-secondary/35 hover:shadow-[0_28px_60px_-34px_rgba(20,45,78,0.55)]",
        className,
      )}
    >
      <span className="absolute -end-8 -top-10 h-28 w-28 rounded-full bg-secondary/10 blur-2xl transition-all duration-500 group-hover:bg-secondary/20" aria-hidden="true" />
      <span className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary transition-all duration-300 group-hover:rotate-3 group-hover:bg-primary group-hover:text-secondary">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>

      <h3 className="relative mt-5 text-base font-bold text-primary">{service.name}</h3>
      <p className="relative mt-2 text-caption leading-7 text-muted-foreground">
        {service.description}
      </p>

      {showFeatures ? (
        <ul className="relative mt-4 space-y-2">
          {service.features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-2 text-caption text-muted-foreground"
            >
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" aria-hidden="true" />
              {feature}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="relative mt-auto pt-5">
        <Link
          href="/services/request"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary transition-colors hover:text-secondary-700 focus-visible:outline-none focus-visible:underline"
        >
          ثبت درخواست
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

export function ServiceIcon({ icon }: { icon: RepairService["icon"] }) {
  const Icon = serviceIcons[icon];
  return <Icon className="h-5 w-5" aria-hidden="true" />;
}

export { serviceIcons };
