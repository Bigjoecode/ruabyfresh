"use client";

import { useState } from "react";
import type { Product } from "@/lib/products";
import ProductVisual from "./ProductVisual";

/**
 * Renders the real product photo from /public/products, and automatically
 * falls back to the illustrated SVG if that image isn't there yet. This means
 * the site looks great today and upgrades itself the instant real photos are
 * dropped into the folder.
 */
export default function ProductImage({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed || !product.image) {
    return <ProductVisual product={product} className={className} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={product.image}
      alt={`${product.name} — ${product.size}`}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
      style={{ objectFit: "contain" }}
    />
  );
}
