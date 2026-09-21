export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://api.store.shenodev.tech";

type ApiOptions = RequestInit & { token?: string };

export async function api<T>(path: string, opts: ApiOptions = {}): Promise<T> {
  const { token, headers, ...init } = opts;
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error ?? `API error ${res.status}`);
  }
  return (await res.json()) as T;
}

/**
 * Same-origin call to the authenticated admin proxy
 * (`/api/admin/*` → Spring Boot `/api/v1/admin/*`). The session cookie is
 * sent automatically; the JWT never touches client JS.
 */
export async function adminApi<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(`/api/admin/${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(opts.headers ?? {}),
    },
  });
  if (!res.ok) {
    if (res.status === 401 && typeof window !== "undefined") {
      window.location.href = "/admin/login";
    }
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error ?? `API error ${res.status}`);
  }
  return (await res.json()) as T;
}
