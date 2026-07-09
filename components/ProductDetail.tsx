"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import {
  formatNaira,
  hasBulkDiscount,
  LAUNCH_OFFER,
  type Product,
} from "@/lib/products";
import ProductImage from "./ProductImage";
import ProductCard from "./ProductCard";
import PreorderForm from "./PreorderForm";
import { useCart } from "./cart";

export default function ProductDetail({
  product,
  allProducts = [],
}: {
  product: Product;
  allProducts?: Product[];
}) {
  const { add, setOpen } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const unit = LAUNCH_OFFER ? product.launchPrice : product.price;
  const related = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const addToCart = () => {
    add(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <main className="mx-auto max-w-6xl px-4 pb-24 pt-28 md:pt-32">
      {/* breadcrumb */}
      <Link
        href="/#menu"
        className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-forest)]/70 transition hover:text-[var(--color-forest)]"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
        Back to menu
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        {/* visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[36px] glass p-8 lg:sticky lg:top-28 lg:self-start"
        >
          <div
            className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full opacity-50 blur-3xl"
            style={{ background: product.colors[1] }}
          />
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative mx-auto h-[22rem] w-full"
          >
            <ProductImage product={product} className="h-full w-full drop-shadow-2xl" />
          </motion.div>
          {product.badge && (
            <span className="absolute left-6 top-6 rounded-full bg-[var(--color-rose)] px-4 py-1.5 text-sm font-bold text-white">
              {product.badge}
            </span>
          )}
        </motion.div>

        {/* info */}
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[var(--color-leaf-soft)]/50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-forest)]">
              {product.category}
            </span>
            <span className="text-sm font-medium text-[var(--color-forest)]/60">{product.size}</span>
          </div>

          {product.variety && (
            <p className="mt-4 font-display text-lg italic text-[var(--color-rose)]">
              {product.variety}
            </p>
          )}
          <h1 className="mt-1 font-display text-[clamp(2.2rem,6vw,3.4rem)] font-semibold leading-tight text-[var(--color-forest)]">
            {product.name}
          </h1>
          <p className="mt-3 max-w-md text-[var(--color-ink)]/70">{product.tagline}</p>

          <div className="mt-6 flex items-end gap-3">
            <span className="font-display text-4xl font-semibold text-[var(--color-forest)]">
              {formatNaira(unit)}
            </span>
            {LAUNCH_OFFER && (
              <span className="mb-1 text-xl text-[var(--color-ink)]/40 line-through">
                {formatNaira(product.price)}
              </span>
            )}
            {hasBulkDiscount(product) && (
              <span className="mb-1.5 rounded-full bg-[var(--color-rose)]/10 px-2 py-0.5 text-xs font-semibold text-[var(--color-rose)]">
                bulk {formatNaira(product.bulkPrice)} · 12+
              </span>
            )}
          </div>

          {/* qty + add */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-white/60 px-2 py-2 ring-1 ring-[var(--color-forest)]/10">
              <button aria-label="Decrease" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-[var(--color-cream)] text-[var(--color-forest)] transition hover:bg-[var(--color-leaf)] hover:text-white">−</button>
              <span className="w-8 text-center text-lg font-semibold tabular-nums">{qty}</span>
              <button aria-label="Increase" onClick={() => setQty((q) => q + 1)} className="grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-[var(--color-cream)] text-[var(--color-forest)] transition hover:bg-[var(--color-leaf)] hover:text-white">+</button>
            </div>
            <button
              onClick={addToCart}
              className="flex-1 cursor-pointer rounded-full bg-[var(--color-forest)] px-8 py-4 font-semibold text-white transition hover:bg-[var(--color-forest-deep)]"
            >
              {added ? "Added ✓" : `Add ${qty} to basket`}
            </button>
            <button
              onClick={() => setOpen(true)}
              className="cursor-pointer rounded-full glass px-6 py-4 font-semibold text-[var(--color-forest)] transition hover:scale-105"
            >
              Basket
            </button>
          </div>

          {/* what's inside */}
          <div className="mt-8 rounded-[26px] glass p-6">
            <h2 className="font-display text-xl font-semibold text-[var(--color-forest)]">
              What&apos;s inside
            </h2>
            <ul className="mt-4 space-y-2.5">
              {product.ingredients.map((ing) => (
                <li key={ing} className="flex items-center gap-3 text-[var(--color-ink)]/80">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--color-leaf-soft)]/60 text-[var(--color-forest)]">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                  </span>
                  {ing}
                </li>
              ))}
            </ul>

            <div className="mt-5 flex flex-wrap gap-2 border-t border-[var(--color-forest)]/10 pt-5">
              {product.benefits.map((b) => (
                <span key={b} className="rounded-full bg-[var(--color-forest)]/8 px-3 py-1.5 text-sm font-medium text-[var(--color-forest)]">
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* care row */}
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--color-forest)]/70">
            {["Made fresh daily", "No artificial preservatives", "Keep refrigerated"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--color-leaf)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* pre-order form */}
      <section className="mt-16">
        <div className="mb-6 text-center">
          <h2 className="font-display text-[clamp(1.8rem,5vw,2.6rem)] font-semibold text-[var(--color-forest)]">
            Pre-order this flavour
          </h2>
          <p className="mx-auto mt-2 max-w-md text-[var(--color-ink)]/60">
            We&apos;ll confirm on WhatsApp. Pay by transfer and attach your receipt.
          </p>
        </div>
        <div className="mx-auto max-w-2xl">
          <PreorderForm product={product} />
        </div>
      </section>

      {/* related */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-6 font-display text-2xl font-semibold text-[var(--color-forest)]">
            More {product.category === "Parfait" ? "parfaits" : "flavours"}
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
