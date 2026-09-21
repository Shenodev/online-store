import { ProductCard } from "@/components/ProductCard";
import { StoreSearch } from "@/components/StoreSearch";
import { getStoreProducts } from "@/lib/storefront";

export default async function StorePage({
  params,
  searchParams,
}: {
  params: { storeId: string };
  searchParams: { q?: string };
}) {
  const { products, total } = await getStoreProducts(params.storeId, {
    q: searchParams.q,
  });

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-sora text-3xl font-bold md:text-4xl">Store</h1>
            <p className="mt-2 text-slate-400">
              {total === 0
                ? "No products in this catalog yet."
                : `${total} product${total === 1 ? "" : "s"}`}
              {searchParams.q ? ` matching “${searchParams.q}”` : ""}
            </p>
          </div>
          <StoreSearch storeId={params.storeId} />
        </div>

        {products.length === 0 ? (
          <div className="card mt-8 text-slate-400">
            {searchParams.q
              ? "Nothing matches your search in this store."
              : "This store has not listed any products yet."}
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} storeId={params.storeId} product={p} />
            ))}
          </div>
        )}
      </main>
  );
}
