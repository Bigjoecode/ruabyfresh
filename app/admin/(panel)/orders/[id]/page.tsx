import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrder } from "@/lib/admin-data";
import { formatNaira } from "@/lib/products";
import StatusChanger from "@/components/admin/StatusChanger";

export const dynamic = "force-dynamic";

export default async function OrderDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  const rows: { k: string; v: string }[] = [
    { k: "Reference", v: order.reference },
    { k: "Placed", v: new Date(order.created_at).toLocaleString("en-NG") },
    { k: "Name", v: order.customer_name || "—" },
    { k: "Phone", v: order.customer_phone || "—" },
    {
      k: "Fulfilment",
      v:
        order.fulfilment === "delivery"
          ? `Delivery — ${order.address || "address to follow"}`
          : "Pickup",
    },
    ...(order.note ? [{ k: "Note", v: order.note }] : []),
  ];

  return (
    <div className="space-y-6">
      <Link href="/admin/orders" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-ink)]/60 hover:text-[var(--color-forest)]">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
        All bookings
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-display text-3xl font-semibold text-[var(--color-forest)]">
          {order.customer_name || "Booking"}
        </h1>
        {order.customer_phone && (
          <a
            href={`https://wa.me/${order.customer_phone.replace(/[^0-9]/g, "").replace(/^0/, "234")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-forest)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-forest-deep)]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Z" /></svg>
            Message customer
          </a>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* items */}
          <section className="rounded-2xl border border-[var(--color-forest)]/10 bg-white p-6">
            <h2 className="mb-4 font-display text-lg font-semibold text-[var(--color-forest)]">
              Items
            </h2>
            <div className="divide-y divide-[var(--color-forest)]/8">
              {order.items?.map((i, idx) => (
                <div key={idx} className="flex justify-between py-2.5">
                  <span className="text-[var(--color-ink)]/80">
                    {i.qty} × {i.name}
                  </span>
                  <span className="font-medium tabular-nums text-[var(--color-forest)]">
                    {formatNaira(i.price * i.qty)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-between border-t border-[var(--color-forest)]/10 pt-3">
              <span className="font-semibold text-[var(--color-forest)]">
                Total {order.bulk && <span className="text-xs text-[var(--color-rose)]">(bulk)</span>}
              </span>
              <span className="font-display text-xl font-semibold text-[var(--color-forest)]">
                {formatNaira(order.total)}
              </span>
            </div>
          </section>

          {/* details */}
          <section className="rounded-2xl border border-[var(--color-forest)]/10 bg-white p-6">
            <h2 className="mb-4 font-display text-lg font-semibold text-[var(--color-forest)]">
              Customer
            </h2>
            <dl className="space-y-2.5">
              {rows.map((r) => (
                <div key={r.k} className="flex gap-4 text-sm">
                  <dt className="w-28 shrink-0 text-[var(--color-ink)]/50">{r.k}</dt>
                  <dd className="text-[var(--color-ink)]/85">{r.v}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <div className="space-y-6">
          {/* status */}
          <section className="rounded-2xl border border-[var(--color-forest)]/10 bg-white p-6">
            <StatusChanger id={order.id} status={order.status} />
          </section>

          {/* receipt */}
          <section className="rounded-2xl border border-[var(--color-forest)]/10 bg-white p-6">
            <h2 className="mb-3 font-display text-lg font-semibold text-[var(--color-forest)]">
              Payment receipt
            </h2>
            {order.receipt_url ? (
              <a href={order.receipt_url} target="_blank" rel="noopener noreferrer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={order.receipt_url}
                  alt="Payment receipt"
                  className="w-full rounded-xl ring-1 ring-[var(--color-forest)]/10 transition hover:opacity-90"
                />
                <span className="mt-2 block text-center text-xs text-[var(--color-rose)]">
                  Open full size →
                </span>
              </a>
            ) : (
              <p className="text-sm text-[var(--color-ink)]/50">
                No receipt was uploaded with this order.
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
