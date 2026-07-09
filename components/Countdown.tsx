"use client";

import { useEffect, useState } from "react";
import { LAUNCH_DATE } from "@/lib/products";

function diff(target: number) {
  const ms = Math.max(0, target - Date.now());
  return {
    days: Math.floor(ms / 86400000),
    hours: Math.floor((ms / 3600000) % 24),
    minutes: Math.floor((ms / 60000) % 60),
    seconds: Math.floor((ms / 1000) % 60),
    done: ms === 0,
  };
}

export default function Countdown({
  date,
  compact = false,
}: {
  date?: string;
  compact?: boolean;
}) {
  const target = (date ? new Date(date) : LAUNCH_DATE).getTime();
  const [t, setT] = useState<ReturnType<typeof diff> | null>(null);

  useEffect(() => {
    setT(diff(target));
    const i = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(i);
  }, [target]);

  // Avoid hydration mismatch — render nothing until mounted.
  if (!t) return <div className={compact ? "h-8" : "h-20"} aria-hidden />;

  if (t.done) {
    return (
      <span className="font-display text-xl font-semibold text-[var(--color-rose)]">
        We&apos;re live! 🎉
      </span>
    );
  }

  const units = [
    { label: "Days", value: t.days },
    { label: "Hrs", value: t.hours },
    { label: "Min", value: t.minutes },
    { label: "Sec", value: t.seconds },
  ];

  return (
    <div className={`flex items-center ${compact ? "gap-2" : "gap-3"}`}>
      {units.map((u, i) => (
        <div key={u.label} className="flex items-center gap-3">
          <div
            className={`flex flex-col items-center justify-center rounded-2xl glass ${
              compact ? "h-12 w-12" : "h-16 w-16 md:h-20 md:w-20"
            }`}
          >
            <span
              className={`font-display font-semibold tabular-nums text-[var(--color-forest)] ${
                compact ? "text-lg" : "text-2xl md:text-3xl"
              }`}
            >
              {String(u.value).padStart(2, "0")}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-forest)]/55">
              {u.label}
            </span>
          </div>
          {i < units.length - 1 && !compact && (
            <span className="font-display text-2xl text-[var(--color-rose)]/50">:</span>
          )}
        </div>
      ))}
    </div>
  );
}
