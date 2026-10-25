# ARCHITECTURE.md — GlowLink Technical Architecture

## 1. System Overview

**GlowLink** is an enterprise-grade client-side application built with modern web standards to deliver ultra-fast, mobile-first luxury commerce experiences. The architecture is engineered around high render performance (60fps animation loops), clean separation of concerns, zero-layout-shift motion design, and resilient state synchronization.

```
+---------------------------------------------------------------------------------+
|                                 CLIENT BROWSER                                  |
|                                                                                 |
|  +---------------------------------------------------------------------------+  |
|  |                            React 19 Application                           |  |
|  |                                                                           |  |
|  |  +-------------------+  +--------------------+  +----------------------+  |  |
|  |  |   React Router    |  |   Theme Context    |  |    Haptics Engine    |  |  |
|  |  |      (v7 SPA)     |  |   (Light / Dark)   |  | (Web Vibration API) |  |  |
|  |  +---------+---------+  +---------+----------+  +----------+-----------+  |  |
|  |            |                      |                        |              |  |
|  |            v                      v                        v              |  |
|  |  +---------------------------------------------------------------------+  |  |
|  |  |                         Page Layer (/src/pages)                     |  |  |
|  |  |   Home | Search | Profile | Dashboard | Pricing | HowItWorks | Auth |  |  |
|  |  +----------------------------------+----------------------------------+  |  |
|  |                                     |                                     |  |
|  |                                     v                                     |  |
|  |  +---------------------------------------------------------------------+  |  |
|  |  |                     Component Layer (/src/components)               |  |  |
|  |  |   GlassPillNav | SearchBar | CosmeticIcons | ArtistCard | Badges   |  |  |
|  |  +----------------------------------+----------------------------------+  |  |
|  |                                     |                                     |  |
|  |            +------------------------+------------------------+            |  |
|  |            v                                                 v            |  |
|  |  +------------------------------------+    +---------------------------+  |  |
|  |  |     Animation Engine (Anime.js v4) |    |  State Stores (/services) |  |  |
|  |  |   createScope | Timelines | Hooks  |    |  Artisans | Bookings|Auth |  |  |
|  |  +------------------------------------+    +---------------------------+  |  |
|  +---------------------------------------------------------------------------+  |
+---------------------------------------------------------------------------------+
                                         |
                                         v
+---------------------------------------------------------------------------------+
|                       VITE BUNDLER & DEV/PROD RUNTIME                           |
|      Vite 6 / 8 Core  •  Tailwind CSS v4 Engine  •  Node/Express Proxy          |
+---------------------------------------------------------------------------------+
```

---

## 2. Directory Structure

```
/
├── AGENTS.md                  # Autonomous agent instructions & rules
├── ARCHITECTURE.md            # System design & structural documentation (this file)
├── CODE_STYLE.md              # Code conventions & formatting standards
├── DESIGN_SYSTEM.md           # Tokens, typography, iconography & visual rules
├── SECURITY.md                # Security policies, threat model & XSS prevention
├── TESTING.md                 # Test strategy, motion verification & QA guide
├── README.md                  # Project overview, quickstart & scripts
├── index.html                 # HTML5 entry point & viewport meta
├── metadata.json              # Platform capabilities & applet configuration
├── package.json               # Dependencies & build scripts
├── tsconfig.json              # TypeScript 5.8 compiler configuration
├── vite.config.ts             # Vite bundler, Tailwind v4 plugin, React setup
│
├── public/                    # Static assets & media
│   └── assets/aistudio/       # Curated editorial photography & branding images
│
└── src/
    ├── main.tsx               # React root mount (`createRoot`)
    ├── App.tsx                # App root with ThemeProvider, Router & Layout
    ├── index.css              # Global styles, Tailwind v4 `@theme`, CSS variables
    ├── glowlink.css           # Luxury styling, liquid glass rules, marquee keyframes
    │
    ├── components/            # Reusable UI components
    │   ├── CosmeticIcons.tsx  # Bespoke luxury inline SVG cosmetics suite
    │   ├── Header.tsx         # Floating glass navigation pill
    │   ├── Footer.tsx         # Atelier footer with South Africa regional tags
    │   ├── MobileBottomNav.tsx# iOS fixed bottom quick-action bar
    │   ├── PWAInstallButton.tsx# Progressive Web App install trigger
    │   ├── ScrollToTop.tsx    # Route change window position reset
    │   ├── ThemeToggle.tsx    # Light/Dark mode switcher pill
    │   └── ui/                # Base primitives (buttons, badges, inputs)
    │
    ├── context/               # React Context providers
    │   └── ThemeContext.tsx   # Light/Dark mode state with persistence
    │
    ├── hooks/                 # Reusable custom hooks
    │   └── useHeroAnimation.ts# Anime.js v4 scoped animation & interaction hook
    │
    ├── pages/                 # Route page components
    │   ├── Home.tsx           # Hero showcase, marquee, featured artists, reviews
    │   ├── Search.tsx         # Interactive search, filters, category explorer
    │   ├── Profile.tsx        # Artisan portfolio, verified badge, booking modal
    │   ├── Dashboard.tsx      # Client & artisan upcoming appointments management
    │   ├── Pricing.tsx        # Atelier subscription tiers & commission rates
    │   ├── HowItWorks.tsx     # Guide for clients and verified beauty professionals
    │   ├── RegisterArtist.tsx # Application funnel for master stylists
    │   ├── Login.tsx          # Client/Artisan authentication portal
    │   ├── About.tsx          # Brand story, mission, and South Africa coverage
    │   ├── Contact.tsx        # Concierge support inquiry form
    │   └── NotFound.tsx       # 404 luxury fallback page
    │
    └── services/              # Data stores & hardware APIs
        ├── artisanStore.ts    # Curated artist records, services, ratings, availability
        ├── bookingStore.ts    # Booking state, active appointments, checkout
        ├── authStore.ts       # User authentication state & role handling
        └── haptics.ts         # Native Web Vibration tactile feedback engine
```

---

## 3. Core Subsystems

### 3.1 Routing & Navigation
The application uses `react-router-dom` v7 in SPA mode:
- `<ScrollToTop />` listens to location pathname changes and resets window scroll with zero delay.
- Dynamic route `/artist/:id` resolves artist detail profiles from `artisanStore`.
- Query parameters are supported on `/search?q=...&city=...&cat=...`.
- Unknown routes cleanly render `/NotFound.tsx` without dropping root layout chrome.

### 3.2 Theme Subsystem
- **Provider**: `ThemeContext.tsx` maintains active theme state (`'light'` | `'dark'`).
- **DOM Integration**: Automatically toggles the `.dark` class on the root `document.documentElement` element.
- **Persistence**: Remembers client preference in `localStorage` under key `'glowlink-theme'` with fallback to system `window.matchMedia('(prefers-color-scheme: dark)')`.
- **Transitions**: Smooth color, border, and background transitions are handled via GPU-accelerated CSS properties (`transition: background-color 0.35s ease, color 0.35s ease`).

### 3.3 State Management & Data Layer
1. **Artisan Store (`artisanStore.ts`)**:
   - Manages top South African beauty artisans across key metros (Johannesburg Sandton/Rosebank, Cape Town Camps Bay/Waterfront, Durban Umhlanga, Pretoria Menlyn).
   - Stores portfolios, specialties (Hair Couture, Bridal Glam, Nail Architecture, Lash Sculpting), hourly rates in ZAR (R), client ratings, and verified review counts.
2. **Booking Store (`bookingStore.ts`)**:
   - Manages the client reservation lifecycle: Date/Time selection -> Service add-ons -> In-studio vs. Mobile house-call toggle -> Confirmation.
   - Includes real-time calculation of subtotal, mobile travel surcharge, and platform concierge fee.
3. **Auth Store (`authStore.ts`)**:
   - Manages mock and authenticated session states, allowing switching between client and artisan perspectives.

### 3.4 Hardware Haptics Subsystem (`haptics.ts`)
- Utilizes the `navigator.vibrate` Web API for tactile responses on compatible mobile devices.
- Supported patterns:
  - `light`: 10ms micro-tap (for chip selection, pill toggling).
  - `medium`: 25ms firm tap (for search submission, modal openings).
  - `success`: `[15, 50, 20]ms` dual burst (for successful booking completion).
  - `error`: `[40, 60, 40]ms` double pulse (for invalid form fields).
- Safely degrades to no-op on non-supporting browsers and desktop systems without throwing errors.

---

## 4. Animation Architecture (Anime.js v4)

GlowLink's hero and micro-interactions utilize **Anime.js v4 / v5-beta** (`animejs@5.0.0-beta.2`), structured inside the dedicated hook `/src/hooks/useHeroAnimation.ts`.

### 4.1 Lifecycle & StrictMode Isolation
React 19 executes effects twice in development mode (`StrictMode`). Traditional animation libraries often leave duplicate running loops, broken tweens, or split-text artifacts.

To guarantee pristine lifecycle integrity:
1. All animations are created inside an Anime.js scope:
   ```typescript
   const scope = createScope({ root: heroEl });
   scope.add(() => {
     // Timeline & animations defined here
   });
   ```
2. Cleanup triggers `scope.revert()` which automatically cancels active tweens, restores original DOM text nodes, and clears style mutations:
   ```typescript
   return () => {
     scope.revert();
   };
   ```

### 4.2 SplitText & Screen-Reader Accessibility
The headline is parsed using `splitText`:
```typescript
const textSplitter = splitText(headlineRef.current, {
  accessible: true, // Retains screen reader accessibility via aria-label
});
```
Words rise from individual masked overflow containers (`.hero-word-mask`) with blur-to-sharp transitions, preventing screen reader stutter.

### 4.3 Mouse Parallax & Render Optimization
- **Desktop Parallax**: Calculates normalized mouse offset from screen center (`[-1, 1]`) and updates target coordinates.
- **Spring/Lerp Smoothing**:
  ```typescript
  coords.currX += (coords.targetX - coords.currX) * HERO_ANIMATION_CONFIG.parallaxSmoothing;
  coords.currY += (coords.targetY - coords.currY) * HERO_ANIMATION_CONFIG.parallaxSmoothing;
  ```
- **Depth Layers**: Elements with `data-parallax-depth="0.6"` through `"1.4"` translate at proportional rates, creating authentic depth of field.
- **Visibility Pausing**: Uses `IntersectionObserver` and the `visibilitychange` API to pause all running RAF loops, Ken Burns zooms, and particle drifts when the tab is hidden or the hero section scrolls out of view.

---

## 5. Viewport & Mobile Engineering

1. **Horizontal Containment**:
   Global `overflow-x: hidden` and `max-width: 100vw` rules on `html` and `body` prevent accidental lateral scrolling caused by absolute ambient glow orbs.
2. **iOS Safari Touch Zoom Prevention**:
   Inputs, selects, and textareas enforce `font-size: 16px !important` on screens below 640px, preventing iOS Safari from forcing an unwanted zoom-in on focus.
3. **Safe Area Insets**:
   Mobile bottom navigation respects `env(safe-area-inset-bottom)` to ensure home-indicator bars on modern bezel-less iPhones do not obscure navigation tabs.

---

## 6. Build & Delivery Pipeline

- **Bundler**: Vite 6/8 using ES Modules.
- **Styles**: Tailwind CSS v4 parsed at build time using the official `@tailwindcss/vite` plugin.
- **Output**: Pure static production artifacts emitted into `/dist` with content hashing for immutable caching.
- **Dev Server**: Runs on `http://0.0.0.0:3000` with strict CORS and CSP headers.
