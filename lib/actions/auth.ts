"use server";

import { revalidatePath } from "next/cache";
import { getPrisma } from "@/lib/db/prisma";
import { getSession, toSessionUser } from "@/lib/auth/session";
import { hashPassword } from "@/lib/auth/password";
import { requestOtp, verifyOtp } from "@/lib/auth/otp";
import { consumeRateLimit } from "@/lib/security/rate-limit";
import {
  otpRequestSchema,
  otpVerifySchema,
  profileSchema,
  registerSchema,
  type ProfileInput,
  type RegisterInput,
} from "@/lib/validation/auth";

export type AuthActionResult =
  | { ok: true; message: string; expiresAt?: string; retryAfterSeconds?: number }
  | {
      ok: false;
      code:
        | "INVALID"
        | "RATE_LIMITED"
        | "ALREADY_REGISTERED"
        | "DB_UNAVAILABLE"
        | "INVALID_CODE"
        | "UNAUTHENTICATED";
      message: string;
      retryAfterSeconds?: number;
      fieldErrors?: Record<string, string[] | undefined>;
    };

type OtpRequestOutcome = {
  ok: boolean;
  message: string;
  expiresAt?: string;
  retryAfterSeconds?: number;
  code?: "RATE_LIMITED" | "DB_UNAVAILABLE";
};

function otpFailureMessage(reason: "COOLDOWN" | "RATE_LIMITED" | "SMS_FAILED") {
  switch (reason) {
    case "COOLDOWN":
      return "کد تأیید به‌تازگی ارسال شده است. لطفاً کمی بعد دوباره تلاش کنید.";
    case "RATE_LIMITED":
      return "تعداد درخواست کد تأیید بیش از حد مجاز است. لطفاً بعداً تلاش کنید.";
    case "SMS_FAILED":
      return "ارسال پیامک تأیید در حال حاضر ممکن نیست. لطفاً دوباره تلاش کنید یا با فروشگاه تماس بگیرید.";
  }
}

async function requestOtpFor(
  input: unknown,
  purpose: "login" | "checkout",
): Promise<OtpRequestOutcome> {
  const parsed = otpRequestSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      code: "RATE_LIMITED",
      message:
        parsed.error.issues[0]?.message ?? "شماره موبایل وارد‌شده معتبر نیست.",
    };
  }

  try {
    const result = await requestOtp(parsed.data.phone, purpose);

    if (!result.ok) {
      return {
        ok: false,
        code: result.reason === "SMS_FAILED" ? "DB_UNAVAILABLE" : "RATE_LIMITED",
        message: otpFailureMessage(result.reason),
        retryAfterSeconds: result.retryAfterSeconds,
      };
    }

    return {
      ok: true,
      message:
        purpose === "login"
          ? "کد تأیید به شماره شما ارسال شد. کد را در کادر زیر وارد کنید."
          : "کد تأیید برای نهایی‌سازی سفارش ارسال شد. کد را در کادر زیر وارد کنید.",
      expiresAt: result.expiresAt.toISOString(),
      retryAfterSeconds: result.retryAfterSeconds,
    };
  } catch (error) {
    console.error("[auth] OTP request failed", error);
    return {
      ok: false,
      code: "DB_UNAVAILABLE",
      message:
        "ارسال کد تأیید در حال حاضر ممکن نیست. لطفاً کمی بعد دوباره تلاش کنید یا با فروشگاه تماس بگیرید.",
    };
  }
}

/** Send a one-time code for customer login. */
export async function requestLoginOtp(
  input: unknown,
): Promise<OtpRequestOutcome> {
  return requestOtpFor(input, "login");
}

/** Send a one-time code that proves ownership of a phone during checkout. */
export async function requestCheckoutOtp(
  input: unknown,
): Promise<OtpRequestOutcome> {
  return requestOtpFor(input, "checkout");
}

/**
 * Verify a checkout code. The consumed OTP record is the proof of ownership
 * that the order action checks again server-side.
 */
export async function verifyCheckoutOtp(
  input: unknown,
): Promise<AuthActionResult> {
  const parsed = otpVerifySchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      code: "INVALID",
      message:
        parsed.error.issues[0]?.message ??
        "شماره موبایل و کد تأیید را بررسی کنید.",
    };
  }

  try {
    const result = await verifyOtp(
      parsed.data.phone,
      parsed.data.code,
      "checkout",
    );

    if (!result.valid) {
      return {
        ok: false,
        code: "INVALID_CODE",
        message:
          "کد تأیید معتبر نیست یا منقضی شده است. برای دریافت کد جدید اقدام کنید.",
      };
    }

    return {
      ok: true,
      message: "شماره موبایل شما تأیید شد.",
    };
  } catch (error) {
    console.error("[auth] checkout OTP verification failed", error);
    return {
      ok: false,
      code: "DB_UNAVAILABLE",
      message:
        "بررسی کد تأیید در حال حاضر ممکن نیست. لطفاً کمی بعد دوباره تلاش کنید.",
    };
  }
}

/** Create a customer account with a password. */
export async function registerCustomer(
  input: RegisterInput,
): Promise<AuthActionResult> {
  const parsed = registerSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      code: "INVALID",
      message: "لطفاً خطاهای فرم را بررسی و دوباره ارسال کنید.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, phone, password } = parsed.data;

  try {
    const limit = await consumeRateLimit(
      `auth:register:${phone}`,
      5,
      60 * 60 * 1000,
    );

    if (!limit.allowed) {
      return {
        ok: false,
        code: "RATE_LIMITED",
        message:
          "تعداد تلاش‌های ثبت‌نام با این شماره بیش از حد مجاز است. لطفاً بعداً تلاش کنید.",
      };
    }

    const prisma = getPrisma();
    const existing = await prisma.user.findUnique({
      where: { phone },
      select: { id: true },
    });

    if (existing) {
      return {
        ok: false,
        code: "ALREADY_REGISTERED",
        message:
          "این شماره موبایل قبلاً ثبت شده است. از صفحه ورود استفاده کنید.",
      };
    }

    const passwordHash = await hashPassword(password);

    await prisma.user.create({
      data: { name, phone, passwordHash, role: "CUSTOMER" },
    });

    return {
      ok: true,
      message: "حساب کاربری ایجاد شد. اکنون می‌توانید وارد شوید.",
    };
  } catch (error) {
    console.error("[auth] customer registration failed", error);
    return {
      ok: false,
      code: "DB_UNAVAILABLE",
      message:
        "ایجاد حساب کاربری در حال حاضر ممکن نیست. لطفاً کمی بعد دوباره تلاش کنید.",
    };
  }
}

/** Update the signed-in customer's basic profile details. */
export async function updateProfile(
  input: ProfileInput,
): Promise<AuthActionResult> {
  const sessionUser = toSessionUser(await getSession());

  if (!sessionUser) {
    return {
      ok: false,
      code: "UNAUTHENTICATED",
      message: "برای ویرایش اطلاعات باید وارد حساب کاربری شوید.",
    };
  }

  const parsed = profileSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      code: "INVALID",
      message: "لطفاً خطاهای فرم را بررسی کنید.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await getPrisma().user.update({
      where: { id: sessionUser.id },
      data: {
        name: parsed.data.name,
        email: parsed.data.email?.trim() ? parsed.data.email.trim() : null,
      },
    });

    revalidatePath("/account");
    revalidatePath("/account/profile");

    return { ok: true, message: "اطلاعات حساب شما به‌روزرسانی شد." };
  } catch (error) {
    console.error("[auth] profile update failed", error);
    return {
      ok: false,
      code: "DB_UNAVAILABLE",
      message:
        "به‌روزرسانی اطلاعات در حال حاضر ممکن نیست. اگر ایمیل تکراری است، ایمیل دیگری وارد کنید.",
    };
  }
}
