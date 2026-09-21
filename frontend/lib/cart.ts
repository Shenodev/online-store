"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  title: string;
  price: number;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
};

/**
 * Cart is namespaced per store: `cart_store_<storeId>`
 * (see AppFlow.md §6) to prevent mixed-tenant checkouts.
 */
export function createCartStore(storeId: string) {
  return create<CartState>()(
    persist(
      (set) => ({
        items: [],
        addItem: (item) =>
          set((s) => {
            const existing = s.items.find((i) => i.productId === item.productId);
            if (existing) {
              return {
                items: s.items.map((i) =>
                  i.productId === item.productId
                    ? { ...i, quantity: i.quantity + item.quantity }
                    : i
                ),
              };
            }
            return { items: [...s.items, item] };
          }),
        removeItem: (productId) =>
          set((s) => ({
            items: s.items.filter((i) => i.productId !== productId),
          })),
        setQuantity: (productId, quantity) =>
          set((s) => ({
            items:
              quantity <= 0
                ? s.items.filter((i) => i.productId !== productId)
                : s.items.map((i) =>
                    i.productId === productId ? { ...i, quantity } : i
                  ),
          })),
        clear: () => set({ items: [] }),
      }),
      { name: `cart_store_${storeId}` }
    )
  );
}
