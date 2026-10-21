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
    <div className="md:hidden fixed bottom-3 inset-x-4 z-40 pointer-events-auto">
      <nav className="glass-pill-nav flex items-center justify-around py-2.5 px-3 shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-white/95 bg-white/90 backdrop-blur-xl">
        {tabs.map((tab) => {
          const active = isActive(tab.path);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.path}
              to={tab.path}
              onClick={() => triggerHaptic(12)}
              className={`flex flex-col items-center justify-center flex-1 py-1 rounded-full transition-all duration-300 relative ${
                active ? "text-neutral-950 font-semibold" : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  active ? "bg-neutral-900 text-amber-300 shadow-xs scale-105" : "text-neutral-600"
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
