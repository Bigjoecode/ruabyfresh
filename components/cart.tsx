"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  formatNaira,
  displayName,
  hasBulkDiscount,
  LAUNCH_OFFER,
  BRAND,
  type Product,
} from "@/lib/products";
import { submitOrder, orderRef, type Customer } from "@/lib/order";
import ProductImage from "./ProductImage";
import BankDetails from "./BankDetails";

/** Per-unit price given quantity/bulk state and the active launch offer. */
const unitPrice = (p: Product, bulk: boolean) =>
  bulk ? p.bulkPrice : LAUNCH_OFFER ? p.launchPrice : p.price;

type Line = { product: Product; qty: number };
type CartCtx = {
  lines: Line[];
  count: number;
  subtotal: number;
  bulk: boolean;
  open: boolean;
  add: (p: Product, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  setOpen: (o: boolean) => void;
};

const Ctx = createContext<CartCtx | null>(null);
export const useCart = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used within CartProvider");
  return c;
};

const BULK_THRESHOLD = 12;

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [open, setOpen] = useState(false);

  const add = useCallback((p: Product, qty = 1) => {
    setLines((prev) => {
      const found = prev.find((l) => l.product.id === p.id);
      if (found)
        return prev.map((l) =>
          l.product.id === p.id ? { ...l, qty: l.qty + qty } : l
        );
      return [...prev, { product: p, qty }];
    });
    setOpen(true);
  }, []);

  const remove = useCallback(
    (id: string) => setLines((p) => p.filter((l) => l.product.id !== id)),
    []
  );

  const setQty = useCallback(
    (id: string, qty: number) =>
      setLines((p) =>
        qty <= 0
          ? p.filter((l) => l.product.id !== id)
          : p.map((l) => (l.product.id === id ? { ...l, qty } : l))
      ),
    []
  );

  const count = useMemo(() => lines.reduce((s, l) => s + l.qty, 0), [lines]);
  const bulk = count >= BULK_THRESHOLD;
  const subtotal = useMemo(
    () => lines.reduce((s, l) => s + unitPrice(l.product, bulk) * l.qty, 0),
    [lines, bulk]
  );

  const value: CartCtx = {
    lines,
    count,
    subtotal,
    bulk,
    open,
    add,
    remove,
    setQty,
    setOpen,
  };

  return (
    <Ctx.Provider value={value}>
      {children}
      <CartDrawer />
    </Ctx.Provider>
  );
}

type Step = "cart" | "details" | "pay";

function CartDrawer() {
  const { lines, open, setOpen, subtotal, count, bulk, setQty } = useCart();

  const [step, setStep] = useState<Step>("cart");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState<"delivery" | "pickup">("delivery");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receipt, setReceipt] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [payTouched, setPayTouched] = useState(false);

  // Always reopen at the basket step.
  useEffect(() => {
    if (!open) {
      setStep("cart");
      setTouched(false);
      setPayTouched(false);
    }
  }, [open]);

  const detailsValid =
    name.trim() && phone.trim() && (type === "pickup" || address.trim());

  const goToDetails = () => setStep("details");
  const goToPay = () => {
    setTouched(true);
    if (!detailsValid) return;
    setStep("pay");
  };

  const onReceipt = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      setReceipt(URL.createObjectURL(file));
    }
  };

  const sendOrder = () => {
    setPayTouched(true);
    if (!receiptFile) return; // receipt is required
    const reference = orderRef();
    const customer: Customer = { name, phone, type, address, note };
    submitOrder(
      {
        reference,
        total: subtotal,
        bulk,
        customer,
        lines: lines.map((l) => ({
          name: displayName(l.product),
          qty: l.qty,
          price: unitPrice(l.product, bulk),
        })),
      },
      receiptFile
    );
    fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reference,
        total: subtotal,
        lines: lines.map((l) => ({
          id: l.product.id,
          name: l.product.name,
          qty: l.qty,
          price: unitPrice(l.product, bulk),
        })),
        customer: { name, phone },
      }),
    }).catch(() => {});
  };

  const field =
    "w-full rounded-2xl border border-[var(--color-forest)]/15 bg-white/70 px-4 py-3 text-[var(--color-ink)] outline-none transition placeholder:text-[var(--color-ink)]/35 focus:border-[var(--color-leaf)] focus:ring-2 focus:ring-[var(--color-leaf)]/30";

  const anyBulk = lines.some((l) => hasBulkDiscount(l.product));

  const headings: Record<Step, { title: string; sub: string }> = {
    cart: { title: "Your basket", sub: `${count} item${count !== 1 ? "s" : ""}${bulk && anyBulk ? " · bulk unlocked" : ""}` },
    details: { title: "Your details", sub: "Where should it go?" },
    pay: { title: "Pay & confirm", sub: "Transfer, then send on WhatsApp" },
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[90] bg-[#0d2413]/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            className="fixed right-0 top-0 z-[100] flex h-full w-full max-w-md flex-col glass"
            style={{ borderRadius: "28px 0 0 28px" }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 260 }}
          >
            <header className="flex items-center justify-between px-6 pt-6 pb-4">
              <div className="flex items-center gap-2">
                {step !== "cart" && (
                  <button
                    aria-label="Back"
                    onClick={() => setStep(step === "pay" ? "details" : "cart")}
                    className="grid h-9 w-9 cursor-pointer place-items-center rounded-full bg-white/60 text-[var(--color-forest)] transition hover:bg-white"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                  </button>
                )}
                <div>
                  <p className="font-display text-2xl font-semibold text-[var(--color-forest)]">
                    {headings[step].title}
                  </p>
                  <p className="text-sm text-[var(--color-forest)]/60">{headings[step].sub}</p>
                </div>
              </div>
              <button
                aria-label="Close basket"
                onClick={() => setOpen(false)}
                className="grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-white/60 text-[var(--color-forest)] transition hover:bg-white"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
            </header>

            {/* step progress */}
            <div className="flex gap-1.5 px-6 pb-3">
              {(["cart", "details", "pay"] as Step[]).map((s, i) => (
                <span
                  key={s}
                  className={`h-1 flex-1 rounded-full transition ${
                    ["cart", "details", "pay"].indexOf(step) >= i
                      ? "bg-[var(--color-leaf)]"
                      : "bg-[var(--color-forest)]/15"
                  }`}
                />
              ))}
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-6 py-2">
              {/* ---------- CART STEP ---------- */}
              {step === "cart" && (
                <>
                  {lines.length === 0 && (
                    <div className="mt-20 text-center text-[var(--color-forest)]/60">
                      <p className="font-display text-xl">Your basket is empty</p>
                      <p className="mt-1 text-sm">Add a little freshness ✨</p>
                    </div>
                  )}
                  {lines.map((l) => (
                    <div key={l.product.id} className="flex items-center gap-3 rounded-2xl bg-white/55 p-3">
                      <div className="h-16 w-16 shrink-0 rounded-xl bg-[var(--color-cream)]/70">
                        <ProductImage product={l.product} className="h-full w-full" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-[var(--color-ink)]">{l.product.name}</p>
                        <p className="text-sm text-[var(--color-rose)]">
                          {formatNaira(unitPrice(l.product, bulk))}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 rounded-full bg-[var(--color-cream)] px-1 py-1">
                        <button aria-label="Decrease quantity" onClick={() => setQty(l.product.id, l.qty - 1)} className="grid h-7 w-7 cursor-pointer place-items-center rounded-full bg-white text-[var(--color-forest)] transition hover:bg-[var(--color-leaf)] hover:text-white">−</button>
                        <span className="w-5 text-center text-sm font-semibold tabular-nums">{l.qty}</span>
                        <button aria-label="Increase quantity" onClick={() => setQty(l.product.id, l.qty + 1)} className="grid h-7 w-7 cursor-pointer place-items-center rounded-full bg-white text-[var(--color-forest)] transition hover:bg-[var(--color-leaf)] hover:text-white">+</button>
                      </div>
                    </div>
                  ))}
                  {!bulk && anyBulk && lines.length > 0 && (
                    <p className="rounded-xl bg-[var(--color-leaf-soft)]/50 px-4 py-2 text-center text-xs text-[var(--color-forest)]">
                      Add {BULK_THRESHOLD - count} more to unlock bulk pricing 💚
                    </p>
                  )}
                </>
              )}

              {/* ---------- DETAILS STEP ---------- */}
              {step === "details" && (
                <div className="space-y-4 py-1">
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold text-[var(--color-forest)]">Your name</span>
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ada N." className={`${field} ${touched && !name.trim() ? "border-[var(--color-strawberry)]/60" : ""}`} />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold text-[var(--color-forest)]">Phone / WhatsApp</span>
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" placeholder="0803 000 0000" className={`${field} ${touched && !phone.trim() ? "border-[var(--color-strawberry)]/60" : ""}`} />
                  </label>
                  <div>
                    <span className="mb-1.5 block text-sm font-semibold text-[var(--color-forest)]">Fulfilment</span>
                    <div className="grid grid-cols-2 gap-2">
                      {(["delivery", "pickup"] as const).map((t) => (
                        <button key={t} type="button" onClick={() => setType(t)} className={`cursor-pointer rounded-2xl px-3 py-3 text-sm font-semibold capitalize transition ${type === t ? "bg-[var(--color-forest)] text-white" : "bg-white/70 text-[var(--color-forest)] hover:bg-white"}`}>{t}</button>
                      ))}
                    </div>
                  </div>
                  {type === "delivery" && (
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-semibold text-[var(--color-forest)]">Delivery address</span>
                      <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street, area, Asaba" className={`${field} ${touched && !address.trim() ? "border-[var(--color-strawberry)]/60" : ""}`} />
                    </label>
                  )}
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold text-[var(--color-forest)]">Note <span className="font-normal text-[var(--color-ink)]/40">(optional)</span></span>
                    <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Preferred delivery time, etc." className={field} />
                  </label>
                  {touched && !detailsValid && (
                    <p className="text-sm text-[var(--color-strawberry)]" role="alert">Please fill in your name, phone{type === "delivery" ? " and address" : ""}.</p>
                  )}
                </div>
              )}

              {/* ---------- PAY STEP ---------- */}
              {step === "pay" && (
                <div className="space-y-4 py-1">
                  <div className="rounded-2xl bg-white/55 p-4 text-sm text-[var(--color-ink)]/70">
                    {lines.map((l) => (
                      <div key={l.product.id} className="flex justify-between py-0.5">
                        <span>{l.qty} × {l.product.name}</span>
                        <span className="tabular-nums">{formatNaira(unitPrice(l.product, bulk) * l.qty)}</span>
                      </div>
                    ))}
                  </div>

                  <BankDetails total={subtotal} />

                  <div>
                    <span className="mb-1.5 block text-sm font-semibold text-[var(--color-forest)]">
                      Upload payment receipt <span className="text-[var(--color-rose)]">*</span>
                    </span>
                    <label
                      className={`flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed px-4 py-4 text-sm font-medium text-[var(--color-forest)] transition hover:bg-white/80 ${
                        payTouched && !receiptFile
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
                    {payTouched && !receiptFile && (
                      <p className="mt-2 text-sm text-[var(--color-strawberry)]" role="alert">
                        Please upload your transfer receipt to continue.
                      </p>
                    )}
                  </div>

                  <p className="rounded-xl bg-[var(--color-leaf-soft)]/40 px-4 py-3 text-xs leading-relaxed text-[var(--color-forest)]">
                    After transferring, upload your receipt and tap below. On your phone,
                    WhatsApp opens with the receipt <b>and</b> order attached — just hit send.
                  </p>
                </div>
              )}
            </div>

            <footer className="space-y-3 px-6 pb-6 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-forest)]/70">{step === "pay" ? "Total to pay" : "Subtotal"}</span>
                <span className="font-display text-2xl font-semibold text-[var(--color-forest)]">{formatNaira(subtotal)}</span>
              </div>

              {step === "cart" && (
                <button onClick={goToDetails} disabled={lines.length === 0} className="w-full cursor-pointer rounded-full bg-[var(--color-forest)] py-4 font-semibold text-white transition hover:bg-[var(--color-forest-deep)] disabled:cursor-not-allowed disabled:opacity-40">
                  Continue to details
                </button>
              )}
              {step === "details" && (
                <button onClick={goToPay} className="w-full cursor-pointer rounded-full bg-[var(--color-forest)] py-4 font-semibold text-white transition hover:bg-[var(--color-forest-deep)]">
                  Continue to payment
                </button>
              )}
              {step === "pay" && (
                <button onClick={sendOrder} className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[var(--color-forest)] py-4 font-semibold text-white transition hover:bg-[var(--color-forest-deep)]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm5.8 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.5-1.2-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .5l-.4.6c-.2.2-.3.4-.1.7.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.2.1.4.1.5-.1l.7-.8c.2-.2.4-.2.6-.1l1.8.9c.3.1.4.2.5.3.1.2.1.6-.1 1Z" /></svg>
                  I&apos;ve paid — send on WhatsApp
                </button>
              )}
              <p className="text-center text-xs text-[var(--color-forest)]/50">
                Bank transfer · {BRAND.bank.name} · Single &amp; bulk · {BRAND.city}
              </p>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
