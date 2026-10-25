import { Link, useLocation } from "react-router-dom";
import { Sparkles, Search, LayoutDashboard, Crown } from "lucide-react";
import { triggerHaptic } from "@/services/haptics";

export function MobileBottomNav() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const tabs = [
    { path: "/", label: "Atelier", icon: Sparkles },
    { path: "/search", label: "Artisans", icon: Search },
    { path: "/dashboard", label: "Console", icon: LayoutDashboard },
    { path: "/pricing", label: "Tiers", icon: Crown },
  ];

  return (
    <div className="md:hidden fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] inset-x-2.5 sm:inset-x-4 z-40 pointer-events-auto">
      <nav className="glass-pill-nav flex items-center justify-around py-1.5 sm:py-2.5 px-1.5 sm:px-3 shadow-[0_12px_40px_rgba(80,24,84,0.12)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.6)] border border-[#EFBDEB] dark:border-[#3B3237] bg-white/95 dark:bg-[#241C2B]/95 backdrop-blur-xl">
        {tabs.map((tab) => {
          const active = isActive(tab.path);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.path}
              to={tab.path}
              onClick={() => triggerHaptic(12)}
              className={`flex flex-col items-center justify-center flex-1 py-1 rounded-full transition-all duration-300 relative ${
                active
                  ? "text-[#501854] dark:text-[#D4C7E1] font-semibold"
                  : "text-[#7E4882] dark:text-[#A695B8] hover:text-[#501854] dark:hover:text-[#D4C7E1]"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  active
                    ? "bg-[#501854] dark:bg-[#DB2777] text-white shadow-xs scale-105"
                    : "text-inherit"
                }`}
              >
                <Icon size={16} />
              </div>
              <span className="text-[10px] uppercase tracking-wider mt-0.5">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
