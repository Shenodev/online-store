const BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "https://api.store.shenodev.tech";

export type StorefrontProduct = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  stockQuantity: number;
  imageUrl: string | null;
  createdAt: string;
};

export type ProductPage = {
  products: StorefrontProduct[];
  total: number;
};

/**
 * Server-side storefront fetches. Tenancy is path-scoped (`storeId`), so
 * each catalog stays isolated. Parses the Spring Data Page envelope with a
 * plain-array fallback.
 */
export async function getStoreProducts(
  storeId: string,
  opts: { q?: string; page?: number; size?: number } = {}
): Promise<ProductPage> {
  const params = new URLSearchParams({
    page: String(opts.page ?? 0),
    size: String(opts.size ?? 24),
  });
  if (opts.q) params.set("q", opts.q);
  try {
    const res = await fetch(
      `${BASE}/api/v1/store/${storeId}/products?${params}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return { products: [], total: 0 };
    const data = await res.json();
    const products: StorefrontProduct[] = Array.isArray(data)
      ? data
      : (data.content ?? []);
    const total =
      typeof data.totalElements === "number" ? data.totalElements : products.length;
    return { products, total };
  } catch {
    return { products: [], total: 0 };
  }
}

export async function getStoreProduct(
  storeId: string,
  productId: string
): Promise<StorefrontProduct | null> {
  try {
    const res = await fetch(
      `${BASE}/api/v1/store/${storeId}/product/${productId}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    return (await res.json()) as StorefrontProduct;
  } catch {
    return null;
  }
}
