import { NextResponse } from "next/server";

const BACKEND =
  process.env.BACKEND_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "https://api.store.shenodev.tech";

const TOKEN_COOKIE = "sheno_user_token";
const MAX_AGE = 60 * 60 * 24; // 24h

/**
 * Shopper session endpoint. Proxies credentials to Spring Boot
 * (`POST /api/v1/user/register`, `POST /api/v1/user/login`) and stores the
 * returned JWT in an HttpOnly cookie so client JS never sees the token.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const action = body?.action;
  const endpoint =
    action === "signup"
      ? "/api/v1/user/register"
      : action === "login"
        ? "/api/v1/user/login"
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
  if (!res.ok || typeof data.token !== "string") {
    return NextResponse.json(
      {
        error: typeof data.error === "string" ? data.error : "Authentication failed",
        code: res.status,
      },
      { status: res.status }
    );
  }

  const response = NextResponse.json({ userId: data.userId ?? null });
  response.cookies.set(TOKEN_COOKIE, data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(TOKEN_COOKIE);
  return response;
}
