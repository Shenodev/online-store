"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useStoreCart } from "@/lib/cart-registry";
import { useCartUI } from "./CartUIProvider";

/**
 * Sliding cart drawer for ONE store's bucket. Qty steppers, remove, clear,
 * per-store subtotal, and a checkout link namespaced to the same store —
 * items from different stores can never share a checkout session.
 */
export function CartDrawer() {
  const { openStoreId, closeCart } = useCartUI();

  useEffect(() => {
    if (!openStoreId) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeCart();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openStoreId, closeCart]);

  if (!openStoreId) return null;
  return <CartDrawerBody storeId={openStoreId} onClose={closeCart} />;
}

function CartDrawerBody({ storeId, onClose }: { storeId: string; onClose: () => void }) {
  const { items, subtotal, setQuantity, removeItem, clear } = useStoreCart(storeId);

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Cart">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md animate-slide-in flex-col border-l border-slate-700 bg-brand-surface">
        <div className="flex items-center justify-between gap-4 border-b border-slate-800 p-6">
          <h2 className="font-sora text-xl font-semibold text-white">Your cart</h2>
          <button onClick={onClose} aria-label="Close cart" className="btn-ghost !px-3 !py-1">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <p className="text-sm text-slate-400">
              Your cart for this store is empty.
            </p>
          ) : (
            <ul className="flex flex-col gap-4">
              {items.map((item) => (
                <li
                  key={item.productId}
                  className="rounded-xl border border-slate-700 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-inter text-sm font-medium text-white">
                        {item.title}
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId)}
                      aria-label={`Remove ${item.title}`}
                      className="text-sm text-slate-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setQuantity(item.productId, item.quantity - 1)}
                        aria-label="Decrease quantity"
                        className="btn-secondary btn-sm !px-3"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-inter text-sm text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(item.productId, item.quantity + 1)}
                        aria-label="Increase quantity"
                        className="btn-secondary btn-sm !px-3"
                      >
                        +
                      </button>
                    </div>
                    <p className="font-inter text-sm font-medium text-white">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-slate-800 p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">Subtotal</p>
              <p className="font-sora text-xl font-bold text-white">
                ${subtotal.toFixed(2)}
              </p>
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={clear} className="btn-secondary flex-1">
                Clear
              </button>
              <Link
                href={`/checkout?storeId=${storeId}`}
                onClick={onClose}
                className="btn-primary flex-1"
              >
                Checkout
              </Link>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
