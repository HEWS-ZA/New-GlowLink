import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Sparkles, ArrowRight } from "lucide-react";

const NotFound = () => {
  return (
    <div className="bg-white dark:bg-[#17111D] text-[#501854] dark:text-[#D4C7E1] min-h-screen selection:bg-[#DB2777] selection:text-white flex flex-col justify-between transition-colors duration-300">
      <Header />

      <div className="flex-grow flex items-center justify-center px-6 pt-36 pb-20">
        <div className="text-center max-w-md mx-auto p-10 glass-panel rounded-3xl border border-[#EFBDEB] dark:border-[#3B3237] bg-white/95 dark:bg-[#241C2B]/95 shadow-xl">
          <div className="w-12 h-12 rounded-full bg-[#501854] dark:bg-[#DB2777] text-white flex items-center justify-center mx-auto mb-4">
            <Sparkles size={20} className="text-pink-200" />
          </div>
          <span className="text-xs uppercase tracking-[0.2em] text-[#DB2777] font-semibold block mb-2">
            404 • Page Uncharted
          </span>
          <h1 className="font-serif text-3xl text-[#501854] dark:text-[#D4C7E1] mb-3">Aesthetic Not Found</h1>
          <p className="text-xs text-[#7E4882] dark:text-[#A695B8] font-light leading-relaxed mb-6">
            The atelier page or artisan collection you are looking for has been relocated or is currently in private curation.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-[#501854] dark:bg-[#DB2777] text-white px-7 py-3 rounded-full text-xs uppercase tracking-widest font-semibold hover:opacity-90 transition-all shadow-md"
          >
            <span>Return to Sanctuary</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NotFound;
