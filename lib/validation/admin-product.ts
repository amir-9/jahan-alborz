import { z } from "zod";

export const adminProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "نام محصول را کامل وارد کنید.")
    .max(160, "نام محصول بیش از حد طولانی است."),
  slug: z
    .string()
    .trim()
    .min(2, "نامک محصول را وارد کنید.")
    .max(160, "نامک محصول بیش از حد طولانی است.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "نامک فقط می‌تواند شامل حروف کوچک انگلیسی، رقم و خط تیره باشد.",
    ),
  categoryId: z.string().trim().optional(),
  description: z
    .string()
    .trim()
    .min(10, "توضیحات محصول را کامل‌تر وارد کنید.")
    .max(5000, "توضیحات محصول بیش از حد طولانی است."),
  brand: z
    .string()
    .trim()
    .max(80, "نام برند بیش از حد طولانی است.")
    .optional(),
  sku: z
    .string()
    .trim()
    .max(60, "کد کالا بیش از حد طولانی است.")
    .optional(),
  price: z.coerce
    .number()
    .int("قیمت باید عدد صحیح باشد.")
    .min(0, "قیمت نمی‌تواند منفی باشد.")
    .max(1_000_000_000, "قیمت بیش از حد مجاز است."),
  discountedPrice: z.preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    z.coerce
      .number()
      .int("قیمت با تخفیف باید عدد صحیح باشد.")
      .min(1, "قیمت با تخفیف باید بزرگ‌تر از صفر باشد.")
      .max(1_000_000_000, "قیمت با تخفیف بیش از حد مجاز است.")
      .optional(),
  ),
  inventory: z.coerce
    .number()
    .int("موجودی باید عدد صحیح باشد.")
    .min(0, "موجودی نمی‌تواند منفی باشد.")
    .max(1_000_000, "موجودی بیش از حد مجاز است."),
  purchasingMode: z.enum(["FIXED", "QUOTE"], {
    message: "نوع خرید را انتخاب کنید.",
  }),
  visual: z.enum(["boiler", "radiator", "parts", "installation"], {
    message: "تصویر شماتیک را انتخاب کنید.",
  }),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  isBestSeller: z.boolean(),
}).refine(
  (data) => data.purchasingMode === "QUOTE" || data.price > 0,
  {
    message: "برای محصول با قیمت ثابت، قیمت بزرگ‌تر از صفر وارد کنید.",
    path: ["price"],
  },
);

export type AdminProductInput = z.input<typeof adminProductSchema>;
