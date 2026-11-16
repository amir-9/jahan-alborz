import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

function getSecret(): string {
  const secret =
    process.env.ORDER_ACCESS_SECRET ?? process.env.NEXTAUTH_SECRET ?? "";

  if (!secret) {
    throw new Error(
      "ORDER_ACCESS_SECRET or NEXTAUTH_SECRET must be configured to sign order access cookies.",
    );
  }

  return secret;
}

function sign(orderNumber: string): string {
  return createHmac("sha256", getSecret())
    .update(`order-access:${orderNumber}`)
    .digest("hex");
}

export function getOrderAccessCookieName(orderNumber: string): string {
  return `ja_order_${orderNumber}`;
}

function tokensMatch(expected: string, actual: string): boolean {
  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(actual);

  if (expectedBuffer.length !== actualBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, actualBuffer);
}

/**
 * Grants the current browser read access to one order. The cookie is signed, so
 * a guest cannot enumerate other order numbers.
 */
export async function grantOrderAccess(orderNumber: string): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(getOrderAccessCookieName(orderNumber), sign(orderNumber), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });
}

export async function hasOrderAccess(
  orderNumber: string,
  orderOwnerId: string | null,
  sessionUserId: string | null,
): Promise<boolean> {
  if (orderOwnerId && sessionUserId && orderOwnerId === sessionUserId) {
    return true;
  }

  const token = (await cookies()).get(getOrderAccessCookieName(orderNumber))
    ?.value;

  if (!token) {
    return false;
  }

  try {
    return tokensMatch(sign(orderNumber), token);
  } catch (error) {
    console.error("[orders] access token check failed", error);
    return false;
  }
}
