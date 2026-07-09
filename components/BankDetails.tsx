"use client";

import { useState } from "react";
import { BRAND, formatNaira } from "@/lib/products";

export default function BankDetails({ total }: { total?: number }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(BRAND.bank.number);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="rounded-2xl border border-dashed border-[var(--color-forest)]/25 bg-[var(--color-cream)]/60 p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-forest)]/60">
          Pay by bank transfer
        </span>
        {total ? (
          <span className="font-display text-lg font-semibold text-[var(--color-rose)]">
            {formatNaira(total)}
          </span>
        ) : null}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <div>
          <p className="font-display text-2xl font-semibold tracking-wide text-[var(--color-forest)] tabular-nums">
            {BRAND.bank.number}
          </p>
          <p className="text-sm text-[var(--color-ink)]/70">
            {BRAND.bank.name} · {BRAND.bank.account}
          </p>
        </div>
        <button
          type="button"
          onClick={copy}
          className="shrink-0 cursor-pointer rounded-full bg-[var(--color-forest)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-forest-deep)]"
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
    </div>
  );
}
