"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { products } from "@/lib/products";
import ProductVisual from "./ProductVisual";
import { useCart } from "./cart";

const floatSpots = [
  { p: products[3], top: "12%", left: "6%", size: 150, r: -8, dur: 8 },
  { p: products[0], top: "20%", right: "8%", size: 175, r: 7, dur: 9 },
  { p: products[4], bottom: "10%", left: "12%", size: 135, r: 5, dur: 10 },
  { p: products[6], bottom: "16%", right: "10%", size: 120, r: -6, dur: 11 },
];

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yTitle = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const yHero = useTransform(scrollYProgress, [0, 1], [0, 260]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const { add, setOpen } = useCart();

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 pt-24 text-center"
    >
      {/* floating products (desktop) */}
      <motion.div style={{ y: yHero }} className="absolute inset-0 hidden lg:block">
        {floatSpots.map((s, i) => (
          <motion.div
            key={i}
            className="absolute drop-shadow-[0_30px_40px_rgba(18,60,27,0.25)]"
            style={{ top: s.top, bottom: s.bottom, left: s.left, right: s.right, width: s.size }}
            animate={{ y: [0, -22, 0], rotate: [s.r, s.r + 3, s.r] }}
            transition={{ duration: s.dur, repeat: Infinity, ease: "easeInOut" }}
          >
            <ProductVisual product={s.p} className="w-full" />
          </motion.div>
        ))}
      </motion.div>

      <motion.div style={{ y: yTitle, opacity }} className="relative z-10 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full glass px-5 py-2 text-sm font-medium text-[var(--color-forest)]"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--color-leaf)]" />
          Made fresh daily in Asaba
        </motion.div>

        <h1 className="font-display text-[clamp(3rem,10vw,7rem)] font-semibold leading-[0.95] text-[var(--color-forest)]">
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            Fresh Vibes
          </motion.span>
          <motion.span
            className="block italic text-gradient"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            Only.
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mx-auto mt-6 max-w-xl text-lg text-[var(--color-ink)]/70"
        >
          Premium yoghurt, parfaits, juices & salads — whipped smooth, layered by
          hand, and never touched by artificial preservatives.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.7 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="#menu"
            className="group relative overflow-hidden rounded-full bg-[var(--color-forest)] px-8 py-4 font-semibold text-white shadow-[0_18px_40px_-12px_rgba(31,94,42,0.7)] transition hover:scale-105 active:scale-95"
          >
            <span className="relative z-10">Order Now</span>
            <span className="absolute inset-0 shine opacity-0 transition group-hover:opacity-100" />
          </a>
          <button
            onClick={() => {
              add(products[4]);
              setOpen(true);
            }}
            className="rounded-full glass px-8 py-4 font-semibold text-[var(--color-forest)] transition hover:scale-105 active:scale-95"
          >
            Try the Signature
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mt-10 flex items-center justify-center gap-6 text-sm text-[var(--color-forest)]/70"
        >
          {["No Preservatives", "Premium Ingredients", "Fast Delivery"].map((t) => (
            <span key={t} className="flex items-center gap-1.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-leaf)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
              {t}
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* mobile hero product */}
      <motion.div
        style={{ scale }}
        className="relative z-0 mt-8 w-56 lg:hidden"
        animate={{ y: [0, -16, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <ProductVisual product={products[4]} className="w-full drop-shadow-2xl" />
      </motion.div>

      {/* scroll cue */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      >
        <div className="flex h-9 w-6 justify-center rounded-full border-2 border-[var(--color-forest)]/40 pt-1.5">
          <div className="h-2 w-1 rounded-full bg-[var(--color-forest)]/60" />
        </div>
      </motion.div>
    </section>
  );
}
