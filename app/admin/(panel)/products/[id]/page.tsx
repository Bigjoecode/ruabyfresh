import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminProduct } from "@/lib/admin-data";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProduct({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";
  const product = isNew ? null : await getAdminProduct(id);
  if (!isNew && !product) notFound();

  return (
    <div className="space-y-6">
      <Link href="/admin/products" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-ink)]/60 hover:text-[var(--color-forest)]">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
        All products
      </Link>
      <h1 className="font-display text-3xl font-semibold text-[var(--color-forest)]">
        {isNew ? "New product" : product!.name}
      </h1>
      <ProductForm product={product ?? undefined} />
    </div>
  );
}
