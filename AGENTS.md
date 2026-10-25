# AGENTS.md — Agent Operating Guide for GlowLink

## 1. Executive Summary & Domain Context

**GlowLink** is South Africa's premier curated luxury beauty and cosmetics booking atelier marketplace. It connects discerning clients in Johannesburg, Cape Town, Durban, and Pretoria with top-tier, verified master hairstylists, makeup artists, nail couture technicians, and aesthetic specialists for studio appointments or luxury mobile house calls.

When working on this repository as an autonomous AI engineer or assistant:
- Maintain the **high-end, opulent editorial aesthetic** (editorial serif typography, deep plum hues `#501854`, electric pink accents `#DB2777`, soft lilac borders `#EFBDEB`, and translucent liquid-glass surfaces).
- **Never degrade existing functionality or visual fidelity**. Do not replace real implementations with dummy or mock regressions.
- **Never introduce unprompted external dependencies or AI assistants/chatbots** unless explicitly instructed by the user.

---

## 2. Technical Stack & Invariants

| Layer | Technology | Version / Specifics |
| :--- | :--- | :--- |
| **Framework** | React | 19.x with Functional Components & Hooks |
| **Language** | TypeScript | 5.8+ (Strict type checking, `tsc --noEmit`) |
| **Bundler** | Vite | 6.x / 8.x with `@vitejs/plugin-react` |
| **CSS Engine** | Tailwind CSS v4 | `@tailwindcss/vite` with `@theme` block in `/src/index.css` |
| **Animation** | Anime.js | **v4 / v5-beta (`animejs@5.0.0-beta.2`) ONLY** |
| **Icons** | Lucide React + Bespoke SVG | `lucide-react` + `/src/components/CosmeticIcons.tsx` |
| **Routing** | React Router DOM | v7 (`react-router-dom`) |
| **Haptics** | Web Vibration API | Native navigator vibration via `/src/services/haptics.ts` |
| **Server** | Express (Full-stack ready) | Dev port 3000, Vite middleware integration |

---

## 3. Critical Anime.js v4 Rules (STRICT COMPLIANCE)

Anime.js v4/v5 introduces a complete architectural departure from Anime.js v3. Agents **must never** use v3 patterns.

### Prohibited Anime.js v3 Patterns:
```typescript
// ❌ WRONG (v3 syntax - FAILS IN ANIME V4)
import anime from 'animejs';
anime({
  targets: '.element',
  translateX: 250,
  easing: 'easeInOutQuad', // 'easing' is invalid in v4
  duration: 1000
});
```

### Mandatory Anime.js v4 Patterns:
```typescript
// ✅ CORRECT (v4 syntax)
import {
  animate,
  createTimeline,
  stagger,
  splitText,
  createDrawable,
  createScope,
  createSpring,
  utils
} from 'animejs';

// 1. Standalone animation: target is 1st argument, config is 2nd argument
animate(element, {
  translateX: [0, 24],
  opacity: [0, 1],
  duration: 800,
  ease: 'outCubic', // Key is 'ease', NOT 'easing'
  loop: true,
  alternate: true,
});

// 2. Timelines
const tl = createTimeline({
  defaults: { ease: 'outCubic', duration: 700 }
});
tl.add(el1, { translateY: [-20, 0], opacity: [0, 1] }, 0);
tl.add(el2, { scale: [0.95, 1], opacity: [0, 1] }, 150);

// 3. Scoping & React 19 StrictMode Cleanup
const scope = createScope({ root: containerEl });
scope.add(() => {
  animate(subElement, { opacity: [0, 1], duration: 500 });
});
// Cleanup in return statement of useEffect:
return () => {
  scope.revert();
};
```

### Essential v4 Easing Values
Use standard v4 string names:
- `'linear'`
- `'inQuad'`, `'outQuad'`, `'inOutQuad'`
- `'inCubic'`, `'outCubic'`, `'inOutCubic'`
- `'inExpo'`, `'outExpo'`, `'inOutExpo'`
- `'inSine'`, `'outSine'`, `'inOutSine'`
- `'outBack'`, `'inOutBack'`
- Or springs created via `createSpring({ bounce: 0.2, duration: 600 })`.

---

## 4. Design & Token Invariants

### 4.1 Exact Color Palette
Always use these exact brand values. Do not invent arbitrary hex codes:

| Token Name | Light Theme Value | Dark Theme Value | CSS Variable / Utility Class |
| :--- | :--- | :--- | :--- |
| **Primary Base** | `#501854` (Deep Plum) | `#D4C7E1` (Lilac Ash) | `var(--primary)` / `text-plum-base` |
| **Accent / Brand** | `#DB2777` (Hot Pink) | `#DB2777` (Hot Pink) | `var(--ring)` / `text-pink-600` / `#db2979` |
| **Subtle Lilac Accent**| `#8C3B8A` (Muted Berry)| `#A695B8` (Amethyst Slate) | `--color-plum-accent` |
| **Borders** | `#EFBDEB` (Soft Lilac) | `#3B3237` (Espresso Plum) | `var(--border)` / `border-plum-border` |
| **Form Inputs** | `#E7C1DC` (Powder Lilac)| `#3E343C` (Smoked Plum) | `var(--input)` / `input` selector |
| **Canvas Background** | `#FFFFFF` / `#FAF2FA` | `#17111D` (Obsidian Violet)| `var(--background)` / `bg-background` |
| **Card / Panel Surface**| `#FFFFFF` (Glass 85%) | `#241C2B` (Velvet Wine) | `var(--card)` / `.glass-panel` |

### 4.2 Typography
- **Headings & Display**: `'Playfair Display', Georgia, serif` (use `font-serif`).
- **Body & Controls**: `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` (use `font-sans`).
- Always maintain generous letter-spacing on uppercase labels (`tracking-widest` or `tracking-[0.2em]`).

### 4.3 Mobile & Responsive Constraints
- Inputs on mobile viewports (`max-width: 640px`) must have `font-size: 16px` to prevent iOS Safari auto-zoom.
- Horizontal category chips must utilize `.no-scrollbar` with `-webkit-overflow-scrolling: touch`.
- Parallax effects and magnetic cursor pulls must be disabled on touch devices (`"ontouchstart" in window || navigator.maxTouchPoints > 0`).

---

## 5. Architectural Conventions

1. **State Stores**:
   - Located in `/src/services/`.
   - `artisanStore.ts`: Curated South African master stylists, salon portfolios, verified badges, rating data, and booking calendar slots.
   - `bookingStore.ts`: Client appointments, checkout sessions, mobile house-call location addresses.
   - `authStore.ts`: Session tokens, current user role (`client` vs `artisan`).
   - `haptics.ts`: Tactical tactile feedback triggers (`light`, `medium`, `success`, `error`).

2. **Custom Hooks**:
   - Store domain logic and complex animation lifecycles in `/src/hooks/` (e.g., `useHeroAnimation.ts`).
   - Always expose tunable configuration constants at the top of the file so designers and developers can adjust speeds, amplitudes, and durations without touching animation loop code.

3. **Components & Layouts**:
   - Top-level page views belong in `/src/pages/`.
   - Shared reusable UI belongs in `/src/components/ui/` or `/src/components/`.
   - Bespoke vector artwork belongs in dedicated components (e.g., `/src/components/CosmeticIcons.tsx`).

---

## 6. Development & Verification Workflow

Agents should execute instructions systematically:
1. **Analyze Requirements**: Inspect targeted files first using `view_file` to ensure current context.
2. **Execute Edits**: Write pristine, fully realized blocks using `write_to_file` or `replace_file_content`. Avoid half-finished placeholders.
3. **Verify Build**:
   ```bash
   # Run TypeScript type check
   npm run lint

   # Run Vite production build test
   npm run build
   ```
4. **Dev Server Port**: Must run on port `3000` with host `0.0.0.0` (managed automatically by `vite.config.ts`).
5. **No Visual Regressions**: Any modification must look harmonious in both Light and Dark modes.
