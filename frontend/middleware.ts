import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "sheno_admin_token";

// Admin routes reachable without a session (auth pages + invite landing).
const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/register", "/admin/invite"];

/**
 * Subdomain gateway for Shenostore (see TRD §6.1) + admin route guard.
 *
 * - admin.store.shenodev.tech -> /admin/* application
 * - store.store.shenodev.tech / custom domains -> /store/* application
 * - api.store.shenodev.tech is handled by the Spring Boot backend,
 *   never by this Next.js app (see root vercel.json).
 * - /admin/* (except login/register/invite) requires the HttpOnly session
 *   cookie; the JWT itself is validated by Spring Boot on every API call.
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
  }

  // api.* must never be served by the frontend.
  if (host.startsWith("api.")) {
    return new NextResponse("API served by backend", { status: 404 });
  }

  if (
    url.pathname.startsWith("/admin/") &&
    !PUBLIC_ADMIN_PATHS.some((p) => url.pathname.startsWith(p)) &&
    !req.cookies.has(SESSION_COOKIE)
  ) {
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  // store.* host: root shows the global store selector (app/page.tsx).
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/|.*\\.png$).*)"],
};
