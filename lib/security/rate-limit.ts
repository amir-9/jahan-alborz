import { getPrisma } from "@/lib/db/prisma";

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
};

/**
 * Fixed-window rate limiter backed by PostgreSQL.
 *
 * Database-backed counters work across serverless instances, unlike an
 * in-memory map. Callers on critical paths should fail closed when the store
 * throws: if rate limiting cannot be checked, the operation is not allowed.
 */
export async function consumeRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const prisma = getPrisma();
  const now = new Date();

  return prisma.$transaction(async (tx) => {
    const existing = await tx.rateLimit.findUnique({ where: { key } });

    if (
      !existing ||
      existing.windowStart.getTime() + windowMs <= now.getTime()
    ) {
      const resetAt = new Date(now.getTime() + windowMs);

      await tx.rateLimit.upsert({
        where: { key },
        create: { key, count: 1, windowStart: now },
        update: { count: 1, windowStart: now },
      });

      return { allowed: true, remaining: limit - 1, resetAt };
    }

    const resetAt = new Date(existing.windowStart.getTime() + windowMs);

    if (existing.count >= limit) {
      return { allowed: false, remaining: 0, resetAt };
    }

    const updated = await tx.rateLimit.update({
      where: { key },
      data: { count: { increment: 1 } },
    });

    return {
      allowed: true,
      remaining: Math.max(0, limit - updated.count),
      resetAt,
    };
  });
}
