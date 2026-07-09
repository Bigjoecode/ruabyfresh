"use client";

const words = [
  "Strawberry",
  "Parfait",
  "Banana",
  "Cold-Pressed",
  "Vanilla",
  "No Preservatives",
  "Granola",
  "Fresh Daily",
  "Blueberry",
  "Handcrafted",
];

export default function Marquee() {
  return (
    <div className="relative flex overflow-hidden border-y border-[var(--color-forest)]/10 bg-[var(--color-forest)] py-5">
      <div className="flex shrink-0 animate-[marquee_32s_linear_infinite] items-center gap-8 pr-8">
        {[...words, ...words].map((w, i) => (
          <span key={i} className="flex items-center gap-8">
            <span className="font-display text-2xl font-medium italic text-[var(--color-cream)] md:text-3xl">
              {w}
            </span>
            <span className="text-[var(--color-leaf)]">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
