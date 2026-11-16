"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProductVisual } from "@/lib/data/catalog";

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  visual: ProductVisual;
  quantity: number;
};

export type AddCartItem = Omit<CartItem, "quantity">;

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  hasHydrated: boolean;

  addItem: (item: AddCartItem, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;

  openCart: () => void;
  closeCart: () => void;

  setHasHydrated: (value: boolean) => void;
};

const MAX_QUANTITY = 20;

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      hasHydrated: false,

      addItem: (item, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((entry) => entry.id === item.id);

          if (existing) {
            return {
              items: state.items.map((entry) =>
                entry.id === item.id
                  ? {
                      ...entry,
                      quantity: Math.min(
                        entry.quantity + quantity,
                        MAX_QUANTITY,
                      ),
                    }
                  : entry,
              ),
            };
          }

          return {
            items: [
              ...state.items,
              { ...item, quantity: Math.min(quantity, MAX_QUANTITY) },
            ],
          };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((entry) => entry.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((entry) => entry.id !== id) };
          }

          return {
            items: state.items.map((entry) =>
              entry.id === id
                ? { ...entry, quantity: Math.min(quantity, MAX_QUANTITY) }
                : entry,
            ),
          };
        }),

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "jahan-alborz-cart",
      version: 1,
      skipHydration: true,
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

export function selectCartCount(state: CartState): number {
  return state.items.reduce((total, item) => total + item.quantity, 0);
}

export function selectCartSubtotal(state: CartState): number {
  return state.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
}
