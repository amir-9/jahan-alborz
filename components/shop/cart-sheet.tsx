"use client";

import Link from "next/link";
import { ArrowLeft, ShoppingBag, Trash } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { QuantityStepper } from "@/components/shop/quantity-stepper";
import { ProductVisual } from "@/components/shared/product-visual";
import {
  selectCartCount,
  selectCartSubtotal,
  useCartStore,
} from "@/lib/stores/cart-store";
import { formatNumber, formatPrice } from "@/lib/utils/format";

export function CartSheet() {
  const items = useCartStore((state) => state.items);
  const isOpen = useCartStore((state) => state.isOpen);
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const openCart = useCartStore((state) => state.openCart);
  const closeCart = useCartStore((state) => state.closeCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const count = useCartStore(selectCartCount);
  const subtotal = useCartStore(selectCartSubtotal);

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => (open ? openCart() : closeCart())}
    >
      <SheetContent side="left" className="max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-secondary" aria-hidden="true" />
            سبد خرید
          </SheetTitle>
          <SheetDescription>
            {hasHydrated
              ? count > 0
                ? `${formatNumber(count)} کالا در سبد شما`
                : "سبد خرید شما خالی است"
              : "در حال بارگذاری سبد خرید…"}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 px-6 py-5">
          {!hasHydrated ? (
            <div className="space-y-3" aria-hidden="true">
              {[0, 1].map((index) => (
                <div key={index} className="skeleton h-24 rounded-2xl" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 py-16 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary">
                <ShoppingBag className="h-7 w-7" aria-hidden="true" />
              </span>
              <div>
                <p className="font-bold text-foreground">
                  هنوز محصولی انتخاب نکرده‌اید
                </p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  از فروشگاه، پکیج، رادیاتور و قطعات مورد نیاز خود را بررسی
                  کنید.
                </p>
              </div>
              <Button asChild onClick={closeCart}>
                <Link href="/shop">
                  مشاهده فروشگاه
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-3 rounded-2xl border border-border bg-surface p-3"
                >
                  <Link
                    href={`/products/${item.slug}`}
                    onClick={closeCart}
                    className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-border bg-gradient-to-b from-primary-50 to-surface p-1.5"
                  >
                    <ProductVisual variant={item.visual} />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-caption font-bold text-foreground">
                          {item.name}
                        </p>
                        <p className="mt-0.5 text-caption text-muted-foreground">
                          {item.brand}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-red-50 hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        aria-label={`حذف ${item.name} از سبد خرید`}
                      >
                        <Trash className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </div>

                    <div className="mt-auto flex items-end justify-between gap-2 pt-2">
                      <QuantityStepper
                        size="sm"
                        value={item.quantity}
                        onChange={(value) => updateQuantity(item.id, value)}
                        label={`تعداد ${item.name}`}
                      />
                      <p className="text-sm font-bold text-primary">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {hasHydrated && items.length > 0 ? (
          <div className="border-t border-border bg-surface-muted px-6 py-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">جمع سبد</span>
              <span className="font-extrabold text-primary">
                {formatPrice(subtotal)}
              </span>
            </div>
            <Separator className="my-3" />
            <p className="text-caption leading-6 text-muted-foreground">
              هزینه و روش ارسال پس از ثبت سفارش و هماهنگی با شما نهایی می‌شود.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <Button asChild onClick={closeCart}>
                <Link href="/cart">
                  مشاهده و تکمیل سبد
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button variant="ghost" onClick={closeCart}>
                ادامه خرید
              </Button>
            </div>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
