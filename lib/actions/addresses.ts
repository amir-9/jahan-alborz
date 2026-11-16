"use server";

import { revalidatePath } from "next/cache";
import { getPrisma } from "@/lib/db/prisma";
import { toSessionUser } from "@/lib/auth/session";
import { getSession } from "@/lib/auth/session";
import { addressSchema, type AddressInput } from "@/lib/validation/address";

export type AddressActionResult =
  | { ok: true; message: string }
  | {
      ok: false;
      code: "INVALID" | "UNAUTHENTICATED" | "DB_UNAVAILABLE" | "NOT_FOUND";
      message: string;
      fieldErrors?: Record<string, string[] | undefined>;
    };

async function getCurrentUserId(): Promise<string | null> {
  const user = toSessionUser(await getSession());
  return user?.id ?? null;
}

function revalidateAddresses() {
  revalidatePath("/account/addresses");
  revalidatePath("/account");
}

export async function createAddress(
  input: AddressInput,
): Promise<AddressActionResult> {
  const userId = await getCurrentUserId();

  if (!userId) {
    return {
      ok: false,
      code: "UNAUTHENTICATED",
      message: "برای ثبت آدرس باید وارد حساب کاربری شوید.",
    };
  }

  const parsed = addressSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      code: "INVALID",
      message: "لطفاً خطاهای فرم آدرس را بررسی کنید.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;

  try {
    const prisma = getPrisma();
    const existingCount = await prisma.address.count({ where: { userId } });
    const shouldBeDefault = Boolean(data.isDefault) || existingCount === 0;

    await prisma.$transaction(async (tx) => {
      if (shouldBeDefault) {
        await tx.address.updateMany({
          where: { userId },
          data: { isDefault: false },
        });
      }

      await tx.address.create({
        data: {
          userId,
          label: data.label || null,
          recipient: data.recipient,
          phone: data.phone,
          province: data.province,
          city: data.city,
          street: data.street,
          postalCode: data.postalCode || null,
          isDefault: shouldBeDefault,
        },
      });
    });

    revalidateAddresses();

    return { ok: true, message: "آدرس جدید ذخیره شد." };
  } catch (error) {
    console.error("[addresses] create failed", error);
    return {
      ok: false,
      code: "DB_UNAVAILABLE",
      message: "ذخیره آدرس در حال حاضر ممکن نیست. لطفاً دوباره تلاش کنید.",
    };
  }
}

export async function deleteAddress(id: string): Promise<AddressActionResult> {
  const userId = await getCurrentUserId();

  if (!userId) {
    return {
      ok: false,
      code: "UNAUTHENTICATED",
      message: "برای ویرایش آدرس‌ها باید وارد حساب کاربری شوید.",
    };
  }

  if (!id) {
    return { ok: false, code: "NOT_FOUND", message: "آدرس یافت نشد." };
  }

  try {
    const prisma = getPrisma();
    const address = await prisma.address.findFirst({
      where: { id, userId },
      select: { id: true, isDefault: true },
    });

    if (!address) {
      return { ok: false, code: "NOT_FOUND", message: "آدرس یافت نشد." };
    }

    await prisma.$transaction(async (tx) => {
      await tx.address.delete({ where: { id: address.id } });

      if (address.isDefault) {
        const next = await tx.address.findFirst({
          where: { userId },
          orderBy: { createdAt: "desc" },
          select: { id: true },
        });

        if (next) {
          await tx.address.update({
            where: { id: next.id },
            data: { isDefault: true },
          });
        }
      }
    });

    revalidateAddresses();

    return { ok: true, message: "آدرس حذف شد." };
  } catch (error) {
    console.error("[addresses] delete failed", error);
    return {
      ok: false,
      code: "DB_UNAVAILABLE",
      message: "حذف آدرس در حال حاضر ممکن نیست.",
    };
  }
}

export async function setDefaultAddress(
  id: string,
): Promise<AddressActionResult> {
  const userId = await getCurrentUserId();

  if (!userId) {
    return {
      ok: false,
      code: "UNAUTHENTICATED",
      message: "برای ویرایش آدرس‌ها باید وارد حساب کاربری شوید.",
    };
  }

  try {
    const prisma = getPrisma();
    const address = await prisma.address.findFirst({
      where: { id, userId },
      select: { id: true },
    });

    if (!address) {
      return { ok: false, code: "NOT_FOUND", message: "آدرس یافت نشد." };
    }

    await prisma.$transaction(async (tx) => {
      await tx.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
      await tx.address.update({
        where: { id: address.id },
        data: { isDefault: true },
      });
    });

    revalidateAddresses();

    return { ok: true, message: "آدرس پیش‌فرض تغییر کرد." };
  } catch (error) {
    console.error("[addresses] set default failed", error);
    return {
      ok: false,
      code: "DB_UNAVAILABLE",
      message: "تغییر آدرس پیش‌فرض در حال حاضر ممکن نیست.",
    };
  }
}
