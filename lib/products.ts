export type Product = {
  id: string;
  name: string;
  tagline: string;
  category: "Yoghurt" | "Parfait" | "Juice" | "Salad";
  price: number; // single order, in Naira
  bulkPrice: number; // per unit for bulk (min 12)
  size: string;
  // colour stops used to procedurally render the product visual
  colors: [string, string, string];
  badge?: string;
};

export const NAIRA = "₦";

export const products: Product[] = [
  {
    id: "strawberry-yoghurt",
    name: "Strawberry Yoghurt",
    tagline: "Sun-ripened berries, whipped smooth",
    category: "Yoghurt",
    price: 2500,
    bulkPrice: 2100,
    size: "500ml",
    colors: ["#ffd7e6", "#f06aa0", "#e64b4b"],
    badge: "Bestseller",
  },
  {
    id: "banana-yoghurt",
    name: "Banana Yoghurt",
    tagline: "Silky, mellow & naturally sweet",
    category: "Yoghurt",
    price: 2500,
    bulkPrice: 2100,
    size: "500ml",
    colors: ["#fff4c2", "#ffe08a", "#e9c94a"],
  },
  {
    id: "vanilla-yoghurt",
    name: "Vanilla Yoghurt",
    tagline: "Madagascar vanilla, clean & classic",
    category: "Yoghurt",
    price: 2400,
    bulkPrice: 2000,
    size: "500ml",
    colors: ["#fffaf0", "#f6ecd6", "#e6d4a8"],
  },
  {
    id: "parfait-250",
    name: "250ml Parfait",
    tagline: "Granola, fruit & yoghurt layers",
    category: "Parfait",
    price: 2800,
    bulkPrice: 2400,
    size: "250ml",
    colors: ["#f7b8d4", "#c7e59a", "#8bc63f"],
  },
  {
    id: "parfait-330",
    name: "330ml Parfait",
    tagline: "The signature — layered to perfection",
    category: "Parfait",
    price: 3500,
    bulkPrice: 3000,
    size: "330ml",
    colors: ["#f7b8d4", "#ffe08a", "#8bc63f"],
    badge: "Signature",
  },
  {
    id: "parfait-500",
    name: "500ml Parfait",
    tagline: "The big one — share, or don't",
    category: "Parfait",
    price: 4800,
    bulkPrice: 4200,
    size: "500ml",
    colors: ["#e64b4b", "#f7b8d4", "#8bc63f"],
  },
  {
    id: "berry-juice",
    name: "Mixed Berry Juice",
    tagline: "Cold-pressed strawberry & blueberry",
    category: "Juice",
    price: 2000,
    bulkPrice: 1700,
    size: "400ml",
    colors: ["#f7b8d4", "#c65a9a", "#6d4aa0"],
  },
  {
    id: "green-salad",
    name: "Garden Fresh Salad",
    tagline: "Crisp greens, kiwi & citrus",
    category: "Salad",
    price: 3200,
    bulkPrice: 2800,
    size: "Regular",
    colors: ["#e8f6d2", "#a8d85a", "#4e8a2b"],
  },
];

export const categories = ["All", "Yoghurt", "Parfait", "Juice", "Salad"] as const;

export function formatNaira(n: number) {
  return `${NAIRA}${n.toLocaleString("en-NG")}`;
}
