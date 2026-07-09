import { createPublicClient } from "./supabase/public";
import { supabaseConfigured } from "./supabase/config";
import { products as seedProducts, type Product } from "./products";
import { defaultSettings, type Settings } from "./types";

/* eslint-disable @typescript-eslint/no-explicit-any */

/** Maps a snake_case DB row to the camelCase Product used across the app. */
export function rowToProduct(r: any): Product {
  return {
    id: r.id,
    name: r.name,
    variety: r.variety ?? undefined,
    tagline: r.tagline ?? "",
    category: r.category,
    price: r.price,
    launchPrice: r.launch_price,
    bulkPrice: r.bulk_price,
    size: r.size,
    image: r.image ?? "",
    colors: (r.colors as [string, string, string]) ?? ["#ffffff", "#f0a8c0", "#8bc63f"],
    badge: r.badge ?? undefined,
    ingredients: r.ingredients ?? [],
    benefits: r.benefits ?? [],
  };
}

/** Products for the storefront — from Supabase, falling back to the seed catalog. */
export async function getProducts(): Promise<Product[]> {
  if (!supabaseConfigured) return seedProducts;
  try {
    const sb = createPublicClient();
    const { data, error } = await sb
      .from("products")
      .select("*")
      .eq("active", true)
      .order("sort_order", { ascending: true });
    if (error || !data || data.length === 0) return seedProducts;
    return data.map(rowToProduct);
  } catch {
    return seedProducts;
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  const all = await getProducts();
  return all.find((p) => p.id === id) ?? null;
}

/** Site settings — merged over defaults so missing keys always resolve. */
export async function getSettings(): Promise<Settings> {
  if (!supabaseConfigured) return defaultSettings;
  try {
    const sb = createPublicClient();
    const { data } = await sb.from("settings").select("data").eq("id", 1).single();
    const s = (data?.data ?? {}) as Partial<Settings>;
    return {
      ...defaultSettings,
      ...s,
      hero: { ...defaultSettings.hero, ...(s.hero ?? {}) },
      offer: { ...defaultSettings.offer, ...(s.offer ?? {}) },
    };
  } catch {
    return defaultSettings;
  }
}
