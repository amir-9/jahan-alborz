"use server";

import { revalidatePath } from "next/cache";
import { getPrisma } from "@/lib/db/prisma";
import { getAdminActionUser } from "@/lib/auth/session";
import type {
  OrderStatus,
  PaymentStatus,
  ShippingMethod,
} from "@/lib/generated/prisma/enums";

export type AdminActionResult =
  | { ok: true; message: string }
  | {
      ok: false;
      code: "FORBIDDEN" | "INVALID" | "NOT_FOUND" | "DB_UNAVAILABLE";
      message: string;
    };

const ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  "AWAITING_PAYMENT",
  "CONFIRMED",
  "PROCESSING",
  "READY_FOR_SHIPMENT",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

const PAYMENT_STATUSES: PaymentStatus[] = [
  "PENDING",
  "PAID",
  "FAILED",
  "REFUNDED",
];

const SHIPPING_METHODS: ShippingMethod[] = [
  "POST",
  "TIPAX",
  "FREIGHT",
  "LOCAL",
];

function forbidden(): AdminActionResult {
  return {
    ok: false,
    code: "FORBIDDEN",
    message: "برای انجام این عملیات مجوز ندارید.",
  };
}

function refreshOrder(orderId: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/account/orders");
  revalidatePath(`/account/orders/${orderId}`);
}

export async function updateOrderStatus(input: {
  orderId: string;
  status: string;
  note?: string;
}): Promise<AdminActionResult> {
  const admin = await getAdminActionUser("orders:write");

  if (!admin) {
    return forbidden();
  }

  if (!input.orderId || !ORDER_STATUSES.includes(input.status as OrderStatus)) {
    return {
      ok: false,
      code: "INVALID",
      message: "وضعیت انتخاب‌شده معتبر نیست.",
    };
  }

  let note = input.note?.trim();
  if (note && note.length > 300) {
    note = note.slice(0, 300);
  }

  try {
    const prisma = getPrisma();

    await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: input.orderId },
        select: {
          id: true,
          status: true,
          items: { select: { productId: true, quantity: true } },
        },
      });

      if (!order) {
        throw new Error("ORDER_NOT_FOUND");
      }

      const nextStatus = input.status as OrderStatus;

      if (order.status === nextStatus) {
        return;
      }

      if (order.status === "CANCELLED") {
        throw new Error("CANCELLED_ORDER_LOCKED");
      }

      if (nextStatus === "CANCELLED") {
        for (const item of order.items) {
          if (item.productId) {
            await tx.product.update({
              where: { id: item.productId },
              data: { inventory: { increment: item.quantity } },
            });
          }
        }
      }

      await tx.order.update({
        where: { id: order.id },
        data: {
          status: nextStatus,
          statusHistory: {
            create: {
              status: nextStatus,
              note: note || `تغییر وضعیت توسط ${admin.name ?? "مدیر"}`,
            },
          },
        },
      });
    });

    refreshOrder(input.orderId);

    return { ok: true, message: "وضعیت سفارش به‌روزرسانی شد." };
  } catch (error) {
    const message = error instanceof Error ? error.message : "";

    if (message === "ORDER_NOT_FOUND") {
      return { ok: false, code: "NOT_FOUND", message: "سفارش یافت نشد." };
    }

    if (message === "CANCELLED_ORDER_LOCKED") {
      return {
        ok: false,
        code: "INVALID",
        message:
          "سفارش لغوشده قابل بازگشایی نیست. برای ثبت سفارش جدید با پشتیبانی هماهنگ کنید.",
      };
    }

    console.error("[admin] update order status failed", error);
    return {
      ok: false,
      code: "DB_UNAVAILABLE",
      message: "به‌روزرسانی وضعیت سفارش در حال حاضر ممکن نیست.",
    };
  }
}

export async function updateOrderPayment(input: {
  orderId: string;
  status: string;
}): Promise<AdminActionResult> {
  const admin = await getAdminActionUser("orders:write");

  if (!admin) {
    return forbidden();
  }

  if (!input.orderId || !PAYMENT_STATUSES.includes(input.status as PaymentStatus)) {
    return {
      ok: false,
      code: "INVALID",
      message: "وضعیت پرداخت معتبر نیست.",
    };
  }

  try {
    const prisma = getPrisma();
    const order = await prisma.order.findUnique({
      where: { id: input.orderId },
      select: { id: true, payment: { select: { id: true } } },
    });

    if (!order) {
      return { ok: false, code: "NOT_FOUND", message: "سفارش یافت نشد." };
    }

    const status = input.status as PaymentStatus;

    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: status,
          payment: order.payment
            ? {
                update: {
                  status,
                  paidAt: status === "PAID" ? new Date() : null,
                },
              }
            : {
                create: {
                  method: "COD",
                  amount: 0,
                  status,
                  provider: "manual",
                  paidAt: status === "PAID" ? new Date() : null,
                },
              },
          statusHistory: {
            create: {
              status: "PENDING",
              note: `وضعیت پرداخت به ${status} تغییر کرد (ثبت دستی توسط ${admin.name ?? "مدیر"}).`,
            },
          },
        },
      });
    });

    refreshOrder(input.orderId);

    return {
      ok: true,
      message:
        status === "PAID"
          ? "پرداخت به‌صورت دستی تأیید شد. این وضعیت فقط پس از تأیید واقعی فروشگاه ثبت شود."
          : "وضعیت پرداخت سفارش به‌روزرسانی شد.",
    };
  } catch (error) {
    console.error("[admin] update order payment failed", error);
    return {
      ok: false,
      code: "DB_UNAVAILABLE",
      message: "به‌روزرسانی وضعیت پرداخت در حال حاضر ممکن نیست.",
    };
  }
}

export async function updateOrderShipping(input: {
  orderId: string;
  method: string;
  cost: number;
  trackingCode?: string;
  notes?: string;
}): Promise<AdminActionResult> {
  const admin = await getAdminActionUser("orders:write");

  if (!admin) {
    return forbidden();
  }

  if (
    !input.orderId ||
    !SHIPPING_METHODS.includes(input.method as ShippingMethod)
  ) {
    return {
      ok: false,
      code: "INVALID",
      message: "روش ارسال معتبر نیست.",
    };
  }

  const cost = Number(input.cost);

  if (!Number.isFinite(cost) || cost < 0 || cost > 100_000_000) {
    return {
      ok: false,
      code: "INVALID",
      message: "هزینه ارسال معتبر نیست.",
    };
  }

  const trackingCode = input.trackingCode?.trim() || null;
  const notes = input.notes?.trim() || null;

  try {
    const prisma = getPrisma();
    const order = await prisma.order.findUnique({
      where: { id: input.orderId },
      select: {
        id: true,
        subtotal: true,
        discount: true,
        paymentStatus: true,
        shipping: { select: { id: true } },
      },
    });

    if (!order) {
      return { ok: false, code: "NOT_FOUND", message: "سفارش یافت نشد." };
    }

    if (order.paymentStatus === "PAID") {
      return {
        ok: false,
        code: "INVALID",
        message:
          "پس از تأیید پرداخت، هزینه ارسال قابل تغییر نیست. برای اصلاح، ابتدا با پشتیبانی هماهنگ کنید.",
      };
    }

    const total = Number(order.subtotal) - Number(order.discount) + cost;

    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: order.id },
        data: {
          shippingCost: cost,
          total,
          shipping: order.shipping
            ? {
                update: {
                  method: input.method as ShippingMethod,
                  cost,
                  trackingCode,
                  notes,
                },
              }
            : {
                create: {
                  method: input.method as ShippingMethod,
                  cost,
                  trackingCode,
                  notes,
                },
              },
        },
      });
    });

    refreshOrder(input.orderId);

    return { ok: true, message: "اطلاعات ارسال سفارش به‌روزرسانی شد." };
  } catch (error) {
    console.error("[admin] update order shipping failed", error);
    return {
      ok: false,
      code: "DB_UNAVAILABLE",
      message: "به‌روزرسانی اطلاعات ارسال در حال حاضر ممکن نیست.",
    };
  }
}
