"use client";

import { useState } from "react";
import { registerStoreSchema } from "@/lib/validations";
import { api } from "@/lib/api";

export default function AdminRegisterPage() {
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setError(null);
    const parsed = registerStoreSchema.safeParse({
      storeName: formData.get("storeName"),
      email: formData.get("email"),
      password: formData.get("password"),
    });
    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message ?? "Invalid input");
      return;
    }
    try {
      await api("/api/v1/admin/register", {
        method: "POST",
        body: JSON.stringify({
          storeName: parsed.data.storeName,
          email: parsed.data.email,
          password: parsed.data.password,
        }),
      });
      window.location.href = "/admin/dashboard";
    } catch (e) {
      setError(e instanceof Error ? e.message : "Registration failed");
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-12">
      <div className="rounded-xl bg-slate-800 p-8">
        <h1 className="font-sora text-2xl font-bold text-white">
          Create your store
        </h1>
        <form action={onSubmit} className="mt-6 flex flex-col gap-4">
          <input
            name="storeName"
            placeholder="Store name"
            className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button className="rounded-xl bg-cyan-500 px-4 py-2 font-medium text-slate-900 transition-colors duration-200 hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]">
            Create Store
          </button>
        </form>
      </div>
    </main>
  );
}
