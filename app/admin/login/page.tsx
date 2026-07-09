"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { supabaseConfigured } from "@/lib/supabase/config";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { error } = await createClient().auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Could not sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-dvh place-items-center bg-[var(--color-cream)] px-4">
      <div className="w-full max-w-sm rounded-3xl border border-[var(--color-forest)]/15 bg-white p-8 shadow-xl">
        <div className="mb-6 flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--color-forest)] font-display text-xl font-bold text-[var(--color-leaf)]">
            R
          </span>
          <div>
            <p className="font-display text-xl font-semibold text-[var(--color-forest)]">
              Ruaby Admin
            </p>
            <p className="text-xs text-[var(--color-ink)]/50">Sign in to continue</p>
          </div>
        </div>

        {!supabaseConfigured ? (
          <p className="rounded-xl bg-[var(--color-cream-deep)] p-4 text-sm text-[var(--color-ink)]/70">
            Admin isn&apos;t connected yet. Add your Supabase keys (see{" "}
            <code>supabase/schema.sql</code>) to enable sign-in.
          </p>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-[var(--color-forest)]">Email</span>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-[var(--color-forest)]/20 bg-white px-4 py-3 outline-none focus:border-[var(--color-leaf)] focus:ring-2 focus:ring-[var(--color-leaf)]/30"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-[var(--color-forest)]">Password</span>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-[var(--color-forest)]/20 bg-white px-4 py-3 outline-none focus:border-[var(--color-leaf)] focus:ring-2 focus:ring-[var(--color-leaf)]/30"
              />
            </label>
            {error && (
              <p className="rounded-lg bg-[var(--color-strawberry)]/10 px-3 py-2 text-sm text-[var(--color-strawberry)]" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[var(--color-forest)] py-3 font-semibold text-white transition hover:bg-[var(--color-forest-deep)] disabled:opacity-50"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
