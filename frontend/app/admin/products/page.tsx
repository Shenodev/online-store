export default function AdminProductsPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-sora text-3xl font-bold text-white">Products</h1>
      <p className="mt-2 text-slate-400">
        CRUD table. Backend filters by JWT store_id.
      </p>
      <div className="mt-8 rounded-xl border border-slate-700 bg-slate-800 p-6 text-slate-400">
        Product table scaffold — wire to GET /api/v1/admin/products.
      </div>
    </main>
  );
}
