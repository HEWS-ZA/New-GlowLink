import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Mail, Lock, Sparkles, ArrowRight, Phone, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { loginCustomer, DEMO_CREDENTIALS } from "@/services/authStore";
import { triggerHaptic } from "@/services/haptics";

interface CustomerAuthProps {
  initialMode?: "login" | "register";
}

export const CustomerAuth = ({ initialMode = "login" }: CustomerAuthProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectParam = searchParams.get("redirect");
  const [isRegister, setIsRegister] = useState(initialMode === "register");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic(15);

    if (!formData.email) {
      toast.error("Please enter your email address.");
      return;
    }

    loginCustomer(formData.email, formData.name, formData.phone);
    toast.success(isRegister ? "Welcome to GlowLink Client Sanctuary!" : "Welcome back to your Client Portal.");

    const destination = redirectParam ? decodeURIComponent(redirectParam) : "/customer/bookings";
    navigate(destination, { replace: true });
  };

  const handleUseDemo = () => {
    triggerHaptic(10);
    const demo = DEMO_CREDENTIALS.customer;
    setFormData({
      name: demo.name,
      email: demo.email,
      phone: demo.phone,
      password: "demoPassword123",
    });
    loginCustomer(demo.email, demo.name, demo.phone);
    toast.success(`Logged in as Demo Client: ${demo.name}`);
    const destination = redirectParam ? decodeURIComponent(redirectParam) : "/customer/bookings";
    navigate(destination, { replace: true });
  };

  return (
    <div className="w-full flex items-center justify-center px-4 sm:px-6 pt-24 sm:pt-32 pb-24 md:pb-16 min-h-[80vh]">
      <div className="auth-card w-full max-w-md border border-[#EFBDEB] dark:border-[#3B3237] bg-white dark:bg-[#241C2B] p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl shadow-xl">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF2FA] dark:bg-[#372E3E] border border-[#EFBDEB] dark:border-[#3B3237] shadow-2xs mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#DB2777]" />
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#501854] dark:text-[#D4C7E1] font-semibold">
              Client Portal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#501854] dark:text-[#D4C7E1] mb-2 font-medium">
            {isRegister ? "Create Client Account" : "Welcome Back"}
          </h1>
          <p className="text-[#7E4882] dark:text-[#A695B8] text-xs font-light">
            {isRegister
              ? "Register to reserve master beauty artisans & view receipts"
              : "Sign in to manage your appointments, deposits & balances"}
          </p>
        </div>

        {/* Demo Fast Login Button */}
        <button
          type="button"
          onClick={handleUseDemo}
          className="w-full mb-6 py-2.5 px-4 rounded-xl border border-dashed border-[#DB2777]/60 hover:border-[#DB2777] bg-pink-50/50 dark:bg-pink-950/20 text-[#DB2777] text-xs font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-2 hover:bg-pink-100/40"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Quick Login as Demo Client (Nandi Khumalo)</span>
        </button>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#501854] dark:text-[#D4C7E1] mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#8C3B8A] dark:text-[#A695B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Nandi Khumalo"
                    className="w-full bg-[#FAF2FA] dark:bg-[#372E3E] border border-[#EFBDEB] dark:border-[#3B3237] rounded-xl px-10 py-3 text-sm text-[#501854] dark:text-[#D4C7E1] placeholder:text-[#8C3B8A]/50 focus:outline-none focus:border-[#DB2777]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#501854] dark:text-[#D4C7E1] mb-1.5">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#8C3B8A] dark:text-[#A695B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+27 82 123 4567"
                    className="w-full bg-[#FAF2FA] dark:bg-[#372E3E] border border-[#EFBDEB] dark:border-[#3B3237] rounded-xl px-10 py-3 text-sm text-[#501854] dark:text-[#D4C7E1] placeholder:text-[#8C3B8A]/50 focus:outline-none focus:border-[#DB2777]"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-[#501854] dark:text-[#D4C7E1] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8C3B8A] dark:text-[#A695B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="nandi@glowlink.co.za"
                className="w-full bg-[#FAF2FA] dark:bg-[#372E3E] border border-[#EFBDEB] dark:border-[#3B3237] rounded-xl px-10 py-3 text-sm text-[#501854] dark:text-[#D4C7E1] placeholder:text-[#8C3B8A]/50 focus:outline-none focus:border-[#DB2777]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-[#501854] dark:text-[#D4C7E1] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8C3B8A] dark:text-[#A695B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-[#FAF2FA] dark:bg-[#372E3E] border border-[#EFBDEB] dark:border-[#3B3237] rounded-xl px-10 py-3 text-sm text-[#501854] dark:text-[#D4C7E1] placeholder:text-[#8C3B8A]/50 focus:outline-none focus:border-[#DB2777]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#501854] dark:bg-[#DB2777] text-white py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold hover:opacity-90 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 mt-2"
          >
            <span>{isRegister ? "Complete Client Registration" : "Sign In to Client Portal"}</span>
            <ArrowRight size={14} />
          </button>

          <div className="pt-4 border-t border-[#EFBDEB] dark:border-[#3B3237] text-center space-y-2">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-xs text-[#7E4882] dark:text-[#A695B8] hover:text-[#501854] dark:hover:text-white"
            >
              {isRegister
                ? "Already have an account? Sign In"
                : "New client? Create your account"}
            </button>

            <div className="pt-2">
              <Link
                to="/artisan/login"
                className="text-[11px] text-[#DB2777] font-semibold underline underline-offset-4 hover:opacity-80"
              >
                Are you a beauty professional? Go to Artisan Portal →
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
