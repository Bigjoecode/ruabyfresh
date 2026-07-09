import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { products, formatNaira, LAUNCH_OFFER } from "@/lib/products";
import ProductDetail from "@/components/ProductDetail";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = products.find((p) => p.id === id);
  if (!product) return { title: "Ruaby Fresh" };
  const price = LAUNCH_OFFER ? product.launchPrice : product.price;
  return {
    title: `${product.name} — Ruaby Fresh`,
    description: `${product.tagline} ${formatNaira(price)}. Made fresh daily in Asaba — no artificial preservatives. Pre-order now.`,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
