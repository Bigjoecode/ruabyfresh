"use client";

import { motion } from "motion/react";
import { Eyebrow, Reveal, Stagger, stagChild } from "./ui";
import { getProduct, BRAND } from "@/lib/products";
import ProductImage from "./ProductImage";

/* ============ WHY CHOOSE ============ */
const perks = [
  {
    title: "Made Fresh Daily",
    body: "Blended each morning and delivered the same day — never sitting on a shelf.",
    icon: "M12 2v6m0 0 3-3m-3 3L9 5M5 12a7 7 0 1 0 14 0 7 7 0 0 0-14 0Z",
  },
  {
    title: "No Artificial Preservatives",
    body: "Just real fruit, cultured milk and honest ingredients. Nothing you can't pronounce.",
    icon: "M20 6 9 17l-5-5",
  },
  {
    title: "Premium Ingredients",
    body: "Sun-ripened berries, Madagascar vanilla and crunchy granola. Taste the difference.",
    icon: "m12 2 2.4 7.2H22l-6 4.4 2.3 7.4L12 16.8 5.7 21l2.3-7.4-6-4.4h7.6Z",
  },
  {
    title: "Fast Delivery",
    body: "Across Asaba and beyond, kept cold from our kitchen straight to your door.",
    icon: "M3 12h13l-2-2m2 2-2 2M16 6h3l2 4v4h-5M7 17a2 2 0 1 0 0 .01M17 17a2 2 0 1 0 0 .01",
  },
  {
    title: "Bulk Orders Available",
    body: "Events, offices and stores — unlock wholesale pricing on 12+ units instantly.",
    icon: "M3 7h18v13H3zM3 7l3-4h12l3 4M9 11h6",
  },
  {
    title: "Fresh Vibes Only",
    body: "A little cup of joy, designed to make eating well feel like a treat.",
    icon: "M12 21s-7-4.5-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9Z",
  },
];

export function WhyChoose() {
  return (
    <section id="why" className="relative mx-auto max-w-6xl px-4 py-24 md:py-32">
      <Reveal className="mb-14 max-w-2xl">
        <Eyebrow>Why Ruaby Fresh</Eyebrow>
        <h2 className="mt-5 font-display text-[clamp(2.2rem,6vw,4rem)] font-semibold leading-tight text-[var(--color-forest)]">
          Healthy never tasted
          <span className="italic text-gradient"> this good</span>
        </h2>
      </Reveal>

      <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {perks.map((p) => (
          <motion.div
            key={p.title}
            variants={stagChild}
            whileHover={{ y: -6 }}
            className="group rounded-[26px] glass p-7"
          >
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[var(--color-forest)] text-[var(--color-leaf)] transition group-hover:scale-110">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d={p.icon} />
              </svg>
            </div>
            <h3 className="mt-5 font-display text-xl font-semibold text-[var(--color-forest)]">
              {p.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink)]/65">
              {p.body}
            </p>
          </motion.div>
        ))}
      </Stagger>
    </section>
  );
}

/* ============ GALLERY ============ */
export function Gallery() {
  const tiles = [
    "parfait-330", "strawberry-yoghurt", "parfait-500",
    "mango-yoghurt", "banana-yoghurt", "parfait-250",
    "vanilla-yoghurt", "blueberry-yoghurt",
  ].map(getProduct);
  return (
    <section id="gallery" className="relative mx-auto max-w-6xl px-4 py-24 md:py-32">
      <Reveal className="mb-12 text-center">
        <Eyebrow>The Feed</Eyebrow>
        <h2 className="mt-5 font-display text-[clamp(2.2rem,6vw,4rem)] font-semibold text-[var(--color-forest)]">
          Too pretty to <span className="italic text-gradient">not share</span>
        </h2>
        <p className="mx-auto mt-3 max-w-md text-[var(--color-ink)]/60">
          Tag <span className="font-semibold text-[var(--color-rose)]">@ruabyfresh</span> and
          you might just land on our wall.
        </p>
      </Reveal>

      <Stagger className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {tiles.map((p, i) => (
          <motion.div
            key={i}
            variants={stagChild}
            whileHover={{ scale: 1.03 }}
            className={`group relative overflow-hidden rounded-3xl glass ${
              i % 5 === 0 ? "md:col-span-2 md:row-span-2" : ""
            }`}
            style={{ aspectRatio: i % 5 === 0 ? "1" : "1", minHeight: 160 }}
          >
            <div
              className="absolute inset-0 opacity-60 blur-2xl"
              style={{ background: p.colors[1] }}
            />
            <ProductImage product={p} className="relative h-full w-full p-4 transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-[var(--color-forest)]/80 to-transparent p-4 text-sm font-medium text-white transition group-hover:translate-y-0">
              {p.name}
            </div>
          </motion.div>
        ))}
      </Stagger>
    </section>
  );
}

/* ============ REVIEWS ============ */
const reviews = [
  {
    name: "Ada N.",
    role: "Asaba",
    text: "The 330ml parfait is unreal. Layers of granola, fruit and the smoothest yoghurt I've had in Nigeria. Obsessed.",
  },
  {
    name: "Chidi O.",
    role: "Event Planner",
    text: "Ordered 60 cups for a wedding — bulk pricing was fair, delivery on time, guests kept asking where they were from.",
  },
  {
    name: "Zainab A.",
    role: "Fitness Coach",
    text: "Finally a treat I can recommend. No junky preservatives, real ingredients, and my clients are hooked.",
  },
  {
    name: "Tunde M.",
    role: "Regular",
    text: "Strawberry yoghurt every single week. It tastes like actual strawberries, not syrup. That's rare.",
  },
];

export function Reviews() {
  return (
    <section id="reviews" className="relative py-24 md:py-32">
      <Reveal className="mb-12 px-4 text-center">
        <Eyebrow>Loved in Asaba</Eyebrow>
        <h2 className="mt-5 font-display text-[clamp(2.2rem,6vw,4rem)] font-semibold text-[var(--color-forest)]">
          Don't just take <span className="italic text-gradient">our word</span>
        </h2>
      </Reveal>

      <Stagger className="mx-auto grid max-w-6xl grid-cols-1 gap-5 px-4 md:grid-cols-2">
        {reviews.map((r) => (
          <motion.figure
            key={r.name}
            variants={stagChild}
            className="rounded-[26px] glass p-8"
          >
            <div className="mb-3 flex gap-1 text-[var(--color-rose)]">
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7Z" /></svg>
              ))}
            </div>
            <blockquote className="font-display text-lg italic leading-relaxed text-[var(--color-ink)]/85">
              “{r.text}”
            </blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-[var(--color-forest)] font-semibold text-[var(--color-leaf)]">
                {r.name[0]}
              </span>
              <span>
                <span className="block font-semibold text-[var(--color-forest)]">{r.name}</span>
                <span className="block text-sm text-[var(--color-ink)]/55">{r.role}</span>
              </span>
            </figcaption>
          </motion.figure>
        ))}
      </Stagger>
    </section>
  );
}

/* ============ LAUNCH OFFER ============ */
export function LaunchOffer() {
  return (
    <section id="offer" className="relative mx-auto max-w-6xl px-4 py-16">
      <Reveal>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-[32px] bg-[var(--color-rose)] p-8 text-white md:p-10">
            <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
            <span className="inline-flex rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest">
              Launch Offer · Limited time
            </span>
            <p className="mt-5 font-display text-6xl font-semibold leading-none">
              ₦1,000 <span className="text-3xl">OFF</span>
            </p>
            <p className="mt-2 font-display text-2xl font-semibold">Every parfait</p>
            <p className="mt-2 max-w-xs text-white/80">
              Be among the first to enjoy freshness in every layer — 250ml, 330ml
              &amp; 500ml, ₦1,000 off each.
            </p>
            <a
              href="#menu"
              className="mt-6 inline-flex rounded-full bg-white px-6 py-3 font-semibold text-[var(--color-rose)] transition hover:scale-105"
            >
              Pre-order parfaits
            </a>
          </div>

          <div className="relative overflow-hidden rounded-[32px] bg-[var(--color-forest)] p-8 text-[var(--color-cream)] md:p-10">
            <div className="pointer-events-none absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-[var(--color-leaf)]/25 blur-2xl" />
            <span className="inline-flex rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest">
              500ml Yoghurt Drinks
            </span>
            <p className="mt-5 flex items-baseline gap-3">
              <span className="font-display text-6xl font-semibold leading-none text-[var(--color-leaf)]">
                ₦2,500
              </span>
              <span className="text-2xl text-white/50 line-through">₦3,000</span>
            </p>
            <p className="mt-2 font-display text-2xl font-semibold">Every flavour</p>
            <p className="mt-2 max-w-xs text-white/75">
              Strawberry, Banana, Vanilla, Mango, Blueberry & Kiwi — rich, creamy
              & made fresh daily.
            </p>
            <a
              href="#menu"
              className="mt-6 inline-flex rounded-full bg-[var(--color-leaf)] px-6 py-3 font-semibold text-[var(--color-forest-deep)] transition hover:scale-105"
            >
              Pre-order yoghurt
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ============ ORDER CTA (single + bulk) ============ */
export function OrderCTA() {
  return (
    <section className="relative mx-auto max-w-6xl px-4 py-16">
      <Reveal>
        <div className="relative overflow-hidden rounded-[40px] bg-[var(--color-forest)] px-6 py-16 text-center md:px-16 md:py-24">
          {/* glow orbs */}
          <div className="pointer-events-none absolute -left-10 -top-10 h-60 w-60 rounded-full bg-[var(--color-leaf)]/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 -right-10 h-60 w-60 rounded-full bg-[var(--color-rose)]/30 blur-3xl" />

          <div className="relative z-10">
            <h2 className="mx-auto max-w-2xl font-display text-[clamp(2rem,6vw,3.6rem)] font-semibold leading-tight text-[var(--color-cream)]">
              Ready for your daily
              <span className="italic text-[var(--color-leaf)]"> dose of fresh?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[var(--color-cream)]/70">
              Single cups or bulk trays for events, offices and stores — pay by bank
              transfer, send your receipt on WhatsApp, and we handle the rest.
            </p>

            <div className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-2">
              <div className="rounded-3xl glass-dark p-6 text-left">
                <p className="font-display text-xl font-semibold text-[var(--color-cream)]">
                  Single Orders
                </p>
                <p className="mt-1 text-sm text-[var(--color-cream)]/70">
                  Grab your favourites from the menu and check out in seconds.
                </p>
                <a
                  href="#menu"
                  className="mt-5 inline-flex rounded-full bg-[var(--color-leaf)] px-6 py-3 font-semibold text-[var(--color-forest-deep)] transition hover:scale-105"
                >
                  Browse Menu
                </a>
              </div>
              <div className="rounded-3xl glass-dark p-6 text-left">
                <p className="font-display text-xl font-semibold text-[var(--color-cream)]">
                  Bulk Orders
                </p>
                <p className="mt-1 text-sm text-[var(--color-cream)]/70">
                  12+ units unlock wholesale pricing automatically at checkout.
                </p>
                <a
                  href={`https://wa.me/${BRAND.whatsapp}?text=Hi%20Ruaby%20Fresh%2C%20I'd%20like%20a%20bulk%20order`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex rounded-full bg-[var(--color-rose)] px-6 py-3 font-semibold text-white transition hover:scale-105"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ============ FOOTER ============ */
export function Footer() {
  return (
    <footer className="relative mx-auto max-w-6xl px-4 pb-10 pt-16">
      <div className="rounded-[32px] glass p-8 md:p-12">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">
          <div className="max-w-sm text-center md:text-left">
            <p className="font-display text-3xl font-semibold text-[var(--color-forest)]">
              Ruaby<span className="text-[var(--color-rose)]">Fresh</span>
            </p>
            <p className="mt-2 text-sm text-[var(--color-ink)]/60">
              Handcrafted parfaits & creamy yoghurt drinks. Fresh Vibes Only —
              made fresh daily in {BRAND.city}.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3 md:justify-start">
              {[
                { s: "Instagram", href: BRAND.instagram },
                { s: "TikTok", href: BRAND.tiktok },
                { s: "Facebook", href: BRAND.facebook },
              ].map(({ s, href }) => (
                <a
                  key={s}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-white/60 px-4 py-2 text-xs font-semibold text-[var(--color-forest)] transition hover:bg-[var(--color-forest)] hover:text-white"
                >
                  {s}
                </a>
              ))}
            </div>
            <a
              href={`https://wa.me/${BRAND.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-forest)] hover:text-[var(--color-rose)]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm5.8 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.5-1.2-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .5l-.4.6c-.2.2-.3.4-.1.7.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.2.1.4.1.5-.1l.7-.8c.2-.2.4-.2.6-.1l1.8.9c.3.1.4.2.5.3.1.2.1.6-.1 1Z" /></svg>
              {BRAND.whatsappDisplay}
            </a>
          </div>

          <div className="grid grid-cols-2 gap-8 text-center md:text-left">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--color-forest)]/50">
                Menu
              </p>
              <ul className="space-y-2 text-sm text-[var(--color-ink)]/70">
                <li><a href="#menu" className="hover:text-[var(--color-rose)]">Parfaits</a></li>
                <li><a href="#menu" className="hover:text-[var(--color-rose)]">Yoghurt Drinks</a></li>
                <li><a href="#menu" className="hover:text-[var(--color-rose)]">Launch Offer</a></li>
                <li><a href="#top" className="hover:text-[var(--color-rose)]">Pre-order</a></li>
              </ul>
            </div>
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--color-forest)]/50">
                Company
              </p>
              <ul className="space-y-2 text-sm text-[var(--color-ink)]/70">
                <li><a href="#why" className="hover:text-[var(--color-rose)]">Why Us</a></li>
                <li><a href="#gallery" className="hover:text-[var(--color-rose)]">Gallery</a></li>
                <li><a href="#reviews" className="hover:text-[var(--color-rose)]">Reviews</a></li>
                <li><a href="#top" className="hover:text-[var(--color-rose)]">Bulk Orders</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-[var(--color-forest)]/10 pt-6 text-xs text-[var(--color-ink)]/50 md:flex-row">
          <p>© {new Date().getFullYear()} Ruaby Fresh. All rights reserved.</p>
          <p>Pay by bank transfer · Made with 💚 in Asaba</p>
        </div>
      </div>
    </footer>
  );
}
