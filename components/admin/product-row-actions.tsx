"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CircleExclamationPoint,
  Eye,
  EyeOff,
  LoaderCircle,
  Pencil,
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  softDeleteProduct,
  toggleProductActive,
} from "@/lib/actions/admin-products";

type ProductRowActionsProps = {
  productId: string;
  isActive: boolean;
};

export function ProductRowActions({
  productId,
  isActive,
}: ProductRowActionsProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleToggle() {
    setError(null);

    startTransition(async () => {
      const result = await toggleProductActive({
        productId,
        isActive: !isActive,
      });

      if (!result.ok) {
        setError(result.message);
        return;
      }

      router.refresh();
    });
  }

  function handleDelete() {
    if (
      !window.confirm(
        "این محصول از فروشگاه پنهان شود؟ سوابق سفارش‌های قبلی حفظ می‌شود.",
      )
    ) {
      return;
    }

    setError(null);

    startTransition(async () => {
      const result = await softDeleteProduct(productId);

      if (!result.ok) {
        setError(result.message);
        return;
      }

      router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className="flex flex-wrap items-center justify-end gap-1.5">
        <Button asChild variant="outline" size="sm">
          <Link href={`/admin/products/${productId}`}>
            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
            ویرایش
          </Link>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleToggle}
          disabled={pending}
        >
          {pending ? (
            <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
          ) : isActive ? (
            <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {isActive ? "پنهان‌سازی" : "نمایش"}
        </Button>
        {isActive ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-danger hover:bg-red-50 hover:text-danger"
            onClick={handleDelete}
            disabled={pending}
          >
            <Trash className="h-3.5 w-3.5" aria-hidden="true" />
            حذف
          </Button>
        ) : null}
      </div>
      {error ? (
        <p
          className="flex items-center gap-1 text-[10px] text-danger"
          role="alert"
        >
          <CircleExclamationPoint className="h-3 w-3" aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </div>
  );
}
