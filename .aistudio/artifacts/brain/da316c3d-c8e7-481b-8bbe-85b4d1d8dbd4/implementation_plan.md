# GlowLink: Unified Luxury Atelier Platform Migration

Consolidate GlowLink's design-system source of truth (`glowlink-main`) and native mobile branding into a fully functional, production-grade luxury beauty marketplace web and progressive web application with local state persistence, interactive booking, artisan CRM, and native mobile enhancements.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following product decisions were confirmed during Phase 1:
> - **Core Logic & State Architecture**: Full business logic, reactive state, and persistence (appointments, reviews, profile bookings, artisan verification, and client CRM) are engineered directly into the `glowlink-main` architectural base.
> - **Native Mobile Enhancements**: Integrating mobile-first ergonomics inspired by the native app, including a floating glass bottom navigation bar for handheld viewports, tactile Web Vibration haptics for interactive selections, installable PWA configuration, and high-resolution native brand assets.
> - **Visual Design Integrity**: Retaining 100% fidelity to `glowlink-main`'s light luxury aesthetic (warm cream backgrounds `#FAF8F5`, Playfair Display serif typography, and iOS liquid glass surfaces) without carrying over vanilla React Native styles.

---

## 1. Overview & Core Concept

* **What It Does**: GlowLink is South Africa's premier curated beauty atelier platform, connecting clients seeking master makeup artists, couture hair stylists, nail aestheticians, and dermal specialists with verified artisans for private studio visits and mobile home appointments.
* **Target Audience**: Discerning clients looking for bespoke beauty services across Johannesburg, Cape Town, Durban, and Pretoria, alongside professional beauty artisans requiring booking automation, calendar management, and CRM tracking.
* **Key Value**: Frictionless search by discipline and metropolitan area, upfront bespoke pricing, verified reviews, seamless appointment scheduling with calendar conflict prevention, and an artisan management dashboard.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Client Discovery & Booking**:
   * Client browses curated disciplines (Makeup, Hair Styling, Nails, Braids, Barbering, Aesthetics) or searches by service/location.
   * Client selects an artisan profile (e.g. *Thandi Mthembu*), chooses an atelier service (e.g. *Haute Bridal Atelier*), picks an available date/time, and submits a booking request with immediate confirmation.
2. **Review & Social Proof**:
   * Clients submit verified reviews and ratings directly on artisan profiles with instant score recalculation.
3. **Artisan Portal & Management**:
   * Stylists log in or complete the 3-step onboarding application.
   * Stylists access the Atelier Console to manage real-time appointments, revenue metrics, and client CRM records.
4. **Mobile Navigation**:
   * Desktop displays the floating iOS liquid glass top pill header.
   * Mobile viewports gain a native-feeling floating bottom tab bar (`Discover`, `Search`, `Atelier Console`, `Membership`) with subtle tactile haptics on tap.

### Visual Identity & Theme
* **Aesthetic Direction**: High-fashion editorial atelier, quiet luxury, tactile glass surfaces, and refined South African metropolitan curation.
* **Color Palette**:
  * Background: Warm Alabaster Cream (`#FAF8F5` / `hsl(40, 33%, 97%)`)
  * Text / Primary: Deep Obsidian Neutral (`#1a1a1a` / `#0a0a0a`)
  * Accents: Champagne Amber (`#f59e0b` / `hsl(38, 92%, 50%)`), Emerald verification accents (`#10b981`), and soft border scrims (`hsl(40, 15%, 88%)`).
* **Typography**:
  * Display & Titles: *Playfair Display* (editorial high-contrast serif with italic accents).
  * Interface & Body: *Inter* / modern system sans-serif with -0.01em tracking and crisp tabular numerals.
* **Component Styling**:
  * iOS liquid glass pill navbars with 28px backdrop blur and subtle highlight borders.
  * 32px to 40px rounded corners on hero visuals, artisan cards, and dialog sheets.
* **Feedback & Motion**:
  * Subtle hover elevations (`translateY(-2px)` to `-5px`), smooth fade-in animations on scroll, and toast confirmations via Sonner.

---

## 3. Key Product Decisions & Trade-Offs

* **Decision 1: Direct State Management with Typed Local Persistence**
  * *Chosen Approach*: Implement a reactive, strongly-typed store (`artisanStore.ts`, `bookingStore.ts`, `authStore.ts`) backed by browser `localStorage` and `sessionStorage`.
  * *Why*: Enables instant, responsive interactions across all 6 core routes without requiring external database latency or third-party backend keys during prototyping.
  * *Alternatives Considered*: Pure in-memory React state (data lost on navigation reload) was rejected; cloud databases (Firebase/SQL) can be attached seamlessly later through the same store interface.

* **Decision 2: Adaptive Mobile Bottom Navigation with Web Vibration Haptics**
  * *Chosen Approach*: Mount a floating bottom navigation bar visible only on mobile screens (`< 768px`) that mirrors native bottom tabs, utilizing `navigator.vibrate(10)` for micro-haptic feedback.
  * *Why*: Delivers the mobile fluidity of `glowlink-native` while maintaining the web design tokens of `glowlink-main`.

* **Decision 3: PWA Compliance and Brand Asset Retention**
  * *Chosen Approach*: Configure Web App Manifest, iOS Safari touch icons, and an in-app installation banner using the high-resolution brand icons from `glowlink-native`.
  * *Why*: Users can add GlowLink directly to their iOS and Android home screens as a standalone app.

---

## 4. Technical Architecture & Data Strategy

### Architecture & Component Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        GLOWLINK UNIFIED APP                            │
├────────────────────────────────────────────────────────────────────────┤
│                           Header (Desktop)                             │
│       [Brand Logo]  [Disciplines]  [Experience]  [Membership] [Story]  │
├────────────────────────────────────────────────────────────────────────┤
│                          REACT ROUTER DOM                              │
│                                                                        │
│   /              /search          /profile/:id      /dashboard         │
│  [Home View]    [Search View]    [Artisan View]    [Console View]      │
│   - Hero Search  - Query Filters  - Service Menu    - KPI Cards        │
│   - Categories   - Artisan Cards  - Date Booking    - Bookings Table   │
│   - Roster       - Price Filters  - Reviews & Form  - Client CRM Table │
│                                                                        │
│   /login         /register-artist /pricing          /about /contact    │
│  [Auth View]    [3-Step Wizard]  [Plans Grid]      [Info & Concierge]  │
├────────────────────────────────────────────────────────────────────────┤
│                       CENTRALIZED STATE LAYER                          │
│                                                                        │
│   ┌────────────────────┐   ┌────────────────────┐   ┌────────────────┐ │
│   │   Artisans Store   │   │   Bookings Store   │   │   Auth Store   │ │
│   │ - Directory data   │   │ - Active bookings  │   │ - Active user  │ │
│   │ - Filters & search │   │ - Add reservation  │   │ - Login/Logout │ │
│   │ - Dynamic profiles │   │ - Cancel booking   │   │ - Registration │ │
│   └─────────┬──────────┘   └─────────┬──────────┘   └────────┬───────┘ │
│             └──────────────┬─────────┴───────────────────────┘         │
│                            ▼                                           │
│              Local Persistence Engine (localStorage)                   │
├────────────────────────────────────────────────────────────────────────┤
│                      Mobile Floating Bottom Nav                        │
│          [Home]        [Search]        [Console]       [Story]         │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Entities & Schema

* **Artisan**:
  ```typescript
  interface Artisan {
    id: string;
    name: string;
    specialty: string;
    category: "makeup" | "hair-styling" | "nails" | "braids" | "barbering" | "skincare";
    location: string;
    city: string;
    rating: number;
    reviewsCount: number;
    tag: string;
    priceRange: string;
    minPrice: number;
    image: string;
    bio: string;
    experience: string;
    services: ArtisanService[];
    reviews: ClientReview[];
    portfolio: string[];
    socials: { instagram?: string; facebook?: string; twitter?: string };
  }
  ```

* **Booking**:
  ```typescript
  interface Booking {
    id: string;
    artisanId: string;
    artisanName: string;
    serviceName: string;
    servicePrice: string;
    date: string;
    time: string;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    status: "Confirmed" | "Pending" | "Completed" | "Cancelled";
    createdAt: string;
  }
  ```

* **ClientRecord (CRM)**:
  ```typescript
  interface ClientRecord {
    id: string;
    name: string;
    email: string;
    phone: string;
    location: string;
    totalBookings: number;
    totalSpent: string;
    lastVisit: string;
    services: string[];
  }
  ```

---

## 5. Execution Milestones

1. **Step 1: Core Base Migration & Dependencies**:
   * Port `glowlink-main` source files, Tailwind config, Radix UI components, and `glowlink.css` into the project root.
   * Mount React Router v6 and QueryClient provider in `src/App.tsx`.
2. **Step 2: Reactive State & Persistence Layer**:
   * Build `src/services/artisanStore.ts` with initial verified South African artisans.
   * Build `src/services/bookingStore.ts` with real booking submission and CRM synchronization.
   * Build `src/services/authStore.ts` for authenticated session handling.
3. **Step 3: Component & Flow Wiring**:
   * Connect `Home.tsx` search and category navigation to dynamic query parameters.
   * Wire `Search.tsx` filtering logic (text search, location, rating filter, price sorting).
   * Upgrade `Profile.tsx` to handle dynamic artisan IDs, interactive service selection, and live reservation modal.
   * Connect `Dashboard.tsx` to the live bookings store with status updates, cancellation, and customer records.
   * Wire `Login.tsx` and `RegisterArtist.tsx` with validation and redirection.
4. **Step 4: Mobile Ergonomics & PWA Setup**:
   * Add `MobileBottomNav.tsx` with haptic feedback.
   * Add PWA manifest and install trigger.
5. **Step 5: Visual Brand System & Hero Watermark Resolution**:
   * Replaced the static, truncated "GLO..." watermark with a seamless, right-to-left infinite looping marquee ticker.
   * Displays the full name "GLOWLINK" continuously in brand magenta `#db2979` with haute couture star dividers.
   * Bounded cleanly with `w-full overflow-hidden` to maintain 100% responsive containment across mobile and desktop viewports.
6. **Step 6: Verification & Compilation**:
   * Run full applet compilation and verify zero errors across all routes.
