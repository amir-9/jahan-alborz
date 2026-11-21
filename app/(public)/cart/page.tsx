import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CartView } from "@/components/shop/cart-view";
import { Badge } from "@/components/ui/badge";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "سبد خرید",
  description: "بازبینی و ویرایش سبد خرید فروشگاه جهان البرز.",
  path: "/cart",
  noIndex: true,
});

export default function CartPage() {
  return (
    <div className="page-container pb-16 pt-6 sm:pt-8">
      <Breadcrumbs items={[{ name: "سبد خرید" }]} />

      <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <Badge variant="secondary">سبد خرید</Badge>
          <h1 className="mt-3 text-2xl font-extrabold text-primary sm:text-3xl">
            بازبینی سبد خرید
          </h1>
          <p className="mt-2 text-caption leading-7 text-muted-foreground">
            تعداد و اقلام سبد را بررسی کنید؛ سپس اطلاعات تحویل را در مرحله بعد
            تکمیل کنید.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <CartView />
      </div>
    </div>
  );
}
