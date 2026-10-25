# CODE_STYLE.md — GlowLink Engineering Conventions

## 1. Principles & Philosophy

The GlowLink codebase is built with strict architectural discipline. Code should be:
- **Predictable**: Consistent patterns across all components, hooks, and services.
- **Strictly Typed**: Zero implicit `any`, comprehensive domain interfaces, and defensive runtime checks.
- **Accessible & Resilient**: Accessible to screen readers and resilient to React 19 StrictMode lifecycle re-mounting.
- **Performant**: Animations must run off the main thread where possible, using GPU-accelerated transforms without triggering reflows.

---

## 2. TypeScript Guidelines

### 2.1 Compiler Configuration
The project runs with TypeScript 5.8+ under strict mode (`"strict": true` in `tsconfig.json`). Type errors cause `npm run lint` and `npm run build` to fail.

### 2.2 Typing Standards
- **Prefer `interface` for Object & Component Props**:
  ```typescript
  // ✅ Good
  export interface ArtisanCardProps {
    id: string;
    name: string;
    specialty: string;
    rating: number;
    reviewCount: number;
    priceStartingAt: number;
    imageUrl: string;
    isVerified?: boolean;
    onBook?: (id: string) => void;
  }
  ```
- **Use `type` for Unions, Primitives, and Utility Types**:
  ```typescript
  // ✅ Good
  export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";
  export type HapticFeedbackType = "light" | "medium" | "success" | "error";
  ```
- **Ban `any`**: Use `unknown`, generic parameters, or explicit discriminated union types instead of `any`.
- **Explicit Return Types for Public APIs**: Exported utility functions and custom hooks should explicitly specify their return signature.

---

## 3. React 19 Best Practices

### 3.1 Functional Components & Hooks
- Always write functional components with standard TypeScript typings.
- Keep components focused on a single responsibility. Extract non-trivial animation lifecycles into dedicated hooks (e.g., `useHeroAnimation.ts`).
- Avoid deeply nested JSX. Deconstruct complex sub-sections into focused sub-components.

### 3.2 Ref Management & DOM Access
- Pass `React.RefObject<T | null>` explicitly when sharing DOM nodes with animation controllers.
- Always check `ref.current !== null` before calling DOM methods.
- Clean up any native event listeners (`addEventListener`) added in `useEffect`.

```typescript
// ✅ Good: Safe ref and listener pattern
useEffect(() => {
  const el = containerRef.current;
  if (!el) return;

  const handlePointer = (e: PointerEvent) => {
    // Logic
  };

  el.addEventListener("pointerdown", handlePointer, { passive: true });
  return () => {
    el.removeEventListener("pointerdown", handlePointer);
  };
}, []);
```

---

## 4. Anime.js v4 Specific Coding Standard

Anime.js v4 introduces a new API paradigm. Engineers and automated agents must adhere strictly to these rules:

### 4.1 Named Imports Only
```typescript
// ✅ Correct
import {
  animate,
  createTimeline,
  stagger,
  splitText,
  createDrawable,
  createScope,
  createSpring,
  utils,
} from "animejs";

// ❌ FORBIDDEN: Default import v3 syntax
import anime from "animejs";
```

### 4.2 Property Syntax: `ease`, NEVER `easing`
```typescript
// ✅ Correct v4 syntax
animate(cardElement, {
  translateY: [-10, 0],
  opacity: [0, 1],
  duration: 650,
  ease: "outCubic", // Note: 'ease'
});

// ❌ FORBIDDEN: v3 syntax
anime({
  targets: cardElement,
  translateY: -10,
  easing: "easeOutCubic", // Error: 'targets' and 'easing' do not exist in v4
});
```

### 4.3 Scoping with `createScope` and `scope.revert()`
Every animation inside a React component MUST be wrapped inside a scope tied to a root element, and reverted upon cleanup:
```typescript
useEffect(() => {
  const root = rootRef.current;
  if (!root) return;

  const scope = createScope({ root });
  scope.add(() => {
    animate(".badge", { scale: [0.8, 1], duration: 400, ease: "outBack" });
  });

  return () => {
    scope.revert(); // Essential for React 19 StrictMode cleanup
  };
}, []);
```

### 4.4 Tunable Constants Architecture
Do not hardcode magic animation numbers deep within timeline chains. Define a typed configuration object at the top of the hook or module:
```typescript
export const HERO_ANIMATION_CONFIG = {
  introNavDuration: 750,
  wordRiseDuration: 800,
  wordStagger: 70,
  kenBurnsDuration: 14000,
  kenBurnsScale: 1.07,
  parallaxCardStrength: 14,
  parallaxSmoothing: 0.08,
} as const;
```

---

## 5. Tailwind CSS v4 & Styling Rules

### 5.1 CSS Organization
1. `/src/index.css`: `@import "tailwindcss";`, `@custom-variant dark`, and the `@theme` token definitions.
2. `/src/glowlink.css`: Liquid glass surface classes, keyframe animations, mobile fixes, and marquee rules.

### 5.2 Class Composition
- Use `clsx` and `tailwind-merge` (via a standard `cn()` helper) when dynamically computing class strings.
- Follow logical class ordering:
  1. **Display & Positioning** (`flex`, `grid`, `relative`, `fixed`, `z-10`)
  2. **Box Model & Sizing** (`w-full`, `max-w-xl`, `h-12`, `p-4`, `mx-auto`)
  3. **Typography** (`font-serif`, `text-lg`, `tracking-wide`, `text-plum-base`)
  4. **Backgrounds & Borders** (`bg-card`, `border`, `rounded-full`, `shadow-lg`)
  5. **Transitions & Interactivity** (`transition-all`, `hover:scale-105`, `cursor-pointer`)
  6. **Dark Mode Modifiers** (`dark:bg-dark-card`, `dark:border-dark-border`)

### 5.3 Prohibition of Unsafe Inlines
Never use inline `style={{ ... }}` for properties covered by design tokens (e.g. `style={{ color: '#501854' }}` is prohibited).
- **Allowed Exception**: Highly dynamic, frame-by-frame transforms driven by RAF parallax loops:
  ```typescript
  el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
  ```

---

## 6. Naming Conventions

| Item | Convention | Example |
| :--- | :--- | :--- |
| **Components** | PascalCase | `CosmeticIcons.tsx`, `Header.tsx` |
| **Custom Hooks** | camelCase with `use` prefix | `useHeroAnimation.ts`, `useTheme.ts` |
| **Services & Stores** | camelCase with `Store` suffix | `artisanStore.ts`, `bookingStore.ts` |
| **Utility Functions**| camelCase | `triggerHaptic()`, `formatZAR()` |
| **Constants** | UPPER_SNAKE_CASE | `HERO_ANIMATION_CONFIG`, `SOUTH_AFRICA_METROS` |
| **CSS Classes** | kebab-case | `.glass-pill-nav`, `.category-card`, `.stat-box` |

---

## 7. Pull Request & Verification Checklist

Before merging changes, verify:
- [ ] `npm run lint` completes with zero errors or warnings (`tsc --noEmit`).
- [ ] `npm run build` succeeds without bundle or chunk generation errors.
- [ ] Animation lifecycles clean up cleanly without memory leaks or duplicate RAF loops.
- [ ] Dark mode styling remains harmonious with Light mode (tested via `<ThemeToggle />`).
- [ ] `@media (prefers-reduced-motion: reduce)` is respected across all new animations.
- [ ] Mobile viewports (< 640px) exhibit zero horizontal overflow.
