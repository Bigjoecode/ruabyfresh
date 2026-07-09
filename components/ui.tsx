"use client";

import { motion, useInView, type Variants } from "motion/react";
import { useRef, type ReactNode } from "react";

/* ---------- Aurora / mesh-gradient cinematic background ---------- */
export function Aurora() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[var(--color-cream)]" />
      <div
        className="absolute -left-[10%] -top-[10%] h-[55vw] w-[55vw] rounded-full opacity-70 blur-3xl animate-[aurora_18s_ease-in-out_infinite]"
        style={{ background: "radial-gradient(circle, #8bc63f88, transparent 65%)" }}
      />
      <div
        className="absolute right-[-8%] top-[8%] h-[48vw] w-[48vw] rounded-full opacity-60 blur-3xl animate-[aurora_22s_ease-in-out_infinite_reverse]"
        style={{ background: "radial-gradient(circle, #e85d9a77, transparent 65%)" }}
      />
      <div
        className="absolute bottom-[-12%] left-[20%] h-[50vw] w-[50vw] rounded-full opacity-55 blur-3xl animate-[aurora_26s_ease-in-out_infinite]"
        style={{ background: "radial-gradient(circle, #1f5e2a55, transparent 65%)" }}
      />
      {/* grain */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}

/* ---------- Scroll reveal ---------- */
const revealVariants: Variants = {
  hidden: { opacity: 0, y: 40, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      variants={revealVariants}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Staggered container + item ---------- */
export function Stagger({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      variants={{ show: { transition: { staggerChildren: 0.09 } } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export const stagChild: Variants = {
  hidden: { opacity: 0, y: 32, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ---------- Section heading eyebrow ---------- */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-forest)] ring-1 ring-[var(--color-leaf)]/40">
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-rose)]" />
      {children}
    </span>
  );
}
