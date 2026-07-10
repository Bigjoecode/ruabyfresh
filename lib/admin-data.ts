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

/**
 * Resolves a receipt reference to a viewable URL. New orders store a storage
 * path in a PRIVATE bucket → a short-lived signed URL is generated. Legacy
 * orders that stored a full public URL are returned as-is.
 */
export async function signedReceiptUrl(value: string | null): Promise<string | null> {
  if (!value) return null;
  if (value.startsWith("http")) return value;
  const sb = createAdminClient();
  const { data } = await sb.storage.from("receipts").createSignedUrl(value, 60 * 60);
  return data?.signedUrl ?? null;
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
