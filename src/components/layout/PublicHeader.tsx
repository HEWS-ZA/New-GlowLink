import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  User,
  LogOut,
  Search,
  MapPin,
  ShieldCheck,
  Palette,
  HeartHandshake,
} from "lucide-react";
import { PWAInstallButton } from "@/components/PWAInstallButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { triggerHaptic } from "@/services/haptics";
import { useAuth, logoutArtisan } from "@/services/authStore";
import { toast } from "sonner";

export const PublicHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isResolved } = useAuth();

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

  const handleSignOut = () => {
    triggerHaptic(12);
    logoutArtisan();
    toast.success("Successfully signed out.");
    navigate("/", { replace: true });
  };

  const navLinks = [
    { path: "/search", label: "Artisans", desc: "Discover verified master stylists & specialists" },
    { path: "/how-it-works", label: "Experience", desc: "How bespoke appointments work" },
    { path: "/pricing", label: "Membership", desc: "Atelier tiers & private benefits" },
    { path: "/about", label: "Story", desc: "South Africa's curated beauty collective" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 px-2 sm:px-6 md:px-8 pt-2.5 sm:pt-4 pb-2 pointer-events-none transition-all duration-300">
        <div className="max-w-6xl mx-auto flex items-center justify-between pointer-events-auto">
          {/* Floating iOS Liquid Glass Pill Bar */}
          <div className="w-full flex items-center justify-between glass-pill-nav px-2.5 sm:px-5 py-1.5 sm:py-2.5 transition-all duration-300 gap-1.5 sm:gap-4">
            
            {/* Brand Logo */}
            <Link
              to="/"
              onClick={() => triggerHaptic(10)}
              className="flex items-center gap-1.5 sm:gap-2 group transition-transform duration-300 active:scale-95 shrink-0"
              aria-label="GlowLink Home"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#501854] dark:bg-[#DB2777] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform duration-300">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-200 group-hover:rotate-12 transition-transform duration-500" />
              </div>
              <span className="text-base sm:text-xl md:text-2xl font-serif italic tracking-tight text-[#501854] dark:text-[#D4C7E1] font-medium">
                GlowLink
              </span>
            </Link>

            {/* Desktop Menu (Pill tabs) */}
            <nav className="hidden lg:flex items-center gap-1.5 bg-[#FAF2FA]/90 dark:bg-[#372E3E]/70 p-1 rounded-full border border-[#EFBDEB]/60 dark:border-[#3B3237] backdrop-blur-md">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => triggerHaptic(8)}
                    className={`relative px-3.5 py-1.5 rounded-full text-xs tracking-wider uppercase font-medium transition-all duration-300 whitespace-nowrap shrink-0 ${
                      active
                        ? "bg-[#501854] text-white dark:bg-[#DB2777] shadow-[0_2px_8px_rgba(80,24,84,0.2)] font-semibold"
                        : "text-[#501854]/80 dark:text-[#D4C7E1]/80 hover:text-[#501854] dark:hover:text-white hover:bg-white/60 dark:hover:bg-[#3E343C]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Action Pills & Controls (ZERO notifications bell, ZERO console links) */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              {/* Theme Toggle Button */}
              <ThemeToggle />

              <PWAInstallButton />

              {/* Search Icon Link */}
              <Link
                to="/search"
                aria-label="Search artisans"
                onClick={() => triggerHaptic(8)}
                className="w-8 h-8 sm:w-9 sm:h-9 min-w-[32px] min-h-[32px] rounded-full flex items-center justify-center text-[#501854] dark:text-[#D4C7E1] hover:bg-[#FAF2FA] dark:hover:bg-[#372E3E] transition-colors"
              >
                <Search className="w-4 h-4" />
              </Link>

              {/* AUTH BUTTON (Zero layout shift, same size in all states) */}
              <div className="relative inline-flex items-center shrink-0">
                {!isResolved ? (
                  <div
                    className="w-[84px] sm:w-[94px] h-[34px] rounded-full border border-transparent bg-transparent pointer-events-none opacity-0"
                    aria-hidden="true"
                  />
                ) : isAuthenticated ? (
                  <button
                    type="button"
                    onClick={handleSignOut}
                    aria-label="Sign out"
                    className="w-[84px] sm:w-[94px] h-[34px] inline-flex items-center justify-center gap-1.5 text-[11px] sm:text-xs uppercase tracking-wider font-semibold text-[#501854] dark:text-[#D4C7E1] px-2.5 sm:px-3 rounded-full hover:bg-[#FAF2FA] dark:hover:bg-[#372E3E] border border-[#EFBDEB]/80 dark:border-[#3B3237] hover:border-[#DB2777] active:scale-95 transition-all duration-200 shadow-2xs whitespace-nowrap"
                  >
                    <LogOut className="w-3.5 h-3.5 shrink-0 text-[#DB2777]" />
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => triggerHaptic(8)}
                    aria-label="Sign in"
                    className="w-[84px] sm:w-[94px] h-[34px] inline-flex items-center justify-center gap-1.5 text-[11px] sm:text-xs uppercase tracking-wider font-semibold text-[#501854] dark:text-[#D4C7E1] px-2.5 sm:px-3 rounded-full hover:bg-[#FAF2FA] dark:hover:bg-[#372E3E] border border-[#EFBDEB]/80 dark:border-[#3B3237] hover:border-[#DB2777] active:scale-95 transition-all duration-200 shadow-2xs whitespace-nowrap"
                  >
                    <User className="w-3.5 h-3.5 shrink-0 text-[#8C3B8A] dark:text-[#A695B8]" />
                    <span>Sign In</span>
                  </Link>
                )}
              </div>

              {/* Book Visit CTA */}
              <button
                onClick={() => {
                  triggerHaptic(10);
                  navigate("/search");
                }}
                className="hidden md:inline-flex bg-[#501854] text-white hover:bg-[#3e1241] dark:bg-[#DB2777] dark:hover:bg-[#be185d] active:scale-95 px-3.5 sm:px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 shadow-sm items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <span>Book Visit</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-80" />
              </button>

              {/* Hamburger Button for Mobile Drawer */}
              <button
                className="lg:hidden relative w-8 h-8 sm:w-9 sm:h-9 min-w-[32px] min-h-[32px] rounded-full flex flex-col items-center justify-center gap-1.5 text-[#501854] dark:text-[#D4C7E1] bg-[#FAF2FA] dark:bg-[#372E3E] border border-[#EFBDEB] dark:border-[#3B3237] active:scale-90 transition-all duration-300 focus:outline-none shrink-0"
                onClick={() => {
                  triggerHaptic(12);
                  setMobileMenuOpen(!mobileMenuOpen);
                }}
                aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={mobileMenuOpen}
              >
                <span
                  className={`block w-4 h-0.5 bg-current rounded-full transition-all duration-300 ease-out origin-center ${
                    mobileMenuOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                />
                <span
                  className={`block w-4 h-0.5 bg-current rounded-full transition-all duration-200 ease-out ${
                    mobileMenuOpen ? "opacity-0 scale-x-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`block w-4 h-0.5 bg-current rounded-full transition-all duration-300 ease-out origin-center ${
                    mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Full-Screen Liquid Glass Mobile Drawer Overlay for Public Users */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-between pt-20 sm:pt-24 pb-[calc(5rem+env(safe-area-inset-bottom))] px-4 bg-white/95 dark:bg-[#17111D]/98 backdrop-blur-2xl animate-in fade-in duration-300 overflow-y-auto">
          {/* Ambient Glows */}
          <div className="fixed top-12 right-6 w-64 h-64 bg-pink-300/20 dark:bg-pink-900/20 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="fixed bottom-12 left-6 w-64 h-64 bg-purple-300/20 dark:bg-purple-900/20 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="max-w-md w-full mx-auto flex flex-col space-y-4">
            {/* Theme Toggle Bar in Mobile Drawer */}
            <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-[#FAF2FA] dark:bg-[#372E3E] border border-[#EFBDEB] dark:border-[#3B3237]">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#501854] dark:text-[#D4C7E1]">
                Theme Appearance
              </span>
              <ThemeToggle showLabel />
            </div>

            {/* Mobile Instant Search Bar */}
            <form onSubmit={handleMobileSearch} className="relative w-full">
              <input
                type="text"
                placeholder="Search stylists, makeup, nails, skin..."
                value={mobileSearchQuery}
                onChange={(e) => setMobileSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-[#3E343C] border border-[#E7C1DC] dark:border-[#3B3237] rounded-full pl-11 pr-10 py-3 text-xs tracking-wide placeholder:text-[#8C3B8A]/60 dark:placeholder:text-[#A695B8] focus:ring-2 focus:ring-[#DB2777] shadow-sm min-h-[44px]"
              />
              <Search className="w-4 h-4 text-[#8C3B8A] dark:text-[#A695B8] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              {mobileSearchQuery && (
                <button
                  type="submit"
                  aria-label="Submit search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#501854] dark:bg-[#DB2777] text-white w-8 h-8 rounded-full flex items-center justify-center shadow-sm"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            {/* Navigation Pill Links */}
            <div className="glass-panel p-3 border border-[#EFBDEB] dark:border-[#3B3237] rounded-3xl shadow-lg space-y-1.5">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`w-full px-4 py-3 rounded-2xl flex items-center justify-between transition-all duration-300 min-h-[44px] ${
                  location.pathname === "/"
                    ? "bg-[#501854] dark:bg-[#DB2777] text-white shadow-sm"
                    : "text-[#501854] dark:text-[#D4C7E1] hover:bg-[#FAF2FA] dark:hover:bg-[#372E3E]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${location.pathname === "/" ? "bg-white/20 text-white" : "bg-[#FAF2FA] dark:bg-[#372E3E] text-[#501854] dark:text-[#D4C7E1]"}`}>
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold uppercase tracking-widest">Sanctuary Home</p>
                    <p className={`text-[10px] ${location.pathname === "/" ? "text-purple-200" : "text-[#7E4882] dark:text-[#A695B8]"}`}>Editorial beauty atelier</p>
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
                    onClick={() => setMobileMenuOpen(false)}
                    className={`w-full px-4 py-3 rounded-2xl flex items-center justify-between transition-all duration-300 min-h-[44px] ${
                      active
                        ? "bg-[#501854] dark:bg-[#DB2777] text-white shadow-sm"
                        : "text-[#501854] dark:text-[#D4C7E1] hover:bg-[#FAF2FA] dark:hover:bg-[#372E3E]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${active ? "bg-white/20 text-white" : "bg-[#FAF2FA] dark:bg-[#372E3E] text-[#501854] dark:text-[#D4C7E1]"}`}>
                        {link.label === "Artisans" && <Palette className="w-4 h-4" />}
                        {link.label === "Experience" && <ShieldCheck className="w-4 h-4" />}
                        {link.label === "Membership" && <HeartHandshake className="w-4 h-4" />}
                        {link.label === "Story" && <Sparkles className="w-4 h-4" />}
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-semibold uppercase tracking-widest">{link.label}</p>
                        <p className={`text-[10px] ${active ? "text-purple-200" : "text-[#7E4882] dark:text-[#A695B8]"}`}>{link.desc}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 opacity-50" />
                  </Link>
                );
              })}
            </div>

            {/* Public "For Artisans" Section - Links to /register-artist or /login, NEVER directly to /dashboard */}
            <div className="grid grid-cols-2 gap-2.5">
              <Link
                to="/register-artist"
                onClick={() => setMobileMenuOpen(false)}
                className="glass-panel p-3.5 rounded-2xl text-center border border-[#EFBDEB] dark:border-[#3B3237] hover:border-[#DB2777] transition-all shadow-sm flex flex-col items-center justify-center min-h-[44px]"
              >
                <Palette className="w-4 h-4 text-[#501854] dark:text-[#D4C7E1] mb-1.5" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#501854] dark:text-[#D4C7E1]">Join Atelier</span>
                <span className="text-[9px] text-[#7E4882] dark:text-[#A695B8]">Apply for representation</span>
              </Link>

              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="glass-panel p-3.5 rounded-2xl text-center border border-[#EFBDEB] dark:border-[#3B3237] hover:border-[#DB2777] transition-all shadow-sm flex flex-col items-center justify-center min-h-[44px]"
              >
                <User className="w-4 h-4 text-[#501854] dark:text-[#D4C7E1] mb-1.5" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#501854] dark:text-[#D4C7E1]">Artisan Sign In</span>
                <span className="text-[9px] text-[#7E4882] dark:text-[#A695B8]">Access console</span>
              </Link>
            </div>

            {/* Mobile Drawer Auth Action */}
            <div className="flex flex-col gap-2.5 pt-1">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleSignOut();
                  }}
                  className="w-full bg-white dark:bg-[#372E3E] text-[#DB2777] border border-[#DB2777] text-center py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm min-h-[44px]"
                >
                  <LogOut className="w-4 h-4 text-[#DB2777]" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full bg-white dark:bg-[#372E3E] text-[#501854] dark:text-[#D4C7E1] border border-[#EFBDEB] dark:border-[#3B3237] text-center py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-[#FAF2FA] dark:hover:bg-[#3E343C] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm min-h-[44px]"
                >
                  <User className="w-4 h-4 text-[#8C3B8A] dark:text-[#D4C7E1]" />
                  <span>Client Sign In / Register</span>
                </Link>
              )}

              <Link
                to="/search"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-[#501854] dark:bg-[#DB2777] text-white text-center py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest shadow-md hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2 min-h-[44px]"
              >
                <span>Book Master Artisan</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="flex items-center justify-center gap-2 text-[#7E4882] dark:text-[#A695B8] text-[10px] tracking-wider uppercase pt-1">
              <MapPin className="w-3 h-3 text-[#DB2777]" />
              <span>Cape Town • Sandton • Durban • Pretoria</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
