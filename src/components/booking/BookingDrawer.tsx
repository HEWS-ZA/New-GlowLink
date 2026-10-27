import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Home,
  Store,
  X,
  Lock,
} from "lucide-react";
import { Artisan, ArtisanServiceItem } from "@/services/artisanStore";
import { useAuth } from "@/services/authStore";
import {
  checkSlotAvailability,
  createSlotHold,
} from "@/services/bookingEngine";
import { Booking, DEPOSIT_PERCENT, formatZAR } from "@/services/dataTypes";
import { triggerHaptic } from "@/services/haptics";
import { PaystackCheckoutModal } from "./PaystackCheckoutModal";
import { toast } from "sonner";

interface BookingDrawerProps {
  artisan: Artisan;
  initialServiceId?: number;
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess: (booking: Booking) => void;
}

// Convert "R2,000" or "R850" to integer cents
function parsePriceToCents(priceStr: string): number {
  const digits = priceStr.replace(/[^\d]/g, "");
  const rands = parseInt(digits, 10) || 0;
  return rands * 100;
}

export const BookingDrawer = ({
  artisan,
  initialServiceId,
  isOpen,
  onClose,
  onBookingSuccess,
}: BookingDrawerProps) => {
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const isCustomer = role === "customer";
  const isArtisan = role === "artisan";

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedService, setSelectedService] = useState<ArtisanServiceItem>(
    artisan.services.find((s) => s.id === initialServiceId) || artisan.services[0]
  );
  const [bookingDate, setBookingDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2); // Default to 2 days ahead
    return d.toISOString().split("T")[0];
  });
  const [bookingTime, setBookingTime] = useState("14:00");
  const [serviceType, setServiceType] = useState<"studio" | "mobile">("studio");
  const [mobileAddress, setMobileAddress] = useState("");
  const [notes, setNotes] = useState("");

  // Paystack checkout modal state
  const [activeHoldBooking, setActiveHoldBooking] = useState<Booking | null>(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  // Restore draft if user just signed in
  useEffect(() => {
    if (typeof window === "undefined") return;
    const draft = sessionStorage.getItem("glowlink_pending_booking");
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        if (parsed.artisanId === artisan.id) {
          const srv = artisan.services.find((s) => s.id === parsed.serviceId);
          if (srv) setSelectedService(srv);
          if (parsed.date) setBookingDate(parsed.date);
          if (parsed.time) setBookingTime(parsed.time);
          if (parsed.serviceType) setServiceType(parsed.serviceType);
          if (parsed.mobileAddress) setMobileAddress(parsed.mobileAddress);
          if (parsed.notes) setNotes(parsed.notes);
          setStep(4); // Advance to summary step!
        }
        sessionStorage.removeItem("glowlink_pending_booking");
      } catch (e) {
        console.error("Failed to parse draft booking:", e);
      }
    }
  }, [artisan.id, artisan.services]);

  if (!isOpen) return null;

  const totalCents = parsePriceToCents(selectedService.price);
  const depositCents = Math.round(totalCents * (DEPOSIT_PERCENT / 100));
  const balanceCents = totalCents - depositCents;

  const timeSlots = ["09:00", "11:00", "14:00", "16:00", "18:00"];

  const handleProceedToDeposit = () => {
    triggerHaptic(12);

    // Guard: Check if visitor is signed in as customer
    if (!user || !isCustomer) {
      // Save pending draft so they don't lose their choice
      sessionStorage.setItem(
        "glowlink_pending_booking",
        JSON.stringify({
          artisanId: artisan.id,
          serviceId: selectedService.id,
          date: bookingDate,
          time: bookingTime,
          serviceType,
          mobileAddress,
          notes,
        })
      );

      if (isArtisan) {
        toast.info("Please switch to a Client account to book atelier services.");
      } else {
        toast.info("Please sign in to confirm your booking and pay the deposit.");
      }

      navigate(`/customer/login?redirect=/profile/${artisan.id}`);
      return;
    }

    try {
      const address =
        serviceType === "studio"
          ? `${artisan.location} (${artisan.name} Atelier)`
          : mobileAddress.trim() || "Client Private Residence";

      // Create atomic 15-minute slot hold
      const hold = createSlotHold({
        customerId: user.id,
        customerName: user.name,
        customerEmail: user.email,
        customerPhone: user.phone || "+27 82 890 1234",
        artisanId: artisan.id,
        artisanName: artisan.name,
        artisanBusinessName: `${artisan.name} Atelier`,
        serviceId: `srv_${selectedService.id}`,
        serviceTitle: selectedService.name,
        serviceCategory: artisan.category,
        totalAmountCents: totalCents,
        appointmentDate: bookingDate,
        appointmentTime: bookingTime,
        endEstimatedTime: selectedService.duration,
        serviceType,
        locationAddress: address,
        notes,
      });

      setActiveHoldBooking(hold);
      setShowCheckoutModal(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unable to reserve slot.";
      toast.error(msg);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="relative w-full max-w-2xl bg-white dark:bg-[#1E1724] rounded-3xl shadow-2xl border border-[#EFBDEB] dark:border-[#3B3237] overflow-hidden flex flex-col max-h-[92vh]">
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#EFBDEB]/60 dark:border-[#3B3237] flex items-center justify-between bg-[#FAF2FA]/50 dark:bg-[#251D2C]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#DB2777]" />
              <span className="font-serif text-base font-semibold text-[#501854] dark:text-[#D4C7E1]">
                Book Atelier Service • {artisan.name}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-[#501854] dark:hover:text-[#D4C7E1] rounded-full hover:bg-white dark:hover:bg-[#34273E] transition-all"
            >
              <X size={18} />
            </button>
          </div>

          {/* Stepper Progress */}
          <div className="px-6 py-3 border-b border-[#EFBDEB]/30 dark:border-[#3B3237] bg-white dark:bg-[#1E1724] flex items-center justify-between text-xs font-semibold">
            {[
              { stepNum: 1, label: "Service" },
              { stepNum: 2, label: "Date & Slot" },
              { stepNum: 3, label: "Location" },
              { stepNum: 4, label: "Summary & Pay" },
            ].map((s) => (
              <button
                key={s.stepNum}
                onClick={() => {
                  if (s.stepNum < step) {
                    triggerHaptic(6);
                    setStep(s.stepNum as any);
                  }
                }}
                className={`flex items-center gap-1.5 transition-colors ${
                  step === s.stepNum
                    ? "text-[#DB2777] font-bold"
                    : step > s.stepNum
                    ? "text-[#501854] dark:text-[#D4C7E1] cursor-pointer"
                    : "text-gray-400 cursor-not-allowed"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                    step === s.stepNum
                      ? "bg-[#DB2777] text-white"
                      : step > s.stepNum
                      ? "bg-[#501854] text-white dark:bg-[#D4C7E1] dark:text-[#1E1724]"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                  }`}
                >
                  {s.stepNum}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            ))}
          </div>

          {/* Content Body */}
          <div className="p-6 overflow-y-auto space-y-6">
            {/* Step 1: Select Service */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-serif text-lg text-[#501854] dark:text-[#D4C7E1]">
                    Select Your Atelier Treatment
                  </h3>
                  <p className="text-xs text-[#7E4882] dark:text-[#A695B8] mt-0.5">
                    All appointments require a 50% deposit to secure your artisan's dedicated time slot.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {artisan.services.map((srv) => {
                    const srvCents = parsePriceToCents(srv.price);
                    const depCents = Math.round(srvCents * 0.5);
                    const isSelected = selectedService.id === srv.id;

                    return (
                      <div
                        key={srv.id}
                        onClick={() => {
                          triggerHaptic(8);
                          setSelectedService(srv);
                        }}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? "border-[#DB2777] bg-[#FAF2FA] dark:bg-[#2F2436] shadow-xs"
                            : "border-[#EFBDEB]/60 dark:border-[#3B3237] hover:border-[#DB2777]/50 bg-white dark:bg-[#241C2B]"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1.5">
                          <h4 className="font-semibold text-sm text-[#501854] dark:text-[#D4C7E1]">
                            {srv.name}
                          </h4>
                          <div className="text-right">
                            <span className="font-serif font-bold text-base text-[#501854] dark:text-[#D4C7E1]">
                              {formatZAR(srvCents)}
                            </span>
                            <span className="block text-[10px] text-[#DB2777] font-semibold">
                              Deposit: {formatZAR(depCents)}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-[#7E4882] dark:text-[#A695B8] line-clamp-2 mb-2">
                          {srv.desc}
                        </p>
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
                          <Clock size={12} className="text-[#DB2777]" />
                          <span>{srv.duration}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic(8);
                    setStep(2);
                  }}
                  className="w-full bg-[#501854] dark:bg-[#DB2777] text-white py-3.5 rounded-full text-xs uppercase tracking-wider font-semibold hover:opacity-90 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Continue to Date & Slot</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            )}

            {/* Step 2: Date & Slot Selection */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-serif text-lg text-[#501854] dark:text-[#D4C7E1]">
                    Choose Date & Available Slot
                  </h3>
                  <p className="text-xs text-[#7E4882] dark:text-[#A695B8] mt-0.5">
                    Slots are verified in real time against master artisan bookings.
                  </p>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#501854] dark:text-[#D4C7E1] mb-1.5 font-semibold">
                    Appointment Date
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-[#2C2134] border border-[#EFBDEB] dark:border-[#3B3237] rounded-2xl text-xs text-[#501854] dark:text-[#D4C7E1] font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#501854] dark:text-[#D4C7E1] mb-2 font-semibold">
                    Available Time Slots (South African Standard Time)
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                    {timeSlots.map((slot) => {
                      const isAvailable = checkSlotAvailability(artisan.id, bookingDate, slot);
                      const isSelected = bookingTime === slot;

                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={!isAvailable}
                          onClick={() => {
                            triggerHaptic(8);
                            setBookingTime(slot);
                          }}
                          className={`py-3 px-2 rounded-2xl text-xs font-semibold text-center transition-all flex flex-col items-center justify-center gap-1 ${
                            isSelected && isAvailable
                              ? "bg-[#501854] dark:bg-[#DB2777] text-white shadow-md scale-102"
                              : isAvailable
                              ? "bg-[#FAF2FA] dark:bg-[#2A2031] text-[#501854] dark:text-[#D4C7E1] border border-[#EFBDEB]/60 dark:border-[#3B3237] hover:border-[#DB2777]"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 border border-gray-200 dark:border-gray-800 cursor-not-allowed opacity-60"
                          }`}
                        >
                          <span>{slot}</span>
                          <span className="text-[9px] uppercase tracking-tighter">
                            {isAvailable ? "Available" : "Reserved"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 border border-[#EFBDEB] dark:border-[#3B3237] py-3 rounded-full text-xs uppercase tracking-wider font-semibold text-[#501854] dark:text-[#D4C7E1]"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic(8);
                      setStep(3);
                    }}
                    className="w-2/3 bg-[#501854] dark:bg-[#DB2777] text-white py-3 rounded-full text-xs uppercase tracking-wider font-semibold hover:opacity-90 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Continue to Location</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Location Type & Address */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-serif text-lg text-[#501854] dark:text-[#D4C7E1]">
                    Appointment Setting
                  </h3>
                  <p className="text-xs text-[#7E4882] dark:text-[#A695B8] mt-0.5">
                    Experience private studio couture or request a VIP mobile house-call.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic(8);
                      setServiceType("studio");
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      serviceType === "studio"
                        ? "border-[#DB2777] bg-[#FAF2FA] dark:bg-[#2F2436] shadow-xs"
                        : "border-[#EFBDEB]/60 dark:border-[#3B3237] bg-white dark:bg-[#241C2B]"
                    }`}
                  >
                    <Store className="w-5 h-5 text-[#DB2777] mb-2" />
                    <p className="font-semibold text-xs text-[#501854] dark:text-[#D4C7E1]">
                      Artisan Studio Atelier
                    </p>
                    <p className="text-[11px] text-[#7E4882] dark:text-[#A695B8] mt-0.5">
                      {artisan.location}
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic(8);
                      setServiceType("mobile");
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      serviceType === "mobile"
                        ? "border-[#DB2777] bg-[#FAF2FA] dark:bg-[#2F2436] shadow-xs"
                        : "border-[#EFBDEB]/60 dark:border-[#3B3237] bg-white dark:bg-[#241C2B]"
                    }`}
                  >
                    <Home className="w-5 h-5 text-[#DB2777] mb-2" />
                    <p className="font-semibold text-xs text-[#501854] dark:text-[#D4C7E1]">
                      Luxury Mobile House Call
                    </p>
                    <p className="text-[11px] text-[#7E4882] dark:text-[#A695B8] mt-0.5">
                      At your residence, villa, or hotel
                    </p>
                  </button>
                </div>

                {serviceType === "mobile" && (
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#501854] dark:text-[#D4C7E1] mb-1.5 font-semibold">
                      Your House Call Address
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 42 Houghton Estate Drive, Johannesburg"
                      value={mobileAddress}
                      onChange={(e) => setMobileAddress(e.target.value)}
                      className="w-full px-4 py-3 bg-white dark:bg-[#2C2134] border border-[#EFBDEB] dark:border-[#3B3237] rounded-2xl text-xs text-[#501854] dark:text-[#D4C7E1]"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#501854] dark:text-[#D4C7E1] mb-1.5 font-semibold">
                    Special Preparation Notes or Skin Preferences (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Sensitive skin, bridal theme colors, camera lashes..."
                    className="w-full px-4 py-2.5 bg-white dark:bg-[#2C2134] border border-[#EFBDEB] dark:border-[#3B3237] rounded-2xl text-xs text-[#501854] dark:text-[#D4C7E1]"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-1/3 border border-[#EFBDEB] dark:border-[#3B3237] py-3 rounded-full text-xs uppercase tracking-wider font-semibold text-[#501854] dark:text-[#D4C7E1]"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic(8);
                      setStep(4);
                    }}
                    className="w-2/3 bg-[#501854] dark:bg-[#DB2777] text-white py-3 rounded-full text-xs uppercase tracking-wider font-semibold hover:opacity-90 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Review Summary & Pay</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Summary & Deposit Checkout */}
            {step === 4 && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-serif text-lg text-[#501854] dark:text-[#D4C7E1]">
                    Appointment & Payment Summary
                  </h3>
                  <p className="text-xs text-[#7E4882] dark:text-[#A695B8] mt-0.5">
                    Review your itinerary and secure your slot with a 50% Paystack deposit.
                  </p>
                </div>

                {/* Itinerary details */}
                <div className="p-4 rounded-2xl bg-[#FAF2FA] dark:bg-[#251D2C] border border-[#EFBDEB]/60 dark:border-[#3B3237] space-y-2 text-xs">
                  <div className="flex justify-between font-semibold text-sm text-[#501854] dark:text-[#D4C7E1]">
                    <span>{selectedService.name}</span>
                    <span className="font-serif">{formatZAR(totalCents)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#7E4882] dark:text-[#A695B8]">
                    <Calendar size={13} className="text-[#DB2777]" />
                    <span>{bookingDate} at {bookingTime} ({selectedService.duration})</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#7E4882] dark:text-[#A695B8]">
                    <MapPin size={13} className="text-[#DB2777]" />
                    <span>
                      {serviceType === "studio"
                        ? `${artisan.location} (${artisan.name} Atelier)`
                        : mobileAddress || "Client Mobile Residence"}
                    </span>
                  </div>
                </div>

                {/* Financial Breakdown Table */}
                <div className="p-4 rounded-2xl border border-[#EFBDEB] dark:border-[#3B3237] space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#7E4882] dark:text-[#A695B8]">Total Service Fee:</span>
                    <span className="font-semibold text-[#501854] dark:text-[#D4C7E1]">
                      {formatZAR(totalCents)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#DB2777] font-semibold">
                    <span>50% Deposit Due Now:</span>
                    <span>{formatZAR(depositCents)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-100 dark:border-gray-800 text-gray-500">
                    <span>Remaining Balance (Due Upon Completion):</span>
                    <span>{formatZAR(balanceCents)}</span>
                  </div>
                </div>

                {/* 48-Hour Cancellation Policy Card */}
                <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <ShieldCheck size={14} className="text-amber-600" />
                    <span>48-Hour Cancellation Guarantee</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
                    Full 100% refund if cancelled at least 48 hours prior to appointment. If cancelled within 48 hours, deposit is forfeited to compensate the artisan's locked schedule.
                  </p>
                </div>

                {/* Call to action */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="w-1/3 border border-[#EFBDEB] dark:border-[#3B3237] py-3.5 rounded-full text-xs uppercase tracking-wider font-semibold text-[#501854] dark:text-[#D4C7E1]"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleProceedToDeposit}
                    className="w-2/3 bg-[#501854] dark:bg-[#DB2777] text-white py-3.5 rounded-full text-xs uppercase tracking-wider font-semibold hover:opacity-90 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Lock size={14} />
                    <span>Pay Deposit ({formatZAR(depositCents)})</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Paystack Checkout Modal */}
      {showCheckoutModal && activeHoldBooking && (
        <PaystackCheckoutModal
          isOpen={showCheckoutModal}
          onClose={() => setShowCheckoutModal(false)}
          booking={activeHoldBooking}
          paymentType="deposit"
          onSuccess={(result) => {
            setShowCheckoutModal(false);
            onClose();
            if (result.booking) {
              onBookingSuccess(result.booking);
            }
            navigate("/customer/bookings");
          }}
        />
      )}
    </>
  );
};
