"use client";

import { useStoreCart } from "@/lib/cart-registry";
import { useCartUI } from "./CartUIProvider";

/** Navbar cart button with live count for the active store; opens the drawer. */
export function CartNavButton({ storeId }: { storeId: string }) {
  const { count } = useStoreCart(storeId);
  const { openCart } = useCartUI();

  return (
    <button onClick={() => openCart(storeId)} className="btn-ghost relative">
      Cart
      {count > 0 && (
        <span className="badge-accent ml-1 !px-2 !py-0">{count}</span>
      )}
    </button>
  );
}
