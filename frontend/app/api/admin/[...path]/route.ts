import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BACKEND =
  process.env.BACKEND_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "https://api.store.shenodev.tech";

/**
 * Authenticated admin API proxy. Reads the JWT from the HttpOnly session
 * cookie and forwards it as a Bearer token to Spring Boot, so client
 * components call same-origin `/api/admin/*` without ever seeing the JWT.
 * Backend status codes and `{error, code}` bodies pass through untouched.
 */
async function proxy(req: Request, params: { path: string[] }) {
  const token = cookies().get("sheno_admin_token")?.value;
  if (!token) {
    return NextResponse.json(
      { error: "Not authenticated", code: 401 },
      { status: 401 }
    );
  }

  const query = new URL(req.url).search;
  const url = `${BACKEND}/api/v1/admin/${params.path.join("/")}${query}`;

  const init: RequestInit = {
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = await req.text();
  }

  let res: Response;
  try {
    res = await fetch(url, init);
  } catch {
    return NextResponse.json(
      { error: "Backend unreachable", code: 502 },
      { status: 502 }
    );
  }

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}

type Ctx = { params: { path: string[] } };

export function GET(req: Request, ctx: Ctx) {
  return proxy(req, ctx.params);
}
export function POST(req: Request, ctx: Ctx) {
  return proxy(req, ctx.params);
}
export function PUT(req: Request, ctx: Ctx) {
  return proxy(req, ctx.params);
}
export function PATCH(req: Request, ctx: Ctx) {
  return proxy(req, ctx.params);
}
export function DELETE(req: Request, ctx: Ctx) {
  return proxy(req, ctx.params);
}
