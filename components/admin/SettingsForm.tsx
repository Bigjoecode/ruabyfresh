"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Settings } from "@/lib/types";
import { saveSettings } from "@/lib/actions";
import ImageUpload from "./ImageUpload";

const toLocalInput = (iso: string) => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 16);
};

export default function SettingsForm({ settings }: { settings: Settings }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [s, setS] = useState<Settings>(settings);

  const setHero = <K extends keyof Settings["hero"]>(k: K, v: Settings["hero"][K]) =>
    setS((p) => ({ ...p, hero: { ...p.hero, [k]: v } }));
  const setOffer = <K extends keyof Settings["offer"]>(k: K, v: Settings["offer"][K]) =>
    setS((p) => ({ ...p, offer: { ...p.offer, [k]: v } }));

  const floating = s.hero.floatingImages;
  const setFloating = (i: number, url: string) => {
    const arr = [...floating];
    if (url) arr[i] = url;
    else arr.splice(i, 1);
    setHero("floatingImages", arr.filter(Boolean));
  };

  const save = () => {
    setError("");
    setSaved(false);
    start(async () => {
      const res = await saveSettings(s);
      if (res?.ok) {
        setSaved(true);
        router.refresh();
        setTimeout(() => setSaved(false), 2500);
      } else setError(res?.error || "Could not save.");
    });
  };

  const label = "mb-1.5 block text-sm font-semibold text-[var(--color-forest)]";
  const input =
    "w-full rounded-xl border border-[var(--color-forest)]/20 bg-white px-4 py-2.5 outline-none focus:border-[var(--color-leaf)] focus:ring-2 focus:ring-[var(--color-leaf)]/25";
  const card = "space-y-4 rounded-2xl border border-[var(--color-forest)]/10 bg-white p-6 md:p-8";

  return (
    <div className="max-w-3xl space-y-6">
      {/* LAUNCH */}
      <section className={card}>
        <h2 className="font-display text-xl font-semibold text-[var(--color-forest)]">Launch</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label>
            <span className={label}>Launch date &amp; time</span>
            <input
              type="datetime-local"
              className={input}
              value={toLocalInput(s.launchDate)}
              onChange={(e) => setS((p) => ({ ...p, launchDate: new Date(e.target.value).toISOString() }))}
            />
          </label>
          <label className="flex items-end gap-2 pb-2">
            <input type="checkbox" checked={s.launchOffer} onChange={(e) => setS((p) => ({ ...p, launchOffer: e.target.checked }))} className="h-4 w-4 accent-[var(--color-forest)]" />
            <span className="text-sm font-medium text-[var(--color-ink)]/80">Show launch (slashed) prices</span>
          </label>
        </div>
      </section>

      {/* HERO */}
      <section className={card}>
        <h2 className="font-display text-xl font-semibold text-[var(--color-forest)]">Hero section</h2>
        <label>
          <span className={label}>Badge line</span>
          <input className={input} value={s.hero.badge} onChange={(e) => setHero("badge", e.target.value)} />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label>
            <span className={label}>Headline (line 1)</span>
            <input className={input} value={s.hero.titleTop} onChange={(e) => setHero("titleTop", e.target.value)} />
          </label>
          <label>
            <span className={label}>Headline (line 2, italic)</span>
            <input className={input} value={s.hero.titleBottom} onChange={(e) => setHero("titleBottom", e.target.value)} />
          </label>
        </div>
        <label>
          <span className={label}>Subtitle</span>
          <textarea className={`${input} min-h-20`} value={s.hero.subtitle} onChange={(e) => setHero("subtitle", e.target.value)} />
        </label>

        <ImageUpload
          value={s.hero.backgroundImage}
          onChange={(url) => setHero("backgroundImage", url)}
          bucket="hero-images"
          label="Background image (optional)"
          hint="Sits behind the hero. Leave empty for the animated gradient."
        />

        <label className="flex items-center gap-2">
          <input type="checkbox" checked={s.hero.showDrip} onChange={(e) => setHero("showDrip", e.target.checked)} className="h-4 w-4 accent-[var(--color-forest)]" />
          <span className="text-sm font-medium text-[var(--color-ink)]/80">Show the dripping &ldquo;fresh vibes&rdquo; effect</span>
        </label>

        <div>
          <span className={label}>Floating hero images (optional, up to 4)</span>
          <p className="mb-3 text-xs text-[var(--color-ink)]/45">
            Override the floating products in the hero. Leave all empty to use product photos.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (
              <ImageUpload
                key={i}
                value={floating[i] ?? ""}
                onChange={(url) => setFloating(i, url)}
                bucket="hero-images"
                label={`Image ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* OFFERS */}
      <section className={card}>
        <h2 className="font-display text-xl font-semibold text-[var(--color-forest)]">Offer cards</h2>
        <p className="text-sm text-[var(--color-ink)]/55">The two coloured cards in the &ldquo;Launch offer&rdquo; band.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <label>
            <span className={label}>Parfait — badge</span>
            <input className={input} value={s.offer.parfaitBadge} onChange={(e) => setOffer("parfaitBadge", e.target.value)} />
          </label>
          <label>
            <span className={label}>Parfait — big amount</span>
            <input className={input} value={s.offer.parfaitAmount} onChange={(e) => setOffer("parfaitAmount", e.target.value)} />
          </label>
          <label>
            <span className={label}>Parfait — heading</span>
            <input className={input} value={s.offer.parfaitHeading} onChange={(e) => setOffer("parfaitHeading", e.target.value)} />
          </label>
          <label>
            <span className={label}>Parfait — subtext</span>
            <input className={input} value={s.offer.parfaitSub} onChange={(e) => setOffer("parfaitSub", e.target.value)} />
          </label>
          <label>
            <span className={label}>Yoghurt — new price</span>
            <input className={input} value={s.offer.yoghurtNow} onChange={(e) => setOffer("yoghurtNow", e.target.value)} />
          </label>
          <label>
            <span className={label}>Yoghurt — old price</span>
            <input className={input} value={s.offer.yoghurtWas} onChange={(e) => setOffer("yoghurtWas", e.target.value)} />
          </label>
          <label className="sm:col-span-2">
            <span className={label}>Yoghurt — subtext</span>
            <input className={input} value={s.offer.yoghurtSub} onChange={(e) => setOffer("yoghurtSub", e.target.value)} />
          </label>
        </div>
      </section>

      {error && <p className="rounded-lg bg-[var(--color-strawberry)]/10 px-3 py-2 text-sm text-[var(--color-strawberry)]">{error}</p>}

      <div className="sticky bottom-4 flex items-center gap-3 rounded-full border border-[var(--color-forest)]/10 bg-white/90 p-2 pl-5 shadow-lg backdrop-blur">
        <span className="text-sm text-[var(--color-ink)]/60">
          {saved ? "Saved ✓ — live in a moment" : "Changes go live after saving."}
        </span>
        <button
          onClick={save}
          disabled={pending}
          className="ml-auto cursor-pointer rounded-full bg-[var(--color-forest)] px-7 py-3 font-semibold text-white transition hover:bg-[var(--color-forest-deep)] disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
}
