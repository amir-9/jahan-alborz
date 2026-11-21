import { describe, expect, it } from "vitest";
import {
  getPaymentProvider,
  isOnlineGatewayConfigured,
} from "@/lib/payments/payment-provider";

const input = {
  orderNumber: "JA-261121-123456",
  amount: 250000,
  customerPhone: "09123456789",
};

describe("getPaymentProvider", () => {
  it("returns the manual online provider", async () => {
    const provider = getPaymentProvider("ONLINE");

    expect(provider.id).toBe("online");
    const result = await provider.initiate(input);

    expect(result.status).toBe("manual");
    expect(result.redirectUrl).toBeUndefined();
    expect(result.message).toContain("پرداخت");
    expect(result.message.replace(/\u200c/g, "")).toContain("محسوب نمیشود");
  });

  it("returns the cash-on-delivery provider", async () => {
    const provider = getPaymentProvider("COD");

    expect(provider.id).toBe("cod");
    const result = await provider.initiate(input);

    expect(result.status).toBe("manual");
    expect(result.redirectUrl).toBeUndefined();
    expect(result.message).toContain("پرداخت در محل");
  });
});

describe("isOnlineGatewayConfigured", () => {
  it("is always false until a verified gateway is implemented", () => {
    expect(isOnlineGatewayConfigured()).toBe(false);
  });
});
