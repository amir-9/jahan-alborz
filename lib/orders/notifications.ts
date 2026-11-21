/**
 * Best-effort SMS notifications for newly created orders.
 *
 * These notifications must never block or fail an order that has already been
 * written to the database. Callers are responsible for catching any error.
 */

import { siteConfig } from "@/lib/config/site";
import { getSmsProvider } from "@/lib/sms/sms";
import { formatPrice } from "@/lib/utils/format";

export type NewOrderNotification = {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  total: number;
  itemCount: number;
  paymentMethod: "ONLINE" | "COD";
};

const paymentLabels: Record<NewOrderNotification["paymentMethod"], string> = {
  ONLINE: "پرداخت آنلاین (در انتظار پرداخت)",
  COD: "پرداخت هنگام تحویل",
};

function buildCustomerMessage(order: NewOrderNotification): string {
  return (
    `${siteConfig.name}: سفارش شما با شماره ${order.orderNumber} ثبت شد. ` +
    `موجودی و هزینه ارسال پیش از اقدام بررسی و با شما هماهنگ میشود. ` +
    `برای پیگیری با ما تماس بگیرید.`
  );
}

function buildAdminMessage(order: NewOrderNotification): string {
  return [
    `سفارش جدید ${order.orderNumber}`,
    `مشتری: ${order.customerName}`,
    `موبایل: ${order.customerPhone}`,
    `تعداد اقلام: ${order.itemCount}`,
    `مبلغ: ${formatPrice(order.total)}`,
    `روش پرداخت: ${paymentLabels[order.paymentMethod]}`,
    "لطفاً بررسی و هماهنگ کنید.",
  ].join("\n");
}

/** Notifies the customer and, when configured, the store admin about a new order. */
export async function notifyNewOrder(order: NewOrderNotification): Promise<void> {
  const sms = getSmsProvider();
  const adminPhone = process.env.ADMIN_ORDER_NOTIFY_PHONE?.trim();

  const deliveries: Promise<void>[] = [
    sms.sendTextMessage(
      order.customerPhone,
      buildCustomerMessage(order),
      "order-customer-confirmation",
    ),
  ];

  if (adminPhone) {
    deliveries.push(
      sms.sendTextMessage(
        adminPhone,
        buildAdminMessage(order),
        "order-admin-alert",
      ),
    );
  }

  const results = await Promise.allSettled(deliveries);

  const failures = results.filter(
    (result): result is PromiseRejectedResult => result.status === "rejected",
  );

  if (failures.length > 0) {
    console.error(
      "[orders] notification delivery failed",
      failures.map((failure) => failure.reason),
    );
  }
}
