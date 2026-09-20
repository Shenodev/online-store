import { ProductCard } from "@/components/ProductCard";
import { api } from "@/lib/api";

export default async function StorePage({
  params,
}: {
  params: { storeId: string };
}) {
  let products: { id: string; title: string; price: number }[] = [];
  try {
    products = await api(`/api/v1/store/${params.storeId}/products`);
  } catch {
    products = [];
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-sora text-3xl font-bold text-white">Store</h1>
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {products.length === 0 ? (
          <div className="rounded-xl border border-slate-700 bg-slate-800 p-8 text-slate-400">
            Catalog scaffold for store {params.storeId}.
          </div>
        ) : (
          products.map((p) => (
            <ProductCard key={p.id} storeId={params.storeId} product={p} />
          ))
        )}
      </div>
    </main>
  );
}
