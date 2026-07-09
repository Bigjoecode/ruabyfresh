# Ruaby Fresh 🍓🌿

> **Fresh Vibes Only.** Premium yoghurt, parfaits, juices & salads — made fresh daily in Asaba.

A cinematic, glassmorphism e-commerce experience built for the Ruaby Fresh brand.
Deployed on Vercel → [ruabyfresh.vercel.app](https://ruabyfresh.vercel.app)

## ✨ What's inside

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** with brand design tokens pulled straight from the logo
- **Motion** (Framer) — parallax hero, scroll-reveal, 3D tilt cards, animated cart
- **Liquid-glass / glassmorphism** UI, aurora mesh-gradient background
- **Nomba** payment gateway integration (single + bulk orders, auto bulk pricing)
- Procedural SVG product visuals — swap for real photography anytime (see below)

## 🎨 Brand palette (from the logo)

| Token | Hex | Use |
|-------|-----|-----|
| Forest | `#1F5E2A` | Primary green |
| Leaf | `#8BC63F` | Lime accent |
| Rose | `#E85D9A` | "FRESH" pink |
| Cream | `#F7F3E6` | Background |

Typography: **Fraunces** (display serif) + **Jost** (sans).

## 🚀 Local development

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
```

## 💳 Nomba setup

1. Copy `.env.example` → `.env.local`
2. Add your keys from the [Nomba dashboard](https://dashboard.nomba.com):
   `NOMBA_CLIENT_ID`, `NOMBA_PRIVATE_KEY`, `NOMBA_ACCOUNT_ID`
3. The checkout flow lives in [`app/api/checkout/route.ts`](app/api/checkout/route.ts).
   Bulk pricing unlocks automatically at 12+ items.

## 📸 Swapping in real product photos

The catalogue lives in [`lib/products.ts`](lib/products.ts). Each product currently
renders a procedural SVG (`components/ProductVisual.tsx`). To use real photos:

1. Drop images in `public/products/`
2. Add an `image` field to each product and render `<Image>` instead of `<ProductVisual>`
   in `components/ProductCard.tsx`.

## ▲ Deploy to Vercel

Push to GitHub, import the repo at [vercel.com/new](https://vercel.com/new), add the
Nomba env vars, and deploy. Every push to `main` auto-deploys.

---

Made with 💚 in Asaba.
