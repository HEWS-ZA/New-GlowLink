import { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import {
  MapPin,
  Star,
  Instagram,
  Facebook,
  Twitter,
  Clock,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { getArtisanById, addArtisanReview } from "@/services/artisanStore";
import { createBooking } from "@/services/bookingStore";
import { triggerHaptic } from "@/services/haptics";

const Profile = () => {
  const { id } = useParams<{ id?: string }>();
  const artisan = getArtisanById(id || "1") || getArtisanById("1")!;

  const [selectedServiceId, setSelectedServiceId] = useState<number>(artisan.services[0]?.id || 1);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("14:00");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

  // Review Form State
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);

  const selectedService = artisan.services.find((s) => s.id === selectedServiceId) || artisan.services[0];

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic(15);

    if (!bookingDate) {
      toast.error("Please choose a date for your atelier appointment.");
      return;
    }
    if (!clientName || !clientEmail || !clientPhone) {
      toast.error("Please provide your contact name, email, and phone number.");
      return;
    }

    setIsSubmittingBooking(true);

    try {
      createBooking({
        artisanId: artisan.id,
        artisanName: artisan.name,
        serviceName: selectedService.name,
        servicePrice: selectedService.price,
        date: bookingDate,
        time: bookingTime,
        clientName,
        clientEmail,
        clientPhone,
        status: "Confirmed",
      });

      toast.success(
        `Reservation confirmed with ${artisan.name} for ${selectedService.name} on ${bookingDate} at ${bookingTime}.`
      );

      setBookingDate("");
      setClientName("");
      setClientEmail("");
      setClientPhone("");
    } catch {
      toast.error("Unable to record appointment. Please try again.");
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic(12);

    if (!reviewName || !reviewComment) {
      toast.error("Please enter your name and comments.");
      return;
    }

    addArtisanReview(artisan.id, {
      name: reviewName,
      rating: reviewRating,
      comment: reviewComment,
    });

    toast.success("Thank you. Your impression has been recorded.");
    setReviewName("");
    setReviewComment("");
    setShowReviewForm(false);
  };

  const times = ["09:00", "11:00", "14:00", "16:00", "18:00"];

  return (
    <div className="bg-white dark:bg-[#17111D] text-[#501854] dark:text-[#D4C7E1] min-h-screen selection:bg-[#DB2777] selection:text-white transition-colors duration-300">
      <Header />

      <section className="pt-28 sm:pt-36 pb-16 px-4 sm:px-6 md:px-12 border-b border-[#EFBDEB] dark:border-[#3B3237]">
        <div className="max-w-7xl mx-auto">
          {/* Profile Banner */}
          <div className="p-5 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl border border-[#EFBDEB] dark:border-[#3B3237] bg-white dark:bg-[#241C2B] shadow-xs backdrop-blur-md mb-8 sm:mb-12">
            <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-start md:items-center">
              <div className="relative shrink-0">
                <img
                  src={artisan.image}
                  alt={artisan.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-full object-cover border-4 border-[#EFBDEB] dark:border-[#3B3237] shadow-lg"
                />
                <span className="absolute bottom-1 right-1 w-4 h-4 sm:w-5 sm:h-5 bg-emerald-500 rounded-full border-2 border-white shadow-xs"></span>
              </div>
              
              <div className="flex-grow">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                  <span className="text-[10px] uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-[#FAF2FA] dark:bg-[#372E3E] text-[#501854] dark:text-[#D4C7E1] font-semibold border border-[#EFBDEB] dark:border-[#3B3237]">
                    {artisan.tag}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#7E4882] dark:text-[#A695B8] font-medium">
                    {artisan.experience}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-5xl font-serif text-[#501854] dark:text-[#D4C7E1] font-medium mb-1">
                  {artisan.name}
                </h1>
                <p className="text-[#7E4882] dark:text-[#A695B8] text-sm md:text-base font-light mb-4">
                  {artisan.specialty}
                </p>

                <div className="flex flex-wrap items-center gap-6 text-xs text-[#7E4882] dark:text-[#A695B8] mb-5">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-[#DB2777]" />
                    <span>{artisan.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#501854] dark:text-[#D4C7E1] font-medium">
                    <Star size={14} className="text-[#DB2777] fill-[#DB2777]" />
                    <span>{artisan.rating}</span>
                    <span className="text-[#7E4882] dark:text-[#A695B8] font-normal">({artisan.reviewsCount} verified reviews)</span>
                  </div>
                </div>

                <p className="text-sm font-light text-[#501854] dark:text-[#D4C7E1] max-w-3xl leading-relaxed mb-6">
                  {artisan.bio}
                </p>

                <div className="flex gap-3 text-[#501854] dark:text-[#D4C7E1]">
                  {artisan.socials.instagram && (
                    <a
                      href={`https://instagram.com/${artisan.socials.instagram.replace("@", "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-[#DB2777] transition-colors p-2 rounded-full bg-[#FAF2FA] dark:bg-[#372E3E] border border-[#EFBDEB] dark:border-[#3B3237]"
                      aria-label="Instagram"
                    >
                      <Instagram size={16} />
                    </a>
                  )}
                  {artisan.socials.facebook && (
                    <a
                      href="#"
                      className="hover:text-[#DB2777] transition-colors p-2 rounded-full bg-[#FAF2FA] dark:bg-[#372E3E] border border-[#EFBDEB] dark:border-[#3B3237]"
                      aria-label="Facebook"
                    >
                      <Facebook size={16} />
                    </a>
                  )}
                  {artisan.socials.twitter && (
                    <a
                      href="#"
                      className="hover:text-[#DB2777] transition-colors p-2 rounded-full bg-[#FAF2FA] dark:bg-[#372E3E] border border-[#EFBDEB] dark:border-[#3B3237]"
                      aria-label="Twitter"
                    >
                      <Twitter size={16} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Services & Portfolio (8 cols) */}
            <div className="lg:col-span-8 space-y-12">
              {/* Service Menu */}
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-[#DB2777] mb-2 block font-semibold">
                  Curated Menu
                </span>
                <h2 className="text-2xl md:text-3xl font-serif text-[#501854] dark:text-[#D4C7E1] mb-6">
                  Services & Rates
                </h2>
                <div className="space-y-4">
                  {artisan.services.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => {
                        triggerHaptic(8);
                        setSelectedServiceId(service.id);
                      }}
                      className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl border cursor-pointer transition-all duration-300 shadow-2xs ${
                        selectedServiceId === service.id
                          ? "bg-[#FAF2FA] dark:bg-[#372E3E] border-[#DB2777] shadow-md ring-1 ring-[#DB2777]"
                          : "bg-white dark:bg-[#241C2B] border-[#EFBDEB] dark:border-[#3B3237] hover:border-[#DB2777]"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-serif text-lg text-[#501854] dark:text-[#D4C7E1] font-medium">
                            {service.name}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-[#7E4882] dark:text-[#A695B8] mt-0.5">
                            <Clock size={12} className="text-[#DB2777]" />
                            <span>{service.duration}</span>
                          </div>
                        </div>
                        <span className="font-serif text-lg font-medium text-[#DB2777]">
                          {service.price}
                        </span>
                      </div>
                      <p className="text-xs text-[#7E4882] dark:text-[#A695B8] font-light leading-relaxed">
                        {service.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Portfolio Grid */}
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-[#DB2777] mb-2 block font-semibold">
                  Visual Mastery
                </span>
                <h2 className="text-2xl md:text-3xl font-serif text-[#501854] dark:text-[#D4C7E1] mb-6">
                  Atelier Portfolio
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {artisan.portfolio.map((img, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl overflow-hidden aspect-square bg-[#FAF2FA] dark:bg-[#372E3E] border border-[#EFBDEB] dark:border-[#3B3237] shadow-2xs group"
                    >
                      <img
                        src={img}
                        alt={`Portfolio piece ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Client Impressions & Reviews */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <span className="text-xs uppercase tracking-[0.2em] text-[#DB2777] mb-1 block font-semibold">
                      Client Voices
                    </span>
                    <h2 className="text-2xl md:text-3xl font-serif text-[#501854] dark:text-[#D4C7E1]">
                      Impressions & Reviews
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      triggerHaptic(10);
                      setShowReviewForm(!showReviewForm);
                    }}
                    className="border border-[#EFBDEB] dark:border-[#3B3237] hover:border-[#DB2777] bg-[#FAF2FA] dark:bg-[#372E3E] px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold text-[#501854] dark:text-[#D4C7E1] transition-all shadow-2xs"
                  >
                    {showReviewForm ? "Close Form" : "Leave Review"}
                  </button>
                </div>

                {/* Review Submission Form */}
                {showReviewForm && (
                  <form onSubmit={handleReviewSubmit} className="glass-panel p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-[#EFBDEB] dark:border-[#3B3237] mb-8 space-y-4">
                    <h3 className="font-serif text-base text-[#501854] dark:text-[#D4C7E1]">Share your experience with {artisan.name}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-[#501854] dark:text-[#D4C7E1] mb-1.5 font-medium">Your Name</label>
                        <input
                          type="text"
                          required
                          value={reviewName}
                          onChange={(e) => setReviewName(e.target.value)}
                          placeholder="e.g. Kagiso S."
                          className="w-full px-4 py-2.5 text-xs bg-white dark:bg-[#3E343C] border border-[#E7C1DC] dark:border-[#3B3237] rounded-xl text-[#501854] dark:text-[#D4C7E1]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-[#501854] dark:text-[#D4C7E1] mb-1.5 font-medium">Rating Score</label>
                        <select
                          value={reviewRating}
                          onChange={(e) => setReviewRating(Number(e.target.value))}
                          className="w-full px-4 py-2.5 text-xs bg-white dark:bg-[#3E343C] border border-[#E7C1DC] dark:border-[#3B3237] rounded-xl text-[#501854] dark:text-[#D4C7E1]"
                        >
                          <option value={5}>5 Stars (Flawless Excellence)</option>
                          <option value={4}>4 Stars (Very Good)</option>
                          <option value={3}>3 Stars (Satisfactory)</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#501854] dark:text-[#D4C7E1] mb-1.5 font-medium">Your Impression</label>
                      <textarea
                        required
                        rows={3}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Describe the punctuality, cleanliness, technique, and result..."
                        className="w-full px-4 py-2.5 text-xs bg-white dark:bg-[#3E343C] border border-[#E7C1DC] dark:border-[#3B3237] rounded-xl text-[#501854] dark:text-[#D4C7E1]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-[#501854] dark:bg-[#DB2777] text-white px-6 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold hover:opacity-90 transition-all"
                    >
                      Publish Review
                    </button>
                  </form>
                )}

                <div className="space-y-4">
                  {artisan.reviews.map((rev) => (
                    <div key={rev.id} className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#241C2B] border border-[#EFBDEB] dark:border-[#3B3237] shadow-2xs">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-sm text-[#501854] dark:text-[#D4C7E1]">{rev.name}</span>
                        <div className="flex items-center gap-1">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} size={12} className="text-[#DB2777] fill-[#DB2777]" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-[#7E4882] dark:text-[#A695B8] font-light leading-relaxed mb-2">{rev.comment}</p>
                      <span className="text-[10px] text-[#8C3B8A] dark:text-[#A695B8] block">{rev.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sticky Reservation Console (4 cols) */}
            <div className="lg:col-span-4">
              <div className="sticky top-28 glass-panel p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#EFBDEB] dark:border-[#3B3237] shadow-xl bg-white/95 dark:bg-[#241C2B]/95">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF2FA] dark:bg-[#372E3E] text-[#501854] dark:text-[#D4C7E1] text-[10px] uppercase tracking-wider font-semibold mb-4 border border-[#EFBDEB] dark:border-[#3B3237]">
                  <ShieldCheck size={13} className="text-[#DB2777]" />
                  <span>Guaranteed Atelier Booking</span>
                </div>

                <h3 className="text-2xl font-serif text-[#501854] dark:text-[#D4C7E1] mb-1">Reserve Session</h3>
                <p className="text-xs text-[#7E4882] dark:text-[#A695B8] font-light mb-6">
                  Select your preferred appointment date and time for private service.
                </p>

                <form onSubmit={handleBooking} className="space-y-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#501854] dark:text-[#D4C7E1] mb-1.5 font-medium">
                      Selected Service
                    </label>
                    <div className="p-3 bg-[#FAF2FA] dark:bg-[#372E3E] rounded-2xl border border-[#EFBDEB] dark:border-[#3B3237] text-xs flex justify-between items-center">
                      <span className="font-medium text-[#501854] dark:text-[#D4C7E1]">{selectedService.name}</span>
                      <span className="font-serif font-semibold text-[#DB2777]">{selectedService.price}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#501854] dark:text-[#D4C7E1] mb-1.5 font-medium">
                      Appointment Date
                    </label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split("T")[0]}
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs bg-white dark:bg-[#3E343C] border border-[#E7C1DC] dark:border-[#3B3237] rounded-2xl text-[#501854] dark:text-[#D4C7E1]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#501854] dark:text-[#D4C7E1] mb-1.5 font-medium">
                      Available Time Slot
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {times.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => {
                            triggerHaptic(8);
                            setBookingTime(t);
                          }}
                          className={`py-2 rounded-xl text-xs font-medium transition-all ${
                            bookingTime === t
                              ? "bg-[#501854] dark:bg-[#DB2777] text-white shadow-2xs"
                              : "bg-[#FAF2FA] dark:bg-[#372E3E] border border-[#EFBDEB] dark:border-[#3B3237] text-[#501854] dark:text-[#D4C7E1] hover:border-[#DB2777]"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#EFBDEB] dark:border-[#3B3237] space-y-3">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#501854] dark:text-[#D4C7E1] mb-1 font-medium">
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Naledi Molefe"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full px-4 py-2.5 text-xs bg-white dark:bg-[#3E343C] border border-[#E7C1DC] dark:border-[#3B3237] rounded-2xl text-[#501854] dark:text-[#D4C7E1]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#501854] dark:text-[#D4C7E1] mb-1 font-medium">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="client@domain.com"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        className="w-full px-4 py-2.5 text-xs bg-white dark:bg-[#3E343C] border border-[#E7C1DC] dark:border-[#3B3237] rounded-2xl text-[#501854] dark:text-[#D4C7E1]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#501854] dark:text-[#D4C7E1] mb-1 font-medium">
                        Mobile Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+27 82 000 0000"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="w-full px-4 py-2.5 text-xs bg-white dark:bg-[#3E343C] border border-[#E7C1DC] dark:border-[#3B3237] rounded-2xl text-[#501854] dark:text-[#D4C7E1]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingBooking}
                    className="w-full mt-2 bg-[#501854] dark:bg-[#DB2777] text-white py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold hover:opacity-90 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <span>{isSubmittingBooking ? "Confirming..." : "Reserve Appointment"}</span>
                    <ArrowRight size={14} />
                  </button>

                  <p className="text-[10px] text-center text-[#7E4882] dark:text-[#A695B8] font-light mt-2">
                    Zero upfront studio booking deposit required today.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ScrollToTop />
      <Footer />
    </div>
  );
};

export default Profile;
