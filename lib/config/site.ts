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
    province: "قزوین",
    country: "ایران",
    postalCode: "",
    fullAddress: "خیابان دانشگاه، قزوین، ایران",
  },

  business: {
    experienceYears: 2,
    serviceCoverageCity: "قزوین",
    productCoverage: "سراسر ایران",
    workHours: {
      days: "شنبه تا پنجشنبه",
      hours: "۹:۰۰ تا ۲۰:۰۰",
      friday: "جمعه: تعطیل",
    },
  },
} as const;

export const siteMetadata = {
  title: {
    default: "جهان البرز | فروشگاه تخصصی تجهیزات گرمایشی در قزوین",
    template: "%s | جهان البرز",
  },
  description:
    "فروشگاه جهان البرز؛ فروش پکیج، رادیاتور، قطعات و لوازم یدکی با ارسال به سراسر ایران و خدمات تعمیر، سرویس و نصب تجهیزات گرمایشی در قزوین.",
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
