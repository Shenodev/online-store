"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

type CartUI = {
  /** Store whose drawer is open, or null. */
  openStoreId: string | null;
  openCart: (storeId: string) => void;
  closeCart: () => void;
};

const CartUIContext = createContext<CartUI>({
  openStoreId: null,
  openCart: () => {},
  closeCart: () => {},
});

/** Provides drawer open/close state. Mount once per store section layout. */
export function CartUIProvider({ children }: { children: ReactNode }) {
  const [openStoreId, setOpenStoreId] = useState<string | null>(null);

  const openCart = useCallback((storeId: string) => setOpenStoreId(storeId), []);
  const closeCart = useCallback(() => setOpenStoreId(null), []);

  const value = useMemo(
    () => ({ openStoreId, openCart, closeCart }),
    [openStoreId, openCart, closeCart]
  );
  return <CartUIContext.Provider value={value}>{children}</CartUIContext.Provider>;
}

export function useCartUI(): CartUI {
  return useContext(CartUIContext);
}
