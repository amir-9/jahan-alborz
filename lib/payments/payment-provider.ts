/**
 * Payment provider abstraction.
 *
 * The project intentionally does not ship a fake gateway. `manual` is the only
 * active provider: it records that payment is still pending and tells the
 * customer that the store will coordinate payment. A real gateway (Zarinpal or
 * another Iranian PSP) must implement PaymentProvider, verify its callback,
 * and only then may an order be marked as PAID.
 */

export type PaymentProviderId = "online" | "cod";

export type PaymentInitiationInput = {
  orderNumber: string;
  /** Amount in Toman, as stored on the order. */
  amount: number;
  customerPhone: string;
};

export type PaymentInitiationResult = {
  /**
   * `manual` means no gateway was started and the order stays unpaid.
   * `redirect` is only returned by a real, configured gateway.
   */
  status: "manual" | "redirect";
  redirectUrl?: string;
  message: string;
};

export type PaymentProvider = {
  id: PaymentProviderId;
  initiate: (input: PaymentInitiationInput) => Promise<PaymentInitiationResult>;
};

const manualOnlineProvider: PaymentProvider = {
  id: "online",
  async initiate() {
    return {
      status: "manual",
      message:
        "درگاه پرداخت آنلاین در این نسخه فعال نشده است. سفارش شما ثبت شد و برای هماهنگی پرداخت با شما تماس می‌گیریم. سفارش تا تأیید پرداخت، پرداخت‌شده محسوب نمی‌شود.",
    };
  },
};

const cashOnDeliveryProvider: PaymentProvider = {
  id: "cod",
  async initiate() {
    return {
      status: "manual",
      message:
        "روش پرداخت در محل انتخاب شده است. مبلغ سفارش هنگام تحویل دریافت می‌شود.",
    };
  },
};

const providers: Record<PaymentProviderId, PaymentProvider> = {
  online: manualOnlineProvider,
  cod: cashOnDeliveryProvider,
};

export function getPaymentProvider(
  method: "ONLINE" | "COD",
): PaymentProvider {
  return method === "ONLINE" ? providers.online : providers.cod;
}

/** Whether an online gateway is configured. Currently always false. */
export function isOnlineGatewayConfigured(): boolean {
  return false;
}
