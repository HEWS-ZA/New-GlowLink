import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { triggerHaptic } from "@/services/haptics";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    triggerHaptic(10);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-20 md:bottom-8 right-6 z-40 glass-panel p-3 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white/90 text-neutral-900 border border-neutral-200/80 active:scale-95 shadow-sm"
      aria-label="Scroll to top"
    >
      <ArrowUp size={18} />
    </button>
  );
};

export default ScrollToTop;
