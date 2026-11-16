"use server";

import { randomInt } from "crypto";
import type { Prisma } from "@/lib/generated/prisma/client";
import { getPrisma } from "@/lib/db/prisma";
import { getSession, toSessionUser } from "@/lib/auth/session";
import { hasRecentCheckoutVerification } from "@/lib/auth/otp";
import { consumeRateLimit } from "@/lib/security/rate-limit";
import { grantOrderAccess } from "@/lib/orders/access";
import { getPaymentProvider } from "@/lib/payments/payment-provider";
import {
  checkoutSchema,
  type CheckoutInput,
} from "@/lib/validation/order";
import type { PaymentMethod, ShippingMethod } from "@/lib/generated/prisma/enums";

export type CreateOrderResult =
  | {
      ok: true;
      orderId: string;
      orderNumber: string;
      message: string;
      paymentMessage: string;
    }
  | {
      ok: false;
      code:
        | "INVALID"
        | "OTP_REQUIRED"
        | "PRODUCT_UNAVAILABLE"
        | "OUT_OF_STOCK"
        | "RATE_LIMITED"
        | "DB_UNAVAILABLE";
      message: string;
      fieldErrors?: Record<string, string[] | undefined>;
    };

class CheckoutError extends Error {
  constructor(
    public readonly code:
      | "PRODUCT_UNAVAILABLE"
      | "OUT_OF_STOCK"
      | "DB_UNAVAILABLE",
    message: string,
  ) {
    super(message);
    this.name = "CheckoutError";
  }
}

function buildOrderNumber(): string {
  const date = new Date();
  const stamp = [
    String(date.getFullYear()).slice(-2),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("");
  const random = randomInt(100000, 1000000);

  return `JA-${stamp}-${random}`;
}

async function findAvailableOrderNumber(
  tx: Prisma.TransactionClient,
): Promise<string> {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const candidate = buildOrderNumber();
    const existing = await tx.order.findUnique({
      where: { orderNumber: candidate },
      select: { id: true },
    });

    if (!existing) {
      return candidate;
    }
  }

  return `JA-${Date.now()}-${randomInt(1000, 10000)}`;
}

export async function createOrder(
  input: CheckoutInput,
): Promise<CreateOrderResult> {
  const parsed = checkoutSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      code: "INVALID",
      message: "لطفاً خطاهای فرم سفارش را بررسی کنید.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;
  const sessionUser = toSessionUser(await getSession());
  const phoneMatchesSession =
    Boolean(sessionUser?.phone) && sessionUser?.phone === data.customerPhone;

  try {
    const limit = await consumeRateLimit(
      `order:create:${data.customerPhone}`,
      5,
      10 * 60 * 1000,
    );

    if (!limit.allowed) {
      return {
        ok: false,
        code: "RATE_LIMITED",
        message:
          "تعداد تلاش‌های ثبت سفارش با این شماره بیش از حد مجاز است. لطفاً کمی بعد دوباره تلاش کنید.",
      };
    }

    // Guest checkout (or a different phone than the signed-in account) must
    // prove ownership of the number with a recently consumed checkout OTP.
    if (!phoneMatchesSession) {
      const verified = await hasRecentCheckoutVerification(
        data.customerPhone,
      );

      if (!verified) {
        return {
          ok: false,
          code: "OTP_REQUIRED",
          message:
            "برای نهایی‌سازی سفارش، شماره موبایل باید با کد یک‌بارمصرف تأیید شود.",
        };
      }
    }

    const prisma = getPrisma();
    const existingOrder = await prisma.order.findUnique({
      where: { idempotencyKey: data.idempotencyKey },
      select: { id: true, orderNumber: true, customerPhone: true },
    });

    if (existingOrder) {
      if (existingOrder.customerPhone !== data.customerPhone) {
        return {
          ok: false,
          code: "INVALID",
          message: "کلید سفارش با شماره موبایل همخوانی ندارد.",
        };
      }

      await grantOrderAccess(existingOrder.orderNumber);

      return {
        ok: true,
        orderId: existingOrder.id,
        orderNumber: existingOrder.orderNumber,
        message: "این سفارش قبلاً ثبت شده است.",
        paymentMessage:
          "برای پیگیری وضعیت پرداخت، سفارش را در حساب کاربری یا از طریق تماس با فروشگاه بررسی کنید.",
      };
    }

    // Aggregate duplicated lines so inventory is checked against the total.
    const quantities = new Map<string, number>();

    for (const item of data.items) {
      quantities.set(
        item.productId,
        (quantities.get(item.productId) ?? 0) + item.quantity,
      );
    }

    for (const [productId, quantity] of quantities) {
      if (quantity > 20) {
        return {
          ok: false,
          code: "OUT_OF_STOCK",
          message: `تعداد مجاز برای یک محصول حداکثر ۲۰ عدد است (${productId}).`,
        };
      }
    }

    const productIds = Array.from(quantities.keys());

    const order = await prisma.$transaction(async (tx) => {
      const products = await tx.product.findMany({
        where: { id: { in: productIds }, isActive: true },
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          discountedPrice: true,
          inventory: true,
          purchasingMode: true,
        },
      });

      if (products.length !== productIds.length) {
        throw new CheckoutError(
          "PRODUCT_UNAVAILABLE",
          "یکی از محصولات سبد خرید دیگر در فروشگاه موجود نیست. سبد را به‌روزرسانی کنید.",
        );
      }

      const lines: {
        productId: string;
        productName: string;
        productSlug: string;
        productPrice: number;
        quantity: number;
        lineTotal: number;
      }[] = [];

      for (const product of products) {
        const quantity = quantities.get(product.id) ?? 0;

        if (product.purchasingMode !== "FIXED") {
          throw new CheckoutError(
            "PRODUCT_UNAVAILABLE",
            `محصول «${product.name}» قیمت‌گذاری مستقیم ندارد و باید از طریق استعلام خریداری شود.`,
          );
        }

        if (product.inventory < quantity) {
          throw new CheckoutError(
            "OUT_OF_STOCK",
            `موجودی محصول «${product.name}» کافی نیست. لطفاً تعداد را کاهش دهید یا با فروشگاه تماس بگیرید.`,
          );
        }

        const unitPrice = Number(product.discountedPrice ?? product.price);

        lines.push({
          productId: product.id,
          productName: product.name,
          productSlug: product.slug,
          productPrice: unitPrice,
          quantity,
          lineTotal: unitPrice * quantity,
        });

        const updated = await tx.product.updateMany({
          where: { id: product.id, inventory: { gte: quantity } },
          data: { inventory: { decrement: quantity } },
        });

        if (updated.count !== 1) {
          throw new CheckoutError(
            "OUT_OF_STOCK",
            `موجودی محصول «${product.name}» هم‌زمان تغییر کرد. لطفاً دوباره تلاش کنید.`,
          );
        }
      }

      const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
      const orderNumber = await findAvailableOrderNumber(tx);
      const initialStatus =
        data.paymentMethod === "ONLINE" ? "AWAITING_PAYMENT" : "PENDING";

      const created = await tx.order.create({
        data: {
          orderNumber,
          idempotencyKey: data.idempotencyKey,
          userId: phoneMatchesSession ? sessionUser?.id : undefined,
          status: initialStatus,
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          customerEmail: data.customerEmail || null,
          province: data.province,
          city: data.city,
          postalCode: data.postalCode || null,
          shippingAddress: data.shippingAddress,
          notes: data.notes || null,
          subtotal,
          discount: 0,
          shippingCost: 0,
          total: subtotal,
          paymentMethod: data.paymentMethod as PaymentMethod,
          paymentStatus: "PENDING",
          shippingMethod: data.shippingMethod as ShippingMethod,
          items: {
            create: lines.map((line) => ({
              productId: line.productId,
              productName: line.productName,
              productSlug: line.productSlug,
              productPrice: line.productPrice,
              quantity: line.quantity,
              lineTotal: line.lineTotal,
            })),
          },
          payment: {
            create: {
              provider: data.paymentMethod === "ONLINE" ? "manual" : null,
              method: data.paymentMethod as PaymentMethod,
              amount: subtotal,
              status: "PENDING",
            },
          },
          shipping: {
            create: {
              method: data.shippingMethod as ShippingMethod,
              cost: 0,
              notes:
                "هزینه ارسال پس از بررسی آدرس و روش ارسال توسط فروشگاه تعیین می‌شود.",
            },
          },
          statusHistory: {
            create: {
              status: initialStatus,
              note: "سفارش در سامانه ثبت شد.",
            },
          },
        },
        select: { id: true, orderNumber: true, total: true },
      });

      return created;
    });

    await grantOrderAccess(order.orderNumber);

    const payment = await getPaymentProvider(
      data.paymentMethod as "ONLINE" | "COD",
    ).initiate({
      orderNumber: order.orderNumber,
      amount: Number(order.total),
      customerPhone: data.customerPhone,
    });

    return {
      ok: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      message:
        "سفارش شما ثبت شد. برای تأیید نهایی موجودی و هزینه ارسال با شما تماس می‌گیریم.",
      paymentMessage: payment.message,
    };
  } catch (error) {
    if (error instanceof CheckoutError) {
      return { ok: false, code: error.code, message: error.message };
    }

    console.error("[orders] create order failed", error);

    return {
      ok: false,
      code: "DB_UNAVAILABLE",
      message:
        "ثبت سفارش در حال حاضر ممکن نیست. لطفاً کمی بعد دوباره تلاش کنید یا با فروشگاه تماس بگیرید.",
    };
  }
}
