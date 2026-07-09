import type { Product } from "@/lib/products";

/**
 * Procedurally renders a premium product visual (a glass cup with layered
 * yoghurt / parfait / juice) from a product's colour stops. Purely SVG so it
 * scales crisply and can be swapped later for real product photography.
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
  const isJuice = product.category === "Juice";
  const isSalad = product.category === "Salad";

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
          <stop offset="45%" stopColor="rgba(255,255,255,0.15)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.55)" />
        </linearGradient>
        <radialGradient id={`shadow-${id}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="rgba(18,60,27,0.35)" />
          <stop offset="100%" stopColor="rgba(18,60,27,0)" />
        </radialGradient>
      </defs>

      {/* ground shadow */}
      <ellipse cx="100" cy="222" rx="58" ry="12" fill={`url(#shadow-${id})`} />

      {/* cup body */}
      <path
        d="M52 70 L148 70 L138 210 Q136 220 126 220 L74 220 Q64 220 62 210 Z"
        fill="rgba(255,255,255,0.35)"
        stroke="rgba(255,255,255,0.7)"
        strokeWidth="1.5"
      />

      {/* content clipped to cup */}
      <clipPath id={`clip-${id}`}>
        <path d="M54 82 L146 82 L138 210 Q136 220 126 220 L74 220 Q64 220 62 210 Z" />
      </clipPath>
      <g clipPath={`url(#clip-${id})`}>
        <rect x="50" y="82" width="100" height="140" fill={`url(#fill-${id})`} />

        {/* parfait layers */}
        {product.category === "Parfait" && (
          <>
            <rect x="50" y="110" width="100" height="14" fill="#f4e3c1" opacity="0.9" />
            <rect x="50" y="150" width="100" height="14" fill="#ffffff" opacity="0.55" />
            <rect x="50" y="186" width="100" height="14" fill="#7a4a2b" opacity="0.55" />
          </>
        )}

        {/* juice bubbles */}
        {isJuice &&
          [...Array(6)].map((_, i) => (
            <circle
              key={i}
              cx={68 + (i % 3) * 30}
              cy={120 + Math.floor(i / 3) * 34}
              r={3 + (i % 3)}
              fill="rgba(255,255,255,0.55)"
            />
          ))}

        {/* salad flecks */}
        {isSalad &&
          [...Array(14)].map((_, i) => (
            <circle
              key={i}
              cx={62 + ((i * 37) % 76)}
              cy={100 + ((i * 53) % 110)}
              r={2.5 + (i % 3)}
              fill={i % 2 ? "#4e8a2b" : "#e64b4b"}
              opacity="0.85"
            />
          ))}
      </g>

      {/* glass highlight */}
      <path
        d="M52 70 L148 70 L138 210 Q136 220 126 220 L74 220 Q64 220 62 210 Z"
        fill={`url(#glass-${id})`}
        opacity="0.5"
      />
      <rect x="66" y="90" width="8" height="110" rx="4" fill="white" opacity="0.4" />

      {/* topping dome (yoghurt swirl) */}
      {!isJuice && !isSalad && (
        <path
          d="M56 72 Q70 52 100 54 Q130 52 144 72 Q120 66 100 68 Q80 66 56 72 Z"
          fill="#ffffff"
          opacity="0.92"
        />
      )}
      {(product.category === "Parfait") && (
        <circle cx="100" cy="52" r="8" fill={c3} />
      )}
    </svg>
  );
}
