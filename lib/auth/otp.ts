import { prisma } from "@/lib/db/prisma";
import { getSmsProvider } from "@/lib/sms/sms";

const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes
const MAX_ATTEMPTS = 3;

export async function createOtp(
  phone: string,
  purpose: string,
): Promise<{ code: string; expiresAt: Date }> {
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  const existingOtp = await prisma.otp.findUnique({ where: { phone } });

  if (existingOtp) {
    await prisma.otp.update({
      where: { phone: existingOtp.phone },
      data: {
        code,
        expiresAt: new Date(Date.now() + OTP_TTL_MS),
        attempts: 0,
        consumedAt: null,
      },
    });
  } else {
    await prisma.otp.create({
      data: {
        phone,
        code,
        purpose,
        expiresAt: new Date(Date.now() + OTP_TTL_MS),
        attempts: 0,
      },
    });
  }

  const smsProvider = getSmsProvider();
  await smsProvider.sendVerificationCode(phone, code, purpose);

  const otpRecord = await prisma.otp.findUnique({ where: { phone } });

  return { code, expiresAt: otpRecord?.expiresAt ?? new Date(Date.now() + OTP_TTL_MS) };
}

export async function verifyOtp(
  phone: string,
  code: string,
  purpose: string,
): Promise<{ valid: boolean; consumed: boolean }> {
  const otpRecord = await prisma.otp.findUnique({ where: { phone } });

  if (!otpRecord || otpRecord.purpose !== purpose) {
    return { valid: false, consumed: false };
  }

  const isExpired = otpRecord.expiresAt.getTime() < Date.now();
  const isConsumed = otpRecord.consumedAt !== null;

  if (isExpired || isConsumed || otpRecord.attempts >= MAX_ATTEMPTS) {
    return { valid: false, consumed: false };
  }

  const isCodeValid = otpRecord.code === code;

  await prisma.otp.update({
    where: { phone: otpRecord.phone },
    data: {
      attempts: otpRecord.attempts + 1,
      consumedAt: isCodeValid ? new Date() : otpRecord.consumedAt,
    },
  });

  if (!isCodeValid) {
    return { valid: false, consumed: false };
  }

  return { valid: true, consumed: true };
}
