import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { Mail, Phone, MapPin, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { triggerHaptic } from "@/services/haptics";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic(15);
    toast.success("Thank you. Our VIP concierge team will respond within 24 hours.");
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white dark:bg-[#17111D] text-[#501854] dark:text-[#D4C7E1] min-h-screen selection:bg-[#DB2777] selection:text-white transition-colors duration-300">
      <Header />

      <section className="pt-28 sm:pt-36 pb-12 sm:pb-20 px-4 sm:px-6 md:px-12 border-b border-[#EFBDEB] dark:border-[#3B3237]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF2FA] dark:bg-[#372E3E] border border-[#EFBDEB] dark:border-[#3B3237] shadow-xs mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#DB2777]" />
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#501854] dark:text-[#D4C7E1] font-semibold">
              Concierge & Inquiries
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif text-[#501854] dark:text-[#D4C7E1] tracking-tight mb-4">
            Get in <span className="italic font-normal text-[#DB2777]">Touch</span>
          </h1>
          <p className="text-sm sm:text-base text-[#7E4882] dark:text-[#A695B8] max-w-xl mx-auto font-light leading-relaxed">
            Have bespoke requirements, corporate styling requests, or partnership proposals? Connect with our dedicated concierge desk.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-20 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
          <div className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#241C2B] border border-[#EFBDEB] dark:border-[#3B3237] shadow-xs text-center">
            <div className="w-12 h-12 rounded-full bg-[#FAF2FA] dark:bg-[#372E3E] flex items-center justify-center mx-auto mb-4 text-[#DB2777] border border-[#EFBDEB] dark:border-[#3B3237]">
              <Mail size={18} />
            </div>
            <h3 className="font-serif text-lg text-[#501854] dark:text-[#D4C7E1] mb-1">Email Concierge</h3>
            <p className="text-[#7E4882] dark:text-[#A695B8] text-xs font-light">concierge@glowlink.co.za</p>
          </div>

          <div className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#241C2B] border border-[#EFBDEB] dark:border-[#3B3237] shadow-xs text-center">
            <div className="w-12 h-12 rounded-full bg-[#FAF2FA] dark:bg-[#372E3E] flex items-center justify-center mx-auto mb-4 text-[#DB2777] border border-[#EFBDEB] dark:border-[#3B3237]">
              <Phone size={18} />
            </div>
            <h3 className="font-serif text-lg text-[#501854] dark:text-[#D4C7E1] mb-1">Direct Line</h3>
            <p className="text-[#7E4882] dark:text-[#A695B8] text-xs font-light">+27 (0) 11 883 0000</p>
          </div>

          <div className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#241C2B] border border-[#EFBDEB] dark:border-[#3B3237] shadow-xs text-center">
            <div className="w-12 h-12 rounded-full bg-[#FAF2FA] dark:bg-[#372E3E] flex items-center justify-center mx-auto mb-4 text-[#DB2777] border border-[#EFBDEB] dark:border-[#3B3237]">
              <MapPin size={18} />
            </div>
            <h3 className="font-serif text-lg text-[#501854] dark:text-[#D4C7E1] mb-1">Metropolitan Coverage</h3>
            <p className="text-[#7E4882] dark:text-[#A695B8] text-xs font-light">Sandton • Cape Town • Umhlanga</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto p-5 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#241C2B] border border-[#EFBDEB] dark:border-[#3B3237] shadow-lg">
          <h2 className="font-serif text-2xl text-[#501854] dark:text-[#D4C7E1] mb-6 text-center">Send a Private Dispatch</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#501854] dark:text-[#D4C7E1] mb-2 font-medium">Your Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl text-xs bg-white dark:bg-[#3E343C] border border-[#E7C1DC] dark:border-[#3B3237] text-[#501854] dark:text-[#D4C7E1] focus:outline-none"
                  placeholder="e.g. Siphesihle"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#501854] dark:text-[#D4C7E1] mb-2 font-medium">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl text-xs bg-white dark:bg-[#3E343C] border border-[#E7C1DC] dark:border-[#3B3237] text-[#501854] dark:text-[#D4C7E1] focus:outline-none"
                  placeholder="name@domain.co.za"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#501854] dark:text-[#D4C7E1] mb-2 font-medium">Phone (Optional)</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl text-xs bg-white dark:bg-[#3E343C] border border-[#E7C1DC] dark:border-[#3B3237] text-[#501854] dark:text-[#D4C7E1] focus:outline-none"
                  placeholder="+27 82 000 0000"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#501854] dark:text-[#D4C7E1] mb-2 font-medium">Inquiry Type</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl text-xs bg-white dark:bg-[#3E343C] border border-[#E7C1DC] dark:border-[#3B3237] text-[#501854] dark:text-[#D4C7E1] focus:outline-none"
                >
                  <option value="">Select subject...</option>
                  <option value="appointment">Private Appointment Concierge</option>
                  <option value="bridal">Bridal & Bridal Party Package</option>
                  <option value="artist-inquiry">Artisan Representation</option>
                  <option value="partnership">Brand / Media Partnership</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-[#501854] dark:text-[#D4C7E1] mb-2 font-medium">Message</label>
              <textarea
                name="message"
                rows={4}
                required
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl text-xs bg-white dark:bg-[#3E343C] border border-[#E7C1DC] dark:border-[#3B3237] text-[#501854] dark:text-[#D4C7E1] focus:outline-none"
                placeholder="How may our concierge team assist your beauty aspirations?"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#501854] dark:bg-[#DB2777] text-white py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold hover:opacity-90 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Transmit Dispatch</span>
              <Send size={14} />
            </button>
          </form>
        </div>
      </section>

      <ScrollToTop />
      <Footer />
    </div>
  );
};

export default Contact;
