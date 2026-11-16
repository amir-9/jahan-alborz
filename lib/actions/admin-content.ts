"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getPrisma } from "@/lib/db/prisma";
import { getAdminActionUser } from "@/lib/auth/session";
import {
  adminBlogPostSchema,
  adminFaqSchema,
} from "@/lib/validation/admin-content";

export type AdminContentActionResult =
  | { ok: true; message: string; id?: string }
  | {
      ok: false;
      code: "FORBIDDEN" | "INVALID" | "NOT_FOUND" | "DUPLICATE" | "DB_UNAVAILABLE";
      message: string;
      fieldErrors?: Record<string, string[] | undefined>;
    };

function forbidden(): AdminContentActionResult {
  return {
    ok: false,
    code: "FORBIDDEN",
    message: "برای انجام این عملیات مجوز ندارید.",
  };
}

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2002"
  );
}

function refreshContent(slug?: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/faq");
  revalidatePath("/admin/blog");
  revalidatePath("/faq");
  revalidatePath("/blog");
  revalidatePath("/");

  if (slug) {
    revalidatePath(`/blog/${slug}`);
  }

  revalidatePath("/blog/[slug]", "page");
}

export async function saveFaq(
  input: unknown & { faqId?: string },
): Promise<AdminContentActionResult> {
  const admin = await getAdminActionUser("content:write");

  if (!admin) {
    return forbidden();
  }

  const raw = input as { faqId?: unknown } | null | undefined;
  const faqId = typeof raw?.faqId === "string" ? raw.faqId : undefined;

  const parsed = adminFaqSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      code: "INVALID",
      message: "لطفاً خطاهای فرم سوال متداول را بررسی کنید.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;

  try {
    if (faqId) {
      const updated = await getPrisma().faq.updateMany({
        where: { id: faqId },
        data: {
          question: data.question,
          answer: data.answer,
          category: data.category || null,
          sortOrder: data.sortOrder,
          isActive: data.isActive,
        },
      });

      if (updated.count === 0) {
        return { ok: false, code: "NOT_FOUND", message: "سوال یافت نشد." };
      }

      refreshContent();

      return { ok: true, message: "سوال متداول ذخیره شد.", id: faqId };
    }

    const created = await getPrisma().faq.create({
      data: {
        question: data.question,
        answer: data.answer,
        category: data.category || null,
        sortOrder: data.sortOrder,
        isActive: data.isActive,
      },
      select: { id: true },
    });

    refreshContent();

    return { ok: true, message: "سوال متداول ایجاد شد.", id: created.id };
  } catch (error) {
    console.error("[admin] save faq failed", error);
    return {
      ok: false,
      code: "DB_UNAVAILABLE",
      message: "ذخیره سوال در حال حاضر ممکن نیست.",
    };
  }
}

export async function setFaqActive(
  input: unknown & { faqId?: string; isActive?: boolean },
): Promise<AdminContentActionResult> {
  const admin = await getAdminActionUser("content:write");

  if (!admin) {
    return forbidden();
  }

  const parsed = z
    .object({
      faqId: z.string().min(1),
      isActive: z.boolean(),
    })
    .safeParse(input);

  if (!parsed.success) {
    return { ok: false, code: "INVALID", message: "درخواست معتبر نیست." };
  }

  try {
    const updated = await getPrisma().faq.updateMany({
      where: { id: parsed.data.faqId },
      data: { isActive: parsed.data.isActive },
    });

    if (updated.count === 0) {
      return { ok: false, code: "NOT_FOUND", message: "سوال یافت نشد." };
    }

    refreshContent();

    return {
      ok: true,
      message: parsed.data.isActive
        ? "سوال در صفحه سوالات متداول نمایش داده می‌شود."
        : "سوال از صفحه سوالات متداول پنهان شد.",
    };
  } catch (error) {
    console.error("[admin] toggle faq failed", error);
    return {
      ok: false,
      code: "DB_UNAVAILABLE",
      message: "تغییر وضعیت سوال در حال حاضر ممکن نیست.",
    };
  }
}

export async function saveBlogPost(
  input: unknown & { postId?: string },
): Promise<AdminContentActionResult> {
  const admin = await getAdminActionUser("content:write");

  if (!admin) {
    return forbidden();
  }

  const raw = input as { postId?: unknown } | null | undefined;
  const postId = typeof raw?.postId === "string" ? raw.postId : undefined;

  const parsed = adminBlogPostSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      code: "INVALID",
      message: "لطفاً خطاهای فرم مطلب را بررسی کنید.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;
  const sections = data.sections.map((section) => ({
    heading: section.heading,
    paragraphs: section.paragraphs,
  }));

  try {
    if (postId) {
      const existing = await getPrisma().blogPost.findUnique({
        where: { id: postId },
        select: { id: true, publishedAt: true },
      });

      if (!existing) {
        return { ok: false, code: "NOT_FOUND", message: "مطلب یافت نشد." };
      }

      await getPrisma().blogPost.update({
        where: { id: postId },
        data: {
          slug: data.slug,
          title: data.title,
          excerpt: data.excerpt,
          category: data.category || null,
          readTime: data.readTime,
          author: data.author || null,
          content: sections,
          isPublished: data.isPublished,
          publishedAt: data.isPublished
            ? (existing.publishedAt ?? new Date())
            : existing.publishedAt,
        },
      });

      refreshContent(data.slug);

      return { ok: true, message: "مطلب ذخیره شد.", id: postId };
    }

    const created = await getPrisma().blogPost.create({
      data: {
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt,
        category: data.category || null,
        readTime: data.readTime,
        author: data.author || null,
        content: sections,
        isPublished: data.isPublished,
        publishedAt: data.isPublished ? new Date() : null,
      },
      select: { id: true },
    });

    refreshContent(data.slug);

    return { ok: true, message: "مطلب ایجاد شد.", id: created.id };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        ok: false,
        code: "DUPLICATE",
        message: "این نامک قبلاً برای مطلب دیگری استفاده شده است.",
        fieldErrors: { slug: ["این نامک قبلاً استفاده شده است."] },
      };
    }

    console.error("[admin] save blog post failed", error);
    return {
      ok: false,
      code: "DB_UNAVAILABLE",
      message: "ذخیره مطلب در حال حاضر ممکن نیست.",
    };
  }
}

export async function setBlogPublished(
  input: unknown & { postId?: string; isPublished?: boolean },
): Promise<AdminContentActionResult> {
  const admin = await getAdminActionUser("content:write");

  if (!admin) {
    return forbidden();
  }

  const parsed = z
    .object({
      postId: z.string().min(1),
      isPublished: z.boolean(),
    })
    .safeParse(input);

  if (!parsed.success) {
    return { ok: false, code: "INVALID", message: "درخواست معتبر نیست." };
  }

  try {
    const existing = await getPrisma().blogPost.findUnique({
      where: { id: parsed.data.postId },
      select: { id: true, slug: true, publishedAt: true },
    });

    if (!existing) {
      return { ok: false, code: "NOT_FOUND", message: "مطلب یافت نشد." };
    }

    await getPrisma().blogPost.update({
      where: { id: existing.id },
      data: {
        isPublished: parsed.data.isPublished,
        publishedAt: parsed.data.isPublished
          ? (existing.publishedAt ?? new Date())
          : existing.publishedAt,
      },
    });

    refreshContent(existing.slug);

    return {
      ok: true,
      message: parsed.data.isPublished
        ? "مطلب در وبلاگ منتشر شد."
        : "مطلب از وبلاگ برداشته شد.",
    };
  } catch (error) {
    console.error("[admin] toggle blog publish failed", error);
    return {
      ok: false,
      code: "DB_UNAVAILABLE",
      message: "تغییر وضعیت انتشار در حال حاضر ممکن نیست.",
    };
  }
}
