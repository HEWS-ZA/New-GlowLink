# DESIGN_SYSTEM.md — GlowLink Luxury Design Language

## 1. Brand Identity & Aesthetic Philosophy

**GlowLink** embodies modern South African luxury cosmetics, hair artistry, and wellness couture. The interface marries high-fashion editorial aesthetics (reminiscent of Vogue and Architectural Digest) with hyper-fluid, tactile digital craftsmanship inspired by iOS liquid glass surfaces.

### Core Principles
1. **Opulent Restraint**: Deep plum anchors the canvas with timeless dignity, accented by electric hot pink moments that punctuate life and modernity.
2. **Tactile Glassmorphism**: Translucent floating pills, ultra-fine lilac borders, multi-layered Gaussian blurs, and soft dimensional drop shadows simulate frosted crystal over rich pigments.
3. **Editorial Typography**: High-contrast modern serif headlines paired with ultra-clean, legible grotesque sans-serif bodies.
4. **Cinematic Micro-Motion**: Physics-based, soft cubic easing powered by Anime.js v4, providing alive yet serene ambient movement (floating cosmetic tools, subtle parallax, light shimmer sweeps).

---

## 2. Color Palette & Token System

The design system operates on a dual-palette architecture strictly calibrated to the luxury brand identity:

### 2.1 Color Tokens

```
========================================================================================
TOKEN NAME           LIGHT THEME               DARK THEME              ROLE
========================================================================================
Canvas Background    #FFFFFF / #FAF2FA         #17111D                 Page backdrop
Card / Panel Surface #FFFFFF (85-95% Glass)    #241C2B                 Card & panel base
Primary Accent       #501854 (Deep Plum)       #D4C7E1 (Lilac Ash)     Headings & main text
Brand Electric Ping  #DB2777 (Hot Pink)        #DB2777 (Hot Pink)      Key CTA, active rings
Secondary Accent     #8C3B8A (Berry Plum)      #A695B8 (Amethyst)      Subtext & icons
Border Accent        #EFBDEB (Soft Lilac)      #3B3237 (Espresso Plum) Glass contours
Form Input Surface   #FFFFFF / #E7C1DC Border  #3E343C / #3B3237 Border Form controls
Marquee Brand Text   #DB2979                   #DB2979                 Infinite logo stream
========================================================================================
```

### 2.2 CSS Variables (`/src/index.css`)

```css
:root {
  /* LIGHT THEME */
  --background: #FFFFFF;
  --foreground: #501854;
  --card: #FFFFFF;
  --card-foreground: #501854;
  --primary: #501854;
  --primary-foreground: #FFFFFF;
  --secondary: #FAF2FA;
  --secondary-foreground: #501854;
  --muted: #F8EEF8;
  --muted-foreground: #7E4882;
  --accent: #FAF2FA;
  --accent-foreground: #501854;
  --border: #EFBDEB;
  --input: #E7C1DC;
  --ring: #DB2777;
  color-scheme: light;
}

.dark {
  /* DARK THEME */
  --background: #17111D;
  --foreground: #D4C7E1;
  --card: #241C2B;
  --card-foreground: #D4C7E1;
  --primary: #DB2777;
  --primary-foreground: #FFFFFF;
  --secondary: #372E3E;
  --secondary-foreground: #D4C7E1;
  --muted: #241A2B;
  --muted-foreground: #A695B8;
  --accent: #372E3E;
  --accent-foreground: #D4C7E1;
  --border: #3B3237;
  --input: #3E343C;
  --ring: #DB2777;
  color-scheme: dark;
}
```

---

## 3. Typography & Scale

### 3.1 Type Families
- **Display Serif**: `'Playfair Display', Georgia, serif`
  - Applied with class: `font-serif`
  - Used for hero headlines, section titles, artisan names, and pricing numbers.
  - Emphasizes editorial elegance and bespoke atelier prestige.
- **Body & Functional Sans**: `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
  - Applied with default body font and `font-sans`.
  - Used for UI labels, search bars, service descriptions, meta badges, and interactive controls.

### 3.2 Typographic Hierarchy
| Style | Element | Font Size | Weight | Tracking |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Display** | `h1` | `3.25rem - 4.5rem` (52-72px) | Medium (500) | `-0.025em` tight |
| **Section Title** | `h2` | `2.25rem - 3rem` (36-48px) | SemiBold (600) | `-0.02em` |
| **Card Heading** | `h3` | `1.25rem - 1.5rem` (20-24px) | SemiBold (600) | `-0.01em` |
| **Subheadings** | `p.sub` | `1.125rem - 1.25rem` (18-20px) | Regular (400) | `normal` |
| **Body Standard**| `p`, `span`| `0.9375rem - 1rem` (15-16px) | Regular (400) | `-0.01em` |
| **Eyebrow / Overline**| `span` | `0.75rem - 0.8125rem` (12-13px)| Medium / Bold | `tracking-widest` (0.15em) |
| **Captions & Meta**| `small` | `0.75rem` (12px) | Regular (400) | `normal` |

---

## 4. UI Components & Surfaces

### 4.1 Liquid Glass Floating Pill Navigation (`.glass-pill-nav`)
- **Structure**: Rounded-full pill suspended with fixed positioning.
- **Light Theme**:
  ```css
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(28px) saturate(180%);
  border: 1px solid #EFBDEB;
  box-shadow: 0 10px 30px -5px rgba(80, 24, 84, 0.08), 0 0 0 1px rgba(239, 189, 235, 0.3);
  ```
- **Dark Theme**:
  ```css
  background: rgba(36, 28, 43, 0.88);
  border: 1px solid #3B3237;
  box-shadow: 0 10px 35px -5px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(59, 50, 55, 0.6);
  ```

### 4.2 Search Bar Floating Pill (`.glass-search-pill`)
- High-elevation glass shell containing integrated service selection, location filter, date picker, and pink action button.
- Curved pill geometry on desktop (`rounded-full`), gently curved card on mobile (`rounded-3xl`).
- Dynamic placeholder text cycles through services using an animated typewriter effect (`"Bridal makeup"`, `"Locs & braids"`, `"Balayage"`, `"Nail couture"`).

### 4.3 Interactive Cards
1. **Category Cards (`.category-card`)**:
   - `border-radius: 2rem`
   - Height: `210px`
   - Hover transition: `translateY(-6px) scale(1.02)`, border glow to `#DB2777`.
2. **Artisan Portfolio Cards (`.artist-card`)**:
   - High-aspect photography with Ken-Burns scale zoom on hover (`scale(1.04)`).
   - Glass badge indicators (Verified Pro, Mobile Atelier Available, ⭐ 4.9+).
3. **Pricing Atelier Cards (`.pricing-card`)**:
   - Curved radii (`2.25rem`), featured tier highlighted with deep plum border in light mode and electric pink in dark mode.

### 4.4 Form Elements
- Inputs maintain `border: 1.5px solid #E7C1DC` (Light) and `#3B3237` (Dark).
- Focus states glow with a `3px` focus ring in `#DB2777`.
- **Mobile Safari Guard**: Mobile inputs enforce `16px` font size to block intrusive iOS zoom behaviors.

---

## 5. Bespoke Cosmetic Iconography

To avoid generic flat iconography, GlowLink uses a bespoke, hand-drawn vector icon suite (`/src/components/CosmeticIcons.tsx`).

### Design Guidelines:
- **Geometry**: Consistent line weights (`strokeWidth={1.5}` or `1.8`), rounded caps and joins (`strokeLinecap="round"`, `strokeLinejoin="round"`).
- **Dual-tone Pigment**: Primary plum/white stroke with selective electric hot-pink `#DB2777` highlights.
- **Sizing**: Default size is `1em` when inline within typography, scaling harmoniously with parent text.
- **Accessibility**: Marked with `aria-hidden="true"` when used decoratively alongside legible text.

### Available Icons:
1. `<LipstickIcon />`: Slanted bullet with faceted barrel and gilded collar.
2. `<NailPolishIcon />`: Glass bottle with lacquer reflection and precision wand handle.
3. `<MascaraWandIcon />`: Spiral bristle wand head with sculpted grip.
4. `<MakeupBrushIcon />`: Fluffy angled powder brush with metallic ferrule.
5. `<CompactMirrorIcon />`: Dual-shell compact with hinge, mirror plate, and pressed powder well.
6. `<PerfumeBottleIcon />`: Crystal atomizer flacon with faceted stopper.
7. `<ScissorsCombIcon />`: Crossed salon shears with fine-tooth styling comb.
8. `<SparkleIcon />`: Four-point astral diamond glint with central spark.

---

## 6. Motion & Animation Principles

All core motion is orchestrated through **Anime.js v4**:

### 6.1 Principles
- **No Layout Shift**: Animate `transform` (GPU accelerated `translate3d`, `scale`, `rotate`) and `opacity` only. Never animate CSS width, height, top, or left.
- **Soft Easing**: Slow, luxurious deceleration (`outCubic`, `outExpo`, `inOutSine`). No cartoonish bouncing or jarring snaps.
- **Ambient Life**: Subtle idle oscillations (`translateY: [-2, 2]px`, `kenBurnsScale: 1.07`), making cards and icons feel afloat in liquid glass.

### 6.2 Key Choreographed Sequences
1. **Hero Intro Timeline (~2.5s staggered)**:
   - Floating nav drops down and unblurs.
   - Eyebrow badge slides in while sparkle rotates 180°.
   - Display headline split into words via `splitText({ accessible: true })`, rising from masked lines with blur-to-sharp easing.
   - Inline SVG cosmetic icons draw themselves in real-time with `createDrawable()`.
   - Continuous subtle shimmer sweep passes across the italicized word *"connects"*.
   - Counter numbers animate upwards to `4.98` and `4,200+ clients`.
2. **Infinite Brand Stream**:
   - Right-to-left marquee of the bold system identity `"GLOWLINK"` in `#db2979` with seamless loop translation.
   - Pauses gently on user hover for uninterrupted focus.
3. **Cursor Parallax**:
   - Ambient cosmetic icons shift at varying depths (`data-parallax-depth="0.6"` through `"1.4"`).
   - Card shifts with smoothed lerp easing (`parallaxSmoothing: 0.08`).
   - Disabled on touch screens.
4. **Reduced Motion**:
   - Fully honors `@media (prefers-reduced-motion: reduce)`.
   - Bypasses timelines, disables looping animations, and renders final counters immediately.
