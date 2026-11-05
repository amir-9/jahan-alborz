import Link from "next/link";
import {
  Flame,
  Package,
  PlugZap,
  ShieldCheck,
  Star,
  Thermometer,
  Truck,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config/site";
import {
  blogPosts,
  customerReviews,
  productCategories,
  products,
  repairServices,
} from "@/lib/data/catalog";

function formatPrice(value: number) {
  return `${value.toLocaleString("fa-IR")} تومان`;
}

export default function Home() {
  const featuredProducts = products.filter((product) => product.isFeatured);
  const bestSellerProducts = products.filter((product) => product.isBestSeller);
  const categories = productCategories;

  return (
    <>
      {/* Hero */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-6 px-4 py-20 text-center sm:px-6 sm:py-28 lg:py-32">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm">
            <ShieldCheck className="h-4 w-4 text-secondary" aria-hidden="true" />
            فروشگاه تخصصی تجهیزات گرمایشی
          </span>
          <h1 className="max-w-3xl text-3xl font-bold leading-10 tracking-tight sm:text-5xl sm:leading-12">
            گرم کردن خانه، ساده و مطمئن
          </h1>
          <p className="max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
            فروش پکیج و رادیاتور، خدمات تعمیر و نگهداری و نصب تخصصی در
            قزوین. با ما هدفون وای‌رسانی و راحتی را تجربه کنید.
          </p>
          <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
            <Button
              size="lg"
              asChild
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              <Link href="/shop">مشاهده محصولات</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/40 bg-transparent text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
              asChild
            >
              <Link href="/services/request">درخواست خدمات تعمیر</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Business advantages & trust indicators */}
      <section className="bg-background">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Truck className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  فروش سراسر ایران
                </h2>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  ارسال محلی و بین‌شهری با هزینه‌های مدیریت‌شده.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Wrench className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  خدمات در قزوین
                </h2>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  تعمیر و نگهداری تخصصی با پوشش شهر قزوین.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ShieldCheck className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  پشتیبانی فنی
                </h2>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  تیم متخصص در کنار شما برای هرگام از درد.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product categories */}
      <section className="bg-surface">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                دسته‌بندی محصولات
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                جامعیت در انواع تجهیزات گرمایشی.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/shop">مشاهده همه محصولات</Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => {
              const Icon = category.slug === "pki" ? Flame : category.slug === "radiator" ? Thermometer : category.slug === "spare-parts" ? Package : PlugZap;
              return (
                <Link
                  key={category.slug}
                  href="/shop"
                  className="rounded-xl border border-border bg-background p-6 transition-shadow hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-foreground">
                    {category.name}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {category.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-background">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                محصولات ویژه
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                گزینه‌های برتر فروشگاه.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/shop">مشاهده محصولات</Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="rounded-xl border border-border bg-surface p-6"
              >
                <span className="inline-flex items-center gap-1 rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary">
                  {product.brand}
                </span>
                <h3 className="mt-4 text-base font-semibold text-foreground">
                  {product.name}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {product.inventory > 0 ? `${product.inventory} عدد در انبار` : "ناموجود"}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">
                    {formatPrice(product.discountedPrice ?? product.price)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best sellers */}
      <section className="bg-surface">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                پرفروش‌ترین محصولات
              </h2>
            </div>
            <Button variant="outline" asChild>
              <Link href="/shop">مشاهده محصولات</Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {bestSellerProducts.map((product) => (
              <div
                key={product.id}
                className="rounded-xl border border-border bg-background p-6"
              >
                <h3 className="text-base font-semibold text-foreground">
                  {product.name}
                </h3>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">
                    {formatPrice(product.discountedPrice ?? product.price)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Repair services */}
      <section className="bg-background">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                خدمات تعمیر و نگهداری
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                پوشش تعمیر در شهر قزوین.
              </p>
            </div>
            <Button asChild>
              <Link href="/services/request">ثبت درخواست تعمیر</Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {repairServices.map((service) => (
              <div
                key={service.slug}
                className="rounded-xl border border-border bg-surface p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Wrench className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground">
                  {service.name}
                </h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="bg-surface">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            چرا جهان البرز؟
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-border bg-background p-6">
              <h3 className="text-base font-semibold text-foreground">
                تخصص فنی
              </h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                تیم متخصص و باتجربه برای هر مدل از پکیج و رادیاتور.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background p-6">
              <h3 className="text-base font-semibold text-foreground">
                قیمت‌های شفاف
              </h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                هزینه‌های بدون غیرضروری و پرداخت به‌صورت مقرون‌به‌صرفه.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background p-6">
              <h3 className="text-base font-semibold text-foreground">
                پشتیبانی پس از فروش
              </h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                خدمات بعد از فروش و سرویس دوره‌ای برای تمام محصولات.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How to request repair */}
      <section className="bg-background">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            نحوه درخواست خدمات تعمیر
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { step: "۱", title: "ثبت درخواست", text: "فرم سفارش خدمات یا تماس با ما." },
              { step: "۲", title: "همکاری فنی", text: "تحویل یا ارسال محل، بررسی تخصصی." },
              { step: "۳", title: "انجام خدمات", text: "اصلاح، تعمیر یا نصب." },
            ].map((item) => (
              <div key={item.step} className="rounded-xl border border-border bg-surface p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground">
                  {item.step}
                </span>
                <h3 className="mt-4 text-base font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="bg-surface">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            نظرات مشتریان
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {customerReviews.map((review) => (
              <div key={review.id} className="rounded-xl border border-border bg-background p-6">
                <div className="flex items-center gap-2">
                  {Array.from({ length: review.rating }).map((_, index) => (
                    <Star
                      key={index}
                      className="h-4 w-4 fill-secondary text-secondary"
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground">
                  {review.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  {review.comment}
                </p>
                <p className="mt-3 text-sm font-medium text-foreground">
                  — {review.author}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog */}
      <section className="bg-background">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                آموزش‌های گرمایشی
              </h2>
            </div>
            <Button variant="outline" asChild>
              <Link href="/blog">مشاهده مقالات</Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {blogPosts.map((post) => (
              <Link
                key={post.id}
                href="/blog"
                className="rounded-xl border border-border bg-surface p-6 transition-shadow hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-foreground">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  {post.excerpt}
                </p>
                <p className="mt-3 text-xs text-muted-foreground">
                  {post.readTime} دقیقه مطالعه
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Store location & contact */}
      <section className="bg-surface">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                شفارفتار فروشگاه
              </h2>
              <p className="mt-4 text-sm leading-8 text-muted-foreground">
                {siteConfig.address.fullAddress}
              </p>
              <p className="mt-2 text-sm leading-8 text-muted-foreground">
                شارژ محلات شمالی و جنوبی قزوین.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background p-6">
              <h3 className="text-base font-semibold text-foreground">
                تماس با ما
              </h3>
              <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                <p>
                  تلفن: <span className="font-medium text-foreground">{siteConfig.contact.phone}</span>
                </p>
                <p>
                  واتساپ:{" "}
                  <span className="font-medium text-foreground">{siteConfig.contact.whatsapp}</span>
                </p>
                <p>
                  ایمیل:{" "}
                  <span className="font-medium text-foreground">{siteConfig.contact.email}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
