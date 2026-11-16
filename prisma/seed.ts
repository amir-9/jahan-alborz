/**
 * Seeds the database with the demo content that ships with the site.
 *
 * Demo products, articles and reviews are clearly illustrative. The script is
 * idempotent and can be run repeatedly with `npm run db:seed`.
 */
import path from "node:path";
import dotenv from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Prisma } from "../lib/generated/prisma/client";
import {
  blogPosts,
  faqs,
  productCategories,
  products,
} from "../lib/data/catalog";
import { hashPassword } from "../lib/auth/password";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to seed the database.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function seedCategories() {
  for (const [index, category] of productCategories.entries()) {
    await prisma.productCategory.upsert({
      where: { slug: category.slug },
      create: {
        name: category.name,
        slug: category.slug,
        description: category.description,
        visual: category.visual,
        sortOrder: index,
      },
      update: {
        name: category.name,
        description: category.description,
        visual: category.visual,
        sortOrder: index,
      },
    });
  }

  console.info(`[seed] ${productCategories.length} categories`);
}

async function seedProducts() {
  const categories = await prisma.productCategory.findMany({
    select: { id: true, slug: true },
  });
  const categoryIds = new Map(
    categories.map((category) => [category.slug, category.id]),
  );

  for (const product of products) {
    const data = {
      categoryId: categoryIds.get(product.categorySlug) ?? null,
      name: product.name,
      slug: product.slug,
      description: product.description,
      brand: product.brand,
      sku: product.sku,
      price: new Prisma.Decimal(product.price),
      discountedPrice: product.discountedPrice
        ? new Prisma.Decimal(product.discountedPrice)
        : null,
      inventory: product.inventory,
      purchasingMode: product.purchasingMode,
      isActive: true,
      isFeatured: product.isFeatured,
      isBestSeller: product.isBestSeller,
      visual: product.visual,
      rating: product.rating,
      reviewCount: product.reviewCount,
      specifications: product.specifications as unknown as Prisma.InputJsonValue,
    };

    await prisma.product.upsert({
      where: { slug: product.slug },
      create: { id: product.id, ...data },
      update: data,
    });
  }

  console.info(`[seed] ${products.length} products`);
}

async function seedBlogPosts() {
  for (const post of blogPosts) {
    const content = post.sections as unknown as Prisma.InputJsonValue;

    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      create: {
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        category: post.category,
        readTime: post.readTime,
        content,
        author: "جهان البرز",
        isPublished: true,
        publishedAt: new Date(`${post.publishedAt}T09:00:00Z`),
      },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        category: post.category,
        readTime: post.readTime,
        content,
        isPublished: true,
        publishedAt: new Date(`${post.publishedAt}T09:00:00Z`),
      },
    });
  }

  console.info(`[seed] ${blogPosts.length} blog posts`);
}

async function seedFaqs() {
  for (const [index, faq] of faqs.entries()) {
    const existing = await prisma.faq.findFirst({
      where: { question: faq.question },
      select: { id: true },
    });

    if (existing) {
      await prisma.faq.update({
        where: { id: existing.id },
        data: { answer: faq.answer, sortOrder: index },
      });
    } else {
      await prisma.faq.create({
        data: {
          id: faq.id,
          question: faq.question,
          answer: faq.answer,
          sortOrder: index,
        },
      });
    }
  }

  console.info(`[seed] ${faqs.length} FAQ entries`);
}

async function seedSettings() {
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      phone: process.env.NEXT_PUBLIC_PHONE ?? null,
      whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? null,
      email: process.env.NEXT_PUBLIC_EMAIL ?? null,
      address: "خیابان دانشگاه، قزوین، ایران",
      workHours: "شنبه تا پنجشنبه، ۹ تا ۱۹",
    },
    update: {},
  });

  console.info("[seed] site settings");
}

async function seedAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const phone = process.env.SEED_ADMIN_PHONE?.trim();
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !phone || !password) {
    console.info(
      "[seed] skipping administrator (SEED_ADMIN_EMAIL, SEED_ADMIN_PHONE and SEED_ADMIN_PASSWORD are not set)",
    );
    return;
  }

  const passwordHash = await hashPassword(password);

  await prisma.user.upsert({
    where: { email },
    create: {
      name: "مدیر جهان البرز",
      email,
      phone,
      passwordHash,
      role: "SUPER_ADMIN",
    },
    update: {
      phone,
      passwordHash,
      role: "SUPER_ADMIN",
      isActive: true,
    },
  });

  console.info(`[seed] administrator ${email}`);
}

async function main() {
  await seedCategories();
  await seedProducts();
  await seedBlogPosts();
  await seedFaqs();
  await seedSettings();
  await seedAdmin();
  console.info("[seed] done");
}

main()
  .catch((error) => {
    console.error("[seed] failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
