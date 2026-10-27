import { useState } from "react";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Lock,
  Unlock,
  Receipt as ReceiptIcon,
  HelpCircle,
  Copy,
  Send,
  Building,
  Home,
  FileText,
  DollarSign,
} from "lucide-react";
import { Booking, formatZAR, Receipt, Payment } from "@/services/dataTypes";
import {
  markServiceComplete,
  cancelBookingByArtisan,
  confirmBookingByArtisan,
  resendBookingConfirmation,
  getAuditLogs,
  getAllReceipts,
} from "@/services/bookingEngine";
import { triggerHaptic } from "@/services/haptics";
import { ReceiptModal } from "@/components/receipts/ReceiptModal";
import { toast } from "sonner";

interface ArtisanBookingDetailDrawerProps {
  booking: Booking | null;
  isOpen: boolean;
  artisanId: string;
  onClose: () => void;
  onBookingUpdated: () => void;
}

export const ArtisanBookingDetailDrawer = ({
  booking,
  isOpen,
  artisanId,
  onClose,
  onBookingUpdated,
}: ArtisanBookingDetailDrawerProps) => {
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmChannel, setConfirmChannel] = useState<Payment["channel"]>("card");
  const [confirmNotes, setConfirmNotes] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);

  if (!isOpen || !booking) return null;

  // Temporal check for completion: Appointment start time must have passed
  const appointmentStartTimestamp = new Date(
    `${booking.appointmentDate}T${booking.appointmentTime}:00`
  ).getTime();
  const now = Date.now();
  const isStartTimePassed = now >= appointmentStartTimestamp;

  const canMarkComplete = booking.status === "confirmed" && isStartTimePassed;

  // Filter audit timeline for this booking
  const auditLogs = getAuditLogs().filter((l) => l.entityId === booking.id);

  // Find associated receipt if any
  const receipts = getAllReceipts();
  const bookingReceipt = receipts.find((r) => r.bookingId === booking.id) || null;

  const handleConfirmByArtisan = () => {
    triggerHaptic(15);
    try {
      confirmBookingByArtisan(booking.id, artisanId, {
        channel: confirmChannel,
        notes: confirmNotes,
      });
      toast.success(
        `Reservation ${booking.referenceCode} confirmed! 50% deposit verified and official tax invoice issued to ${booking.customerName}.`
      );
      setShowConfirmModal(false);
      onBookingUpdated();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to confirm booking";
      toast.error(msg);
    }
  };

  const handleMarkComplete = () => {
    triggerHaptic(15);
    try {
      markServiceComplete(booking.id, artisanId);
      toast.success(
        `Service marked complete! Remaining balance of ${formatZAR(
          booking.balanceAmountCents
        )} is now unlocked for ${booking.customerName} to settle.`
      );
      setShowCompleteConfirm(false);
      onBookingUpdated();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to mark service complete";
      toast.error(msg);
    }
  };

  const handleCancelByArtisan = () => {
    if (!cancelReason || cancelReason.trim().length < 5) {
      toast.error("Please provide a reason (minimum 5 characters) for the cancellation.");
      return;
    }

    triggerHaptic(15);
    try {
      const result = cancelBookingByArtisan(booking.id, artisanId, cancelReason);
      toast.success(
        `Appointment cancelled. A 100% refund of ${formatZAR(
          result.refund.amountCents
        )} was dispatched to ${booking.customerName}.`
      );
      setShowCancelModal(false);
      setCancelReason("");
      onBookingUpdated();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to cancel appointment";
      toast.error(msg);
    }
  };

  const handleResendConfirmation = () => {
    triggerHaptic(10);
    try {
      resendBookingConfirmation(booking.id, artisanId);
      toast.success(`Appointment confirmation instructions resent to ${booking.customerEmail}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to resend confirmation";
      toast.error(msg);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    triggerHaptic(6);
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const isAwaitingDeposit = booking.status === "awaiting_deposit";
  const isConfirmed = booking.status === "confirmed";
  const isCompleted = booking.status === "completed";
  const isPaidInFull = booking.status === "paid_in_full";
  const isRefunded = booking.status === "refunded";

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="w-full max-w-xl h-full bg-white dark:bg-[#1E1724] border-l border-[#EFBDEB] dark:border-[#3B3237] shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
          {/* Top Bar */}
          <div className="p-5 border-b border-[#EFBDEB]/60 dark:border-[#3B3237] flex items-center justify-between bg-[#FAF2FA]/50 dark:bg-[#251D2C]">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-sm font-bold text-[#DB2777]">
                {booking.referenceCode}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(booking.referenceCode, "Reference code")}
                className="text-gray-400 hover:text-[#501854] dark:hover:text-[#D4C7E1] p-1 rounded hover:bg-white dark:hover:bg-[#34273E]"
                title="Copy reference code"
              >
                <Copy size={13} />
              </button>

              <span
                className={`text-[10px] uppercase font-semibold px-2.5 py-0.5 rounded-full ${
                  isConfirmed
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200"
                    : isAwaitingDeposit
                    ? "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200 border border-amber-200"
                    : isCompleted
                    ? "bg-pink-50 text-[#DB2777] dark:bg-pink-950/40 dark:text-pink-300 border border-pink-200"
                    : isPaidInFull
                    ? "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                }`}
              >
                {booking.status.replace(/_/g, " ")}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-[#501854] dark:hover:text-[#D4C7E1] rounded-full hover:bg-white dark:hover:bg-[#34273E]"
            >
              <X size={18} />
            </button>
          </div>

          {/* Drawer Body with Complete Booking Dossier */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-[#501854] dark:text-[#D4C7E1]">
            {/* Status Alert Banner if awaiting deposit */}
            {isAwaitingDeposit && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-xs text-amber-900 dark:text-amber-200">
                    <Clock size={14} className="text-amber-600" />
                    <span>Awaiting Atelier Confirmation / Deposit Verification</span>
                  </div>
                  <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
                    This reservation has been requested by the client. You can verify and confirm the booking immediately below.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(true)}
                  className="bg-[#501854] dark:bg-[#DB2777] text-white px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shadow-xs hover:opacity-90 cursor-pointer"
                >
                  Confirm Now
                </button>
              </div>
            )}

            {/* Treatment & Time */}
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#DB2777] font-semibold block">
                Treatment Details
              </span>
              <h3 className="font-serif text-2xl font-bold mt-0.5">{booking.serviceTitle}</h3>
              <p className="text-xs text-[#7E4882] dark:text-[#A695B8] mt-0.5">
                Category: <strong className="capitalize">{booking.serviceCategory}</strong> • Estimated Duration: <strong>{booking.endEstimatedTime}</strong>
              </p>

              <div className="mt-4 p-4 rounded-2xl bg-[#FAF2FA] dark:bg-[#291F2F] border border-[#EFBDEB]/60 dark:border-[#3B3237] space-y-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-[#DB2777]" />
                  <span className="font-semibold text-sm">
                    {booking.appointmentDate} at {booking.appointmentTime} SAST
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin size={14} className="text-[#DB2777] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">
                      {booking.serviceType === "studio" ? "Private Atelier Studio Session" : "Luxury VIP Mobile House Call"}
                    </span>
                    <span className="text-[#7E4882] dark:text-[#A695B8]">{booking.locationAddress}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Client CRM Details (Full Contact Dossier) */}
            <div className="p-4 rounded-2xl border border-[#EFBDEB] dark:border-[#3B3237] space-y-3.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[#DB2777] block">
                  Client Contact Dossier
                </span>
                <span className="text-[10px] font-mono text-gray-400">ID: {booking.customerId}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <User size={15} className="text-[#DB2777]" />
                  <span className="font-semibold text-sm">{booking.customerName}</span>
                </div>
                <span className="text-[10px] bg-pink-50 dark:bg-pink-950/40 text-[#DB2777] px-2 py-0.5 rounded-full font-semibold">
                  GlowLink VIP Client
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-[#EFBDEB]/30 dark:border-[#3B3237]">
                <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50 dark:bg-[#2B2132]">
                  <div className="flex items-center gap-2 text-[#7E4882] dark:text-[#A695B8]">
                    <Phone size={13} className="text-[#DB2777]" />
                    <a href={`tel:${booking.customerPhone}`} className="hover:underline font-mono">
                      {booking.customerPhone}
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(booking.customerPhone, "Phone number")}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <Copy size={12} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50 dark:bg-[#2B2132]">
                  <div className="flex items-center gap-2 text-[#7E4882] dark:text-[#A695B8] truncate">
                    <Mail size={13} className="text-[#DB2777] shrink-0" />
                    <a href={`mailto:${booking.customerEmail}`} className="hover:underline truncate">
                      {booking.customerEmail}
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(booking.customerEmail, "Email address")}
                    className="text-gray-400 hover:text-gray-600 p-1 shrink-0"
                  >
                    <Copy size={12} />
                  </button>
                </div>
              </div>

              {/* Client Preparation Notes */}
              {booking.notes && (
                <div className="pt-2 border-t border-[#EFBDEB]/40 dark:border-[#3B3237]">
                  <span className="text-[10px] uppercase tracking-wider text-gray-500 block mb-1 font-semibold">
                    Client Preparation Notes & Skin Preferences:
                  </span>
                  <p className="p-3 rounded-xl bg-[#FAF2FA] dark:bg-[#2C2134] italic text-xs leading-relaxed border border-[#EFBDEB]/50 dark:border-[#3B3237]">
                    "{booking.notes}"
                  </p>
                </div>
              )}
            </div>

            {/* Financial Ledger & VAT Breakdown */}
            <div className="p-4 rounded-2xl bg-[#FAF2FA]/80 dark:bg-[#251D2C] border border-[#EFBDEB]/60 dark:border-[#3B3237] space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[#DB2777] block">
                  Financial Ledger
                </span>
                {bookingReceipt && (
                  <button
                    type="button"
                    onClick={() => setSelectedReceipt(bookingReceipt)}
                    className="inline-flex items-center gap-1 text-[11px] text-[#DB2777] font-semibold hover:underline"
                  >
                    <ReceiptIcon size={12} />
                    <span>View Official Receipt</span>
                  </button>
                )}
              </div>

              <div className="flex justify-between">
                <span className="text-[#7E4882] dark:text-[#A695B8]">Total Service Fee:</span>
                <span className="font-mono font-semibold">{formatZAR(booking.totalAmountCents)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7E4882] dark:text-[#A695B8] flex items-center gap-1">
                  <ShieldCheck size={12} className="text-emerald-500" />
                  Deposit (50% Required):
                </span>
                <span className={`font-mono font-bold ${isAwaitingDeposit ? "text-amber-600" : "text-emerald-600 dark:text-emerald-400"}`}>
                  {formatZAR(booking.depositAmountCents)} ({isAwaitingDeposit ? "Pending Verification" : "Verified Paid"})
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#EFBDEB] dark:border-[#3B3237]">
                <span className="text-[#7E4882] dark:text-[#A695B8]">Remaining Balance (50%):</span>
                <span className="font-mono font-bold">
                  {isPaidInFull
                    ? "R 0.00 (Settled in full)"
                    : `${formatZAR(booking.balanceAmountCents)} (${
                        isCompleted ? "Unlocked for client payment" : "Locked until service completion"
                      })`}
                </span>
              </div>
            </div>

            {/* Event Timeline / Audit Trail */}
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#DB2777] block">
                Verified Event Timeline
              </span>
              <div className="border-l-2 border-[#EFBDEB] dark:border-[#3B3237] ml-2 pl-4 space-y-4 text-xs">
                <div className="relative">
                  <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#501854] dark:bg-[#DB2777]" />
                  <p className="font-semibold text-xs">Booking Created / Hold Reserved</p>
                  <p className="text-[10px] text-[#7E4882] dark:text-[#A695B8]">
                    Reference: {booking.referenceCode}. Reserved on {new Date(booking.createdAt).toLocaleDateString("en-ZA")}.
                  </p>
                </div>

                {isConfirmed && (
                  <div className="relative">
                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <p className="font-semibold text-xs">Booking Confirmed & Deposit Verified</p>
                    <p className="text-[10px] text-[#7E4882] dark:text-[#A695B8]">
                      50% deposit received. Official SARS Tax Receipt archived.
                    </p>
                  </div>
                )}

                {booking.completedAt && (
                  <div className="relative">
                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-pink-500" />
                    <p className="font-semibold text-xs">Service Marked Complete</p>
                    <p className="text-[10px] text-[#7E4882] dark:text-[#A695B8]">
                      Artisan confirmed completion. Remaining balance payment link unlocked for client.
                    </p>
                  </div>
                )}

                {isPaidInFull && (
                  <div className="relative">
                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-purple-500" />
                    <p className="font-semibold text-xs">Balance Settled in Full</p>
                    <p className="text-[10px] text-[#7E4882] dark:text-[#A695B8]">
                      Final balance payment settled via Paystack. Session archived.
                    </p>
                  </div>
                )}

                {isRefunded && (
                  <div className="relative">
                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <p className="font-semibold text-xs">100% Refund Processed</p>
                    <p className="text-[10px] text-[#7E4882] dark:text-[#A695B8]">
                      Reason: {booking.cancellationReason || "Cancellation processed"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Drawer Actions */}
          <div className="p-5 border-t border-[#EFBDEB]/60 dark:border-[#3B3237] bg-white dark:bg-[#1E1724] space-y-2.5">
            {/* ACTION 1: If awaiting deposit / pending, allow artisan to Confirm */}
            {isAwaitingDeposit && (
              <button
                type="button"
                onClick={() => setShowConfirmModal(true)}
                className="w-full py-3.5 rounded-full text-xs uppercase tracking-wider font-semibold bg-[#501854] dark:bg-[#DB2777] text-white hover:opacity-90 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 size={16} />
                <span>Confirm Booking & Verify 50% Deposit</span>
              </button>
            )}

            {/* ACTION 2: If Confirmed, allow Complete or Cancel */}
            {isConfirmed && (
              <>
                <button
                  type="button"
                  disabled={!canMarkComplete}
                  onClick={() => setShowCompleteConfirm(true)}
                  className={`w-full py-3.5 rounded-full text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 ${
                    canMarkComplete
                      ? "bg-[#501854] dark:bg-[#DB2777] text-white hover:opacity-90 active:scale-95 shadow-md cursor-pointer"
                      : "bg-gray-100 dark:bg-[#34273E] text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700 cursor-not-allowed"
                  }`}
                >
                  <CheckCircle2 size={15} />
                  <span>Mark Service Complete (Unlock Balance)</span>
                </button>

                {!isStartTimePassed && (
                  <p className="text-[10px] text-center text-amber-600 dark:text-amber-400 font-light flex items-center justify-center gap-1">
                    <Clock size={11} />
                    <span>Complete button unlocks after appointment start time ({booking.appointmentTime} SAST)</span>
                  </p>
                )}

                <div className="flex items-center justify-between pt-1 text-xs">
                  <button
                    type="button"
                    onClick={handleResendConfirmation}
                    className="text-[#501854] dark:text-[#D4C7E1] hover:text-[#DB2777] inline-flex items-center gap-1 font-medium cursor-pointer"
                  >
                    <Send size={12} />
                    <span>Resend Confirmation to Client</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowCancelModal(true)}
                    className="text-rose-600 hover:text-rose-700 dark:text-rose-400 hover:underline cursor-pointer font-medium"
                  >
                    Cancel & Full Refund
                  </button>
                </div>
              </>
            )}

            {isCompleted && (
              <div className="space-y-2">
                <div className="text-center p-3 rounded-2xl bg-pink-50 dark:bg-pink-950/40 text-xs text-[#DB2777] font-semibold flex items-center justify-center gap-2">
                  <Unlock size={14} />
                  <span>Service complete. Awaiting client balance payment of {formatZAR(booking.balanceAmountCents)}.</span>
                </div>
                <button
                  type="button"
                  onClick={handleResendConfirmation}
                  className="w-full py-2 rounded-full border border-[#EFBDEB] dark:border-[#3B3237] text-xs font-semibold text-[#501854] dark:text-[#D4C7E1] hover:border-[#DB2777] cursor-pointer"
                >
                  Send Balance Payment Reminder to Client
                </button>
              </div>
            )}

            {isPaidInFull && (
              <div className="text-center p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-xs text-emerald-700 dark:text-emerald-300 font-semibold flex items-center justify-center gap-2">
                <CheckCircle2 size={14} />
                <span>Booking fully settled & archived.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Atelier Confirm Booking Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#1E1724] rounded-3xl p-6 max-w-md w-full border border-[#EFBDEB] dark:border-[#3B3237] shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-[#501854] dark:text-[#D4C7E1]">
              <CheckCircle2 size={22} className="text-[#DB2777]" />
              <h3 className="font-serif text-lg font-bold">Confirm Atelier Reservation</h3>
            </div>

            <p className="text-xs text-[#7E4882] dark:text-[#A695B8] leading-relaxed">
              Confirm appointment for <strong>{booking.customerName}</strong> ({booking.serviceTitle} on{" "}
              <strong>{booking.appointmentDate} at {booking.appointmentTime}</strong>)?
            </p>

            <div className="p-3.5 rounded-2xl bg-[#FAF2FA] dark:bg-[#2C2134] text-xs space-y-2 border border-[#EFBDEB]/60 dark:border-[#3B3237]">
              <div className="flex justify-between font-semibold text-[#501854] dark:text-[#D4C7E1]">
                <span>50% Deposit to Verify:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">
                  {formatZAR(booking.depositAmountCents)}
                </span>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">
                  Payment Verification Channel
                </label>
                <select
                  value={confirmChannel}
                  onChange={(e) => setConfirmChannel(e.target.value as any)}
                  className="w-full px-3 py-1.5 bg-white dark:bg-[#34273E] border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-medium text-[#501854] dark:text-[#D4C7E1]"
                >
                  <option value="card">Paystack Online Payment</option>
                  <option value="instant_eft">Direct Bank Instant EFT</option>
                  <option value="capitec_pay">Capitec Pay / Mobile EFT</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="w-1/2 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmByArtisan}
                className="w-1/2 py-2.5 rounded-full bg-[#501854] dark:bg-[#DB2777] text-white text-xs font-semibold shadow-xs cursor-pointer hover:opacity-90"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complete Confirmation Modal */}
      {showCompleteConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#1E1724] rounded-3xl p-6 max-w-md w-full border border-[#EFBDEB] dark:border-[#3B3237] shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-[#501854] dark:text-[#D4C7E1]">
              <CheckCircle2 size={22} className="text-[#DB2777]" />
              <h3 className="font-serif text-lg font-bold">Confirm Service Completion</h3>
            </div>

            <p className="text-xs text-[#7E4882] dark:text-[#A695B8] leading-relaxed">
              Are you sure you have completed the treatment for{" "}
              <strong>{booking.customerName}</strong>?
            </p>

            <div className="p-3.5 rounded-2xl bg-[#FAF2FA] dark:bg-[#2C2134] text-xs space-y-1">
              <p className="font-semibold text-[#501854] dark:text-[#D4C7E1]">
                Balance to Unlock: {formatZAR(booking.balanceAmountCents)}
              </p>
              <p className="text-[11px] text-[#7E4882] dark:text-[#A695B8]">
                This will immediately notify {booking.customerName} via in-app notification and email with a direct Paystack checkout link to pay the remaining balance.
              </p>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowCompleteConfirm(false)}
                className="w-1/2 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 cursor-pointer"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={handleMarkComplete}
                className="w-1/2 py-2.5 rounded-full bg-[#501854] dark:bg-[#DB2777] text-white text-xs font-semibold shadow-xs cursor-pointer hover:opacity-90"
              >
                Yes, Mark Complete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Appointment Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#1E1724] rounded-3xl p-6 max-w-md w-full border border-[#EFBDEB] dark:border-[#3B3237] shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertTriangle size={22} />
              <h3 className="font-serif text-lg font-bold text-[#501854] dark:text-[#D4C7E1]">
                Cancel Appointment & Refund Client
              </h3>
            </div>

            <p className="text-xs text-[#7E4882] dark:text-[#A695B8] leading-relaxed">
              When an artisan cancels, the client is <strong>guaranteed an automatic 100% refund</strong> of all deposit amounts paid ({formatZAR(booking.depositAmountCents)}).
            </p>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#501854] dark:text-[#D4C7E1] mb-1.5">
                Cancellation Reason (Required)
              </label>
              <textarea
                rows={3}
                required
                placeholder="e.g. Unforeseen studio emergency, health conflict, equipment malfunction..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-gray-50 dark:bg-[#2C2134] border border-gray-200 dark:border-gray-700 rounded-xl text-[#501854] dark:text-[#D4C7E1]"
              />
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="w-1/2 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 cursor-pointer"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleCancelByArtisan}
                className="w-1/2 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
              >
                Confirm Full Refund
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      <ReceiptModal
        receipt={selectedReceipt}
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />
    </>
  );
};
