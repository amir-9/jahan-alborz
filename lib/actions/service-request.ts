"use server";

import { getPrisma } from "@/lib/db/prisma";
import { getSession, toSessionUser } from "@/lib/auth/session";
import { consumeRateLimit } from "@/lib/security/rate-limit";
import {
  normalizeDigits,
  serviceRequestSchema,
  type ServiceRequestInput,
} from "@/lib/validation/service-request";

export type ServiceRequestResult =
  | {
      ok: true;
      message: string;
      requestId: string;
    }
  | {
      ok: false;
      code: "INVALID" | "DB_UNAVAILABLE" | "RATE_LIMITED";
      message: string;
      fieldErrors?: Record<string, string[] | undefined>;
    };

const MAX_REQUESTS_PER_HOUR = 10;

/**
 * Persist a public service request.
 *
 * The action validates again on the server and never reports success when the
 * database write fails. When the database is not configured, the UI receives an
 * explicit error instead of a fake confirmation.
 */
export async function submitServiceRequest(
  input: ServiceRequestInput,
): Promise<ServiceRequestResult> {
  const parsed = serviceRequestSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      code: "INVALID",
      message: "لطفاً خطاهای فرم را بررسی و دوباره ارسال کنید.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;
  const phone = normalizeDigits(data.customerPhone);

  try {
    const rateLimit = await consumeRateLimit(
      `service-request:${phone}`,
      1,
      60 * 1000,
    );

    if (!rateLimit.allowed) {
      return {
        ok: false,
        code: "RATE_LIMITED",
        message:
          "درخواست شما به‌تازگی ثبت شده است. برای جلوگیری از ثبت تکراری، کمی بعد دوباره تلاش کنید یا با فروشگاه تماس بگیرید.",
      };
    }

    const hourlyLimit = await consumeRateLimit(
      `service-request-hourly:${phone}`,
      MAX_REQUESTS_PER_HOUR,
      60 * 60 * 1000,
    );

    if (!hourlyLimit.allowed) {
      return {
        ok: false,
        code: "RATE_LIMITED",
        message:
          "تعداد درخواست‌های ثبت‌شده با این شماره بیش از حد مجاز است. لطفاً با فروشگاه تماس بگیرید.",
      };
    }

    const sessionUser = toSessionUser(await getSession());
    const customerId =
      sessionUser?.phone === phone ? sessionUser.id : undefined;

    const request = await getPrisma().serviceRequest.create({
      data: {
        customerId,
        customerName: data.customerName,
        customerPhone: phone,
        serviceType: data.serviceType,
        city: data.city,
        address: data.address || null,
        brand: data.brand || null,
        problemDescription: data.problemDescription || null,
        preferredVisitDate: data.preferredVisitDate
          ? new Date(`${data.preferredVisitDate}T00:00:00`)
          : null,
      },
      select: {
        id: true,
      },
    });

    return {
      ok: true,
      requestId: request.id,
      message:
        "درخواست شما ثبت شد. برای هماهنگی زمان بازدید با شما تماس می‌گیریم.",
    };
  } catch (error) {
    console.error("[service-request] database write failed", error);

    return {
      ok: false,
      code: "DB_UNAVAILABLE",
      message:
        "ثبت درخواست در حال حاضر ممکن نیست. لطفاً کمی بعد دوباره تلاش کنید یا با فروشگاه تماس بگیرید.",
    };
  }
}
