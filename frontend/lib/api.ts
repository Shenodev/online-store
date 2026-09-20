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
