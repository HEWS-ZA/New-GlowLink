import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { Search, Calendar, Star, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { triggerHaptic } from "@/services/haptics";

const HowItWorks = () => {
  const navigate = useNavigate();

  const clientSteps = [
    {
      num: "01",
      icon: Search,
      title: "Discover Master Talent",
      description:
        "Browse our curated roster of verified beauty artisans. Filter by specialty, location, and authentic client portfolios.",
    },
    {
      num: "02",
      icon: Calendar,
      title: "Seamless Instant Booking",
      description:
        "View live studio and mobile availability. Reserve your bespoke appointment in moments with immediate confirmation.",
    },
    {
      num: "03",
      icon: Sparkles,
      title: "The Signature Experience",
      description:
        "Relax as your chosen artisan delivers exceptional styling, personalized aesthetics, and unmatched luxury.",
    },
    {
      num: "04",
      icon: Star,
      title: "Share Your Impression",
      description:
        "Leave a trusted review to celebrate exceptional artistry and guide our discerning community.",
    },
  ];

  const artistSteps = [
    {
      title: "Curate Your Atelier Profile",
      description: "Showcase your portfolio, bespoke services menu, and pricing with high-fashion editorial presence.",
    },
    {
      title: "Effortless Schedule Management",
      description: "Command your calendar with integrated real-time booking and customized mobile radius settings.",
    },
    {
      title: "Direct & Guaranteed Payouts",
      description: "Receive instant, transparent payouts following every completed appointment with zero delay.",
    },
    {
      title: "Scale Your Patronage",
      description: "Access powerful CRM tools, client analytics, and premium editorial exposure across South Africa.",
    },
  ];

  return (
    <div className="bg-white dark:bg-[#17111D] text-[#501854] dark:text-[#D4C7E1] min-h-screen selection:bg-[#DB2777] selection:text-white transition-colors duration-300">
      <Header />

      <section className="pt-28 sm:pt-36 pb-12 sm:pb-20 px-4 sm:px-6 md:px-12 border-b border-[#EFBDEB] dark:border-[#3B3237]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF2FA] dark:bg-[#372E3E] border border-[#EFBDEB] dark:border-[#3B3237] shadow-xs mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#DB2777]" />
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#501854] dark:text-[#D4C7E1] font-semibold">
              The Protocol
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif text-[#501854] dark:text-[#D4C7E1] tracking-tight mb-4">
            How It <span className="italic font-normal text-[#DB2777]">Works</span>
          </h1>
          <p className="text-sm sm:text-base text-[#7E4882] dark:text-[#A695B8] max-w-xl mx-auto font-light leading-relaxed">
            Elevating every step from artisan discovery to bespoke appointment completion.
          </p>
        </div>
      </section>

      {/* For Clients */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">
        <div className="mb-8 sm:mb-12">
          <span className="text-xs uppercase tracking-[0.2em] text-[#DB2777] block mb-2 font-semibold">
            For Discerning Clients
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#501854] dark:text-[#D4C7E1]">
            Four Steps to Effortless Beauty
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {clientSteps.map((step) => (
            <div key={step.num} className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#241C2B] border border-[#EFBDEB] dark:border-[#3B3237] shadow-xs relative">
              <span className="font-serif italic text-2xl sm:text-3xl text-[#DB2777] block mb-3 font-semibold">
                {step.num}
              </span>
              <div className="w-10 h-10 rounded-full bg-[#FAF2FA] dark:bg-[#372E3E] flex items-center justify-center text-[#501854] dark:text-[#D4C7E1] mb-4 border border-[#EFBDEB] dark:border-[#3B3237]">
                <step.icon size={18} />
              </div>
              <h3 className="font-serif text-lg sm:text-xl text-[#501854] dark:text-[#D4C7E1] mb-2">{step.title}</h3>
              <p className="text-xs text-[#7E4882] dark:text-[#A695B8] font-light leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* For Artisans */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 md:px-12 bg-[#FAF2FA]/50 dark:bg-[#241C2B]/40 border-t border-[#EFBDEB] dark:border-[#3B3237] transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 sm:mb-12">
            <span className="text-xs uppercase tracking-[0.2em] text-[#DB2777] block mb-2 font-semibold">
              For Verified Artisans
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#501854] dark:text-[#D4C7E1]">
              Grow Your Prestige Atelier
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {artistSteps.map((step, idx) => (
              <div key={idx} className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#241C2B] border border-[#EFBDEB] dark:border-[#3B3237] shadow-xs flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-[#FAF2FA] dark:bg-[#372E3E] text-[#DB2777] flex items-center justify-center shrink-0 mt-1 border border-[#EFBDEB] dark:border-[#3B3237]">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <h3 className="font-serif text-base sm:text-lg text-[#501854] dark:text-[#D4C7E1] mb-1">{step.title}</h3>
                  <p className="text-xs text-[#7E4882] dark:text-[#A695B8] font-light leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => {
                triggerHaptic(10);
                navigate("/register-artist");
              }}
              className="bg-[#501854] dark:bg-[#DB2777] text-white px-8 py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold hover:opacity-90 transition-all shadow-md inline-flex items-center gap-2"
            >
              <span>Apply for Roster</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      <ScrollToTop />
      <Footer />
    </div>
  );
};

export default HowItWorks;
