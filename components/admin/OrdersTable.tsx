"use client";

import Link from "next/link";
import { useState } from "react";
import { formatNaira } from "@/lib/products";
import { ORDER_STATUSES, type Order } from "@/lib/types";
import StatusBadge from "./StatusBadge";

export default function OrdersTable({ orders }: { orders: Order[] }) {
  const [tab, setTab] = useState<string>("all");
  const filtered = tab === "all" ? orders : orders.filter((o) => o.status === tab);

  const tabs = ["all", ...ORDER_STATUSES] as const;
  const count = (t: string) =>
    t === "all" ? orders.length : orders.filter((o) => o.status === t).length;

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition ${
              tab === t
                ? "bg-[var(--color-forest)] text-white"
                : "bg-white text-[var(--color-ink)]/60 hover:bg-[var(--color-cream-deep)]"
            }`}
          >
            {t} <span className="opacity-60">({count(t)})</span>
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--color-forest)]/10 bg-white">
        {filtered.length === 0 ? (
          <p className="px-6 py-10 text-center text-[var(--color-ink)]/50">
            No {tab === "all" ? "" : tab} bookings.
          </p>
        ) : (
          <div className="divide-y divide-[var(--color-forest)]/8">
            {filtered.map((o) => (
              <Link
                key={o.id}
                href={`/admin/orders/${o.id}`}
                className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3.5 transition hover:bg-[var(--color-cream)]/60 md:px-6"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-[var(--color-ink)]">
                    {o.customer_name || "—"}
                  </p>
                  <p className="text-xs text-[var(--color-ink)]/50">
                    {o.reference} · {o.customer_phone || "no phone"}
                  </p>
                </div>
                <p className="hidden text-sm text-[var(--color-ink)]/60 sm:block">
                  {o.items?.reduce((s, i) => s + i.qty, 0)} item(s)
                </p>
                <p className="w-24 text-right font-display font-semibold text-[var(--color-forest)]">
                  {formatNaira(o.total)}
                </p>
                <div className="flex w-28 items-center justify-end gap-2">
                  {o.receipt_url && (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--color-leaf)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="Has receipt"><path d="M20 6 9 17l-5-5" /></svg>
                  )}
                  <StatusBadge status={o.status} />
                </div>
                <p className="w-full text-xs text-[var(--color-ink)]/40 sm:w-auto sm:pl-2">
                  {new Date(o.created_at).toLocaleString("en-NG", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
