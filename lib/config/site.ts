/**
 * Centralized business configuration for Jahan Alborz.
 * All contact information and site-wide business details live here
 * so they can be updated easily without touching business logic.
 */

const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const siteConfig = {
  name: "جهان البرز",
  nameEn: "Jahan Alborz",
  tagline: "فروشگاه تخصصی تجهیزات گرمایشی و خدمات تعمیر و نگهداری",

  url: configuredUrl,

  contact: {
    phone: process.env.NEXT_PUBLIC_PHONE ?? "+98 9100000000",
    phoneLabel: "تلفن",
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "+98 9110000000",
    whatsappLabel: "واتساپ",
    email: process.env.NEXT_PUBLIC_EMAIL ?? "info@jahan-alborz.ir",
  },

  address: {
    street: "خیابان دانشگاه",
    city: "قزوین",
    province: "اصفهان",
    country: "ایران",
    postalCode: "317000",
    fullAddress: "خیابان دانشگاه، قزوین، ایران",
  },

  business: {
    experienceYears: 1,
    serviceCoverageCity: "قزوین",
    productCoverage: "سراسر ایران",
  },
} as const;

export const siteMetadata = {
  title: {
    default: "جهان البرز",
    template: `%s | جهان البرز`,
  },
  description:
    "فروشگاه جهان البرز؛ فروش پکیج، رادیاتور، قطعات و لوازم یدکی و خدمات تعمیر و نگهداری تجهیزات گرمایشی در قزوین.",
  keywords: [
    "جهان البرز",
    "تجهیزات گرمایشی",
    "فروش پکیج",
    "فروش رادیاتور",
    "قطعات پکیج",
    "تعمیر پکیج در قزوین",
    "سرویس پکیج در قزوین",
    "خرید رادیاتور",
  ],
};

export type SiteConfig = typeof siteConfig;
export type SiteMetadata = typeof siteMetadata;
