import { Check, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
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
    <div className="bg-[#FAF8F5] text-neutral-900 min-h-screen selection:bg-neutral-900 selection:text-white">
      <Header />

      <section className="pt-36 pb-20 px-6 md:px-12 border-b border-neutral-200/70">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-neutral-200/80 shadow-xs mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs uppercase tracking-[0.2em] text-neutral-600 font-semibold">
              Atelier Membership Tiers
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-neutral-950 tracking-tight mb-4">
            Transparent <span className="italic font-normal">Pricing</span>
          </h1>
          <p className="text-base text-neutral-600 max-w-xl mx-auto font-light leading-relaxed">
            Choose the membership tier aligned with your atelier's scale. Zero lock-in contracts, cancel anytime.
          </p>
        </div>
      </section>

      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`pricing-card relative flex flex-col justify-between ${
                plan.featured ? "featured ring-2 ring-neutral-950" : ""
              }`}
            >
              {plan.featured && (
                <div className="absolute top-5 right-6 px-3 py-1 rounded-full bg-neutral-950 text-white text-[10px] uppercase tracking-widest font-semibold shadow-xs">
                  Most Popular
                </div>
              )}

              <div>
                <h3 className="font-serif text-2xl text-neutral-950 mb-2 font-medium">
                  {plan.name}
                </h3>
                <p className="text-xs text-neutral-500 font-light mb-6">
                  {plan.description}
                </p>

                <div className="mb-8">
                  <span className="font-serif text-4xl sm:text-5xl font-medium text-neutral-950">
                    {plan.price}
                  </span>
                  <span className="text-xs text-neutral-500 ml-2 font-light">
                    / {plan.period}
                  </span>
                </div>

                <div className="space-y-3.5 mb-8">
                  <span className="text-[11px] uppercase tracking-wider text-neutral-400 block font-semibold">
                    Included Benefits
                  </span>
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs text-neutral-700">
                      <div className="w-4 h-4 rounded-full bg-neutral-100 flex items-center justify-center shrink-0 mt-0.5 text-neutral-900">
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
                    ? "bg-neutral-950 text-white hover:bg-neutral-800"
                    : "bg-white text-neutral-950 border border-neutral-300 hover:bg-neutral-50"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      <ScrollToTop />
      <Footer />
    </div>
  );
};

export default Pricing;
