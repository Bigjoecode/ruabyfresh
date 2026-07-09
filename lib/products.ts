export type Category = "Parfait" | "Yoghurt";

export type Product = {
  id: string;
  name: string;
  variety?: string; // e.g. "Premium Treat"
  tagline: string;
  category: Category;
  price: number; // regular single price, Naira
  launchPrice: number; // launch-offer single price
  bulkPrice: number; // per unit for 12+ orders
  size: string;
  image: string; // /products/<id>.png — swap in real photography anytime
  colors: [string, string, string]; // fallback SVG colour stops
  badge?: string;
  ingredients: string[];
  benefits: string[];
};

export const NAIRA = "₦";

/** Grand opening — Sunday 14 July 2026, 9am WAT. */
export const LAUNCH_DATE = new Date("2026-07-14T09:00:00+01:00");
export const LAUNCH_OFFER = true;

export const BRAND = {
  whatsapp: "2347036892225",
  whatsappDisplay: "0703 689 2225",
  instagram: "https://instagram.com/ruabyfresh",
  tiktok: "https://tiktok.com/@ruabyfresh",
  facebook: "https://facebook.com/ruabyfresh",
  handle: "@ruabyfresh",
  city: "Asaba, Delta State",
  bank: {
    number: "1830512383",
    name: "Access Bank",
    account: "Ruaby Enterprise",
  },
};

const PARFAIT_INGREDIENTS = [
  "Creamy set yoghurt",
  "House-made crunchy granola",
  "Fresh seasonal fruit",
  "Golden natural honey",
  "Mixed nuts & seeds",
];
const PARFAIT_BENEFITS = ["High in protein", "Rich in nutrients", "Goodness in every layer"];

const yoghurt = (fruit: string) => ({
  ingredients: [
    "Fresh cultured milk",
    `Real ${fruit}`,
    "A touch of natural sweetness",
    "No artificial preservatives",
  ],
  benefits: ["Rich & creamy", "Made fresh daily", "Healthy & nourishing"],
});

export const products: Product[] = [
  // ---------------- PARFAITS (₦1,000 off launch offer) ----------------
  {
    id: "parfait-500",
    name: "500ml Parfait",
    variety: "Premium Treat",
    tagline: "The ultimate satisfying bowl — the perfect balance of taste and nutrition.",
    category: "Parfait",
    price: 9000,
    launchPrice: 8000,
    bulkPrice: 8000,
    size: "500ml",
    image: "/products/parfait-500.png",
    colors: ["#ffffff", "#f0a8c0", "#6d4aa0"],
    badge: "Premium Treat",
    ingredients: PARFAIT_INGREDIENTS,
    benefits: PARFAIT_BENEFITS,
  },
  {
    id: "parfait-330",
    name: "330ml Parfait",
    variety: "Premium Exotic",
    tagline: "Just the right size — a burst of exotic flavour in every spoonful.",
    category: "Parfait",
    price: 6500,
    launchPrice: 5500,
    bulkPrice: 5500,
    size: "330ml",
    image: "/products/parfait-330.png",
    colors: ["#ffffff", "#ffe08a", "#8bc63f"],
    badge: "Premium Exotic",
    ingredients: PARFAIT_INGREDIENTS,
    benefits: PARFAIT_BENEFITS,
  },
  {
    id: "parfait-250",
    name: "250ml Parfait",
    variety: "Tropical Delight",
    tagline: "Perfect for a light & healthy treat — tropical freshness that brightens your day.",
    category: "Parfait",
    price: 4500,
    launchPrice: 3500,
    bulkPrice: 3500,
    size: "250ml",
    image: "/products/parfait-250.png",
    colors: ["#ffffff", "#f7b8d4", "#e64b4b"],
    badge: "Tropical Delight",
    ingredients: PARFAIT_INGREDIENTS,
    benefits: PARFAIT_BENEFITS,
  },

  // ---------------- YOGHURT DRINKS (500ml · ₦3000 → ₦2500) ----------------
  {
    id: "strawberry-yoghurt",
    name: "Strawberry Yoghurt Drink",
    tagline: "Sun-ripened strawberries, rich & creamy.",
    category: "Yoghurt",
    price: 3000,
    launchPrice: 2500,
    bulkPrice: 2500,
    size: "500ml",
    image: "/products/strawberry-yoghurt.png",
    colors: ["#ffd7e6", "#f06aa0", "#e64b4b"],
    badge: "Bestseller",
    ...yoghurt("strawberries"),
  },
  {
    id: "banana-yoghurt",
    name: "Banana Yoghurt Drink",
    tagline: "Silky, mellow & naturally sweet.",
    category: "Yoghurt",
    price: 3000,
    launchPrice: 2500,
    bulkPrice: 2500,
    size: "500ml",
    image: "/products/banana-yoghurt.png",
    colors: ["#fff4c2", "#ffe08a", "#e9c94a"],
    ...yoghurt("banana"),
  },
  {
    id: "vanilla-yoghurt",
    name: "Vanilla Yoghurt Drink",
    tagline: "Smooth, creamy Madagascar vanilla.",
    category: "Yoghurt",
    price: 3000,
    launchPrice: 2500,
    bulkPrice: 2500,
    size: "500ml",
    image: "/products/vanilla-yoghurt.png",
    colors: ["#fffaf0", "#f6ecd6", "#e6d4a8"],
    ...yoghurt("Madagascar vanilla"),
  },
];

export const categories = ["All", "Parfait", "Yoghurt"] as const;

export const getProduct = (id: string) =>
  products.find((p) => p.id === id) ?? products[0];

/** Product name for order lines — avoids duplicating the size (e.g. "500ml Parfait"). */
export const displayName = (p: Product) =>
  p.name.includes(p.size) ? p.name : `${p.name} · ${p.size}`;

/** True when 12+ orders actually cost less than the current single price. */
export const hasBulkDiscount = (p: Product) =>
  p.bulkPrice < (LAUNCH_OFFER ? p.launchPrice : p.price);

export function formatNaira(n: number) {
  return `${NAIRA}${n.toLocaleString("en-NG")}`;
}
