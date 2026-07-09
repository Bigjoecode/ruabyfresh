"use client";

import { useState } from "react";

export default function ImageUpload({
  value,
  onChange,
  bucket = "product-images",
  label = "Image",
  hint,
}: {
  value: string;
  onChange: (url: string) => void;
  bucket?: "product-images" | "hero-images";
  label?: string;
  hint?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const upload = async (file: File) => {
    setBusy(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("bucket", bucket);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (json.url) onChange(json.url);
      else setError(json.error || "Upload failed");
    } catch {
      setError("Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <span className="mb-1.5 block text-sm font-semibold text-[var(--color-forest)]">
        {label}
      </span>
      <div className="flex items-center gap-3">
        <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-xl border border-[var(--color-forest)]/15 bg-[var(--color-cream)]">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-contain" />
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-forest)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4"><path d="M4 5h16v14H4zM4 15l4-4 4 4M14 13l2-2 4 4M15 9h.01" /></svg>
          )}
        </div>
        <div className="space-y-1.5">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[var(--color-cream-deep)] px-3 py-2 text-sm font-medium text-[var(--color-forest)] transition hover:bg-[var(--color-leaf-soft)]">
            {busy ? "Uploading…" : value ? "Replace" : "Upload"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={busy}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) upload(f);
              }}
            />
          </label>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="ml-2 text-xs text-[var(--color-strawberry)] hover:underline"
            >
              Remove
            </button>
          )}
          {hint && <p className="text-xs text-[var(--color-ink)]/45">{hint}</p>}
          {error && <p className="text-xs text-[var(--color-strawberry)]">{error}</p>}
        </div>
      </div>
    </div>
  );
}
