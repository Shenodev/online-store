import { NextResponse } from "next/server";

const BACKEND =
  process.env.BACKEND_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "https://api.store.shenodev.tech";

const TOKEN_COOKIE = "sheno_admin_token";
const STORE_COOKIE = "sheno_admin_store";
const MAX_AGE = 60 * 60 * 24; // 24h — matches backend JWT TTL

/**
 * Admin session endpoint. Proxies credentials to Spring Boot and stores the
 * returned JWT in an HttpOnly cookie so client JS never sees the token.
 * The store id is mirrored into a readable cookie for UI use only.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const action = body?.action;
  const endpoint =
    action === "register"
      ? "/api/v1/admin/register"
      : action === "login"
        ? "/api/v1/admin/login"
        : null;

  if (!endpoint) {
    return NextResponse.json(
      { error: "Unknown action", code: 400 },
      { status: 400 }
    );
  }

  let res: Response;
  try {
    const { action: _action, ...credentials } = body;
    res = await fetch(`${BACKEND}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
  } catch {
    return NextResponse.json(
      { error: "Backend unreachable", code: 502 },
      { status: 502 }
    );
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok || typeof data.token !== "string" || typeof data.storeId !== "string") {
    return NextResponse.json(
      {
        error: typeof data.error === "string" ? data.error : "Authentication failed",
        code: res.status,
      },
      { status: res.status }
    );
  }

  const secure = process.env.NODE_ENV === "production";
  const response = NextResponse.json({ storeId: data.storeId, adminId: data.adminId });
  response.cookies.set(TOKEN_COOKIE, data.token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
  response.cookies.set(STORE_COOKIE, data.storeId, {
    httpOnly: false,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(TOKEN_COOKIE);
  response.cookies.delete(STORE_COOKIE);
  return response;
}
