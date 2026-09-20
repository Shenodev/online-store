import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Subdomain gateway for Shenostore (see TRD §6.1).
 *
 * - admin.store.shenodev.tech -> /admin/* application
 * - store.store.shenodev.tech / custom domains -> /store/* application
 * - api.store.shenodev.tech is handled by the Spring Boot backend,
 *   never by this Next.js app (see root vercel.json).
 */
export function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const url = req.nextUrl.clone();

  if (host.startsWith("admin.")) {
    // Allow /admin/*, redirect root of admin host to dashboard.
    if (url.pathname === "/") {
      url.pathname = "/admin/dashboard";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // api.* must never be served by the frontend.
  if (host.startsWith("api.")) {
    return new NextResponse("API served by backend", { status: 404 });
  }

  // store.* host: root shows the global store selector (app/page.tsx).
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
