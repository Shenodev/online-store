"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";
import { loginUser, logoutUser, signupUser } from "@/lib/user-auth";
import { userLoginSchema, userSignupSchema } from "@/lib/validations";

/**
 * Landing-page shopper auth entry points. Sign up / Log in open
 * rounded-xl modals; success stores the JWT in the HttpOnly session cookie
 * (via `/api/user/session`) and flips the buttons to a logged-in state.
 */
export function UserAuthButtons() {
  const [modal, setModal] = useState<"login" | "signup" | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  function open(kind: "login" | "signup") {
    setError(null);
    setModal(kind);
  }

  async function onSubmit(formData: FormData) {
    setError(null);
    const raw = {
      email: formData.get("email"),
      password: formData.get("password"),
    };
    const parsed =
      modal === "signup" ? userSignupSchema.safeParse(raw) : userLoginSchema.safeParse(raw);
    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message ?? "Invalid input");
      return;
    }
    setPending(true);
    try {
      if (modal === "signup") {
        await signupUser(parsed.data);
      } else {
        await loginUser(parsed.data);
      }
      setModal(null);
      setLoggedIn(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Authentication failed");
    } finally {
      setPending(false);
    }
  }

  async function onLogout() {
    await logoutUser();
    setLoggedIn(false);
  }

  if (loggedIn) {
    return (
      <div className="flex items-center gap-2">
        <span className="badge-accent">Signed in</span>
        <button onClick={onLogout} className="btn-ghost">
          Log out
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <button onClick={() => open("login")} className="btn-ghost">
          Log in
        </button>
        <button onClick={() => open("signup")} className="btn-primary btn-sm">
          Sign up
        </button>
      </div>

      <Modal
        open={modal !== null}
        title={modal === "signup" ? "Create account" : "Welcome back"}
        onClose={() => setModal(null)}
      >
        <form action={onSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="user-email" className="label">
              Email
            </label>
            <input
              id="user-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              className="input"
            />
          </div>
          <div>
            <label htmlFor="user-password" className="label">
              Password
            </label>
            <input
              id="user-password"
              name="password"
              type="password"
              placeholder={modal === "signup" ? "Minimum 8 characters" : "Your password"}
              autoComplete={modal === "signup" ? "new-password" : "current-password"}
              className="input"
            />
          </div>
          {error && (
            <p role="alert" className="text-sm text-red-400">
              {error}
            </p>
          )}
          <Button type="submit" disabled={pending}>
            {pending
              ? "Please wait…"
              : modal === "signup"
                ? "Sign up"
                : "Log in"}
          </Button>
          <p className="text-center text-sm text-slate-400">
            {modal === "signup" ? (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => open("login")}
                  className="text-[#06B6D4] hover:underline"
                >
                  Log in
                </button>
              </>
            ) : (
              <>
                New to Shenostore?{" "}
                <button
                  type="button"
                  onClick={() => open("signup")}
                  className="text-[#06B6D4] hover:underline"
                >
                  Sign up
                </button>
              </>
            )}
          </p>
        </form>
      </Modal>
    </>
  );
}
