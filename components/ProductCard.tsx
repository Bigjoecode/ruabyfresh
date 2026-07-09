"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useState } from "react";
import { formatNaira, type Product } from "@/lib/products";
import ProductVisual from "./ProductVisual";
import { useCart } from "./cart";

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  // 3D tilt on pointer move
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 200, damping: 20 });

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  const handleAdd = () => {
    add(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <motion.article
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d", transformPerspective: 900 }}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col overflow-hidden rounded-[28px] glass p-5"
    >
      {product.badge && (
        <span className="absolute right-4 top-4 z-20 rounded-full bg-[var(--color-rose)] px-3 py-1 text-xs font-bold text-white shadow-lg">
          {product.badge}
        </span>
      )}

      {/* colour glow behind product */}
      <div
        className="absolute left-1/2 top-16 h-40 w-40 -translate-x-1/2 rounded-full opacity-50 blur-2xl transition-opacity duration-500 group-hover:opacity-90"
        style={{ background: product.colors[1] }}
      />

      <div
        style={{ transform: "translateZ(45px)" }}
        className="relative mx-auto h-52 w-full"
      >
        <ProductVisual
          product={product}
          className="h-full w-full transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="mt-3" style={{ transform: "translateZ(25px)" }}>
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full bg-[var(--color-leaf-soft)]/50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-forest)]">
            {product.category}
          </span>
          <span className="text-xs font-medium text-[var(--color-forest)]/60">
            {product.size}
          </span>
        </div>

        <h3 className="mt-3 font-display text-2xl font-semibold text-[var(--color-forest)]">
          {product.name}
        </h3>
        <p className="mt-1 min-h-[2.5rem] text-sm text-[var(--color-ink)]/60">
          {product.tagline}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="font-display text-2xl font-semibold text-[var(--color-forest)]">
              {formatNaira(product.price)}
            </p>
            <p className="text-xs text-[var(--color-rose)]">
              bulk {formatNaira(product.bulkPrice)} ea
            </p>
          </div>
          <button
            onClick={handleAdd}
            aria-label={`Add ${product.name} to basket`}
            className="relative grid h-12 w-12 cursor-pointer place-items-center overflow-hidden rounded-full bg-[var(--color-forest)] text-white transition hover:scale-110 hover:bg-[var(--color-forest-deep)] active:scale-90"
          >
            {added ? (
              <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></motion.svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
            )}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
