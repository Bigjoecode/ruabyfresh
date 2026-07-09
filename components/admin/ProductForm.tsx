"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Product } from "@/lib/products";
import { saveProduct, deleteProduct } from "@/lib/actions";
import ImageUpload from "./ImageUpload";

type Form = Product & { sort_order: number; active: boolean };

const BLANK: Form = {
  id: "",
  name: "",
  variety: "",
  tagline: "",
  category: "Parfait",
  price: 0,
  launchPrice: 0,
  bulkPrice: 0,
  size: "",
  image: "",
  colors: ["#ffffff", "#f0a8c0", "#8bc63f"],
  badge: "",
  ingredients: [],
  benefits: [],
  sort_order: 0,
  active: true,
};

const slug = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  const isEdit = !!product;

  const [f, setF] = useState<Form>(
    product ? { ...BLANK, ...product } : BLANK
  );

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((p) => ({ ...p, [k]: v }));
  const label = "mb-1.5 block text-sm font-semibold text-[var(--color-forest)]";
  const input =
    "w-full rounded-xl border border-[var(--color-forest)]/20 bg-white px-4 py-2.5 outline-none focus:border-[var(--color-leaf)] focus:ring-2 focus:ring-[var(--color-leaf)]/25";

  const save = () => {
    setError("");
    const id = f.id || slug(f.name);
    if (!id || !f.name) {
      setError("Name is required.");
      return;
    }
    start(async () => {
      const res = await saveProduct({ ...f, id });
      if (res?.ok) router.push("/admin/products");
      else setError(res?.error || "Could not save.");
    });
  };

  const remove = () => {
    if (!product) return;
    start(async () => {
      await deleteProduct(product.id);
      router.push("/admin/products");
    });
  };

  return (
    <div className="max-w-3xl space-y-5 rounded-2xl border border-[var(--color-forest)]/10 bg-white p-6 md:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <label>
          <span className={label}>Name</span>
          <input className={input} value={f.name} onChange={(e) => set("name", e.target.value)} placeholder="500ml Parfait" />
        </label>
        <label>
          <span className={label}>Variety <span className="font-normal text-[var(--color-ink)]/40">(optional)</span></span>
          <input className={input} value={f.variety ?? ""} onChange={(e) => set("variety", e.target.value)} placeholder="Premium Treat" />
        </label>
        <label>
          <span className={label}>Category</span>
          <select className={input} value={f.category} onChange={(e) => set("category", e.target.value as Product["category"])}>
            <option value="Parfait">Parfait</option>
            <option value="Yoghurt">Yoghurt</option>
          </select>
        </label>
        <label>
          <span className={label}>Size</span>
          <input className={input} value={f.size} onChange={(e) => set("size", e.target.value)} placeholder="500ml" />
        </label>
        <label className="sm:col-span-2">
          <span className={label}>Tagline</span>
          <input className={input} value={f.tagline} onChange={(e) => set("tagline", e.target.value)} placeholder="Short description shown on the card" />
        </label>
        <label>
          <span className={label}>Badge <span className="font-normal text-[var(--color-ink)]/40">(optional)</span></span>
          <input className={input} value={f.badge ?? ""} onChange={(e) => set("badge", e.target.value)} placeholder="Bestseller" />
        </label>
        <div />

        <label>
          <span className={label}>Regular price (₦)</span>
          <input type="number" className={input} value={f.price} onChange={(e) => set("price", +e.target.value)} />
        </label>
        <label>
          <span className={label}>Launch / offer price (₦)</span>
          <input type="number" className={input} value={f.launchPrice} onChange={(e) => set("launchPrice", +e.target.value)} />
        </label>
        <label>
          <span className={label}>Bulk price 12+ (₦)</span>
          <input type="number" className={input} value={f.bulkPrice} onChange={(e) => set("bulkPrice", +e.target.value)} />
        </label>
        <label>
          <span className={label}>Sort order</span>
          <input type="number" className={input} value={f.sort_order} onChange={(e) => set("sort_order", +e.target.value)} />
        </label>
      </div>

      <ImageUpload
        value={f.image}
        onChange={(url) => set("image", url)}
        bucket="product-images"
        label="Product photo"
        hint="Square PNG works best. If empty, an illustrated fallback shows."
      />

      <div>
        <span className={label}>Fallback colours (used only when no photo)</span>
        <div className="flex gap-3">
          {[0, 1, 2].map((i) => (
            <input
              key={i}
              type="color"
              value={f.colors[i]}
              onChange={(e) => {
                const c = [...f.colors] as [string, string, string];
                c[i] = e.target.value;
                set("colors", c);
              }}
              className="h-10 w-14 cursor-pointer rounded-lg border border-[var(--color-forest)]/20"
            />
          ))}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label>
          <span className={label}>What&apos;s inside <span className="font-normal text-[var(--color-ink)]/40">(one per line)</span></span>
          <textarea
            className={`${input} min-h-32`}
            value={f.ingredients.join("\n")}
            onChange={(e) => set("ingredients", e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
            placeholder={"Creamy yoghurt\nCrunchy granola\nFresh fruit"}
          />
        </label>
        <label>
          <span className={label}>Benefits <span className="font-normal text-[var(--color-ink)]/40">(one per line)</span></span>
          <textarea
            className={`${input} min-h-32`}
            value={f.benefits.join("\n")}
            onChange={(e) => set("benefits", e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
            placeholder={"High in protein\nRich in nutrients"}
          />
        </label>
      </div>

      <label className="flex items-center gap-2">
        <input type="checkbox" checked={f.active} onChange={(e) => set("active", e.target.checked)} className="h-4 w-4 accent-[var(--color-forest)]" />
        <span className="text-sm font-medium text-[var(--color-ink)]/80">Visible on the storefront</span>
      </label>

      {error && <p className="rounded-lg bg-[var(--color-strawberry)]/10 px-3 py-2 text-sm text-[var(--color-strawberry)]">{error}</p>}

      <div className="flex items-center gap-3 border-t border-[var(--color-forest)]/10 pt-5">
        <button onClick={save} disabled={pending} className="cursor-pointer rounded-full bg-[var(--color-forest)] px-7 py-3 font-semibold text-white transition hover:bg-[var(--color-forest-deep)] disabled:opacity-50">
          {pending ? "Saving…" : isEdit ? "Save changes" : "Create product"}
        </button>
        <button onClick={() => router.push("/admin/products")} className="cursor-pointer rounded-full px-5 py-3 font-medium text-[var(--color-ink)]/60 hover:text-[var(--color-forest)]">
          Cancel
        </button>
        {isEdit && (
          <button onClick={remove} disabled={pending} className="ml-auto text-sm font-medium text-[var(--color-strawberry)] hover:underline">
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
