import { z } from "zod";
import {
  isValidIranMobile,
  normalizeIranMobile,
} from "@/lib/utils/normalize";

export const addressSchema = z.object({
  label: z
    .string()
    .trim()
    .max(40, "عنوان آدرس نمی‌تواند بیش از ۴۰ کاراکتر باشد.")
    .optional(),
  recipient: z
    .string()
    .trim()
    .min(2, "نام تحویل‌گیرنده را کامل وارد کنید.")
    .max(80, "نام تحویل‌گیرنده بیش از حد طولانی است."),
  phone: z
    .string()
    .trim()
    .refine((value) => isValidIranMobile(value), {
      message: "شماره موبایل تحویل‌گیرنده معتبر نیست.",
    })
    .transform((value) => normalizeIranMobile(value)),
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
  street: z
    .string()
    .trim()
    .min(5, "آدرس را کامل‌تر وارد کنید.")
    .max(300, "آدرس نمی‌تواند بیش از ۳۰۰ کاراکتر باشد."),
  postalCode: z
    .string()
    .trim()
    .refine((value) => value === "" || /^\d{10}$/.test(value), {
      message: "کد پستی باید ۱۰ رقم باشد.",
    })
    .optional(),
  isDefault: z.boolean().optional(),
});

export type AddressInput = z.input<typeof addressSchema>;
