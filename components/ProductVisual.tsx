import type { Product } from "@/lib/products";

/**
 * Procedurally renders a premium product visual from a product's colour stops.
 * Yoghurt drinks render as a 500ml bottle; parfaits render as a layered cup.
 * Pure SVG — used as the fallback when a real photo isn't available yet.
 */
export default function ProductVisual({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  const [c1, c2, c3] = product.colors;
  const id = product.id;
  const isBottle = product.category === "Yoghurt";

  return (
    <svg
      viewBox="0 0 200 240"
      className={className}
      role="img"
      aria-label={`${product.name} ${product.size}`}
    >
      <defs>
        <linearGradient id={`fill-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c1} />
          <stop offset="55%" stopColor={c2} />
          <stop offset="100%" stopColor={c3} />
        </linearGradient>
        <linearGradient id={`glass-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
          <stop offset="45%" stopColor="rgba(255,255,255,0.12)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.5)" />
        </linearGradient>
        <radialGradient id={`shadow-${id}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="rgba(18,60,27,0.32)" />
          <stop offset="100%" stopColor="rgba(18,60,27,0)" />
        </radialGradient>
      </defs>

      <ellipse cx="100" cy="224" rx="52" ry="11" fill={`url(#shadow-${id})`} />

      {isBottle ? (
        /* ---------- 500ml yoghurt bottle ---------- */
        <>
          {/* cap */}
          <rect x="82" y="16" width="36" height="20" rx="4" fill="#182611" />
          <rect x="84" y="34" width="32" height="8" fill="#20331a" />
          {/* neck */}
          <rect x="88" y="42" width="24" height="12" fill="rgba(255,255,255,0.4)" />

          {/* body */}
          <clipPath id={`clip-${id}`}>
            <path d="M88 54 L112 54 Q136 66 136 100 L136 200 Q136 216 120 216 L80 216 Q64 216 64 200 L64 100 Q64 66 88 54 Z" />
          </clipPath>
          <path
            d="M88 54 L112 54 Q136 66 136 100 L136 200 Q136 216 120 216 L80 216 Q64 216 64 200 L64 100 Q64 66 88 54 Z"
            fill={`url(#fill-${id})`}
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="1.5"
          />
          {/* label */}
          <g clipPath={`url(#clip-${id})`}>
            <rect x="60" y="120" width="80" height="66" fill="#fffdf7" opacity="0.94" />
            <rect x="60" y="120" width="80" height="8" fill={c3} opacity="0.5" />
          </g>
          {/* glass highlight */}
          <path
            d="M88 54 L112 54 Q136 66 136 100 L136 200 Q136 216 120 216 L80 216 Q64 216 64 200 L64 100 Q64 66 88 54 Z"
            fill={`url(#glass-${id})`}
            opacity="0.45"
          />
          <rect x="74" y="70" width="7" height="130" rx="3.5" fill="white" opacity="0.4" />
        </>
      ) : (
        /* ---------- parfait cup ---------- */
        <>
          <path
            d="M52 68 L148 68 L138 208 Q136 218 126 218 L74 218 Q64 218 62 208 Z"
            fill="rgba(255,255,255,0.35)"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="1.5"
          />
          <clipPath id={`clip-${id}`}>
            <path d="M54 80 L146 80 L138 208 Q136 218 126 218 L74 218 Q64 218 62 208 Z" />
          </clipPath>
          <g clipPath={`url(#clip-${id})`}>
            <rect x="50" y="80" width="100" height="140" fill={`url(#fill-${id})`} />
            {/* layered parfait */}
            <rect x="50" y="106" width="100" height="14" fill="#f4e3c1" opacity="0.95" />
            <rect x="50" y="148" width="100" height="14" fill="#ffffff" opacity="0.6" />
            <rect x="50" y="184" width="100" height="16" fill="#7a4a2b" opacity="0.6" />
          </g>
          <path
            d="M52 68 L148 68 L138 208 Q136 218 126 218 L74 218 Q64 218 62 208 Z"
            fill={`url(#glass-${id})`}
            opacity="0.5"
          />
          <rect x="66" y="88" width="8" height="112" rx="4" fill="white" opacity="0.4" />
          {/* granola + fruit dome */}
          <path
            d="M54 70 Q70 48 100 50 Q130 48 146 70 Q120 62 100 64 Q80 62 54 70 Z"
            fill="#c98a4a"
            opacity="0.92"
          />
          <circle cx="84" cy="60" r="7" fill={c3} />
          <circle cx="112" cy="58" r="6" fill={c2} />
          <circle cx="100" cy="64" r="5" fill="#6d4aa0" />
        </>
      )}
    </svg>
  );
}
