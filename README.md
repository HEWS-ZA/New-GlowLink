# GlowLink — South Africa's Premier Luxury Beauty Atelier Platform

[![React](https://img.shields.io/badge/React-19.0.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Anime.js](https://img.shields.io/badge/Anime.js-v4_%2F_v5--beta-FF4B4B)](https://animejs.com/)

**GlowLink** is South Africa's premier curated marketplace connecting discerning clients with verified master hairstylists, celebrity makeup artists, nail couture architects, and aesthetic wellness specialists for bespoke salon sessions and luxury mobile house calls across Johannesburg, Cape Town, Durban, and Pretoria.

---

## Key Highlights

- **Bespoke Visual Craftsmanship**: Liquid glass pill navigation, ultra-fine lilac borders (`#EFBDEB`), deep plum anchors (`#501854`), and electric hot-pink accents (`#DB2777`).
- **Dual-Theme Engine**: Seamless toggling between an ethereal Light Plum palette and an opulent Obsidian Violet Dark theme (`#17111D` / `#241C2B`), saved to local storage with zero-flicker mounting.
- **Anime.js v4 Cinematic Hero**:
  - Word-level text splitting (`splitText`) rising from masked containers with blur-to-sharp easing.
  - Bespoke inline SVG cosmetic tools that draw themselves dynamically using `createDrawable()`.
  - Ambient mouse parallax with layered depth physics on desktop.
  - Ken Burns slow photo zoom and continuous shimmer sweep across the italicized word *"connects"*.
  - Live numerical counters animating to verified ratings (`4.98` and `4,200+ clients`).
  - Typewriter placeholder cycling through signature services (`Bridal makeup`, `Locs & braids`, `Balayage`, `Nail couture`).
- **Infinite Brand Marquee**: Continuous right-to-left flowing banner of the bold system identity `"GLOWLINK"` rendered in `#db2979`.
- **Mobile-First & Haptic-Enabled**: Native Web Vibration API haptics for touch feedback on supported devices, safe-area inset preservation, and iOS Safari input zoom guards.

---

## Tech Stack

| Domain | Technology |
| :--- | :--- |
| **Framework** | React 19 (Hooks, Suspense, StrictMode resilience) |
| **Language** | TypeScript 5.8 (Strict Mode) |
| **Styling** | Tailwind CSS v4 (`@tailwindcss/vite`, `@theme` token definitions) |
| **Animation Engine** | Anime.js v4 / v5-beta (`animejs@5.0.0-beta.2`) |
| **Iconography** | Lucide React + Bespoke Hand-Drawn SVG Suite (`/src/components/CosmeticIcons.tsx`) |
| **Routing** | React Router DOM v7 (`react-router-dom`) |
| **Tactile Engine** | Native Web Vibration API (`/src/services/haptics.ts`) |
| **Build Tool** | Vite 6 / 8 with Hot Module Replacement |

---

## Quickstart

### Prerequisites
- Node.js 20+ installed
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/glowlink.git
cd glowlink

# Install dependencies
npm install
```

### Development Server
```bash
# Starts Vite development server at http://localhost:3000
npm run dev
```

### Static Type Checking & Linting
```bash
# Validates TypeScript types across the entire project
npm run lint
```

### Production Build
```bash
# Builds optimized static bundle to /dist
npm run build

# Preview production build locally
npm run preview
```

---

## Project Structure

```
├── AGENTS.md                  # Autonomous agent instructions & rules
├── ARCHITECTURE.md            # System design & structural documentation
├── CODE_STYLE.md              # Code conventions & formatting standards
├── DESIGN_SYSTEM.md           # Tokens, typography, iconography & visual rules
├── SECURITY.md                # Security policies, threat model & XSS prevention
├── TESTING.md                 # Test strategy, motion verification & QA guide
├── README.md                  # Project overview (this file)
├── index.html                 # HTML5 entry point
├── metadata.json              # Platform metadata
├── package.json               # Dependencies & scripts
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite configuration
│
└── src/
    ├── components/            # Reusable UI components & bespoke SVGs
    │   ├── CosmeticIcons.tsx  # Bespoke luxury inline cosmetic vector suite
    │   ├── Header.tsx         # Liquid glass pill navigation
    │   ├── Footer.tsx         # Editorial atelier footer
    │   ├── MobileBottomNav.tsx# Mobile quick-action dock
    │   └── ThemeToggle.tsx    # Light/Dark mode switch
    ├── context/               # React Context (ThemeContext)
    ├── hooks/                 # Custom hooks (useHeroAnimation.ts)
    ├── pages/                 # Route views (Home, Search, Profile, Dashboard, etc.)
    └── services/              # Data stores (Artisans, Bookings, Auth, Haptics)
```

---

## Tunable Animation Constants

All speeds, parallax multipliers, and typewriter intervals can be tuned in `/src/hooks/useHeroAnimation.ts`:

```typescript
export const HERO_ANIMATION_CONFIG = {
  // Timeline durations (ms)
  introNavDuration: 750,
  wordRiseDuration: 800,
  wordStagger: 70,
  cardRevealDuration: 950,
  counterDuration: 1300,

  // Ambient & Parallax
  kenBurnsDuration: 14000,
  kenBurnsScale: 1.07,
  parallaxCardStrength: 14,
  parallaxIconStrengthMultiplier: 32,
  parallaxSmoothing: 0.08,

  // Typewriter
  typewriterServices: [
    "Bridal makeup",
    "Locs & braids",
    "Balayage",
    "Nail couture"
  ],
  typewriterTypeSpeed: 75,
  typewriterPauseDuration: 2200,
};
```

---

## Documentation Index

Explore our comprehensive technical and design guides:

- [**AGENTS.md**](./AGENTS.md) — Operating manual and invariant rules for automated AI developer agents.
- [**DESIGN_SYSTEM.md**](./DESIGN_SYSTEM.md) — Color palette tokens, typography, liquid glass components, and bespoke icons.
- [**ARCHITECTURE.md**](./ARCHITECTURE.md) — System topology, React 19 lifecycle management, state stores, and haptics.
- [**SECURITY.md**](./SECURITY.md) — Threat model, input sanitization, XSS protection, and secrets hygiene.
- [**CODE_STYLE.md**](./CODE_STYLE.md) — TypeScript conventions, Anime.js v4 style guide, and Tailwind CSS rules.
- [**TESTING.md**](./TESTING.md) — Quality assurance procedures, reduced-motion tests, and user journeys.

---

## South African Atelier Coverage

GlowLink currently connects verified master stylists across four major metropolitan hubs:
- **Johannesburg**: Sandton, Rosebank, Melrose Arch, Hyde Park
- **Cape Town**: Camps Bay, V&A Waterfront, Constantia, Kloof Street
- **Durban**: Umhlanga Rocks, Ballito, Morningside
- **Pretoria**: Menlyn Maine, Brooklyn, Waterkloof

---

---

## Vercel Deployment

GlowLink is configured for zero-config, production-grade deployment on Vercel:

### 1. Deploy via Vercel Git Integration (Recommended)
1. Push this repository to GitHub, GitLab, or Bitbucket.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Vercel automatically detects the **Vite** framework from `vercel.json`.
4. Build command: `npm run build`
5. Output directory: `dist`
6. Click **Deploy**.

### 2. Deploy via Vercel CLI
```bash
# Install Vercel CLI globally
npm install -g vercel

# Log in and deploy
vercel

# Deploy to production
vercel --prod
```

### Included Vercel Optimizations (`vercel.json`)
- **SPA Rewrites**: All deep routes (`/search`, `/artisan/:id`, `/portal`, `/booking/:id`) seamlessly resolve to `/index.html` preventing 404s on hard refresh.
- **Immutable Asset Caching**: 1-year cache headers (`Cache-Control: public, max-age=31536000, immutable`) for hashed `/assets/*` bundles.
- **Security Headers**: `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, and `X-XSS-Protection`.

---

## License

Private & Proprietary — GlowLink South Africa © 2026. All rights reserved.
