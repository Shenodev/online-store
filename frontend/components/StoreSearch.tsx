"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Debounced catalog search — syncs `?q=` into the URL so the server
 * component refetches the store-scoped, title-filtered product page.
 */
export function StoreSearch({ storeId }: { storeId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    const t = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value.trim()) {
        params.set("q", value.trim());
      } else {
        params.delete("q");
      }
      router.replace(`/store/${storeId}?${params.toString()}`);
    }, 350);
    return () => clearTimeout(t);
  }, [value, router, storeId, searchParams]);

  return (
    <input
      type="search"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Search this store…"
      aria-label="Search products in this store"
      className="input md:max-w-xs"
    />
  );
}
