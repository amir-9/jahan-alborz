import { z } from "zod";
import {
  isValidIranMobile,
  normalizeIranMobile,
} from "@/lib/utils/normalize";

export { normalizeDigits } from "@/lib/utils/normalize";

export const serviceRequestSchema = z.object({
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
  serviceType: z
    .string()
    .trim()
    .min(1, "نوع خدمت را انتخاب کنید.")
    .max(120),
  city: z
    .string()
    .trim()
    .min(2, "شهر را وارد کنید.")
    .max(80, "نام شهر بیش از حد طولانی است."),
  address: z
    .string()
    .trim()
    .max(300, "آدرس نمی‌تواند بیش از ۳۰۰ کاراکتر باشد.")
    .optional(),
  brand: z
    .string()
    .trim()
    .max(80, "نام برند بیش از حد طولانی است.")
    .optional(),
  problemDescription: z
    .string()
    .trim()
    .max(1000, "توضیحات نمی‌تواند بیش از ۱۰۰۰ کاراکتر باشد.")
    .optional(),
  preferredVisitDate: z
    .string()
    .trim()
    .refine((value) => value === "" || /^\d{4}-\d{2}-\d{2}$/.test(value), {
      message: "تاریخ پیشنهادی معتبر نیست.",
    })
    .optional(),
});

export type ServiceRequestInput = z.input<typeof serviceRequestSchema>;
export type ServiceRequestValues = z.output<typeof serviceRequestSchema>;
