import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { loginArtisan } from "@/services/authStore";
import { triggerHaptic } from "@/services/haptics";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic(15);

    if (!formData.email || !formData.password) {
      toast.error("Please enter your email and password.");
      return;
    }

    loginArtisan(formData.email);
    toast.success("Welcome back to your Atelier Portal.");
    navigate("/dashboard");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <div className="bg-white dark:bg-[#17111D] text-[#501854] dark:text-[#D4C7E1] min-h-screen selection:bg-[#DB2777] selection:text-white flex flex-col justify-between transition-colors duration-300">
      <Header />

      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 pt-28 sm:pt-36 pb-28 md:pb-20">
        <div className="auth-card w-full max-w-md border border-[#EFBDEB] dark:border-[#3B3237] bg-white dark:bg-[#241C2B] p-5 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl shadow-xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF2FA] dark:bg-[#372E3E] border border-[#EFBDEB] dark:border-[#3B3237] shadow-2xs mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#DB2777]" />
              <span className="text-xs uppercase tracking-[0.2em] text-[#501854] dark:text-[#D4C7E1] font-semibold">
                Private Access
              </span>
            </div>
            <h1 className="text-3xl font-serif text-[#501854] dark:text-[#D4C7E1] mb-2 font-medium">Welcome Back</h1>
            <p className="text-[#7E4882] dark:text-[#A695B8] text-xs font-light">
              Sign in to manage your bookings and clientele
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#501854] dark:text-[#D4C7E1] mb-2 font-medium">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#8C3B8A] dark:text-[#A695B8]"
                  size={16}
                />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl text-xs bg-white dark:bg-[#3E343C] text-[#501854] dark:text-[#D4C7E1] border border-[#E7C1DC] dark:border-[#3B3237] focus:outline-none"
                  placeholder="artisan@glowlink.co.za"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-[#501854] dark:text-[#D4C7E1] mb-2 font-medium">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#8C3B8A] dark:text-[#A695B8]"
                  size={16}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-11 pr-11 py-3 rounded-2xl text-xs bg-white dark:bg-[#3E343C] text-[#501854] dark:text-[#D4C7E1] border border-[#E7C1DC] dark:border-[#3B3237] focus:outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#8C3B8A] dark:text-[#A695B8] hover:text-[#DB2777] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center cursor-pointer text-[#7E4882] dark:text-[#A695B8]">
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="rounded-md border-[#EFBDEB] dark:border-[#3B3237] text-[#501854] focus:ring-[#DB2777]"
                />
                <span className="ml-2">Remember credentials</span>
              </label>
              <span className="text-[#DB2777] hover:underline cursor-pointer transition-colors">
                Forgot password?
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-[#501854] dark:bg-[#DB2777] text-white py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold hover:opacity-90 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Sign In to Console</span>
              <ArrowRight size={14} />
            </button>

            <div className="pt-4 border-t border-[#EFBDEB] dark:border-[#3B3237] text-center">
              <p className="text-xs text-[#7E4882] dark:text-[#A695B8] font-light">
                Not yet represented?{" "}
                <Link
                  to="/register-artist"
                  className="font-semibold text-[#DB2777] underline underline-offset-4 hover:opacity-80"
                >
                  Apply for Atelier Roster
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
