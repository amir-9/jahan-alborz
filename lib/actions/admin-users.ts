"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getPrisma } from "@/lib/db/prisma";
import { hashPassword } from "@/lib/auth/password";
import { getAdminActionUser } from "@/lib/auth/session";
import { isAdminRole } from "@/lib/auth/permissions";
import {
  isValidIranMobile,
  normalizeIranMobile,
} from "@/lib/utils/normalize";

export type AdminUserActionResult =
  | { ok: true; message: string }
  | {
      ok: false;
      code:
        | "FORBIDDEN"
        | "INVALID"
        | "NOT_FOUND"
        | "DUPLICATE"
        | "LAST_SUPER_ADMIN"
        | "SELF_PROTECTED"
        | "DB_UNAVAILABLE";
      message: string;
      fieldErrors?: Record<string, string[] | undefined>;
    };

const roleSchema = z.enum([
  "CUSTOMER",
  "SUPER_ADMIN",
  "ADMIN",
  "PRODUCT_MANAGER",
  "ORDER_MANAGER",
  "CONTENT_MANAGER",
  "SERVICE_MANAGER",
]);

const staffSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "نام کارمند را کامل وارد کنید.")
    .max(80, "نام نمی‌تواند بیش از ۸۰ کاراکتر باشد."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "ایمیل را وارد کنید.")
    .email("ایمیل معتبر نیست.")
    .max(160),
  phone: z
    .string()
    .trim()
    .refine((value) => isValidIranMobile(value), {
      message: "شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود.",
    })
    .transform((value) => normalizeIranMobile(value)),
  role: z.enum([
    "SUPER_ADMIN",
    "ADMIN",
    "PRODUCT_MANAGER",
    "ORDER_MANAGER",
    "CONTENT_MANAGER",
    "SERVICE_MANAGER",
  ]),
  password: z
    .string()
    .min(10, "رمز عبور کارکنان باید حداقل ۱۰ کاراکتر باشد.")
    .max(72, "رمز عبور نمی‌تواند بیش از ۷۲ کاراکتر باشد.")
    .refine((value) => /[A-Za-z]/.test(value), {
      message: "رمز عبور باید حداقل یک حرف انگلیسی داشته باشد.",
    })
    .refine((value) => /\d/.test(value), {
      message: "رمز عبور باید حداقل یک رقم داشته باشد.",
    }),
});

function forbidden(): AdminUserActionResult {
  return {
    ok: false,
    code: "FORBIDDEN",
    message: "برای مدیریت کاربران مجوز ندارید.",
  };
}

function refreshUsers() {
  revalidatePath("/admin");
  revalidatePath("/admin/users");
}

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2002"
  );
}

async function countOtherSuperAdmins(excludeUserId: string): Promise<number> {
  return getPrisma().user.count({
    where: {
      role: "SUPER_ADMIN",
      isActive: true,
      id: { not: excludeUserId },
    },
  });
}

export async function updateUserRole(input: {
  userId: string;
  role: string;
}): Promise<AdminUserActionResult> {
  const admin = await getAdminActionUser("users:manage");

  if (!admin) {
    return forbidden();
  }

  const parsedRole = roleSchema.safeParse(input.role);

  if (!input.userId || !parsedRole.success) {
    return {
      ok: false,
      code: "INVALID",
      message: "نقش انتخاب‌شده معتبر نیست.",
    };
  }

  if (input.userId === admin.id) {
    return {
      ok: false,
      code: "SELF_PROTECTED",
      message:
        "نمی‌توانید نقش حساب خودتان را تغییر دهید. این محدودیت برای جلوگیری از قفل‌شدن دسترسی مدیران است.",
    };
  }

  try {
    const prisma = getPrisma();
    const target = await prisma.user.findUnique({
      where: { id: input.userId },
      select: { id: true, role: true, isActive: true },
    });

    if (!target) {
      return { ok: false, code: "NOT_FOUND", message: "کاربر یافت نشد." };
    }

    if (target.role === parsedRole.data) {
      return { ok: true, message: "نقش کاربر تغییری نکرد." };
    }

    if (
      target.role === "SUPER_ADMIN" &&
      target.isActive &&
      parsedRole.data !== "SUPER_ADMIN"
    ) {
      const others = await countOtherSuperAdmins(target.id);

      if (others === 0) {
        return {
          ok: false,
          code: "LAST_SUPER_ADMIN",
          message:
            "این حساب تنها مدیر ارشد فعال است. پیش از تغییر نقش، مدیر ارشد دیگری تعیین کنید.",
        };
      }
    }

    await prisma.user.update({
      where: { id: target.id },
      data: { role: parsedRole.data },
    });

    refreshUsers();

    return {
      ok: true,
      message: isAdminRole(parsedRole.data)
        ? "نقش کاربر به نقش مدیریتی تغییر کرد."
        : "نقش کاربر به مشتری تغییر کرد.",
    };
  } catch (error) {
    console.error("[admin] update user role failed", error);
    return {
      ok: false,
      code: "DB_UNAVAILABLE",
      message: "تغییر نقش کاربر در حال حاضر ممکن نیست.",
    };
  }
}

export async function setUserActive(input: {
  userId: string;
  isActive: boolean;
}): Promise<AdminUserActionResult> {
  const admin = await getAdminActionUser("users:manage");

  if (!admin) {
    return forbidden();
  }

  if (!input.userId) {
    return { ok: false, code: "INVALID", message: "شناسه کاربر معتبر نیست." };
  }

  if (input.userId === admin.id && !input.isActive) {
    return {
      ok: false,
      code: "SELF_PROTECTED",
      message: "نمی‌توانید حساب خودتان را غیرفعال کنید.",
    };
  }

  try {
    const prisma = getPrisma();
    const target = await prisma.user.findUnique({
      where: { id: input.userId },
      select: { id: true, role: true, isActive: true },
    });

    if (!target) {
      return { ok: false, code: "NOT_FOUND", message: "کاربر یافت نشد." };
    }

    if (!input.isActive && target.role === "SUPER_ADMIN" && target.isActive) {
      const others = await countOtherSuperAdmins(target.id);

      if (others === 0) {
        return {
          ok: false,
          code: "LAST_SUPER_ADMIN",
          message:
            "این حساب تنها مدیر ارشد فعال است. پیش از غیرفعال‌سازی، مدیر ارشد دیگری تعیین کنید.",
        };
      }
    }

    await prisma.user.update({
      where: { id: target.id },
      data: { isActive: input.isActive },
    });

    refreshUsers();

    return {
      ok: true,
      message: input.isActive
        ? "حساب کاربر فعال شد."
        : "حساب کاربر غیرفعال شد و دیگر امکان ورود ندارد.",
    };
  } catch (error) {
    console.error("[admin] set user active failed", error);
    return {
      ok: false,
      code: "DB_UNAVAILABLE",
      message: "تغییر وضعیت کاربر در حال حاضر ممکن نیست.",
    };
  }
}

/** Creates an administrator or staff member with an email/password login. */
export async function createStaffUser(
  input: unknown,
): Promise<AdminUserActionResult> {
  const admin = await getAdminActionUser("users:manage");

  if (!admin) {
    return forbidden();
  }

  const parsed = staffSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      code: "INVALID",
      message: "لطفاً خطاهای فرم کارمند را بررسی کنید.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;

  try {
    const prisma = getPrisma();

    const existingPhone = await prisma.user.findUnique({
      where: { phone: data.phone },
      select: { id: true },
    });

    if (existingPhone) {
      return {
        ok: false,
        code: "DUPLICATE",
        message:
          "این شماره موبایل قبلاً در سامانه ثبت شده است. برای ارتقای حساب موجود، نقش آن را از فهرست کاربران تغییر دهید.",
      };
    }

    const passwordHash = await hashPassword(data.password);

    await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        passwordHash,
        role: data.role,
        isActive: true,
      },
    });

    refreshUsers();

    return {
      ok: true,
      message:
        "حساب کارمند ایجاد شد. اطلاعات ورود را از طریق کانال امن به او اطلاع دهید.",
    };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        ok: false,
        code: "DUPLICATE",
        message: "ایمیل یا شماره موبایل قبلاً استفاده شده است.",
      };
    }

    console.error("[admin] create staff failed", error);
    return {
      ok: false,
      code: "DB_UNAVAILABLE",
      message: "ایجاد حساب کارمند در حال حاضر ممکن نیست.",
    };
  }
}
