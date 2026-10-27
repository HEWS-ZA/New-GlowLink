import { useState } from "react";
import { User, Phone, Mail, Shield, Sparkles, Check } from "lucide-react";
import { useAuth } from "@/services/authStore";
import { triggerHaptic } from "@/services/haptics";
import { toast } from "sonner";

export const CustomerProfile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "Nandi Khumalo",
    email: user?.email || "nandi@glowlink.co.za",
    phone: user?.phone || "+27 82 555 1234",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic(12);
    toast.success("Profile preferences updated successfully.");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-8">
      <div className="mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF2FA] dark:bg-[#372E3E] border border-[#EFBDEB] dark:border-[#3B3237] shadow-2xs mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#DB2777]" />
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#501854] dark:text-[#D4C7E1] font-semibold">
            Client Sanctuary Profile
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif text-[#501854] dark:text-[#D4C7E1]">
          Account <span className="italic font-normal text-[#DB2777]">Settings</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#7E4882] dark:text-[#A695B8] font-light mt-1">
          Manage your personal details, contact number for mobile appointments, and preferences.
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#241C2B] border border-[#EFBDEB] dark:border-[#3B3237] shadow-sm">
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-[#501854] dark:text-[#D4C7E1] mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#8C3B8A] dark:text-[#A695B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#FAF2FA] dark:bg-[#372E3E] border border-[#EFBDEB] dark:border-[#3B3237] rounded-xl px-10 py-3 text-sm text-[#501854] dark:text-[#D4C7E1] focus:outline-none focus:border-[#DB2777]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-[#501854] dark:text-[#D4C7E1] mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8C3B8A] dark:text-[#A695B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                disabled
                value={formData.email}
                className="w-full bg-[#FAF2FA]/50 dark:bg-[#372E3E]/50 border border-[#EFBDEB]/60 dark:border-[#3B3237] rounded-xl px-10 py-3 text-sm text-gray-500 cursor-not-allowed"
              />
            </div>
            <p className="text-[10px] text-[#7E4882] dark:text-[#A695B8] mt-1 font-light">
              Email is tied to your GlowLink booking receipts.
            </p>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-[#501854] dark:text-[#D4C7E1] mb-2">
              Mobile Contact Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#8C3B8A] dark:text-[#A695B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-[#FAF2FA] dark:bg-[#372E3E] border border-[#EFBDEB] dark:border-[#3B3237] rounded-xl px-10 py-3 text-sm text-[#501854] dark:text-[#D4C7E1] focus:outline-none focus:border-[#DB2777]"
              />
            </div>
            <p className="text-[10px] text-[#7E4882] dark:text-[#A695B8] mt-1 font-light">
              Used by artisans to coordinate arrival for mobile house-call appointments.
            </p>
          </div>

          <div className="pt-4 border-t border-[#EFBDEB]/60 dark:border-[#3B3237]">
            <button
              type="submit"
              className="bg-[#501854] dark:bg-[#DB2777] text-white px-7 py-3 rounded-full text-xs uppercase tracking-widest font-semibold hover:opacity-90 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Check size={14} />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
