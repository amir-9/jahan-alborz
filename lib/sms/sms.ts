/**
 * SMS provider abstraction.
 * Swap the implementation by changing the provider name in environment
 * variables (SMS_PROVIDER). The mock provider is used for development.
 */

export type SmsProvider = {
  sendVerificationCode: (phone: string, code: string, purpose: string) => Promise<void>;
};

function createMockSmsProvider(): SmsProvider {
  return {
    sendVerificationCode: async (phone: string, code: string, purpose: string) => {
      // Mock provider: safe for local development only.
      // OTP codes must never be exposed through real SMS providers in production.
      console.log(`[SMS MOCK] To ${phone} for ${purpose}: ${code}`);
    },
  };
}

const smsProviders: Record<string, SmsProvider> = {
  mock: createMockSmsProvider(),
};

export function getSmsProvider(): SmsProvider {
  const providerName = process.env.SMS_PROVIDER ?? "mock";
  return smsProviders[providerName] ?? smsProviders.mock;
}
