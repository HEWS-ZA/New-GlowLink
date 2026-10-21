import { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, Instagram, Facebook, Twitter } from "lucide-react";
import { toast } from "sonner";
import { triggerHaptic } from "@/services/haptics";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    triggerHaptic(15);
    toast.success("Thank you for subscribing to GlowLink Curated Journal.");
    setEmail("");
  };

  return (
    <footer className="bg-[#F5F2EC] text-neutral-600 pt-20 pb-24 md:pb-12 px-6 md:px-12 border-t border-neutral-200/80 mt-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link
              to="/"
              className="text-2xl text-neutral-900 tracking-tight font-serif italic mb-4 inline-flex items-center gap-2 group"
            >
              <div className="w-7 h-7 rounded-full bg-neutral-900 text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              </div>
              <span className="font-medium">GlowLink</span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-xs text-neutral-600 font-light">
              Connecting beauty with mastery across South Africa. Redefining personal aesthetics through curated artisan talent and seamless reservations.
            </p>
            <div className="flex gap-3 text-neutral-700">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-neutral-950 transition-colors p-2.5 rounded-full bg-white/80 border border-neutral-200/60 hover:shadow-xs" aria-label="Instagram">
                <Instagram size={16} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-neutral-950 transition-colors p-2.5 rounded-full bg-white/80 border border-neutral-200/60 hover:shadow-xs" aria-label="Facebook">
                <Facebook size={16} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-neutral-950 transition-colors p-2.5 rounded-full bg-white/80 border border-neutral-200/60 hover:shadow-xs" aria-label="Twitter">
                <Twitter size={16} />
              </a>
            </div>
          </div>

          {/* Explore Links */}
          <div>
            <h4 className="text-neutral-900 text-xs font-semibold uppercase tracking-[0.2em] mb-5">
              Explore
            </h4>
            <ul className="space-y-3.5 text-sm font-normal text-neutral-600">
              <li>
                <Link to="/search" className="hover:text-neutral-950 transition-colors">
                  Find Artisans
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-neutral-950 transition-colors">
                  The Experience
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-neutral-950 transition-colors">
                  Membership Plans
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-neutral-950 transition-colors">
                  Our Philosophy
                </Link>
              </li>
            </ul>
          </div>

          {/* Artisans Links */}
          <div>
            <h4 className="text-neutral-900 text-xs font-semibold uppercase tracking-[0.2em] mb-5">
              For Artisans
            </h4>
            <ul className="space-y-3.5 text-sm font-normal text-neutral-600">
              <li>
                <Link to="/register-artist" className="hover:text-neutral-950 transition-colors">
                  Apply for Representation
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-neutral-950 transition-colors">
                  Atelier Console Login
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-neutral-950 transition-colors">
                  Fee Structure & Tiers
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-neutral-950 transition-colors">
                  Artisan Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-neutral-900 text-xs font-semibold uppercase tracking-[0.2em] mb-3">
              The Curated Dispatch
            </h4>
            <p className="text-sm font-light text-neutral-600 mb-5 leading-relaxed">
              Seasonal trends, master interviews, and private atelier opening invitations delivered monthly.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2.5">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/90 border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 rounded-full pl-5 pr-12 py-3 text-xs focus:outline-none focus:border-neutral-900 shadow-2xs"
                  required
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-neutral-950 text-white flex items-center justify-center hover:bg-neutral-800 transition-colors shadow-xs"
                >
                  <ArrowRight size={14} />
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-neutral-300/60 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-light text-neutral-500">
          <p>© {new Date().getFullYear()} GlowLink Atelier. All rights reserved. Registered in South Africa.</p>
          <div className="flex gap-6">
            <Link to="/contact" className="hover:text-neutral-900 transition-colors">
              Privacy Discretion
            </Link>
            <Link to="/contact" className="hover:text-neutral-900 transition-colors">
              Terms of Patronage
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
