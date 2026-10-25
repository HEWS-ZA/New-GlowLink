import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  User,
  LogOut,
  Bell,
  Search,
  MapPin,
  ShieldCheck,
  Calendar,
  Palette,
  HeartHandshake,
  Check,
  X,
} from "lucide-react";
import { PWAInstallButton } from "@/components/PWAInstallButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { triggerHaptic } from "@/services/haptics";
import { useAuth, logoutArtisan } from "@/services/authStore";
import { toast } from "sonner";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: "n1",
      title: "New Confirmed Booking",
      desc: "Sarah Johnson reserved Haute Bridal Atelier for Oct 24",
      time: "10m ago",
      unread: true,
    },
    {
      id: "n2",
      title: "Deposit Received",
      desc: "R1,000 reservation fee verified via Instant EFT",
      time: "1h ago",
      unread: true,
    },
    {
      id: "n3",
      title: "Client Review",
      desc: "Linda P. rated your session 5.0 stars with comments",
      time: "Yesterday",
      unread: false,
    },
  ]);

  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isResolved } = useAuth();

  const unreadCount = notifications.filter((n) => n.unread).length;

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
    setShowNotifications(false);
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
    toast.success("Successfully signed out from Atelier Console.");
    navigate("/", { replace: true });
  };

  const handleMarkAllNotificationsRead = () => {
    triggerHaptic(8);
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    toast.success("All notifications marked as read");
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

            {/* Action Pills & Controls */}
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

              {/* Notification Bell (placed right next to Auth Button) */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic(8);
                    setShowNotifications(!showNotifications);
                  }}
                  aria-label="Atelier notifications"
                  className="relative w-8 h-8 sm:w-9 sm:h-9 min-w-[32px] min-h-[32px] rounded-full flex items-center justify-center text-[#501854] dark:text-[#D4C7E1] hover:bg-[#FAF2FA] dark:hover:bg-[#372E3E] transition-colors"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#DB2777] ring-2 ring-white dark:ring-[#241C2B]" />
                  )}
                </button>

                {/* Notifications Dropdown Panel */}
                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 glass-panel p-3.5 border border-[#EFBDEB] dark:border-[#3B3237] rounded-3xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#EFBDEB]/60 dark:border-[#3B3237]">
                      <div className="flex items-center gap-1.5">
                        <span className="font-serif font-semibold text-sm text-[#501854] dark:text-[#D4C7E1]">
                          Notifications
                        </span>
                        {unreadCount > 0 && (
                          <span className="px-1.5 py-0.2 rounded-full bg-[#DB2777] text-white text-[10px] font-bold">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllNotificationsRead}
                            className="text-[10px] uppercase tracking-wider text-[#DB2777] hover:underline px-1.5 py-0.5"
                          >
                            Mark Read
                          </button>
                        )}
                        <button
                          onClick={() => setShowNotifications(false)}
                          className="p-1 rounded-full text-[#7E4882] dark:text-[#A695B8] hover:bg-[#FAF2FA] dark:hover:bg-[#372E3E]"
                          aria-label="Close notifications"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 max-h-64 overflow-y-auto no-scrollbar">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-2.5 rounded-2xl transition-colors text-left ${
                            n.unread
                              ? "bg-[#FAF2FA] dark:bg-[#372E3E]/80 border border-[#EFBDEB]/80 dark:border-[#3B3237]"
                              : "bg-white/50 dark:bg-[#241C2B]/50 hover:bg-[#FAF2FA] dark:hover:bg-[#372E3E]"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1">
                            <p className="text-xs font-semibold text-[#501854] dark:text-[#D4C7E1] leading-tight">
                              {n.title}
                            </p>
                            <span className="text-[9px] text-[#7E4882] dark:text-[#A695B8] shrink-0 font-light">
                              {n.time}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#7E4882] dark:text-[#A695B8] font-light mt-0.5 leading-snug">
                            {n.desc}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 mt-2 border-t border-[#EFBDEB]/60 dark:border-[#3B3237] text-center">
                      <Link
                        to="/dashboard"
                        onClick={() => setShowNotifications(false)}
                        className="text-[11px] font-semibold text-[#501854] dark:text-[#D4C7E1] hover:text-[#DB2777] transition-colors"
                      >
                        Open Atelier Console →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* SINGLE SOURCE OF TRUTH AUTH-AWARE BUTTON (Same size, position, styling in both states) */}
              <div className="relative inline-flex items-center shrink-0">
                {!isResolved ? (
                  // Neutral placeholder to guarantee zero visual shift or flash on first paint
                  <div
                    className="w-[84px] sm:w-[94px] h-[34px] rounded-full border border-transparent bg-transparent pointer-events-none opacity-0"
                    aria-hidden="true"
                  />
                ) : isAuthenticated ? (
                  <button
                    type="button"
                    onClick={handleSignOut}
                    aria-label="Sign out of Atelier Console"
                    className="w-[84px] sm:w-[94px] h-[34px] inline-flex items-center justify-center gap-1.5 text-[11px] sm:text-xs uppercase tracking-wider font-semibold text-[#501854] dark:text-[#D4C7E1] px-2.5 sm:px-3 rounded-full hover:bg-[#FAF2FA] dark:hover:bg-[#372E3E] border border-[#EFBDEB]/80 dark:border-[#3B3237] hover:border-[#DB2777] active:scale-95 transition-all duration-200 shadow-2xs whitespace-nowrap"
                  >
                    <LogOut className="w-3.5 h-3.5 shrink-0 text-[#DB2777]" />
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => triggerHaptic(8)}
                    aria-label="Sign in to Atelier Console"
                    className="w-[84px] sm:w-[94px] h-[34px] inline-flex items-center justify-center gap-1.5 text-[11px] sm:text-xs uppercase tracking-wider font-semibold text-[#501854] dark:text-[#D4C7E1] px-2.5 sm:px-3 rounded-full hover:bg-[#FAF2FA] dark:hover:bg-[#372E3E] border border-[#EFBDEB]/80 dark:border-[#3B3237] hover:border-[#DB2777] active:scale-95 transition-all duration-200 shadow-2xs whitespace-nowrap"
                  >
                    <User className="w-3.5 h-3.5 shrink-0 text-[#8C3B8A] dark:text-[#A695B8]" />
                    <span>Sign In</span>
                  </Link>
                )}
              </div>

              {/* Book Visit CTA (Hidden on tiny mobile, visible on sm+) */}
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

      {/* Full-Screen Liquid Glass Mobile Drawer Overlay */}
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

            {/* Quick Portal & Artist Join Links */}
            <div className="grid grid-cols-2 gap-2.5">
              <Link
                to="/register-artist"
                onClick={() => setMobileMenuOpen(false)}
                className="glass-panel p-3.5 rounded-2xl text-center border border-[#EFBDEB] dark:border-[#3B3237] hover:border-[#DB2777] transition-all shadow-sm flex flex-col items-center justify-center min-h-[44px]"
              >
                <Palette className="w-4 h-4 text-[#501854] dark:text-[#D4C7E1] mb-1.5" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#501854] dark:text-[#D4C7E1]">Join as Artisan</span>
                <span className="text-[9px] text-[#7E4882] dark:text-[#A695B8]">Apply for roster</span>
              </Link>

              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="glass-panel p-3.5 rounded-2xl text-center border border-[#EFBDEB] dark:border-[#3B3237] hover:border-[#DB2777] transition-all shadow-sm flex flex-col items-center justify-center min-h-[44px]"
              >
                <Calendar className="w-4 h-4 text-[#501854] dark:text-[#D4C7E1] mb-1.5" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#501854] dark:text-[#D4C7E1]">Artisan Portal</span>
                <span className="text-[9px] text-[#7E4882] dark:text-[#A695B8]">Manage bookings</span>
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
                  <span>Sign Out of Atelier Console</span>
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

export default Header;
