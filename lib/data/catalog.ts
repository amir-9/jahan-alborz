/**
 * Sample content for public pages during the initial build phase.
 * These are clearly labeled demo values and will be replaced by
 * database content (Prisma) in later phases.
 */

export type ProductSpecification = {
  label: string;
  value: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  categorySlug: string;
  description: string;
  brand: string;
  price: number;
  discountedPrice?: number;
  inventory: number;
  purchasingMode: "FIXED" | "QUOTE";
  isFeatured: boolean;
  isBestSeller: boolean;
  specifications: ProductSpecification[];
};

export const productCategories = [
  {
    slug: "pki",
    name: "پکیج",
    description: "پکیج‌های تولید شده با فناوری روز و کیفیت بالا",
  },
  {
    slug: "radiator",
    name: "رادیاتور",
    description: "رادیاتورهای آلمانی و استاندارد برای مصالح مختلف",
  },
  {
    slug: "spare-parts",
    name: "قطعات و لوازم یدکی",
    description: "قطعات یدکی و لوازم جانبی برای پکیج و رادیاتور",
  },
  {
    slug: "installation",
    name: "لوازم نصب و اتصالات",
    description: "لوازم نصب، اتصالات و سیم‌کشی برای سیستم‌های گرمایشی",
  },
];

export const products: Product[] = [
  {
    id: "pki-1",
    name: "پکیج جتوری مدل J-500",
    slug: "pki-j500",
    categorySlug: "pki",
    description:
      "پکیج جتوری با ظرفیت ۵۰۰ لیتر، مناسب برای پروازهای خانگی و کوچک، با سیستم ایمنی و شستشوی خودکار.",
    brand: "JahanAlborz",
    price: 4500000,
    inventory: 5,
    purchasingMode: "FIXED",
    isFeatured: true,
    isBestSeller: true,
    specifications: [
      { label: "ظرفیت", value: "۵۰۰ لیتر" },
      { label: "نوع سیستم", value: "جتوری" },
      { label: "شستشوی خودکار", value: "فعال" },
      { label: "نوع برق", value: "220 ولت AC" },
    ],
  },
  {
    id: "pki-2",
    name: "پکیج سری اسنوا",
    slug: "pki-sena",
    categorySlug: "pki",
    description:
      "پکیج سری اسنوا با سیستم راندمان بالا؛ قیمت اعتبارنامه‌شده به‌ازای همه نیازهای خانگی.",
    brand: "Sanā",
    price: 5200000,
    inventory: 3,
    purchasingMode: "QUOTE",
    isFeatured: true,
    isBestSeller: false,
    specifications: [
      { label: "ظرفیت", value: "۴۵۰ لیتر" },
      { label: "راندمان حرارتی", value: "بالا" },
      { label: "نوع سیستم", value: "جتوری" },
    ],
  },
  {
    id: "rad-1",
    name: "رادیاتور آلمانی دیجیتال",
    slug: "rad-digital",
    categorySlug: "radiator",
    description:
      "رادیاتور دیجیتال با دو مزیت‌بخش کولر و بازدم، دمای متغیر و نصب آلمانی.",
    brand: "Alton",
    price: 1200000,
    inventory: 12,
    purchasingMode: "FIXED",
    isFeatured: false,
    isBestSeller: true,
    specifications: [
      { label: "نوع رادیاتور", value: "دیجیتال" },
      { label: "مزیت کولر", value: "فعال" },
      { label: "مزیت بازدم", value: "فعال" },
    ],
  },
  {
    id: "rad-2",
    name: "رادیاتور دیجیتال کلاژن",
    slug: "rad-cogen",
    categorySlug: "radiator",
    description:
      "رادیاتور برای پکیج‌های کپسولی و دیجیتال با پوشش حرارتی دو جزء.",
    brand: "Cogen",
    price: 980000,
    inventory: 8,
    purchasingMode: "FIXED",
    isFeatured: false,
    isBestSeller: false,
    specifications: [
      { label: "نوع رادیاتور", value: "دیجیتال" },
      { label: "برای پکیج کپسولی", value: "فعال" },
    ],
  },
];

export const repairServices = [
  {
    slug: "repair-boiler",
    name: "تعمیر پکیج",
    description: "عیب‌یابی، شکستگی قطعات و تعمیرات اصلی پکیج.",
  },
  {
    slug: "maintenance-boiler",
    name: "سرویس دوره‌ای پکیج",
    description: "سرویس دوره‌ای، شستشوی سیستم و کنترل کامل عملکرد.",
  },
  {
    slug: "install-boiler-radiator",
    name: "نصب پکیج و رادیاتور",
    description: "نصب تخصصی و ایمن پکیج و رادیاتور و اتصالات.",
  },
  {
    slug: "descale-acid-wash",
    name: "رسوب‌زدایی و اسیدشویی",
    description: "حذف رسوب و شستشوی اسیدی سیستم‌های پرکاربرد.",
  },
];

export const customerReviews = [
  {
    id: "rev-1",
    author: "رضا",
    rating: 5,
    title: "نصب و سرویس بی‌دغاز",
    comment:
      "تعمیر پکیج در قزوین را از این مجموعه تجربه کردیم؛ سریع، منظم و قیمت‌های شفاف.",
  },
  {
    id: "rev-2",
    author: "مریم",
    rating: 4,
    title: "کیفیت محصول و خدمات پس از فروش",
    comment:
      "خرید رادیاتور از فروشگاه با پشتیبانی فنی پس از فروش، انتخاب خوبی بود.",
  },
];

export const blogPosts = [
  {
    id: "blog-1",
    slug: "boiler-maintenance-tips",
    title: "۵ نکته برای نگهداری سالم پکیج",
    excerpt: "برنامه سرویس دوره‌ای، شستشوی سیستم و نکات ایمنی.",
    readTime: 4,
  },
  {
    id: "blog-2",
    slug: "radiator-installation-guide",
    title: "راهنمای نصب صحیح رادیاتور در منزل",
    excerpt: "نکات نصب آلمانی و اتصالات حرارتی.",
    readTime: 6,
  },
];
