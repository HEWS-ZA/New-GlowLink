import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { Upload, Sparkles, Check, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { registerNewArtisan } from "@/services/artisanStore";
import { loginArtisan } from "@/services/authStore";
import { triggerHaptic } from "@/services/haptics";

const RegisterArtist = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    businessName: "",
    specialty: "Bridal & Editorial Makeup",
    category: "makeup",
    location: "Sandton, Johannesburg",
    city: "Johannesburg",
    experience: "5+ Years",
    bio: "",
    instagram: "@glow_atelier",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic(15);

    const fullName = `${formData.firstName} ${formData.lastName}`.trim() || formData.businessName || "Artisan";
    registerNewArtisan({
      name: fullName,
      specialty: formData.specialty,
      category: formData.category as any,
      location: formData.location,
      city: formData.city,
      experience: formData.experience,
      bio: formData.bio || "Dedicated beauty artisan offering private studio appointments and bespoke styling.",
      socials: { instagram: formData.instagram },
    });

    loginArtisan(formData.email || "artisan@glowlink.co.za");
    toast.success("Artisan application submitted! Welcome to GlowLink Atelier.");
    navigate("/dashboard");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-[#FAF8F5] text-neutral-900 min-h-screen selection:bg-neutral-900 selection:text-white">
      <Header />

      <section className="pt-36 pb-20 px-6 md:px-12 border-b border-neutral-200/70">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-neutral-200/80 shadow-xs mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs uppercase tracking-[0.2em] text-neutral-600 font-semibold">
                Atelier Representation
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-serif text-neutral-950 mb-3">
              Join <span className="italic font-normal">GlowLink</span>
            </h1>
            <p className="text-neutral-600 text-xs md:text-sm font-light">
              Elevate your beauty business across South Africa's premier luxury clientele
            </p>
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-center items-center gap-2 sm:gap-3 mb-12">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2 sm:gap-3">
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                    step >= s
                      ? "bg-neutral-950 text-white shadow-xs"
                      : "border border-neutral-300 text-neutral-400 bg-white"
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-6 sm:w-12 h-0.5 transition-all ${
                      step > s ? "bg-neutral-950" : "bg-neutral-200"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>

          <div className="p-8 md:p-12 rounded-3xl border border-neutral-200/80 bg-white shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Personal Info */}
              {step === 1 && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  <div className="mb-6">
                    <span className="text-xs uppercase tracking-widest text-neutral-500 block mb-1 font-semibold">
                      Step 01
                    </span>
                    <h2 className="font-serif text-2xl text-neutral-950">Personal Credentials</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-neutral-600 mb-2 font-medium">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-2xl text-xs bg-neutral-50 border border-neutral-300 focus:outline-none"
                        placeholder="e.g. Lerato"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-neutral-600 mb-2 font-medium">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-2xl text-xs bg-neutral-50 border border-neutral-300 focus:outline-none"
                        placeholder="e.g. Ndlovu"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-neutral-600 mb-2 font-medium">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-2xl text-xs bg-neutral-50 border border-neutral-300 focus:outline-none"
                        placeholder="artisan@domain.co.za"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-neutral-600 mb-2 font-medium">
                        Mobile Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-2xl text-xs bg-neutral-50 border border-neutral-300 focus:outline-none"
                        placeholder="+27 82 000 0000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-neutral-600 mb-2 font-medium">
                      Create Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-2xl text-xs bg-neutral-50 border border-neutral-300 focus:outline-none"
                      placeholder="Minimum 8 characters"
                    />
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic(10);
                        if (!formData.firstName || !formData.email) {
                          toast.error("Please fill in required fields.");
                          return;
                        }
                        setStep(2);
                      }}
                      className="bg-neutral-950 text-white px-8 py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800 transition-all flex items-center gap-2 shadow-md"
                    >
                      <span>Continue to Atelier Info</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Business & Specialty */}
              {step === 2 && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  <div className="mb-6">
                    <span className="text-xs uppercase tracking-widest text-neutral-500 block mb-1 font-semibold">
                      Step 02
                    </span>
                    <h2 className="font-serif text-2xl text-neutral-950">Atelier Discipline & Reach</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-neutral-600 mb-2 font-medium">
                        Atelier / Business Name
                      </label>
                      <input
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-2xl text-xs bg-neutral-50 border border-neutral-300 focus:outline-none"
                        placeholder="e.g. Ndlovu Haute Coiffure"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-neutral-600 mb-2 font-medium">
                        Primary Discipline
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-2xl text-xs bg-neutral-50 border border-neutral-300 focus:outline-none"
                      >
                        <option value="makeup">Makeup (Bridal & Editorial)</option>
                        <option value="hair-styling">Hair Styling & Couture</option>
                        <option value="nails">Nails & Lashes</option>
                        <option value="braids">Braids & Natural Locs</option>
                        <option value="barbering">Precision Barbering</option>
                        <option value="skincare">Aesthetics & Facials</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-neutral-600 mb-2 font-medium">
                        Location / Suburb
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-2xl text-xs bg-neutral-50 border border-neutral-300 focus:outline-none"
                        placeholder="e.g. Camps Bay, Cape Town"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-neutral-600 mb-2 font-medium">
                        Professional Experience
                      </label>
                      <select
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-2xl text-xs bg-neutral-50 border border-neutral-300 focus:outline-none"
                      >
                        <option value="1-3 Years">1 - 3 Years</option>
                        <option value="3-5 Years">3 - 5 Years</option>
                        <option value="5-10 Years">5 - 10 Years</option>
                        <option value="10+ Years">10+ Years (Master Level)</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="border border-neutral-300 text-neutral-700 hover:text-neutral-950 px-6 py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold transition-all flex items-center gap-2"
                    >
                      <ArrowLeft size={14} />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic(10);
                        setStep(3);
                      }}
                      className="bg-neutral-950 text-white px-8 py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800 transition-all flex items-center gap-2 shadow-md"
                    >
                      <span>Continue to Bio & Portfolio</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Bio & Portfolio */}
              {step === 3 && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  <div className="mb-6">
                    <span className="text-xs uppercase tracking-widest text-neutral-500 block mb-1 font-semibold">
                      Step 03
                    </span>
                    <h2 className="font-serif text-2xl text-neutral-950">Atelier Showcase</h2>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-neutral-600 mb-2 font-medium">
                      Instagram Profile
                    </label>
                    <input
                      type="text"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-2xl text-xs bg-neutral-50 border border-neutral-300 focus:outline-none"
                      placeholder="@yourhandle"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-neutral-600 mb-2 font-medium">
                      Artisan Bio & Artistic Vision
                    </label>
                    <textarea
                      name="bio"
                      rows={4}
                      value={formData.bio}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-2xl text-xs bg-neutral-50 border border-neutral-300 focus:outline-none"
                      placeholder="Tell clients about your aesthetic approach, certifications, and high-profile work..."
                    />
                  </div>

                  <div className="p-6 border-2 border-dashed border-neutral-300 rounded-3xl text-center bg-neutral-50/50">
                    <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-neutral-900 mb-1">Upload Portfolio Samples</p>
                    <p className="text-[11px] text-neutral-500 font-light">
                      PNG, JPG up to 10MB each. High-resolution imagery recommended.
                    </p>
                  </div>

                  <div className="pt-4 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="border border-neutral-300 text-neutral-700 hover:text-neutral-950 px-6 py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold transition-all flex items-center gap-2"
                    >
                      <ArrowLeft size={14} />
                      <span>Back</span>
                    </button>
                    <button
                      type="submit"
                      className="bg-neutral-950 text-white px-8 py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800 transition-all flex items-center gap-2 shadow-md"
                    >
                      <Check size={14} />
                      <span>Submit Application</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      <ScrollToTop />
      <Footer />
    </div>
  );
};

export default RegisterArtist;
