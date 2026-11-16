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
        "group flex h-full flex-col rounded-2xl border border-border bg-surface p-6 shadow-soft",
        "transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lift",
        className,
      )}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-secondary">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>

      <h3 className="mt-5 text-base font-bold text-primary">{service.name}</h3>
      <p className="mt-2 text-[13px] leading-7 text-muted-foreground">
        {service.description}
      </p>

      {showFeatures ? (
        <ul className="mt-4 space-y-2">
          {service.features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-2 text-[12px] text-muted-foreground"
            >
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" aria-hidden="true" />
              {feature}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-auto pt-5">
        <Link
          href="/services/request"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary transition-colors hover:text-secondary-600 focus-visible:outline-none focus-visible:underline"
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
