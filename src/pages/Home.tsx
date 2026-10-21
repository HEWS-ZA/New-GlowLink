import { useState, useEffect } from "react";
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

const Home = () => {
  const navigate = useNavigate();
  const [serviceSearch, setServiceSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const artisans = getStoredArtisans();

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
    <div className="bg-[#FAF8F5] text-neutral-900 overflow-x-hidden selection:bg-neutral-900 selection:text-white min-h-screen">
      <Header />

      {/* Atmospheric Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 right-[-10%] w-[600px] h-[600px] rounded-full bg-amber-100/40 blur-3xl" />
        <div className="absolute top-[30%] -left-32 w-[500px] h-[500px] rounded-full bg-rose-50/50 blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex flex-col justify-between pt-28 sm:pt-32 pb-12 px-6 sm:px-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center my-auto">
          {/* Left Column: Vision & Brand statement */}
          <div className="lg:col-span-7 space-y-6 animate-on-scroll">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-neutral-200/80 shadow-xs backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-neutral-700">
                South Africa’s Curated Beauty Atelier
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal leading-[1.08] tracking-tight text-neutral-950">
              Where beauty <span className="italic font-normal">connects</span> with mastery.
            </h1>

            <p className="text-base sm:text-lg text-neutral-600 font-light leading-relaxed max-w-xl">
              Discover verified master stylists, makeup artists, and aesthetic specialists. Book bespoke mobile appointments or private studio visits in seconds.
            </p>

            {/* iOS Liquid Glass Pill Search */}
            <div className="pt-2">
              <form
                onSubmit={handleSearch}
                className="glass-search-pill p-2 sm:p-2.5 flex flex-col sm:flex-row items-center gap-2 shadow-[0_12px_36px_-6px_rgba(0,0,0,0.08)] border border-white/90"
              >
                <div className="flex-1 w-full flex items-center px-4 py-2 border-b sm:border-b-0 sm:border-r border-neutral-200/60">
                  <Search size={18} className="text-neutral-400 mr-2.5 shrink-0" />
                  <input
                    type="text"
                    placeholder="Bridal makeup, hair salon, braids..."
                    value={serviceSearch}
                    onChange={(e) => setServiceSearch(e.target.value)}
                    className="w-full bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none border-none p-0 !border-0 !bg-transparent"
                  />
                </div>

                <div className="w-full sm:w-44 flex items-center px-4 py-2">
                  <MapPin size={16} className="text-neutral-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    placeholder="Sandton, Cape Town..."
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    className="w-full bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none border-none p-0 !border-0 !bg-transparent"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto bg-neutral-950 text-white px-7 py-3 rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-neutral-800 active:scale-95 transition-all duration-300 shadow-sm shrink-0"
                >
                  Explore
                </button>
              </form>

              {/* Quick Tags */}
              <div className="flex flex-wrap items-center gap-2 mt-4 text-xs text-neutral-500">
                <span className="font-medium text-neutral-400">Popular:</span>
                {["Bridal Glam", "Locs & Braids", "Balayage", "Nail Couture"].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      triggerHaptic(8);
                      setServiceSearch(tag);
                      navigate(`/search?service=${encodeURIComponent(tag)}`);
                    }}
                    className="px-3 py-1 rounded-full bg-white/70 hover:bg-white border border-neutral-200/70 text-neutral-700 hover:text-neutral-950 transition-all shadow-2xs"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Card with curved liquid glass */}
          <div className="lg:col-span-5 animate-on-scroll delay-100">
            <div className="relative group">
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.12)] border-4 border-white aspect-[4/5] bg-neutral-100">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1600&q=80"
                  alt="GlowLink Master Model"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                
                {/* Floating Glass Pill Highlights */}
                <div className="absolute top-6 left-6 glass-panel px-4 py-2.5 rounded-full flex items-center gap-2.5 shadow-sm border border-white/90">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-medium text-neutral-900 tracking-wide">
                    Live Verified Booking
                  </span>
                </div>

                <div className="absolute bottom-6 inset-x-6 glass-panel p-5 rounded-3xl border border-white/90 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1 text-amber-500 mb-1">
                        <Star size={14} className="fill-amber-400" />
                        <span className="text-xs font-bold text-neutral-900">4.98</span>
                        <span className="text-[11px] text-neutral-500 font-normal">(4,200+ clients)</span>
                      </div>
                      <h4 className="text-sm font-serif italic text-neutral-900 font-medium">
                        Top Rated South African Artists
                      </h4>
                    </div>
                    <button
                      onClick={() => {
                        triggerHaptic(10);
                        navigate("/search");
                      }}
                      className="w-10 h-10 rounded-full bg-neutral-950 text-white flex items-center justify-center hover:bg-neutral-800 transition-colors shadow-xs"
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

        {/* Brand Overlay */}
        <div className="relative w-full pt-12 text-center select-none pointer-events-none">
          <h2 className="font-serif text-[18vw] leading-none tracking-tight font-bold text-neutral-900/5 select-none">
            GLOWLINK
          </h2>
        </div>
      </section>

      {/* Aesthetic Excellence / The GlowLink Concept */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-white/60 border-t border-neutral-200/70 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div className="lg:col-span-5 animate-on-scroll">
            <span className="text-xs font-semibold tracking-[0.2em] text-neutral-500 uppercase block mb-3">
              The Philosophy
            </span>
            <h3 className="font-serif text-3xl sm:text-5xl tracking-tight text-neutral-950 mb-6 leading-tight">
              Aesthetic refinement, curated for you.
            </h3>
            <p className="text-neutral-600 font-light leading-relaxed mb-8 text-base sm:text-lg">
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
                  className="p-5 rounded-2xl bg-white/80 border border-neutral-200/70 hover:border-neutral-900/20 hover:shadow-xs transition-all duration-300 cursor-pointer flex items-start gap-4 group"
                >
                  <span className="font-serif italic text-lg text-neutral-400 group-hover:text-neutral-950 transition-colors font-medium">
                    {item.no}
                  </span>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-neutral-900 group-hover:text-black mb-1 flex items-center justify-between">
                      <span>{item.title}</span>
                      <ChevronRight size={16} className="text-neutral-400 group-hover:translate-x-1 transition-transform" />
                    </h4>
                    <p className="text-xs text-neutral-500 font-light">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 animate-on-scroll">
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-4 sm:space-y-6">
                <div className="rounded-3xl overflow-hidden aspect-[3/4] bg-neutral-100 shadow-md border-2 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1000&q=80"
                    alt="Haute Beauty"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="glass-panel p-6 rounded-3xl text-center">
                  <span className="font-serif italic text-3xl font-medium text-neutral-950 block">4.9 ★</span>
                  <span className="text-xs uppercase tracking-widest text-neutral-500 font-medium">Verified Satisfaction</span>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6 pt-8">
                <div className="glass-panel p-6 rounded-3xl text-center">
                  <span className="font-serif italic text-3xl font-medium text-neutral-950 block">5,000+</span>
                  <span className="text-xs uppercase tracking-widest text-neutral-500 font-medium">Master Artisans</span>
                </div>
                <div className="rounded-3xl overflow-hidden aspect-[3/4] bg-neutral-100 shadow-md border-2 border-white">
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
      <section id="specialties" className="py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 sm:mb-16 animate-on-scroll">
          <div>
            <span className="text-xs font-semibold tracking-[0.2em] text-neutral-500 uppercase block mb-3">
              Categories
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl tracking-tight text-neutral-950">
              Curated <span className="italic font-normal">Specialties</span>
            </h2>
          </div>
          <button
            onClick={() => {
              triggerHaptic(8);
              navigate("/search");
            }}
            className="mt-6 md:mt-0 inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-neutral-700 hover:text-neutral-950 transition-colors"
          >
            <span>Explore All 6 Disciplines</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((cat, idx) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="group relative h-64 rounded-3xl overflow-hidden bg-neutral-900 cursor-pointer animate-on-scroll shadow-sm hover:shadow-xl transition-all duration-500 border border-white/80"
              style={{ transitionDelay: `${idx * 50}ms` }}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              <div className="absolute inset-0 p-5 flex flex-col justify-between z-10">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white group-hover:bg-white group-hover:text-black transition-all duration-300">
                  <cat.icon size={18} />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-neutral-300 block mb-1 font-medium">
                    {cat.subtitle}
                  </span>
                  <h3 className="font-serif text-lg text-white font-medium group-hover:text-amber-200 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] text-neutral-300 font-light block mt-0.5">
                    {cat.count}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Master Artisans */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-white/60 border-t border-neutral-200/70">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 sm:mb-16 animate-on-scroll">
            <div>
              <span className="text-xs font-semibold tracking-[0.2em] text-neutral-500 uppercase block mb-3">
                Master Roster
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl tracking-tight text-neutral-950">
                Featured <span className="italic font-normal">Artisans</span>
              </h2>
            </div>
            <button
              onClick={() => {
                triggerHaptic(8);
                navigate("/search");
              }}
              className="mt-6 md:mt-0 inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-neutral-700 hover:text-neutral-950 transition-colors"
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
                  <div className="relative w-full aspect-[4/3] md:aspect-[16/9] overflow-hidden rounded-3xl bg-neutral-900 border-4 border-white shadow-md group-hover:shadow-2xl transition-all duration-500">
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                    <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full flex justify-between items-end">
                      <div>
                        <div className="flex items-center gap-2 mb-2.5">
                          <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-[10px] uppercase tracking-widest text-white rounded-full font-medium border border-white/20">
                            {artist.tag}
                          </span>
                          <span className="text-neutral-200 text-xs tracking-wide flex items-center gap-1 font-medium">
                            <Star size={12} className="text-amber-400 fill-amber-400" />
                            {artist.rating} ({artist.reviewsCount} reviews)
                          </span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-serif text-white mb-1">
                          {artist.name}
                        </h3>
                        <p className="text-neutral-300 text-sm font-light">
                          {artist.specialty} • {artist.location}
                        </p>
                      </div>

                      <div className="w-11 h-11 rounded-full bg-white text-neutral-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <ArrowRight size={16} />
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
      <section className="py-20 md:py-28 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="glass-card-highlight p-10 md:p-16 text-center relative overflow-hidden border border-white/90 shadow-xl">
          <div className="relative z-10 max-w-2xl mx-auto animate-on-scroll">
            <span className="text-xs uppercase tracking-[0.25em] text-neutral-500 mb-3 block font-semibold">
              For Professional Stylists & Salons
            </span>
            <h2 className="font-serif italic text-3xl sm:text-5xl text-neutral-950 mb-5 leading-tight">
              Grow your beauty patronage with GlowLink.
            </h2>
            <p className="text-neutral-600 text-sm sm:text-base font-light mb-8 leading-relaxed">
              Join elite South African beauty professionals. Receive guaranteed client reservations, automated calendar management, and premium studio visibility.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  triggerHaptic(10);
                  navigate("/register-artist");
                }}
                className="bg-neutral-950 text-white px-8 py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800 active:scale-95 transition-all shadow-md"
              >
                Apply as an Artist
              </button>
              <button
                onClick={() => {
                  triggerHaptic(10);
                  navigate("/pricing");
                }}
                className="bg-white text-neutral-900 border border-neutral-300 px-8 py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold hover:bg-neutral-50 active:scale-95 transition-all shadow-xs"
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
