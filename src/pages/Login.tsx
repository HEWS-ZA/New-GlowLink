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
    <div className="bg-[#FAF8F5] text-neutral-900 min-h-screen selection:bg-neutral-900 selection:text-white flex flex-col justify-between">
      <Header />

      <div className="flex-grow flex items-center justify-center px-6 pt-36 pb-20">
        <div className="auth-card w-full max-w-md border border-neutral-200/80 bg-white p-8 md:p-12 rounded-3xl shadow-xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 shadow-2xs mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs uppercase tracking-[0.2em] text-neutral-600 font-semibold">
                Private Access
              </span>
            </div>
            <h1 className="text-3xl font-serif text-neutral-950 mb-2 font-medium">Welcome Back</h1>
            <p className="text-neutral-500 text-xs font-light">
              Sign in to manage your bookings and clientele
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-widest text-neutral-600 mb-2 font-medium">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400"
                  size={16}
                />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl text-xs bg-neutral-50 text-neutral-900 border border-neutral-300 focus:outline-none"
                  placeholder="artisan@glowlink.co.za"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-neutral-600 mb-2 font-medium">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400"
                  size={16}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-11 pr-11 py-3 rounded-2xl text-xs bg-neutral-50 text-neutral-900 border border-neutral-300 focus:outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-900 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center cursor-pointer text-neutral-600">
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="rounded-md border-neutral-300 text-neutral-900 focus:ring-0"
                />
                <span className="ml-2">Remember credentials</span>
              </label>
              <span className="text-neutral-500 hover:text-neutral-900 cursor-pointer transition-colors">
                Forgot password?
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-neutral-950 text-white py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Sign In to Console</span>
              <ArrowRight size={14} />
            </button>

            <div className="pt-4 border-t border-neutral-100 text-center">
              <p className="text-xs text-neutral-500 font-light">
                Not yet represented?{" "}
                <Link
                  to="/register-artist"
                  className="font-semibold text-neutral-950 underline underline-offset-4 hover:text-neutral-800"
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
