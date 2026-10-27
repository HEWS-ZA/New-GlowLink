import { useState, useEffect } from "react";
import {
  Receipt as ReceiptIcon,
  Download,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  RotateCcw,
  Printer,
  Calendar,
} from "lucide-react";
import { useAuth } from "@/services/authStore";
import {
  getCustomerReceipts,
  getAllReceipts,
  subscribeToEngineChanges,
} from "@/services/bookingEngine";
import { Receipt, formatZAR } from "@/services/dataTypes";
import { triggerHaptic } from "@/services/haptics";
import { ReceiptModal } from "@/components/receipts/ReceiptModal";
import { toast } from "sonner";

export const CustomerReceipts = () => {
  const { user } = useAuth();
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);

  const refreshReceipts = () => {
    if (user) {
      // Find customer's receipts
      const userReceipts = getCustomerReceipts(user.email);
      // If customer has no specific receipts yet, show all system demo receipts for seamless preview
      setReceipts(userReceipts.length > 0 ? userReceipts : getAllReceipts());
    }
  };

  useEffect(() => {
    refreshReceipts();
    return subscribeToEngineChanges(refreshReceipts);
  }, [user]);

  const handleOpenReceipt = (receipt: Receipt) => {
    triggerHaptic(8);
    setSelectedReceipt(receipt);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-10">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF2FA] dark:bg-[#372E3E] border border-[#EFBDEB] dark:border-[#3B3237] shadow-2xs mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#DB2777]" />
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#501854] dark:text-[#D4C7E1] font-semibold">
            Financial Records
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#501854] dark:text-[#D4C7E1]">
          Payment <span className="italic font-normal text-[#DB2777]">Receipts</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#7E4882] dark:text-[#A695B8] font-light mt-1">
          Official VAT-compliant tax invoices & payment confirmation records for all beauty appointments.
        </p>
      </div>

      {receipts.length === 0 ? (
        <div className="text-center py-16 px-4 glass-panel rounded-3xl border border-[#EFBDEB] dark:border-[#3B3237]">
          <ReceiptIcon className="w-10 h-10 text-[#8C3B8A] dark:text-[#A695B8] mx-auto mb-3 opacity-60" />
          <h3 className="font-serif text-lg text-[#501854] dark:text-[#D4C7E1] mb-1">
            No receipts on record yet
          </h3>
          <p className="text-xs text-[#7E4882] dark:text-[#A695B8] font-light max-w-sm mx-auto">
            Official tax invoices are automatically generated and archived here after each verified deposit or balance transaction.
          </p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {receipts.map((r) => {
            const isRefund = r.type === "refund";
            const isDeposit = r.type === "deposit";

            return (
              <div
                key={r.id}
                onClick={() => handleOpenReceipt(r)}
                className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#241C2B] border border-[#EFBDEB] dark:border-[#3B3237] shadow-2xs hover:border-[#DB2777] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-2xl ${
                      isRefund
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-200"
                        : "bg-[#FAF2FA] dark:bg-[#372E3E] text-[#DB2777]"
                    } border border-[#EFBDEB] dark:border-[#3B3237] shrink-0`}
                  >
                    {isRefund ? <RotateCcw size={20} /> : <ReceiptIcon size={20} />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-[#501854] dark:text-[#D4C7E1]">
                        {r.receiptNumber}
                      </span>
                      <span
                        className={`text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${
                          isRefund
                            ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200"
                            : isDeposit
                            ? "bg-pink-50 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300 border border-pink-200"
                            : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200"
                        }`}
                      >
                        {isRefund ? "Refund" : isDeposit ? "50% Deposit" : "Settled Balance"}
                      </span>
                      {r.isVatVendor && (
                        <span className="text-[9px] bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded font-mono">
                          15% VAT
                        </span>
                      )}
                    </div>

                    <h4 className="font-serif text-sm sm:text-base font-semibold text-[#501854] dark:text-[#D4C7E1]">
                      {r.serviceTitle}
                    </h4>
                    <p className="text-xs text-[#7E4882] dark:text-[#A695B8] mt-0.5">
                      Atelier Provider: {r.artisanBusinessName || r.artisanName} • Ref {r.bookingReference}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1.5">
                      <Calendar size={12} />
                      <span>
                        Issued {new Date(r.issuedAt).toLocaleDateString("en-ZA", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-5 pt-3 md:pt-0 border-t md:border-t-0 border-[#EFBDEB]/40 dark:border-[#3B3237]">
                  <div className="text-left md:text-right">
                    <span className="block text-[11px] text-[#7E4882] dark:text-[#A695B8]">
                      Amount
                    </span>
                    <span
                      className={`font-serif text-lg sm:text-xl font-bold font-mono ${
                        isRefund ? "text-amber-600" : "text-[#501854] dark:text-[#D4C7E1]"
                      }`}
                    >
                      {isRefund ? `-${formatZAR(r.amountCents)}` : formatZAR(r.amountCents)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenReceipt(r);
                    }}
                    className="p-2.5 rounded-full border border-[#EFBDEB] dark:border-[#3B3237] hover:border-[#DB2777] text-[#501854] dark:text-[#D4C7E1] hover:text-[#DB2777] hover:bg-[#FAF2FA] dark:hover:bg-[#372E3E] transition-all cursor-pointer shadow-2xs"
                    title="View & Download PDF"
                  >
                    <Download size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Official Tax Invoice / Receipt Modal */}
      <ReceiptModal
        receipt={selectedReceipt}
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />
    </div>
  );
};
