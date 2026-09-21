import Link from "next/link";
import { Button } from "@/components/Button";
import { Navbar } from "@/components/Navbar";
import { UserAuthButtons } from "@/components/UserAuthButtons";

type StoreSummary = {
  id: string;
  name: string;
};

async function getStores(): Promise<{ stores: StoreSummary[]; total: number }> {
  const base =
    process.env.NEXT_PUBLIC_API_URL ?? "https://api.store.shenodev.tech";
  try {
    const res = await fetch(`${base}/api/v1/stores?page=0&size=24`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return { stores: [], total: 0 };
    const data = await res.json();
    // Spring Data Page envelope — fall back to a plain array.
    const stores: StoreSummary[] = Array.isArray(data) ? data : (data.content ?? []);
    const total = typeof data.totalElements === "number" ? data.totalElements : stores.length;
    return { stores, total };
  } catch {
    return { stores: [], total: 0 };
  }
}

function StoreInitial({ name }: { name: string }) {
  return (
    <div
      aria-hidden
      className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#06B6D4] font-sora text-xl font-bold text-[#06B6D4]"
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

export default async function Home() {
  const { stores, total } = await getStores();

  return (
    <>
      <Navbar showSearch={false} actions={<UserAuthButtons />} />
      <main className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <section className="max-w-2xl">
          <h1 className="font-sora text-4xl font-bold text-white md:text-5xl">
            Independent stores, one home.
          </h1>
          <p className="mt-4 text-slate-400">
            Discover merchants powered by Shenostore. Pick a store to browse
            its isolated catalog — your cart stays separate per store.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/admin/register">Sell on Shenostore</Button>
            <Button href="/admin/dashboard" variant="secondary">
              Merchant login
            </Button>
          </div>
        </section>

        <section className="mt-16">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-sora text-2xl font-semibold text-white">
              Available stores
            </h2>
            {total > 0 && (
              <p className="text-sm text-slate-400">
                {total} store{total === 1 ? "" : "s"}
              </p>
            )}
          </div>

          {stores.length === 0 ? (
            <div className="card mt-6 text-slate-400">
              No stores yet — be the first merchant to open one.
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {stores.map((s) => (
                <Link
                  key={s.id}
                  href={`/store/${s.id}`}
                  className="card !p-6 transition-colors duration-200 hover:border-[#06B6D4] focus:outline-none focus:ring-2 focus:ring-[#06B6D4]"
                >
                  <StoreInitial name={s.name} />
                  <h3 className="mt-4 font-sora text-lg font-semibold text-white">
                    {s.name}
                  </h3>
                  <p className="mt-2 text-sm text-[#06B6D4]">
                    Browse catalog →
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
