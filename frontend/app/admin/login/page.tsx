"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/Button";
import { loginAdmin } from "@/lib/auth";
import { adminLoginSchema } from "@/lib/validations";

export default function AdminLoginPage() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setError(null);
    const parsed = adminLoginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });
    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message ?? "Invalid input");
      return;
    }
    setPending(true);
    try {
      await loginAdmin(parsed.data);
      router.push("/admin/dashboard");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-12">
      <div className="card">
        <h1 className="font-sora text-2xl font-bold">Admin login</h1>
        <p className="mt-2 text-sm text-slate-400">
          Access your store dashboard.
        </p>
        <form action={onSubmit} className="mt-6 flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="owner@example.com"
              autoComplete="email"
              className="input"
            />
          </div>
          <div>
            <label htmlFor="password" className="label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Your password"
              autoComplete="current-password"
              className="input"
            />
          </div>
          {error && (
            <p role="alert" className="text-sm text-red-400">
              {error}
            </p>
          )}
          <Button type="submit" disabled={pending}>
            {pending ? "Logging in…" : "Log in"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-400">
          New to Shenostore?{" "}
          <Link
            href="/admin/register"
            className="text-[#06B6D4] hover:underline focus:outline-none focus:ring-2 focus:ring-[#06B6D4]"
          >
            Create a store
          </Link>
        </p>
      </div>
    </main>
  );
}
