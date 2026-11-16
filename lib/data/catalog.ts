/**
 * Demo content for the public website.
 *
 * This data is clearly labelled demo content and will be replaced by
 * database-backed records in a later phase. Prices, stock levels, brands and
 * reviews are illustrative and must not be presented as verified real data.
 */

export type ProductSpecification = {
  label: string;
  value: string;
};

export type ProductVisual = "boiler" | "radiator" | "parts" | "installation";

export type Product = {
  id: string;
  name: string;
  slug: string;
  categorySlug: string;
  /** Resolved category title when the product comes from the database. */
  categoryName?: string;
  description: string;
  brand: string;
  sku: string;
  price: number;
  discountedPrice?: number;
  inventory: number;
  purchasingMode: "FIXED" | "QUOTE";
  isFeatured: boolean;
  isBestSeller: boolean;
  rating: number;
  reviewCount: number;
  visual: ProductVisual;
  specifications: ProductSpecification[];
};

export type ProductCategory = {
  slug: string;
  name: string;
  description: string;
  visual: ProductVisual;
};

export const productCategories: ProductCategory[] = [
  {
    slug: "pki",
    name: "پکیج",
    description: "پکیج دیواری و زمینی برای گرمایش و آب گرم مصرفی خانه",
    visual: "boiler",
  },
  {
    slug: "radiator",
    name: "رادیاتور",
    description: "رادیاتور پنلی، لوله‌ای و حوله‌ای در ابعاد مختلف",
    visual: "radiator",
  },
  {
    slug: "spare-parts",
    name: "قطعات و لوازم یدکی",
    description: "قطعات مصرفی و یدکی پکیج، رادیاتور و سیستم گرمایشی",
    visual: "parts",
  },
  {
    slug: "installation",
    name: "لوازم نصب و اتصالات",
    description: "اتصالات، شیرآلات و لوازم مورد نیاز نصب و راه‌اندازی",
    visual: "installation",
  },
];

export const products: Product[] = [
  {
    id: "pki-double-24",
    name: "پکیج دیواری دو مبدل ۲۴ هزار",
    slug: "pki-double-24",
    categorySlug: "pki",
    description:
      "پکیج دیواری دو مبدل با ظرفیت گرمایش ۲۴ هزار کیلوکالری، مناسب واحدهای مسکونی تا حدود ۱۰۰ متر مربع. دارای کنترل دیجیتال، نمایشگر دما و محفظه احتراق بسته.",
    brand: "بوتان",
    sku: "JA-PKI-2400",
    price: 48900000,
    discountedPrice: 45500000,
    inventory: 6,
    purchasingMode: "FIXED",
    isFeatured: true,
    isBestSeller: true,
    rating: 4.7,
    reviewCount: 18,
    visual: "boiler",
    specifications: [
      { label: "نوع نصب", value: "دیواری" },
      { label: "ظرفیت گرمایش", value: "۲۴٬۰۰۰ کیلوکالری" },
      { label: "تعداد مبدل", value: "دو مبدل" },
      { label: "آب گرم مصرفی", value: "لحظه‌ای" },
      { label: "نوع سوخت", value: "گاز شهری" },
      { label: "کنترل", value: "دیجیتال با نمایشگر" },
    ],
  },
  {
    id: "pki-single-24",
    name: "پکیج دیواری تک مبدل ۲۴ هزار",
    slug: "pki-single-24",
    categorySlug: "pki",
    description:
      "پکیج دیواری تک مبدل با ابعاد جمع‌وجمع و مصرف بهینه، گزینه‌ای مناسب برای آپارتمان‌های کوچک. قیمت این محصول بر اساس شرایط نصب و موجودی اعلام می‌شود.",
    brand: "ایران رادیاتور",
    sku: "JA-PKI-2410",
    price: 0,
    inventory: 4,
    purchasingMode: "QUOTE",
    isFeatured: true,
    isBestSeller: false,
    rating: 4.5,
    reviewCount: 9,
    visual: "boiler",
    specifications: [
      { label: "نوع نصب", value: "دیواری" },
      { label: "ظرفیت گرمایش", value: "۲۴٬۰۰۰ کیلوکالری" },
      { label: "تعداد مبدل", value: "تک مبدل" },
      { label: "نوع سوخت", value: "گاز شهری" },
      { label: "کنترل", value: "دیجیتال" },
    ],
  },
  {
    id: "pki-floor-30",
    name: "پکیج زمینی ۳۰ هزار",
    slug: "pki-floor-30",
    categorySlug: "pki",
    description:
      "پکیج زمینی با ظرفیت ۳۰ هزار کیلوکالری برای فضاهای بزرگ‌تر و چند واحد. طراحی بدنه ایستاده، دسترسی آسان برای سرویس و کنترل دمای مستقل.",
    brand: "بوتان",
    sku: "JA-PKI-3001",
    price: 62400000,
    inventory: 2,
    purchasingMode: "FIXED",
    isFeatured: true,
    isBestSeller: false,
    rating: 4.6,
    reviewCount: 7,
    visual: "boiler",
    specifications: [
      { label: "نوع نصب", value: "زمینی" },
      { label: "ظرفیت گرمایش", value: "۳۰٬۰۰۰ کیلوکالری" },
      { label: "تعداد مبدل", value: "دو مبدل" },
      { label: "نوع سوخت", value: "گاز شهری" },
      { label: "کنترل", value: "دیجیتال" },
    ],
  },
  {
    id: "rad-panel-600",
    name: "رادیاتور پنلی ۶۰۰×۱۰۰۰",
    slug: "rad-panel-600",
    categorySlug: "radiator",
    description:
      "رادیاتور پنلی فولادی با ارتفاع ۶۰ و طول ۱۰۰ سانتی‌متر، مناسب نصب زیر پنجره و انتشار یکنواخت گرما در اتاق‌های نشیمن و خواب.",
    brand: "آلتون",
    sku: "JA-RAD-6010",
    price: 3850000,
    discountedPrice: 3420000,
    inventory: 18,
    purchasingMode: "FIXED",
    isFeatured: true,
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 24,
    visual: "radiator",
    specifications: [
      { label: "نوع", value: "پنلی فولادی" },
      { label: "ارتفاع", value: "۶۰۰ میلی‌متر" },
      { label: "طول", value: "۱۰۰۰ میلی‌متر" },
      { label: "فشار کاری", value: "تا ۶ بار" },
      { label: "رنگ", value: "سفید" },
    ],
  },
  {
    id: "rad-tube-10",
    name: "رادیاتور لوله‌ای ۱۰ پره",
    slug: "rad-tube-10",
    categorySlug: "radiator",
    description:
      "رادیاتور لوله‌ای ۱۰ پره با سطح تبادل حرارت بالا و بدنه مقاوم، انتخابی اقتصادی برای اتاق‌های کوچک و متوسط.",
    brand: "ایران رادیاتور",
    sku: "JA-RAD-1001",
    price: 2450000,
    inventory: 24,
    purchasingMode: "FIXED",
    isFeatured: false,
    isBestSeller: true,
    rating: 4.4,
    reviewCount: 15,
    visual: "radiator",
    specifications: [
      { label: "نوع", value: "لوله‌ای" },
      { label: "تعداد پره", value: "۱۰ پره" },
      { label: "فشار کاری", value: "تا ۵ بار" },
      { label: "رنگ", value: "سفید" },
    ],
  },
  {
    id: "rad-towel-50",
    name: "رادیاتور حوله‌ای ۵۰×۸۰",
    slug: "rad-towel-50",
    categorySlug: "radiator",
    description:
      "رادیاتور حوله‌ای با طراحی جمع‌وجمع برای سرویس بهداشتی و حمام؛ گرمایش فضا و خشک‌کردن حوله به‌صورت هم‌زمان.",
    brand: "آلتون",
    sku: "JA-RAD-5080",
    price: 4200000,
    inventory: 7,
    purchasingMode: "FIXED",
    isFeatured: true,
    isBestSeller: false,
    rating: 4.6,
    reviewCount: 11,
    visual: "radiator",
    specifications: [
      { label: "نوع", value: "حوله‌ای" },
      { label: "ابعاد", value: "۵۰۰ × ۸۰۰ میلی‌متر" },
      { label: "فشار کاری", value: "تا ۵ بار" },
      { label: "رنگ", value: "کروم" },
    ],
  },
  {
    id: "part-thermostatic-valve",
    name: "شیر ترموستاتیک رادیاتور",
    slug: "part-thermostatic-valve",
    categorySlug: "spare-parts",
    description:
      "شیر ترموستاتیک با قابلیت تنظیم دمای اتاق و بستن خودکار مسیر آب هنگام رسیدن به دمای تنظیم‌شده؛ مناسب رادیاتورهای پنلی و لوله‌ای.",
    brand: "دانفوس",
    sku: "JA-VLV-1101",
    price: 1250000,
    inventory: 40,
    purchasingMode: "FIXED",
    isFeatured: false,
    isBestSeller: true,
    rating: 4.7,
    reviewCount: 31,
    visual: "parts",
    specifications: [
      { label: "نوع", value: "ترموستاتیک" },
      { label: "جنس بدنه", value: "برنج" },
      { label: "اتصال", value: "۱/۲ اینچ" },
      { label: "دمای قابل تنظیم", value: "۵ تا ۳۰ درجه" },
    ],
  },
  {
    id: "part-circulation-pump",
    name: "پمپ سیرکولاسیون خطی",
    slug: "part-circulation-pump",
    categorySlug: "spare-parts",
    description:
      "پمپ سیرکولاسیون برای گردش یکنواخت آب در مدار گرمایش. دارای سه سرعت قابل تنظیم و بدنه چدنی مقاوم.",
    brand: "پنتاکس",
    sku: "JA-PMP-1202",
    price: 5600000,
    inventory: 9,
    purchasingMode: "FIXED",
    isFeatured: true,
    isBestSeller: false,
    rating: 4.5,
    reviewCount: 8,
    visual: "parts",
    specifications: [
      { label: "نوع", value: "سیرکولاسیون خطی" },
      { label: "سرعت", value: "سه حالته" },
      { label: "بدنه", value: "چدن" },
      { label: "اتصال", value: "۱ اینچ" },
    ],
  },
  {
    id: "part-plate-exchanger",
    name: "مبدل حرارتی صفحه‌ای",
    slug: "part-plate-exchanger",
    categorySlug: "spare-parts",
    description:
      "مبدل حرارتی صفحه‌ای استیل با راندمان بالا برای انتقال حرارت در سیستم‌های گرمایشی. انتخاب ظرفیت بر اساس مشاوره فنی انجام می‌شود.",
    brand: "سوپکو",
    sku: "JA-HX-1301",
    price: 0,
    inventory: 3,
    purchasingMode: "QUOTE",
    isFeatured: false,
    isBestSeller: false,
    rating: 4.6,
    reviewCount: 5,
    visual: "parts",
    specifications: [
      { label: "نوع", value: "صفحه‌ای" },
      { label: "جنس صفحات", value: "استیل" },
      { label: "نوع اتصال", value: "رزوه‌ای" },
    ],
  },
  {
    id: "install-kit",
    name: "ست اتصالات نصب پکیج",
    slug: "install-kit",
    categorySlug: "installation",
    description:
      "ست کامل اتصالات شامل شیرها، زانوها، لوله‌های انعطاف‌پذیر و واشرهای آب‌بندی برای نصب استاندارد پکیج دیواری.",
    brand: "استاندارد",
    sku: "JA-INS-2101",
    price: 1450000,
    discountedPrice: 1290000,
    inventory: 30,
    purchasingMode: "FIXED",
    isFeatured: true,
    isBestSeller: true,
    rating: 4.5,
    reviewCount: 22,
    visual: "installation",
    specifications: [
      { label: "محتویات", value: "شیر، زانو، لوله انعطاف‌پذیر" },
      { label: "جنس", value: "برنج و فولاد" },
      { label: "کاربرد", value: "پکیج دیواری" },
    ],
  },
  {
    id: "part-digital-thermostat",
    name: "ترموستات دیجیتال هوشمند",
    slug: "part-digital-thermostat",
    categorySlug: "spare-parts",
    description:
      "ترموستات دیجیتال با برنامه‌ریزی هفتگی و نمایشگر لمسی برای کنترل دقیق دمای محیط و کاهش مصرف انرژی.",
    brand: "زیمنس",
    sku: "JA-THM-1402",
    price: 2100000,
    inventory: 12,
    purchasingMode: "FIXED",
    isFeatured: false,
    isBestSeller: false,
    rating: 4.9,
    reviewCount: 14,
    visual: "parts",
    specifications: [
      { label: "نوع", value: "دیجیتال برنامه‌پذیر" },
      { label: "نمایشگر", value: "لمسی" },
      { label: "برنامه‌ریزی", value: "هفتگی" },
      { label: "منبع تغذیه", value: "باتری" },
    ],
  },
  {
    id: "part-safety-valve",
    name: "شیر اطمینان پکیج",
    slug: "part-safety-valve",
    categorySlug: "spare-parts",
    description:
      "شیر اطمینان ۳ بار برای محافظت از مدار آب در برابر افزایش فشار؛ قطعه‌ای مصرفی که تعویض به‌موقع آن از آسیب به پکیج جلوگیری می‌کند.",
    brand: "استاندارد",
    sku: "JA-VLV-1503",
    price: 780000,
    inventory: 50,
    purchasingMode: "FIXED",
    isFeatured: false,
    isBestSeller: true,
    rating: 4.4,
    reviewCount: 27,
    visual: "parts",
    specifications: [
      { label: "نوع", value: "شیر اطمینان" },
      { label: "فشار تنظیم", value: "۳ بار" },
      { label: "اتصال", value: "۱/۲ اینچ" },
      { label: "جنس", value: "برنج" },
    ],
  },
];

export type ProductOrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export type RepairService = {
  slug: string;
  name: string;
  description: string;
  features: string[];
  icon: "wrench" | "gauge" | "install" | "droplets" | "search";
};

export const repairServices: RepairService[] = [
  {
    slug: "repair-boiler",
    name: "تعمیر پکیج",
    description:
      "عیب‌یابی تخصصی و تعمیر قطعات پکیج شامل برد، پمپ، مبدل و شیرهای کنترل.",
    features: ["عیب‌یابی در محل", "تعویض قطعه با هماهنگی", "بررسی ایمنی پس از تعمیر"],
    icon: "wrench",
  },
  {
    slug: "maintenance-boiler",
    name: "سرویس دوره‌ای پکیج",
    description:
      "بازدید دوره‌ای، شستشوی مسیر آب و کنترل عملکرد اجزای اصلی برای حفظ راندمان.",
    features: ["شستشوی مبدل", "کنترل فشار و دما", "تنظیم احتراق توسط تکنسین"],
    icon: "gauge",
  },
  {
    slug: "install-boiler-radiator",
    name: "نصب پکیج و رادیاتور",
    description:
      "نصب استاندارد پکیج و رادیاتور با رعایت اصول لوله‌کشی، تهویه و ایمنی.",
    features: ["مشاوره انتخاب ظرفیت", "لوله‌کشی و اتصالات", "راه‌اندازی و آموزش"],
    icon: "install",
  },
  {
    slug: "descale-acid-wash",
    name: "رسوب‌زدایی و اسیدشویی",
    description:
      "حذف رسوبات آهکی مبدل و مدار آب برای بهبود انتقال حرارت و کاهش مصرف سوخت.",
    features: ["شستشوی مبدل", "بررسی نشتی پس از شستشو", "تست عملکرد مدار"],
    icon: "droplets",
  },
  {
    slug: "inspection-visit",
    name: "عیب‌یابی و بازدید",
    description:
      "بازدید فنی برای بررسی علت خرابی، اعلام هزینه و ارائه راهکار پیش از تعمیر.",
    features: ["بررسی کامل دستگاه", "توضیح شفاف عیب", "برآورد هزینه تعمیر"],
    icon: "search",
  },
];

export type CustomerReview = {
  id: string;
  author: string;
  city: string;
  rating: number;
  title: string;
  comment: string;
};

export const customerReviews: CustomerReview[] = [
  {
    id: "rev-1",
    author: "رضا",
    city: "قزوین",
    rating: 5,
    title: "سرویس سریع و منظم",
    comment:
      "برای سرویس دوره‌ای پکیج تماس گرفتم؛ زمان هماهنگ‌شده دقیق بود و بعد از کار توضیح کاملی درباره وضعیت دستگاه دادند.",
  },
  {
    id: "rev-2",
    author: "مریم",
    city: "قزوین",
    rating: 4,
    title: "مشاوره خوب قبل از خرید",
    comment:
      "برای انتخاب رادیاتور مناسب متراژ خانه مشاوره گرفتم. توضیحات فنی ساده و قابل فهم بود و در انتخاب نهایی کمک کرد.",
  },
  {
    id: "rev-3",
    author: "سعید",
    city: "کرج",
    rating: 5,
    title: "ارسال منظم قطعات",
    comment:
      "قطعه یدکی پکیج را سفارش دادم و با هماهنگی تلفنی ارسال شد. بسته‌بندی مناسب بود و قطعه مطابق توضیحات سایت بود.",
  },
];

export type BlogSection = {
  heading: string;
  paragraphs: string[];
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: number;
  publishedAt: string;
  sections: BlogSection[];
};

export const blogPosts: BlogPost[] = [
  {
    id: "blog-1",
    slug: "boiler-no-hot-water",
    title: "چرا پکیج شما آب گرم کافی ندارد؟ ۶ علت رایج",
    excerpt:
      "کاهش دمای آب گرم همیشه به معنی خرابی پکیج نیست. چند علت رایج و کارهایی که پیش از تماس با تکنسین می‌توانید بررسی کنید.",
    category: "نگهداری و تعمیر",
    readTime: 5,
    publishedAt: "2026-10-12",
    sections: [
      {
        heading: "از کجا شروع کنیم؟",
        paragraphs: [
          "اگر آب گرم پکیج دیواری خیلی داغ یا خیلی سرد است، نخستین قدم بررسی تنظیمات است. دمای آب گرم مصرفی و فشار مدار گرمایش را روی نمایشگر دستگاه بررسی کنید. فشار بسیار پایین یا بسیار بالا می‌تواند عملکرد دستگاه را مختل کند.",
          "پیش از هر کاری، دفترچه راهنمای دستگاه را ببینید. بعضی مدل‌ها دارای حالت تابستانه و زمستانه هستند و انتخاب اشتباه حالت، تصور خرابی را ایجاد می‌کند.",
        ],
      },
      {
        heading: "۱. گرفتگی مبدل آب گرم",
        paragraphs: [
          "رسوب آهکی داخل مبدل، مسیر انتقال حرارت را محدود می‌کند. نشانه رایج آن این است که آب گرم با دبی کم اما دمای بالا خارج می‌شود. شستشوی تخصصی مبدل معمولاً این مشکل را برطرف می‌کند.",
          "شستشوی مبدل را به تکنسین بسپارید؛ استفاده از محلول‌های نامناسب می‌تواند به صفحات مبدل آسیب بزند.",
        ],
      },
      {
        heading: "۲. تنظیم نادرست فشار و جریان",
        paragraphs: [
          "شیر ورودی آب سرد و شیرهای مصرف را بررسی کنید. کاهش فشار شبکه آب در ساعات پیک مصرف نیز می‌تواند دمای آب گرم را تحت تأثیر قرار دهد.",
        ],
      },
      {
        heading: "۳. سنسور دما و برد کنترل",
        paragraphs: [
          "اگر دمای نمایشگر با دمای واقعی آب تفاوت دارد یا دستگاه خطا نشان می‌دهد، احتمال خرابی سنسور یا برد وجود دارد. این مورد نیاز به عیب‌یابی با ابزار اندازه‌گیری دارد.",
        ],
      },
      {
        heading: "چه زمانی تماس بگیریم؟",
        paragraphs: [
          "در صورت مشاهده نشتی، بوی گاز، صدای غیرعادی شدید یا خطای تکرارشونده، دستگاه را خاموش کنید و با تکنسین تماس بگیرید. باز کردن محفظه احتراق و دستکاری مسیر گاز بدون تخصص می‌تواند خطرناک باشد.",
        ],
      },
    ],
  },
  {
    id: "blog-2",
    slug: "choosing-the-right-radiator",
    title: "راهنمای انتخاب رادیاتور متناسب با فضای خانه",
    excerpt:
      "ظرفیت، ابعاد، نوع پنلی یا لوله‌ای و محل نصب؛ نکاتی که پیش از خرید رادیاتور باید در نظر بگیرید.",
    category: "راهنمای خرید",
    readTime: 7,
    publishedAt: "2026-09-28",
    sections: [
      {
        heading: "ابتدا ظرفیت گرمایشی را مشخص کنید",
        paragraphs: [
          "انتخاب رادیاتور فقط بر اساس ابعاد ظاهری انجام نمی‌شود. متراژ فضا، کیفیت عایق‌بندی، تعداد و نوع پنجره‌ها و ارتفاع سقف در محاسبه ظرفیت مؤثر است. رادیاتور کوچک برای فضای بزرگ، مصرف انرژی را بالا می‌برد و گرمایش یکنواخت ایجاد نمی‌کند.",
          "برای محاسبه دقیق، بهتر است از مشاوره فنی استفاده کنید؛ به‌ویژه اگر تغییرات ساختمانی یا پنجره‌های بزرگ دارید.",
        ],
      },
      {
        heading: "پنلی یا لوله‌ای؟",
        paragraphs: [
          "رادیاتور پنلی سطح صاف و یکنواختی دارد و برای فضاهای مدرن و نصب زیر پنجره مناسب است. رادیاتور لوله‌ای معمولاً اقتصادی‌تر است و در بسیاری از پروژه‌ها انتخاب می‌شود.",
          "در محیط‌های مرطوب مانند حمام، رادیاتور حوله‌ای گزینه‌ای کاربردی است.",
        ],
      },
      {
        heading: "محل نصب را درست انتخاب کنید",
        paragraphs: [
          "نصب زیر پنجره به توزیع بهتر هوا کمک می‌کند، اما باید فاصله کافی از کف و دیوار رعایت شود. مسدود کردن مسیر گردش هوا با پرده یا مبلمان، راندمان رادیاتور را کاهش می‌دهد.",
        ],
      },
      {
        heading: "به شیر و اتصالات توجه کنید",
        paragraphs: [
          "استفاده از شیر ترموستاتیک امکان کنترل دمای هر اتاق را فراهم می‌کند. کیفیت شیرها و اتصالات در طول عمر و ایمنی سیستم اهمیت زیادی دارد.",
        ],
      },
    ],
  },
  {
    id: "blog-3",
    slug: "boiler-maintenance-schedule",
    title: "سرویس دوره‌ای پکیج؛ چه زمانی و چگونه؟",
    excerpt:
      "سرویس منظم پکیج، هزینه تعمیرات ناگهانی را کاهش می‌دهد. زمان‌بندی پیشنهادی و مواردی که در هر بازدید بررسی می‌شود.",
    category: "نگهداری و تعمیر",
    readTime: 4,
    publishedAt: "2026-09-10",
    sections: [
      {
        heading: "چرا سرویس دوره‌ای مهم است؟",
        paragraphs: [
          "در طول کار پکیج، رسوب و گردوغبار در مسیرهای آب و هوا تجمع می‌کند. سرویس دوره‌ای این تجمع را کنترل می‌کند و از افت راندمان، مصرف سوخت بیشتر و خرابی قطعات جلوگیری می‌کند.",
        ],
      },
      {
        heading: "بازه پیشنهادی",
        paragraphs: [
          "برای استفاده معمول خانگی، یک بار سرویس در سال و پیش از شروع فصل سرد منطقی است. در صورت استفاده سنگین یا کیفیت پایین آب، بازه کوتاه‌تر توصیه می‌شود.",
        ],
      },
      {
        heading: "در سرویس چه کارهایی انجام می‌شود؟",
        paragraphs: [
          "بررسی فشار مدار، شستشوی مبدل در صورت نیاز، کنترل نشتی، بررسی عملکرد پمپ و شیرها و تنظیم پارامترهای احتراق از جمله موارد رایج است.",
          "هرگونه دخالت در مسیر گاز و محفظه احتراق باید توسط تکنسین مجاز انجام شود.",
        ],
      },
    ],
  },
];

export type Faq = {
  id: string;
  question: string;
  answer: string;
};

export const faqs: Faq[] = [
  {
    id: "faq-shipping",
    question: "ارسال محصولات به کدام شهرها انجام می‌شود؟",
    answer:
      "فروش محصولات به سراسر ایران انجام می‌شود. روش و هزینه ارسال بر اساس شهر مقصد، ابعاد و وزن محموله تعیین و پیش از نهایی‌سازی با شما هماهنگ می‌شود.",
  },
  {
    id: "faq-service-area",
    question: "خدمات تعمیر و نصب در چه محدوده‌ای ارائه می‌شود؟",
    answer:
      "خدمات تعمیر، سرویس و نصب در شهر قزوین ارائه می‌شود. برای هماهنگی بازدید، فرم درخواست خدمات را تکمیل کنید یا با شماره فروشگاه تماس بگیرید.",
  },
  {
    id: "faq-quote",
    question: "چرا قیمت برخی محصولات نمایش داده نمی‌شود؟",
    answer:
      "بعضی محصولات بر اساس مدل، ظرفیت، موجودی یا شرایط نصب قیمت متفاوتی دارند. برای این محصولات دکمه استعلام قیمت فعال است و کارشناسان ما پس از بررسی، قیمت و شرایط را اعلام می‌کنند.",
  },
  {
    id: "faq-installation",
    question: "آیا نصب پکیج و رادیاتور هم انجام می‌دهید؟",
    answer:
      "بله. نصب پکیج و رادیاتور با هماهنگی قبلی و در محدوده شهر قزوین انجام می‌شود. پیش از نصب، شرایط محل و ظرفیت مورد نیاز بررسی می‌شود.",
  },
  {
    id: "faq-warranty",
    question: "گارانتی محصولات چگونه است؟",
    answer:
      "شرایط گارانتی به برند و مدل محصول وابسته است و در زمان خرید به‌صورت شفاف اعلام می‌شود. برای اطلاع دقیق از شرایط هر محصول، پیش از خرید با ما تماس بگیرید.",
  },
  {
    id: "faq-payment",
    question: "روش‌های پرداخت کدام‌اند؟",
    answer:
      "پرداخت آنلاین و پرداخت در محل در مراحل بعدی توسعه سایت فعال می‌شود. تا آن زمان برای هماهنگی خرید و پرداخت با فروشگاه تماس بگیرید.",
  },
  {
    id: "faq-technician",
    question: "هزینه بازدید و عیب‌یابی چگونه محاسبه می‌شود؟",
    answer:
      "هزینه بازدید و عیب‌یابی بر اساس محدوده، نوع دستگاه و شرایط مراجعه تعیین می‌شود. پیش از مراجعه، محدوده هزینه به‌صورت تلفنی اعلام می‌شود تا تصمیم‌گیری شفاف باشد.",
  },
  {
    id: "faq-emergency",
    question: "در صورت نشتی گاز چه باید کرد؟",
    answer:
      "در صورت بوی گاز، فوراً شیر اصلی گاز را ببندید، از روشن و خاموش کردن کلیدهای برق خودداری کنید، پنجره‌ها را باز کنید و محل را ترک کنید. سپس از خارج ساختمان با شماره امداد گاز یا آتش‌نشانی تماس بگیرید.",
  },
];

/** Map purchasing modes to Persian labels used across the UI. */
export const purchasingModeLabels: Record<Product["purchasingMode"], string> = {
  FIXED: "قیمت مشخص",
  QUOTE: "استعلام قیمت",
};
