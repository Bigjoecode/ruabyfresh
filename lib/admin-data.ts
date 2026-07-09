import { createAdminClient } from "./supabase/admin";
import { rowToProduct } from "./data";
import type { Order } from "./types";
import type { Product } from "./products";

/* Server-only admin reads (called inside auth-protected admin pages). */

export async function getOrders(): Promise<Order[]> {
  const sb = createAdminClient();
  const { data } = await sb
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  return (data ?? []) as Order[];
}

export async function getOrder(id: string): Promise<Order | null> {
  const sb = createAdminClient();
  const { data } = await sb.from("orders").select("*").eq("id", id).single();
  return (data as Order) ?? null;
}

export async function getAdminProducts(): Promise<Product[]> {
  const sb = createAdminClient();
  const { data } = await sb
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true });
  return (data ?? []).map(rowToProduct);
}

export async function getAdminProduct(id: string): Promise<Product | null> {
  const sb = createAdminClient();
  const { data } = await sb.from("products").select("*").eq("id", id).single();
  return data ? rowToProduct(data) : null;
}
