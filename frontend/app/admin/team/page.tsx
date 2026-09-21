"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { adminApi } from "@/lib/api";
import { inviteMemberSchema } from "@/lib/validations";

type InviteResult = {
  email: string;
  expiresAt: string;
};

export default function AdminTeamPage() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invited, setInvited] = useState<InviteResult | null>(null);

  async function onSubmit(formData: FormData) {
    setError(null);
    setInvited(null);
    const parsed = inviteMemberSchema.safeParse({
      email: formData.get("email"),
    });
    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message ?? "Invalid input");
      return;
    }
    setPending(true);
    try {
      const result = await adminApi<InviteResult>("invite", {
        method: "POST",
        body: JSON.stringify(parsed.data),
      });
      setInvited(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invite failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-sora text-3xl font-bold text-white">Team</h1>
      <p className="mt-2 max-w-xl text-slate-400">
        Invite staff to help manage your store. Invited members join as
        secondary admins bound to this store only.
      </p>

      <div className="card mt-8">
        <h2 className="font-sora text-lg font-semibold text-white">
          Invite a member
        </h2>
        <form action={onSubmit} className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label htmlFor="email" className="label">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="teammate@example.com"
              autoComplete="email"
              className="input"
            />
          </div>
          <Button type="submit" disabled={pending}>
            {pending ? "Sending…" : "Send invite"}
          </Button>
        </form>

        {error && (
          <p role="alert" className="mt-4 text-sm text-red-400">
            {error}
          </p>
        )}
        {invited && (
          <div
            role="status"
            className="mt-4 rounded-xl border border-[#06B6D4] p-4 text-sm text-slate-200"
          >
            Invite sent to <span className="font-medium text-white">{invited.email}</span>.
            It expires on{" "}
            {new Date(invited.expiresAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            .
          </div>
        )}
      </div>

      <div className="card mt-6">
        <h2 className="font-sora text-lg font-semibold text-white">
          How invites work
        </h2>
        <ol className="mt-4 flex list-decimal flex-col gap-3 pl-5 text-sm text-slate-400">
          <li>Only primary admins can send invites for this store.</li>
          <li>The teammate receives a secure link valid for 72 hours.</li>
          <li>Accepting the link creates a secondary admin on this store.</li>
        </ol>
      </div>
    </main>
  );
}
