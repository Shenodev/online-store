/**
 * Client-side admin session helpers. The JWT itself lives ONLY in the
 * HttpOnly `sheno_admin_token` cookie (set/cleared by
 * `/api/admin/session`) — it is never readable from JS, which keeps XSS
 * from stealing it. The readable `sheno_admin_store` cookie carries just
 * the store id for UI purposes.
 */
export type AdminSession = {
  storeId: string;
  adminId: string;
};

async function sessionRequest(body: unknown): Promise<AdminSession> {
  const res = await fetch("/api/admin/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      typeof data.error === "string" ? data.error : `Request failed (${res.status})`
    );
  }
  return data as AdminSession;
}

export function registerAdmin(input: {
  storeName: string;
  email: string;
  password: string;
}): Promise<AdminSession> {
  return sessionRequest({ action: "register", ...input });
}

export function loginAdmin(input: {
  email: string;
  password: string;
}): Promise<AdminSession> {
  return sessionRequest({ action: "login", ...input });
}

export async function logoutAdmin(): Promise<void> {
  await fetch("/api/admin/session", { method: "DELETE" });
}

export function getAdminStoreId(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((c) => c.startsWith("sheno_admin_store="));
  return match ? decodeURIComponent(match.split("=").slice(1).join("=")) : null;
}
