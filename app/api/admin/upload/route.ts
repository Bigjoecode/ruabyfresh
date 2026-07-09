import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/supabase/auth";
import { createAdminClient } from "@/lib/supabase/admin";

const BUCKETS = ["product-images", "hero-images"];

export async function POST(req: Request) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file");
  const bucket = String(form.get("bucket") || "product-images");

  if (!BUCKETS.includes(bucket)) {
    return NextResponse.json({ error: "Bad bucket" }, { status: 400 });
  }
  if (!file || typeof file === "string" || file.size === 0) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }

  const ext = (file.name.split(".").pop() || "png").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext || "png"}`;
  const bytes = new Uint8Array(await file.arrayBuffer());

  const sb = createAdminClient();
  const { error } = await sb.storage
    .from(bucket)
    .upload(path, bytes, { contentType: file.type || "image/png", upsert: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const url = sb.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  return NextResponse.json({ url });
}
