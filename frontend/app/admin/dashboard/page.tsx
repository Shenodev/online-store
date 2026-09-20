import { LogoutButton } from "@/components/LogoutButton";

export default function AdminDashboardPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-sora text-3xl font-bold text-white">Dashboard</h1>
        <LogoutButton />
      </div>
      <p className="mt-2 text-slate-400">
        Store metrics. Served by <code>GET /api/v1/admin/products</code> with
        store_id extracted from JWT.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {["Revenue", "Orders", "Products"].map((k) => (
          <div
            key={k}
            className="rounded-xl border border-slate-700 bg-slate-800 p-6"
          >
            <p className="text-slate-400">{k}</p>
            <p className="mt-2 font-sora text-2xl font-bold text-white">—</p>
          </div>
        ))}
      </div>
    </main>
  );
}
