import Link from "next/link";
import { Flame } from "lucide-react";
import { siteConfig } from "@/lib/config/site";

const quickLinks = [
  { label: "فروشگاه", href: "/shop" },
  { label: "خدمات تعمیر", href: "/services" },
  { label: "سفارش تعمیر", href: "/services/request" },
  { label: "درباره ما", href: "/about" },
  { label: "تماس با ما", href: "/contact" },
];

const serviceLinks = [
  { label: "تعمیر پکیج", href: "/services" },
  { label: "سرویس دوره‌ای پکیج", href: "/services" },
  { label: "نصب پکیج و رادیاتور", href: "/services" },
  { label: "رسوب‌زدایی و اسیدشویی", href: "/services" },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="h-6 w-6 text-secondary" aria-hidden="true" />
              <span className="text-lg font-bold text-primary sm:text-xl">
                {siteConfig.name}
              </span>
            </div>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              {siteConfig.tagline}. فروشگاه تخصصی تجهیزات گرمایشی و خدمات
              تعمیر و نگهداری در قزوین.
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-foreground">
              لینک‌های سریع
            </h3>
            <ul className="mt-4 flex flex-col gap-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-base font-semibold text-foreground">
              خدمات ما
            </h3>
            <ul className="mt-4 flex flex-col gap-2">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <p className="text-sm text-muted-foreground">
            {siteConfig.address.fullAddress} — تلفن:{" "}
            {siteConfig.contact.phone} — ایمیل:{" "}
            {siteConfig.contact.email}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            تمامی محتواها به‌صورت نمونه (Demo) در این مرحله اولیه طراحی سایت هستند.
          </p>
        </div>
      </div>
    </footer>
  );
}
