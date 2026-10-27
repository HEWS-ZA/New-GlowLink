import { Link, useLocation } from "react-router-dom";
import { Compass, Calendar, Receipt, User } from "lucide-react";
import { triggerHaptic } from "@/services/haptics";

export function CustomerBottomNav() {
  const location = useLocation();

  const tabs = [
    { path: "/", label: "Explore", icon: Compass },
    { path: "/customer/bookings", label: "Bookings", icon: Calendar },
    { path: "/customer/receipts", label: "Receipts", icon: Receipt },
    { path: "/customer/profile", label: "Profile", icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] inset-x-2.5 sm:inset-x-4 z-40 pointer-events-auto">
      <nav className="glass-pill-nav flex items-center justify-around py-1.5 sm:py-2 px-1 sm:px-2 shadow-[0_12px_40px_rgba(80,24,84,0.12)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.6)] border border-[#EFBDEB] dark:border-[#3B3237] bg-white/95 dark:bg-[#241C2B]/95 backdrop-blur-xl">
        {tabs.map((tab) => {
          const isActive =
            tab.path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(tab.path);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.path}
              to={tab.path}
              onClick={() => triggerHaptic(10)}
              className={`flex flex-col items-center justify-center flex-1 py-1 rounded-full transition-all duration-300 relative min-h-[44px] ${
                isActive
                  ? "text-[#501854] dark:text-[#D4C7E1] font-semibold"
                  : "text-[#7E4882] dark:text-[#A695B8] hover:text-[#501854] dark:hover:text-[#D4C7E1]"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  isActive
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
