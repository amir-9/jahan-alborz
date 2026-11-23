import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { ArrowLeft, Headset, PackageCheck, Truck } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { ShopCatalog } from "@/components/shop/shop-catalog";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/lib/config/site";
import {
  getCategories,
  getProducts,
} from "@/lib/data/catalog-repository";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { toTelHref } from "@/lib/utils/format";

export const metadata: Metadata = buildPageMetadata({
  title: "فروشگاه",
  description:
    "فروشگاه جهان البرز؛ خرید پکیج، رادیاتور، قطعات یدکی و لوازم نصب تجهیزات گرمایشی با ارسال به سراسر ایران.",
  path: "/shop",
});

const shopHighlights = [
  { icon: Truck, label: "ارسال به سراسر ایران" },
  { icon: PackageCheck, label: "تأمین قطعات یدکی" },
  { icon: Headset, label: "مشاوره پیش از خرید" },
];

/** Product filters and results are read from the database per request. */
export const instant = false;

export default async function ShopPage() {
  await connection();

  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <div className="pb-16">
      <PageHero
        items={[{ name: "فروشگاه" }]}
        eyebrow={
          <>
            <Badge variant="secondary">فروشگاه آنلاین</Badge>
            <Badge variant="outline">به‌روزرسانی موجودی</Badge>
          </>
        }
        title="تجهیزات گرمایشی، با مشاوره پیش از خرید"
        description="پکیج، رادیاتور، قطعات یدکی و لوازم نصب را بررسی کنید. اگر در انتخاب ظرفیت یا سازگاری قطعه مطمئن نیستید، پیش از ثبت سفارش با ما تماس بگیرید."
        side={
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-caption text-muted-foreground">
            {shopHighlights.map((item) => (
              <span key={item.label} className="inline-flex items-center gap-1.5">
                <item.icon className="h-4 w-4 text-secondary" aria-hidden="true" />
                {item.label}
              </span>
            ))}
          </div>
        }
      />

      <div className="page-container">
        <div className="mt-8">
          <ShopCatalog products={products} categories={categories} />
        </div>

        <div className="lift-hover mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl border border-border bg-surface p-6 shadow-soft sm:flex-row sm:items-center">
          <div>
            <h2 className="text-sm font-bold text-foreground">
              محصول مورد نظر را پیدا نکردید؟
            </h2>
            <p className="mt-1.5 text-caption leading-6 text-muted-foreground">
              برای استعلام مدل، ظرفیت یا موجودی قطعات با فروشگاه تماس بگیرید.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href={toTelHref(siteConfig.contact.phone)}
              className="pressable inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary-600"
              dir="ltr"
            >
              {siteConfig.contact.phone}
            </a>
            <Link
              href="/contact"
              className="pressable inline-flex h-10 items-center gap-1.5 rounded-xl border border-border px-4 text-xs font-semibold text-foreground transition-colors hover:border-primary/30 hover:text-primary"
            >
              تماس با ما
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
