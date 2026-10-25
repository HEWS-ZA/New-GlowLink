import React from "react";

export interface CosmeticIconProps {
  className?: string;
  style?: React.CSSProperties;
  size?: string | number;
}

/**
 * Custom Luxury Cosmetic SVG Icon Set for GlowLink
 * Uniform line aesthetic: Plum stroke (#501854 / #D4C7E1) with Hot Pink (#DB2777) accents.
 * Sized in em by default so they scale naturally with typography and align with font x-height.
 */

// 1. Sleek Angled Lipstick
export const LipstickIcon: React.FC<CosmeticIconProps> = ({ className = "", style }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`inline-block align-[-0.18em] transition-transform duration-300 hover:rotate-12 hover:scale-110 cursor-pointer ${className}`}
    style={{ width: "1.1em", height: "1.1em", ...style }}
    aria-hidden="true"
  >
    {/* Base tube */}
    <rect x="7" y="12" width="10" height="10" rx="1.5" className="stroke-[#501854] dark:stroke-[#D4C7E1]" />
    <line x1="7" y1="15" x2="17" y2="15" className="stroke-[#EFBDEB] dark:stroke-[#503E5E]" />
    {/* Inner collar */}
    <path d="M9 12V8.5H15V12" className="stroke-[#501854] dark:stroke-[#D4C7E1]" />
    {/* Lipstick bullet with angled tip and hot pink accent */}
    <path
      d="M9.5 8.5V4.2C9.5 3.8 9.9 3.3 10.4 3.1L14.5 5.2V8.5"
      className="stroke-[#DB2777] fill-[#DB2777]/15"
    />
  </svg>
);

// 2. Elegant Nail Polish Bottle
export const NailPolishIcon: React.FC<CosmeticIconProps> = ({ className = "", style }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`inline-block align-[-0.18em] transition-transform duration-300 hover:-rotate-12 hover:scale-110 cursor-pointer ${className}`}
    style={{ width: "1.1em", height: "1.1em", ...style }}
    aria-hidden="true"
  >
    {/* Bottle handle/cap */}
    <rect x="10" y="2.5" width="4" height="7.5" rx="1" className="stroke-[#501854] dark:stroke-[#D4C7E1]" />
    {/* Flacon body */}
    <path
      d="M6.5 10H17.5C18.3 10 19 10.7 19 11.5L18 20.5C18 21.3 17.3 22 16.5 22H7.5C6.7 22 6 21.3 6 20.5L5 11.5C5 10.7 5.7 10 6.5 10Z"
      className="stroke-[#501854] dark:stroke-[#D4C7E1]"
    />
    {/* Polish fill level with pink glow */}
    <path
      d="M6.3 14H17.7L17.2 20.5H6.8L6.3 14Z"
      className="stroke-[#DB2777] fill-[#DB2777]/20"
    />
  </svg>
);

// 3. Mascara Wand with fine bristles
export const MascaraWandIcon: React.FC<CosmeticIconProps> = ({ className = "", style }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`inline-block align-[-0.18em] transition-transform duration-300 hover:rotate-6 hover:scale-110 cursor-pointer ${className}`}
    style={{ width: "1.1em", height: "1.1em", ...style }}
    aria-hidden="true"
  >
    {/* Wand handle */}
    <path d="M4 20L9 15" className="stroke-[#501854] dark:stroke-[#D4C7E1]" strokeWidth="2.5" />
    {/* Stem */}
    <line x1="9" y1="15" x2="16" y2="8" className="stroke-[#501854] dark:stroke-[#D4C7E1]" />
    {/* Spiral spoolie head with pink bristles */}
    <line x1="14.5" y1="6.5" x2="17.5" y2="9.5" className="stroke-[#DB2777]" />
    <line x1="16.5" y1="4.5" x2="19.5" y2="7.5" className="stroke-[#DB2777]" />
    <line x1="18.5" y1="2.5" x2="21.5" y2="5.5" className="stroke-[#DB2777]" />
    {/* Wand core */}
    <line x1="15" y1="9" x2="20" y2="4" className="stroke-[#DB2777]" strokeWidth="2" />
  </svg>
);

// 4. Slender Angled Makeup Brush
export const MakeupBrushIcon: React.FC<CosmeticIconProps> = ({ className = "", style }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`inline-block align-[-0.18em] transition-transform duration-300 hover:rotate-12 hover:scale-110 cursor-pointer ${className}`}
    style={{ width: "1.1em", height: "1.1em", ...style }}
    aria-hidden="true"
  >
    {/* Brush handle */}
    <path d="M3.5 20.5L10 14" className="stroke-[#501854] dark:stroke-[#D4C7E1]" strokeWidth="2" />
    {/* Metallic ferrule */}
    <path d="M9.5 14.5L12 12L13.5 13.5L11 16L9.5 14.5Z" className="stroke-[#501854] dark:stroke-[#D4C7E1] fill-[#EFBDEB]/30" />
    {/* Fluffy angled bristles with pink blush tip */}
    <path
      d="M12.5 11.5C13.5 9 16 6 20.5 3.5C20 8 17 10.5 14.5 11.5"
      className="stroke-[#DB2777] fill-[#DB2777]/20"
    />
  </svg>
);

// 5. Clamshell Compact Mirror
export const CompactMirrorIcon: React.FC<CosmeticIconProps> = ({ className = "", style }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`inline-block align-[-0.18em] transition-transform duration-300 hover:-rotate-12 hover:scale-110 cursor-pointer ${className}`}
    style={{ width: "1.1em", height: "1.1em", ...style }}
    aria-hidden="true"
  >
    {/* Upper mirror lid tilted back */}
    <ellipse cx="12" cy="7.5" rx="7.5" ry="3.5" className="stroke-[#501854] dark:stroke-[#D4C7E1]" />
    <path d="M9 7.5L15 7.5" className="stroke-[#EFBDEB] dark:stroke-[#3B3237]" strokeDasharray="1.5 2" />
    {/* Hinge */}
    <line x1="10.5" y1="11" x2="13.5" y2="11" className="stroke-[#501854] dark:stroke-[#D4C7E1]" strokeWidth="2" />
    {/* Lower powder base */}
    <ellipse cx="12" cy="16.5" rx="8" ry="4.5" className="stroke-[#501854] dark:stroke-[#D4C7E1]" />
    {/* Pressed blush pan */}
    <ellipse cx="12" cy="16.5" rx="5.5" ry="2.8" className="stroke-[#DB2777] fill-[#DB2777]/20" />
  </svg>
);

// 6. Luxury Perfume Flacon
export const PerfumeBottleIcon: React.FC<CosmeticIconProps> = ({ className = "", style }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`inline-block align-[-0.18em] transition-transform duration-300 hover:rotate-6 hover:scale-110 cursor-pointer ${className}`}
    style={{ width: "1.1em", height: "1.1em", ...style }}
    aria-hidden="true"
  >
    {/* Spray nozzle / stopper */}
    <rect x="10.5" y="2" width="3" height="3" rx="0.5" className="stroke-[#501854] dark:stroke-[#D4C7E1]" />
    <rect x="9" y="5" width="6" height="2.5" rx="0.5" className="stroke-[#501854] dark:stroke-[#D4C7E1]" />
    {/* Faceted glass bottle */}
    <path
      d="M7 7.5H17L19.5 11L18 21.5C18 22 17.5 22.5 17 22.5H7C6.5 22.5 6 22 6 21.5L4.5 11L7 7.5Z"
      className="stroke-[#501854] dark:stroke-[#D4C7E1]"
    />
    {/* Perfume essence core & label */}
    <circle cx="12" cy="15" r="3" className="stroke-[#DB2777] fill-[#DB2777]/15" />
    {/* Subtle fine mist spray droplet */}
    <circle cx="16" cy="3.5" r="0.75" className="fill-[#DB2777] stroke-none" />
  </svg>
);

// 7. Hair Stylist Comb & Shears
export const CombScissorsIcon: React.FC<CosmeticIconProps> = ({ className = "", style }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`inline-block align-[-0.18em] transition-transform duration-300 hover:rotate-12 hover:scale-110 cursor-pointer ${className}`}
    style={{ width: "1.1em", height: "1.1em", ...style }}
    aria-hidden="true"
  >
    {/* Scissors blade 1 */}
    <line x1="5.5" y1="4" x2="14" y2="15.5" className="stroke-[#501854] dark:stroke-[#D4C7E1]" />
    {/* Scissors blade 2 */}
    <line x1="12" y1="4" x2="6.5" y2="15.5" className="stroke-[#501854] dark:stroke-[#D4C7E1]" />
    {/* Finger rings */}
    <circle cx="5" cy="18" r="2.2" className="stroke-[#DB2777]" />
    <circle cx="14" cy="18" r="2.2" className="stroke-[#501854] dark:stroke-[#D4C7E1]" />
    {/* Comb teeth line */}
    <path d="M16 6V13M18 7V13M20 8V13M22 9V13" className="stroke-[#DB2777]" />
    <line x1="15" y1="13" x2="22.5" y2="13" className="stroke-[#501854] dark:stroke-[#D4C7E1]" strokeWidth="2" />
  </svg>
);

// 8. 4-point Radiant Sparkle
export const SparkleIcon: React.FC<CosmeticIconProps> = ({ className = "", style }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`inline-block align-[-0.18em] transition-transform duration-500 hover:rotate-45 hover:scale-125 cursor-pointer ${className}`}
    style={{ width: "1.05em", height: "1.05em", ...style }}
    aria-hidden="true"
  >
    <path
      d="M12 2C12 7.5 16.5 12 22 12C16.5 12 12 16.5 12 22C12 16.5 7.5 12 2 12C7.5 12 12 7.5 12 2Z"
      className="stroke-[#DB2777] fill-[#DB2777]/25"
    />
  </svg>
);
