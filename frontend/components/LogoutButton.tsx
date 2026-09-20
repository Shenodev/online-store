"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { logoutAdmin } from "@/lib/auth";

export function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onClick() {
    setPending(true);
    try {
      await logoutAdmin();
    } finally {
      setPending(false);
      router.push("/admin/login");
      router.refresh();
    }
  }

  return (
    <button onClick={onClick} disabled={pending} className="btn-secondary btn-sm">
      {pending ? "Logging out…" : "Log out"}
    </button>
  );
}
