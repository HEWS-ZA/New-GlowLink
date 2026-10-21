import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import {
  MapPin,
  Star,
  Calendar,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  Check,
  Sparkles,
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
  const navigate = useNavigate();
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
    <div className="bg-[#FAF8F5] text-neutral-900 min-h-screen selection:bg-neutral-900 selection:text-white">
      <Header />

      <section className="pt-36 pb-16 px-6 md:px-12 border-b border-neutral-200/70">
        <div className="max-w-7xl mx-auto">
          {/* Profile Banner */}
          <div className="p-8 md:p-12 rounded-3xl border border-neutral-200/80 bg-white shadow-xs backdrop-blur-md mb-12">
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
              <div className="relative shrink-0">
                <img
                  src={artisan.image}
                  alt={artisan.name}
                  className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover border-4 border-[#FAF8F5] shadow-lg"
                />
                <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white shadow-xs"></span>
              </div>
              
              <div className="flex-grow">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="text-[10px] uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-neutral-100 text-neutral-900 font-semibold border border-neutral-200">
                    {artisan.tag}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-medium">
                    {artisan.experience}
                  </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-serif text-neutral-950 font-medium mb-1">
                  {artisan.name}
                </h1>
                <p className="text-neutral-600 text-sm md:text-base font-light mb-4">
                  {artisan.specialty}
                </p>

                <div className="flex flex-wrap items-center gap-6 text-xs text-neutral-500 mb-5">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-neutral-400" />
                    <span>{artisan.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-900 font-medium">
                    <Star size={14} className="text-amber-500 fill-amber-500" />
                    <span>{artisan.rating}</span>
                    <span className="text-neutral-500 font-normal">({artisan.reviewsCount} verified reviews)</span>
                  </div>
                </div>

                <p className="text-sm font-light text-neutral-700 max-w-3xl leading-relaxed mb-6">
                  {artisan.bio}
                </p>

                <div className="flex gap-3 text-neutral-600">
                  {artisan.socials.instagram && (
                    <a
                      href={`https://instagram.com/${artisan.socials.instagram.replace("@", "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-neutral-950 transition-colors p-2 rounded-full bg-neutral-50 border border-neutral-200/80"
                      aria-label="Instagram"
                    >
                      <Instagram size={16} />
                    </a>
                  )}
                  {artisan.socials.facebook && (
                    <a
                      href="#"
                      className="hover:text-neutral-950 transition-colors p-2 rounded-full bg-neutral-50 border border-neutral-200/80"
                      aria-label="Facebook"
                    >
                      <Facebook size={16} />
                    </a>
                  )}
                  {artisan.socials.twitter && (
                    <a
                      href="#"
                      className="hover:text-neutral-950 transition-colors p-2 rounded-full bg-neutral-50 border border-neutral-200/80"
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
                <span className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-2 block font-semibold">
                  Curated Menu
                </span>
                <h2 className="text-2xl md:text-3xl font-serif text-neutral-950 mb-6">
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
                      className={`p-6 rounded-3xl border cursor-pointer transition-all duration-300 shadow-2xs ${
                        selectedServiceId === service.id
                          ? "bg-white border-neutral-900 shadow-md ring-1 ring-neutral-900"
                          : "bg-white/70 border-neutral-200 hover:border-neutral-400"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-serif text-lg text-neutral-900 font-medium">
                            {service.name}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-neutral-500 mt-0.5">
                            <Clock size={12} className="text-neutral-400" />
                            <span>{service.duration}</span>
                          </div>
                        </div>
                        <span className="font-serif text-lg font-medium text-neutral-950">
                          {service.price}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600 font-light leading-relaxed">
                        {service.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Portfolio Grid */}
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-2 block font-semibold">
                  Visual Mastery
                </span>
                <h2 className="text-2xl md:text-3xl font-serif text-neutral-950 mb-6">
                  Atelier Portfolio
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {artisan.portfolio.map((img, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl overflow-hidden aspect-square bg-neutral-100 border border-white shadow-2xs group"
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
                    <span className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-1 block font-semibold">
                      Client Voices
                    </span>
                    <h2 className="text-2xl md:text-3xl font-serif text-neutral-950">
                      Impressions & Reviews
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      triggerHaptic(10);
                      setShowReviewForm(!showReviewForm);
                    }}
                    className="border border-neutral-300 hover:border-neutral-900 bg-white px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold text-neutral-800 transition-all shadow-2xs"
                  >
                    {showReviewForm ? "Close Form" : "Leave Review"}
                  </button>
                </div>

                {/* Review Submission Form */}
                {showReviewForm && (
                  <form onSubmit={handleReviewSubmit} className="glass-panel p-6 rounded-3xl border border-neutral-200 mb-8 space-y-4">
                    <h3 className="font-serif text-base text-neutral-900">Share your experience with {artisan.name}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1.5 font-medium">Your Name</label>
                        <input
                          type="text"
                          required
                          value={reviewName}
                          onChange={(e) => setReviewName(e.target.value)}
                          placeholder="e.g. Kagiso S."
                          className="w-full px-4 py-2.5 text-xs bg-white border border-neutral-300 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1.5 font-medium">Rating Score</label>
                        <select
                          value={reviewRating}
                          onChange={(e) => setReviewRating(Number(e.target.value))}
                          className="w-full px-4 py-2.5 text-xs bg-white border border-neutral-300 rounded-xl"
                        >
                          <option value={5}>5 Stars (Flawless Excellence)</option>
                          <option value={4}>4 Stars (Very Good)</option>
                          <option value={3}>3 Stars (Satisfactory)</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1.5 font-medium">Your Impression</label>
                      <textarea
                        required
                        rows={3}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Describe the punctuality, cleanliness, technique, and result..."
                        className="w-full px-4 py-2.5 text-xs bg-white border border-neutral-300 rounded-xl"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-neutral-950 text-white px-6 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800 transition-all"
                    >
                      Publish Review
                    </button>
                  </form>
                )}

                <div className="space-y-4">
                  {artisan.reviews.map((rev) => (
                    <div key={rev.id} className="p-6 rounded-3xl bg-white border border-neutral-200/70 shadow-2xs">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-sm text-neutral-900">{rev.name}</span>
                        <div className="flex items-center gap-1">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} size={12} className="text-amber-500 fill-amber-500" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-neutral-600 font-light leading-relaxed mb-2">{rev.comment}</p>
                      <span className="text-[10px] text-neutral-400 block">{rev.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sticky Reservation Console (4 cols) */}
            <div className="lg:col-span-4">
              <div className="sticky top-28 glass-panel p-6 md:p-8 rounded-3xl border border-white/90 shadow-xl bg-white/90">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-[10px] uppercase tracking-wider font-semibold mb-4">
                  <ShieldCheck size={13} className="text-emerald-600" />
                  <span>Guaranteed Atelier Booking</span>
                </div>

                <h3 className="text-2xl font-serif text-neutral-950 mb-1">Reserve Session</h3>
                <p className="text-xs text-neutral-500 font-light mb-6">
                  Select your preferred appointment date and time for private service.
                </p>

                <form onSubmit={handleBooking} className="space-y-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-1.5 font-medium">
                      Selected Service
                    </label>
                    <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs flex justify-between items-center">
                      <span className="font-medium text-neutral-900">{selectedService.name}</span>
                      <span className="font-serif font-semibold text-neutral-950">{selectedService.price}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-1.5 font-medium">
                      Appointment Date
                    </label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split("T")[0]}
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs bg-neutral-50 border border-neutral-300 rounded-2xl"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-1.5 font-medium">
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
                              ? "bg-neutral-950 text-white shadow-2xs"
                              : "bg-white border border-neutral-200 text-neutral-700 hover:border-neutral-400"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-neutral-200 space-y-3">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-1 font-medium">
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Naledi Molefe"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full px-4 py-2.5 text-xs bg-neutral-50 border border-neutral-300 rounded-2xl"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-1 font-medium">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="client@domain.com"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        className="w-full px-4 py-2.5 text-xs bg-neutral-50 border border-neutral-300 rounded-2xl"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-neutral-600 mb-1 font-medium">
                        Mobile Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+27 82 000 0000"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="w-full px-4 py-2.5 text-xs bg-neutral-50 border border-neutral-300 rounded-2xl"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingBooking}
                    className="w-full mt-2 bg-neutral-950 text-white py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <span>{isSubmittingBooking ? "Confirming..." : "Reserve Appointment"}</span>
                    <ArrowRight size={14} />
                  </button>

                  <p className="text-[10px] text-center text-neutral-500 font-light mt-2">
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
