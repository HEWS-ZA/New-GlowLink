import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, ExternalLink, LogOut } from "lucide-react";
import { triggerHaptic } from "@/services/haptics";
import { logoutArtisan } from "@/services/authStore";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function ConsoleBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const isCustomersActive = location.search.includes("tab=customers");
  const isOverviewActive = location.pathname === "/dashboard" && !isCustomersActive;

  const handleSignOut = () => {
    triggerHaptic(12);
    logoutArtisan();
    toast.success("Successfully signed out.");
    navigate("/", { replace: true });
  };

  return (
    <div className="md:hidden fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] inset-x-2.5 sm:inset-x-4 z-40 pointer-events-auto">
      <nav className="glass-pill-nav flex items-center justify-around py-1.5 sm:py-2 px-1 sm:px-2 shadow-[0_12px_40px_rgba(80,24,84,0.12)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.6)] border border-[#EFBDEB] dark:border-[#3B3237] bg-white/95 dark:bg-[#241C2B]/95 backdrop-blur-xl">
        {/* Overview Tab */}
        <Link
          to="/dashboard"
          onClick={() => triggerHaptic(10)}
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-full transition-all duration-300 relative min-h-[44px] ${
            isOverviewActive
              ? "text-[#501854] dark:text-[#D4C7E1] font-semibold"
              : "text-[#7E4882] dark:text-[#A695B8] hover:text-[#501854] dark:hover:text-[#D4C7E1]"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              isOverviewActive
                ? "bg-[#501854] dark:bg-[#DB2777] text-white shadow-xs scale-105"
                : "text-inherit"
            }`}
          >
            <LayoutDashboard size={16} />
          </div>
          <span className="text-[10px] uppercase tracking-wider mt-0.5">
            Overview
          </span>
        </Link>

        {/* Clientele Tab */}
        <Link
          to="/dashboard?tab=customers"
          onClick={() => triggerHaptic(10)}
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-full transition-all duration-300 relative min-h-[44px] ${
            isCustomersActive
              ? "text-[#501854] dark:text-[#D4C7E1] font-semibold"
              : "text-[#7E4882] dark:text-[#A695B8] hover:text-[#501854] dark:hover:text-[#D4C7E1]"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              isCustomersActive
                ? "bg-[#501854] dark:bg-[#DB2777] text-white shadow-xs scale-105"
                : "text-inherit"
            }`}
          >
            <Users size={16} />
          </div>
          <span className="text-[10px] uppercase tracking-wider mt-0.5">
            Clientele
          </span>
        </Link>

        {/* View Public Storefront */}
        <Link
          to="/"
          onClick={() => triggerHaptic(8)}
          className="flex flex-col items-center justify-center flex-1 py-1 rounded-full transition-all duration-300 relative min-h-[44px] text-[#7E4882] dark:text-[#A695B8] hover:text-[#501854] dark:hover:text-[#D4C7E1]"
          title="View Public Storefront"
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center">
            <ExternalLink size={16} />
          </div>
          <span className="text-[10px] uppercase tracking-wider mt-0.5">
            Public Site
          </span>
        </Link>

        {/* Sign Out Button */}
        <button
          type="button"
          onClick={handleSignOut}
          className="flex flex-col items-center justify-center flex-1 py-1 rounded-full transition-all duration-300 relative min-h-[44px] text-rose-500 hover:text-rose-600"
          aria-label="Sign out"
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center">
            <LogOut size={16} />
          </div>
          <span className="text-[10px] uppercase tracking-wider mt-0.5">
            Sign Out
          </span>
        </button>
      </nav>
    </div>
  );
}
