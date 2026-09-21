export default function AdminProductsLoading() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12" aria-label="Loading products">
      <div className="skeleton h-9 w-48" />
      <div className="card mt-8 flex flex-col gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-12 w-full" />
        ))}
      </div>
    </main>
  );
}
