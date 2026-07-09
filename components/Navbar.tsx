"use client";

import Image from "next/image";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { useState } from "react";
import { useCart } from "./cart";

const links = [
  { label: "Menu", href: "#menu" },
  { label: "Offer", href: "#offer" },
  { label: "Why Us", href: "#why" },
  { label: "Gallery", href: "#gallery" },
  { label: "Reviews", href: "#reviews" },
];

export default function Navbar() {
  const { count, setOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobile, setMobile] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 40));

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
    >
      <nav
        className={`flex w-full max-w-6xl items-center justify-between rounded-full px-3 py-2 transition-all duration-500 ${
          scrolled ? "glass" : "bg-transparent"
        }`}
      >
        <a href="#top" className="flex items-center gap-2 pl-2">
          <Image
            src="/ruaby-logo.webp"
            alt="Ruaby Fresh"
            width={44}
            height={44}
            className="h-11 w-11 rounded-full object-cover ring-2 ring-white/70"
            priority
          />
          <span className="font-display text-xl font-semibold text-[var(--color-forest)]">
            Ruaby<span className="text-[var(--color-rose)]">Fresh</span>
          </span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-[var(--color-forest)]/80 transition hover:bg-white/50 hover:text-[var(--color-forest)]"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setOpen(true)}
            className="relative grid h-11 w-11 cursor-pointer place-items-center rounded-full bg-[var(--color-forest)] text-white transition hover:scale-105 hover:bg-[var(--color-forest-deep)] active:scale-95"
            aria-label={`Open basket, ${count} items`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18M16 10a4 4 0 0 1-8 0" />
            </svg>
            {count > 0 && (
              <motion.span
                key={count}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[var(--color-rose)] px-1 text-[11px] font-bold text-white"
              >
                {count}
              </motion.span>
            )}
          </button>

          <button
            className="grid h-11 w-11 cursor-pointer place-items-center rounded-full bg-white/60 text-[var(--color-forest)] md:hidden"
            onClick={() => setMobile((m) => !m)}
            aria-label="Toggle menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>
      </nav>

      {mobile && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-20 flex w-[92%] max-w-6xl flex-col gap-1 glass rounded-3xl p-3 md:hidden"
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMobile(false)}
              className="rounded-2xl px-4 py-3 font-medium text-[var(--color-forest)] transition hover:bg-white/60"
            >
              {l.label}
            </a>
          ))}
        </motion.div>
      )}
    </motion.header>
  );
}
