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
        setPlaceholderText(currentWord.slice(0, state.charIndex));

        if (state.charIndex === 0) {
          state.isDeleting = false;
          state.serviceIndex = (state.serviceIndex + 1) % services.length;
          state.timeoutId = setTimeout(tick, 400);
          return;
        }
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
      return;
    }

    // Anime.js v4 Scoped container
    const scope = createScope({ root: heroEl });

    let mainTimeline: ReturnType<typeof createTimeline> | null = null;
    let shimmerAnim: ReturnType<typeof animate> | null = null;
    let kenBurnsAnim: ReturnType<typeof animate> | null = null;
    let arrowNudgeAnim: ReturnType<typeof animate> | null = null;
    let floatingAnims: Array<ReturnType<typeof animate>> = [];
    let textSplitterInstance: ReturnType<typeof splitText> | null = null;

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
    });

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
      floatingAnims.forEach((a) => a.pause());
      if (rAFRef.current) cancelAnimationFrame(rAFRef.current);
    };

    const resumeAllLoops = () => {
      arrowNudgeAnim?.play();
      kenBurnsAnim?.play();
      shimmerAnim?.play();
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
      document.removeEventListener("visibilitychange", handleVisibilityChange);

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
