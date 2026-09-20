export default function ProductDetailPage({
  params,
}: {
  params: { storeId: string; productId: string };
}) {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="font-sora text-3xl font-bold text-white">
        Product {params.productId}
      </h1>
      <p className="mt-2 text-slate-400">Store {params.storeId}</p>
    </main>
  );
}
