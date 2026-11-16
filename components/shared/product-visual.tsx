import { cn } from "@/lib/utils/cn";
import type { ProductVisual as ProductVisualVariant } from "@/lib/data/catalog";

type ProductVisualProps = {
  variant: ProductVisualVariant;
  className?: string;
};

/**
 * Brand-styled schematic artwork used as a local, dependency-free product
 * placeholder. Real product photography will replace these through the admin
 * media manager in a later phase.
 */
export function ProductVisual({ variant, className }: ProductVisualProps) {
  const common = {
    stroke: "#142d4e",
    strokeWidth: 3,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <svg
      viewBox="0 0 320 260"
      fill="none"
      className={cn("h-full w-full", className)}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={`glow-${variant}`} cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#f28c28" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#f28c28" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`panel-${variant}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#eef3f9" />
        </linearGradient>
      </defs>

      <circle cx="160" cy="126" r="106" fill={`url(#glow-${variant})`} />

      {variant === "boiler" ? (
        <g>
          <ellipse cx="160" cy="232" rx="78" ry="10" fill="#142d4e" opacity="0.07" />
          <rect x="128" y="14" width="24" height="26" rx="5" {...common} />
          <rect
            x="88"
            y="38"
            width="144"
            height="176"
            rx="18"
            fill={`url(#panel-${variant})`}
            {...common}
          />
          <rect x="106" y="56" width="108" height="46" rx="9" fill="#f1f5fa" stroke="#c2d3e6" strokeWidth="2" />
          <rect x="118" y="70" width="48" height="18" rx="4" fill="#142d4e" />
          <path d="M126 79h10M141 79h14" stroke="#f28c28" strokeWidth="3" strokeLinecap="round" />
          <circle cx="192" cy="79" r="9" stroke="#f28c28" strokeWidth="3" fill="#fff6ec" />
          <path d="M192 73v6" stroke="#f28c28" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="110" y="120" width="100" height="62" rx="12" fill="#fff6ec" stroke="#f28c28" strokeWidth="3" />
          <path
            d="M160 133c9 10 15 16 15 24a15 15 0 0 1-30 0c0-8 6-14 15-24Z"
            fill="#f28c28"
            opacity="0.9"
          />
          <path d="M160 148c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11Z" fill="#fff6ec" />
          <path d="M108 196h104" stroke="#c2d3e6" strokeWidth="3" strokeLinecap="round" />
          <rect x="112" y="212" width="16" height="24" rx="4" {...common} />
          <rect x="148" y="212" width="16" height="24" rx="4" {...common} />
          <rect x="184" y="212" width="16" height="24" rx="4" {...common} />
          <circle cx="104" cy="120" r="3.5" fill="#f28c28" />
        </g>
      ) : null}

      {variant === "radiator" ? (
        <g>
          <ellipse cx="160" cy="234" rx="84" ry="10" fill="#142d4e" opacity="0.07" />
          <rect x="56" y="58" width="208" height="12" rx="6" fill="#dfe8f3" {...common} />
          <rect x="56" y="204" width="208" height="12" rx="6" fill="#dfe8f3" {...common} />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
            <rect
              key={index}
              x={72 + index * 24}
              y="66"
              width="14"
              height="146"
              rx="7"
              fill="#ffffff"
              stroke="#142d4e"
              strokeWidth="2.6"
            />
          ))}
          <path d="M72 178h160" stroke="#f28c28" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
          <circle cx="60" cy="64" r="9" fill="#fff6ec" stroke="#f28c28" strokeWidth="3" />
          <path d="M60 52v6" stroke="#f28c28" strokeWidth="3" strokeLinecap="round" />
          <rect x="86" y="220" width="10" height="14" rx="3" {...common} strokeWidth="2.6" />
          <rect x="224" y="220" width="10" height="14" rx="3" {...common} strokeWidth="2.6" />
        </g>
      ) : null}

      {variant === "parts" ? (
        <g>
          <ellipse cx="160" cy="232" rx="70" ry="9" fill="#142d4e" opacity="0.07" />
          <circle cx="160" cy="96" r="40" fill="#fff6ec" stroke="#f28c28" strokeWidth="3.5" />
          <circle cx="160" cy="96" r="16" fill="#ffffff" stroke="#142d4e" strokeWidth="3" />
          <path
            d="M160 56v24M160 112v24M120 96h24M176 96h24M132 68l17 17M171 107l17 17M188 68l-17 17M149 107l-17 17"
            stroke="#142d4e"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <rect x="150" y="132" width="20" height="34" rx="5" fill="#dfe8f3" {...common} />
          <path
            d="M132 176h56l10 18h-76l10-18Z"
            fill={`url(#panel-${variant})`}
            {...common}
          />
          <rect x="146" y="194" width="28" height="30" rx="6" {...common} />
          <rect x="46" y="188" width="52" height="10" rx="5" fill="#dfe8f3" {...common} />
          <rect x="222" y="188" width="52" height="10" rx="5" fill="#dfe8f3" {...common} />
          <circle cx="74" cy="193" r="4" fill="#f28c28" />
          <circle cx="246" cy="193" r="4" fill="#f28c28" />
        </g>
      ) : null}

      {variant === "installation" ? (
        <g>
          <ellipse cx="160" cy="232" rx="76" ry="9" fill="#142d4e" opacity="0.07" />
          <path
            d="M62 150h96c18 0 26 8 26 26v34"
            stroke="#dfe8f3"
            strokeWidth="20"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M62 150h96c18 0 26 8 26 26v34"
            stroke="#142d4e"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          <rect x="50" y="136" width="16" height="28" rx="5" fill="#f28c28" stroke="#d9781a" strokeWidth="2.5" />
          <rect x="168" y="212" width="40" height="16" rx="6" fill="#f28c28" stroke="#d9781a" strokeWidth="2.5" />
          <rect x="98" y="132" width="12" height="36" rx="4" fill="#ffffff" stroke="#142d4e" strokeWidth="2.6" />
          <rect x="126" y="132" width="12" height="36" rx="4" fill="#ffffff" stroke="#142d4e" strokeWidth="2.6" />
          <circle cx="238" cy="92" r="26" fill="#ffffff" stroke="#142d4e" strokeWidth="3" />
          <circle cx="238" cy="92" r="10" fill="#f1f5fa" stroke="#f28c28" strokeWidth="3" />
          <path d="M238 58v10M238 116v10M204 92h10M262 92h10" stroke="#142d4e" strokeWidth="3" strokeLinecap="round" />
          <path d="M84 96h30M84 110h18" stroke="#c2d3e6" strokeWidth="4" strokeLinecap="round" />
        </g>
      ) : null}
    </svg>
  );
}
