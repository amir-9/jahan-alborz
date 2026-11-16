import "server-only";

import { cache } from "react";
import type { Prisma } from "@/lib/generated/prisma/client";
import { getPrisma, isDatabaseConfigured } from "@/lib/db/prisma";
import {
  blogPosts as demoBlogPosts,
  faqs as demoFaqs,
  productCategories as demoCategories,
  products as demoProducts,
  type BlogPost,
  type BlogSection,
  type Faq,
  type Product,
  type ProductCategory,
  type ProductSpecification,
  type ProductVisual,
} from "@/lib/data/catalog";

/**
 * Catalog data access layer.
 *
 * Public pages read from PostgreSQL when it is configured. The bundled demo
 * catalog is used only as a labelled development fallback when the database is
 * missing or unreachable, so the marketing site can still render before the
 * database is provisioned. Orders never use this fallback.
 */

const VISUALS: ProductVisual[] = [
  "boiler",
  "radiator",
  "parts",
  "installation",
];

function toVisual(value: string | null | undefined): ProductVisual {
  return value && VISUALS.includes(value as ProductVisual)
    ? (value as ProductVisual)
    : "boiler";
}

function toSpecifications(value: Prisma.JsonValue | null): ProductSpecification[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((entry) => {
    if (
      typeof entry === "object" &&
      entry !== null &&
      !Array.isArray(entry) &&
      typeof (entry as Record<string, unknown>).label === "string" &&
      typeof (entry as Record<string, unknown>).value === "string"
    ) {
      const record = entry as Record<string, string>;
      return [{ label: record.label, value: record.value }];
    }

    return [];
  });
}

function toSections(value: Prisma.JsonValue): BlogSection[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((entry) => {
    if (typeof entry !== "object" || entry === null || Array.isArray(entry)) {
      return [];
    }

    const record = entry as Record<string, unknown>;
    const heading = typeof record.heading === "string" ? record.heading : null;
    const paragraphs = Array.isArray(record.paragraphs)
      ? record.paragraphs.filter(
          (paragraph): paragraph is string => typeof paragraph === "string",
        )
      : [];

    return heading ? [{ heading, paragraphs }] : [];
  });
}

type DbProduct = Prisma.ProductGetPayload<{ include: { category: true } }>;

function mapProduct(row: DbProduct): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    categorySlug: row.category?.slug ?? "",
    categoryName: row.category?.name,
    description: row.description,
    brand: row.brand ?? "",
    sku: row.sku ?? "",
    price: Number(row.price),
    discountedPrice: row.discountedPrice
      ? Number(row.discountedPrice)
      : undefined,
    inventory: row.inventory,
    purchasingMode: row.purchasingMode,
    isFeatured: row.isFeatured,
    isBestSeller: row.isBestSeller,
    rating: row.rating,
    reviewCount: row.reviewCount,
    visual: toVisual(row.visual),
    specifications: toSpecifications(row.specifications),
  };
}

async function withCatalogFallback<T>(
  loader: () => Promise<T>,
  fallback: T,
): Promise<T> {
  if (!isDatabaseConfigured()) {
    console.warn(
      "[catalog] DATABASE_URL is not configured; serving labelled demo content.",
    );
    return fallback;
  }

  try {
    return await loader();
  } catch (error) {
    console.error("[catalog] database query failed", error);
    return fallback;
  }
}

export const getCategories = cache(async (): Promise<ProductCategory[]> => {
  return withCatalogFallback(async () => {
    const rows = await getPrisma().productCategory.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    if (rows.length === 0) {
      return [];
    }

    return rows.map((row) => ({
      slug: row.slug,
      name: row.name,
      description: row.description ?? "",
      visual: toVisual(row.visual),
    }));
  }, demoCategories);
});

export const getCategoryBySlug = cache(
  async (slug: string): Promise<ProductCategory | null> => {
    return withCatalogFallback(async () => {
      const row = await getPrisma().productCategory.findFirst({
        where: { slug, isActive: true },
      });

      if (!row) {
        return null;
      }

      return {
        slug: row.slug,
        name: row.name,
        description: row.description ?? "",
        visual: toVisual(row.visual),
      };
    }, demoCategories.find((category) => category.slug === slug) ?? null);
  },
);

export const getProducts = cache(async (): Promise<Product[]> => {
  return withCatalogFallback(async () => {
    const rows = await getPrisma().product.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "asc" }],
    });

    return rows.map(mapProduct);
  }, demoProducts);
});

export const getProductBySlug = cache(
  async (slug: string): Promise<Product | null> => {
    return withCatalogFallback(async () => {
      const row = await getPrisma().product.findFirst({
        where: { slug, isActive: true },
        include: { category: true },
      });

      return row ? mapProduct(row) : null;
    }, demoProducts.find((product) => product.slug === slug) ?? null);
  },
);

export const getProductById = cache(
  async (id: string): Promise<Product | null> => {
    return withCatalogFallback(async () => {
      const row = await getPrisma().product.findFirst({
        where: { id, isActive: true },
        include: { category: true },
      });

      return row ? mapProduct(row) : null;
    }, demoProducts.find((product) => product.id === id) ?? null);
  },
);

export const getBlogPosts = cache(async (): Promise<BlogPost[]> => {
  return withCatalogFallback(async () => {
    const rows = await getPrisma().blogPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
    });

    return rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt ?? "",
      category: row.category ?? "راهنما",
      readTime: row.readTime,
      publishedAt: (row.publishedAt ?? row.createdAt).toISOString(),
      sections: toSections(row.content),
    }));
  }, demoBlogPosts);
});

export const getBlogPostBySlug = cache(
  async (slug: string): Promise<BlogPost | null> => {
    return withCatalogFallback(async () => {
      const row = await getPrisma().blogPost.findFirst({
        where: { slug, isPublished: true },
      });

      if (!row) {
        return null;
      }

      return {
        id: row.id,
        slug: row.slug,
        title: row.title,
        excerpt: row.excerpt ?? "",
        category: row.category ?? "راهنما",
        readTime: row.readTime,
        publishedAt: (row.publishedAt ?? row.createdAt).toISOString(),
        sections: toSections(row.content),
      };
    }, demoBlogPosts.find((post) => post.slug === slug) ?? null);
  },
);

export const getFaqs = cache(async (): Promise<Faq[]> => {
  return withCatalogFallback(async () => {
    const rows = await getPrisma().faq.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    return rows.map((row) => ({
      id: row.id,
      question: row.question,
      answer: row.answer,
    }));
  }, demoFaqs);
});
