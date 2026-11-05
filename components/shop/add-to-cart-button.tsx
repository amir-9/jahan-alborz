"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AddToCartButton() {
  const [isAdded, setIsAdded] = useState(false);

  return (
    <Button
      onClick={() => {
        // Cart persistence will be integrated in the shopping phase.
        setIsAdded(true);
      }}
    >
      {isAdded ? <Check className="h-4 w-4" aria-hidden="true" /> : null}
      {isAdded ? "به سبد خرید اضافه شد" : "افزودن به سبد خرید"}
    </Button>
  );
}
