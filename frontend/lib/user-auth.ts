/**
 * Client-side shopper session helpers. Like the admin flow, the JWT lives
 * ONLY in the HttpOnly `sheno_user_token` cookie (set/cleared by
 * `/api/user/session`) — never in JS.
 */
export type UserSession = {
  userId: string;
};

async function userSessionRequest(body: unknown): Promise<UserSession> {
  const res = await fetch("/api/user/session", {
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
  return data as UserSession;
}

export function signupUser(input: {
  email: string;
  password: string;
}): Promise<UserSession> {
  return userSessionRequest({ action: "signup", ...input });
}

export function loginUser(input: {
  email: string;
  password: string;
}): Promise<UserSession> {
  return userSessionRequest({ action: "login", ...input });
}

export async function logoutUser(): Promise<void> {
  await fetch("/api/user/session", { method: "DELETE" });
}
