import { z } from "zod";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const adminFaqSchema = z.object({
  question: z
    .string()
    .trim()
    .min(5, "سوال را کامل وارد کنید.")
    .max(200, "سوال بیش از حد طولانی است."),
  answer: z
    .string()
    .trim()
    .min(10, "پاسخ باید حداقل ۱۰ کاراکتر باشد.")
    .max(2000, "پاسخ بیش از حد طولانی است."),
  category: z
    .string()
    .trim()
    .max(60, "دسته‌بندی بیش از حد طولانی است.")
    .optional(),
  sortOrder: z.coerce
    .number()
    .int("ترتیب نمایش باید عدد صحیح باشد.")
    .min(0, "ترتیب نمایش نمی‌تواند منفی باشد.")
    .max(999, "ترتیب نمایش بیش از حد بزرگ است."),
  isActive: z.boolean(),
});

export const adminBlogSectionSchema = z.object({
  heading: z
    .string()
    .trim()
    .min(2, "عنوان بخش را وارد کنید.")
    .max(150, "عنوان بخش بیش از حد طولانی است."),
  paragraphs: z
    .array(z.string().trim().min(1).max(4000))
    .min(1, "هر بخش باید حداقل یک پاراگراف داشته باشد.")
    .max(20, "تعداد پاراگراف‌های هر بخش بیش از حد مجاز است."),
});

export const adminBlogPostSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(3, "نامک را وارد کنید.")
    .max(100, "نامک بیش از حد طولانی است.")
    .regex(
      slugPattern,
      "نامک فقط می‌تواند شامل حروف کوچک انگلیسی، رقم و خط تیره باشد.",
    ),
  title: z
    .string()
    .trim()
    .min(5, "عنوان مطلب را وارد کنید.")
    .max(160, "عنوان مطلب بیش از حد طولانی است."),
  excerpt: z
    .string()
    .trim()
    .min(20, "خلاصه باید حداقل ۲۰ کاراکتر باشد.")
    .max(400, "خلاصه بیش از حد طولانی است."),
  category: z
    .string()
    .trim()
    .max(60, "دسته‌بندی بیش از حد طولانی است.")
    .optional(),
  readTime: z.coerce
    .number()
    .int("زمان مطالعه باید عدد صحیح باشد.")
    .min(1, "زمان مطالعه باید حداقل ۱ دقیقه باشد.")
    .max(120, "زمان مطالعه بیش از حد بزرگ است."),
  author: z
    .string()
    .trim()
    .max(80, "نام نویسنده بیش از حد طولانی است.")
    .optional(),
  sections: z
    .array(adminBlogSectionSchema)
    .min(1, "مطلب باید حداقل یک بخش داشته باشد.")
    .max(30, "تعداد بخش‌های مطلب بیش از حد مجاز است."),
  isPublished: z.boolean(),
});

export type AdminFaqInput = z.infer<typeof adminFaqSchema>;
export type AdminBlogPostInput = z.infer<typeof adminBlogPostSchema>;
