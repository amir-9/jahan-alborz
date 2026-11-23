import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import {
  ArrowLeft,
  CalendarCheck,
  Check,
  ClipboardList,
  Clock,
  Headset,
  Mail,
  MapPin,
  PackageCheck,
  Phone,
  Quote,
  ShieldCheck,
  Truck,
  Wrench,
} from "lucide-react";
import { Hero } from "@/components/home/hero";
import { CategoryCard } from "@/components/shop/category-card";
import { ProductCard } from "@/components/shop/product-card";
import { ServiceCard } from "@/components/services/service-card";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { StarRating } from "@/components/shared/star-rating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config/site";
import { customerReviews, repairServices } from "@/lib/data/catalog";
import { getProductMedia } from "@/lib/media/catalog-media";
import {
  getBlogPosts,
  getCategories,
  getProducts,
} from "@/lib/data/catalog-repository";
import {
  formatDate,
  formatNumber,
  toTelHref,
  toWhatsAppHref,
} from "@/lib/utils/format";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

const trustItems = [
  {
    icon: Truck,
    title: "ارسال به سراسر ایران",
    description: "روش و هزینه ارسال پیش از تأیید سفارش هماهنگ می‌شود",
  },
  {
    icon: Wrench,
    title: "خدمات در قزوین",
    description: "تعمیر، سرویس دوره‌ای و نصب با هماهنگی قبلی",
  },
  {
    icon: PackageCheck,
    title: "تأمین قطعات یدکی",
    description: "قطعات مصرفی و یدکی پکیج و رادیاتور",
  },
  {
    icon: Headset,
    title: "مشاوره پیش از خرید",
    description: "بررسی نیاز فنی و انتخاب ظرفیت مناسب",
  },
];

const whyUs = [
  {
    icon: Headset,
    title: "مشاوره فنی، پیش از خرید",
    description:
      "ظرفیت گرمایشی، ابعاد فضا و شرایط نصب را بررسی می‌کنیم تا انتخاب متناسب‌تری داشته باشید.",
  },
  {
    icon: PackageCheck,
    title: "تأمین قطعات و لوازم",
    description:
      "قطعات مصرفی و یدکی پکیج و رادیاتور با هماهنگی موجودی و مدل دستگاه تأمین می‌شود.",
  },
  {
    icon: Wrench,
    title: "خدمات میدانی در قزوین",
    description:
      "بازدید، عیب‌یابی، نصب و سرویس با زمان‌بندی هماهنگ‌شده و توضیح شفاف مراحل کار.",
  },
  {
    icon: ShieldCheck,
    title: "پیگیری پس از فروش",
    description:
      "پس از خرید یا خدمات، برای پیگیری وضعیت و پاسخ به سوالات فنی در دسترس هستیم.",
  },
];

const processSteps = [
  {
    icon: ClipboardList,
    title: "بررسی نیاز",
    description:
      "متراژ فضا، وضعیت لوله‌کشی و نیاز گرمایشی شما را بررسی می‌کنیم.",
  },
  {
    icon: Headset,
    title: "مشاوره و انتخاب",
    description:
      "گزینه‌های مناسب بودجه و شرایط محل را با توضیح مزایا و محدودیت‌ها مقایسه می‌کنیم.",
  },
  {
    icon: CalendarCheck,
    title: "هماهنگی خرید و خدمات",
    description:
      "موجودی، قیمت و زمان ارسال یا مراجعه تکنسین به‌صورت شفاف هماهنگ می‌شود.",
  },
  {
    icon: ShieldCheck,
    title: "اجرا و پیگیری",
    description:
      "پس از تحویل یا نصب، وضعیت کار بررسی و نکات نگهداری به شما توضیح داده می‌شود.",
  },
];

/** The homepage reads catalog data from the database on each request. */
export const instant = false;

export default async function HomePage() {
  await connection();

  const [products, productCategories, blogPosts] = await Promise.all([
    getProducts(),
    getCategories(),
    getBlogPosts(),
  ]);

  const featuredProducts = products
    .filter((product) => product.isFeatured)
    .slice(0, 3);
  const bestSellers = products
    .filter((product) => product.isBestSeller)
    .slice(0, 4);
  const posts = blogPosts.slice(0, 3);
  const heroProduct =
    featuredProducts.find(
      (product) =>
        product.purchasingMode === "FIXED" && product.inventory > 0,
    ) ??
    products.find(
      (product) =>
        product.purchasingMode === "FIXED" && product.inventory > 0,
    ) ??
    null;
  const productsPerCategory = new Map<string, number>();

  for (const product of products) {
    productsPerCategory.set(
      product.categorySlug,
      (productsPerCategory.get(product.categorySlug) ?? 0) + 1,
    );
  }

  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${siteConfig.address.street}, ${siteConfig.address.city}, ${siteConfig.address.country}`,
  )}`;

  return (
    <>
      <Hero featuredProduct={heroProduct} />

      {/* Trust strip */}
      <div className="page-container relative z-10 -mt-8">
        <div className="grid gap-px overflow-hidden rounded-2xl border border-white/70 bg-border/80 shadow-float sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-3 bg-surface/95 p-5 backdrop-blur"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary ring-1 ring-inset ring-primary/5">
                <item.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-caption font-bold text-foreground">
                  {item.title}
                </p>
                <p className="mt-1 text-caption leading-5 text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="page-container">
          <Reveal>
            <SectionHeading
              eyebrow="دسته‌بندی محصولات"
              title="از پکیج تا قطعات یدکی، همه در یک‌جا"
              description="محصولات فروشگاه در چهار دسته اصلی دسته‌بندی شده‌اند تا سریع‌تر به آنچه نیاز دارید برسید."
              action={
                <Button asChild variant="outline">
                  <Link href="/shop">
                    همه محصولات
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              }
            />
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {productCategories.map((category, index) => (
              <Reveal key={category.slug} delay={index * 0.07} variant="scale">
                <CategoryCard
                  category={category}
                  productCount={productsPerCategory.get(category.slug) ?? 0}
                  className="h-full"
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="border-y border-border bg-surface py-16 sm:py-20 lg:py-24">
        <div className="page-container">
          <Reveal>
            <SectionHeading
              eyebrow="منتخب فروشگاه"
              title="پیشنهادهای ویژه جهان البرز"
              description="سه محصول پرکاربرد برای شروع؛ قیمت و موجودی پیش از تأیید سفارش بررسی می‌شود."
              action={
                <Button asChild variant="ghost">
                  <Link href="/shop">
                    مشاهده فروشگاه
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              }
            />
          </Reveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product, index) => (
              <Reveal key={product.id} delay={index * 0.07} variant="scale">
                <ProductCard product={product} className="h-full" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="page-container">
          <Reveal>
            <SectionHeading
              eyebrow="خدمات تخصصی"
              title="نصب، سرویس و تعمیر تجهیزات گرمایشی"
              description="خدمات میدانی در شهر قزوین انجام می‌شود. برای هماهنگی بازدید، درخواست خود را ثبت کنید یا تلفنی تماس بگیرید."
            />
          </Reveal>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_20rem]">
            <div className="grid gap-4 sm:grid-cols-2">
              {repairServices.slice(0, 4).map((service, index) => (
                <Reveal key={service.slug} delay={index * 0.06} variant="start">
                  <ServiceCard service={service} showFeatures={false} className="h-full" />
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.1}>
              <div className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-primary-900 p-6 text-primary-foreground">
                <div className="absolute inset-0 bg-grid-light opacity-60" aria-hidden="true" />
                <div className="relative flex flex-1 flex-col">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-secondary">
                    <Wrench className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-lg font-bold">درخواست خدمات</h3>
                  <p className="mt-2 text-caption leading-7 text-on-primary-muted">
                    نوع خدمت، محدوده و زمان پیشنهادی را در فرم ثبت کنید. برای
                    هماهنگی نهایی با شما تماس می‌گیریم.
                  </p>
                  <ul className="mt-4 space-y-2 text-caption text-on-primary-muted">
                    {repairServices.slice(0, 3).map((service) => (
                      <li key={service.slug} className="flex items-center gap-2">
                        <Check className="h-3.5 w-3.5 text-secondary" aria-hidden="true" />
                        {service.name}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto space-y-2 pt-6">
                    <Button asChild variant="secondary" className="w-full">
                      <Link href="/services/request">ثبت درخواست خدمات</Link>
                    </Button>
                    <a
                      href={toTelHref(siteConfig.contact.phone)}
                      className="flex items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-xs font-semibold text-on-primary-muted transition-colors hover:bg-white/10"
                      dir="ltr"
                    >
                      <Phone className="h-4 w-4" aria-hidden="true" />
                      {siteConfig.contact.phone}
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="relative isolate overflow-hidden bg-mesh py-16 text-primary-foreground sm:py-20 lg:py-24">
        <div className="absolute inset-0 bg-grid-light opacity-60" aria-hidden="true" />
        <div
          className="animate-mesh-drift pointer-events-none absolute -end-32 top-10 h-96 w-96 rounded-full bg-secondary/20 blur-[100px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -start-40 -bottom-52 h-96 w-96 rounded-full bg-primary-500/40 blur-[110px]"
          aria-hidden="true"
        />
        <div className="page-container relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal>
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-300/25 bg-orange-300/10 px-3 py-1 text-xs font-bold text-orange-200">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-300" aria-hidden="true" />
                چرا جهان البرز
              </div>
              <h2 className="mt-3 text-2xl font-extrabold leading-[1.5] sm:text-3xl">
                انتخابی آگاهانه،
                <br />
                با همراهی در تمام مسیر
              </h2>
              <p className="mt-4 max-w-md text-caption leading-8 text-on-primary-muted">
                خرید تجهیزات گرمایشی فقط انتخاب یک محصول نیست؛ ظرفیت، نحوه
                نصب و سرویس دوره‌ای در عملکرد و دوام سیستم اثر دارد. ما این
                مسیر را با شما مرور می‌کنیم.
              </p>

              <ul className="mt-6 space-y-3">
                {[
                  "توضیح شفاف گزینه‌ها و محدودیت‌ها",
                  "هماهنگی زمان ارسال یا مراجعه تکنسین",
                  "پاسخ‌گویی به سوالات فنی پس از خرید",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-caption text-on-primary-muted">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary/20 text-secondary">
                      <Check className="h-3 w-3" aria-hidden="true" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild variant="secondary">
                  <Link href="/about">درباره ما</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-white/25 bg-transparent text-white hover:border-white/40 hover:bg-white/10 hover:text-white"
                >
                  <Link href="/contact">تماس با ما</Link>
                </Button>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {whyUs.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.08}>
                <div className="surface-glass-dark lift-hover flex h-full gap-4 rounded-2xl border-s-2 border-secondary/50 p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/15 text-secondary">
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-body-sm font-bold">{item.title}</h3>
                    <p className="mt-1.5 text-caption leading-6 text-on-primary-muted">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="page-container">
          <Reveal>
            <SectionHeading
              align="center"
              eyebrow="مسیر همکاری"
              title="از مشاوره تا تحویل، در چهار قدم"
              description="فرایند خرید و خدمات را ساده و قابل پیگیری نگه داشته‌ایم."
            />
          </Reveal>

          <div className="relative mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div
              className="pointer-events-none absolute inset-x-16 top-8 hidden border-t border-dashed border-primary/20 lg:block"
              aria-hidden="true"
            />
            {processSteps.map((step, index) => (
              <Reveal key={step.title} delay={index * 0.08} variant="end">
                <div className="lift-hover relative h-full rounded-2xl border border-border bg-surface p-5 shadow-soft">
                  <div className="flex items-center justify-between">
                    <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-secondary shadow-sm">
                      <step.icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="text-2xl font-extrabold text-primary/10">
                      {formatNumber(index + 1)}
                    </span>
                  </div>
                  <h3 className="mt-4 text-body-sm font-bold text-primary">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-caption leading-6 text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="border-y border-border bg-surface py-16 sm:py-20 lg:py-24">
        <div className="page-container">
          <Reveal>
            <SectionHeading
              eyebrow="پرفروش‌ترین‌ها"
              title="محصولاتی که بیشتر انتخاب می‌شوند"
              description="محصولاتی که بیشتر انتخاب می‌شوند؛ پس از ثبت سفارش، موجودی و زمان ارسال نهایی می‌شود."
              action={
                <Button asChild variant="outline">
                  <Link href="/shop">
                    خرید از فروشگاه
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              }
            />
          </Reveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {bestSellers.map((product, index) => (
              <Reveal key={product.id} delay={index * 0.07} variant="scale">
                <ProductCard product={product} className="h-full" compact />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="page-container">
          <Reveal>
            <SectionHeading
              eyebrow="تجربه مشتریان"
              title="آنچه مشتریان درباره ما می‌گویند"
              description="این نظرات برای نمایش ساختار صفحه درج شده‌اند و نمونه نمایشی هستند؛ تأیید هویت یا صحت آن‌ها انجام نشده است."
              action={<Badge variant="outline">نمونه نمایشی</Badge>}
            />
          </Reveal>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {customerReviews.map((review, index) => (
              <Reveal key={review.id} delay={index * 0.08} variant="scale">
                <figure className="lift-hover flex h-full flex-col rounded-2xl border border-border bg-surface p-6 shadow-soft">
                  <Quote className="h-7 w-7 text-secondary/40" aria-hidden="true" />
                  <blockquote className="mt-3 text-caption leading-7 text-muted-foreground">
                    {review.comment}
                  </blockquote>
                  <figcaption className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
                    <div>
                      <p className="text-caption font-bold text-foreground">
                        {review.title}
                      </p>
                      <p className="mt-0.5 text-caption text-muted-foreground">
                        {review.author}، {review.city}
                      </p>
                    </div>
                    <StarRating value={review.rating} />
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Blog */}
      <section className="border-y border-border bg-surface py-16 sm:py-20 lg:py-24">
        <div className="page-container">
          <Reveal>
            <SectionHeading
              eyebrow="وبلاگ"
              title="راهنماهای خرید و نگهداری"
              description="مقالاتی کوتاه برای انتخاب بهتر و استفاده صحیح‌تر از تجهیزات گرمایشی."
              action={
                <Button asChild variant="ghost">
                  <Link href="/blog">
                    همه مقالات
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              }
            />
          </Reveal>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {posts.map((post, index) => {
              const media = getProductMedia(
                index === 0 ? "boiler" : index === 1 ? "radiator" : "parts",
              );

              return (
                <Reveal key={post.id} delay={index * 0.07} variant="start">
                  <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-soft transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-secondary/30 hover:shadow-lift">
                    <div className="relative h-44 overflow-hidden border-b border-border bg-gradient-to-br from-primary-50 to-surface">
                      <Image
                        src={media.src}
                        alt={media.alt}
                        fill
                        sizes="(max-width: 768px) 90vw, 30vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-center gap-2 text-caption text-muted-foreground">
                        <Badge variant="secondary">{post.category}</Badge>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" aria-hidden="true" />
                          {formatNumber(post.readTime)} دقیقه مطالعه
                        </span>
                      </div>
                      <h3 className="mt-3 text-body-sm font-bold leading-7 text-foreground transition-colors group-hover:text-primary">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <p className="mt-2 line-clamp-2 text-caption leading-6 text-muted-foreground">
                        {post.excerpt}
                      </p>
                      <div className="mt-auto flex items-center justify-between pt-4 text-caption text-muted-foreground">
                        <span>{formatDate(post.publishedAt)}</span>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="inline-flex items-center gap-1 font-bold text-primary transition-colors hover:text-secondary-700"
                        >
                          ادامه مطلب
                          <ArrowLeft className="h-3 w-3" aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Location & contact */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="page-container grid gap-8 lg:grid-cols-2">
          <Reveal>
            <div>
              <SectionHeading
                eyebrow="آدرس و تماس"
                title="در قزوین، در دسترس شما"
                description="برای بازدید حضوری، استعلام موجودی یا هماهنگی خدمات، پیش از مراجعه تماس بگیرید تا زمان دقیق هماهنگ شود."
              />

              <div className="mt-8 space-y-4">
                <div className="lift-hover flex items-start gap-3 rounded-2xl border border-border bg-surface p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary">
                    <MapPin className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs font-bold text-foreground">آدرس فروشگاه</p>
                    <p className="mt-1 text-caption leading-6 text-muted-foreground">
                      {siteConfig.address.fullAddress}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <a
                    href={toTelHref(siteConfig.contact.phone)}
                    className="lift-hover flex items-start gap-3 rounded-2xl border border-border bg-surface p-4"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary">
                      <Phone className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-xs font-bold text-foreground">تلفن</p>
                      <p className="mt-1 text-caption text-muted-foreground" dir="ltr">
                        {siteConfig.contact.phone}
                      </p>
                    </div>
                  </a>

                  <div className="lift-hover flex items-start gap-3 rounded-2xl border border-border bg-surface p-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary">
                      <Clock className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-xs font-bold text-foreground">ساعت کاری</p>
                      <p className="mt-1 text-caption leading-6 text-muted-foreground">
                        {siteConfig.business.workHours.days}
                        <br />
                        {siteConfig.business.workHours.hours}
                      </p>
                    </div>
                  </div>
                </div>

                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="lift-hover flex items-start gap-3 rounded-2xl border border-border bg-surface p-4"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary">
                    <Mail className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs font-bold text-foreground">ایمیل</p>
                    <p className="mt-1 text-caption text-muted-foreground" dir="ltr">
                      {siteConfig.contact.email}
                    </p>
                  </div>
                </a>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/contact">جزئیات تماس</Link>
                </Button>
                <Button asChild variant="outline">
                  <a
                    href={toWhatsAppHref(siteConfig.contact.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    گفت‌وگو در واتساپ
                  </a>
                </Button>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative h-full min-h-[22rem] overflow-hidden rounded-3xl border border-border bg-primary-50">
              <div className="absolute inset-0 bg-grid opacity-80" aria-hidden="true" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/10 to-transparent" aria-hidden="true" />

              <div className="absolute start-6 top-6 rounded-xl border border-border bg-surface/95 px-3.5 py-2 text-caption font-semibold text-primary shadow-soft backdrop-blur">
                قزوین، خیابان دانشگاه
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <span className="absolute -inset-6 animate-ping rounded-full bg-secondary/15" aria-hidden="true" />
                  <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary text-secondary shadow-lift">
                    <MapPin className="h-7 w-7" aria-hidden="true" />
                  </span>
                </div>
              </div>

              <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-border bg-surface p-4 shadow-soft">
                <p className="text-caption leading-6 text-muted-foreground">
                  موقعیت دقیق فروشگاه روی نقشه در این نسخه ثبت نشده است. برای
                  مسیریابی، از لینک زیر استفاده کنید یا پیش از مراجعه تماس
                  بگیرید.
                </p>
                <a
                  href={mapHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 text-caption font-bold text-primary transition-colors hover:text-secondary-700"
                >
                  مسیریابی در نقشه
                  <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className="page-container pb-20">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-3xl bg-mesh px-6 py-12 text-primary-foreground sm:px-10 lg:px-14">
            <div className="absolute inset-0 bg-grid-light opacity-70" aria-hidden="true" />
            <div
              className="animate-mesh-drift pointer-events-none absolute -start-24 -top-24 h-80 w-80 rounded-full bg-secondary/20 blur-[90px]"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -end-20 -bottom-24 h-64 w-64 rounded-full bg-primary-500/40 blur-[90px]"
              aria-hidden="true"
            />
            <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
              <div className="max-w-xl">
                <h2 className="text-2xl font-extrabold leading-[1.5] sm:text-3xl">
                  برای انتخاب درست، از مشاوره ما استفاده کنید
                </h2>
                <p className="mt-3 text-caption leading-7 text-on-primary-muted">
                  پیش از خرید پکیج یا رادیاتور، نیاز فضای خود را با کارشناسان
                  ما بررسی کنید. برای خدمات تعمیر و نصب هم می‌توانید درخواست
                  خود را ثبت کنید.
                </p>
              </div>
              <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row">
                <Button asChild variant="secondary" size="lg">
                  <Link href="/services/request">ثبت درخواست خدمات</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white/25 bg-transparent text-white hover:border-white/40 hover:bg-white/10 hover:text-white"
                >
                  <a href={toTelHref(siteConfig.contact.phone)} dir="ltr">
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    {siteConfig.contact.phone}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
