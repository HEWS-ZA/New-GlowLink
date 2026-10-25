import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { Sparkles, Users, Award, Target, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { triggerHaptic } from "@/services/haptics";

const About = () => {
  const navigate = useNavigate();

  const values = [
    {
      icon: Sparkles,
      title: "Passion for Beauty",
      description: "We believe in the transformative power of personalized aesthetics and mindful self-care.",
    },
    {
      icon: Users,
      title: "Community First",
      description: "Fostering intimate connections between master artists and discerning clients across South Africa.",
    },
    {
      icon: Award,
      title: "Uncompromising Excellence",
      description: "Partnering exclusively with verified, skilled professionals who uphold the highest artistic standards.",
    },
    {
      icon: Target,
      title: "Seamless Accessibility",
      description: "Making bespoke beauty services effortless to discover and book across every major metropolitan area.",
    },
  ];

  const stats = [
    { number: "5,000+", label: "Master Artisans" },
    { number: "50,000+", label: "Discerning Clients" },
    { number: "100,000+", label: "Appointments Completed" },
    { number: "9 Cities", label: "Across South Africa" },
  ];

  return (
    <div className="bg-white dark:bg-[#17111D] text-[#501854] dark:text-[#D4C7E1] min-h-screen selection:bg-[#DB2777] selection:text-white transition-colors duration-300">
      <Header />

      <section className="pt-28 sm:pt-36 pb-12 sm:pb-20 px-4 sm:px-6 md:px-12 border-b border-[#EFBDEB] dark:border-[#3B3237]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF2FA] dark:bg-[#372E3E] border border-[#EFBDEB] dark:border-[#3B3237] shadow-xs mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#DB2777]" />
            <span className="text-[11px] font-semibold tracking-[0.2em] text-[#501854] dark:text-[#D4C7E1] uppercase">
              Our Purpose & Heritage
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif text-[#501854] dark:text-[#D4C7E1] tracking-tight mb-4 sm:mb-6">
            About <span className="italic font-normal text-[#DB2777]">GlowLink</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-[#7E4882] dark:text-[#A695B8] max-w-2xl mx-auto font-light leading-relaxed">
            We are dedicated to uniting South Africa's most exceptional beauty artisans with clients who value uncompromising quality, discretion, and artistry.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 text-center">
          {stats.map((s, idx) => (
            <div key={idx} className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#241C2B] border border-[#EFBDEB] dark:border-[#3B3237] shadow-xs">
              <span className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium text-[#501854] dark:text-[#D4C7E1] block mb-1">
                {s.number}
              </span>
              <span className="text-xs uppercase tracking-widest text-[#7E4882] dark:text-[#A695B8] font-medium">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6 md:px-12 bg-[#FAF2FA]/50 dark:bg-[#241C2B]/40 border-t border-[#EFBDEB] dark:border-[#3B3237] transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.2em] text-[#DB2777] block mb-2 font-semibold">
              Our Pillars
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-[#501854] dark:text-[#D4C7E1]">
              The Principles That Guide Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, idx) => (
              <div key={idx} className="p-8 rounded-3xl bg-white dark:bg-[#241C2B] border border-[#EFBDEB] dark:border-[#3B3237] shadow-xs">
                <div className="w-10 h-10 rounded-full bg-[#FAF2FA] dark:bg-[#372E3E] flex items-center justify-center text-[#DB2777] mb-5 border border-[#EFBDEB] dark:border-[#3B3237]">
                  <v.icon size={18} />
                </div>
                <h3 className="font-serif text-lg text-[#501854] dark:text-[#D4C7E1] mb-2">{v.title}</h3>
                <p className="text-xs text-[#7E4882] dark:text-[#A695B8] font-light leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <button
              onClick={() => {
                triggerHaptic(10);
                navigate("/search");
              }}
              className="bg-[#501854] dark:bg-[#DB2777] text-white px-8 py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold hover:opacity-90 transition-all shadow-md inline-flex items-center gap-2"
            >
              <span>Explore Master Artisans</span>
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

export default About;
