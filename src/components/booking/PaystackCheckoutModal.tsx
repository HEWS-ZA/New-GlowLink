import { useState, useEffect } from "react";
import {
  CreditCard,
  Building2,
  Smartphone,
  ShieldCheck,
  Lock,
  CheckCircle,
  AlertTriangle,
  X,
  Loader2,
  Receipt as ReceiptIcon,
} from "lucide-react";
import { Booking, PaymentType, formatZAR } from "@/services/dataTypes";
import { processPaymentWebhook, WebhookResult } from "@/services/bookingEngine";
import { triggerHaptic } from "@/services/haptics";
import { toast } from "sonner";

interface PaystackCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
  paymentType: PaymentType;
  onSuccess: (result: WebhookResult) => void;
}

export const PaystackCheckoutModal = ({
  isOpen,
  onClose,
  booking,
  paymentType,
  onSuccess,
}: PaystackCheckoutModalProps) => {
  const [selectedChannel, setSelectedChannel] = useState<"card" | "instant_eft" | "capitec_pay">("card");
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvv, setCardCvv] = useState("123");
  const [selectedBank, setSelectedBank] = useState("Capitec Bank");
  const [capitecCell, setCapitecCell] = useState(booking.customerPhone || "+27 82 890 1234");
  const [isProcessing, setIsProcessing] = useState(false);
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(15 * 60);

  const amountCents = paymentType === "deposit" ? booking.depositAmountCents : booking.balanceAmountCents;

  // 15-minute hold countdown timer for deposit
  useEffect(() => {
    if (!isOpen || paymentType !== "deposit") return;
    const updateTimer = () => {
      const remainingMs = booking.holdExpiresAt - Date.now();
      const seconds = Math.max(0, Math.floor(remainingMs / 1000));
      setTimeLeftSeconds(seconds);
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [isOpen, booking.holdExpiresAt, paymentType]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const timerDisplay = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  const handlePay = async () => {
    triggerHaptic(15);
    setIsProcessing(true);

    // Simulate Paystack transaction gateway network latency
    await new Promise((resolve) => setTimeout(resolve, 1200));

    if (simulateFailure) {
      setIsProcessing(false);
      triggerHaptic(25);
      toast.error("Payment authorization failed. Insufficient funds or card declined by issuing bank.");
      return;
    }

    try {
      const ref = `pstk_${paymentType}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const idempotencyKey = `idemp_${ref}`;

      // Construct verified webhook payload
      const webhookPayload = {
        event: "charge.success" as const,
        data: {
          reference: ref,
          amount: amountCents,
          currency: "ZAR",
          channel: selectedChannel,
          idempotencyKey,
          paidAt: new Date().toISOString(),
          authorization: {
            last4: selectedChannel === "card" ? "4242" : "8821",
            card_type: selectedChannel === "card" ? "visa" : "debit",
            brand: selectedChannel === "card" ? "Visa" : selectedBank,
          },
          metadata: {
            bookingId: booking.id,
            paymentType,
            customerId: booking.customerId,
            artisanId: booking.artisanId,
          },
        },
      };

      // Verified mock HMAC signature
      const validSignature = "sha512_verified_signature_glowlink_prod_mock";
      const result = await processPaymentWebhook(webhookPayload, validSignature);

      triggerHaptic(20);
      toast.success(
        paymentType === "deposit"
          ? "Deposit verified! Your appointment is officially confirmed."
          : "Balance settled in full! Thank you for booking with GlowLink."
      );

      setIsProcessing(false);
      onSuccess(result);
    } catch (err: unknown) {
      setIsProcessing(false);
      const msg = err instanceof Error ? err.message : "Payment processing failed";
      toast.error(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#1E1724] rounded-3xl shadow-2xl border border-[#EFBDEB] dark:border-[#3B3237] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Paystack Top Branding Bar */}
        <div className="bg-[#0BA4DB] text-white px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-wide">paystack</span>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-mono">SECURE CHECKOUT</span>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Hold Timer Banner (for deposit) */}
        {paymentType === "deposit" && (
          <div className={`px-5 py-2 flex items-center justify-between text-xs ${
            timeLeftSeconds < 180 ? "bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200" : "bg-[#FAF2FA] dark:bg-[#2C2234] text-[#501854] dark:text-[#D4C7E1]"
          } border-b border-[#EFBDEB]/60 dark:border-[#3B3237]`}>
            <div className="flex items-center gap-1.5 font-medium">
              <Lock size={13} className="text-[#DB2777]" />
              <span>Slot Lock Reserved</span>
            </div>
            <div className="font-mono font-bold text-xs">
              Expires in {timerDisplay}
            </div>
          </div>
        )}

        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Atelier Context */}
          <div className="text-center pb-3 border-b border-gray-100 dark:border-gray-800">
            <p className="text-[11px] uppercase tracking-widest text-[#7E4882] dark:text-[#A695B8] font-semibold">
              Paying {booking.artisanBusinessName || booking.artisanName}
            </p>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#501854] dark:text-[#D4C7E1] mt-1 font-bold">
              {formatZAR(amountCents)}
            </h2>
            <p className="text-xs text-[#DB2777] font-medium mt-1">
              {paymentType === "deposit" ? "50% Required Reservation Deposit" : "Final Remaining Service Balance"} • Ref {booking.referenceCode}
            </p>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#501854] dark:text-[#D4C7E1] mb-2 font-semibold">
              Select Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic(8);
                  setSelectedChannel("card");
                }}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  selectedChannel === "card"
                    ? "border-[#0BA4DB] bg-sky-50/50 dark:bg-sky-950/30 text-[#0BA4DB] font-semibold shadow-xs"
                    : "border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:border-gray-300"
                }`}
              >
                <CreditCard size={18} />
                <span className="text-[11px]">Card</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  triggerHaptic(8);
                  setSelectedChannel("instant_eft");
                }}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  selectedChannel === "instant_eft"
                    ? "border-[#0BA4DB] bg-sky-50/50 dark:bg-sky-950/30 text-[#0BA4DB] font-semibold shadow-xs"
                    : "border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:border-gray-300"
                }`}
              >
                <Building2 size={18} />
                <span className="text-[11px]">Instant EFT</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  triggerHaptic(8);
                  setSelectedChannel("capitec_pay");
                }}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  selectedChannel === "capitec_pay"
                    ? "border-[#0BA4DB] bg-sky-50/50 dark:bg-sky-950/30 text-[#0BA4DB] font-semibold shadow-xs"
                    : "border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:border-gray-300"
                }`}
              >
                <Smartphone size={18} />
                <span className="text-[11px]">Capitec Pay</span>
              </button>
            </div>
          </div>

          {/* Form based on selected channel */}
          {selectedChannel === "card" && (
            <div className="space-y-3 bg-[#FAF2FA]/50 dark:bg-[#251D2C] p-4 rounded-2xl border border-[#EFBDEB]/50 dark:border-[#3B3237]">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#34273E] border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-mono text-[#501854] dark:text-[#D4C7E1]"
                  />
                  <div className="absolute right-3 top-2.5 flex items-center gap-1 text-[10px] font-bold text-blue-600">
                    VISA
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">
                    Valid Thru
                  </label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#34273E] border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-mono text-[#501854] dark:text-[#D4C7E1]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">
                    CVV
                  </label>
                  <input
                    type="password"
                    value={cardCvv}
                    maxLength={4}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#34273E] border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-mono text-[#501854] dark:text-[#D4C7E1]"
                  />
                </div>
              </div>
            </div>
          )}

          {selectedChannel === "instant_eft" && (
            <div className="space-y-3 bg-[#FAF2FA]/50 dark:bg-[#251D2C] p-4 rounded-2xl border border-[#EFBDEB]/50 dark:border-[#3B3237]">
              <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">
                Select Your South African Bank
              </label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white dark:bg-[#34273E] border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-medium text-[#501854] dark:text-[#D4C7E1]"
              >
                <option value="Capitec Bank">Capitec Bank</option>
                <option value="First National Bank (FNB)">First National Bank (FNB)</option>
                <option value="Standard Bank">Standard Bank</option>
                <option value="Nedbank">Nedbank</option>
                <option value="Absa">Absa</option>
                <option value="Investec">Investec</option>
                <option value="Discovery Bank">Discovery Bank</option>
              </select>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                You will be redirected securely to authenticate with your bank app or online banking.
              </p>
            </div>
          )}

          {selectedChannel === "capitec_pay" && (
            <div className="space-y-3 bg-[#FAF2FA]/50 dark:bg-[#251D2C] p-4 rounded-2xl border border-[#EFBDEB]/50 dark:border-[#3B3237]">
              <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">
                Capitec Registered Mobile / ID Number
              </label>
              <input
                type="tel"
                value={capitecCell}
                onChange={(e) => setCapitecCell(e.target.value)}
                placeholder="+27 82 000 0000"
                className="w-full px-3.5 py-2.5 bg-white dark:bg-[#34273E] border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-mono text-[#501854] dark:text-[#D4C7E1]"
              />
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                A prompt will appear instantly on your Capitec banking app for 1-tap confirmation.
              </p>
            </div>
          )}

          {/* Diagnostic Simulation Checkbox for Testing */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-[11px]">
            <span className="text-gray-600 dark:text-gray-400 font-mono">
              Simulate Gateway Error
            </span>
            <input
              type="checkbox"
              checked={simulateFailure}
              onChange={(e) => setSimulateFailure(e.target.checked)}
              className="accent-[#DB2777] cursor-pointer"
            />
          </div>

          {/* Pay Button */}
          <button
            type="button"
            disabled={isProcessing}
            onClick={handlePay}
            className="w-full bg-[#0BA4DB] hover:bg-[#0993c5] text-white py-3.5 rounded-2xl text-xs font-semibold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Processing with Paystack...</span>
              </>
            ) : (
              <>
                <Lock size={14} />
                <span>Pay {formatZAR(amountCents)}</span>
              </>
            )}
          </button>

          {/* Security Guarantee */}
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400">
            <ShieldCheck size={12} className="text-emerald-500" />
            <span>PCI-DSS Level 1 Certified • 256-Bit SSL Encrypted • No raw card storage</span>
          </div>
        </div>
      </div>
    </div>
  );
};
