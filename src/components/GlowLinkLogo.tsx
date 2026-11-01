import React from "react";

export interface GlowLinkLogoProps {
  /** Variant of the logo to render */
  variant?: "full" | "mark" | "stacked";
  /** Size preset */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Optional badge text next to the brand name (e.g. "Atelier", "Console", "Client") */
  badgeText?: string;
  /** Custom extra classes for root wrapper */
  className?: string;
  /** Whether to animate sparkle on hover */
  animated?: boolean;
}

const sizeMap = {
  xs: { mark: 22, text: "text-sm", badge: "text-[8px]" },
  sm: { mark: 28, text: "text-base sm:text-lg", badge: "text-[9px]" },
  md: { mark: 36, text: "text-lg sm:text-xl md:text-2xl", badge: "text-[10px]" },
  lg: { mark: 48, text: "text-2xl sm:text-3xl", badge: "text-[11px]" },
  xl: { mark: 64, text: "text-3xl sm:text-4xl md:text-5xl", badge: "text-xs" },
};

/**
 * GlowLink luxury atelier emblem vector mark
 * Interlocking G & L Mobius loops with radiant starlight gem facet
 */
export const GlowLinkMark: React.FC<{ size?: number; className?: string }> = ({
  size = 32,
  className = "",
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-300 ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="gl-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#3D1244" />
          <stop offset="50%" stop-color="#501854" />
          <stop offset="100%" stop-color="#210826" />
        </linearGradient>
        <linearGradient id="gl-pink" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FDF2F8" />
          <stop offset="35%" stop-color="#F472B6" />
          <stop offset="75%" stop-color="#DB2777" />
          <stop offset="100%" stop-color="#9D174D" />
        </linearGradient>
        <linearGradient id="gl-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFFBEB" />
          <stop offset="40%" stop-color="#FDE68A" />
          <stop offset="75%" stop-color="#F59E0B" />
          <stop offset="100%" stop-color="#D97706" />
        </linearGradient>
        <filter id="gl-glow" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Velvet Plum Medallion Base with Lilac Accent Border */}
      <rect
        x="2"
        y="2"
        width="60"
        height="60"
        rx="16"
        fill="url(#gl-bg)"
        stroke="#EFBDEB"
        strokeWidth="1.2"
        strokeOpacity="0.55"
      />

      {/* Ambient Pink Halo */}
      <circle cx="32" cy="32" r="18" fill="#DB2777" opacity="0.25" filter="url(#gl-glow)" />

      {/* Interlocking G & L Luxury Atelier Link */}
      {/* Left Loop: Stylized 'G' */}
      <path
        d="M 28 19 A 13 13 0 1 0 35 41 L 35 34 L 28 34"
        fill="none"
        stroke="url(#gl-pink)"
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Right Loop: Stylized 'L' & Infinity Link */}
      <path
        d="M 35 21 A 13 13 0 1 1 29 42"
        fill="none"
        stroke="url(#gl-gold)"
        strokeWidth="3.8"
        strokeLinecap="round"
      />

      {/* Center Radiating Starlight Diamond */}
      <g transform="translate(32, 32)">
        <path
          d="M 0 -7.5 Q 0 0 7.5 0 Q 0 0 0 7.5 Q 0 0 -7.5 0 Q 0 0 0 -7.5 Z"
          fill="#FFFFFF"
          filter="url(#gl-glow)"
        />
        <path
          d="M 0 -4.5 Q 0 0 4.5 0 Q 0 0 0 4.5 Q 0 0 -4.5 0 Q 0 0 0 -4.5 Z"
          fill="url(#gl-gold)"
        />
        <circle cx="0" cy="0" r="1.6" fill="#FFFFFF" />
      </g>
    </svg>
  );
};

export const GlowLinkLogo: React.FC<GlowLinkLogoProps> = ({
  variant = "full",
  size = "md",
  badgeText,
  className = "",
  animated = true,
}) => {
  const currentSize = sizeMap[size];

  if (variant === "mark") {
    return (
      <div className={`inline-flex items-center justify-center shrink-0 ${className}`}>
        <GlowLinkMark
          size={currentSize.mark}
          className={animated ? "group-hover:scale-105" : ""}
        />
      </div>
    );
  }

  if (variant === "stacked") {
    return (
      <div className={`flex flex-col items-center text-center gap-2 ${className}`}>
        <GlowLinkMark
          size={currentSize.mark * 1.3}
          className={animated ? "group-hover:scale-105" : ""}
        />
        <div className="flex flex-col items-center">
          <span
            className={`font-serif italic tracking-tight text-[#501854] dark:text-[#D4C7E1] font-medium leading-none ${currentSize.text}`}
          >
            GlowLink
          </span>
          <span
            className={`text-[9px] uppercase tracking-[0.25em] text-[#8C3B8A] dark:text-[#A695B8] font-semibold mt-1`}
          >
            {badgeText || "South Africa Atelier"}
          </span>
        </div>
      </div>
    );
  }

  // Full horizontal variant (Default)
  return (
    <div className={`flex items-center gap-2 group shrink-0 ${className}`}>
      <GlowLinkMark
        size={currentSize.mark}
        className={animated ? "group-hover:scale-105 group-hover:rotate-1" : ""}
      />
      <div className="flex items-baseline gap-1.5">
        <span
          className={`font-serif italic tracking-tight text-[#501854] dark:text-[#D4C7E1] font-medium ${currentSize.text}`}
        >
          GlowLink
        </span>
        {badgeText && (
          <span
            className={`hidden xs:inline-block uppercase tracking-[0.2em] px-2 py-0.5 rounded-full bg-[#FAF2FA] dark:bg-[#372E3E] text-[#501854] dark:text-[#D4C7E1] font-semibold border border-[#EFBDEB] dark:border-[#3B3237] ${currentSize.badge}`}
          >
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
};

export default GlowLinkLogo;
