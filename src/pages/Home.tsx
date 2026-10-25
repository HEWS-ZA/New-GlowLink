import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Sparkles,
  Scissors,
  Smile,
  GitMerge,
  Star,
  ArrowRight,
  MapPin,
  ChevronRight,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { triggerHaptic } from "@/services/haptics";
import { getStoredArtisans } from "@/services/artisanStore";
import { useHeroAnimation } from "@/hooks/useHeroAnimation";
import {
  LipstickIcon,
  NailPolishIcon,
  MascaraWandIcon,
  MakeupBrushIcon,
  CompactMirrorIcon,
  PerfumeBottleIcon,
  CombScissorsIcon,
  SparkleIcon,
} from "@/components/CosmeticIcons";

const Home = () => {
  const navigate = useNavigate();
  const [serviceSearch, setServiceSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const artisans = getStoredArtisans();

  // Animation Refs
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const connectsWordRef = useRef<HTMLSpanElement | null>(null);
  const searchBarRef = useRef<HTMLFormElement | null>(null);
  const exploreButtonRef = useRef<HTMLButtonElement | null>(null);
  const visualCardRef = useRef<HTMLDivElement | null>(null);
  const photoRef = useRef<HTMLImageElement | null>(null);
  const ratingValRef = useRef<HTMLSpanElement | null>(null);
  const ratingCountRef = useRef<HTMLSpanElement | null>(null);
  const arrowButtonRef = useRef<HTMLButtonElement | null>(null);

  // Typewriter placeholder and Anime.js v4 integration
  const { placeholderText } = useHeroAnimation({
    heroRef: heroSectionRef,
    headlineRef,
    connectsWordRef,
    searchBarRef,
    exploreButtonRef,
    visualCardRef,
    photoRef,
    ratingValRef,
    ratingCountRef,
    arrowButtonRef,
    isSearchActive: isInputFocused || !!serviceSearch,
  });

  const categories = [
    {
      id: "makeup",
      name: "Makeup",
      subtitle: "Editorial & Bridal",
      icon: Smile,
      count: "1,240+ Artisans",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80",
    },
    {
      id: "hair-styling",
      name: "Hair Styling",
      subtitle: "Couture & Volume",
      icon: Scissors,
      count: "980+ Artisans",
      image: "https://images.unsplash.com/photo-1560869713-571ebd71be4e?w=800&q=80",
    },
    {
      id: "nails",
      name: "Nails & Lashes",
      subtitle: "Haute Manicure",
      icon: Sparkles,
      count: "750+ Technicians",
      image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80",
    },
    {
      id: "braids",
      name: "Braids & Locs",
      subtitle: "Artisan Plaits",
      icon: GitMerge,
      count: "620+ Stylists",
      image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800&q=80",
    },
    {
      id: "barbering",
      name: "Barbering",
      subtitle: "Precision Grooming",
      icon: Scissors,
      count: "540+ Barbers",
      image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80",
    },
    {
      id: "skincare",
      name: "Aesthetics",
      subtitle: "Holistic Facials",
      icon: Sparkles,
      count: "410+ Specialists",
      image: "https://images.unsplash.com/photo-1512290900672-1f02a7b8e5c8?w=800&q=80",
    },
  ];

  const featuredArtists = artisans.slice(0, 4);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic(12);
    navigate(`/search?service=${encodeURIComponent(serviceSearch)}&location=${encodeURIComponent(locationSearch)}`);
  };

  const handleCategoryClick = (categoryId: string) => {
    triggerHaptic(10);
    navigate(`/search?category=${categoryId}`);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" }
    );

    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-white dark:bg-[#17111D] text-[#501854] dark:text-[#D4C7E1] overflow-x-hidden selection:bg-[#DB2777] selection:text-white min-h-screen transition-colors duration-300">
      <Header />

      {/* Atmospheric Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 right-[-10%] w-[600px] h-[600px] rounded-full bg-pink-100/50 dark:bg-pink-950/20 blur-3xl" />
        <div className="absolute top-[30%] -left-32 w-[500px] h-[500px] rounded-full bg-purple-100/40 dark:bg-purple-950/20 blur-3xl" />
      </div>

      {/* Hero Section */}
      <section 
        ref={heroSectionRef}
        className="relative w-full flex flex-col justify-center pt-24 sm:pt-32 pb-12 sm:pb-16 px-3.5 sm:px-8 md:px-10 max-w-7xl mx-auto overflow-clip"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto">
          {/* Left Column: Vision & Brand statement */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            <div className="hero-eyebrow inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#FAF2FA] dark:bg-[#372E3E] border border-[#EFBDEB] dark:border-[#3B3237] shadow-xs backdrop-blur-md">
              <Sparkles className="hero-eyebrow-sparkle w-3.5 h-3.5 text-[#DB2777]" />
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-semibold text-[#501854] dark:text-[#D4C7E1]">
                South Africa’s Curated Beauty Atelier
              </span>
            </div>

            <h1 
              ref={headlineRef}
              aria-label="Where beauty connects with mastery."
              className="font-serif text-[clamp(1.75rem,5.5vw,4.5rem)] font-normal leading-[1.14] tracking-tight text-[#501854] dark:text-[#D4C7E1] break-words text-balance"
            >
              <span className="hero-word-mask">
                <span className="hero-word inline-block">Where</span>
              </span>{" "}
              <span className="hero-headline-icon inline-block align-baseline mx-0.5" aria-hidden="true">
                <LipstickIcon className="headline-icon-draw" />
              </span>{" "}
              <span className="hero-word-mask">
                <span className="hero-word inline-block">beauty</span>
              </span>{" "}
              <span className="hero-word-mask">
                <span
                  ref={connectsWordRef}
                  className="hero-word hero-connects-container italic font-normal text-[#DB2777] inline-block relative"
                >
                  connects
                  <span className="connects-shimmer-sweep" />
                </span>
              </span>{" "}
              <span className="hero-headline-icon inline-block align-baseline mx-0.5 relative" aria-hidden="true">
                <SparkleIcon className="headline-icon-draw connects-sparkle-pop" />
              </span>{" "}
              <span className="hero-word-mask">
                <span className="hero-word inline-block">with</span>
              </span>{" "}
              <span className="hero-word-mask">
                <span className="hero-word inline-block">mastery.</span>
              </span>{" "}
              <span className="hero-headline-icon inline-block align-baseline ml-1" aria-hidden="true">
                <MakeupBrushIcon className="headline-icon-draw" />
              </span>
            </h1>

            <p className="hero-subtext text-sm sm:text-base md:text-lg text-[#7E4882] dark:text-[#A695B8] font-light leading-relaxed max-w-xl">
              Discover verified master stylists, makeup artists, and aesthetic specialists. Book bespoke mobile appointments or private studio visits in seconds.
            </p>

            {/* iOS Liquid Glass Pill Search (Stacks on mobile, row on tablet/desktop) */}
            <div className="pt-1 sm:pt-2">
              <form
                ref={searchBarRef}
                onSubmit={handleSearch}
                className="glass-search-pill p-1.5 sm:p-2.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shadow-[0_12px_36px_-6px_rgba(80,24,84,0.1)] border border-[#EFBDEB] dark:border-[#3B3237] w-full"
              >
                <div className="flex-1 w-full flex items-center px-3.5 sm:px-4 py-2.5 min-h-[44px] border-b sm:border-b-0 sm:border-r border-[#EFBDEB]/60 dark:border-[#3B3237]">
                  <Search size={18} className="text-[#8C3B8A] dark:text-[#A695B8] mr-2.5 shrink-0" />
                  <input
                    type="text"
                    placeholder={isInputFocused ? "Bridal makeup, hair salon, braids..." : placeholderText}
                    value={serviceSearch}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                    onChange={(e) => setServiceSearch(e.target.value)}
                    className="w-full bg-transparent text-sm text-[#501854] dark:text-[#D4C7E1] placeholder:text-[#8C3B8A]/60 dark:placeholder:text-[#A695B8]/60 focus:outline-none border-none p-0 !border-0 !bg-transparent min-h-[36px]"
                  />
                </div>

                <div className="w-full sm:w-44 flex items-center px-3.5 sm:px-4 py-2.5 min-h-[44px]">
                  <MapPin size={16} className="text-[#8C3B8A] dark:text-[#A695B8] mr-2 shrink-0" />
                  <input
                    type="text"
                    placeholder="Sandton, Cape Town..."
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    className="w-full bg-transparent text-sm text-[#501854] dark:text-[#D4C7E1] placeholder:text-[#8C3B8A]/60 dark:placeholder:text-[#A695B8]/60 focus:outline-none border-none p-0 !border-0 !bg-transparent min-h-[36px]"
                  />
                </div>

                <button
                  ref={exploreButtonRef}
                  type="submit"
                  className="explore-btn-wrapper w-full sm:w-auto bg-[#501854] dark:bg-[#DB2777] text-white px-7 py-3 rounded-full text-xs font-semibold uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all duration-300 shadow-sm shrink-0 min-h-[44px] flex items-center justify-center"
                >
                  Explore
                </button>
              </form>

              {/* Quick Tags - wrap cleanly */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-3.5 sm:mt-4 text-xs text-[#7E4882] dark:text-[#A695B8]">
                <span className="font-semibold text-[#501854] dark:text-[#D4C7E1] shrink-0">Popular:</span>
                {["Bridal Glam", "Locs & Braids", "Balayage", "Nail Couture"].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      triggerHaptic(8);
                      setServiceSearch(tag);
                      navigate(`/search?service=${encodeURIComponent(tag)}`);
                    }}
                    className="hero-chip px-3 py-1.5 rounded-full bg-[#FAF2FA] dark:bg-[#372E3E] hover:bg-[#F3E2F2] dark:hover:bg-[#3E343C] border border-[#EFBDEB] dark:border-[#3B3237] text-[#501854] dark:text-[#D4C7E1] transition-all shadow-2xs text-[11px] min-h-[32px]"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Card with capped height and clipped floating elements */}
          <div className="lg:col-span-5 w-full">
            <div className="relative group max-w-[360px] sm:max-w-md lg:max-w-none mx-auto overflow-clip sm:overflow-visible">
              {/* Ambient Floating Cosmetic Icons & Twinkling Sparkles (Depth Parallax Layer) */}
              <div className="absolute -inset-2 sm:-inset-6 pointer-events-none z-20 overflow-hidden sm:overflow-visible">
                {/* 1. Floating Perfume Flacon - Top Right */}
                <div
                  className="hero-floating-icon absolute -top-1 -right-1 sm:-right-6 p-2 rounded-2xl bg-white/80 dark:bg-[#241C2B]/85 backdrop-blur-md border border-[#EFBDEB]/70 dark:border-[#3B3237] shadow-sm text-[#501854] dark:text-[#D4C7E1] opacity-90 transition-transform"
                  data-parallax-depth="0.9"
                >
                  <PerfumeBottleIcon style={{ width: "20px", height: "20px" }} />
                </div>

                {/* 2. Floating Nail Polish - Bottom Left */}
                <div
                  className="hero-floating-icon absolute -bottom-1 -left-1 sm:-left-6 p-2 rounded-2xl bg-white/80 dark:bg-[#241C2B]/85 backdrop-blur-md border border-[#EFBDEB]/70 dark:border-[#3B3237] shadow-sm text-[#501854] dark:text-[#D4C7E1] opacity-85 transition-transform"
                  data-parallax-depth="0.75"
                >
                  <NailPolishIcon style={{ width: "18px", height: "18px" }} />
                </div>

                {/* 3. Floating Compact Mirror - Top Left (Desktop only to prevent mobile overflow) */}
                <div
                  className="hero-floating-icon hidden sm:block absolute -top-5 left-4 sm:left-8 p-2 rounded-2xl bg-white/80 dark:bg-[#241C2B]/85 backdrop-blur-md border border-[#EFBDEB]/70 dark:border-[#3B3237] shadow-sm text-[#501854] dark:text-[#D4C7E1] opacity-90 transition-transform"
                  data-parallax-depth="1.1"
                >
                  <CompactMirrorIcon style={{ width: "20px", height: "20px" }} />
                </div>

                {/* 4. Floating Comb & Shears - Middle Right (Desktop only) */}
                <div
                  className="hero-floating-icon hidden md:block absolute top-1/2 -right-7 p-2 rounded-2xl bg-white/70 dark:bg-[#241C2B]/75 backdrop-blur-md border border-[#EFBDEB]/60 dark:border-[#3B3237] shadow-xs text-[#501854] dark:text-[#D4C7E1] opacity-75 transition-transform"
                  data-parallax-depth="0.6"
                >
                  <CombScissorsIcon style={{ width: "20px", height: "20px" }} />
                </div>

                {/* 5. Floating Mascara Wand - Lower Right (Desktop only) */}
                <div
                  className="hero-floating-icon hidden md:block absolute bottom-24 -right-4 p-2 rounded-2xl bg-white/70 dark:bg-[#241C2B]/75 backdrop-blur-md border border-[#EFBDEB]/60 dark:border-[#3B3237] shadow-xs text-[#501854] dark:text-[#D4C7E1] opacity-75 transition-transform"
                  data-parallax-depth="0.8"
                >
                  <MascaraWandIcon style={{ width: "19px", height: "19px" }} />
                </div>

                {/* 6. Twinkling Sparkle 1 - Upper Center */}
                <div
                  className="hero-floating-icon absolute top-5 right-1/4 opacity-95 transition-transform"
                  data-parallax-depth="1.2"
                >
                  <SparkleIcon style={{ width: "16px", height: "16px" }} className="animate-pulse" />
                </div>

                {/* 7. Twinkling Sparkle 2 - Lower Center (Desktop only) */}
                <div
                  className="hero-floating-icon hidden sm:block absolute bottom-3 left-1/3 opacity-80 transition-transform"
                  data-parallax-depth="0.5"
                >
                  <SparkleIcon style={{ width: "15px", height: "15px" }} />
                </div>
              </div>

              {/* Main Visual Card Container with capped height on mobile */}
              <div 
                ref={visualCardRef}
                className="relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-[0_25px_60px_-15px_rgba(80,24,84,0.15)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] border-3 sm:border-4 border-[#EFBDEB] dark:border-[#3B3237] aspect-[4/5] max-h-[380px] sm:max-h-[460px] lg:max-h-[580px] w-full bg-[#FAF2FA] dark:bg-[#241C2B] hero-card-glow transition-shadow duration-500"
              >
                <img
                  ref={photoRef}
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1600&q=80"
                  alt="GlowLink Master Model"
                  className="w-full h-full object-cover will-change-transform"
                />
                
                {/* Floating Glass Pill Highlights */}
                <div className="hero-verified-badge absolute top-4 sm:top-6 left-4 sm:left-6 glass-panel px-3 sm:px-4 py-2 sm:py-2.5 rounded-full flex items-center gap-2 sm:gap-2.5 shadow-sm border border-[#EFBDEB] dark:border-[#3B3237] z-10">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] sm:text-xs font-medium text-[#501854] dark:text-[#D4C7E1] tracking-wide">
                    Live Verified Booking
                  </span>
                </div>

                <div className="hero-rating-card absolute bottom-6 inset-x-6 glass-panel p-5 rounded-3xl border border-[#EFBDEB] dark:border-[#3B3237] shadow-lg z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1 text-[#DB2777] mb-1">
                        <Star size={14} className="fill-[#DB2777]" />
                        <span ref={ratingValRef} className="text-xs font-bold text-[#501854] dark:text-[#D4C7E1]">
                          4.98
                        </span>
                        <span ref={ratingCountRef} className="text-[11px] text-[#7E4882] dark:text-[#A695B8] font-normal">
                          (4,200+ clients)
                        </span>
                      </div>
                      <h4 className="text-sm font-serif italic text-[#501854] dark:text-[#D4C7E1] font-medium">
                        Top Rated South African Artists
                      </h4>
                    </div>
                    <button
                      ref={arrowButtonRef}
                      onClick={() => {
                        triggerHaptic(10);
                        navigate("/search");
                      }}
                      className="w-10 h-10 rounded-full bg-[#501854] dark:bg-[#DB2777] text-white flex items-center justify-center hover:opacity-90 transition-colors shadow-xs"
                      aria-label="View artisans"
                    >
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Infinite Looping GLOWLINK Marquee Banner under Hero */}
      <section 
        className="w-full overflow-hidden border-y border-[#EFBDEB] dark:border-[#3B3237] bg-[#FAF2FA]/50 dark:bg-[#241C2B]/50 py-4 sm:py-6 select-none"
        aria-label="GLOWLINK System Ticker"
      >
        <div className="flex w-max animate-glowlink-marquee">
          {/* Loop Set 1 */}
          <div className="flex shrink-0 items-center">
            {[...Array(6)].map((_, i) => (
              <span key={`glowlink-set1-${i}`} className="inline-flex items-center">
                <span 
                  className="font-serif font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-wider uppercase glowlink-brand-text px-4 sm:px-8 whitespace-nowrap"
                  style={{ color: "#db2979" }}
                >
                  GLOWLINK
                </span>
                <span className="text-[#db2979]/40 text-xl sm:text-3xl md:text-4xl px-2 select-none">
                  ✦
                </span>
              </span>
            ))}
          </div>

          {/* Loop Set 2 (Identical duplicate for seamless infinite loop) */}
          <div className="flex shrink-0 items-center" aria-hidden="true">
            {[...Array(6)].map((_, i) => (
              <span key={`glowlink-set2-${i}`} className="inline-flex items-center">
                <span 
                  className="font-serif font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-wider uppercase glowlink-brand-text px-4 sm:px-8 whitespace-nowrap"
                  style={{ color: "#db2979" }}
                >
                  GLOWLINK
                </span>
                <span className="text-[#db2979]/40 text-xl sm:text-3xl md:text-4xl px-2 select-none">
                  ✦
                </span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Aesthetic Excellence / The GlowLink Concept */}
      <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 bg-[#FAF2FA]/50 dark:bg-[#241C2B]/40 relative transition-colors">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div className="lg:col-span-5 animate-on-scroll">
            <span className="text-xs font-semibold tracking-[0.2em] text-[#DB2777] uppercase block mb-3">
              The Philosophy
            </span>
            <h3 className="font-serif text-3xl sm:text-5xl tracking-tight text-[#501854] dark:text-[#D4C7E1] mb-6 leading-tight">
              Aesthetic refinement, curated for you.
            </h3>
            <p className="text-[#7E4882] dark:text-[#A695B8] font-light leading-relaxed mb-8 text-base sm:text-lg">
              Every professional on GlowLink is vetted for creative artistry, hygiene protocols, and exceptional customer experience. We take the friction out of high-end beauty booking.
            </p>

            <div className="space-y-4">
              {[
                {
                  no: "01",
                  title: "Master Portfolio Curation",
                  desc: "Every artist undergoes portfolio verification and live skill inspection.",
                  link: "/about",
                },
                {
                  no: "02",
                  title: "Private Studio or Mobile Visits",
                  desc: "Opt for a tranquil salon atelier or private home visit at your convenience.",
                  link: "/how-it-works",
                },
                {
                  no: "03",
                  title: "Transparent Bespoke Rates",
                  desc: "Guaranteed upfront pricing without surprise studio fees or hidden additions.",
                  link: "/pricing",
                },
              ].map((item) => (
                <div
                  key={item.no}
                  onClick={() => {
                    triggerHaptic(8);
                    navigate(item.link);
                  }}
                  className="p-5 rounded-2xl bg-white dark:bg-[#241C2B] border border-[#EFBDEB] dark:border-[#3B3237] hover:border-[#DB2777] hover:shadow-xs transition-all duration-300 cursor-pointer flex items-start gap-4 group"
                >
                  <span className="font-serif italic text-lg text-[#DB2777] font-medium">
                    {item.no}
                  </span>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-[#501854] dark:text-[#D4C7E1] group-hover:text-[#DB2777] mb-1 flex items-center justify-between transition-colors">
                      <span>{item.title}</span>
                      <ChevronRight size={16} className="text-[#8C3B8A] dark:text-[#A695B8] group-hover:translate-x-1 transition-transform" />
                    </h4>
                    <p className="text-xs text-[#7E4882] dark:text-[#A695B8] font-light">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 animate-on-scroll">
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-4 sm:space-y-6">
                <div className="rounded-3xl overflow-hidden aspect-[3/4] bg-[#FAF2FA] dark:bg-[#241C2B] shadow-md border-2 border-[#EFBDEB] dark:border-[#3B3237]">
                  <img
                    src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1000&q=80"
                    alt="Haute Beauty"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="glass-panel p-4 sm:p-6 rounded-2xl sm:rounded-3xl text-center border border-[#EFBDEB] dark:border-[#3B3237]">
                  <span className="font-serif italic text-2xl sm:text-3xl font-medium text-[#501854] dark:text-[#D4C7E1] block">4.9 ★</span>
                  <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#7E4882] dark:text-[#A695B8] font-medium">Verified Satisfaction</span>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6 pt-8">
                <div className="glass-panel p-4 sm:p-6 rounded-2xl sm:rounded-3xl text-center border border-[#EFBDEB] dark:border-[#3B3237]">
                  <span className="font-serif italic text-2xl sm:text-3xl font-medium text-[#501854] dark:text-[#D4C7E1] block">5,000+</span>
                  <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#7E4882] dark:text-[#A695B8] font-medium">Master Artisans</span>
                </div>
                <div className="rounded-3xl overflow-hidden aspect-[3/4] bg-[#FAF2FA] dark:bg-[#241C2B] shadow-md border-2 border-[#EFBDEB] dark:border-[#3B3237]">
                  <img
                    src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&q=80"
                    alt="Salon Studio"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Specialties / Categories */}
      <section id="specialties" className="py-16 md:py-32 px-4 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 sm:mb-16 animate-on-scroll">
          <div>
            <span className="text-xs font-semibold tracking-[0.2em] text-[#DB2777] uppercase block mb-3">
              Categories
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl tracking-tight text-[#501854] dark:text-[#D4C7E1]">
              Curated <span className="italic font-normal text-[#DB2777]">Specialties</span>
            </h2>
          </div>
          <button
            onClick={() => {
              triggerHaptic(8);
              navigate("/search");
            }}
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#501854] dark:text-[#D4C7E1] hover:text-[#DB2777] transition-colors"
          >
            <span>Explore All 6 Disciplines</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-6">
          {categories.map((cat, idx) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="group relative h-64 rounded-3xl overflow-hidden bg-[#501854] dark:bg-[#241C2B] cursor-pointer animate-on-scroll shadow-sm hover:shadow-xl transition-all duration-500 border border-[#EFBDEB] dark:border-[#3B3237] hover:border-[#DB2777]"
              style={{ transitionDelay: `${idx * 50}ms` }}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              <div className="absolute inset-0 p-5 flex flex-col justify-between z-10">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white group-hover:bg-[#DB2777] group-hover:border-[#DB2777] transition-all duration-300">
                  <cat.icon size={18} />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-pink-200 block mb-1 font-medium">
                    {cat.subtitle}
                  </span>
                  <h3 className="font-serif text-lg text-white font-medium group-hover:text-pink-300 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] text-pink-100/80 font-light block mt-0.5">
                    {cat.count}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Master Artisans */}
      <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 bg-[#FAF2FA]/50 dark:bg-[#241C2B]/40 border-t border-[#EFBDEB] dark:border-[#3B3237] transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 sm:mb-16 animate-on-scroll">
            <div>
              <span className="text-xs font-semibold tracking-[0.2em] text-[#DB2777] uppercase block mb-3">
                Master Roster
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl tracking-tight text-[#501854] dark:text-[#D4C7E1]">
                Featured <span className="italic font-normal text-[#DB2777]">Artisans</span>
              </h2>
            </div>
            <button
              onClick={() => {
                triggerHaptic(8);
                navigate("/search");
              }}
              className="mt-6 md:mt-0 inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#501854] dark:text-[#D4C7E1] hover:text-[#DB2777] transition-colors"
            >
              <span>View Full Roster</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
            {featuredArtists.map((artist, idx) => {
              const colSpan = idx === 0 || idx === 3 ? "md:col-span-8" : "md:col-span-4";
              return (
                <div
                  key={artist.id}
                  onClick={() => {
                    triggerHaptic(10);
                    navigate(`/profile/${artist.id}`);
                  }}
                  className={`${colSpan} group relative animate-on-scroll cursor-pointer`}
                >
                  <div className="relative w-full aspect-[4/3] md:aspect-[16/9] overflow-hidden rounded-3xl bg-[#501854] dark:bg-[#241C2B] border-4 border-[#EFBDEB] dark:border-[#3B3237] shadow-md group-hover:shadow-2xl transition-all duration-500 group-hover:border-[#DB2777]">
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                    <div className="absolute bottom-0 left-0 p-4 sm:p-6 md:p-8 w-full flex justify-between items-end gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 bg-white/20 backdrop-blur-md text-[9px] sm:text-[10px] uppercase tracking-widest text-white rounded-full font-medium border border-white/20">
                            {artist.tag}
                          </span>
                          <span className="text-pink-200 text-[11px] sm:text-xs tracking-wide flex items-center gap-1 font-medium">
                            <Star size={11} className="text-[#DB2777] fill-[#DB2777]" />
                            {artist.rating} ({artist.reviewsCount})
                          </span>
                        </div>
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-serif text-white mb-0.5 truncate">
                          {artist.name}
                        </h3>
                        <p className="text-pink-100/80 text-xs sm:text-sm font-light truncate">
                          {artist.specialty} • {artist.location}
                        </p>
                      </div>

                      <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#501854] dark:bg-[#DB2777] text-white flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <ArrowRight size={15} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Artisan Invitation Banner */}
      <section className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 md:px-12 max-w-6xl mx-auto">
        <div className="glass-panel p-6 sm:p-10 md:p-16 rounded-2xl sm:rounded-3xl text-center relative overflow-hidden border border-[#EFBDEB] dark:border-[#3B3237] shadow-xl">
          <div className="relative z-10 max-w-2xl mx-auto animate-on-scroll">
            <span className="text-xs uppercase tracking-[0.25em] text-[#DB2777] mb-3 block font-semibold">
              For Professional Stylists & Salons
            </span>
            <h2 className="font-serif italic text-3xl sm:text-5xl text-[#501854] dark:text-[#D4C7E1] mb-5 leading-tight">
              Grow your beauty patronage with GlowLink.
            </h2>
            <p className="text-[#7E4882] dark:text-[#A695B8] text-sm sm:text-base font-light mb-8 leading-relaxed">
              Join elite South African beauty professionals. Receive guaranteed client reservations, automated calendar management, and premium studio visibility.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  triggerHaptic(10);
                  navigate("/register-artist");
                }}
                className="bg-[#501854] dark:bg-[#DB2777] text-white px-8 py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold hover:opacity-90 active:scale-95 transition-all shadow-md"
              >
                Apply as an Artist
              </button>
              <button
                onClick={() => {
                  triggerHaptic(10);
                  navigate("/pricing");
                }}
                className="bg-white dark:bg-[#372E3E] text-[#501854] dark:text-[#D4C7E1] border border-[#EFBDEB] dark:border-[#3B3237] px-8 py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold hover:bg-[#FAF2FA] dark:hover:bg-[#3E343C] active:scale-95 transition-all shadow-xs"
              >
                View Plans
              </button>
            </div>
          </div>
        </div>
      </section>

      <ScrollToTop />
      <Footer />
    </div>
  );
};

export default Home;
