import { z } from "zod";
import {
  isValidIranMobile,
  normalizeIranMobile,
} from "@/lib/utils/normalize";

export const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1, "شناسه محصول معتبر نیست."),
        quantity: z
          .number()
          .int("تعداد باید عدد صحیح باشد.")
          .min(1, "حداقل تعداد یک عدد است.")
          .max(20, "حداکثر تعداد مجاز ۲۰ عدد است."),
      }),
    )
    .min(1, "سبد خرید خالی است.")
    .max(50, "تعداد اقلام سبد خرید بیش از حد مجاز است."),
  customerName: z
    .string()
    .trim()
    .min(2, "نام و نام خانوادگی را کامل وارد کنید.")
    .max(80, "نام نمی‌تواند بیش از ۸۰ کاراکتر باشد."),
  customerPhone: z
    .string()
    .trim()
    .refine((value) => isValidIranMobile(value), {
      message: "شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود.",
    })
    .transform((value) => normalizeIranMobile(value)),
  customerEmail: z
    .string()
    .trim()
    .max(160)
    .refine((value) => value === "" || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value), {
      message: "ایمیل معتبر نیست.",
    })
    .optional(),
  province: z
    .string()
    .trim()
    .min(2, "استان را وارد کنید.")
    .max(60, "نام استان بیش از حد طولانی است."),
  city: z
    .string()
    .trim()
    .min(2, "شهر را وارد کنید.")
    .max(60, "نام شهر بیش از حد طولانی است."),
  shippingAddress: z
    .string()
    .trim()
    .min(5, "نشانی تحویل را کامل‌تر وارد کنید.")
    .max(300, "نشانی نمی‌تواند بیش از ۳۰۰ کاراکتر باشد."),
  postalCode: z
    .string()
    .trim()
    .refine((value) => value === "" || /^\d{10}$/.test(value), {
      message: "کد پستی باید ۱۰ رقم باشد.",
    })
    .optional(),
  shippingMethod: z.enum(["POST", "TIPAX", "FREIGHT", "LOCAL"], {
    message: "روش ارسال را انتخاب کنید.",
  }),
  paymentMethod: z.enum(["ONLINE", "COD"], {
    message: "روش پرداخت را انتخاب کنید.",
  }),
  notes: z
    .string()
    .trim()
    .max(500, "توضیحات نمی‌تواند بیش از ۵۰۰ کاراکتر باشد.")
    .optional(),
  idempotencyKey: z
    .string()
    .trim()
    .min(8, "کلید یکتای سفارش معتبر نیست.")
    .max(100, "کلید یکتای سفارش معتبر نیست."),
});

export type CheckoutInput = z.input<typeof checkoutSchema>;
export type CheckoutValues = z.output<typeof checkoutSchema>;
