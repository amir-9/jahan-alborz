import { z } from "zod";
import {
  isValidIranMobile,
  normalizeIranMobile,
} from "@/lib/utils/normalize";

const phoneSchema = z
  .string()
  .trim()
  .min(1, "شماره موبایل را وارد کنید.")
  .refine((value) => isValidIranMobile(value), {
    message: "شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود.",
  })
  .transform((value) => normalizeIranMobile(value));

const passwordSchema = z
  .string()
  .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد.")
  .max(72, "رمز عبور نمی‌تواند بیش از ۷۲ کاراکتر باشد.")
  .refine((value) => /[A-Za-z]/.test(value), {
    message: "رمز عبور باید حداقل یک حرف انگلیسی داشته باشد.",
  })
  .refine((value) => /\d/.test(value), {
    message: "رمز عبور باید حداقل یک رقم داشته باشد.",
  });

export const otpRequestSchema = z.object({
  phone: phoneSchema,
});

export const otpVerifySchema = z.object({
  phone: phoneSchema,
  code: z
    .string()
    .trim()
    .refine((value) => /^\d{6}$/.test(value), {
      message: "کد تأیید باید ۶ رقم باشد.",
    }),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "نام و نام خانوادگی را کامل وارد کنید.")
      .max(80, "نام نمی‌تواند بیش از ۸۰ کاراکتر باشد."),
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "تکرار رمز عبور با رمز عبور یکسان نیست.",
  });

export const passwordLoginSchema = z.object({
  phone: phoneSchema,
  password: z.string().min(1, "رمز عبور را وارد کنید.").max(72),
});

export const staffLoginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "ایمیل را وارد کنید.")
    .email("ایمیل معتبر نیست.")
    .max(160),
  password: z.string().min(1, "رمز عبور را وارد کنید.").max(72),
});

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "نام و نام خانوادگی را کامل وارد کنید.")
    .max(80, "نام نمی‌تواند بیش از ۸۰ کاراکتر باشد."),
  email: z
    .string()
    .trim()
    .email("ایمیل معتبر نیست.")
    .max(160)
    .or(z.literal(""))
    .optional(),
});

export type RegisterInput = z.input<typeof registerSchema>;
export type PasswordLoginInput = z.input<typeof passwordLoginSchema>;
export type StaffLoginInput = z.input<typeof staffLoginSchema>;
export type ProfileInput = z.input<typeof profileSchema>;
