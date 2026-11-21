import { describe, expect, it } from "vitest";
import { checkoutSchema, type CheckoutInput } from "@/lib/validation/order";

function validInput(): CheckoutInput {
  return {
    items: [{ productId: "product-1", quantity: 2 }],
    customerName: "علی احمدی",
    customerPhone: "+98 912 345 6789",
    customerEmail: "ali@example.com",
    province: "قزوین",
    city: "قزوین",
    shippingAddress: "خیابان دانشگاه، پلاک ۱۲",
    postalCode: "1234567890",
    shippingMethod: "LOCAL",
    paymentMethod: "COD",
    notes: "",
    idempotencyKey: "checkout-key-12345",
  };
}

describe("checkoutSchema", () => {
  it("accepts a complete order and normalizes the phone number", () => {
    const result = checkoutSchema.safeParse(validInput());

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.customerPhone).toBe("09123456789");
      expect(result.data.items[0]?.quantity).toBe(2);
    }
  });

  it("accepts Persian digits in the phone number", () => {
    const input = validInput();
    input.customerPhone = "۰۹۱۲۳۴۵۶۷۸۹";

    const result = checkoutSchema.safeParse(input);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.customerPhone).toBe("09123456789");
    }
  });

  it("rejects an empty cart", () => {
    const input = validInput();
    input.items = [];

    const result = checkoutSchema.safeParse(input);

    expect(result.success).toBe(false);
  });

  it("rejects quantities outside the 1-20 range and non-integers", () => {
    for (const quantity of [0, 21, 1.5]) {
      const input = validInput();
      input.items = [{ productId: "p1", quantity }];

      expect(checkoutSchema.safeParse(input).success).toBe(false);
    }
  });

  it("rejects an invalid mobile number", () => {
    const input = validInput();
    input.customerPhone = "02112345678";

    expect(checkoutSchema.safeParse(input).success).toBe(false);
  });

  it("rejects malformed email and postal code", () => {
    const badEmail = validInput();
    badEmail.customerEmail = "not-an-email";
    expect(checkoutSchema.safeParse(badEmail).success).toBe(false);

    const badPostalCode = validInput();
    badPostalCode.postalCode = "1234";
    expect(checkoutSchema.safeParse(badPostalCode).success).toBe(false);
  });

  it("allows omitted optional fields", () => {
    const input = validInput();
    delete input.customerEmail;
    delete input.postalCode;
    delete input.notes;

    expect(checkoutSchema.safeParse(input).success).toBe(true);
  });

  it("rejects unsupported shipping and payment methods", () => {
    const badShipping = validInput();
    badShipping.shippingMethod = "DRONE" as CheckoutInput["shippingMethod"];
    expect(checkoutSchema.safeParse(badShipping).success).toBe(false);

    const badPayment = validInput();
    badPayment.paymentMethod = "CARD" as CheckoutInput["paymentMethod"];
    expect(checkoutSchema.safeParse(badPayment).success).toBe(false);
  });

  it("rejects an idempotency key that is too short", () => {
    const input = validInput();
    input.idempotencyKey = "abc";

    expect(checkoutSchema.safeParse(input).success).toBe(false);
  });
});
