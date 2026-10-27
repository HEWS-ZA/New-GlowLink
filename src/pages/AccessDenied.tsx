import { Link } from "react-router-dom";
import { ShieldAlert, ArrowRight, Home, Sparkles, LogOut, Compass } from "lucide-react";
import { useAuth, logout } from "@/services/authStore";
import { triggerHaptic } from "@/services/haptics";

const AccessDenied = () => {
  const { role, user } = useAuth();

  const handleSwitchAccount = () => {
    triggerHaptic(10);
    logout();
  };

  const isCustomer = role === "customer";
  const isArtisan = role === "artisan";

  return (
    <div className="bg-white dark:bg-[#17111D] text-[#501854] dark:text-[#D4C7E1] min-h-screen flex items-center justify-center px-4 sm:px-6 py-16 selection:bg-[#DB2777] selection:text-white transition-colors duration-300">
      <div className="max-w-md w-full glass-panel p-6 sm:p-10 border border-[#EFBDEB] dark:border-[#3B3237] rounded-3xl shadow-xl text-center space-y-6">
        {/* Shield Icon Badge */}
        <div className="w-16 h-16 rounded-full bg-[#FAF2FA] dark:bg-[#372E3E] border border-[#EFBDEB] dark:border-[#3B3237] flex items-center justify-center mx-auto text-[#DB2777] shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF2FA] dark:bg-[#372E3E] border border-[#EFBDEB] dark:border-[#3B3237] text-[10px] uppercase tracking-[0.2em] font-semibold text-[#501854] dark:text-[#D4C7E1]">
            <Sparkles className="w-3 h-3 text-[#DB2777]" />
            <span>Role Clearance Required (403)</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif text-[#501854] dark:text-[#D4C7E1] tracking-tight">
            Portal Access <span className="italic font-normal text-[#DB2777]">Restricted</span>
          </h1>

          <p className="text-xs sm:text-sm text-[#7E4882] dark:text-[#A695B8] font-light leading-relaxed">
            {isCustomer ? (
              <>
                You are currently signed in as a <span className="font-semibold text-[#501854] dark:text-[#D4C7E1]">Client ({user?.email})</span>.
                The Master Atelier Console is reserved strictly for verified beauty stylists and technicians.
              </>
            ) : isArtisan ? (
              <>
                You are currently signed in as a <span className="font-semibold text-[#501854] dark:text-[#D4C7E1]">Master Artisan ({user?.email})</span>.
                The Client Sanctuary is dedicated to clients making and managing personal bookings.
              </>
            ) : (
              <>
                This section requires authorized role credentials. Please sign in to the appropriate portal.
              </>
            )}
          </p>
        </div>

        {/* Action CTAs */}
        <div className="space-y-3 pt-2">
          {isCustomer ? (
            <Link
              to="/customer/bookings"
              onClick={() => triggerHaptic(8)}
              className="w-full bg-[#501854] dark:bg-[#DB2777] text-white py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 min-h-[44px]"
            >
              <span>Return to My Client Bookings</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : isArtisan ? (
            <Link
              to="/dashboard"
              onClick={() => triggerHaptic(8)}
              className="w-full bg-[#501854] dark:bg-[#DB2777] text-white py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 min-h-[44px]"
            >
              <span>Return to Artisan Console</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              to="/"
              onClick={() => triggerHaptic(8)}
              className="w-full bg-[#501854] dark:bg-[#DB2777] text-white py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 min-h-[44px]"
            >
              <Home className="w-4 h-4" />
              <span>Return to Public Atelier</span>
            </Link>
          )}

          <Link
            to="/login"
            onClick={handleSwitchAccount}
            className="w-full bg-white dark:bg-[#372E3E] text-[#501854] dark:text-[#D4C7E1] border border-[#EFBDEB] dark:border-[#3B3237] hover:border-[#DB2777] py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-[#FAF2FA] dark:hover:bg-[#3E343C] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm min-h-[44px]"
          >
            <LogOut className="w-4 h-4 text-[#DB2777]" />
            <span>Switch or Sign In to Different Account</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
