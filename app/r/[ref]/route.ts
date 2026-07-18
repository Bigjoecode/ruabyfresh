import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { supabaseAdminConfigured } from "@/lib/supabase/config";

/**
 * Short link to an order's payment receipt: /r/<reference>. Looks up the
 * order, mints a fresh short-lived signed URL for its receipt, and redirects.
 * Keeps the WhatsApp message tidy and the receipt private (no long token in
 * the message, links never go stale).
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ ref: string }> }
) {
  const { ref } = await params;

  if (!supabaseAdminConfigured) {
    return new NextResponse("Not available", { status: 404 });
  }

  const sb = createAdminClient();
  const { data } = await sb
    .from("orders")
    .select("receipt_url")
    .eq("reference", ref)
    .single();

  const stored = data?.receipt_url as string | null | undefined;
  if (!stored) return new NextResponse("Receipt not found", { status: 404 });

  // Legacy rows stored a full URL; new rows store the storage path.
  if (stored.startsWith("http")) return NextResponse.redirect(stored, 302);

  const { data: signed } = await sb.storage
    .from("receipts")
    .createSignedUrl(stored, 60 * 10); // fresh 10-minute link each visit
  if (!signed?.signedUrl) {
    return new NextResponse("Receipt unavailable", { status: 404 });
  }
  return NextResponse.redirect(signed.signedUrl, 302);
}
