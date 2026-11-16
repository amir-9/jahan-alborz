import type {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  ServiceRequestStatus,
  ShippingMethod,
} from "@/lib/generated/prisma/enums";

export const orderStatusLabels: Record<OrderStatus, string> = {
  PENDING: "در انتظار بررسی",
  AWAITING_PAYMENT: "در انتظار پرداخت",
  CONFIRMED: "تأیید شده",
  PROCESSING: "در حال آماده‌سازی",
  READY_FOR_SHIPMENT: "آماده ارسال",
  SHIPPED: "ارسال شده",
  DELIVERED: "تحویل شده",
  CANCELLED: "لغو شده",
};

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  PENDING: "در انتظار پرداخت",
  PAID: "پرداخت شده",
  FAILED: "ناموفق",
  REFUNDED: "بازپرداخت شده",
};

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  ONLINE: "پرداخت آنلاین",
  COD: "پرداخت در محل",
};

export const shippingMethodLabels: Record<ShippingMethod, string> = {
  POST: "پست",
  TIPAX: "تیپاکس",
  FREIGHT: "باربری",
  LOCAL: "پیک محلی قزوین",
};

export const serviceStatusLabels: Record<ServiceRequestStatus, string> = {
  PENDING: "در انتظار بررسی",
  CONFIRMED: "تأیید شده",
  ASSIGNED: "ارجاع به تکنسین",
  IN_PROGRESS: "در حال انجام",
  COMPLETED: "تکمیل شده",
  CANCELLED: "لغو شده",
};

export type StatusTone = "default" | "secondary" | "outline" | "success" | "danger";

export const orderStatusTones: Record<OrderStatus, StatusTone> = {
  PENDING: "secondary",
  AWAITING_PAYMENT: "secondary",
  CONFIRMED: "default",
  PROCESSING: "default",
  READY_FOR_SHIPMENT: "default",
  SHIPPED: "default",
  DELIVERED: "success",
  CANCELLED: "danger",
};

export const paymentStatusTones: Record<PaymentStatus, StatusTone> = {
  PENDING: "secondary",
  PAID: "success",
  FAILED: "danger",
  REFUNDED: "outline",
};

export const serviceStatusTones: Record<ServiceRequestStatus, StatusTone> = {
  PENDING: "secondary",
  CONFIRMED: "default",
  ASSIGNED: "default",
  IN_PROGRESS: "default",
  COMPLETED: "success",
  CANCELLED: "danger",
};

export const shippingMethodOptions = (
  Object.keys(shippingMethodLabels) as ShippingMethod[]
).map((value) => ({ value, label: shippingMethodLabels[value] }));

export const paymentMethodOptions = (
  Object.keys(paymentMethodLabels) as PaymentMethod[]
).map((value) => ({ value, label: paymentMethodLabels[value] }));

export const orderStatusOptions = (
  Object.keys(orderStatusLabels) as OrderStatus[]
).map((value) => ({ value, label: orderStatusLabels[value] }));

export const serviceStatusOptions = (
  Object.keys(serviceStatusLabels) as ServiceRequestStatus[]
).map((value) => ({ value, label: serviceStatusLabels[value] }));
