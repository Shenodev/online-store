"use client";

import { useMemo, useState } from "react";
import { createCartStore } from "@/lib/cart";
import type { StorefrontProduct } from "@/lib/storefront";

/**
 * Store-scoped add-to-cart. Writes into the `cart_store_<storeId>`
 * persisted bucket so carts never mix across tenants.
 */
export function AddToCartButton({
  storeId,
  product,
}: {
  storeId: string;
  product: StorefrontProduct;
}) {
  const useCart = useMemo(() => createCartStore(storeId), [storeId]);
  const addItem = useCart((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const soldOut = product.stockQuantity === 0;

  function onAdd() {
    addItem({
      productId: product.id,
      title: product.title,
      price: product.price,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
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
