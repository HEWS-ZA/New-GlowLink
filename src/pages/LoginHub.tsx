import { Link, useSearchParams } from "react-router-dom";
import { User, Briefcase, ArrowRight } from "lucide-react";
import { GlowLinkLogo } from "@/components/GlowLinkLogo";
import { triggerHaptic } from "@/services/haptics";

export const LoginHub = () => {
  const [searchParams] = useSearchParams();
  const redirectParam = searchParams.get("redirect");
  const queryStr = redirectParam ? `?redirect=${encodeURIComponent(redirectParam)}` : "";

  return (
    <div className="w-full flex items-center justify-center px-4 sm:px-6 pt-24 sm:pt-32 pb-24 md:pb-16 min-h-[80vh]">
      <div className="w-full max-w-xl mx-auto text-center">
        <GlowLinkLogo variant="stacked" size="md" className="mb-6 mx-auto" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF2FA] dark:bg-[#372E3E] border border-[#EFBDEB] dark:border-[#3B3237] shadow-xs mb-4">
          <span className="text-[11px] font-semibold tracking-[0.2em] text-[#501854] dark:text-[#D4C7E1] uppercase">
            GlowLink Portals
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#501854] dark:text-[#D4C7E1] tracking-tight mb-3">
          Choose Your <span className="italic font-normal text-[#DB2777]">Sanctuary</span>
        </h1>
        <p className="text-sm text-[#7E4882] dark:text-[#A695B8] max-w-md mx-auto font-light leading-relaxed mb-8 sm:mb-10">
          Separate, private portals designed for discerning clients reserving luxury beauty appointments, and verified master artisans managing their atelier.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-left">
          {/* 1. Client Sanctuary Choice */}
          <Link
            to={`/customer/login${queryStr}`}
            onClick={() => triggerHaptic(10)}
            className="group p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#241C2B] border border-[#EFBDEB] dark:border-[#3B3237] hover:border-[#DB2777] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FAF2FA] dark:bg-[#372E3E] text-[#DB2777] flex items-center justify-center mb-5 border border-[#EFBDEB] dark:border-[#3B3237] group-hover:scale-110 transition-transform">
                <User size={22} />
              </div>
              <h2 className="font-serif text-xl sm:text-2xl text-[#501854] dark:text-[#D4C7E1] mb-2 font-medium">
                Client Sanctuary
              </h2>
              <p className="text-xs text-[#7E4882] dark:text-[#A695B8] font-light leading-relaxed mb-6">
                Reserve master hairstylists, makeup artists & nail couturiers. Pay deposits, unlock balances, and download receipts.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#DB2777] group-hover:translate-x-1 transition-transform">
              <span>Sign In as Client</span>
              <ArrowRight size={14} />
            </div>
          </Link>

          {/* 2. Artisan Atelier Console Choice */}
          <Link
            to={`/artisan/login${queryStr}`}
            onClick={() => triggerHaptic(10)}
            className="group p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#241C2B] border border-[#EFBDEB] dark:border-[#3B3237] hover:border-[#DB2777] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FAF2FA] dark:bg-[#372E3E] text-[#501854] dark:text-[#D4C7E1] flex items-center justify-center mb-5 border border-[#EFBDEB] dark:border-[#3B3237] group-hover:scale-110 transition-transform">
                <Briefcase size={22} />
              </div>
              <h2 className="font-serif text-xl sm:text-2xl text-[#501854] dark:text-[#D4C7E1] mb-2 font-medium">
                Artisan Console
              </h2>
              <p className="text-xs text-[#7E4882] dark:text-[#A695B8] font-light leading-relaxed mb-6">
                Manage your booking schedule, verify incoming deposits, mark completed services, and track monthly analytics.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#501854] dark:text-[#D4C7E1] group-hover:translate-x-1 transition-transform">
              <span>Sign In as Artisan</span>
              <ArrowRight size={14} />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
