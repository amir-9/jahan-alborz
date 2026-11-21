import type { ProductVisual as ProductVisualVariant } from "@/lib/data/catalog";

/**
 * Local, royalty-free sample photography for the catalogue.
 *
 * These are illustrative stock photos, NOT photographs of the actual goods on
 * sale. The wording of every `alt` value deliberately says "نمونه" (sample) so
 * the site never implies that a specific item or brand is pictured. No database
 * or schema changes are involved.
 */

export type CatalogMedia = {
  src: string;
  alt: string;
};

const productMedia: Record<ProductVisualVariant, CatalogMedia> = {
  boiler: {
    src: "/images/products/boiler.jpg",
    alt: "تصویر نمونه از یک پکیج دیواری",
  },
  radiator: {
    src: "/images/products/radiator.jpg",
    alt: "تصویر نمونه از یک رادیاتور پنلی",
  },
  parts: {
    src: "/images/products/parts.jpg",
    alt: "تصویر نمونه از قطعات و اتصالات گرمایشی",
  },
  installation: {
    src: "/images/products/installation.jpg",
    alt: "تصویر نمونه از نصب تجهیزات گرمایشی",
  },
};

const categoryMedia: Record<string, CatalogMedia> = {
  pki: {
    src: "/images/categories/boilers.jpg",
    alt: "تصویر نمونه از انواع پکیج گرمایشی",
  },
  radiator: {
    src: "/images/categories/radiators.jpg",
    alt: "تصویر نمونه از انواع رادیاتور",
  },
  "spare-parts": {
    src: "/images/categories/parts.jpg",
    alt: "تصویر نمونه از قطعات یدکی گرمایشی",
  },
  installation: {
    src: "/images/products/installation.jpg",
    alt: "تصویر نمونه از ابزار و لوازم نصب",
  },
};

export const heroMedia: CatalogMedia = {
  src: "/images/hero-installation.jpg",
  alt: "تصویر نمونه از تکنسین در حال سرویس سیستم گرمایشی",
};

export function getProductMedia(variant: ProductVisualVariant): CatalogMedia {
  return productMedia[variant] ?? productMedia.boiler;
}

export function getCategoryMedia(slug: string): CatalogMedia {
  return categoryMedia[slug] ?? getProductMedia("boiler");
}
