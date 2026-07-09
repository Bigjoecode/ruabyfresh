import Link from "next/link";
import { getOrders } from "@/lib/admin-data";
import { formatNaira } from "@/lib/products";
import StatusBadge from "@/components/admin/StatusBadge";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const orders = await getOrders();
  const newCount = orders.filter((o) => o.status === "new").length;
  const revenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((s, o) => s + o.total, 0);
  const recent = orders.slice(0, 6);

  const stats = [
    { label: "Total bookings", value: orders.length.toString() },
    { label: "New / unconfirmed", value: newCount.toString() },
    { label: "Revenue (excl. cancelled)", value: formatNaira(revenue) },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-semibold text-[var(--color-forest)]">
          Dashboard
        </h1>
        <p className="text-[var(--color-ink)]/60">Your bookings at a glance.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-[var(--color-forest)]/10 bg-white p-6">
            <p className="text-sm text-[var(--color-ink)]/55">{s.label}</p>
            <p className="mt-2 font-display text-3xl font-semibold text-[var(--color-forest)]">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <section className="rounded-2xl border border-[var(--color-forest)]/10 bg-white">
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="font-display text-xl font-semibold text-[var(--color-forest)]">
            Recent bookings
          </h2>
          <Link href="/admin/orders" className="text-sm font-semibold text-[var(--color-rose)] hover:underline">
            View all →
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="px-6 pb-8 pt-2 text-[var(--color-ink)]/50">
            No bookings yet. They&apos;ll appear here the moment a customer checks out.
          </p>
        ) : (
          <div className="divide-y divide-[var(--color-forest)]/8">
            {recent.map((o) => (
              <Link
                key={o.id}
                href={`/admin/orders/${o.id}`}
                className="flex items-center justify-between gap-4 px-6 py-3 transition hover:bg-[var(--color-cream)]/60"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-[var(--color-ink)]">
                    {o.customer_name || "—"}{" "}
                    <span className="text-[var(--color-ink)]/40">· {o.reference}</span>
                  </p>
                  <p className="text-sm text-[var(--color-ink)]/55">
                    {o.items?.reduce((s, i) => s + i.qty, 0)} item(s) ·{" "}
                    {new Date(o.created_at).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-display font-semibold text-[var(--color-forest)]">
                    {formatNaira(o.total)}
                  </span>
                  <StatusBadge status={o.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
