"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { categories, type Product } from "@/lib/products";
import ProductCard from "./ProductCard";
import { Eyebrow, Reveal } from "./ui";

export default function Menu({ products }: { products: Product[] }) {
  const [active, setActive] = useState<(typeof categories)[number]>("All");
  const shown =
    active === "All" ? products : products.filter((p) => p.category === active);

  return (
    <section id="menu" className="relative mx-auto max-w-6xl px-4 py-24 md:py-32">
      <Reveal className="mb-10 text-center">
        <Eyebrow>The Menu</Eyebrow>
        <h2 className="mt-5 font-display text-[clamp(2.2rem,6vw,4rem)] font-semibold leading-tight text-[var(--color-forest)]">
          Crafted to make healthy
          <br />
          <span className="italic text-gradient">taste indulgent</span>
        </h2>
      </Reveal>

      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`relative cursor-pointer rounded-full px-5 py-2.5 text-sm font-semibold transition ${
              active === c
                ? "text-white"
                : "text-[var(--color-forest)] hover:bg-white/50"
            }`}
          >
            {active === c && (
              <motion.span
                layoutId="pill"
                className="absolute inset-0 rounded-full bg-[var(--color-forest)]"
                transition={{ type: "spring", stiffness: 320, damping: 30 }}
              />
            )}
            <span className="relative z-10">{c}</span>
          </button>
        ))}
      </div>

      <motion.div layout className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {shown.map((p) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
