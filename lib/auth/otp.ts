import { createHash, randomInt, timingSafeEqual } from "crypto";
import { getPrisma } from "@/lib/db/prisma";
import { getSmsProvider } from "@/lib/sms/sms";
import { consumeRateLimit } from "@/lib/security/rate-limit";

const OTP_TTL_MS = 5 * 60 * 1000;
const OTP_COOLDOWN_MS = 60 * 1000;
const MAX_ATTEMPTS = 5;
const MAX_SENDS_PER_HOUR = 5;

export type OtpPurpose = "login" | "checkout";

export type OtpRequestResult =
  | { ok: true; expiresAt: Date; retryAfterSeconds: number }
  | {
      ok: false;
      reason: "COOLDOWN" | "RATE_LIMITED" | "SMS_FAILED";
      retryAfterSeconds: number;
    };

function hashOtp(phone: string, code: string): string {
  return createHash("sha256").update(`${phone}:${code}`).digest("hex");
}

function codesMatch(expectedHash: string, phone: string, code: string): boolean {
  const actual = Buffer.from(hashOtp(phone, code));
  const expected = Buffer.from(expectedHash);

  if (actual.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(actual, expected);
}

export async function requestOtp(
  phone: string,
  purpose: OtpPurpose,
): Promise<OtpRequestResult> {
  const prisma = getPrisma();
  const now = new Date();

  const existing = await prisma.otp.findUnique({ where: { phone } });

  if (existing) {
    const elapsed = now.getTime() - existing.lastSentAt.getTime();
    if (elapsed < OTP_COOLDOWN_MS) {
      return {
        ok: false,
        reason: "COOLDOWN",
        retryAfterSeconds: Math.ceil((OTP_COOLDOWN_MS - elapsed) / 1000),
      };
    }
  }

  const rateLimit = await consumeRateLimit(
    `otp:send:${phone}`,
    MAX_SENDS_PER_HOUR,
    60 * 60 * 1000,
  );

  if (!rateLimit.allowed) {
    return {
      ok: false,
      reason: "RATE_LIMITED",
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((rateLimit.resetAt.getTime() - now.getTime()) / 1000),
      ),
    };
  }

  const code = randomInt(100000, 1000000).toString();
  const expiresAt = new Date(now.getTime() + OTP_TTL_MS);
  const codeHash = hashOtp(phone, code);

  await prisma.otp.upsert({
    where: { phone },
    create: {
      phone,
      codeHash,
      purpose,
      expiresAt,
      attempts: 0,
      sendCount: 1,
      lastSentAt: now,
    },
    update: {
      codeHash,
      purpose,
      expiresAt,
      attempts: 0,
      consumedAt: null,
      sendCount: { increment: 1 },
      lastSentAt: now,
    },
  });

  try {
    const smsProvider = getSmsProvider();
    await smsProvider.sendVerificationCode(phone, code, purpose);
  } catch (error) {
    console.error("[otp] SMS delivery failed", error);
    return {
      ok: false,
      reason: "SMS_FAILED",
      retryAfterSeconds: Math.ceil(OTP_COOLDOWN_MS / 1000),
    };
  }

  return {
    ok: true,
    expiresAt,
    retryAfterSeconds: Math.ceil(OTP_COOLDOWN_MS / 1000),
  };
}

export async function verifyOtp(
  phone: string,
  code: string,
  purpose: OtpPurpose,
): Promise<{ valid: boolean }> {
  const prisma = getPrisma();
  const record = await prisma.otp.findUnique({ where: { phone } });

  if (!record || record.purpose !== purpose) {
    return { valid: false };
  }

  const isExpired = record.expiresAt.getTime() < Date.now();
  const isConsumed = record.consumedAt !== null;
  const isBlocked = record.attempts >= MAX_ATTEMPTS;

  if (isExpired || isConsumed || isBlocked) {
    return { valid: false };
  }

  const isValid = codesMatch(record.codeHash, phone, code);

  await prisma.otp.update({
    where: { phone },
    data: {
      attempts: { increment: 1 },
      consumedAt: isValid ? new Date() : undefined,
    },
  });

  return { valid: isValid };
}

/**
 * Guest checkout check: the phone must have been verified for the checkout
 * purpose recently. The consumed OTP record doubles as the proof, so no extra
 * token has to be trusted from the client.
 */
export async function hasRecentCheckoutVerification(
  phone: string,
  maxAgeMs = 30 * 60 * 1000,
): Promise<boolean> {
  const record = await getPrisma().otp.findUnique({ where: { phone } });

  if (!record || record.purpose !== "checkout" || !record.consumedAt) {
    return false;
  }

  return Date.now() - record.consumedAt.getTime() <= maxAgeMs;
}
