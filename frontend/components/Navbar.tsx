import Link from "next/link";
import type { ReactNode } from "react";

type NavbarProps = {
  /** Items in the shopper's active cart (store-scoped). */
  cartCount?: number;
  /** Show the centered catalog search field. */
  showSearch?: boolean;
  /** Override the right-side actions (e.g. auth buttons on the landing). */
  actions?: ReactNode;
};

/**
 * Shenostore top navbar (ui-ux-brief.md §6.1): S-logo + wordmark left,
 * search centered, actions right. Flat Deep Slate with a hairline
 * border — no shadows.
 */
export function Navbar({ cartCount = 0, showSearch = true, actions }: NavbarProps) {
  return (
    <header className="border-b border-slate-800 bg-brand-deep">
      <nav className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#06B6D4]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-icon.png" alt="Shenostore home" className="h-8 w-8" />
          <span className="font-sora text-lg font-bold text-white">
            Shenostore
          </span>
        </Link>

        {showSearch && (
          <div className="mx-auto hidden max-w-md flex-1 md:block">
            <input
              type="search"
              placeholder="Search products…"
              aria-label="Search products"
              className="input"
            />
          </div>
        )}

        <div className="ml-auto flex items-center gap-2">
          {actions ?? (
            <>
              <Link href="/cart" className="btn-ghost relative">
                Cart
                {cartCount > 0 && (
                  <span className="badge-accent ml-1 !px-2 !py-0">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link href="/admin/dashboard" className="btn-ghost">
                Admin
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
