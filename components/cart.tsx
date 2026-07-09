"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { products, formatNaira, type Product } from "@/lib/products";
import ProductVisual from "./ProductVisual";

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
    () =>
      lines.reduce(
        (s, l) => s + (bulk ? l.product.bulkPrice : l.product.price) * l.qty,
        0
      ),
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

function CartDrawer() {
  const { lines, open, setOpen, subtotal, count, bulk, setQty } = useCart();

  const [loading, setLoading] = useState(false);

  const checkout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          total: subtotal,
          lines: lines.map((l) => ({
            id: l.product.id,
            name: l.product.name,
            qty: l.qty,
            price: bulk ? l.product.bulkPrice : l.product.price,
          })),
        }),
      });
      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
      // Nomba keys not configured yet — friendly fallback.
      alert(
        `Ready to pay ${formatNaira(subtotal)} for ${count} item(s).\n\n` +
          `Add your Nomba API keys (.env.local) to enable live checkout.`
      );
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
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
              <div>
                <p className="font-display text-2xl font-semibold text-[var(--color-forest)]">
                  Your basket
                </p>
                <p className="text-sm text-[var(--color-forest)]/60">
                  {count} item{count !== 1 && "s"}
                  {bulk && " · bulk pricing applied 🎉".replace(" 🎉", " unlocked")}
                </p>
              </div>
              <button
                aria-label="Close basket"
                onClick={() => setOpen(false)}
                className="grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-white/60 text-[var(--color-forest)] transition hover:bg-white"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
            </header>

            <div className="flex-1 space-y-3 overflow-y-auto px-6 py-2">
              {lines.length === 0 && (
                <div className="mt-20 text-center text-[var(--color-forest)]/60">
                  <p className="font-display text-xl">Your basket is empty</p>
                  <p className="mt-1 text-sm">Add a little freshness ✨</p>
                </div>
              )}
              {lines.map((l) => (
                <div
                  key={l.product.id}
                  className="flex items-center gap-3 rounded-2xl bg-white/55 p-3"
                >
                  <div className="h-16 w-16 shrink-0 rounded-xl bg-[var(--color-cream)]/70">
                    <ProductVisual product={l.product} className="h-full w-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-[var(--color-ink)]">
                      {l.product.name}
                    </p>
                    <p className="text-sm text-[var(--color-rose)]">
                      {formatNaira(bulk ? l.product.bulkPrice : l.product.price)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-[var(--color-cream)] px-1 py-1">
                    <button
                      aria-label="Decrease quantity"
                      onClick={() => setQty(l.product.id, l.qty - 1)}
                      className="grid h-7 w-7 cursor-pointer place-items-center rounded-full bg-white text-[var(--color-forest)] transition hover:bg-[var(--color-leaf)] hover:text-white"
                    >
                      −
                    </button>
                    <span className="w-5 text-center text-sm font-semibold tabular-nums">
                      {l.qty}
                    </span>
                    <button
                      aria-label="Increase quantity"
                      onClick={() => setQty(l.product.id, l.qty + 1)}
                      className="grid h-7 w-7 cursor-pointer place-items-center rounded-full bg-white text-[var(--color-forest)] transition hover:bg-[var(--color-leaf)] hover:text-white"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {!bulk && lines.length > 0 && (
              <p className="mx-6 mb-2 rounded-xl bg-[var(--color-leaf-soft)]/50 px-4 py-2 text-center text-xs text-[var(--color-forest)]">
                Add {BULK_THRESHOLD - count} more to unlock bulk pricing 💚
              </p>
            )}

            <footer className="space-y-3 px-6 pb-6 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-forest)]/70">Subtotal</span>
                <span className="font-display text-2xl font-semibold text-[var(--color-forest)]">
                  {formatNaira(subtotal)}
                </span>
              </div>
              <button
                onClick={checkout}
                disabled={lines.length === 0 || loading}
                className="group relative w-full cursor-pointer overflow-hidden rounded-full bg-[var(--color-forest)] py-4 font-semibold text-white transition hover:bg-[var(--color-forest-deep)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span className="relative z-10">
                  {loading ? "Connecting to Nomba…" : "Checkout with Nomba"}
                </span>
                <span className="absolute inset-0 shine opacity-0 transition group-hover:opacity-100" />
              </button>
              <p className="text-center text-xs text-[var(--color-forest)]/50">
                Secure payment · Single & bulk orders · Fast Asaba delivery
              </p>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
