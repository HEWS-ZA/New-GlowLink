import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Sparkles,
  Calendar,
  Receipt as ReceiptIcon,
  User,
  LogOut,
  Bell,
  X,
  Compass,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { GlowLinkLogo } from "@/components/GlowLinkLogo";
import { triggerHaptic } from "@/services/haptics";
import { useAuth, logout } from "@/services/authStore";
import { toast } from "sonner";

export const CustomerHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isResolved } = useAuth();

  const [notifications, setNotifications] = useState([
    {
      id: "cn1",
      title: "Booking Reserved",
      desc: "15-minute slot hold active for Haute Bridal consultation.",
      time: "Just now",
      unread: true,
    },
    {
      id: "cn2",
      title: "Upcoming Appointment",
      desc: "Editorial Glam Session with Thandi Mthembu in 24 hours.",
      time: "2h ago",
      unread: false,
    },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

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

  const handleSignOut = () => {
    triggerHaptic(12);
    logout();
    toast.success("Signed out of Customer Sanctuary.");
    navigate("/", { replace: true });
  };

  const navLinks = [
    { path: "/", label: "Explore Ateliers", icon: Compass },
    { path: "/customer/bookings", label: "My Bookings", icon: Calendar },
    { path: "/customer/receipts", label: "Receipts", icon: ReceiptIcon },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 px-2 sm:px-6 md:px-8 pt-2.5 sm:pt-4 pb-2 pointer-events-none transition-all duration-300">
        <div className="max-w-6xl mx-auto flex items-center justify-between pointer-events-auto">
          {/* Liquid Glass Pill Nav for Customers */}
          <div className="w-full flex items-center justify-between glass-pill-nav px-2.5 sm:px-5 py-1.5 sm:py-2.5 transition-all duration-300 gap-2 sm:gap-4">
            {/* Brand Logo & Customer Tag */}
            <Link
              to="/customer/bookings"
              onClick={() => triggerHaptic(10)}
              className="flex items-center transition-transform duration-300 active:scale-95 shrink-0"
              aria-label="GlowLink Customer Sanctuary"
            >
              <GlowLinkLogo variant="full" size="md" badgeText="Client" />
            </Link>

            {/* Customer Navigation Links */}
            <nav className="hidden md:flex items-center gap-1.5 bg-[#FAF2FA]/90 dark:bg-[#372E3E]/70 p-1 rounded-full border border-[#EFBDEB]/60 dark:border-[#3B3237] backdrop-blur-md">
              {navLinks.map((link) => {
                const isActive =
                  link.path === "/"
                    ? location.pathname === "/"
                    : location.pathname.startsWith(link.path);
                const Icon = link.icon;

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => triggerHaptic(8)}
                    className={`relative px-3.5 py-1.5 rounded-full text-xs tracking-wider uppercase font-medium transition-all duration-300 whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                      isActive
                        ? "bg-[#501854] text-white dark:bg-[#DB2777] shadow-[0_2px_8px_rgba(80,24,84,0.2)] font-semibold"
                        : "text-[#501854]/80 dark:text-[#D4C7E1]/80 hover:text-[#501854] dark:hover:text-white hover:bg-white/60 dark:hover:bg-[#3E343C]"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Actions & User Controls */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <ThemeToggle />

              {/* Notification Bell */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic(8);
                    setShowNotifications(!showNotifications);
                  }}
                  aria-label="Customer notifications"
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
                      <span className="font-serif font-semibold text-sm text-[#501854] dark:text-[#D4C7E1]">
                        Client Notifications
                      </span>
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="p-1 rounded-full text-[#7E4882] dark:text-[#A695B8] hover:bg-[#FAF2FA] dark:hover:bg-[#372E3E]"
                        aria-label="Close notifications"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-2.5 rounded-2xl text-left ${
                            n.unread
                              ? "bg-[#FAF2FA] dark:bg-[#372E3E]/80 border border-[#EFBDEB]/80 dark:border-[#3B3237]"
                              : "bg-white/50 dark:bg-[#241C2B]/50"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1">
                            <p className="text-xs font-semibold text-[#501854] dark:text-[#D4C7E1] leading-tight">
                              {n.title}
                            </p>
                            <span className="text-[9px] text-[#7E4882] dark:text-[#A695B8] font-light">
                              {n.time}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#7E4882] dark:text-[#A695B8] font-light mt-0.5 leading-snug">
                            {n.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Chip / Sign Out */}
              <div className="relative inline-flex items-center shrink-0">
                {!isResolved ? (
                  <div className="w-[84px] sm:w-[94px] h-[34px] rounded-full opacity-0 pointer-events-none" />
                ) : (
                  <button
                    type="button"
                    onClick={handleSignOut}
                    aria-label="Sign out of customer portal"
                    className="w-[84px] sm:w-[94px] h-[34px] inline-flex items-center justify-center gap-1.5 text-[11px] sm:text-xs uppercase tracking-wider font-semibold text-[#501854] dark:text-[#D4C7E1] px-2.5 sm:px-3 rounded-full hover:bg-[#FAF2FA] dark:hover:bg-[#372E3E] border border-[#EFBDEB]/80 dark:border-[#3B3237] hover:border-[#DB2777] active:scale-95 transition-all duration-200 shadow-2xs whitespace-nowrap"
                  >
                    <LogOut className="w-3.5 h-3.5 shrink-0 text-[#DB2777]" />
                    <span>Sign Out</span>
                  </button>
                )}
              </div>

              {/* Hamburger Button for Mobile Drawer */}
              <button
                className="md:hidden relative w-8 h-8 sm:w-9 sm:h-9 min-w-[32px] min-h-[32px] rounded-full flex flex-col items-center justify-center gap-1.5 text-[#501854] dark:text-[#D4C7E1] bg-[#FAF2FA] dark:bg-[#372E3E] border border-[#EFBDEB] dark:border-[#3B3237] active:scale-90 transition-all duration-300 focus:outline-none shrink-0"
                onClick={() => {
                  triggerHaptic(12);
                  setMobileMenuOpen(!mobileMenuOpen);
                }}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                <span
                  className={`block w-4 h-0.5 bg-current rounded-full transition-all duration-300 ${
                    mobileMenuOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                />
                <span
                  className={`block w-4 h-0.5 bg-current rounded-full transition-all duration-200 ${
                    mobileMenuOpen ? "opacity-0 scale-x-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`block w-4 h-0.5 bg-current rounded-full transition-all duration-300 ${
                    mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Full-Screen Mobile Drawer Overlay for Customer Portal */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-between pt-20 sm:pt-24 pb-[calc(5rem+env(safe-area-inset-bottom))] px-4 bg-white/95 dark:bg-[#17111D]/98 backdrop-blur-2xl animate-in fade-in duration-300 overflow-y-auto">
          <div className="max-w-md w-full mx-auto flex flex-col space-y-4">
            {/* Customer Profile Banner */}
            <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-[#FAF2FA] dark:bg-[#372E3E] border border-[#EFBDEB] dark:border-[#3B3237]">
              <div>
                <p className="text-xs font-semibold text-[#501854] dark:text-[#D4C7E1]">
                  {user?.name || "Valued Client"}
                </p>
                <p className="text-[10px] text-[#7E4882] dark:text-[#A695B8]">
                  {user?.email || "customer@glowlink.co.za"}
                </p>
              </div>
              <ThemeToggle showLabel />
            </div>

            {/* Destinations */}
            <div className="glass-panel p-3 border border-[#EFBDEB] dark:border-[#3B3237] rounded-3xl shadow-lg space-y-1.5">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`w-full px-4 py-3 rounded-2xl flex items-center justify-between transition-all min-h-[44px] ${
                      isActive
                        ? "bg-[#501854] dark:bg-[#DB2777] text-white shadow-sm"
                        : "text-[#501854] dark:text-[#D4C7E1] hover:bg-[#FAF2FA] dark:hover:bg-[#372E3E]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/20">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-wider">{link.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Sign Out CTA */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                handleSignOut();
              }}
              className="w-full bg-white dark:bg-[#241C2B] text-[#DB2777] border border-[#DB2777] text-center py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm min-h-[44px]"
            >
              <LogOut className="w-4 h-4 text-[#DB2777]" />
              <span>Sign Out of Client Portal</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
