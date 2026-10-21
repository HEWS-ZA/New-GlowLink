import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Sparkles, ArrowRight } from "lucide-react";

const NotFound = () => {
  return (
    <div className="bg-[#FAF8F5] text-neutral-900 min-h-screen selection:bg-neutral-900 selection:text-white flex flex-col justify-between">
      <Header />

      <div className="flex-grow flex items-center justify-center px-6 pt-36 pb-20">
        <div className="text-center max-w-md mx-auto p-10 glass-panel rounded-3xl border border-neutral-200 shadow-xl">
          <div className="w-12 h-12 rounded-full bg-neutral-900 text-amber-300 flex items-center justify-center mx-auto mb-4">
            <Sparkles size={20} />
          </div>
          <span className="text-xs uppercase tracking-[0.2em] text-neutral-500 font-semibold block mb-2">
            404 • Page Uncharted
          </span>
          <h1 className="font-serif text-3xl text-neutral-950 mb-3">Aesthetic Not Found</h1>
          <p className="text-xs text-neutral-600 font-light leading-relaxed mb-6">
            The atelier page or artisan collection you are looking for has been relocated or is currently in private curation.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-neutral-950 text-white px-7 py-3 rounded-full text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800 transition-all shadow-md"
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
