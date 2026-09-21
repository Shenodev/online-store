"use client";

import { useMemo } from "react";
import { createCartStore, type CartItem } from "./cart";

export type CartStore = ReturnType<typeof createCartStore>;

const registry = new Map<string, CartStore>();
const PREFIX = "cart_store_";

/**
 * Singleton Zustand store per storeId — every component touching the same
 * store shares one live, persisted (`cart_store_<storeId>`) bucket.
 * Buckets are NEVER merged: each store checks out separately.
 */
export function getCartStore(storeId: string): CartStore {
  let store = registry.get(storeId);
  if (!store) {
    store = createCartStore(storeId);
    registry.set(storeId, store);
  }
  return store;
}

/** All store ids with a persisted cart bucket in this browser. */
export function listCartStoreIds(): string[] {
  if (typeof window === "undefined" || !window.localStorage) return [];
  const ids: string[] = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (key?.startsWith(PREFIX)) {
      ids.push(key.slice(PREFIX.length));
    }
  }
  return ids;
}

export type StoreCart = {
  items: CartItem[];
  count: number;
  subtotal: number;
  addItem: (item: CartItem) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
};

export function useStoreCart(storeId: string): StoreCart {
  const useStore = useMemo(() => getCartStore(storeId), [storeId]);
  const items = useStore((s) => s.items);
  const addItem = useStore((s) => s.addItem);
  const setQuantity = useStore((s) => s.setQuantity);
  const removeItem = useStore((s) => s.removeItem);
  const clear = useStore((s) => s.clear);

  const { count, subtotal } = useMemo(() => {
    return items.reduce(
      (acc, i) => ({
        count: acc.count + i.quantity,
        subtotal: acc.subtotal + i.price * i.quantity,
      }),
      { count: 0, subtotal: 0 }
    );
  }, [items]);

  return { items, count, subtotal, addItem, setQuantity, removeItem, clear };
}
