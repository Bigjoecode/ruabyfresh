"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import type { Product } from "@/lib/products";
import type { Settings } from "@/lib/types";
import ProductImage from "./ProductImage";
import FreshDrip from "./FreshDrip";
import Countdown from "./Countdown";
import { useCart } from "./cart";

const SPOTS = [
  { top: "16%", left: "5%", size: 168, r: -8, dur: 8 },
  { top: "22%", right: "6%", size: 150, r: 7, dur: 9 },
  { bottom: "12%", left: "10%", size: 150, r: 5, dur: 10 },
  { bottom: "18%", right: "9%", size: 140, r: -6, dur: 11 },
];

export default function Hero({
  products,
  settings,
}: {
  products: Product[];
  settings: Settings;
}) {
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

  const hero = settings.hero;
  const signature =
    products.find((p) => p.category === "Parfait") ?? products[0];
  const overrides = hero.floatingImages.filter(Boolean);

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 pt-28 text-center"
    >
      {hero.backgroundImage && (
        <div className="pointer-events-none absolute inset-0 -z-[1]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={hero.backgroundImage} alt="" className="h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-[var(--color-cream)]/40" />
        </div>
      )}

      {hero.showDrip && <FreshDrip />}

      {/* floating products (desktop) */}
      <motion.div style={{ y: yHero }} className="absolute inset-0 z-10 hidden lg:block">
        {SPOTS.map((s, i) => {
          const override = overrides[i];
          const product = products[i % Math.max(1, products.length)];
          return (
            <motion.div
              key={i}
              className="absolute drop-shadow-[0_30px_40px_rgba(18,60,27,0.25)]"
              style={{ top: s.top, bottom: s.bottom, left: s.left, right: s.right, width: s.size }}
              animate={{ y: [0, -22, 0], rotate: [s.r, s.r + 3, s.r] }}
              transition={{ duration: s.dur, repeat: Infinity, ease: "easeInOut" }}
            >
              {override ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={override} alt="" className="w-full" />
              ) : product ? (
                <ProductImage product={product} className="w-full" />
              ) : null}
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div style={{ y: yTitle, opacity }} className="relative z-20 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full glass px-5 py-2 text-sm font-semibold text-[var(--color-forest)]"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--color-rose)]" />
          {hero.badge}
        </motion.div>

        <h1 className="font-display text-[clamp(3rem,10vw,7rem)] font-semibold leading-[0.95] text-[var(--color-forest)]">
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {hero.titleTop}
          </motion.span>
          <motion.span
            className="block italic text-gradient"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {hero.titleBottom}
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mx-auto mt-6 max-w-xl text-lg text-[var(--color-ink)]/70"
        >
          {hero.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
          className="mt-8 flex flex-col items-center gap-2"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-forest)]/60">
            The wait is almost over
          </span>
          <Countdown date={settings.launchDate} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.7 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="#menu"
            className="group relative overflow-hidden rounded-full bg-[var(--color-forest)] px-8 py-4 font-semibold text-white shadow-[0_18px_40px_-12px_rgba(31,94,42,0.7)] transition hover:scale-105 active:scale-95"
          >
            <span className="relative z-10">Pre-order Now</span>
            <span className="absolute inset-0 shine opacity-0 transition group-hover:opacity-100" />
          </a>
          {signature && (
            <button
              onClick={() => {
                add(signature);
                setOpen(true);
              }}
              className="rounded-full glass px-8 py-4 font-semibold text-[var(--color-forest)] transition hover:scale-105 active:scale-95"
            >
              Try the Signature Parfait
            </button>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.25 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[var(--color-forest)]/70"
        >
          {["Made Fresh Daily", "Premium Ingredients", "No Preservatives"].map((t) => (
            <span key={t} className="flex items-center gap-1.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-leaf)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
              {t}
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* mobile hero product */}
      {signature && (
        <motion.div
          style={{ scale }}
          className="relative z-10 mt-10 w-52 lg:hidden"
          animate={{ y: [0, -16, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ProductImage product={signature} className="w-full drop-shadow-2xl" />
        </motion.div>
      )}

      <motion.div
        className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2"
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
