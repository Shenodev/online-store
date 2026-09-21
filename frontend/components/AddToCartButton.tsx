"use client";

import { useState } from "react";
import { getCartStore } from "@/lib/cart-registry";
import type { StorefrontProduct } from "@/lib/storefront";
import { useCartUI } from "./CartUIProvider";

/**
 * Store-scoped add-to-cart. Writes into the shared `cart_store_<storeId>`
 * bucket (never mixed across tenants) and opens the drawer on success.
 * Outside a CartUIProvider the drawer call is a safe no-op.
 */
export function AddToCartButton({
  storeId,
  product,
}: {
  storeId: string;
  product: StorefrontProduct;
}) {
  const { openCart } = useCartUI();
  const [added, setAdded] = useState(false);
  const soldOut = product.stockQuantity === 0;

  function onAdd() {
    getCartStore(storeId).getState().addItem({
      productId: product.id,
      title: product.title,
      price: product.price,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    openCart(storeId);
  }

  return (
    <button
      onClick={onAdd}
      disabled={soldOut}
      className="btn-primary w-full sm:w-auto"
    >
      {soldOut ? "Out of stock" : added ? "Added to cart ✓" : "Add to Cart"}
    </button>
  );
}
