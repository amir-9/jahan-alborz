"use client";

import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";
import { useCartStore } from "@/lib/stores/cart-store";

/**
 * Client-side providers for the whole application.
 *
 * The cart store uses `skipHydration` so the first server render and the first
 * client render agree; persistence is restored once after mount.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  useEffect(() => {
    void useCartStore.persist.rehydrate();
  }, []);

  return (
    <>
      {children}
      <Toaster
        dir="rtl"
        position="bottom-left"
        closeButton
        toastOptions={{
          classNames: {
            toast:
              "!rounded-xl !border !border-border !bg-surface !text-foreground !shadow-soft !font-sans",
            title: "!text-sm !font-semibold",
            description: "!text-xs !text-muted-foreground",
          },
        }}
      />
    </>
  );
}
