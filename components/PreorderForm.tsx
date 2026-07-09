"use client";

import { useState } from "react";
import {
  products,
  formatNaira,
  LAUNCH_OFFER,
  BRAND,
  type Product,
} from "@/lib/products";
import { whatsappOrderLink, orderRef } from "@/lib/order";
import BankDetails from "./BankDetails";

/**
 * A lightweight pre-order form that composes a WhatsApp order message.
 * Pass a `product` to lock it to one flavour (used on product pages), or omit
 * it to show a product picker (used in the homepage pre-order section).
 */
export default function PreorderForm({
  product,
  compact = false,
}: {
  product?: Product;
  compact?: boolean;
}) {
  const [selectedId, setSelectedId] = useState(product?.id ?? products[0].id);
  const [qty, setQty] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState<"delivery" | "pickup">("delivery");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [touched, setTouched] = useState(false);

  const chosen = product ?? products.find((p) => p.id === selectedId)!;
  const unit = LAUNCH_OFFER ? chosen.launchPrice : chosen.price;
  const total = unit * qty;
  const valid = name.trim() && phone.trim() && (type === "pickup" || address.trim());

  const submit = () => {
    setTouched(true);
    if (!valid) return;
    const reference = orderRef();
    const link = whatsappOrderLink({
      reference,
      total,
      lines: [{ name: `${chosen.name} (${chosen.size})`, qty, price: unit }],
      customer: { name, phone, type, address, note },
    });
    // Fire-and-forget record for the team's logs.
    fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reference,
        total,
        lines: [{ id: chosen.id, name: chosen.name, qty, price: unit }],
        customer: { name, phone },
      }),
    }).catch(() => {});
    window.open(link, "_blank", "noopener");
  };

  const field =
    "w-full rounded-2xl border border-[var(--color-forest)]/15 bg-white/70 px-4 py-3 text-[var(--color-ink)] outline-none transition placeholder:text-[var(--color-ink)]/35 focus:border-[var(--color-leaf)] focus:ring-2 focus:ring-[var(--color-leaf)]/30";
  const err = touched ? "border-[var(--color-strawberry)]/60" : "";

  return (
    <div className={`rounded-[28px] glass p-6 md:p-8 ${compact ? "" : ""}`}>
      <div className="grid gap-4 sm:grid-cols-2">
        {!product && (
          <label className="sm:col-span-2">
            <span className="mb-1.5 block text-sm font-semibold text-[var(--color-forest)]">
              Flavour
            </span>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className={field}
            >
              <optgroup label="Parfaits">
                {products
                  .filter((p) => p.category === "Parfait")
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Yoghurt Drinks (500ml)">
                {products
                  .filter((p) => p.category === "Yoghurt")
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
              </optgroup>
            </select>
          </label>
        )}

        <label>
          <span className="mb-1.5 block text-sm font-semibold text-[var(--color-forest)]">
            Quantity
          </span>
          <div className="flex items-center gap-2 rounded-2xl border border-[var(--color-forest)]/15 bg-white/70 px-2 py-1.5">
            <button
              type="button"
              aria-label="Decrease"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="grid h-9 w-9 cursor-pointer place-items-center rounded-full bg-[var(--color-cream)] text-[var(--color-forest)] transition hover:bg-[var(--color-leaf)] hover:text-white"
            >
              −
            </button>
            <span className="w-8 text-center font-semibold tabular-nums">{qty}</span>
            <button
              type="button"
              aria-label="Increase"
              onClick={() => setQty((q) => q + 1)}
              className="grid h-9 w-9 cursor-pointer place-items-center rounded-full bg-[var(--color-cream)] text-[var(--color-forest)] transition hover:bg-[var(--color-leaf)] hover:text-white"
            >
              +
            </button>
            {qty >= 12 && (
              <span className="ml-1 rounded-full bg-[var(--color-leaf-soft)]/60 px-2 py-1 text-xs font-semibold text-[var(--color-forest)]">
                bulk
              </span>
            )}
          </div>
        </label>

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

      <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <div className="text-center sm:text-left">
          <p className="text-sm text-[var(--color-forest)]/60">Order total</p>
          <p className="font-display text-2xl font-semibold text-[var(--color-forest)]">
            {formatNaira(total)}
          </p>
        </div>
        <button
          onClick={submit}
          className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-[var(--color-forest)] px-8 py-4 font-semibold text-white transition hover:bg-[var(--color-forest-deep)] sm:w-auto"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm5.8 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.5-1.2-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .5l-.4.6c-.2.2-.3.4-.1.7.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.2.1.4.1.5-.1l.7-.8c.2-.2.4-.2.6-.1l1.8.9c.3.1.4.2.5.3.1.2.1.6-.1 1Z" /></svg>
          <span className="relative z-10">Send pre-order on WhatsApp</span>
        </button>
      </div>
      {touched && !valid && (
        <p className="mt-3 text-center text-sm text-[var(--color-strawberry)]" role="alert">
          Please add your name, phone{type === "delivery" ? " and delivery address" : ""}.
        </p>
      )}
      <p className="mt-3 text-center text-xs text-[var(--color-forest)]/50">
        You&apos;ll send the order to {BRAND.whatsappDisplay} and attach your transfer receipt.
      </p>
    </div>
  );
}
