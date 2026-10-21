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
    <div className="bg-[#FAF8F5] text-neutral-900 min-h-screen selection:bg-neutral-900 selection:text-white">
      <Header />

      <section className="pt-36 pb-20 px-6 md:px-12 border-b border-neutral-200/70">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-neutral-200/80 shadow-xs mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs uppercase tracking-[0.2em] text-neutral-600 font-semibold">
              Concierge & Inquiries
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-neutral-950 tracking-tight mb-4">
            Get in <span className="italic font-normal">Touch</span>
          </h1>
          <p className="text-base text-neutral-600 max-w-xl mx-auto font-light leading-relaxed">
            Have bespoke requirements, corporate styling requests, or partnership proposals? Connect with our dedicated concierge desk.
          </p>
        </div>
      </section>

      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-8 rounded-3xl bg-white border border-neutral-200/80 shadow-xs text-center">
            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4 text-neutral-900">
              <Mail size={18} />
            </div>
            <h3 className="font-serif text-lg text-neutral-950 mb-1">Email Concierge</h3>
            <p className="text-neutral-500 text-xs font-light">concierge@glowlink.co.za</p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-neutral-200/80 shadow-xs text-center">
            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4 text-neutral-900">
              <Phone size={18} />
            </div>
            <h3 className="font-serif text-lg text-neutral-950 mb-1">Direct Line</h3>
            <p className="text-neutral-500 text-xs font-light">+27 (0) 11 883 0000</p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-neutral-200/80 shadow-xs text-center">
            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4 text-neutral-900">
              <MapPin size={18} />
            </div>
            <h3 className="font-serif text-lg text-neutral-950 mb-1">Metropolitan Coverage</h3>
            <p className="text-neutral-500 text-xs font-light">Sandton • Cape Town • Umhlanga</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto p-8 md:p-12 rounded-3xl bg-white border border-neutral-200/80 shadow-lg">
          <h2 className="font-serif text-2xl text-neutral-950 mb-6 text-center">Send a Private Dispatch</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs uppercase tracking-widest text-neutral-600 mb-2 font-medium">Your Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl text-xs bg-neutral-50 border border-neutral-300 focus:outline-none"
                  placeholder="e.g. Siphesihle"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-neutral-600 mb-2 font-medium">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl text-xs bg-neutral-50 border border-neutral-300 focus:outline-none"
                  placeholder="siphe@domain.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs uppercase tracking-widest text-neutral-600 mb-2 font-medium">Mobile Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl text-xs bg-neutral-50 border border-neutral-300 focus:outline-none"
                  placeholder="+27 82 000 0000"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-neutral-600 mb-2 font-medium">Subject</label>
                <input
                  type="text"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl text-xs bg-neutral-50 border border-neutral-300 focus:outline-none"
                  placeholder="Bridal Party Booking / Inquiry"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-neutral-600 mb-2 font-medium">Message</label>
              <textarea
                name="message"
                required
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl text-xs bg-neutral-50 border border-neutral-300 focus:outline-none"
                placeholder="Details of your request, event date, location, or questions..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-neutral-950 text-white py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Send size={14} />
              <span>Transmit Dispatch</span>
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
