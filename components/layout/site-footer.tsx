import Link from "next/link";
import { cacheLife } from "next/cache";
import {
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Truck,
  Wrench,
} from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/lib/config/site";
import {
  repairServices,
  type ProductCategory,
  type RepairService,
} from "@/lib/data/catalog";
import { toTelHref, toWhatsAppHref } from "@/lib/utils/format";

type SiteFooterProps = {
  categories: ProductCategory[];
  services?: RepairService[];
};

const quickLinks = [
  { label: "فروشگاه", href: "/shop" },
  { label: "خدمات تعمیر و نصب", href: "/services" },
  { label: "درخواست خدمات", href: "/services/request" },
  { label: "درباره ما", href: "/about" },
  { label: "وبلاگ", href: "/blog" },
  { label: "سوالات متداول", href: "/faq" },
  { label: "قوانین و شرایط خرید", href: "/terms" },
  { label: "حریم خصوصی", href: "/privacy" },
  { label: "تماس با ما", href: "/contact" },
];

const trustItems = [
  {
    icon: Truck,
    title: "ارسال به سراسر ایران",
    description: "هماهنگی روش ارسال پیش از تأیید سفارش",
  },
  {
    icon: Wrench,
    title: "خدمات در قزوین",
    description: "تعمیر، سرویس و نصب با هماهنگی قبلی",
  },
  {
    icon: ShieldCheck,
    title: "مشاوره فنی شفاف",
    description: "بررسی نیاز و اعلام شرایط پیش از خرید",
  },
];

/** Cached so the Persian calendar year is computed at build/revalidation time. */
async function CopyrightYear() {
  "use cache";
  cacheLife("weeks");

  return (
    <>
      {new Intl.DateTimeFormat("fa-IR", { year: "numeric" }).format(
        new Date(),
      )}
    </>
  );
}

export function SiteFooter({
  categories,
  services = repairServices,
}: SiteFooterProps) {
  return (
    <footer className="relative isolate mt-20 overflow-hidden bg-mesh text-primary-foreground">
      <div
        className="pointer-events-none absolute -start-40 -top-52 h-[34rem] w-[34rem] rounded-full bg-secondary/10 blur-[110px]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-l from-transparent via-secondary/60 to-transparent"
        aria-hidden="true"
      />
      <div className="page-container relative">
        <div className="grid gap-4 border-b border-white/10 py-8 sm:grid-cols-3">
          {trustItems.map((item) => (
            <div key={item.title} className="lift-hover flex items-start gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-secondary ring-1 ring-inset ring-white/10">
                <item.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-caption font-bold">{item.title}</p>
                <p className="mt-0.5 text-caption leading-5 text-on-primary-muted">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-10 py-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Logo variant="light" className="w-fit" />
            <p className="mt-5 max-w-sm text-caption leading-8 text-on-primary-muted">
              {siteConfig.tagline} در قزوین؛ از انتخاب و خرید پکیج و رادیاتور تا
              نصب، سرویس دوره‌ای و تأمین قطعات یدکی.
            </p>

            <div className="mt-6 space-y-3 text-caption">
              <a
                href={toTelHref(siteConfig.contact.phone)}
                className="footer-link flex items-center gap-2.5 text-on-primary-muted transition-colors hover:text-secondary"
                dir="ltr"
              >
                <Phone className="h-4 w-4 shrink-0 text-secondary" aria-hidden="true" />
                {siteConfig.contact.phone}
              </a>
              <a
                href={toWhatsAppHref(siteConfig.contact.whatsapp)}
                className="footer-link flex items-center gap-2.5 text-on-primary-muted transition-colors hover:text-secondary"
                dir="ltr"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4 shrink-0 text-secondary" aria-hidden="true" />
                {siteConfig.contact.whatsapp}
              </a>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="footer-link flex items-center gap-2.5 text-on-primary-muted transition-colors hover:text-secondary"
                dir="ltr"
              >
                <Mail className="h-4 w-4 shrink-0 text-secondary" aria-hidden="true" />
                {siteConfig.contact.email}
              </a>
              <p className="flex items-start gap-2.5 text-on-primary-muted">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-secondary" aria-hidden="true" />
                {siteConfig.address.fullAddress}
              </p>
              <p className="flex items-start gap-2.5 text-on-primary-muted">
                <Clock className="mt-1 h-4 w-4 shrink-0 text-secondary" aria-hidden="true" />
                {siteConfig.business.workHours.days}،{" "}
                {siteConfig.business.workHours.hours}
              </p>
            </div>
          </div>

          <nav aria-label="دسته‌بندی محصولات">
            <h2 className="text-sm font-bold">فروشگاه</h2>
            <ul className="mt-4 space-y-2.5">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/categories/${category.slug}`}
                    className="footer-link text-caption text-on-primary-muted transition-colors hover:text-secondary"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/shop"
                  className="text-caption font-semibold text-secondary transition-colors hover:text-secondary-100"
                >
                  همه محصولات
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="خدمات">
            <h2 className="text-sm font-bold">خدمات</h2>
            <ul className="mt-4 space-y-2.5">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href="/services"
                    className="footer-link text-caption text-on-primary-muted transition-colors hover:text-secondary"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="دسترسی سریع">
            <h2 className="text-sm font-bold">دسترسی سریع</h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 sm:grid-cols-1">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="footer-link text-caption text-on-primary-muted transition-colors hover:text-secondary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <Separator className="bg-white/10" />

        <div className="flex flex-col gap-3 py-6 text-caption text-on-primary-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <CopyrightYear /> {siteConfig.name}. تمامی حقوق محفوظ
            است.
          </p>
          <p>
            محتوای نمایشی این نسخه شامل قیمت‌ها و تصاویر محصولات است و پیش از
            عرضه نهایی با اطلاعات واقعی جایگزین می‌شود.
          </p>
        </div>
      </div>
    </footer>
  );
}
