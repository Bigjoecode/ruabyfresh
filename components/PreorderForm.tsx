"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  products as seedProducts,
  formatNaira,
  displayName,
  LAUNCH_OFFER,
  BRAND,
  type Product,
} from "@/lib/products";
import {
  submitOrder,
  storeOrder,
  orderRef,
  buildOrderMessage,
  whatsappUrl,
} from "@/lib/order";
import BankDetails from "./BankDetails";

/**
 * A lightweight pre-order form that composes a WhatsApp order message.
 * Pass a `product` to lock it to one flavour (used on product pages), or omit
 * it to show a product picker (used in the homepage pre-order section).
 */
export default function PreorderForm({
  product,
  products,
  compact = false,
}: {
  product?: Product;
  products?: Product[];
  compact?: boolean;
}) {
  const list = products ?? seedProducts;
  const priceOf = (p?: Product) => (p ? (LAUNCH_OFFER ? p.launchPrice : p.price) : 0);

  // One or more line items (customers can order several flavours at once).
  const [items, setItems] = useState<{ id: string; qty: number }[]>([
    { id: product?.id ?? list[0]?.id ?? "", qty: 1 },
  ]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState<"delivery" | "pickup">("delivery");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receipt, setReceipt] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<{ reference: string; type: string; waUrl: string } | null>(null);

  const productOf = (id: string) => list.find((p) => p.id === id);
  const setItem = (i: number, patch: Partial<{ id: string; qty: number }>) =>
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  const addItem = () =>
    setItems((prev) => [...prev, { id: list[0]?.id ?? "", qty: 1 }]);
  const removeItem = (i: number) =>
    setItems((prev) => (prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev));

  const total = items.reduce((s, it) => s + priceOf(productOf(it.id)) * it.qty, 0);
  const valid =
    name.trim() && phone.trim() && (type === "pickup" || address.trim()) && receiptFile;

  const onReceipt = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      setReceipt(URL.createObjectURL(file));
    }
  };

  const submit = async () => {
    setTouched(true);
    if (!valid || !receiptFile || sending) return;
    setSending(true);
    const reference = orderRef();
    const lines = items
      .map((it) => {
        const p = productOf(it.id);
        return p ? { name: displayName(p), qty: it.qty, price: priceOf(p) } : null;
      })
      .filter((l): l is { name: string; qty: number; price: number } => l !== null);
    const order = {
      reference,
      total,
      lines,
      customer: { name, phone, type, address, note },
    };
    const res = await storeOrder(order, receiptFile);
    const receiptUrl = res?.receiptUrl ?? null;
    submitOrder(order, receiptUrl);
    setDone({ reference, type, waUrl: whatsappUrl(buildOrderMessage(order, receiptUrl)) });
    setSending(false);
  };

  const reset = () => {
    setDone(null);
    setItems([{ id: product?.id ?? list[0]?.id ?? "", qty: 1 }]);
    setReceiptFile(null);
    setReceipt(null);
    setNote("");
    setTouched(false);
  };

  const field =
    "w-full rounded-2xl border border-[var(--color-forest)]/15 bg-white/70 px-4 py-3 text-[var(--color-ink)] outline-none transition placeholder:text-[var(--color-ink)]/35 focus:border-[var(--color-leaf)] focus:ring-2 focus:ring-[var(--color-leaf)]/30";
  const err = "border-[var(--color-strawberry)]/60";

  const productOptions = (
    <>
      <optgroup label="Parfaits">
        {list.filter((p) => p.category === "Parfait").map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </optgroup>
      <optgroup label="Yoghurt Drinks (500ml)">
        {list.filter((p) => p.category === "Yoghurt").map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </optgroup>
    </>
  );

  if (done) {
    return (
      <div className="rounded-[28px] glass p-8 text-center md:p-10">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 16 }}
          className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[var(--color-leaf)]/25 text-[var(--color-forest)]"
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
        </motion.div>
        <p className="mt-5 font-display text-3xl font-semibold text-[var(--color-forest)]">
          Order received!
        </p>
        <p className="mt-1 text-sm text-[var(--color-forest)]/70">
          Reference <span className="font-semibold text-[var(--color-rose)]">{done.reference}</span>
        </p>
        <p className="mx-auto mt-4 max-w-sm text-[var(--color-ink)]/70">
          We&apos;ve opened WhatsApp to Ruaby Fresh with your order and receipt link included.
          Just tap <b>send</b> to confirm.
        </p>
        <div className="mt-6 flex flex-col items-center gap-3">
          <a
            href={done.waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-forest)] px-8 py-4 font-semibold text-white transition hover:bg-[var(--color-forest-deep)]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm5.8 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.5-1.2-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .5l-.4.6c-.2.2-.3.4-.1.7.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.2.1.4.1.5-.1l.7-.8c.2-.2.4-.2.6-.1l1.8.9c.3.1.4.2.5.3.1.2.1.6-.1 1Z" /></svg>
            Open WhatsApp to send
          </a>
          <button
            onClick={reset}
            className="cursor-pointer text-sm font-medium text-[var(--color-forest)]/70 transition hover:text-[var(--color-forest)]"
          >
            Place another order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-[28px] glass p-6 md:p-8 ${compact ? "" : ""}`}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <span className="mb-1.5 block text-sm font-semibold text-[var(--color-forest)]">
            Your order
          </span>
          <div className="space-y-2">
            {items.map((it, i) => (
              <div key={i} className="flex items-center gap-2">
                <select
                  value={it.id}
                  onChange={(e) => setItem(i, { id: e.target.value })}
                  className={`${field} min-w-0 flex-1`}
                >
                  {productOptions}
                </select>
                <div className="flex shrink-0 items-center gap-1 rounded-2xl border border-[var(--color-forest)]/15 bg-white/70 px-1.5 py-1">
                  <button
                    type="button"
                    aria-label="Decrease"
                    onClick={() => setItem(i, { qty: Math.max(1, it.qty - 1) })}
                    className="grid h-8 w-8 cursor-pointer place-items-center rounded-full bg-[var(--color-cream)] text-[var(--color-forest)] transition hover:bg-[var(--color-leaf)] hover:text-white"
                  >
                    −
                  </button>
                  <span className="w-6 text-center font-semibold tabular-nums">{it.qty}</span>
                  <button
                    type="button"
                    aria-label="Increase"
                    onClick={() => setItem(i, { qty: it.qty + 1 })}
                    className="grid h-8 w-8 cursor-pointer place-items-center rounded-full bg-[var(--color-cream)] text-[var(--color-forest)] transition hover:bg-[var(--color-leaf)] hover:text-white"
                  >
                    +
                  </button>
                </div>
                {items.length > 1 && (
                  <button
                    type="button"
                    aria-label="Remove item"
                    onClick={() => removeItem(i)}
                    className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full bg-[var(--color-cream)] text-[var(--color-strawberry)] transition hover:bg-[var(--color-strawberry)]/15"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addItem}
            className="mt-2.5 inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[var(--color-leaf-soft)]/50 px-4 py-2 text-sm font-semibold text-[var(--color-forest)] transition hover:bg-[var(--color-leaf-soft)]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
            Add another flavour
          </button>
        </div>

        <label>
          <span className="mb-1.5 block text-sm font-semibold text-[var(--color-forest)]">
            Fulfilment
          </span>
          <div className="grid grid-cols-2 gap-2">
            {(["delivery", "pickup"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`cursor-pointer rounded-2xl px-3 py-3 text-sm font-semibold capitalize transition ${
                  type === t
                    ? "bg-[var(--color-forest)] text-white"
                    : "bg-white/70 text-[var(--color-forest)] hover:bg-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </label>

        <label>
          <span className="mb-1.5 block text-sm font-semibold text-[var(--color-forest)]">
            Your name
          </span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ada N."
            className={`${field} ${touched && !name.trim() ? err : ""}`}
          />
        </label>

        <label>
          <span className="mb-1.5 block text-sm font-semibold text-[var(--color-forest)]">
            Phone / WhatsApp
          </span>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            inputMode="tel"
            placeholder="0803 000 0000"
            className={`${field} ${touched && !phone.trim() ? err : ""}`}
          />
        </label>

        {type === "delivery" && (
          <label className="sm:col-span-2">
            <span className="mb-1.5 block text-sm font-semibold text-[var(--color-forest)]">
              Delivery address
            </span>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street, area, Asaba"
              className={`${field} ${touched && !address.trim() ? err : ""}`}
            />
          </label>
        )}

        <label className="sm:col-span-2">
          <span className="mb-1.5 block text-sm font-semibold text-[var(--color-forest)]">
            Note <span className="font-normal text-[var(--color-ink)]/40">(optional)</span>
          </span>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Any special request or delivery time"
            className={field}
          />
        </label>
      </div>

      <div className="mt-5">
        <BankDetails total={total} />
      </div>

      <div className="mt-4">
        <span className="mb-1.5 block text-sm font-semibold text-[var(--color-forest)]">
          Upload payment receipt <span className="text-[var(--color-rose)]">*</span>
        </span>
        <label
          className={`flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed px-4 py-4 text-sm font-medium text-[var(--color-forest)] transition hover:bg-white/80 ${
            touched && !receiptFile
              ? "border-[var(--color-strawberry)]/70 bg-[var(--color-strawberry)]/5"
              : "border-[var(--color-forest)]/30 bg-white/50"
          }`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16V4m0 0 4 4m-4-4L8 8M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" /></svg>
          {receipt ? "Change receipt" : "Choose screenshot"}
          <input type="file" accept="image/*" className="hidden" onChange={onReceipt} />
        </label>
        {receipt && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={receipt} alt="Payment receipt preview" className="mt-3 max-h-40 w-full rounded-xl object-contain ring-1 ring-[var(--color-forest)]/10" />
        )}
      </div>

      <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <div className="text-center sm:text-left">
          <p className="text-sm text-[var(--color-forest)]/60">Order total</p>
          <p className="font-display text-2xl font-semibold text-[var(--color-forest)]">
            {formatNaira(total)}
          </p>
        </div>
        <button
          onClick={submit}
          disabled={sending}
          className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-[var(--color-forest)] px-8 py-4 font-semibold text-white transition hover:bg-[var(--color-forest-deep)] disabled:opacity-60 sm:w-auto"
        >
          {sending ? (
            <span className="relative z-10">Preparing your order…</span>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm5.8 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.5-1.2-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .5l-.4.6c-.2.2-.3.4-.1.7.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.2.1.4.1.5-.1l.7-.8c.2-.2.4-.2.6-.1l1.8.9c.3.1.4.2.5.3.1.2.1.6-.1 1Z" /></svg>
              <span className="relative z-10">Send pre-order on WhatsApp</span>
            </>
          )}
        </button>
      </div>
      {touched && !valid && (
        <p className="mt-3 text-center text-sm text-[var(--color-strawberry)]" role="alert">
          {!name.trim() || !phone.trim() || (type === "delivery" && !address.trim())
            ? `Please add your name, phone${type === "delivery" ? " and delivery address" : ""}.`
            : "Please upload your transfer receipt."}
        </p>
      )}
      <p className="mt-3 text-center text-xs text-[var(--color-forest)]/50">
        WhatsApp opens a chat to {BRAND.whatsappDisplay} with your order and receipt link included.
      </p>
    </div>
  );
}
