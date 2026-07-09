import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { supabaseAdminConfigured } from "@/lib/supabase/config";

/**
 * Records a booking. Accepts multipart form-data:
 *   - payload: JSON { reference, total, bulk, customer, lines }
 *   - receipt: the payment screenshot (image file)
 *
 * When Supabase is configured, the receipt is uploaded to the `receipts`
 * bucket and the order is inserted into the `orders` table (service-role key,
 * bypasses RLS). Otherwise it just logs and returns a reference so the
 * WhatsApp flow still works.
 */

const genRef = () => "RUABY-" + Math.random().toString(36).slice(2, 7).toUpperCase();

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const raw = form.get("payload");
    if (typeof raw !== "string") {
      return NextResponse.json({ ok: false, error: "Missing payload" }, { status: 400 });
    }
    const payload = JSON.parse(raw) as {
      reference?: string;
      total: number;
      bulk?: boolean;
      customer?: { name?: string; phone?: string; type?: string; address?: string; note?: string };
      lines: { name: string; qty: number; price: number }[];
    };

    if (!payload.lines?.length) {
      return NextResponse.json({ ok: false, error: "Empty order" }, { status: 400 });
    }

    const reference = payload.reference || genRef();
    const receipt = form.get("receipt");

    if (!supabaseAdminConfigured) {
      console.log("[ruaby-order]", reference, {
        total: payload.total,
        items: payload.lines.map((l) => `${l.qty}x ${l.name}`),
        customer: payload.customer,
      });
      return NextResponse.json({ ok: true, reference, stored: false });
    }

    const sb = createAdminClient();

    // Upload receipt screenshot (if provided).
    let receiptUrl: string | null = null;
    if (receipt && typeof receipt !== "string" && receipt.size > 0) {
      const ext = (receipt.name.split(".").pop() || "png").toLowerCase().replace(/[^a-z0-9]/g, "");
      const path = `${reference}-${Date.now()}.${ext || "png"}`;
      const bytes = new Uint8Array(await receipt.arrayBuffer());
      const { error: upErr } = await sb.storage
        .from("receipts")
        .upload(path, bytes, { contentType: receipt.type || "image/png", upsert: true });
      if (!upErr) {
        receiptUrl = sb.storage.from("receipts").getPublicUrl(path).data.publicUrl;
      }
    }

    const { error } = await sb.from("orders").insert({
      reference,
      customer_name: payload.customer?.name ?? null,
      customer_phone: payload.customer?.phone ?? null,
      fulfilment: payload.customer?.type ?? null,
      address: payload.customer?.address ?? null,
      note: payload.customer?.note ?? null,
      items: payload.lines,
      total: payload.total,
      bulk: !!payload.bulk,
      receipt_url: receiptUrl,
      status: "new",
    });
    if (error) throw error;

    return NextResponse.json({ ok: true, reference, stored: true });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: "Could not record order", detail: String(e) },
      { status: 500 }
    );
  }
}
