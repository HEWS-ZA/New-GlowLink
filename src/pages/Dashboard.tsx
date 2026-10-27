import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Receipt as ReceiptIcon,
  Bell,
  Lock,
  Unlock,
  CreditCard,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  Phone,
  Mail,
  User,
  LayoutGrid,
  List,
  AlertCircle,
  Check,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/services/authStore";
import {
  getArtisanBookings,
  subscribeToEngineChanges,
  getAllReceipts,
  getUserNotifications,
  markNotificationAsRead,
  confirmBookingByArtisan,
} from "@/services/bookingEngine";
import { Booking, Receipt, Payment, NotificationItem, formatZAR } from "@/services/dataTypes";
import { triggerHaptic } from "@/services/haptics";
import { ArtisanAnalytics } from "@/components/artisan/ArtisanAnalytics";
import { ArtisanBookingDetailDrawer } from "@/components/artisan/ArtisanBookingDetailDrawer";
import { ReceiptModal } from "@/components/receipts/ReceiptModal";

type DashboardTab = "bookings" | "analytics" | "payments" | "clientele" | "notifications";
type BookingFilterType = "all" | "awaiting_deposit" | "confirmed" | "completed" | "refunded";

export const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = (searchParams.get("tab") as DashboardTab) || "bookings";

  const [activeTab, setActiveTab] = useState<DashboardTab>(tabParam);
  const [bookingsFilter, setBookingsFilter] = useState<BookingFilterType>("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);

  const { isAuthenticated, isResolved, user } = useAuth();

  const artisanId = user?.id || "1";

  const refreshArtisanData = () => {
    const list = getArtisanBookings(artisanId, user?.name);
    setBookings(list);
    setReceipts(getAllReceipts());
    setNotifications(getUserNotifications(artisanId));
  };

  useEffect(() => {
    if (tabParam && ["bookings", "analytics", "payments", "clientele", "notifications"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  useEffect(() => {
    refreshArtisanData();
    const unsubscribe = subscribeToEngineChanges(refreshArtisanData);
    return unsubscribe;
  }, [artisanId, user?.name]);

  if (!isResolved || !isAuthenticated) {
    return <div className="min-h-screen bg-white dark:bg-[#17111D]" />;
  }

  // Derive mock payments from confirmed bookings for financial ledger
  const payments: Payment[] = bookings
    .filter((b) => b.status !== "awaiting_deposit" && b.status !== "expired")
    .map((b) => ({
      id: `pay_${b.id}_dep`,
      bookingId: b.id,
      bookingReference: b.referenceCode,
      customerId: b.customerId,
      artisanId: b.artisanId,
      type: "deposit",
      amountCents: b.depositAmountCents,
      currency: "ZAR",
      status: "successful",
      gatewayProvider: "paystack",
      gatewayReference: `pstk_dep_${b.referenceCode}`,
      idempotencyKey: `idemp_${b.referenceCode}`,
      cardLast4: "4242",
      channel: "card",
      paidAt: b.createdAt,
      createdAt: b.createdAt,
    }));

  const pendingCount = bookings.filter((b) => b.status === "awaiting_deposit").length;
  const confirmedCount = bookings.filter((b) => b.status === "confirmed").length;
  const completedCount = bookings.filter((b) => b.status === "completed" || b.status === "paid_in_full").length;
  const refundedCount = bookings.filter((b) => b.status === "refunded" || b.status === "cancelled_by_artisan").length;

  const filteredBookings = bookings.filter((b) => {
    if (bookingsFilter === "awaiting_deposit") return b.status === "awaiting_deposit";
    if (bookingsFilter === "confirmed") return b.status === "confirmed";
    if (bookingsFilter === "completed") return b.status === "completed" || b.status === "paid_in_full";
    if (bookingsFilter === "refunded") return b.status === "refunded" || b.status === "cancelled_by_artisan";
    return true;
  });

  const handleQuickConfirmBooking = (e: React.MouseEvent, booking: Booking) => {
    e.stopPropagation();
    triggerHaptic(15);
    try {
      confirmBookingByArtisan(booking.id, artisanId);
      toast.success(
        `Reservation ${booking.referenceCode} confirmed! 50% deposit verified and official tax invoice issued to ${booking.customerName}.`
      );
      refreshArtisanData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to confirm booking";
      toast.error(msg);
    }
  };

  // Clientele list aggregated from bookings
  const clientsMap: Record<
    string,
    { name: string; email: string; phone: string; totalSpentCents: number; bookingsCount: number; lastDate: string }
  > = {};

  bookings.forEach((b) => {
    if (!clientsMap[b.customerEmail]) {
      clientsMap[b.customerEmail] = {
        name: b.customerName,
        email: b.customerEmail,
        phone: b.customerPhone,
        totalSpentCents: 0,
        bookingsCount: 0,
        lastDate: b.appointmentDate,
      };
    }
    clientsMap[b.customerEmail].bookingsCount += 1;
    if (b.status === "paid_in_full" || b.status === "completed") {
      clientsMap[b.customerEmail].totalSpentCents += b.totalAmountCents;
    } else if (b.status === "confirmed") {
      clientsMap[b.customerEmail].totalSpentCents += b.depositAmountCents;
    }
    if (b.appointmentDate > clientsMap[b.customerEmail].lastDate) {
      clientsMap[b.customerEmail].lastDate = b.appointmentDate;
    }
  });

  const clienteleList = Object.values(clientsMap);

  return (
    <div className="w-full">
      <section className="pt-24 sm:pt-28 md:pt-32 pb-24 md:pb-20 px-3.5 sm:px-6 md:px-12 border-b border-[#EFBDEB] dark:border-[#3B3237]">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-5">
            <div className="space-y-2 min-w-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF2FA] dark:bg-[#372E3E] border border-[#EFBDEB] dark:border-[#3B3237] shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#DB2777]" />
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#501854] dark:text-[#D4C7E1] font-semibold">
                  Master Atelier Console
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-serif text-[#501854] dark:text-[#D4C7E1] tracking-tight leading-tight">
                Atelier Schedule & <span className="italic font-normal text-[#DB2777]">Revenue</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#7E4882] dark:text-[#A695B8] font-light truncate max-w-xl">
                Connected artisan: <span className="font-semibold text-[#501854] dark:text-[#D4C7E1]">{user?.name || "Thandi Mthembu"}</span> • Atelier ID #{artisanId}
              </p>
            </div>

            {/* Atelier Status Badges */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
              <div className="px-3.5 py-2 rounded-2xl bg-[#FAF2FA] dark:bg-[#241C2B] border border-[#EFBDEB] dark:border-[#3B3237] flex items-center gap-2.5 shadow-2xs">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <div className="text-left">
                  <p className="text-[11px] font-semibold text-[#501854] dark:text-[#D4C7E1] leading-none">
                    Studio Active
                  </p>
                  <p className="text-[9px] uppercase tracking-wider text-[#7E4882] dark:text-[#A695B8] leading-tight mt-0.5">
                    Sandton Atelier
                  </p>
                </div>
              </div>

              <div className="px-3.5 py-2 rounded-2xl bg-[#FAF2FA] dark:bg-[#241C2B] border border-[#EFBDEB] dark:border-[#3B3237] flex items-center gap-2 text-xs text-[#501854] dark:text-[#D4C7E1] shadow-2xs">
                <Clock className="w-3.5 h-3.5 text-[#DB2777]" />
                <span className="text-[11px] font-medium">SAST Real-Time Sync</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 bg-[#FAF2FA] dark:bg-[#372E3E] p-1 rounded-full w-full sm:w-fit border border-[#EFBDEB] dark:border-[#3B3237] overflow-x-auto no-scrollbar">
            {[
              {
                id: "bookings",
                label: `Bookings (${bookings.length})`,
                badge: pendingCount > 0 ? `${pendingCount} Pending` : undefined,
              },
              { id: "analytics", label: "Analytics & Performance" },
              { id: "payments", label: "Payments & Ledger" },
              { id: "clientele", label: `Clientele (${clienteleList.length})` },
              {
                id: "notifications",
                label: `Notifications (${notifications.filter((n) => !n.read).length})`,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  triggerHaptic(8);
                  setActiveTab(tab.id as DashboardTab);
                  setSearchParams({ tab: tab.id });
                }}
                className={`whitespace-nowrap px-4 sm:px-6 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "bg-[#501854] dark:bg-[#DB2777] text-white shadow-xs"
                    : "text-[#7E4882] dark:text-[#A695B8] hover:text-[#501854] dark:hover:text-[#D4C7E1]"
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[9px] bg-amber-500 text-white px-2 py-0.5 rounded-full font-bold uppercase animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* TAB 1: Bookings & Roster */}
          {activeTab === "bookings" && (
            <div className="space-y-6">
              {/* Alert Banner for Pending Bookings requiring Confirmation */}
              {pendingCount > 0 && (
                <div className="p-4 sm:p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200 shrink-0">
                      <AlertCircle size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs sm:text-sm text-amber-950 dark:text-amber-100">
                        {pendingCount} Reservation{pendingCount > 1 ? "s" : ""} Awaiting Atelier Confirmation
                      </h4>
                      <p className="text-[11px] sm:text-xs text-amber-800 dark:text-amber-300">
                        Review the client details, location, and notes below and confirm appointments to officially secure slots.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic(8);
                      setBookingsFilter("awaiting_deposit");
                    }}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider shrink-0 cursor-pointer shadow-xs"
                  >
                    View Pending Only
                  </button>
                </div>
              )}

              {/* Controls Bar: Filter Pills + View Mode Toggle */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex gap-2 flex-wrap">
                  {[
                    { id: "all", label: `All (${bookings.length})` },
                    {
                      id: "awaiting_deposit",
                      label: `Awaiting Confirmation (${pendingCount})`,
                      highlight: pendingCount > 0,
                    },
                    { id: "confirmed", label: `Upcoming Confirmed (${confirmedCount})` },
                    { id: "completed", label: `Completed (${completedCount})` },
                    { id: "refunded", label: `Cancelled (${refundedCount})` },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => {
                        triggerHaptic(6);
                        setBookingsFilter(f.id as BookingFilterType);
                      }}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                        bookingsFilter === f.id
                          ? "bg-[#501854] dark:bg-[#DB2777] text-white shadow-xs"
                          : f.highlight
                          ? "bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200"
                          : "bg-white dark:bg-[#241C2B] border border-[#EFBDEB] dark:border-[#3B3237] text-[#7E4882] dark:text-[#A695B8] hover:border-[#DB2777]"
                      }`}
                    >
                      <span>{f.label}</span>
                    </button>
                  ))}
                </div>

                {/* View Mode Toggle: Cards vs Table */}
                <div className="flex items-center gap-1 bg-[#FAF2FA] dark:bg-[#2C2134] p-1 rounded-full border border-[#EFBDEB] dark:border-[#3B3237] self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic(6);
                      setViewMode("grid");
                    }}
                    className={`p-1.5 rounded-full transition-colors ${
                      viewMode === "grid"
                        ? "bg-[#501854] text-white dark:bg-[#DB2777]"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    title="Grid Cards View"
                  >
                    <LayoutGrid size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic(6);
                      setViewMode("table");
                    }}
                    className={`p-1.5 rounded-full transition-colors ${
                      viewMode === "table"
                        ? "bg-[#501854] text-white dark:bg-[#DB2777]"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    title="Operational Table View"
                  >
                    <List size={15} />
                  </button>
                </div>
              </div>

              {/* No Bookings Empty State */}
              {filteredBookings.length === 0 ? (
                <div className="text-center py-16 px-4 glass-panel rounded-3xl border border-[#EFBDEB] dark:border-[#3B3237]">
                  <Calendar className="w-10 h-10 text-[#8C3B8A] dark:text-[#A695B8] mx-auto mb-3 opacity-60" />
                  <h3 className="font-serif text-lg text-[#501854] dark:text-[#D4C7E1] mb-1">
                    No bookings found in this view
                  </h3>
                  <p className="text-xs text-[#7E4882] dark:text-[#A695B8] font-light max-w-sm mx-auto">
                    Reservations from clients browsing your atelier profile will appear here in real time.
                  </p>
                </div>
              ) : viewMode === "grid" ? (
                /* GRID CARDS VIEW */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredBookings.map((b) => {
                    const appointmentTimePassed =
                      new Date(`${b.appointmentDate}T${b.appointmentTime}:00`).getTime() <= Date.now();
                    const isPending = b.status === "awaiting_deposit";

                    return (
                      <div
                        key={b.id}
                        onClick={() => {
                          triggerHaptic(8);
                          setSelectedBooking(b);
                        }}
                        className={`p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#241C2B] border transition-all shadow-xs hover:border-[#DB2777] flex flex-col justify-between space-y-4 cursor-pointer ${
                          isPending
                            ? "border-amber-300 dark:border-amber-800 ring-2 ring-amber-400/20"
                            : "border-[#EFBDEB] dark:border-[#3B3237]"
                        }`}
                      >
                        <div>
                          {/* Reference Code & Status Badge */}
                          <div className="flex justify-between items-center pb-2.5 border-b border-[#EFBDEB]/60 dark:border-[#3B3237] mb-3">
                            <span className="font-mono text-xs font-bold text-[#DB2777]">
                              {b.referenceCode}
                            </span>
                            <span
                              className={`text-[9px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full ${
                                b.status === "confirmed"
                                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200"
                                  : isPending
                                  ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-200 border border-amber-300 font-bold"
                                  : b.status === "completed"
                                  ? "bg-pink-50 text-[#DB2777] dark:bg-pink-950/40 dark:text-pink-300 border border-pink-200"
                                  : b.status === "paid_in_full"
                                  ? "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200"
                                  : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-200"
                              }`}
                            >
                              {b.status.replace(/_/g, " ")}
                            </span>
                          </div>

                          <h3 className="font-serif text-lg font-bold text-[#501854] dark:text-[#D4C7E1]">
                            {b.serviceTitle}
                          </h3>

                          {/* Client Contact Info */}
                          <div className="mt-2 p-2.5 rounded-xl bg-gray-50/80 dark:bg-[#2C2134] text-xs space-y-1">
                            <div className="flex items-center gap-1.5 font-semibold text-[#501854] dark:text-[#D4C7E1]">
                              <User size={13} className="text-[#DB2777]" />
                              <span>{b.customerName}</span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-[#7E4882] dark:text-[#A695B8]">
                              <span className="truncate">{b.customerPhone}</span>
                              <span className="truncate max-w-[140px]">{b.customerEmail}</span>
                            </div>
                          </div>

                          {/* Date, Time & Setting */}
                          <div className="mt-3 space-y-1.5 text-xs text-[#7E4882] dark:text-[#A695B8]">
                            <div className="flex items-center gap-1.5 font-medium">
                              <Calendar size={13} className="text-[#DB2777]" />
                              <span>{b.appointmentDate} at {b.appointmentTime} ({b.endEstimatedTime})</span>
                            </div>
                            <div className="flex items-start gap-1.5">
                              <MapPin size={13} className="text-[#DB2777] shrink-0 mt-0.5" />
                              <span className="truncate">{b.locationAddress}</span>
                            </div>
                          </div>

                          {/* Notes Preview if available */}
                          {b.notes && (
                            <p className="mt-2.5 text-[11px] italic text-gray-500 line-clamp-1 border-l-2 border-[#DB2777] pl-2">
                              "{b.notes}"
                            </p>
                          )}

                          {/* Financial Snapshot */}
                          <div className="mt-3 p-3 rounded-2xl bg-[#FAF2FA] dark:bg-[#34273E] text-xs space-y-1">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Deposit (50%):</span>
                              <span className={`font-mono font-semibold ${isPending ? "text-amber-600" : "text-emerald-600 dark:text-emerald-400"}`}>
                                {formatZAR(b.depositAmountCents)} ({isPending ? "Pending" : "Verified"})
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Remaining Balance:</span>
                              <span className="font-mono font-semibold text-[#501854] dark:text-[#D4C7E1]">
                                {formatZAR(b.balanceAmountCents)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Card Actions Footer */}
                        <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2">
                          {isPending ? (
                            <button
                              type="button"
                              onClick={(e) => handleQuickConfirmBooking(e, b)}
                              className="w-full bg-[#501854] dark:bg-[#DB2777] text-white py-2 rounded-xl text-xs font-semibold uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <CheckCircle2 size={13} />
                              <span>Confirm Booking & Deposit</span>
                            </button>
                          ) : (
                            <div className="flex items-center justify-between w-full text-xs text-[#DB2777] font-semibold">
                              <span>
                                {b.status === "confirmed" && appointmentTimePassed
                                  ? "Ready to Mark Complete"
                                  : b.status === "confirmed"
                                  ? "Scheduled & Confirmed"
                                  : b.status === "completed"
                                  ? "Balance Unlocked for Client"
                                  : "View Details"}
                              </span>
                              <ChevronRight size={14} />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* TABLE OPERATIONAL VIEW */
                <div className="bg-white dark:bg-[#241C2B] rounded-3xl border border-[#EFBDEB] dark:border-[#3B3237] overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[#FAF2FA] dark:bg-[#2C2134] text-[10px] uppercase tracking-wider text-[#7E4882] dark:text-[#A695B8] border-b border-[#EFBDEB] dark:border-[#3B3237]">
                        <tr>
                          <th className="py-3.5 px-4 font-semibold">Ref Code</th>
                          <th className="py-3.5 px-4 font-semibold">Client</th>
                          <th className="py-3.5 px-4 font-semibold">Treatment</th>
                          <th className="py-3.5 px-4 font-semibold">Date & Time</th>
                          <th className="py-3.5 px-4 font-semibold">Setting / Location</th>
                          <th className="py-3.5 px-4 font-semibold">Deposit</th>
                          <th className="py-3.5 px-4 font-semibold">Status</th>
                          <th className="py-3.5 px-4 text-right font-semibold">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {filteredBookings.map((b) => (
                          <tr
                            key={b.id}
                            onClick={() => {
                              triggerHaptic(8);
                              setSelectedBooking(b);
                            }}
                            className="hover:bg-gray-50/70 dark:hover:bg-[#34273E]/40 transition-colors cursor-pointer"
                          >
                            <td className="py-3.5 px-4 font-mono font-bold text-[#DB2777]">
                              {b.referenceCode}
                            </td>
                            <td className="py-3.5 px-4">
                              <p className="font-semibold">{b.customerName}</p>
                              <p className="text-[11px] text-gray-500">{b.customerPhone}</p>
                            </td>
                            <td className="py-3.5 px-4 font-medium">{b.serviceTitle}</td>
                            <td className="py-3.5 px-4">
                              <p className="font-semibold">{b.appointmentDate}</p>
                              <p className="text-[11px] text-gray-500">{b.appointmentTime} SAST</p>
                            </td>
                            <td className="py-3.5 px-4 truncate max-w-[180px]">
                              {b.serviceType === "studio" ? "Studio Atelier" : "Mobile House Call"}
                              <span className="block text-[10px] text-gray-400 truncate">{b.locationAddress}</span>
                            </td>
                            <td className="py-3.5 px-4 font-mono font-bold">
                              {formatZAR(b.depositAmountCents)}
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold ${
                                  b.status === "confirmed"
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : b.status === "awaiting_deposit"
                                    ? "bg-amber-100 text-amber-800 border border-amber-300 font-bold"
                                    : b.status === "completed"
                                    ? "bg-pink-50 text-[#DB2777] border border-pink-200"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {b.status.replace(/_/g, " ")}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              {b.status === "awaiting_deposit" ? (
                                <button
                                  type="button"
                                  onClick={(e) => handleQuickConfirmBooking(e, b)}
                                  className="bg-[#501854] dark:bg-[#DB2777] text-white px-3 py-1 rounded-full text-[11px] font-semibold hover:opacity-90 shadow-2xs"
                                >
                                  Confirm
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedBooking(b);
                                  }}
                                  className="text-[#DB2777] hover:underline font-semibold text-xs inline-flex items-center gap-1"
                                >
                                  <Eye size={13} />
                                  <span>Details</span>
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Analytics & Performance */}
          {activeTab === "analytics" && (
            <ArtisanAnalytics bookings={bookings} payments={payments} />
          )}

          {/* TAB 3: Payments & Ledger */}
          {activeTab === "payments" && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-[#241C2B] rounded-3xl border border-[#EFBDEB] dark:border-[#3B3237] p-6 shadow-xs">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#501854] dark:text-[#D4C7E1]">
                      Verified Atelier Payments
                    </h3>
                    <p className="text-xs text-[#7E4882] dark:text-[#A695B8] mt-0.5">
                      Itemized breakdown of deposits collected, balances settled, and issued receipts.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 text-xs font-mono font-bold">
                    Paystack Subaccount Connected
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-[#FAF2FA] dark:bg-[#2E2436] text-[10px] uppercase tracking-wider text-[#7E4882] dark:text-[#A695B8] border-b border-[#EFBDEB] dark:border-[#3B3237]">
                      <tr>
                        <th className="py-3 px-4 text-left font-semibold">Ref Code</th>
                        <th className="py-3 px-4 text-left font-semibold">Client Name</th>
                        <th className="py-3 px-4 text-left font-semibold">Payment Type</th>
                        <th className="py-3 px-4 text-left font-semibold">Gateway Ref</th>
                        <th className="py-3 px-4 text-right font-semibold">Amount (ZAR)</th>
                        <th className="py-3 px-4 text-center font-semibold">Receipt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {receipts.map((r) => (
                        <tr key={r.id} className="hover:bg-gray-50/50 dark:hover:bg-[#34273E]/30 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-[#DB2777]">
                            {r.bookingReference}
                          </td>
                          <td className="py-3.5 px-4 font-medium">{r.customerName}</td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold ${
                                r.type === "refund"
                                  ? "bg-amber-100 text-amber-800"
                                  : r.type === "deposit"
                                  ? "bg-pink-100 text-pink-800"
                                  : "bg-emerald-100 text-emerald-800"
                              }`}
                            >
                              {r.type}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px] text-gray-500">
                            pstk_trx_{r.bookingReference.toLowerCase()}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono font-bold">
                            {r.type === "refund" ? `-${formatZAR(r.amountCents)}` : formatZAR(r.amountCents)}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => {
                                triggerHaptic(8);
                                setSelectedReceipt(r);
                              }}
                              className="inline-flex items-center gap-1 text-[11px] text-[#DB2777] hover:underline font-semibold cursor-pointer"
                            >
                              <ReceiptIcon size={13} />
                              <span>{r.receiptNumber}</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Clientele CRM */}
          {activeTab === "clientele" && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-[#241C2B] rounded-3xl border border-[#EFBDEB] dark:border-[#3B3237] p-6 shadow-xs">
                <h3 className="font-serif text-xl font-bold text-[#501854] dark:text-[#D4C7E1] mb-1">
                  Atelier Clientele Directory
                </h3>
                <p className="text-xs text-[#7E4882] dark:text-[#A695B8] mb-6">
                  VIP clients who have reserved treatments at your atelier.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {clienteleList.map((client) => (
                    <div
                      key={client.email}
                      className="p-5 rounded-2xl bg-[#FAF2FA] dark:bg-[#2C2134] border border-[#EFBDEB]/60 dark:border-[#3B3237] space-y-2.5 text-xs"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-sm text-[#501854] dark:text-[#D4C7E1]">
                            {client.name}
                          </h4>
                          <p className="text-[11px] text-[#7E4882] dark:text-[#A695B8] truncate">
                            {client.email}
                          </p>
                        </div>
                        <span className="text-[10px] bg-white dark:bg-[#3E3048] px-2 py-0.5 rounded-full font-bold text-[#DB2777]">
                          {client.bookingsCount} {client.bookingsCount === 1 ? "Session" : "Sessions"}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-gray-200/60 dark:border-gray-700/60 flex justify-between text-gray-500">
                        <span>Total Paid:</span>
                        <span className="font-mono font-bold text-[#501854] dark:text-[#D4C7E1]">
                          {formatZAR(client.totalSpentCents)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Notifications */}
          {activeTab === "notifications" && (
            <div className="space-y-4 max-w-3xl">
              <h3 className="font-serif text-xl font-bold text-[#501854] dark:text-[#D4C7E1]">
                Recent Atelier Notifications
              </h3>
              {notifications.length === 0 ? (
                <div className="p-8 text-center glass-panel rounded-3xl text-xs text-gray-400">
                  No notifications recorded yet.
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      triggerHaptic(6);
                      markNotificationAsRead(n.id);
                      refreshArtisanData();
                    }}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-start gap-3.5 cursor-pointer ${
                      n.read
                        ? "bg-white/60 dark:bg-[#241C2B]/60 border-gray-200 dark:border-gray-800 opacity-70"
                        : "bg-white dark:bg-[#241C2B] border-[#EFBDEB] dark:border-[#3B3237] shadow-xs"
                    }`}
                  >
                    <div className="p-2.5 rounded-xl bg-pink-50 text-[#DB2777] dark:bg-pink-950/40 shrink-0">
                      <Bell size={16} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-semibold text-xs text-[#501854] dark:text-[#D4C7E1]">
                        {n.title}
                      </h4>
                      <p className="text-xs text-[#7E4882] dark:text-[#A695B8] leading-relaxed">
                        {n.message}
                      </p>
                      <span className="text-[10px] text-gray-400 block pt-1">
                        {new Date(n.createdAt).toLocaleDateString("en-ZA", {
                          hour: "2-digit",
                          minute: "2-digit",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </section>

      {/* Booking Detail Drawer with Full Dossier & Confirm / Complete / Cancel Controls */}
      <ArtisanBookingDetailDrawer
        booking={selectedBooking}
        isOpen={!!selectedBooking}
        artisanId={artisanId}
        onClose={() => setSelectedBooking(null)}
        onBookingUpdated={() => {
          setSelectedBooking(null);
          refreshArtisanData();
        }}
      />

      {/* Receipt Modal */}
      <ReceiptModal
        receipt={selectedReceipt}
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />
    </div>
  );
};

export default Dashboard;
