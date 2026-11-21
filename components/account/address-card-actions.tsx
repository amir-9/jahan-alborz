"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Star, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteAddress, setDefaultAddress } from "@/lib/actions/addresses";

type AddressCardActionsProps = {
  id: string;
  isDefault: boolean;
};

export function AddressCardActions({
  id,
  isDefault,
}: AddressCardActionsProps) {
  const router = useRouter();
  const [pending, setPending] = useState<"default" | "delete" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSetDefault() {
    setPending("default");
    setError(null);

    try {
      const result = await setDefaultAddress(id);

      if (!result.ok) {
        setError(result.message);
        return;
      }

      router.refresh();
    } finally {
      setPending(null);
    }
  }

  async function handleDelete() {
    if (!window.confirm("این آدرس حذف شود؟")) {
      return;
    }

    setPending("delete");
    setError(null);

    try {
      const result = await deleteAddress(id);

      if (!result.ok) {
        setError(result.message);
        return;
      }

      router.refresh();
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      {!isDefault ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleSetDefault}
          disabled={pending !== null}
        >
          {pending === "default" ? (
            <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <Star className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          تعیین به‌عنوان پیش‌فرض
        </Button>
      ) : null}

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="text-danger hover:bg-red-50 hover:text-danger"
        onClick={handleDelete}
        disabled={pending !== null}
      >
        {pending === "delete" ? (
          <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
        ) : (
          <Trash className="h-3.5 w-3.5" aria-hidden="true" />
        )}
        حذف
      </Button>

      {error ? (
        <p className="text-caption text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
