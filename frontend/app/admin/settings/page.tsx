export default function AdminSettingsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-sora text-3xl font-bold text-white">Settings</h1>
      <div className="mt-8 rounded-xl bg-slate-800 p-8">
        <h2 className="font-sora text-lg font-semibold text-white">
          Custom domain
        </h2>
        <input
          placeholder="shop.example.com"
          className="mt-4 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]"
        />
      </div>
    </main>
  );
}
