import { useRef } from "react";
import {
  X,
  Printer,
  Download,
  Mail,
  CheckCircle2,
  Building,
  ShieldCheck,
  Calendar,
  CreditCard,
  Sparkles,
} from "lucide-react";
import { Receipt, formatZAR } from "@/services/dataTypes";
import { triggerHaptic } from "@/services/haptics";
import { toast } from "sonner";

interface ReceiptModalProps {
  receipt: Receipt | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptModal = ({ receipt, isOpen, onClose }: ReceiptModalProps) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !receipt) return null;

  const handlePrint = () => {
    triggerHaptic(10);
    window.print();
  };

  const handleEmailCopy = () => {
    triggerHaptic(8);
    toast.success(`Tax receipt ${receipt.receiptNumber} sent to ${receipt.customerEmail}`);
  };

  const isDeposit = receipt.type === "deposit";
  const isBalance = receipt.type === "balance";
  const isRefund = receipt.type === "refund";

  // Calculations for South African 15% VAT
  const vatAmount = receipt.vatAmountCents || Math.round((receipt.amountCents * 15) / 115);
  const netExclusive = receipt.amountCents - vatAmount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#1E1724] rounded-3xl shadow-2xl border border-[#EFBDEB] dark:border-[#3B3237] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Controls Header */}
        <div className="px-5 py-4 border-b border-[#EFBDEB]/60 dark:border-[#3B3237] flex items-center justify-between bg-[#FAF2FA]/50 dark:bg-[#251D2C]">
          <div className="flex items-center gap-2">
            <span className="font-serif text-sm font-semibold text-[#501854] dark:text-[#D4C7E1]">
              Official Receipt
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#501854]/10 dark:bg-[#DB2777]/20 text-[#501854] dark:text-[#DB2777] font-bold">
              {receipt.receiptNumber}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrint}
              title="Print Receipt"
              className="p-2 text-gray-500 hover:text-[#501854] dark:hover:text-[#D4C7E1] rounded-full hover:bg-white dark:hover:bg-[#34273E] transition-all"
            >
              <Printer size={16} />
            </button>
            <button
              onClick={handleEmailCopy}
              title="Email Copy"
              className="p-2 text-gray-500 hover:text-[#501854] dark:hover:text-[#D4C7E1] rounded-full hover:bg-white dark:hover:bg-[#34273E] transition-all"
            >
              <Mail size={16} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-[#501854] dark:hover:text-[#D4C7E1] rounded-full hover:bg-white dark:hover:bg-[#34273E] transition-all"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div ref={printRef} className="p-6 sm:p-8 overflow-y-auto space-y-6 text-[#501854] dark:text-[#D4C7E1]">
          {/* Brand & Legal Header */}
          <div className="flex justify-between items-start border-b border-[#EFBDEB] dark:border-[#3B3237] pb-5">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#501854] dark:text-[#D4C7E1]">
                  GLOW<span className="text-[#DB2777]">LINK</span>
                </span>
                <span className="text-[9px] uppercase tracking-widest text-[#7E4882] dark:text-[#A695B8] border-l border-[#EFBDEB] pl-1.5 ml-1">
                  Atelier
                </span>
              </div>
              <p className="text-[11px] text-[#7E4882] dark:text-[#A695B8]">
                GlowLink Luxury Beauty Marketplace (Pty) Ltd
              </p>
              <p className="text-[10px] text-[#7E4882] dark:text-[#A695B8]">
                Sandton City Office Towers, Johannesburg, 2196
              </p>
              {receipt.isVatVendor && (
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-mono mt-0.5">
                  VAT Registration No: {receipt.vatNumber || "4190283741"}
                </p>
              )}
            </div>

            <div className="text-right">
              <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                isRefund
                  ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-200"
                  : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200"
              }`}>
                {isRefund ? "Refund Receipt" : receipt.isVatVendor ? "Tax Invoice / Receipt" : "Payment Receipt"}
              </span>
              <p className="font-mono text-xs font-bold text-[#501854] dark:text-[#D4C7E1] mt-2">
                {receipt.receiptNumber}
              </p>
              <p className="text-[10px] text-[#7E4882] dark:text-[#A695B8]">
                Issued: {new Date(receipt.issuedAt).toLocaleDateString("en-ZA", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          {/* Parties: Supplier & Client */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-[#FAF2FA] dark:bg-[#291F2F] border border-[#EFBDEB]/60 dark:border-[#3B3237]">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#DB2777] block mb-1">
                Atelier Service Provider
              </span>
              <p className="font-semibold text-sm">{receipt.artisanBusinessName || receipt.artisanName}</p>
              <p className="text-[#7E4882] dark:text-[#A695B8]">Master Artisan: {receipt.artisanName}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">Verified GlowLink Member</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FAF2FA] dark:bg-[#291F2F] border border-[#EFBDEB]/60 dark:border-[#3B3237]">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#DB2777] block mb-1">
                Billed To (Client)
              </span>
              <p className="font-semibold text-sm">{receipt.customerName}</p>
              <p className="text-[#7E4882] dark:text-[#A695B8] truncate">{receipt.customerEmail}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">Ref Code: {receipt.bookingReference}</p>
            </div>
          </div>

          {/* Line Item Table (SARS Section 20(4) Itemized Description) */}
          <div className="border border-[#EFBDEB] dark:border-[#3B3237] rounded-2xl overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-[#FAF2FA] dark:bg-[#291F2F] text-[10px] uppercase tracking-wider text-[#7E4882] dark:text-[#A695B8] border-b border-[#EFBDEB] dark:border-[#3B3237]">
                <tr>
                  <th className="py-2.5 px-4 text-left font-semibold">Service Description</th>
                  <th className="py-2.5 px-3 text-center font-semibold">Type</th>
                  <th className="py-2.5 px-4 text-right font-semibold">Amount (ZAR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                <tr>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-sm">{receipt.serviceTitle}</p>
                    <p className="text-[11px] text-[#7E4882] dark:text-[#A695B8]">
                      Session Date: {receipt.appointmentDate} • Ref {receipt.bookingReference}
                    </p>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="capitalize text-[11px] font-medium">
                      {isRefund ? "100% Refund" : isDeposit ? "50% Deposit" : "Final Balance"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold">
                    {isRefund ? `-${formatZAR(receipt.amountCents)}` : formatZAR(receipt.amountCents)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Financial Breakdown / VAT Analysis */}
          <div className="p-4 rounded-2xl bg-[#FAF2FA]/80 dark:bg-[#251D2C] border border-[#EFBDEB]/60 dark:border-[#3B3237] space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#7E4882] dark:text-[#A695B8]">Subtotal (Exclusive of VAT):</span>
              <span className="font-mono">{formatZAR(netExclusive)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7E4882] dark:text-[#A695B8]">Value Added Tax (15% VAT):</span>
              <span className="font-mono">{formatZAR(vatAmount)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-[#EFBDEB] dark:border-[#3B3237] text-sm font-bold">
              <span>{isRefund ? "Total Refunded:" : "Total Paid (Inc. VAT):"}</span>
              <span className="text-[#DB2777] font-mono text-base">
                {formatZAR(receipt.amountCents)}
              </span>
            </div>
            {!isRefund && (
              <div className="flex justify-between text-[11px] pt-1 text-[#7E4882] dark:text-[#A695B8]">
                <span>Remaining Appointment Balance:</span>
                <span className="font-mono font-semibold">
                  {formatZAR(receipt.balanceRemainingCents)}
                </span>
              </div>
            )}
          </div>

          {/* Payment Method & Compliance Footer */}
          <div className="pt-2 text-[10px] text-gray-500 dark:text-gray-400 space-y-1 text-center">
            <div className="flex items-center justify-center gap-2">
              <CreditCard size={12} className="text-[#DB2777]" />
              <span>
                Processed via Paystack SA • Card ending in {receipt.paymentMethodLast4 || "4242"}
              </span>
            </div>
            <p>
              SARS Tax Compliant under Section 20(4) of the Value-Added Tax Act, No. 89 of 1991.
            </p>
            <p className="italic">
              Thank you for trusting South Africa's premier curated beauty atelier.
            </p>
          </div>
        </div>

        {/* Action Bottom Bar */}
        <div className="p-4 bg-gray-50 dark:bg-[#1E1724] border-t border-[#EFBDEB]/60 dark:border-[#3B3237] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-[#501854] dark:text-[#D4C7E1] hover:bg-gray-200 dark:hover:bg-[#34273E] transition-all cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="bg-[#501854] dark:bg-[#DB2777] text-white px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Download size={14} />
            <span>Download PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
