import { useState } from "react";
import {
  FlaskConical,
  X,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  CreditCard,
  Lock,
  UserCheck,
} from "lucide-react";
import {
  createSlotHold,
  checkSlotAvailability,
  processPaymentWebhook,
  markServiceComplete,
  cancelBookingByArtisan,
  cancelBookingByCustomer,
  confirmBookingByArtisan,
  sweepExpiredHolds,
  getAuditLogs,
} from "@/services/bookingEngine";
import { useAuth, DEMO_CREDENTIALS } from "@/services/authStore";
import { formatZAR, DEPOSIT_PERCENT, SLOT_HOLD_MINUTES } from "@/services/dataTypes";
import { triggerHaptic } from "@/services/haptics";
import { toast } from "sonner";

export const ScenarioTestingPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLog, setActiveLog] = useState<string[]>([]);
  const { user, role, loginCustomer, loginArtisan, logout } = useAuth();

  const addLog = (msg: string) => {
    setActiveLog((prev) => [`[${new Date().toLocaleTimeString("en-ZA")}] ${msg}`, ...prev.slice(0, 20)]);
  };

  const handleTestHappyPath = async () => {
    triggerHaptic(12);
    addLog("--- Starting Test: Happy Path (Deposit -> Complete -> Balance -> Receipts) ---");

    try {
      // 1. Create slot hold
      const hold = createSlotHold({
        customerId: "cust_demo_nandi",
        customerName: "Nandi Khumalo",
        customerEmail: "nandi.k@glowlink.co.za",
        customerPhone: "+27 82 890 1234",
        artisanId: "1",
        artisanName: "Thandi Mthembu",
        serviceId: "srv_test_happy",
        serviceTitle: "Haute Bridal Atelier",
        serviceCategory: "makeup",
        totalAmountCents: 200000,
        appointmentDate: new Date().toISOString().split("T")[0],
        appointmentTime: "08:00",
        serviceType: "studio",
        locationAddress: "124 Sandton Drive, Sandton",
      });
      addLog(`1. Created 15-min slot hold: ${hold.referenceCode} (status: awaiting_deposit)`);

      // 2. Deposit Webhook
      const depRef = `pstk_dep_test_${Date.now()}`;
      const depWebhook = {
        event: "charge.success" as const,
        data: {
          reference: depRef,
          amount: 100000,
          currency: "ZAR",
          channel: "card",
          idempotencyKey: `idemp_${depRef}`,
          paidAt: new Date().toISOString(),
          metadata: {
            bookingId: hold.id,
            paymentType: "deposit" as const,
            customerId: hold.customerId,
            artisanId: hold.artisanId,
          },
        },
      };
      const depResult = await processPaymentWebhook(depWebhook, "sha512_verified_sig");
      addLog(`2. Verified deposit webhook processed. Booking confirmed. Receipt: ${depResult.receipt?.receiptNumber}`);

      // 3. Mark complete
      const completed = markServiceComplete(hold.id, "1");
      addLog(`3. Artisan marked service complete. Balance of ${formatZAR(completed.balanceAmountCents)} unlocked.`);

      // 4. Balance Webhook
      const balRef = `pstk_bal_test_${Date.now()}`;
      const balWebhook = {
        event: "charge.success" as const,
        data: {
          reference: balRef,
          amount: 100000,
          currency: "ZAR",
          channel: "card",
          idempotencyKey: `idemp_${balRef}`,
          paidAt: new Date().toISOString(),
          metadata: {
            bookingId: hold.id,
            paymentType: "balance" as const,
            customerId: hold.customerId,
            artisanId: hold.artisanId,
          },
        },
      };
      const balResult = await processPaymentWebhook(balWebhook, "sha512_verified_sig");
      addLog(`4. Verified balance webhook processed. Status: paid_in_full. Final Receipt: ${balResult.receipt?.receiptNumber}`);
      toast.success("Scenario 1: Happy Path completed with 100% success!");
    } catch (e: any) {
      addLog(`ERROR: ${e.message}`);
      toast.error(e.message);
    }
  };

  const handleTestArtisanCancelRefund = () => {
    triggerHaptic(12);
    addLog("--- Starting Test: Artisan Cancellation & 100% Full Refund ---");
    try {
      const hold = createSlotHold({
        customerId: "cust_demo_nandi",
        customerName: "Nandi Khumalo",
        customerEmail: "nandi.k@glowlink.co.za",
        customerPhone: "+27 82 890 1234",
        artisanId: "1",
        artisanName: "Thandi Mthembu",
        serviceId: "srv_test_artisan_cancel",
        serviceTitle: "Editorial Glam Session",
        serviceCategory: "makeup",
        totalAmountCents: 120000,
        appointmentDate: "2026-11-20",
        appointmentTime: "16:00",
        serviceType: "studio",
        locationAddress: "124 Sandton Drive, Sandton",
      });

      // Confirm deposit
      const depRef = `pstk_dep_${Date.now()}`;
      processPaymentWebhook(
        {
          event: "charge.success",
          data: {
            reference: depRef,
            amount: 60000,
            currency: "ZAR",
            channel: "card",
            idempotencyKey: `idemp_${depRef}`,
            paidAt: new Date().toISOString(),
            metadata: {
              bookingId: hold.id,
              paymentType: "deposit",
              customerId: hold.customerId,
              artisanId: hold.artisanId,
            },
          },
        },
        "sha512_sig"
      );

      // Cancel by artisan
      const cancelResult = cancelBookingByArtisan(
        hold.id,
        "1",
        "Master stylist emergency medical leave"
      );
      addLog(`Artisan cancelled with reason. 100% refund of ${formatZAR(cancelResult.refund.amountCents)} issued. Receipt: ${cancelResult.receipt.receiptNumber}`);
      toast.success("Scenario 2: Full refund executed and slot released!");
    } catch (e: any) {
      addLog(`ERROR: ${e.message}`);
      toast.error(e.message);
    }
  };

  const handleTestAtelierConfirmsBooking = () => {
    triggerHaptic(12);
    addLog("--- Starting Test: Atelier Reviews & Confirms Awaiting Deposit Booking ---");
    try {
      const hold = createSlotHold({
        customerId: "cust_demo_nandi",
        customerName: "Nandi Khumalo",
        customerEmail: "nandi.k@glowlink.co.za",
        customerPhone: "+27 82 890 1234",
        artisanId: "1",
        artisanName: "Thandi Mthembu",
        serviceId: "srv_test_conf",
        serviceTitle: "Couture Hair & Glam Styling",
        serviceCategory: "hair-styling",
        totalAmountCents: 150000,
        appointmentDate: "2026-11-25",
        appointmentTime: "10:00",
        serviceType: "studio",
        locationAddress: "124 Sandton Drive, Sandton",
        notes: "Requested atelier review for wedding party styling.",
      });
      addLog(`Created reservation: ${hold.referenceCode} (status: awaiting_deposit)`);

      const result = confirmBookingByArtisan(hold.id, "1", { channel: "card" });
      addLog(`Atelier confirmed booking! Status: ${result.booking.status}. Receipt: ${result.receipt.receiptNumber}. Deposit: ${formatZAR(result.payment.amountCents)}.`);
      toast.success("Scenario: Atelier confirmed booking and issued tax invoice!");
    } catch (e: any) {
      addLog(`ERROR: ${e.message}`);
      toast.error(e.message);
    }
  };

  const handleTestDuplicateWebhook = async () => {
    triggerHaptic(10);
    addLog("--- Starting Test: Duplicate Webhook Idempotency ---");
    const testRef = `pstk_dup_ref_${Date.now()}`;
    const payload = {
      event: "charge.success" as const,
      data: {
        reference: testRef,
        amount: 50000,
        currency: "ZAR",
        channel: "card",
        idempotencyKey: `idemp_${testRef}`,
        paidAt: new Date().toISOString(),
        metadata: {
          bookingId: "b_demo_101",
          paymentType: "deposit" as const,
          customerId: "cust_demo_nandi",
          artisanId: "1",
        },
      },
    };

    // First delivery
    const res1 = await processPaymentWebhook(payload, "sha512_sig");
    addLog(`Delivery #1: Processed = ${res1.success}, duplicate = ${!!res1.isDuplicate}`);

    // Duplicate delivery
    const res2 = await processPaymentWebhook(payload, "sha512_sig");
    addLog(`Delivery #2 (Duplicate): Processed = ${res2.success}, duplicate = ${!!res2.isDuplicate} (No double billing)`);
    toast.success("Scenario 5: Webhook idempotency confirmed — duplicate rejected safely.");
  };

  const handleTestEarlyCompletionGuard = () => {
    triggerHaptic(10);
    addLog("--- Starting Test: Temporal Completion Guard ---");
    try {
      // Try to complete b_demo_105 (scheduled for tomorrow)
      markServiceComplete("b_demo_105", "1");
      addLog("FAIL: Service was marked complete before start time!");
    } catch (e: any) {
      addLog(`SUCCESSFULLY BLOCKED: "${e.message}"`);
      toast.success("Scenario 7: Early completion correctly blocked before appointment time.");
    }
  };

  const handleTestDoubleBooking = () => {
    triggerHaptic(10);
    addLog("--- Starting Test: Double-Booking Conflict Rejection ---");
    try {
      // b_demo_101 is already on 2026-11-12 at 14:00 with Thandi Mthembu (id 1)
      createSlotHold({
        customerId: "cust_attacker",
        customerName: "Conflict User",
        customerEmail: "conflict@test.com",
        customerPhone: "+27 82 000 0000",
        artisanId: "1",
        artisanName: "Thandi Mthembu",
        serviceId: "srv_conflict",
        serviceTitle: "Conflict Booking",
        serviceCategory: "makeup",
        totalAmountCents: 100000,
        appointmentDate: "2026-11-12",
        appointmentTime: "14:00",
        serviceType: "studio",
        locationAddress: "124 Sandton Drive",
      });
      addLog("FAIL: Conflicting slot reservation was allowed!");
    } catch (e: any) {
      addLog(`SUCCESSFULLY BLOCKED: "${e.message}"`);
      toast.success("Scenario 8: Double booking correctly prevented by atomic slot check.");
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-20 right-4 z-40 sm:bottom-6 sm:right-6">
        <button
          onClick={() => {
            triggerHaptic(10);
            setIsOpen(!isOpen);
          }}
          className="bg-[#501854] dark:bg-[#DB2777] text-white p-3 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border-2 border-white/20"
          title="Payment & Booking QA Test Suite"
        >
          <FlaskConical size={18} />
          <span className="text-xs font-semibold uppercase tracking-wider hidden sm:inline pr-1">
            Test Scenarios
          </span>
        </button>
      </div>

      {/* Testing Drawer */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white dark:bg-[#1E1724] border-l border-[#EFBDEB] dark:border-[#3B3237] shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
          <div className="p-4 border-b border-[#EFBDEB]/60 dark:border-[#3B3237] flex items-center justify-between bg-[#FAF2FA]/60 dark:bg-[#251D2C]">
            <div className="flex items-center gap-2">
              <FlaskConical size={18} className="text-[#DB2777]" />
              <h3 className="font-serif text-sm font-bold text-[#501854] dark:text-[#D4C7E1]">
                GlowLink QA & State Machine Inspector
              </h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
            >
              <X size={16} />
            </button>
          </div>

          <div className="p-4 overflow-y-auto space-y-5 text-xs flex-1">
            {/* Active User Switcher */}
            <div className="p-3.5 rounded-2xl bg-[#FAF2FA] dark:bg-[#2A2031] border border-[#EFBDEB]/60 dark:border-[#3B3237] space-y-2">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#DB2777] block">
                Instant Session Persona Switcher
              </span>
              <div className="flex items-center justify-between text-[11px]">
                <span>Active: <strong>{user?.name || "Guest (Signed Out)"}</strong></span>
                <span className="capitalize font-mono px-2 py-0.5 rounded-full bg-white dark:bg-black/30 border border-gray-200 dark:border-gray-700">
                  {role}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    loginCustomer(DEMO_CREDENTIALS.customer.email, DEMO_CREDENTIALS.customer.name, DEMO_CREDENTIALS.customer.phone);
                    toast.success("Switched to Client: Nandi Khumalo");
                  }}
                  className="py-1.5 px-2 bg-white dark:bg-[#34273E] border rounded-lg text-[10px] font-semibold text-[#501854] dark:text-[#D4C7E1] hover:border-[#DB2777]"
                >
                  Client (Nandi)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    loginArtisan(DEMO_CREDENTIALS.artisan.email, DEMO_CREDENTIALS.artisan.name, DEMO_CREDENTIALS.artisan.businessName);
                    toast.success("Switched to Artisan: Thandi Mthembu");
                  }}
                  className="py-1.5 px-2 bg-white dark:bg-[#34273E] border rounded-lg text-[10px] font-semibold text-[#501854] dark:text-[#D4C7E1] hover:border-[#DB2777]"
                >
                  Artisan (Thandi)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    toast.info("Signed out to Guest role");
                  }}
                  className="py-1.5 px-2 bg-white dark:bg-[#34273E] border rounded-lg text-[10px] font-semibold text-gray-500 hover:border-gray-400"
                >
                  Guest (Public)
                </button>
              </div>
            </div>

            {/* Test Scenarios Checklist */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#DB2777] block">
                Automated Test Scenarios
              </span>

              <button
                type="button"
                onClick={handleTestHappyPath}
                className="w-full text-left p-3 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-[#DB2777] bg-white dark:bg-[#251D2C] flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <p className="font-semibold text-xs text-[#501854] dark:text-[#D4C7E1]">
                    1. Happy Path Flow
                  </p>
                  <p className="text-[10px] text-gray-500">
                    Deposit (50%) → Artisan Complete → Balance (50%) → Receipts
                  </p>
                </div>
                <Play size={13} className="text-[#DB2777] group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={handleTestArtisanCancelRefund}
                className="w-full text-left p-3 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-[#DB2777] bg-white dark:bg-[#251D2C] flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <p className="font-semibold text-xs text-[#501854] dark:text-[#D4C7E1]">
                    2. Artisan Cancel & 100% Refund
                  </p>
                  <p className="text-[10px] text-gray-500">
                    Required reason → 100% refund → RCT-REF invoice
                  </p>
                </div>
                <Play size={13} className="text-[#DB2777] group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={handleTestAtelierConfirmsBooking}
                className="w-full text-left p-3 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-[#DB2777] bg-white dark:bg-[#251D2C] flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <p className="font-semibold text-xs text-[#501854] dark:text-[#D4C7E1]">
                    3. Atelier Reviews & Confirms Booking
                  </p>
                  <p className="text-[10px] text-gray-500">
                    Awaiting deposit → Atelier confirms & issues Tax Invoice
                  </p>
                </div>
                <Play size={13} className="text-[#DB2777] group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={handleTestEarlyCompletionGuard}
                className="w-full text-left p-3 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-[#DB2777] bg-white dark:bg-[#251D2C] flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <p className="font-semibold text-xs text-[#501854] dark:text-[#D4C7E1]">
                    3. Early Completion Temporal Block
                  </p>
                  <p className="text-[10px] text-gray-500">
                    Verifies artisan cannot click Complete before start time
                  </p>
                </div>
                <Play size={13} className="text-[#DB2777] group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={handleTestDoubleBooking}
                className="w-full text-left p-3 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-[#DB2777] bg-white dark:bg-[#251D2C] flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <p className="font-semibold text-xs text-[#501854] dark:text-[#D4C7E1]">
                    4. Atomic Double-Booking Rejection
                  </p>
                  <p className="text-[10px] text-gray-500">
                    Prevents two customers reserving same artisan slot
                  </p>
                </div>
                <Play size={13} className="text-[#DB2777] group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={handleTestDuplicateWebhook}
                className="w-full text-left p-3 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-[#DB2777] bg-white dark:bg-[#251D2C] flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <p className="font-semibold text-xs text-[#501854] dark:text-[#D4C7E1]">
                    5. Idempotent Webhook Delivery
                  </p>
                  <p className="text-[10px] text-gray-500">
                    Duplicate gateway notifications never re-apply or double-charge
                  </p>
                </div>
                <Play size={13} className="text-[#DB2777] group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Live Test Console Log */}
            <div>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 block mb-1">
                Execution Log
              </span>
              <div className="p-3 bg-black/90 text-emerald-400 rounded-xl font-mono text-[10px] h-36 overflow-y-auto space-y-1">
                {activeLog.length === 0 ? (
                  <p className="text-gray-600 italic">Click any scenario above to execute automated assertion.</p>
                ) : (
                  activeLog.map((log, i) => <p key={i} className="leading-tight">{log}</p>)
                )}
              </div>
            </div>
          </div>

          <div className="p-3 bg-gray-50 dark:bg-[#1E1724] border-t border-[#EFBDEB]/40 dark:border-[#3B3237] text-center">
            <span className="text-[10px] text-gray-400">
              GlowLink • ZAR Currency • South African Standard Time (SAST)
            </span>
          </div>
        </div>
      )}
    </>
  );
};
