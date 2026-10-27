import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Receipt as ReceiptIcon,
  CreditCard,
  Lock,
  Unlock,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/services/authStore";
import {
  getCustomerBookings,
  subscribeToEngineChanges,
  cancelBookingByCustomer,
  getAllReceipts,
} from "@/services/bookingEngine";
import { Booking, Receipt, formatZAR, CUSTOMER_CANCEL_REFUND_WINDOW_HOURS } from "@/services/dataTypes";
import { triggerHaptic } from "@/services/haptics";
import { PaystackCheckoutModal } from "@/components/booking/PaystackCheckoutModal";
import { ReceiptModal } from "@/components/receipts/ReceiptModal";
import { toast } from "sonner";

export const CustomerBookings = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get("highlight");

  const [activeTab, setActiveTab] = useState<"upcoming" | "completed" | "cancelled">("upcoming");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);

  // Modals state
  const [payingBooking, setPayingBooking] = useState<Booking | null>(null);
  const [activeReceipt, setActiveReceipt] = useState<Receipt | null>(null);
  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(null);
  const [cancellationReason, setCancellationReason] = useState("");

  const refreshData = () => {
    if (user) {
      setBookings(getCustomerBookings(user.id));
      setReceipts(getAllReceipts());
    }
  };

  useEffect(() => {
    refreshData();
    const unsubscribe = subscribeToEngineChanges(refreshData);
    return unsubscribe;
  }, [user]);

  // If URL has highlight, auto-switch to corresponding tab
  useEffect(() => {
    if (!highlightId || bookings.length === 0) return;
    const target = bookings.find((b) => b.id === highlightId);
    if (target) {
      if (target.status === "confirmed" || target.status === "awaiting_deposit") {
        setActiveTab("upcoming");
      } else if (target.status === "completed" || target.status === "paid_in_full") {
        setActiveTab("completed");
      } else {
        setActiveTab("cancelled");
      }
    }
  }, [highlightId, bookings]);

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === "upcoming") {
      return b.status === "confirmed" || b.status === "awaiting_deposit";
    }
    if (activeTab === "completed") {
      return b.status === "completed" || b.status === "paid_in_full";
    }
    return (
      b.status === "cancelled_by_artisan" ||
      b.status === "cancelled_by_customer" ||
      b.status === "refunded" ||
      b.status === "refund_pending" ||
      b.status === "expired"
    );
  });

  const handleOpenReceiptForBooking = (bookingId: string) => {
    triggerHaptic(8);
    const receipt = receipts.find((r) => r.bookingId === bookingId) || null;
    if (receipt) {
      setActiveReceipt(receipt);
    } else {
      toast.info("Receipt will be generated upon verified gateway confirmation.");
    }
  };

  const handleConfirmCancellation = () => {
    if (!cancellingBooking || !user) return;
    triggerHaptic(15);

    try {
      const result = cancelBookingByCustomer(cancellingBooking.id, user.id, cancellationReason);
      if (result.refundEligible) {
        toast.success(
          `Reservation cancelled. 100% refund of ${formatZAR(
            result.refundAmountCents
          )} processed per our 48h guarantee.`
        );
      } else {
        toast.info(
          "Reservation cancelled. As per policy, deposit was forfeited because cancellation occurred within 48h of start time."
        );
      }
      setCancellingBooking(null);
      setCancellationReason("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to cancel booking";
      toast.error(msg);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF2FA] dark:bg-[#372E3E] border border-[#EFBDEB] dark:border-[#3B3237] shadow-2xs mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#DB2777]" />
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#501854] dark:text-[#D4C7E1] font-semibold">
              Client Sanctuary
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#501854] dark:text-[#D4C7E1]">
            My <span className="italic font-normal text-[#DB2777]">Appointments</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#7E4882] dark:text-[#A695B8] font-light mt-1">
            Welcome back, <span className="font-semibold text-[#501854] dark:text-[#D4C7E1]">{user?.name}</span>. Manage your beauty reservations, deposits, and balances.
          </p>
        </div>

        <Link
          to="/search"
          onClick={() => triggerHaptic(8)}
          className="bg-[#501854] dark:bg-[#DB2777] text-white px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2 w-fit cursor-pointer"
        >
          <span>Book New Treatment</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 sm:mb-8 bg-[#FAF2FA] dark:bg-[#372E3E] p-1 rounded-full w-fit border border-[#EFBDEB] dark:border-[#3B3237]">
        {(["upcoming", "completed", "cancelled"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              triggerHaptic(8);
              setActiveTab(tab);
            }}
            className={`px-4 sm:px-6 py-2 rounded-full text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
              activeTab === tab
                ? "bg-[#501854] dark:bg-[#DB2777] text-white shadow-xs"
                : "text-[#7E4882] dark:text-[#A695B8] hover:text-[#501854] dark:hover:text-[#D4C7E1]"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Booking Cards Grid */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-16 px-4 glass-panel rounded-3xl border border-[#EFBDEB] dark:border-[#3B3237]">
          <Calendar className="w-10 h-10 text-[#8C3B8A] dark:text-[#A695B8] mx-auto mb-3 opacity-60" />
          <h3 className="font-serif text-lg text-[#501854] dark:text-[#D4C7E1] mb-1">
            No {activeTab} bookings found
          </h3>
          <p className="text-xs text-[#7E4882] dark:text-[#A695B8] font-light max-w-sm mx-auto mb-5">
            Discover verified master stylists across South Africa and reserve your next atelier session.
          </p>
          <Link
            to="/search"
            className="inline-flex items-center gap-2 bg-[#501854] dark:bg-[#DB2777] text-white px-6 py-2.5 rounded-full text-xs uppercase tracking-wider font-semibold"
          >
            <span>Explore Master Artisans</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {filteredBookings.map((b) => {
            const isHighlighted = b.id === highlightId;
            const isCompleted = b.status === "completed";
            const isPaidInFull = b.status === "paid_in_full";
            const isConfirmed = b.status === "confirmed";
            const isAwaitingDeposit = b.status === "awaiting_deposit";
            const isRefunded = b.status === "refunded";

            return (
              <div
                key={b.id}
                className={`p-5 sm:p-7 rounded-3xl bg-white dark:bg-[#241C2B] border transition-all shadow-sm flex flex-col justify-between space-y-5 ${
                  isHighlighted
                    ? "border-[#DB2777] ring-2 ring-[#DB2777]/30"
                    : "border-[#EFBDEB] dark:border-[#3B3237]"
                }`}
              >
                <div>
                  {/* Card Header Status */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#EFBDEB]/60 dark:border-[#3B3237] mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono tracking-wider font-bold text-[#DB2777]">
                        {b.referenceCode}
                      </span>

                      {/* Status Badges */}
                      {isConfirmed && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                          <CheckCircle2 size={10} />
                          Confirmed
                        </span>
                      )}

                      {isAwaitingDeposit && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                          <Lock size={10} />
                          Awaiting Deposit Hold
                        </span>
                      )}

                      {isCompleted && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-pink-50 text-[#DB2777] dark:bg-pink-950/40 dark:text-pink-300 border border-pink-200 dark:border-pink-800 flex items-center gap-1 animate-pulse">
                          <Unlock size={10} />
                          Service Complete (Balance Unlocked)
                        </span>
                      )}

                      {isPaidInFull && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center gap-1">
                          <CheckCircle2 size={10} />
                          Paid in Full
                        </span>
                      )}

                      {isRefunded && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                          <RotateCcw size={10} />
                          100% Refunded
                        </span>
                      )}

                      {b.status === "cancelled_by_customer" && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-300">
                          Cancelled
                        </span>
                      )}
                    </div>

                    <span className="text-xs font-serif italic text-[#7E4882] dark:text-[#A695B8]">
                      {b.artisanBusinessName || `${b.artisanName} Atelier`}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg sm:text-xl text-[#501854] dark:text-[#D4C7E1] mb-1 font-semibold">
                    {b.serviceTitle}
                  </h3>
                  <p className="text-xs font-semibold text-[#DB2777] mb-3">
                    Master Artisan: {b.artisanName}
                  </p>

                  <div className="space-y-1.5 text-xs text-[#7E4882] dark:text-[#A695B8]">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-[#DB2777]" />
                      <span>
                        {b.appointmentDate} at {b.appointmentTime} ({b.endEstimatedTime})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-[#DB2777]" />
                      <span className="truncate">{b.locationAddress}</span>
                    </div>
                  </div>

                  {/* Financial Breakdown */}
                  <div className="mt-4 p-3.5 rounded-2xl bg-[#FAF2FA] dark:bg-[#372E3E]/60 border border-[#EFBDEB]/70 dark:border-[#3B3237] space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#7E4882] dark:text-[#A695B8]">Total Service Fee:</span>
                      <span className="font-semibold text-[#501854] dark:text-[#D4C7E1]">
                        {formatZAR(b.totalAmountCents)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7E4882] dark:text-[#A695B8] flex items-center gap-1">
                        <ShieldCheck size={12} className="text-emerald-500" />
                        Deposit Paid (50%):
                      </span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {isAwaitingDeposit ? "Pending Payment" : formatZAR(b.depositAmountCents)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-[#EFBDEB]/50 dark:border-[#3B3237]">
                      <span className="text-[#7E4882] dark:text-[#A695B8]">Remaining Balance:</span>
                      <span className={`font-bold ${isPaidInFull ? "line-through text-gray-400" : "text-[#501854] dark:text-[#D4C7E1]"}`}>
                        {isPaidInFull ? "R 0.00 (Settled)" : formatZAR(b.balanceAmountCents)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                  {/* Balance Payment Button */}
                  {isCompleted && (
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic(12);
                        setPayingBooking(b);
                      }}
                      className="w-full py-3.5 rounded-full text-xs uppercase tracking-wider font-semibold bg-[#DB2777] text-white hover:opacity-90 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer animate-bounce-subtle"
                    >
                      <CreditCard size={15} />
                      <span>Pay Remaining Balance ({formatZAR(b.balanceAmountCents)})</span>
                    </button>
                  )}

                  {/* Grayed Out Balance Button when locked */}
                  {isConfirmed && (
                    <div>
                      <button
                        type="button"
                        disabled
                        className="w-full py-3 rounded-full text-xs uppercase tracking-wider font-semibold bg-gray-100 dark:bg-[#372E3E] text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700 cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <Lock size={13} />
                        <span>Pay remaining {formatZAR(b.balanceAmountCents)}</span>
                      </button>
                      <p className="text-[10px] text-center text-[#7E4882] dark:text-[#A695B8] font-light mt-1">
                        Unlocks when your artisan marks the service complete
                      </p>
                    </div>
                  )}

                  {/* Awaiting Deposit Button */}
                  {isAwaitingDeposit && (
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic(12);
                        setPayingBooking(b);
                      }}
                      className="w-full py-3 rounded-full text-xs uppercase tracking-wider font-semibold bg-[#501854] dark:bg-[#DB2777] text-white hover:opacity-90 active:scale-95 shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Lock size={13} />
                      <span>Complete 50% Deposit ({formatZAR(b.depositAmountCents)})</span>
                    </button>
                  )}

                  {/* Secondary Actions (Receipt & Cancel) */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleOpenReceiptForBooking(b.id)}
                      className="inline-flex items-center gap-1.5 text-xs text-[#501854] dark:text-[#D4C7E1] hover:text-[#DB2777] font-medium py-1 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-[#34273E] transition-colors cursor-pointer"
                    >
                      <ReceiptIcon size={14} className="text-[#DB2777]" />
                      <span>View Receipt</span>
                    </button>

                    {isConfirmed && (
                      <button
                        type="button"
                        onClick={() => {
                          triggerHaptic(8);
                          setCancellingBooking(b);
                        }}
                        className="text-xs text-rose-600 dark:text-rose-400 hover:underline py-1 px-2 cursor-pointer font-medium"
                      >
                        Cancel Reservation
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pay Remaining Balance / Deposit Modal */}
      {payingBooking && (
        <PaystackCheckoutModal
          isOpen={!!payingBooking}
          onClose={() => setPayingBooking(null)}
          booking={payingBooking}
          paymentType={payingBooking.status === "awaiting_deposit" ? "deposit" : "balance"}
          onSuccess={() => {
            setPayingBooking(null);
            refreshData();
          }}
        />
      )}

      {/* Official Tax Invoice / Receipt Modal */}
      <ReceiptModal
        receipt={activeReceipt}
        isOpen={!!activeReceipt}
        onClose={() => setActiveReceipt(null)}
      />

      {/* Cancellation Confirmation Modal */}
      {cancellingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#1E1724] rounded-3xl p-6 max-w-md w-full border border-[#EFBDEB] dark:border-[#3B3237] shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertTriangle size={20} />
              <h3 className="font-serif text-lg font-bold text-[#501854] dark:text-[#D4C7E1]">
                Cancel Atelier Reservation
              </h3>
            </div>

            <p className="text-xs text-[#7E4882] dark:text-[#A695B8]">
              Are you sure you wish to cancel your appointment with{" "}
              <strong className="text-[#501854] dark:text-[#D4C7E1]">
                {cancellingBooking.artisanName}
              </strong>{" "}
              on {cancellingBooking.appointmentDate} at {cancellingBooking.appointmentTime}?
            </p>

            {/* 48h Policy Check Notice */}
            {(() => {
              const startTimestamp = new Date(
                `${cancellingBooking.appointmentDate}T${cancellingBooking.appointmentTime}:00`
              ).getTime();
              const hoursUntil = (startTimestamp - Date.now()) / (1000 * 60 * 60);
              const isEligible = hoursUntil >= CUSTOMER_CANCEL_REFUND_WINDOW_HOURS;

              return (
                <div
                  className={`p-3.5 rounded-2xl text-xs ${
                    isEligible
                      ? "bg-emerald-50 text-emerald-900 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-800"
                      : "bg-amber-50 text-amber-900 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-800"
                  }`}
                >
                  <p className="font-semibold mb-0.5">
                    {isEligible
                      ? "✓ Eligible for 100% Refund"
                      : "⚠ Deposit Forfeiture Notice"}
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    {isEligible
                      ? `Your appointment is more than 48 hours away (${Math.round(
                          hoursUntil
                        )}h). You will receive an immediate 100% refund of ${formatZAR(
                          cancellingBooking.depositAmountCents
                        )}.`
                      : `Your appointment is in ${Math.round(
                          hoursUntil
                        )} hours (within the 48-hour policy window). As stated in our terms, your 50% deposit (${formatZAR(
                          cancellingBooking.depositAmountCents
                        )}) will be forfeited to compensate the artisan.`}
                  </p>
                </div>
              );
            })()}

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">
                Reason for Cancellation (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Schedule change, travel conflict..."
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-gray-50 dark:bg-[#2A2031] border border-gray-200 dark:border-gray-700 rounded-xl text-[#501854] dark:text-[#D4C7E1]"
              />
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setCancellingBooking(null)}
                className="w-1/2 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 cursor-pointer"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleConfirmCancellation}
                className="w-1/2 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
