import Link from "next/link";

export function Navbar() {
  return (
    <header className="border-b border-slate-700 bg-slate-900">
      <nav className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-icon.png" alt="Shenostore" className="h-8 w-8" />
          <span className="font-sora text-lg font-bold text-white">
            Shenostore
          </span>
        </Link>
        <div className="mx-auto hidden max-w-md flex-1 md:block">
          <input
            placeholder="Search products…"
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]"
          />
        </div>
        <div className="ml-auto flex items-center gap-4">
          <Link href="/cart" className="text-slate-300 hover:text-cyan-500">
            Cart
          </Link>
          <Link href="/admin/dashboard" className="text-slate-300 hover:text-cyan-500">
            Admin
          </Link>
        </div>
      </nav>
    </header>
  );
}
