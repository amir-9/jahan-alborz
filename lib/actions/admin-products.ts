"use server";

import { revalidatePath } from "next/cache";
import { getPrisma } from "@/lib/db/prisma";
import { getAdminActionUser } from "@/lib/auth/session";
import { adminProductSchema } from "@/lib/validation/admin-product";
import { z } from "zod";

export type AdminProductActionResult =
  | { ok: true; message: string; productId?: string }
  | {
      ok: false;
      code: "FORBIDDEN" | "INVALID" | "NOT_FOUND" | "DUPLICATE" | "DB_UNAVAILABLE";
      message: string;
      fieldErrors?: Record<string, string[] | undefined>;
    };

const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "نام دسته را کامل وارد کنید.")
    .max(80, "نام دسته بیش از حد طولانی است."),
  slug: z
    .string()
    .trim()
    .min(2, "نامک دسته را وارد کنید.")
    .max(80, "نامک دسته بیش از حد طولانی است.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "نامک فقط می‌تواند شامل حروف کوچک انگلیسی، رقم و خط تیره باشد.",
    ),
  description: z
    .string()
    .trim()
    .max(300, "توضیح دسته بیش از حد طولانی است.")
    .optional(),
  visual: z.enum(["boiler", "radiator", "parts", "installation"], {
    message: "تصویر شماتیک را انتخاب کنید.",
  }),
});

function forbidden(): AdminProductActionResult {
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

function refreshProducts(productId?: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
  revalidatePath("/categories");

  if (productId) {
    revalidatePath(`/admin/products/${productId}`);
  }

  revalidatePath("/products/[slug]", "page");
}

export async function createProduct(
  input: unknown,
): Promise<AdminProductActionResult> {
  const admin = await getAdminActionUser("products:write");

  if (!admin) {
    return forbidden();
  }

  const parsed = adminProductSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      code: "INVALID",
      message: "لطفاً خطاهای فرم محصول را بررسی کنید.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;

  if (data.discountedPrice != null && data.discountedPrice >= data.price) {
    return {
      ok: false,
      code: "INVALID",
      message: "قیمت با تخفیف باید کمتر از قیمت اصلی باشد.",
      fieldErrors: { discountedPrice: ["قیمت با تخفیف باید کمتر از قیمت اصلی باشد."] },
    };
  }

  try {
    const product = await getPrisma().product.create({
      data: {
        name: data.name,
        slug: data.slug,
        categoryId: data.categoryId || null,
        description: data.description,
        brand: data.brand || null,
        sku: data.sku || null,
        price: data.price,
        discountedPrice: data.discountedPrice ?? null,
        inventory: data.inventory,
        purchasingMode: data.purchasingMode,
        visual: data.visual,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        isBestSeller: data.isBestSeller,
      },
      select: { id: true },
    });

    refreshProducts(product.id);

    return { ok: true, message: "محصول ایجاد شد.", productId: product.id };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        ok: false,
        code: "DUPLICATE",
        message:
          "نامک یا کد کالا قبلاً استفاده شده است. مقدار یکتای دیگری وارد کنید.",
      };
    }

    console.error("[admin] create product failed", error);
    return {
      ok: false,
      code: "DB_UNAVAILABLE",
      message: "ایجاد محصول در حال حاضر ممکن نیست.",
    };
  }
}

export async function updateProduct(
  input: unknown & { productId?: string },
): Promise<AdminProductActionResult> {
  const admin = await getAdminActionUser("products:write");

  if (!admin) {
    return forbidden();
  }

  const raw = input as { productId?: unknown } | null | undefined;
  const productId = typeof raw?.productId === "string" ? raw.productId : "";

  if (!productId) {
    return { ok: false, code: "INVALID", message: "شناسه محصول معتبر نیست." };
  }

  const parsed = adminProductSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      code: "INVALID",
      message: "لطفاً خطاهای فرم محصول را بررسی کنید.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;

  if (data.discountedPrice != null && data.discountedPrice >= data.price) {
    return {
      ok: false,
      code: "INVALID",
      message: "قیمت با تخفیف باید کمتر از قیمت اصلی باشد.",
      fieldErrors: { discountedPrice: ["قیمت با تخفیف باید کمتر از قیمت اصلی باشد."] },
    };
  }

  try {
    const prisma = getPrisma();
    const existing = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });

    if (!existing) {
      return { ok: false, code: "NOT_FOUND", message: "محصول یافت نشد." };
    }

    await prisma.product.update({
      where: { id: productId },
      data: {
        name: data.name,
        slug: data.slug,
        categoryId: data.categoryId || null,
        description: data.description,
        brand: data.brand || null,
        sku: data.sku || null,
        price: data.price,
        discountedPrice: data.discountedPrice ?? null,
        inventory: data.inventory,
        purchasingMode: data.purchasingMode,
        visual: data.visual,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        isBestSeller: data.isBestSeller,
      },
    });

    refreshProducts(productId);

    return { ok: true, message: "تغییرات محصول ذخیره شد.", productId };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        ok: false,
        code: "DUPLICATE",
        message:
          "نامک یا کد کالا قبلاً استفاده شده است. مقدار یکتای دیگری وارد کنید.",
      };
    }

    console.error("[admin] update product failed", error);
    return {
      ok: false,
      code: "DB_UNAVAILABLE",
      message: "ذخیره تغییرات محصول در حال حاضر ممکن نیست.",
    };
  }
}

export async function toggleProductActive(input: {
  productId: string;
  isActive: boolean;
}): Promise<AdminProductActionResult> {
  const admin = await getAdminActionUser("products:write");

  if (!admin) {
    return forbidden();
  }

  if (!input.productId) {
    return { ok: false, code: "INVALID", message: "شناسه محصول معتبر نیست." };
  }

  try {
    const result = await getPrisma().product.updateMany({
      where: { id: input.productId },
      data: { isActive: input.isActive },
    });

    if (result.count === 0) {
      return { ok: false, code: "NOT_FOUND", message: "محصول یافت نشد." };
    }

    refreshProducts(input.productId);

    return {
      ok: true,
      message: input.isActive
        ? "محصول در فروشگاه نمایش داده می‌شود."
        : "محصول از فروشگاه پنهان شد.",
    };
  } catch (error) {
    console.error("[admin] toggle product failed", error);
    return {
      ok: false,
      code: "DB_UNAVAILABLE",
      message: "تغییر وضعیت محصول در حال حاضر ممکن نیست.",
    };
  }
}

/**
 * Products are soft-deleted so historical order lines keep a valid reference
 * and stock/cart state cannot silently change. The record stays in the admin
 * list marked as hidden.
 */
export async function softDeleteProduct(
  productId: string,
): Promise<AdminProductActionResult> {
  const admin = await getAdminActionUser("products:write");

  if (!admin) {
    return forbidden();
  }

  if (!productId) {
    return { ok: false, code: "INVALID", message: "شناسه محصول معتبر نیست." };
  }

  try {
    const prisma = getPrisma();
    const result = await prisma.product.updateMany({
      where: { id: productId },
      data: { isActive: false, isFeatured: false, isBestSeller: false },
    });

    if (result.count === 0) {
      return { ok: false, code: "NOT_FOUND", message: "محصول یافت نشد." };
    }

    refreshProducts(productId);

    return {
      ok: true,
      message:
        "محصول از فروشگاه حذف شد. سوابق سفارش‌های قبلی حفظ می‌شود و امکان بازگردانی وجود دارد.",
    };
  } catch (error) {
    console.error("[admin] soft delete product failed", error);
    return {
      ok: false,
      code: "DB_UNAVAILABLE",
      message: "حذف محصول در حال حاضر ممکن نیست.",
    };
  }
}

export async function createCategory(
  input: unknown,
): Promise<AdminProductActionResult> {
  const admin = await getAdminActionUser("products:write");

  if (!admin) {
    return forbidden();
  }

  const parsed = categorySchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      code: "INVALID",
      message: "لطفاً خطاهای فرم دسته‌بندی را بررسی کنید.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;

  try {
    const prisma = getPrisma();
    const maxSort = await prisma.productCategory.aggregate({
      _max: { sortOrder: true },
    });

    await prisma.productCategory.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        visual: data.visual,
        sortOrder: (maxSort._max.sortOrder ?? 0) + 1,
      },
    });

    refreshProducts();

    return { ok: true, message: "دسته‌بندی ایجاد شد." };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        ok: false,
        code: "DUPLICATE",
        message: "نام یا نامک دسته قبلاً استفاده شده است.",
      };
    }

    console.error("[admin] create category failed", error);
    return {
      ok: false,
      code: "DB_UNAVAILABLE",
      message: "ایجاد دسته‌بندی در حال حاضر ممکن نیست.",
    };
  }
}

export async function toggleCategoryActive(input: {
  categoryId: string;
  isActive: boolean;
}): Promise<AdminProductActionResult> {
  const admin = await getAdminActionUser("products:write");

  if (!admin) {
    return forbidden();
  }

  if (!input.categoryId) {
    return { ok: false, code: "INVALID", message: "شناسه دسته معتبر نیست." };
  }

  try {
    const result = await getPrisma().productCategory.updateMany({
      where: { id: input.categoryId },
      data: { isActive: input.isActive },
    });

    if (result.count === 0) {
      return { ok: false, code: "NOT_FOUND", message: "دسته یافت نشد." };
    }

    refreshProducts();

    return {
      ok: true,
      message: input.isActive
        ? "دسته‌بندی فعال شد."
        : "دسته‌بندی غیرفعال شد. محصولات آن در فهرست دسته‌ها نمایش داده نمی‌شوند.",
    };
  } catch (error) {
    console.error("[admin] toggle category failed", error);
    return {
      ok: false,
      code: "DB_UNAVAILABLE",
      message: "تغییر وضعیت دسته در حال حاضر ممکن نیست.",
    };
  }
}
