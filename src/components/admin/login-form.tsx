"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { CircleNotchIcon, LockKeyIcon } from "@phosphor-icons/react";
import { fieldClass } from "@/components/enquiry";
import { haptic } from "@/lib/haptics";
import { button } from "@/lib/ui";

export function LoginForm() {
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Couldn't sign in");
      }
      const next = params.get("next");
      // Only follow redirects back into the admin, never to another site.
      window.location.href = next && next.startsWith("/admin") ? next : "/admin";
    } catch (e) {
      haptic(30);
      setError(e instanceof Error ? e.message : "Couldn't sign in");
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void submit();
      }}
      className="space-y-4 rounded-[28px] bg-paper p-5 shadow-card md:p-6"
    >
      <label className="block">
        <span className="text-sm font-semibold">Email</span>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required className={`${fieldClass} mt-2`} />
      </label>
      <label className="block">
        <span className="text-sm font-semibold">Password</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
          className={`${fieldClass} mt-2`}
        />
      </label>
      {error && (
        <p role="alert" className="rounded-2xl bg-brand-tint px-4 py-3 text-sm font-semibold text-brand-deep">
          {error}
        </p>
      )}
      <button type="submit" disabled={busy} className={`${button("primary", "lg")} w-full disabled:opacity-70`}>
        {busy ? <CircleNotchIcon size={20} weight="bold" className="animate-spin" /> : <LockKeyIcon size={20} weight="fill" />}
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
