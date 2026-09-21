"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { Navbar } from "@/components/Navbar";
import { listCartStoreIds, useStoreCart } from "@/lib/cart-registry";

/**
 * Dedicated cart page. Groups buckets by store — each store gets its own
 * section with steppers, subtotal, and an isolated checkout link, so
 * products from different stores never share a checkout session.
 */
export default function CartPage() {
  const [storeIds, setStoreIds] = useState<string[]>([]);

  const refresh = useCallback(() => setStoreIds(listCartStoreIds()), []);

  useEffect(() => {
    refresh();
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);

  return (
    <>
      <Navbar showSearch={false} />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="font-sora text-3xl font-bold text-white">Cart</h1>
        <p className="mt-2 text-slate-400">
          Carts are kept separate per store — check out each store on its own.
        </p>

        {storeIds.length === 0 ? (
          <div className="card mt-8 text-slate-400">
            Your cart is empty.{" "}
            <Link href="/" className="text-[#06B6D4] hover:underline">
              Discover stores
            </Link>
          </div>
        ) : (
          <div className="mt-8 flex flex-col gap-6">
            {storeIds.map((storeId) => (
              <StoreCartSection key={storeId} storeId={storeId} onEmpty={refresh} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}

function StoreCartSection({
  storeId,
  onEmpty,
}: {
  storeId: string;
  onEmpty: () => void;
}) {
  const { items, subtotal, setQuantity, removeItem, clear } = useStoreCart(storeId);

  useEffect(() => {
    if (items.length === 0) onEmpty();
  }, [items.length, onEmpty]);

  if (items.length === 0) return null;

  return (
    <section className="card" aria-label={`Cart for store ${storeId}`}>
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-sora text-lg font-semibold text-white">
          <Link href={`/store/${storeId}`} className="hover:text-[#06B6D4]">
            Store {storeId.slice(0, 8)}…
          </Link>
        </h2>
        <button onClick={clear} className="text-sm text-slate-400 hover:text-red-300">
          Clear
        </button>
      </div>

      <ul className="mt-4 flex flex-col gap-4">
        {items.map((item) => (
          <li
            key={item.productId}
            className="flex items-center justify-between gap-3 rounded-xl border border-slate-700 p-4"
          >
            <div>
              <p className="font-inter text-sm font-medium text-white">{item.title}</p>
              <p className="mt-1 text-sm text-slate-400">
                ${item.price.toFixed(2)} each
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(item.productId, item.quantity - 1)}
                aria-label={`Decrease ${item.title}`}
                className="btn-secondary btn-sm !px-3"
              >
                −
              </button>
              <span className="w-8 text-center text-sm text-white">{item.quantity}</span>
              <button
                onClick={() => setQuantity(item.productId, item.quantity + 1)}
                aria-label={`Increase ${item.title}`}
                className="btn-secondary btn-sm !px-3"
              >
                +
              </button>
              <button
                onClick={() => removeItem(item.productId)}
                aria-label={`Remove ${item.title}`}
                className="ml-2 text-sm text-slate-400 hover:text-red-300"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-4">
        <p className="text-sm text-slate-400">Subtotal</p>
        <p className="font-sora text-xl font-bold text-white">${subtotal.toFixed(2)}</p>
      </div>
      <Button href={`/checkout?storeId=${storeId}`} className="mt-4 w-full">
        Checkout this store
      </Button>
    </section>
  );
}
