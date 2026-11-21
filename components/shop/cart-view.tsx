"use client";

import Link from "next/link";
import {
  ArrowLeft,
  MessageCircle,
  Phone,
  ShoppingBag,
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { QuantityStepper } from "@/components/shop/quantity-stepper";
import { ProductVisual } from "@/components/shared/product-visual";
import { siteConfig } from "@/lib/config/site";
import {
  selectCartCount,
  selectCartSubtotal,
  useCartStore,
} from "@/lib/stores/cart-store";
import { formatNumber, formatPrice, toTelHref, toWhatsAppHref } from "@/lib/utils/format";

export function CartView() {
  const items = useCartStore((state) => state.items);
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const count = useCartStore(selectCartCount);
  const subtotal = useCartStore(selectCartSubtotal);

  if (!hasHydrated) {
    return (
      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]" aria-hidden="true">
        <div className="space-y-3">
          {[0, 1, 2].map((index) => (
            <div key={index} className="skeleton h-28 rounded-2xl" />
          ))}
        </div>
        <div className="skeleton h-64 rounded-2xl" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-border bg-surface px-6 py-20 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary">
          <ShoppingBag className="h-7 w-7" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-lg font-bold text-primary">سبد خرید خالی است</h2>
          <p className="mx-auto mt-2 max-w-sm text-caption leading-6 text-muted-foreground">
            محصولات فروشگاه را بررسی کنید و موارد مورد نیاز خود را به سبد
            اضافه کنید. برای انتخاب، می‌توانید از مشاوره ما هم استفاده کنید.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Button asChild>
            <Link href="/shop">
              مشاهده فروشگاه
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">تماس با ما</Link>
          </Button>
        </div>
      </div>
    );
  }

  const orderMessage = [
    "سلام، قصد ثبت سفارش از سایت را دارم:",
    ...items.map(
      (item) =>
        `• ${item.name} (${item.brand}) × ${formatNumber(item.quantity)}`,
    ),
    `جمع سبد: ${formatPrice(subtotal)}`,
    "لطفاً برای هماهنگی موجودی و ارسال راهنمایی کنید.",
  ].join("\n");

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-start">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-caption text-muted-foreground">
            {formatNumber(count)} کالا در سبد
          </p>
          <button
            type="button"
            onClick={clearCart}
            className="text-caption font-semibold text-danger transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            خالی کردن سبد
          </button>
        </div>

        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4 shadow-soft sm:flex-row sm:items-center"
            >
              <Link
                href={`/products/${item.slug}`}
                className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl border border-border bg-gradient-to-b from-primary-50 to-surface p-2"
              >
                <ProductVisual variant={item.visual} />
              </Link>

              <div className="min-w-0 flex-1">
                <p className="text-caption text-muted-foreground">
                  {item.brand}
                </p>
                <h2 className="mt-0.5 text-caption font-bold text-foreground">
                  <Link
                    href={`/products/${item.slug}`}
                    className="transition-colors hover:text-primary"
                  >
                    {item.name}
                  </Link>
                </h2>
                <p className="mt-1 text-caption text-muted-foreground">
                  قیمت واحد: {formatPrice(item.price)}
                </p>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <QuantityStepper
                    size="sm"
                    value={item.quantity}
                    onChange={(value) => updateQuantity(item.id, value)}
                    label={`تعداد ${item.name}`}
                  />
                  <div className="flex items-center gap-4">
                    <p className="text-caption font-extrabold text-primary">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-red-50 hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label={`حذف ${item.name}`}
                    >
                      <Trash className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-surface p-4">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-caption font-bold text-primary transition-colors hover:text-secondary-700"
          >
            <ArrowLeft className="h-3.5 w-3.5 rotate-180" aria-hidden="true" />
            ادامه خرید
          </Link>
          <p className="text-caption text-muted-foreground">
            قیمت نهایی و موجودی هنگام ثبت سفارش توسط فروشگاه بررسی می‌شود.
          </p>
        </div>
      </div>

      <aside className="space-y-4 lg:sticky lg:top-28">
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
          <h2 className="text-sm font-bold text-primary">خلاصه سبد</h2>

          <dl className="mt-4 space-y-2.5 text-caption">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">تعداد کالا</dt>
              <dd className="font-semibold text-foreground">
                {formatNumber(count)}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">جمع سبد</dt>
              <dd className="font-semibold text-foreground">
                {formatPrice(subtotal)}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">هزینه ارسال</dt>
              <dd className="text-caption text-muted-foreground">
                پس از هماهنگی
              </dd>
            </div>
          </dl>

          <Separator className="my-4" />

          <div className="flex items-baseline justify-between">
            <span className="text-caption font-semibold text-foreground">
              مبلغ قابل پرداخت
            </span>
            <span className="text-base font-extrabold text-primary">
              {formatPrice(subtotal)}
            </span>
          </div>

          <p className="mt-4 rounded-xl bg-surface-muted px-3.5 py-3 text-caption leading-5 text-muted-foreground">
            در مرحله بعد اطلاعات تحویل را وارد می‌کنید. برای خرید مهمان، تأیید
            شماره موبایل با کد یک‌بارمصرف لازم است.
          </p>

          <Button asChild className="mt-4 w-full">
            <Link href="/checkout">
              ادامه فرآیند خرید
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>

          <div className="mt-3 space-y-2">
            <Button asChild variant="outline" className="w-full">
              <a
                href={toWhatsAppHref(siteConfig.contact.whatsapp, orderMessage)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                مشاوره خرید در واتساپ
              </a>
            </Button>
            <Button asChild variant="ghost" className="w-full">
              <a href={toTelHref(siteConfig.contact.phone)} dir="ltr">
                <Phone className="h-4 w-4" aria-hidden="true" />
                {siteConfig.contact.phone}
              </a>
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface-muted p-4 text-caption leading-5 text-muted-foreground">
          ارسال محصولات به سراسر ایران انجام می‌شود. روش و هزینه ارسال بر اساس
          مقصد، ابعاد و وزن محموله پیش از تأیید سفارش هماهنگ می‌شود.
        </div>
      </aside>
    </div>
  );
}
