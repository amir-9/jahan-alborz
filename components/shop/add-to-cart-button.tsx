"use client";

import { useState } from "react";
import { Check, Phone, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ProductVisual } from "@/components/shared/product-visual";
import { siteConfig } from "@/lib/config/site";
import { useCartStore } from "@/lib/stores/cart-store";
import type { Product } from "@/lib/data/catalog";
import { cn } from "@/lib/utils/cn";
import { toTelHref } from "@/lib/utils/format";

type AddToCartButtonProps = {
  product: Product;
  quantity?: number;
  variant?: "default" | "secondary" | "outline";
  size?: "sm" | "default" | "lg";
  className?: string;
  fullWidth?: boolean;
  withIcon?: boolean;
};

/**
 * Adds a product to the persisted client cart. Prices shown here come from the
 * demo catalog; final pricing is confirmed by the store before fulfilment.
 */
export function AddToCartButton({
  product,
  quantity = 1,
  variant = "secondary",
  size = "default",
  className,
  fullWidth = false,
  withIcon = true,
}: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const [isPending, setIsPending] = useState(false);

  if (product.purchasingMode === "QUOTE") {
    return (
      <Button
        asChild
        variant="outline"
        size={size}
        className={cn(fullWidth && "w-full", className)}
      >
        <a href={toTelHref(siteConfig.contact.phone)}>
          <Phone className="h-4 w-4" aria-hidden="true" />
          استعلام قیمت
        </a>
      </Button>
    );
  }

  function handleAdd() {
    if (product.purchasingMode !== "FIXED") {
      return;
    }

    setIsPending(true);

    addItem(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        price: product.discountedPrice ?? product.price,
        visual: product.visual,
      },
      quantity,
    );

    toast.success("به سبد خرید اضافه شد", {
      description: product.name,
      action: {
        label: "مشاهده سبد",
        onClick: () => openCart(),
      },
      icon: (
        <ProductVisual
          variant={product.visual}
          className="h-8 w-8 rounded-md bg-primary-50 p-0.5"
        />
      ),
    });

    window.setTimeout(() => setIsPending(false), 500);
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleAdd}
      disabled={isPending || product.inventory <= 0}
      className={cn(fullWidth && "w-full", className)}
    >
      {isPending ? (
        <Check className="h-4 w-4" aria-hidden="true" />
      ) : withIcon ? (
        <ShoppingCart className="h-4 w-4" aria-hidden="true" />
      ) : null}
      {product.inventory <= 0
        ? "ناموجود"
        : isPending
          ? "اضافه شد"
          : "افزودن به سبد خرید"}
    </Button>
  );
}
