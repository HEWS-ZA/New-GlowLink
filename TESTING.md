# TESTING.md — GlowLink Quality Assurance & Testing Guide

## 1. Testing Philosophy & Objectives

GlowLink blends complex ambient animations with high-touch e-commerce booking flows. Our testing strategy ensures that:
1. **Visual Opulence Never Breaks Functionality**: Animations must be progressive enhancements; if JavaScript fails or reduced-motion is requested, all UI remains 100% accessible and usable.
2. **Zero Memory Leaks**: Animations, timers, and parallax render loops must terminate completely on component unmount and pause when off-screen.
3. **Flawless Mobile Experience**: Touch targets, safe-area insets, and iOS viewport zoom quirks must be validated on actual physical device viewports.

---

## 2. Automated Quality Gates

The codebase enforces two primary automated gates:

### 2.1 Static Type Analysis
```bash
npm run lint
```
Executes `tsc --noEmit` against all TypeScript files.
- Verifies strict typing across components, stores, hooks, and services.
- Flags missing prop types, illegal downcasts, or untyped DOM events.

### 2.2 Production Build Verification
```bash
npm run build
```
Executes Vite's optimized production build.
- Compiles TSX/TS into ES2022 modules.
- Employs `@tailwindcss/vite` to compile the CSS token tree.
- Verifies tree-shaking and dynamic import boundaries.

---

## 3. Animation & Motion Verification Protocols

Because Anime.js v4 powers the visual experience, verify these five critical criteria:

### 3.1 `prefers-reduced-motion` Verification
- **Emulation**: In Chrome DevTools, open the Rendering panel (`Ctrl+Shift+P` -> `Show Rendering`) and set `Emulate CSS media feature prefers-reduced-motion` to `reduce`.
- **Expected Behavior**:
  - The hero intro timeline does not animate; elements appear in their final states immediately.
  - Numerical counters (`4.98` and `4,200+ clients`) render their target values immediately without rolling.
  - Ambient particle drift, Ken Burns image drift, and cursor parallax are completely disabled.
  - No continuous background RAF loops remain active.

### 3.2 React 19 StrictMode Lifecycle & Memory Leak Test
- **Emulation**: Run development mode (`npm run dev`). Mount and unmount the `<Home />` page repeatedly (e.g. navigate Home -> About -> Home).
- **Validation**:
  - Check browser DevTools Performance and Memory tabs.
  - Confirm that `createScope().revert()` cleans up previous tween instances.
  - Verify headline text does not duplicate or leave orphaned DOM span artifacts.
  - Ensure `cancelAnimationFrame` halts the parallax loop on component dismount.

### 3.3 Screen Reader Accessibility for Animated Headlines
- **Validation**: Inspect the hero headline in DevTools or using VoiceOver / NVDA.
- **Expected Structure**:
  ```html
  <h1 aria-label="Where South African Luxury connects with Hair, Makeup & Nail Mastery">
    <!-- Masked animated word spans with aria-hidden="true" -->
  </h1>
  ```
- Screen readers must announce the full sentence naturally without pausing per animated word.

### 3.4 Typewriter Input Disruption Test
- **Test Steps**:
  1. Observe the search input placeholder cycling between services.
  2. Click into the input to focus it, or type any character.
- **Expected Behavior**: The typewriter loop must pause immediately. The user's typed input must never be overwritten or interrupted.

### 3.5 Off-Screen & Hidden Tab Optimization
- **Test Steps**:
  1. Scroll past the hero section to the bottom of the page.
  2. Switch to another browser tab.
- **Expected Behavior**:
  - `IntersectionObserver` triggers `pauseAllLoops()`.
  - Document `visibilitychange` halts RAF updates, dropping CPU utilization to near 0%.
  - Returning to the tab or scrolling back into view seamlessly resumes animations via `resumeAllLoops()`.

---

## 4. Mobile & Viewport QA Matrix

Test across the following responsive breakpoints:

| Viewport Category | Width Dimension | Critical Verification Checks |
| :--- | :--- | :--- |
| **Mobile Compact** | 375px (iPhone SE) | No horizontal page scrolling; search pill wraps cleanly into multi-row form; icons scale via `em` without clipping text. |
| **Standard Mobile** | 390px - 430px (iPhone 14-16 Pro) | Floating bottom dock aligns with safe-area home indicator; tapping inputs does not trigger Safari page zoom (verified font-size ≥ 16px). |
| **Tablet Portrait** | 768px (iPad Mini) | Category cards display in 2-column grid; hero layout balances headline and image card vertically. |
| **Desktop High-DPI** | 1280px - 1920px+ (MacBook / 4K) | Liquid glass floating pill floats centered; mouse parallax tracks smoothly with lerp physics; infinite marquee loops seamlessly. |

---

## 5. End-to-End User Journeys

### Journey 1: Artisan Discovery & Filtering
1. User lands on `/`.
2. Observes the infinite right-to-left `"GLOWLINK"` marquee stream.
3. Clicks on a category chip (e.g., *"Bridal Glam"* or *"Nail Couture"*).
4. Navigates to `/search` with pre-filled category filters.
5. Verifies filtered results match the selected category and location.

### Journey 2: Artisan Reservation & Checkout Flow
1. User selects an artisan card from search results or home showcase.
2. Views the profile page `/artist/:id`.
3. Verifies verified badge, client reviews, and hourly rates in South African Rand (R).
4. Selects a date and service option (In-Studio vs. Luxury Mobile House Call).
5. Confirms appointment and verifies haptic tactile feedback (`haptics.ts`) triggers on supported mobile devices.

### Journey 3: Theme Persistence
1. Click the `<ThemeToggle />` pill in the header.
2. Confirm the entire interface transforms from Light Plum (`#501854` / `#EFBDEB`) to Obsidian Violet Dark (`#17111D` / `#3B3237`).
3. Reload the browser.
4. Verify the chosen theme persists without flashing incorrect theme colors during initial mount.
