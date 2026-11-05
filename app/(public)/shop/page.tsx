import type { Metadata } from "next";
import { ShopProducts } from "@/components/shop/shop-products";

export const metadata: Metadata = {
  title: "فروشگاه",
  description:
    "فروشگاه جهان البرز؛ فروش پکیج، رادیاتور، قطعات و لوازم یدکی و لوازم نصب در قزوین.",
};

export default function ShopPage() {
  return <ShopProducts />;
}
