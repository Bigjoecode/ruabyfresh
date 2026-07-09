"use client";

import { motion, useReducedMotion } from "motion/react";
import { useMemo } from "react";

/**
 * A "poured yoghurt" liquid band that hangs from the top of the hero with
 * dripping tongues, plus falling droplets in the brand colours. Gives the
 * hero its cinematic "fresh vibes dripping" feel. Pure SVG/CSS so it always
 * renders, independent of product photos.
 */
export default function FreshDrip() {
  const reduce = useReducedMotion();

  const path = useMemo(() => buildDrip(), []);

  const droplets = useMemo(
    () =>
      [
        { x: "12%", delay: 0, color: "#8bc63f", size: 12 },
        { x: "26%", delay: 1.6, color: "#e85d9a", size: 9 },
        { x: "41%", delay: 0.8, color: "#f6ecd6", size: 14 },
        { x: "57%", delay: 2.3, color: "#8bc63f", size: 10 },
        { x: "68%", delay: 1.1, color: "#e85d9a", size: 12 },
        { x: "82%", delay: 3, color: "#ffe08a", size: 9 },
        { x: "91%", delay: 0.4, color: "#f7b8d4", size: 11 },
      ] as const,
    []
  );

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[42vh] overflow-hidden"
      aria-hidden
    >
      <svg
        viewBox="0 0 1440 420"
        preserveAspectRatio="none"
        className="h-full w-full"
      >
        <defs>
          <linearGradient id="dripGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fdfaf1" />
            <stop offset="55%" stopColor="#fbf3e3" />
            <stop offset="100%" stopColor="#f6ead2" />
          </linearGradient>
          <linearGradient id="dripSheen" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8bc63f" stopOpacity="0.18" />
            <stop offset="50%" stopColor="#e85d9a" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#8bc63f" stopOpacity="0.18" />
          </linearGradient>
        </defs>

        <motion.path
          d={path}
          fill="url(#dripGrad)"
          initial={false}
          animate={reduce ? undefined : { d: [path, buildDrip(1.12), path] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d={path}
          fill="url(#dripSheen)"
          initial={false}
          animate={reduce ? undefined : { d: [path, buildDrip(1.12), path] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>

      {/* falling droplets */}
      {!reduce &&
        droplets.map((d, i) => (
          <motion.span
            key={i}
            className="absolute top-[26%] rounded-full"
            style={{
              left: d.x,
              width: d.size,
              height: d.size * 1.25,
              background: d.color,
              borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
              filter: "drop-shadow(0 4px 6px rgba(18,60,27,0.15))",
            }}
            initial={{ y: -10, opacity: 0, scaleY: 0.8 }}
            animate={{ y: ["0vh", "60vh"], opacity: [0, 1, 1, 0], scaleY: [0.8, 1.15, 1] }}
            transition={{
              duration: 4.5,
              delay: d.delay,
              repeat: Infinity,
              repeatDelay: 2.2,
              ease: "easeIn",
            }}
          />
        ))}
    </div>
  );
}

/** Builds a drip edge path. `stretch` scales how far each drip hangs. */
function buildDrip(stretch = 1) {
  const width = 1440;
  const base = 120;
  const drips = [
    { c: 1360, w: 34, d: 70 },
    { c: 1220, w: 26, d: 42 },
    { c: 1080, w: 42, d: 108 },
    { c: 940, w: 24, d: 36 },
    { c: 800, w: 36, d: 132 },
    { c: 660, w: 30, d: 58 },
    { c: 520, w: 34, d: 88 },
    { c: 380, w: 26, d: 40 },
    { c: 235, w: 40, d: 112 },
    { c: 95, w: 28, d: 64 },
  ];
  let d = `M0,0 H${width} V${base} `;
  for (const drip of drips) {
    const depth = base + drip.d * stretch;
    const left = drip.c + drip.w;
    const right = drip.c - drip.w;
    d += `C${left - 6},${base} ${left},${depth} ${drip.c},${depth} `;
    d += `C${right},${depth} ${right + 6},${base} ${right},${base} `;
  }
  d += `H0 Z`;
  return d;
}
