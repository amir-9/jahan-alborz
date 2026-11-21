/**
 * SMS provider abstraction.
 *
 * The provider is selected with SMS_PROVIDER. Only providers that are known to
 * work with Iranian numbers are supported. The mock provider is development
 * only and logs messages to the server console; it is never used in production.
 */

export type SmsProvider = {
  sendVerificationCode: (
    phone: string,
    code: string,
    purpose: string,
  ) => Promise<void>;
  /** Sends a plain text notification (used for order alerts, not OTP codes). */
  sendTextMessage: (phone: string, message: string, purpose: string) => Promise<void>;
};

function assertDevelopmentProvider(provider: string) {
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      `SMS_PROVIDER=${provider} is not allowed in production. Configure Kavenegar or another Iranian provider.`,
    );
  }
}

function createMockSmsProvider(): SmsProvider {
  return {
    sendVerificationCode: async (phone, code, purpose) => {
      assertDevelopmentProvider("mock");
      console.info(`[SMS MOCK] To ${phone} for ${purpose}: ${code}`);
    },
    sendTextMessage: async (phone, message, purpose) => {
      assertDevelopmentProvider("mock");
      console.info(`[SMS MOCK] To ${phone} for ${purpose}: ${message}`);
    },
  };
}

/**
 * Kavenegar adapter using the official REST API.
 * Requires KAVENEGAR_API_KEY and KAVENEGAR_SENDER.
 */
function createKavenegarProvider(): SmsProvider {
  const getCredentials = () => {
    const apiKey = process.env.KAVENEGAR_API_KEY;
    const sender = process.env.KAVENEGAR_SENDER;

    if (!apiKey || !sender) {
      throw new Error(
        "KAVENEGAR_API_KEY and KAVENEGAR_SENDER are required for the Kavenegar provider.",
      );
    }

    return { apiKey, sender };
  };

  return {
    sendVerificationCode: async (phone, code, purpose) => {
      const { apiKey } = getCredentials();
      const template = process.env.KAVENEGAR_TEMPLATE ?? "jahan-alborz-otp";

      const body = new URLSearchParams({
        receptor: phone,
        template,
        token: code,
        type: "sms",
      });

      const response = await fetch(
        `https://api.kavenegar.com/v1/${apiKey}/verify/lookup.json`,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body,
          cache: "no-store",
        },
      );

      if (!response.ok) {
        const detail = await response.text().catch(() => "");
        throw new Error(
          `Kavenegar request failed (${response.status}) for ${purpose}: ${detail.slice(0, 200)}`,
        );
      }
    },
    sendTextMessage: async (phone, message, purpose) => {
      const { apiKey, sender } = getCredentials();

      const body = new URLSearchParams({
        receptor: phone,
        sender,
        message,
      });

      const response = await fetch(
        `https://api.kavenegar.com/v1/${apiKey}/sms/send.json`,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body,
          cache: "no-store",
        },
      );

      if (!response.ok) {
        const detail = await response.text().catch(() => "");
        throw new Error(
          `Kavenegar text message failed (${response.status}) for ${purpose}: ${detail.slice(0, 200)}`,
        );
      }
    },
  };
}

const smsProviders: Record<string, SmsProvider> = {
  mock: createMockSmsProvider(),
  kavenegar: createKavenegarProvider(),
};

export function getSmsProvider(): SmsProvider {
  const providerName = process.env.SMS_PROVIDER ?? "mock";

  if (process.env.NODE_ENV === "production" && providerName === "mock") {
    throw new Error(
      "SMS_PROVIDER=mock cannot be used in production. Set SMS_PROVIDER=kavenegar.",
    );
  }

  const provider = smsProviders[providerName];

  if (!provider) {
    throw new Error(
      `Unknown SMS provider "${providerName}". Supported values: ${Object.keys(smsProviders).join(", ")}.`,
    );
  }

  return provider;
}
