import Link from "next/link";
import { getAdminProducts } from "@/lib/admin-data";
import { formatNaira } from "@/lib/products";
import SeedButton from "@/components/admin/SeedButton";

export const dynamic = "force-dynamic";

export default async function ProductsAdmin() {
  const products = await getAdminProducts();

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold text-[var(--color-forest)]">
            Products
          </h1>
          <p className="text-[var(--color-ink)]/60">Add, edit, price, and hide products.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-[var(--color-forest)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--color-forest-deep)]"
        >
          + Add product
        </Link>
      </header>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--color-forest)]/25 bg-white p-10 text-center">
          <p className="font-display text-xl text-[var(--color-forest)]">No products yet</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-[var(--color-ink)]/60">
            Load the current catalogue (3 parfaits + 3 yoghurt drinks) to start, then edit freely.
          </p>
          <div className="mt-5">
            <SeedButton />
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[var(--color-forest)]/10 bg-white">
          <div className="divide-y divide-[var(--color-forest)]/8">
            {products.map((p) => (
              <Link
                key={p.id}
                href={`/admin/products/${p.id}`}
                className="flex items-center gap-4 px-4 py-3 transition hover:bg-[var(--color-cream)]/60 md:px-6"
              >
                <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl border border-[var(--color-forest)]/10 bg-[var(--color-cream)]">
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image} alt="" className="h-full w-full object-contain" />
                  ) : (
                    <span className="h-6 w-6 rounded-full" style={{ background: p.colors[1] }} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-[var(--color-ink)]">{p.name}</p>
                  <p className="text-xs text-[var(--color-ink)]/50">
                    {p.category} · {p.size}
                    {p.variety ? ` · ${p.variety}` : ""}
                  </p>
                </div>
                <span className="font-display font-semibold text-[var(--color-forest)]">
                  {formatNaira(p.launchPrice)}
                </span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-ink)]/30"><path d="m9 18 6-6-6-6" /></svg>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
