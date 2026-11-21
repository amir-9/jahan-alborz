"use client";

import { useState } from "react";
import { QuantityStepper } from "@/components/shop/quantity-stepper";
import { AddToCartButton } from "@/components/shop/add-to-cart-button";
import type { Product } from "@/lib/data/catalog";

type ProductPurchasePanelProps = {
  product: Product;
};

export function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const [quantity, setQuantity] = useState(1);
  const maxQuantity = Math.max(1, Math.min(product.inventory, 20));

  return (
    <div className="flex flex-col gap-3">
      {product.purchasingMode === "FIXED" ? (
        <div className="flex items-center justify-between gap-3">
          <span className="text-caption font-medium text-muted-foreground">
            تعداد
          </span>
          <QuantityStepper
            value={quantity}
            onChange={setQuantity}
            max={maxQuantity}
            label="تعداد محصول"
          />
        </div>
      ) : null}

      <AddToCartButton
        product={product}
        quantity={quantity}
        size="lg"
        fullWidth
        withIcon
      />

      <p className="text-center text-caption leading-5 text-muted-foreground">
        {product.purchasingMode === "FIXED"
          ? "قیمت و موجودی نهایی پیش از تأیید سفارش توسط فروشگاه بررسی می‌شود."
          : "برای این محصول، قیمت بر اساس مدل و ظرفیت اعلام می‌شود."}
      </p>
    </div>
  );
}
