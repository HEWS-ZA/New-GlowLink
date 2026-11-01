import { useEffect, useRef, useState, useCallback } from "react";
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

/**
 * =======================================================================
 * BACKGROUND BLOOM ANIMATION CONSTANTS (Anime.js v4)
 * Tunable settings for the hero background atmospheric bloom animation
 * =======================================================================
 */
export const BLOOM_CONFIG = {
  // Trigger mode: 'intro' (plays once after card reveal), 'hover' (on card hover/focus), or 'scroll' (scrubbed by scroll progress)
  trigger: "intro" as "intro" | "hover" | "scroll",

  // Bloom visual mode: 'A' (Color Bloom gradient from photo palette) or 'B' (Image Bleed with blurred photo copy)
  mode: "A" as "A" | "B",

  // Animation duration in ms (~1800ms per specification)
  duration: 1800,

  // Anime v4 standard string name (soft exponential deceleration)
  ease: "outExpo" as const,

  // Delay before bloom starts in 'intro' mode (synchronizes smoothly with visual card reveal)
  delay: 950,

  // Multiplier for farthest corner distance to guarantee seamless coverage at any aspect ratio
  scaleFallback: 1.08,

  // Secondary trailing ripple rings delay offset in ms for visual depth
  ripple1DelayOffset: 160,
  ripple2DelayOffset: 340,

  // Settled ambient breathing state (slow subtle drift after intro bloom settles)
  ambientBreathing: true,
  ambientDuration: 8500, // ms per full breath cycle
  ambientScaleMax: 1.035, // Low amplitude subtle breathing
};

/**
 * =======================================================================
 * TUNABLE ANIMATION & INTERACTION CONSTANTS
 * Adjust these values to tune speeds, intensity, parallax, and typewriter
 * =======================================================================
 */
export const HERO_ANIMATION_CONFIG = {
  // Intro Timeline Durations (in ms)
  introNavDuration: 750,
  introBadgeDuration: 650,
  wordRiseDuration: 800,
  wordStagger: 70, // ms between headline words
  iconDrawDuration: 750,
  subtextDuration: 750,
  searchBarDuration: 800,
  chipsStagger: 55,
  cardRevealDuration: 950,
  counterDuration: 1300,

  // Looping & Ambient Durations
  shimmerSweepDuration: 3200, // Shimmer sweep on "connects"
  shimmerInterval: 4500, // Interval between shimmer sweeps
  sparklePopDuration: 600,
  kenBurnsDuration: 14000, // Slow photo drift
  kenBurnsScale: 1.07, // Subtle zoom scale
  arrowNudgeDuration: 1800,
  cardBorderGlowDuration: 4000,

  // Floating Cosmetic Icons (Ambient layer)
  floatingIconsCountDesktop: 7,
  floatingIconsCountMobile: 3,
  driftMinDuration: 3600,
  driftMaxDuration: 5800,
  driftAmplitudeY: 12, // px
  driftAmplitudeX: 8, // px

  // Mouse Parallax Sensitivity
  parallaxCardStrength: 14, // Max px shift for hero visual card
  parallaxIconStrengthMultiplier: 32, // Max px shift for floating icons based on depth
  parallaxSmoothing: 0.08, // Lerp smoothing factor (lower = smoother/slower, higher = snappier)

  // Explore Button Magnetic Pull
  magneticPullMax: 6, // Max px displacement towards cursor

  // Typewriter Service Examples
  typewriterServices: [
    "Bridal makeup",
    "Locs & braids",
    "Balayage",
    "Nail couture",
  ],
  typewriterTypeSpeed: 75, // ms per char
  typewriterDeleteSpeed: 40, // ms per char
  typewriterPauseDuration: 2200, // ms pause when full word typed
};

export interface UseHeroAnimationProps {
  heroRef: React.RefObject<HTMLElement | null>;
  headlineRef: React.RefObject<HTMLHeadingElement | null>;
  connectsWordRef: React.RefObject<HTMLElement | null>;
  searchBarRef: React.RefObject<HTMLFormElement | null>;
  exploreButtonRef: React.RefObject<HTMLButtonElement | null>;
  visualCardRef: React.RefObject<HTMLDivElement | null>;
  photoRef: React.RefObject<HTMLImageElement | null>;
  ratingValRef: React.RefObject<HTMLSpanElement | null>;
  ratingCountRef: React.RefObject<HTMLSpanElement | null>;
  arrowButtonRef: React.RefObject<HTMLButtonElement | null>;
  isSearchActive: boolean; // if user typed or focused input
}

export function useHeroAnimation({
  heroRef,
  headlineRef,
  connectsWordRef,
  searchBarRef,
  exploreButtonRef,
  visualCardRef,
  photoRef,
  ratingValRef,
  ratingCountRef,
  arrowButtonRef,
  isSearchActive,
}: UseHeroAnimationProps) {
  // Dynamic Typewriter Placeholder for Service Input
  const [placeholderText, setPlaceholderText] = useState(
    HERO_ANIMATION_CONFIG.typewriterServices[0]
  );
  const typewriterStateRef = useRef({
    serviceIndex: 0,
    charIndex: 0,
    isDeleting: false,
    timeoutId: null as ReturnType<typeof setTimeout> | null,
  });

  // Parallax tracking refs
  const mouseCoordsRef = useRef({ targetX: 0, targetY: 0, currX: 0, currY: 0 });
  const isTouchRef = useRef(false);
  const rAFRef = useRef<number | null>(null);

  // Typewriter Loop
  useEffect(() => {
    if (isSearchActive) {
      return;
    }

    const services = HERO_ANIMATION_CONFIG.typewriterServices;

    const tick = () => {
      const state = typewriterStateRef.current;
      const currentWord = services[state.serviceIndex];

      if (!state.isDeleting) {
        state.charIndex++;
        setPlaceholderText(currentWord.slice(0, state.charIndex));

        if (state.charIndex === currentWord.length) {
          state.isDeleting = true;
          state.timeoutId = setTimeout(tick, HERO_ANIMATION_CONFIG.typewriterPauseDuration);
          return;
        }
        state.timeoutId = setTimeout(tick, HERO_ANIMATION_CONFIG.typewriterTypeSpeed);
      } else {
        state.charIndex--;
        if (state.charIndex <= 0) {
          state.isDeleting = false;
          state.serviceIndex = (state.serviceIndex + 1) % services.length;
          const nextWord = services[state.serviceIndex];
          state.charIndex = 1;
          setPlaceholderText(nextWord.slice(0, 1));
          state.timeoutId = setTimeout(tick, 200);
          return;
        }
        setPlaceholderText(currentWord.slice(0, state.charIndex));
        state.timeoutId = setTimeout(tick, HERO_ANIMATION_CONFIG.typewriterDeleteSpeed);
      }
    };

    typewriterStateRef.current.timeoutId = setTimeout(tick, 1000);

    return () => {
      if (typewriterStateRef.current.timeoutId) {
        clearTimeout(typewriterStateRef.current.timeoutId);
      }
    };
  }, [isSearchActive]);

  // Main Anime.js v4 Lifecycle inside createScope
  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl) return;

    // Detect touch device & prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    isTouchRef.current =
      typeof window !== "undefined" &&
      ("ontouchstart" in window || navigator.maxTouchPoints > 0);

    // If reduced motion is requested, show final state instantly
    if (prefersReducedMotion) {
      if (ratingValRef.current) ratingValRef.current.textContent = "4.98";
      if (ratingCountRef.current)
        ratingCountRef.current.textContent = "(4,200+ clients)";
      const bloomMain = heroEl.querySelector<HTMLElement>(".hero-bloom-main");
      if (bloomMain) {
        bloomMain.style.transform = "scale(1)";
        bloomMain.style.opacity = "1";
      }
      return;
    }

    // Anime.js v4 Scoped container
    const scope = createScope({ root: heroEl });

    let mainTimeline: ReturnType<typeof createTimeline> | null = null;
    let shimmerAnim: ReturnType<typeof animate> | null = null;
    let kenBurnsAnim: ReturnType<typeof animate> | null = null;
    let arrowNudgeAnim: ReturnType<typeof animate> | null = null;
    let ambientBloomAnim: ReturnType<typeof animate> | null = null;
    let floatingAnims: Array<ReturnType<typeof animate>> = [];
    let textSplitterInstance: ReturnType<typeof splitText> | null = null;

    // Bloom background elements
    const bloomMainEl = heroEl.querySelector<HTMLElement>(".hero-bloom-main");
    const bloomRipple1El = heroEl.querySelector<HTMLElement>(".hero-bloom-ripple-1");
    const bloomRipple2El = heroEl.querySelector<HTMLElement>(".hero-bloom-ripple-2");
    const bloomBleedEl = heroEl.querySelector<HTMLElement>(".hero-bloom-bleed");

    // Dynamic geometry calculator: calculates center of visual card relative to hero and farthest corner
    const calculateBloomGeometry = () => {
      if (!heroEl || !visualCardRef.current || !bloomMainEl) return null;
      const heroRect = heroEl.getBoundingClientRect();
      const cardRect = visualCardRef.current.getBoundingClientRect();

      // Guard against zero dimensions
      const heroW = heroRect.width || (typeof window !== "undefined" ? window.innerWidth : 1200);
      const heroH = heroRect.height || 600;

      const cardW = cardRect.width > 0 ? cardRect.width : 380;
      const cardH = cardRect.height > 0 ? cardRect.height : 480;
      const cardLeft = cardRect.width > 0 ? cardRect.left : heroRect.left + heroW * 0.7;
      const cardTop = cardRect.height > 0 ? cardRect.top : heroRect.top + heroH * 0.5;

      // Center of card relative to hero container
      const originX = cardLeft + cardW / 2 - heroRect.left;
      const originY = cardTop + cardH / 2 - heroRect.top;

      // Distances from card center to the 4 corners of hero container
      const d1 = Math.hypot(originX, originY);
      const d2 = Math.hypot(heroW - originX, originY);
      const d3 = Math.hypot(originX, heroH - originY);
      const d4 = Math.hypot(heroW - originX, heroH - originY);

      // Max radius with fallback overscan
      const maxRadius = Math.max(d1, d2, d3, d4, 750) * BLOOM_CONFIG.scaleFallback;
      const diameter = Math.ceil(maxRadius * 2);

      return { originX, originY, maxRadius, diameter };
    };

    const applyBloomGeometry = () => {
      const geom = calculateBloomGeometry();
      if (!geom || !bloomMainEl) return;
      const { originX, originY, maxRadius, diameter } = geom;

      const left = originX - maxRadius;
      const top = originY - maxRadius;

      bloomMainEl.style.width = `${diameter}px`;
      bloomMainEl.style.height = `${diameter}px`;
      bloomMainEl.style.left = `${left.toFixed(1)}px`;
      bloomMainEl.style.top = `${top.toFixed(1)}px`;
      bloomMainEl.style.transformOrigin = "center center";

      if (bloomRipple1El) {
        const r1 = maxRadius * 1.15;
        const d1 = Math.ceil(r1 * 2);
        bloomRipple1El.style.width = `${d1}px`;
        bloomRipple1El.style.height = `${d1}px`;
        bloomRipple1El.style.left = `${(originX - r1).toFixed(1)}px`;
        bloomRipple1El.style.top = `${(originY - r1).toFixed(1)}px`;
        bloomRipple1El.style.transformOrigin = "center center";
      }

      if (bloomRipple2El) {
        const r2 = maxRadius * 1.28;
        const d2 = Math.ceil(r2 * 2);
        bloomRipple2El.style.width = `${d2}px`;
        bloomRipple2El.style.height = `${d2}px`;
        bloomRipple2El.style.left = `${(originX - r2).toFixed(1)}px`;
        bloomRipple2El.style.top = `${(originY - r2).toFixed(1)}px`;
        bloomRipple2El.style.transformOrigin = "center center";
      }
    };

    // Initialize bloom element geometry and schedule layout passes
    applyBloomGeometry();
    if (typeof window !== "undefined") {
      requestAnimationFrame(applyBloomGeometry);
      setTimeout(applyBloomGeometry, 120);
    }

    scope.add(() => {
      // 1. Text Splitter for display headline
      if (headlineRef.current) {
        try {
          textSplitterInstance = splitText(headlineRef.current, {
            accessible: true,
          });
        } catch {
          // Graceful fallback if text splitting encounters any environment quirks
        }
      }

      // 2. Build Intro Timeline (~2.5s total with overlapping staggers)
      mainTimeline = createTimeline({
        defaults: {
          ease: "outCubic",
        },
      });

      // A) Floating Navigation Pill (found in root or via selector)
      const navPill = document.querySelector(".glass-pill-nav");
      if (navPill) {
        mainTimeline.add(
          navPill,
          {
            translateY: [-22, 0],
            opacity: [0, 1],
            duration: HERO_ANIMATION_CONFIG.introNavDuration,
            ease: "outQuad",
          },
          0
        );
      }

      // B) Eyebrow Badge & Sparkle rotation
      const eyebrow = heroEl.querySelector(".hero-eyebrow");
      const eyebrowSparkle = heroEl.querySelector(".hero-eyebrow-sparkle");
      if (eyebrow) {
        mainTimeline.add(
          eyebrow,
          {
            translateX: [-24, 0],
            opacity: [0, 1],
            duration: HERO_ANIMATION_CONFIG.introBadgeDuration,
          },
          150
        );
      }
      if (eyebrowSparkle) {
        mainTimeline.add(
          eyebrowSparkle,
          {
            rotate: [0, 180],
            scale: [0.8, 1],
            duration: 900,
            ease: "outBack",
          },
          250
        );
      }

      // C) Headline Words: rise from masked lines with subtle blur-to-sharp
      const wordsToAnimate = textSplitterInstance?.words?.length
        ? textSplitterInstance.words
        : Array.from(heroEl.querySelectorAll(".hero-word"));

      if (wordsToAnimate.length > 0) {
        mainTimeline.add(
          wordsToAnimate,
          {
            translateY: [28, 0],
            opacity: [0, 1],
            filter: ["blur(6px)", "blur(0px)"],
            duration: HERO_ANIMATION_CONFIG.wordRiseDuration,
            delay: stagger(HERO_ANIMATION_CONFIG.wordStagger),
            ease: "outCubic",
          },
          300
        );
      }

      // D) Inline Cosmetic SVG Icons: draw themselves in with createDrawable
      const headlineIconsSvg = heroEl.querySelectorAll(".hero-headline-icon svg path, .hero-headline-icon svg line, .hero-headline-icon svg ellipse, .hero-headline-icon svg rect");
      if (headlineIconsSvg.length > 0) {
        try {
          const drawables = createDrawable(headlineIconsSvg, 0, 0);
          mainTimeline.add(
            drawables,
            {
              draw: ["0 0", "0 1"],
              duration: HERO_ANIMATION_CONFIG.iconDrawDuration,
              delay: stagger(40),
              ease: "outCubic",
            },
            550
          );
        } catch {
          // Fallback opacity fade
          mainTimeline.add(
            heroEl.querySelectorAll(".hero-headline-icon"),
            {
              opacity: [0, 1],
              scale: [0.7, 1],
              duration: 600,
              delay: stagger(100),
            },
            600
          );
        }
      }

      // E) Subtext fade up
      const subtext = heroEl.querySelector(".hero-subtext");
      if (subtext) {
        mainTimeline.add(
          subtext,
          {
            translateY: [16, 0],
            opacity: [0, 1],
            duration: HERO_ANIMATION_CONFIG.subtextDuration,
          },
          700
        );
      }

      // F) Glass Search Bar: subtle scale & soft glow
      if (searchBarRef.current) {
        mainTimeline.add(
          searchBarRef.current,
          {
            scale: [0.96, 1],
            opacity: [0, 1],
            duration: HERO_ANIMATION_CONFIG.searchBarDuration,
            ease: "outQuad",
          },
          850
        );
      }

      // G) Popular Chips stagger
      const chips = heroEl.querySelectorAll(".hero-chip");
      if (chips.length > 0) {
        mainTimeline.add(
          chips,
          {
            translateY: [12, 0],
            opacity: [0, 1],
            duration: 600,
            delay: stagger(HERO_ANIMATION_CONFIG.chipsStagger),
          },
          1050
        );
      }

      // H) Visual Card reveal (scale & opacity)
      if (visualCardRef.current) {
        mainTimeline.add(
          visualCardRef.current,
          {
            scale: [0.94, 1],
            opacity: [0, 1],
            duration: HERO_ANIMATION_CONFIG.cardRevealDuration,
            ease: "outCubic",
          },
          600
        );
      }

      // I) Verified Badge slide in & green dot pulse
      const verifiedBadge = heroEl.querySelector(".hero-verified-badge");
      if (verifiedBadge) {
        mainTimeline.add(
          verifiedBadge,
          {
            translateX: [-18, 0],
            opacity: [0, 1],
            duration: 700,
          },
          1100
        );
      }

      // J) Rating Card slide up
      const ratingCard = heroEl.querySelector(".hero-rating-card");
      if (ratingCard) {
        mainTimeline.add(
          ratingCard,
          {
            translateY: [24, 0],
            opacity: [0, 1],
            duration: 750,
          },
          1250
        );
      }

      // K) Numerical counters: 4.98 and 4,200+
      const counterTarget = { rating: 0, clients: 0 };
      mainTimeline.add(
        counterTarget,
        {
          rating: 4.98,
          clients: 4200,
          duration: HERO_ANIMATION_CONFIG.counterDuration,
          ease: "outExpo",
          onUpdate: () => {
            if (ratingValRef.current) {
              ratingValRef.current.textContent = counterTarget.rating.toFixed(2);
            }
            if (ratingCountRef.current) {
              ratingCountRef.current.textContent = `(${Math.floor(
                counterTarget.clients
              ).toLocaleString()}+ clients)`;
            }
          },
        },
        1350
      );

      // L) Background Bloom Animation (Anime.js v4)
      // Atmospheric color/glow spreads outward from the visual card center to cover the hero background
      if (bloomMainEl && BLOOM_CONFIG.trigger === "intro") {
        // Mode A: Color Bloom expanding radially outward
        mainTimeline.add(
          bloomMainEl,
          {
            scale: [0, 1],
            opacity: [0, 1],
            duration: BLOOM_CONFIG.duration,
            ease: BLOOM_CONFIG.ease,
            onComplete: () => {
              // Initiate subtle ambient breathing state on desktop
              if (
                BLOOM_CONFIG.ambientBreathing &&
                typeof window !== "undefined" &&
                window.innerWidth >= 640 &&
                heroEl.isConnected
              ) {
                ambientBloomAnim = animate(bloomMainEl, {
                  scale: [1, BLOOM_CONFIG.ambientScaleMax],
                  opacity: [0.94, 1],
                  duration: BLOOM_CONFIG.ambientDuration,
                  alternate: true,
                  loop: true,
                  ease: "inOutSine",
                });
              }
            },
          },
          BLOOM_CONFIG.delay
        );

        // Secondary Trailing Ripple Ring 1 (desktop & tablet for rich depth)
        if (bloomRipple1El && typeof window !== "undefined" && window.innerWidth >= 640) {
          mainTimeline.add(
            bloomRipple1El,
            {
              scale: [0, 1],
              opacity: [0, 0.45, 0],
              duration: Math.round(BLOOM_CONFIG.duration * 0.95),
              ease: "outQuad",
            },
            BLOOM_CONFIG.delay + BLOOM_CONFIG.ripple1DelayOffset
          );
        }

        // Secondary Trailing Ripple Ring 2 (desktop & tablet for rich depth)
        if (bloomRipple2El && typeof window !== "undefined" && window.innerWidth >= 640) {
          mainTimeline.add(
            bloomRipple2El,
            {
              scale: [0, 1],
              opacity: [0, 0.3, 0],
              duration: Math.round(BLOOM_CONFIG.duration * 0.95),
              ease: "outQuad",
            },
            BLOOM_CONFIG.delay + BLOOM_CONFIG.ripple2DelayOffset
          );
        }

        // Mode B: Optional Image Bleed layer revealed via circular clip path
        if (BLOOM_CONFIG.mode === "B" && bloomBleedEl) {
          const geom = calculateBloomGeometry();
          if (geom) {
            const { originX, originY, maxRadius } = geom;
            mainTimeline.add(
              bloomBleedEl,
              {
                clipPath: [
                  `circle(0px at ${originX.toFixed(1)}px ${originY.toFixed(1)}px)`,
                  `circle(${maxRadius.toFixed(1)}px at ${originX.toFixed(1)}px ${originY.toFixed(1)}px)`,
                ],
                opacity: [0, 0.75],
                duration: BLOOM_CONFIG.duration,
                ease: BLOOM_CONFIG.ease,
              },
              BLOOM_CONFIG.delay
            );
          }
        }
      }

      // =====================================================================
      // 3. Ambient & Looping Layers (Starts after or alongside intro)
      // =====================================================================

      // A) Arrow button gentle nudge loop
      if (arrowButtonRef.current) {
        arrowNudgeAnim = animate(arrowButtonRef.current, {
          translateX: [0, 4, 0],
          duration: HERO_ANIMATION_CONFIG.arrowNudgeDuration,
          loop: true,
          ease: "inOutSine",
        });
      }

      // B) Ken Burns very slow photo zoom
      if (photoRef.current) {
        kenBurnsAnim = animate(photoRef.current, {
          scale: [1, HERO_ANIMATION_CONFIG.kenBurnsScale],
          duration: HERO_ANIMATION_CONFIG.kenBurnsDuration,
          alternate: true,
          loop: true,
          ease: "inOutQuad",
        });
      }

      // C) Shimmer sweep across the pink italic word "connects"
      const shimmerEl = heroEl.querySelector(".connects-shimmer-sweep");
      const sparklePopEl = heroEl.querySelector(".connects-sparkle-pop");
      if (shimmerEl) {
        shimmerAnim = animate(shimmerEl, {
          translateX: ["-120%", "220%"],
          duration: HERO_ANIMATION_CONFIG.shimmerSweepDuration,
          loop: true,
          ease: "inOutCubic",
          onLoop: () => {
            if (sparklePopEl) {
              animate(sparklePopEl, {
                scale: [0.6, 1.3, 1],
                opacity: [0.4, 1, 0.7],
                rotate: [0, 90],
                duration: HERO_ANIMATION_CONFIG.sparklePopDuration,
                ease: "outBack",
              });
            }
          },
        });
      }

      // D) Idle float for inline headline icons
      const inlineIcons = heroEl.querySelectorAll(".hero-headline-icon");
      if (inlineIcons.length > 0) {
        animate(inlineIcons, {
          translateY: [-2, 2],
          rotate: [-3, 3],
          duration: 3200,
          alternate: true,
          loop: true,
          delay: stagger(300),
          ease: "inOutSine",
        });
      }

      // E) Floating cosmetic icons drifting around the visual card
      const floatingIcons = heroEl.querySelectorAll(".hero-floating-icon");
      floatingIcons.forEach((el, index) => {
        const duration =
          HERO_ANIMATION_CONFIG.driftMinDuration +
          (index % 3) * 800 +
          Math.random() * 600;
        const driftY =
          (index % 2 === 0 ? 1 : -1) *
          (HERO_ANIMATION_CONFIG.driftAmplitudeY + (index % 4) * 3);
        const driftX =
          (index % 3 === 0 ? 1 : -1) *
          (HERO_ANIMATION_CONFIG.driftAmplitudeX + (index % 3) * 2);

        const anim = animate(el, {
          translateY: [-driftY, driftY],
          translateX: [-driftX, driftX],
          rotate: [-6, 6],
          duration,
          alternate: true,
          loop: true,
          ease: "inOutSine",
        });
        floatingAnims.push(anim);
      });

      // F) Background Bloom Interactive Triggers ('hover' or 'scroll')
      if (BLOOM_CONFIG.trigger === "hover" && visualCardRef.current && bloomMainEl) {
        const card = visualCardRef.current;
        const handleCardEnter = () => {
          animate(bloomMainEl, {
            scale: [0, 1],
            opacity: [0, 1],
            duration: 1200,
            ease: "outCubic",
          });
          if (bloomRipple1El && typeof window !== "undefined" && window.innerWidth >= 640) {
            animate(bloomRipple1El, {
              scale: [0, 1],
              opacity: [0, 0.45, 0],
              duration: 1050,
              ease: "outQuad",
            });
          }
        };
        const handleCardLeave = () => {
          animate(bloomMainEl, {
            scale: [1, 0],
            opacity: [1, 0],
            duration: 900,
            ease: "inOutQuad",
          });
        };
        card.addEventListener("mouseenter", handleCardEnter);
        card.addEventListener("mouseleave", handleCardLeave);
        card.addEventListener("focusin", handleCardEnter);
        card.addEventListener("focusout", handleCardLeave);
      }
    });

    // Bloom Scroll Trigger Listener
    let handleBloomScroll: (() => void) | null = null;
    if (BLOOM_CONFIG.trigger === "scroll" && bloomMainEl) {
      handleBloomScroll = () => {
        const rect = heroEl.getBoundingClientRect();
        const viewH = window.innerHeight;
        const progress = Math.min(1, Math.max(0, 1 - rect.top / (viewH * 0.6)));
        bloomMainEl.style.transform = `translate(-50%, -50%) scale(${progress.toFixed(3)})`;
        bloomMainEl.style.opacity = `${progress.toFixed(3)}`;
      };
      window.addEventListener("scroll", handleBloomScroll, { passive: true });
      handleBloomScroll();
    }

    // Dynamic Resize & Orientation change handling for bloom coverage
    const resizeObserver = new ResizeObserver(() => {
      applyBloomGeometry();
    });
    resizeObserver.observe(heroEl);
    if (visualCardRef.current) {
      resizeObserver.observe(visualCardRef.current);
    }
    const handleResize = () => {
      applyBloomGeometry();
    };
    window.addEventListener("resize", handleResize, { passive: true });

    // =======================================================================
    // 4. Mouse Parallax (Desktop only, spring-smoothed)
    // =======================================================================
    const handleMouseMove = (e: MouseEvent) => {
      if (isTouchRef.current) return;
      const rect = heroEl.getBoundingClientRect();
      // Normalized offset from center [-1, 1]
      const halfW = rect.width / 2;
      const halfH = rect.height / 2;
      const targetX = (e.clientX - rect.left - halfW) / halfW;
      const targetY = (e.clientY - rect.top - halfH) / halfH;

      mouseCoordsRef.current.targetX = Math.max(-1, Math.min(1, targetX));
      mouseCoordsRef.current.targetY = Math.max(-1, Math.min(1, targetY));
    };

    const handleMouseLeave = () => {
      mouseCoordsRef.current.targetX = 0;
      mouseCoordsRef.current.targetY = 0;
    };

    // Parallax Render Loop using Lerp smoothing
    const updateParallax = () => {
      const coords = mouseCoordsRef.current;
      coords.currX += (coords.targetX - coords.currX) * HERO_ANIMATION_CONFIG.parallaxSmoothing;
      coords.currY += (coords.targetY - coords.currY) * HERO_ANIMATION_CONFIG.parallaxSmoothing;

      // Apply to visual card
      if (visualCardRef.current) {
        const cardX = coords.currX * HERO_ANIMATION_CONFIG.parallaxCardStrength;
        const cardY = coords.currY * HERO_ANIMATION_CONFIG.parallaxCardStrength;
        visualCardRef.current.style.transform = `translate3d(${cardX.toFixed(2)}px, ${cardY.toFixed(2)}px, 0)`;
      }

      // Apply to ambient floating icons with varied depth attributes
      const floatingElements = heroEl.querySelectorAll<HTMLElement>("[data-parallax-depth]");
      floatingElements.forEach((el) => {
        const depth = parseFloat(el.getAttribute("data-parallax-depth") || "1");
        const iconX = coords.currX * depth * HERO_ANIMATION_CONFIG.parallaxIconStrengthMultiplier;
        const iconY = coords.currY * depth * HERO_ANIMATION_CONFIG.parallaxIconStrengthMultiplier;
        el.style.transform = `translate3d(${iconX.toFixed(2)}px, ${iconY.toFixed(2)}px, 0)`;
      });

      rAFRef.current = requestAnimationFrame(updateParallax);
    };

    if (!isTouchRef.current) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
      heroEl.addEventListener("mouseleave", handleMouseLeave);
      rAFRef.current = requestAnimationFrame(updateParallax);
    }

    // =======================================================================
    // 5. Explore Button Magnetic Pull & Shine Sweep
    // =======================================================================
    const exploreBtn = exploreButtonRef.current;
    let handleBtnMouseMove: ((e: MouseEvent) => void) | null = null;
    let handleBtnMouseLeave: (() => void) | null = null;

    if (exploreBtn && !isTouchRef.current) {
      handleBtnMouseMove = (e: MouseEvent) => {
        const rect = exploreBtn.getBoundingClientRect();
        const offsetX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const offsetY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
        const moveX = offsetX * HERO_ANIMATION_CONFIG.magneticPullMax;
        const moveY = offsetY * HERO_ANIMATION_CONFIG.magneticPullMax;

        exploreBtn.style.transform = `translate3d(${moveX.toFixed(1)}px, ${moveY.toFixed(1)}px, 0)`;
      };

      handleBtnMouseLeave = () => {
        exploreBtn.style.transform = "translate3d(0, 0, 0)";
      };

      exploreBtn.addEventListener("mousemove", handleBtnMouseMove);
      exploreBtn.addEventListener("mouseleave", handleBtnMouseLeave);
    }

    // =======================================================================
    // 6. Visibility & Off-screen Performance Optimization
    // Pause loops when hero is scrolled out of viewport or browser tab is hidden
    // =======================================================================
    const pauseAllLoops = () => {
      arrowNudgeAnim?.pause();
      kenBurnsAnim?.pause();
      shimmerAnim?.pause();
      ambientBloomAnim?.pause();
      floatingAnims.forEach((a) => a.pause());
      if (rAFRef.current) cancelAnimationFrame(rAFRef.current);
    };

    const resumeAllLoops = () => {
      arrowNudgeAnim?.play();
      kenBurnsAnim?.play();
      shimmerAnim?.play();
      ambientBloomAnim?.play();
      floatingAnims.forEach((a) => a.play());
      if (!isTouchRef.current) {
        rAFRef.current = requestAnimationFrame(updateParallax);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        pauseAllLoops();
      } else {
        resumeAllLoops();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            resumeAllLoops();
          } else {
            pauseAllLoops();
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(heroEl);

    // =======================================================================
    // Cleanup (survives React 19 StrictMode double-mounting)
    // =======================================================================
    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
      if (handleBloomScroll) {
        window.removeEventListener("scroll", handleBloomScroll);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      ambientBloomAnim?.pause();

      if (!isTouchRef.current) {
        window.removeEventListener("mousemove", handleMouseMove);
        heroEl.removeEventListener("mouseleave", handleMouseLeave);
        if (rAFRef.current) cancelAnimationFrame(rAFRef.current);
      }

      if (exploreBtn && handleBtnMouseMove && handleBtnMouseLeave) {
        exploreBtn.removeEventListener("mousemove", handleBtnMouseMove);
        exploreBtn.removeEventListener("mouseleave", handleBtnMouseLeave);
      }

      if (textSplitterInstance) {
        try {
          textSplitterInstance.revert();
        } catch {
          // Ignore
        }
      }

      // Revert scope cleanly
      scope.revert();
    };
  }, [
    heroRef,
    headlineRef,
    connectsWordRef,
    searchBarRef,
    exploreButtonRef,
    visualCardRef,
    photoRef,
    ratingValRef,
    ratingCountRef,
    arrowButtonRef,
  ]);

  return {
    placeholderText,
  };
}
