import type { UserRole } from "@/lib/generated/prisma/enums";

export const roleLabels: Record<UserRole, string> = {
  CUSTOMER: "مشتری",
  SUPER_ADMIN: "مدیر ارشد",
  ADMIN: "مدیر",
  PRODUCT_MANAGER: "مدیر محصولات",
  ORDER_MANAGER: "مدیر سفارش‌ها",
  CONTENT_MANAGER: "مدیر محتوا",
  SERVICE_MANAGER: "مدیر خدمات",
};

export const staffRoleOptions: { value: UserRole; label: string }[] = [
  { value: "SUPER_ADMIN", label: roleLabels.SUPER_ADMIN },
  { value: "ADMIN", label: roleLabels.ADMIN },
  { value: "PRODUCT_MANAGER", label: roleLabels.PRODUCT_MANAGER },
  { value: "ORDER_MANAGER", label: roleLabels.ORDER_MANAGER },
  { value: "CONTENT_MANAGER", label: roleLabels.CONTENT_MANAGER },
  { value: "SERVICE_MANAGER", label: roleLabels.SERVICE_MANAGER },
];

export const allRoleOptions: { value: UserRole; label: string }[] = [
  { value: "CUSTOMER", label: roleLabels.CUSTOMER },
  ...staffRoleOptions,
];

export function roleDescription(role: UserRole): string {
  switch (role) {
    case "SUPER_ADMIN":
      return "دسترسی کامل شامل مدیریت کاربران و تنظیمات.";
    case "ADMIN":
      return "مدیریت محصولات، سفارش‌ها، خدمات و محتوا بدون مدیریت کاربران.";
    case "PRODUCT_MANAGER":
      return "ایجاد و ویرایش محصولات و دسته‌بندی‌ها.";
    case "ORDER_MANAGER":
      return "مشاهده و به‌روزرسانی سفارش‌ها، پرداخت و ارسال.";
    case "CONTENT_MANAGER":
      return "مدیریت محتوای مقالات و صفحات معرفی.";
    case "SERVICE_MANAGER":
      return "پیگیری درخواست‌های تعمیر و سرویس.";
    case "CUSTOMER":
      return "دسترسی به حساب کاربری و سفارش‌های شخصی.";
  }
}
