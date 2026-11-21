import { beforeEach, describe, expect, it, vi } from "vitest";

const { cookieStore } = vi.hoisted(() => ({
  cookieStore: {
    get: vi.fn(),
    set: vi.fn(),
  },
}));

vi.mock("next/headers", () => ({
  cookies: async () => cookieStore,
}));

import {
  getOrderAccessCookieName,
  grantOrderAccess,
  hasOrderAccess,
} from "@/lib/orders/access";

const ORDER = "JA-261121-123456";

beforeEach(() => {
  cookieStore.get.mockReset();
  cookieStore.set.mockReset();
  process.env.ORDER_ACCESS_SECRET = "unit-test-secret";
  delete process.env.NEXTAUTH_SECRET;
});

describe("getOrderAccessCookieName", () => {
  it("names the cookie after the order number", () => {
    expect(getOrderAccessCookieName(ORDER)).toBe(`ja_order_${ORDER}`);
  });
});

describe("grantOrderAccess", () => {
  it("sets a signed, httpOnly cookie scoped to the order", async () => {
    await grantOrderAccess(ORDER);

    expect(cookieStore.set).toHaveBeenCalledTimes(1);
    const [name, value, options] = cookieStore.set.mock.calls[0] ?? [];

    expect(name).toBe(`ja_order_${ORDER}`);
    expect(value).toMatch(/^[a-f0-9]{64}$/);
    expect(options).toMatchObject({
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
  });

  it("throws when no signing secret is configured", async () => {
    delete process.env.ORDER_ACCESS_SECRET;
    delete process.env.NEXTAUTH_SECRET;

    await expect(grantOrderAccess(ORDER)).rejects.toThrow(
      /ORDER_ACCESS_SECRET|NEXTAUTH_SECRET/,
    );
  });
});

describe("hasOrderAccess", () => {
  it("allows the owner of a logged-in order", async () => {
    expect(await hasOrderAccess(ORDER, "user-1", "user-1")).toBe(true);
    expect(cookieStore.get).not.toHaveBeenCalled();
  });

  it("denies a different signed-in user", async () => {
    cookieStore.get.mockReturnValue(undefined);

    expect(await hasOrderAccess(ORDER, "user-1", "user-2")).toBe(false);
  });

  it("accepts a valid signed guest cookie", async () => {
    await grantOrderAccess(ORDER);
    const token = cookieStore.set.mock.calls[0]?.[1] as string;
    cookieStore.get.mockReturnValue({ value: token });

    expect(await hasOrderAccess(ORDER, null, null)).toBe(true);
  });

  it("rejects a tampered cookie", async () => {
    cookieStore.get.mockReturnValue({ value: "f".repeat(64) });

    expect(await hasOrderAccess(ORDER, null, null)).toBe(false);
  });

  it("rejects a valid cookie reused for a different order", async () => {
    await grantOrderAccess(ORDER);
    const token = cookieStore.set.mock.calls[0]?.[1] as string;
    cookieStore.get.mockReturnValue({ value: token });

    expect(
      await hasOrderAccess("JA-261121-999999", null, null),
    ).toBe(false);
  });

  it("denies access when no secret is configured", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    cookieStore.get.mockReturnValue({ value: "a".repeat(64) });
    delete process.env.ORDER_ACCESS_SECRET;
    delete process.env.NEXTAUTH_SECRET;

    expect(await hasOrderAccess(ORDER, null, null)).toBe(false);
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
