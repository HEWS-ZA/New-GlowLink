import { Check, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { triggerHaptic } from "@/services/haptics";

const Pricing = () => {
  const navigate = useNavigate();

  const plans = [
    {
      id: "basic",
      name: "Atelier Basic",
      price: "R0",
      period: "Complimentary Access",
      description: "Essential tools for emerging independent artists.",
      features: [
        "Curated profile listing",
        "Up to 5 portfolio showcase images",
        "Basic calendar & booking management",
        "Direct client messaging concierge",
        "5% platform fee per booking",
      ],
      cta: "Get Started Free",
      featured: false,
    },
    {
      id: "pro",
      name: "Master Professional",
      price: "R299",
      period: "per month",
      description: "Designed for established artists accelerating growth.",
      features: [
        "Everything in Atelier Basic",
        "Unlimited high-resolution portfolio",
        "Real-time instant booking system",
        "Priority concierge client support",
        "Bespoke availability & travel settings",
        "Advanced revenue & analytics suite",
        "3% platform fee per booking",
      ],
      cta: "Begin 14-Day Trial",
      featured: true,
    },
    {
      id: "haute",
      name: "Haute Premium",
      price: "R599",
      period: "per month",
      description: "For luxury studios, salon owners and celebrity artists.",
      features: [
        "Everything in Master Professional",
        "Premier featured portfolio placement",
        "Social media & editorial exposure",
        "Bespoke marketing & promotional tools",
        "Dedicated VIP talent manager",
        "Full client CRM with VIP tagging",
        "1% platform fee per booking",
      ],
      cta: "Contact VIP Concierge",
      featured: false,
    },
  ];

  const handleSelectPlan = (plan: typeof plans[0]) => {
    triggerHaptic(12);
    toast.success(`Selected ${plan.name}. Proceeding to registration.`);
    navigate("/register-artist");
  };

  return (
    <div className="w-full">
      <section className="pt-28 sm:pt-36 pb-12 sm:pb-20 px-4 sm:px-6 md:px-12 border-b border-[#EFBDEB] dark:border-[#3B3237]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF2FA] dark:bg-[#372E3E] border border-[#EFBDEB] dark:border-[#3B3237] shadow-xs mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#DB2777]" />
            <span className="text-xs uppercase tracking-[0.2em] text-[#501854] dark:text-[#D4C7E1] font-semibold">
              Atelier Membership Tiers
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif text-[#501854] dark:text-[#D4C7E1] tracking-tight mb-4">
            Transparent <span className="italic font-normal text-[#DB2777]">Pricing</span>
          </h1>
          <p className="text-sm sm:text-base text-[#7E4882] dark:text-[#A695B8] max-w-xl mx-auto font-light leading-relaxed">
            Choose the membership tier aligned with your atelier's scale. Zero lock-in contracts, cancel anytime.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-20 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`pricing-card relative flex flex-col justify-between ${
                plan.featured ? "featured ring-2 ring-[#DB2777]" : ""
              }`}
            >
              {plan.featured && (
                <div className="absolute top-5 right-6 px-3 py-1 rounded-full bg-[#DB2777] text-white text-[10px] uppercase tracking-widest font-semibold shadow-xs">
                  Most Popular
                </div>
              )}

              <div>
                <h3 className="font-serif text-2xl text-[#501854] dark:text-[#D4C7E1] mb-2 font-medium">
                  {plan.name}
                </h3>
                <p className="text-xs text-[#7E4882] dark:text-[#A695B8] font-light mb-6">
                  {plan.description}
                </p>

                <div className="mb-8">
                  <span className="font-serif text-4xl sm:text-5xl font-medium text-[#501854] dark:text-[#D4C7E1]">
                    {plan.price}
                  </span>
                  <span className="text-xs text-[#7E4882] dark:text-[#A695B8] ml-2 font-light">
                    / {plan.period}
                  </span>
                </div>

                <div className="space-y-3.5 mb-8">
                  <span className="text-[11px] uppercase tracking-wider text-[#8C3B8A] dark:text-[#DB2777] block font-semibold">
                    Included Benefits
                  </span>
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs text-[#501854] dark:text-[#D4C7E1]">
                      <div className="w-4 h-4 rounded-full bg-[#FAF2FA] dark:bg-[#372E3E] flex items-center justify-center shrink-0 mt-0.5 text-[#DB2777]">
                        <Check size={10} />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleSelectPlan(plan)}
                className={`w-full py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold transition-all shadow-xs ${
                  plan.featured
                    ? "bg-[#501854] dark:bg-[#DB2777] text-white hover:opacity-90"
                    : "bg-white dark:bg-[#372E3E] text-[#501854] dark:text-[#D4C7E1] border border-[#EFBDEB] dark:border-[#3B3237] hover:bg-[#FAF2FA] dark:hover:bg-[#3E343C]"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Pricing;
