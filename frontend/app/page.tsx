import Link from "next/link";
import { Button } from "@/components/Button";

async function getStores() {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "https://api.store.shenodev.tech";
  try {
    const res = await fetch(`${base}/api/v1/stores`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return (await res.json()) as { id: string; name: string }[];
  } catch {
    return [];
  }
}

export default async function Home() {
  const stores = await getStores();

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-sora text-4xl font-bold text-white">Shenostore</h1>
      <p className="mt-4 max-w-xl text-slate-400">
        Discover independent stores powered by Shenostore. Select a store to
        browse its isolated catalog.
      </p>

      <div className="mt-8 flex gap-4">
        <Button href="/admin/register">Create Store</Button>
        <Button href="/admin/dashboard" variant="secondary">
          Admin Dashboard
        </Button>
      </div>

      <section className="mt-12">
        <h2 className="font-sora text-2xl font-semibold text-white">
          Available stores
        </h2>
        {stores.length === 0 ? (
          <div className="mt-6 rounded-xl border border-slate-700 bg-slate-800 p-8 text-slate-400">
            No stores yet. The storefront list is served by
            <code className="mx-1 text-cyan-500">GET /api/v1/stores</code>.
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            {stores.map((s) => (
              <Link
                key={s.id}
                href={`/store/${s.id}`}
                className="rounded-xl border border-slate-700 bg-slate-800 p-6 transition-colors duration-200 hover:border-cyan-500"
              >
                <h3 className="font-sora text-lg font-semibold text-white">
                  {s.name}
                </h3>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
