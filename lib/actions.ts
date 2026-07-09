"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminUser } from "@/lib/supabase/auth";
import { defaultSettings, type Settings } from "@/lib/types";
import type { Product } from "@/lib/products";

async function assertAdmin() {
  const user = await getAdminUser();
  if (!user) throw new Error("Unauthorized");
}

/* ---------------- ORDERS ---------------- */
export async function updateOrderStatus(id: string, status: string) {
  await assertAdmin();
  const sb = createAdminClient();
  await sb.from("orders").update({ status }).eq("id", id);
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin");
}

export async function deleteOrder(id: string) {
  await assertAdmin();
  const sb = createAdminClient();
  await sb.from("orders").delete().eq("id", id);
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}

/* ---------------- PRODUCTS ---------------- */
function toRow(p: Product & { sort_order?: number; active?: boolean }) {
  return {
    id: p.id,
    name: p.name,
    variety: p.variety ?? null,
    tagline: p.tagline ?? "",
    category: p.category,
    price: p.price,
    launch_price: p.launchPrice,
    bulk_price: p.bulkPrice,
    size: p.size,
    image: p.image ?? null,
    colors: p.colors,
    badge: p.badge ?? null,
    ingredients: p.ingredients ?? [],
    benefits: p.benefits ?? [],
    sort_order: p.sort_order ?? 0,
    active: p.active ?? true,
  };
}

export async function saveProduct(
  product: Product & { sort_order?: number; active?: boolean }
) {
  await assertAdmin();
  const sb = createAdminClient();
  const { error } = await sb.from("products").upsert(toRow(product), { onConflict: "id" });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/products");
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function deleteProduct(id: string) {
  await assertAdmin();
  const sb = createAdminClient();
  await sb.from("products").delete().eq("id", id);
  revalidatePath("/admin/products");
  revalidatePath("/", "layout");
}

/** Populates the products table from the built-in catalogue (one-time seed). */
export async function seedProducts() {
  await assertAdmin();
  const sb = createAdminClient();
  const { products } = await import("@/lib/products");
  const rows = products.map((p, i) => toRow({ ...p, sort_order: i, active: true }));
  const { error } = await sb.from("products").upsert(rows, { onConflict: "id" });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/products");
  revalidatePath("/", "layout");
  return { ok: true };
}

/* ---------------- SETTINGS ---------------- */
export async function saveSettings(settings: Settings) {
  await assertAdmin();
  const sb = createAdminClient();
  const merged: Settings = {
    ...defaultSettings,
    ...settings,
    hero: { ...defaultSettings.hero, ...settings.hero },
    offer: { ...defaultSettings.offer, ...settings.offer },
  };
  const { error } = await sb
    .from("settings")
    .upsert({ id: 1, data: merged, updated_at: new Date().toISOString() }, { onConflict: "id" });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
  return { ok: true };
}
