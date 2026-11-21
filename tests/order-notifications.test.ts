import { beforeEach, describe, expect, it, vi } from "vitest";

const { sendTextMessage } = vi.hoisted(() => ({
  sendTextMessage: vi.fn(),
}));

vi.mock("@/lib/sms/sms", () => ({
  getSmsProvider: () => ({
    sendVerificationCode: vi.fn(),
    sendTextMessage,
  }),
}));

import { notifyNewOrder } from "@/lib/orders/notifications";

const order = {
  orderNumber: "JA-261122-654321",
  customerName: "علی احمدی",
  customerPhone: "09123456789",
  total: 250000,
  itemCount: 2,
  paymentMethod: "ONLINE" as const,
};

beforeEach(() => {
  sendTextMessage.mockReset();
  sendTextMessage.mockResolvedValue(undefined);
  process.env.ADMIN_ORDER_NOTIFY_PHONE = "";
});

describe("notifyNewOrder", () => {
  it("sends a confirmation to the customer", async () => {
    await notifyNewOrder(order);

    expect(sendTextMessage).toHaveBeenCalledTimes(1);
    const [phone, message, purpose] = sendTextMessage.mock.calls[0] ?? [];

    expect(phone).toBe(order.customerPhone);
    expect(purpose).toBe("order-customer-confirmation");
    expect(message).toContain(order.orderNumber);
    expect(message).toContain("ثبت شد");
    expect(message).not.toContain("تأیید شده");
  });

  it("also alerts the admin when a phone is configured", async () => {
    process.env.ADMIN_ORDER_NOTIFY_PHONE = "+989120000000";

    await notifyNewOrder(order);

    expect(sendTextMessage).toHaveBeenCalledTimes(2);
    const [phone, message, purpose] = sendTextMessage.mock.calls[1] ?? [];

    expect(phone).toBe("+989120000000");
    expect(purpose).toBe("order-admin-alert");
    expect(message).toContain(order.orderNumber);
    expect(message).toContain(order.customerPhone);
    expect(message).toContain("در انتظار پرداخت");
  });

  it("never rejects when SMS delivery fails", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    sendTextMessage.mockRejectedValue(new Error("provider down"));

    await expect(notifyNewOrder(order)).resolves.toBeUndefined();
    expect(errorSpy).toHaveBeenCalled();

    errorSpy.mockRestore();
  });
});
