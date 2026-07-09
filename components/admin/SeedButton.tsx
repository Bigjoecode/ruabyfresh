"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { seedProducts } from "@/lib/actions";

export default function SeedButton() {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <button
      onClick={() => start(async () => { await seedProducts(); router.refresh(); })}
      disabled={pending}
      className="cursor-pointer rounded-full bg-[var(--color-leaf)] px-6 py-3 font-semibold text-[var(--color-forest-deep)] transition hover:brightness-105 disabled:opacity-50"
    >
      {pending ? "Adding…" : "Load default products"}
    </button>
  );
}
