import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, User, Search, MapPin, ShieldCheck, Calendar, Palette, HeartHandshake } from "lucide-react";
import { PWAInstallButton } from "@/components/PWAInstallButton";
import { triggerHaptic } from "@/services/haptics";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileSearchQuery.trim()) {
      navigate(`/search?service=${encodeURIComponent(mobileSearchQuery.trim())}`);
      setMobileMenuOpen(false);
      setMobileSearchQuery("");
    } else {
      navigate("/search");
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { path: "/search", label: "Artisans", desc: "Discover verified master stylists & specialists" },
    { path: "/how-it-works", label: "Experience", desc: "How bespoke appointments work" },
    { path: "/pricing", label: "Membership", desc: "Atelier tiers & private benefits" },
    { path: "/about", label: "Story", desc: "South Africa's curated beauty collective" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 px-3 sm:px-6 md:px-8 pt-3 sm:pt-4 pb-2 pointer-events-none transition-all duration-500">
        <div className="max-w-6xl mx-auto flex items-center justify-between pointer-events-auto">
          {/* Floating iOS Liquid Glass Pill Bar */}
          <div className="w-full flex items-center justify-between glass-pill-nav px-4 sm:px-6 py-2.5 sm:py-3 transition-all duration-500 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.03)]">
            
            {/* Brand Logo */}
            <Link
              to="/"
              onClick={() => triggerHaptic(10)}
              className="flex items-center gap-2 group transition-transform duration-300 active:scale-95"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 group-hover:rotate-12 transition-transform duration-500" />
              </div>
              <span className="text-lg sm:text-2xl font-serif italic tracking-tight text-neutral-900 font-medium">
                GlowLink
              </span>
            </Link>

            {/* Desktop Menu (Pill tabs) */}
            <nav className="hidden md:flex items-center gap-1.5 bg-neutral-100/70 p-1 rounded-full border border-neutral-200/50 backdrop-blur-md">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => triggerHaptic(8)}
                    className={`relative px-4 py-1.5 rounded-full text-xs tracking-wider uppercase font-medium transition-all duration-300 ${
                      active
                        ? "bg-white text-neutral-950 shadow-[0_2px_8px_rgba(0,0,0,0.08)] font-semibold"
                        : "text-neutral-600 hover:text-neutral-950 hover:bg-white/50"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Action Pills */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              <PWAInstallButton />

              <Link
                to="/search"
                aria-label="Search artisans"
                onClick={() => triggerHaptic(8)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100/80 transition-colors"
              >
                <Search className="w-4 h-4" />
              </Link>

              <Link
                to="/login"
                onClick={() => triggerHaptic(8)}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-medium text-neutral-700 hover:text-neutral-950 px-3 py-1.5 rounded-full hover:bg-neutral-100/80 transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>

              <button
                onClick={() => {
                  triggerHaptic(10);
                  navigate("/search");
                }}
                className="hidden xs:inline-flex bg-neutral-900 text-white hover:bg-black active:scale-95 px-3.5 sm:px-5 py-2 rounded-full text-[11px] sm:text-xs font-medium tracking-wider uppercase transition-all duration-300 shadow-sm items-center gap-1.5"
              >
                <span>Book Visit</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-70" />
              </button>

              {/* Hamburger Button for Mobile */}
              <button
                className="md:hidden relative w-10 h-10 rounded-full flex flex-col items-center justify-center gap-1.5 text-neutral-900 bg-neutral-100/80 hover:bg-neutral-200/80 active:scale-90 transition-all duration-300 focus:outline-none"
                onClick={() => {
                  triggerHaptic(12);
                  setMobileMenuOpen(!mobileMenuOpen);
                }}
                aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={mobileMenuOpen}
              >
                <span
                  className={`block w-5 h-0.5 bg-neutral-900 rounded-full transition-all duration-300 ease-out origin-center ${
                    mobileMenuOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                />
                <span
                  className={`block w-5 h-0.5 bg-neutral-900 rounded-full transition-all duration-200 ease-out ${
                    mobileMenuOpen ? "opacity-0 scale-x-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`block w-5 h-0.5 bg-neutral-900 rounded-full transition-all duration-300 ease-out origin-center ${
                    mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Full-Screen Liquid Glass Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex flex-col justify-between pt-20 sm:pt-24 pb-20 px-4 bg-[#FAF8F5]/95 backdrop-blur-2xl animate-in fade-in duration-300 overflow-y-auto">
          {/* Ambient Glows */}
          <div className="fixed top-12 right-6 w-64 h-64 bg-amber-100/60 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="fixed bottom-12 left-6 w-64 h-64 bg-rose-100/50 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="max-w-md w-full mx-auto flex flex-col space-y-5">
            {/* Mobile Instant Search Bar */}
            <form onSubmit={handleMobileSearch} className="relative w-full">
              <input
                type="text"
                placeholder="Search stylists, makeup, nails, skin..."
                value={mobileSearchQuery}
                onChange={(e) => setMobileSearchQuery(e.target.value)}
                className="w-full bg-white/80 border border-black/10 rounded-full pl-11 pr-10 py-3 text-xs tracking-wide placeholder:text-neutral-400 focus:bg-white focus:ring-2 focus:ring-black/5 shadow-sm"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              {mobileSearchQuery && (
                <button
                  type="submit"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-neutral-900 text-white w-7 h-7 rounded-full flex items-center justify-center shadow-sm"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            {/* Navigation Pill Links */}
            <div className="glass-panel p-3 border border-white/90 rounded-3xl shadow-lg shadow-black/[0.03] space-y-1.5">
              <Link
                to="/"
                className={`w-full px-4 py-3 rounded-2xl flex items-center justify-between transition-all duration-300 ${
                  location.pathname === "/"
                    ? "bg-neutral-900 text-white shadow-sm"
                    : "text-neutral-800 hover:bg-neutral-100/80"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${location.pathname === "/" ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-700"}`}>
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold uppercase tracking-widest">Sanctuary Home</p>
                    <p className={`text-[10px] ${location.pathname === "/" ? "text-neutral-300" : "text-neutral-500"}`}>Editorial beauty atelier</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 opacity-50" />
              </Link>

              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`w-full px-4 py-3 rounded-2xl flex items-center justify-between transition-all duration-300 ${
                      active
                        ? "bg-neutral-900 text-white shadow-sm"
                        : "text-neutral-800 hover:bg-neutral-100/80"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${active ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-700"}`}>
                        {link.label === "Artisans" && <Palette className="w-4 h-4" />}
                        {link.label === "Experience" && <ShieldCheck className="w-4 h-4" />}
                        {link.label === "Membership" && <HeartHandshake className="w-4 h-4" />}
                        {link.label === "Story" && <Sparkles className="w-4 h-4" />}
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-semibold uppercase tracking-widest">{link.label}</p>
                        <p className={`text-[10px] ${active ? "text-neutral-300" : "text-neutral-500"}`}>{link.desc}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 opacity-50" />
                  </Link>
                );
              })}
            </div>

            {/* Quick Portal & Artist Join Links */}
            <div className="grid grid-cols-2 gap-2.5">
              <Link
                to="/register-artist"
                className="glass-panel p-3.5 rounded-2xl text-center border border-white/80 hover:bg-white transition-all shadow-sm flex flex-col items-center justify-center"
              >
                <Palette className="w-4 h-4 text-neutral-700 mb-1.5" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-900">Join as Artisan</span>
                <span className="text-[9px] text-neutral-500">Apply for roster</span>
              </Link>

              <Link
                to="/dashboard"
                className="glass-panel p-3.5 rounded-2xl text-center border border-white/80 hover:bg-white transition-all shadow-sm flex flex-col items-center justify-center"
              >
                <Calendar className="w-4 h-4 text-neutral-700 mb-1.5" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-900">Artisan Portal</span>
                <span className="text-[9px] text-neutral-500">Manage bookings</span>
              </Link>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2.5 pt-2">
              <Link
                to="/search"
                className="w-full bg-neutral-900 text-white text-center py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest shadow-md hover:bg-black active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Book Master Artisan</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/login"
                className="w-full bg-white text-neutral-900 border border-black/10 text-center py-3 rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-neutral-50 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <User className="w-3.5 h-3.5 text-neutral-500" />
                <span>Client Sign In / Register</span>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-2 text-neutral-500 text-[10px] tracking-wider uppercase pt-2">
              <MapPin className="w-3 h-3 text-amber-600" />
              <span>Cape Town • Sandton • Durban • Pretoria</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
