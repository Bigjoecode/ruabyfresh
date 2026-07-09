# Ruaby Fresh 🍓🌿

> **Fresh Vibes Only.** Handcrafted parfaits & creamy yoghurt drinks — made fresh daily in Asaba.

A cinematic, glassmorphism e-commerce experience built for the Ruaby Fresh brand.
Launching **14 July 2026**. Deployed on Vercel → [ruabyfresh.vercel.app](https://ruabyfresh.vercel.app)

## ✨ What's inside

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** with brand design tokens pulled straight from the logo
- **Motion** (Framer) — parallax hero, dripping "fresh vibes" background, scroll-reveal,
  3D-tilt cards, launch countdown, animated multi-step cart
- **Liquid-glass / glassmorphism** UI, aurora mesh-gradient background
- **Individual flavour pages** (`/product/[id]`) with a "What's inside" panel
- **Bank-transfer checkout** + receipt upload → order sent to WhatsApp
- Procedural SVG product visuals that auto-swap for real photos (see below)

## 🎨 Brand palette (from the logo)

| Token | Hex | Use |
|-------|-----|-----|
| Forest | `#1F5E2A` | Primary green |
| Leaf | `#8BC63F` | Lime accent |
| Rose | `#E85D9A` | "FRESH" pink |
| Cream | `#F7F3E6` | Background |

Typography: **Fraunces** (display serif) + **Jost** (sans).

## 🍨 Products

- **Parfaits** — 250ml, 330ml, 500ml (15% launch offer)
- **Yoghurt Drinks** — 500ml bottles: Strawberry, Banana, Vanilla (₦3,000 → ₦2,500)

Edit everything (prices, flavours, ingredients, bank details, socials) in
[`lib/products.ts`](lib/products.ts).

## 💳 Payment — bank transfer

Customers check out by transferring to the account shown at checkout
(**Access Bank · 1830512383 · Ruaby Enterprise**), then send the order + receipt on
WhatsApp. No payment gateway or API keys required. The order is also logged via
[`app/api/order/route.ts`](app/api/order/route.ts) (extend to email/DB anytime).

## 🚀 Local development

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
```

## 📸 Swapping in real product photos

Drop images into [`public/products/`](public/products/) using the exact file names in
[`public/products/README.txt`](public/products/README.txt) (e.g. `parfait-330.png`,
`strawberry-yoghurt.png`). The site shows the real photo automatically and falls back to
the illustrated SVG when a photo is missing — no code changes needed.

## ▲ Deploy to Vercel

Push to GitHub and it deploys to [ruabyfresh.vercel.app](https://ruabyfresh.vercel.app).
(Connect the repo in Vercel → Settings → Git for push-to-deploy.)

---

Made with 💚 in Asaba.
