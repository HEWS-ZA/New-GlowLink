import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import {
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  Sparkles,
  CheckCircle,
  XCircle,
  MapPin,
  Clock,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import {
  getStoredBookings,
  updateBookingStatus,
  getStoredCustomers,
  Booking,
  CustomerRecord,
} from "@/services/bookingStore";
import { useAuth } from "@/services/authStore";
import { triggerHaptic } from "@/services/haptics";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "customers">("overview");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const { isAuthenticated, isResolved, user } = useAuth();

  // Route protection: if auth resolves to false (or if user signs out in another tab/nav), redirect immediately
  useEffect(() => {
    if (isResolved && !isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isResolved, isAuthenticated, navigate]);

  useEffect(() => {
    setBookings(getStoredBookings());
    setCustomers(getStoredCustomers());
  }, []);

  const handleStatusChange = (id: string, newStatus: Booking["status"]) => {
    triggerHaptic(10);
    updateBookingStatus(id, newStatus);
    setBookings(getStoredBookings());
    toast.success(`Booking status updated to ${newStatus}`);
  };

  const upcomingCount = bookings.filter((b) => b.status === "Confirmed" || b.status === "Pending").length;
  const totalRevenue = bookings
    .filter((b) => b.status === "Confirmed" || b.status === "Completed")
    .reduce((sum, b) => {
      const num = parseInt(b.servicePrice.replace(/[^\d]/g, ""), 10) || 0;
      return sum + num;
    }, 18500);

  const stats = [
    { icon: Calendar, label: "Upcoming Bookings", value: `${upcomingCount}`, color: "text-[#501854] dark:text-[#D4C7E1]" },
    { icon: DollarSign, label: "Calculated Revenue", value: `R${totalRevenue.toLocaleString()}`, color: "text-[#DB2777]" },
    { icon: Users, label: "Total Clientele", value: `${customers.length}`, color: "text-[#501854] dark:text-[#D4C7E1]" },
    { icon: TrendingUp, label: "Atelier Views", value: "2,340", color: "text-[#8C3B8A] dark:text-[#DB2777]" },
  ];

  if (!isResolved || !isAuthenticated) {
    return <div className="min-h-screen bg-white dark:bg-[#17111D]" />;
  }

  return (
    <div className="bg-white dark:bg-[#17111D] text-[#501854] dark:text-[#D4C7E1] min-h-screen selection:bg-[#DB2777] selection:text-white transition-colors duration-300">
      <Header />

      <section className="pt-24 sm:pt-32 md:pt-36 pb-24 md:pb-20 px-3.5 sm:px-6 md:px-12 border-b border-[#EFBDEB] dark:border-[#3B3237]">
        <div className="max-w-7xl mx-auto">
          {/* Rebalanced Header (Removed duplicate Sign Out; intentional balanced layout) */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-5 mb-8 sm:mb-10">
            <div className="space-y-2 min-w-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF2FA] dark:bg-[#372E3E] border border-[#EFBDEB] dark:border-[#3B3237] shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#DB2777]" />
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#501854] dark:text-[#D4C7E1] font-semibold">
                  Master Atelier Console
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-serif text-[#501854] dark:text-[#D4C7E1] tracking-tight leading-tight">
                Atelier Schedule & <span className="italic font-normal text-[#DB2777]">Clientele</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#7E4882] dark:text-[#A695B8] font-light truncate max-w-xl">
                Connected artisan: <span className="font-semibold text-[#501854] dark:text-[#D4C7E1]">{user?.name || "Thandi Mthembu (Master Stylist)"}</span>
              </p>
            </div>

            {/* Rebalanced Atelier Status Card (replaces removed sign out button) */}
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
                    Johannesburg Hub
                  </p>
                </div>
              </div>

              <div className="px-3.5 py-2 rounded-2xl bg-[#FAF2FA] dark:bg-[#241C2B] border border-[#EFBDEB] dark:border-[#3B3237] flex items-center gap-2 text-xs text-[#501854] dark:text-[#D4C7E1] shadow-2xs">
                <Clock className="w-3.5 h-3.5 text-[#DB2777]" />
                <span className="text-[11px] font-medium">Real-Time Sync</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs (Smooth touch scrolling, no overflow) */}
          <div className="flex gap-2 mb-6 sm:mb-8 bg-[#FAF2FA] dark:bg-[#372E3E] p-1 rounded-full w-full sm:w-fit border border-[#EFBDEB] dark:border-[#3B3237] overflow-x-auto no-scrollbar">
            <button
              onClick={() => {
                triggerHaptic(8);
                setActiveTab("overview");
              }}
              className={`flex-1 sm:flex-initial whitespace-nowrap px-4 sm:px-6 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold transition-all min-h-[44px] flex items-center justify-center ${
                activeTab === "overview"
                  ? "bg-[#501854] dark:bg-[#DB2777] text-white shadow-xs"
                  : "text-[#7E4882] dark:text-[#A695B8] hover:text-[#501854] dark:hover:text-[#D4C7E1]"
              }`}
            >
              Atelier Overview
            </button>
            <button
              onClick={() => {
                triggerHaptic(8);
                setActiveTab("customers");
              }}
              className={`flex-1 sm:flex-initial whitespace-nowrap px-4 sm:px-6 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold transition-all min-h-[44px] flex items-center justify-center ${
                activeTab === "customers"
                  ? "bg-[#501854] dark:bg-[#DB2777] text-white shadow-xs"
                  : "text-[#7E4882] dark:text-[#A695B8] hover:text-[#501854] dark:hover:text-[#D4C7E1]"
              }`}
            >
              Clientele ({customers.length})
            </button>
          </div>

          {activeTab === "overview" && (
            <div className="space-y-6 sm:space-y-10 animate-in fade-in duration-300">
              {/* Stats Grid - 1 col on tiny mobile (320/360), 2 col on sm, 4 col on lg */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
                {stats.map((s, idx) => (
                  <div key={idx} className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#241C2B] border border-[#EFBDEB] dark:border-[#3B3237] shadow-2xs flex sm:block items-center justify-between">
                    <div className="flex items-center justify-between mb-0 sm:mb-3">
                      <span className="text-[11px] sm:text-xs uppercase tracking-wider text-[#7E4882] dark:text-[#A695B8] font-medium line-clamp-1">{s.label}</span>
                      <s.icon size={16} className="hidden sm:block text-[#8C3B8A] dark:text-[#A695B8] shrink-0" />
                    </div>
                    <div className={`font-serif text-2xl sm:text-3xl font-medium ${s.color}`}>
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bookings Card Container */}
              <div className="bg-white dark:bg-[#241C2B] rounded-2xl sm:rounded-3xl border border-[#EFBDEB] dark:border-[#3B3237] p-4 sm:p-6 md:p-8 shadow-xs">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#DB2777] block mb-0.5 font-semibold">
                      Live Schedule
                    </span>
                    <h2 className="font-serif text-xl sm:text-2xl text-[#501854] dark:text-[#D4C7E1]">Appointments Roster</h2>
                  </div>
                  <span className="text-xs text-[#7E4882] dark:text-[#A695B8] font-light">
                    {bookings.length} reservations
                  </span>
                </div>

                {/* Mobile Card List View (< md) - Labelled, tappable buttons with 44px touch targets */}
                <div className="md:hidden space-y-3.5">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="p-4 rounded-2xl bg-[#FAF2FA] dark:bg-[#372E3E] border border-[#EFBDEB] dark:border-[#3B3237] space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-sm text-[#501854] dark:text-[#D4C7E1] truncate">{booking.clientName}</h4>
                          <p className="text-xs text-[#7E4882] dark:text-[#A695B8] font-light truncate">{booking.serviceName}</p>
                          <span className="font-serif font-medium text-xs text-[#501854] dark:text-[#D4C7E1]">{booking.servicePrice}</span>
                        </div>
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold shrink-0 ${
                            booking.status === "Confirmed"
                              ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800"
                              : booking.status === "Pending"
                              ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800"
                              : booking.status === "Completed"
                              ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-800"
                              : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-300"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-[#7E4882] dark:text-[#A695B8] pt-1 border-t border-[#EFBDEB]/60 dark:border-[#3B3237]">
                        <Calendar size={13} className="text-[#DB2777] shrink-0" />
                        <span className="truncate">{booking.date} • {booking.time}</span>
                      </div>

                      {/* Labelled, Touch-Friendly Action Buttons (>= 44px min-h touch target) */}
                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#EFBDEB]/60 dark:border-[#3B3237]">
                        {booking.status !== "Confirmed" && booking.status !== "Cancelled" && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(booking.id, "Confirmed")}
                            className="flex-1 min-h-[44px] px-3 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all active:scale-95 shadow-xs flex items-center justify-center gap-1.5"
                            aria-label={`Confirm booking for ${booking.clientName}`}
                          >
                            <CheckCircle size={14} />
                            <span>Confirm</span>
                          </button>
                        )}
                        {booking.status === "Confirmed" && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(booking.id, "Completed")}
                            className="flex-1 min-h-[44px] px-3 py-2 text-xs font-semibold bg-[#501854] dark:bg-[#DB2777] hover:opacity-90 rounded-xl text-white active:scale-95 flex items-center justify-center gap-1.5 shadow-xs"
                            aria-label={`Mark completed for ${booking.clientName}`}
                          >
                            <CheckCircle size={14} />
                            <span>Complete</span>
                          </button>
                        )}
                        {booking.status !== "Cancelled" && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(booking.id, "Cancelled")}
                            className="min-h-[44px] px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-900/60 transition-colors flex items-center justify-center gap-1.5 active:scale-95"
                            aria-label={`Cancel booking for ${booking.clientName}`}
                          >
                            <XCircle size={14} />
                            <span>Cancel</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View (>= md) */}
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-[#EFBDEB] dark:border-[#3B3237]">
                        <TableHead className="text-[#501854] dark:text-[#D4C7E1]">Client</TableHead>
                        <TableHead className="text-[#501854] dark:text-[#D4C7E1]">Service</TableHead>
                        <TableHead className="text-[#501854] dark:text-[#D4C7E1]">Date & Time</TableHead>
                        <TableHead className="text-[#501854] dark:text-[#D4C7E1]">Status</TableHead>
                        <TableHead className="text-right text-[#501854] dark:text-[#D4C7E1]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.map((booking) => (
                        <TableRow key={booking.id} className="border-b border-[#EFBDEB]/60 dark:border-[#3B3237]/60">
                          <TableCell className="font-medium text-[#501854] dark:text-[#D4C7E1]">
                            <div className="truncate max-w-[180px]">{booking.clientName}</div>
                            <div className="text-[11px] text-[#7E4882] dark:text-[#A695B8] font-light truncate max-w-[180px]">{booking.clientEmail}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-[#501854] dark:text-[#D4C7E1] truncate max-w-[180px]">{booking.serviceName}</div>
                            <div className="text-[11px] font-serif text-[#DB2777]">{booking.servicePrice}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5 text-[#501854] dark:text-[#D4C7E1]">
                              <Calendar size={13} className="text-[#DB2777] shrink-0" />
                              <span className="whitespace-nowrap">{booking.date}</span>
                            </div>
                            <div className="text-[11px] text-[#7E4882] dark:text-[#A695B8]">{booking.time}</div>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold whitespace-nowrap ${
                                booking.status === "Confirmed"
                                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800"
                                  : booking.status === "Pending"
                                  ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800"
                                  : booking.status === "Completed"
                                  ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-800"
                                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-300"
                              }`}
                            >
                              {booking.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              {booking.status !== "Confirmed" && booking.status !== "Cancelled" && (
                                <button
                                  type="button"
                                  onClick={() => handleStatusChange(booking.id, "Confirmed")}
                                  className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition-colors flex items-center gap-1 shadow-2xs"
                                  title="Confirm appointment"
                                >
                                  <CheckCircle size={14} />
                                  <span>Confirm</span>
                                </button>
                              )}
                              {booking.status === "Confirmed" && (
                                <button
                                  type="button"
                                  onClick={() => handleStatusChange(booking.id, "Completed")}
                                  className="px-3 py-1.5 text-xs font-medium bg-[#501854] dark:bg-[#DB2777] text-white hover:opacity-90 rounded-full transition-colors flex items-center gap-1"
                                >
                                  <CheckCircle size={14} />
                                  <span>Mark Done</span>
                                </button>
                              )}
                              {booking.status !== "Cancelled" && (
                                <button
                                  type="button"
                                  onClick={() => handleStatusChange(booking.id, "Cancelled")}
                                  className="px-3 py-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-full transition-colors flex items-center gap-1"
                                  title="Cancel appointment"
                                >
                                  <XCircle size={14} />
                                  <span>Cancel</span>
                                </button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "customers" && (
            <div className="bg-white dark:bg-[#241C2B] rounded-2xl sm:rounded-3xl border border-[#EFBDEB] dark:border-[#3B3237] p-4 sm:p-6 md:p-8 shadow-xs animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#DB2777] block mb-0.5 font-semibold">
                    Atelier CRM
                  </span>
                  <h2 className="font-serif text-xl sm:text-2xl text-[#501854] dark:text-[#D4C7E1]">Clientele Directory</h2>
                </div>
                <span className="text-xs text-[#7E4882] dark:text-[#A695B8] font-light">
                  {customers.length} high-value clients
                </span>
              </div>

              {/* Mobile Card List View (< md) */}
              <div className="md:hidden space-y-3">
                {customers.map((c) => (
                  <div key={c.id} className="p-4 rounded-2xl bg-[#FAF2FA] dark:bg-[#372E3E] border border-[#EFBDEB] dark:border-[#3B3237] space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-sm text-[#501854] dark:text-[#D4C7E1] truncate">{c.name}</h4>
                        <p className="text-xs text-[#7E4882] dark:text-[#A695B8] truncate">{c.location}</p>
                        <p className="text-[11px] text-[#8C3B8A] dark:text-[#A695B8] truncate">{c.email}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-serif font-semibold text-sm text-[#DB2777] block">{c.totalSpent}</span>
                        <span className="text-[10px] text-[#7E4882] dark:text-[#A695B8]">{c.totalBookings} sessions</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 pt-1.5 border-t border-[#EFBDEB]/60 dark:border-[#3B3237]">
                      {c.services.map((svc, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-full bg-white dark:bg-[#241C2B] text-[10px] text-[#501854] dark:text-[#D4C7E1] border border-[#EFBDEB] dark:border-[#3B3237]">
                          {svc}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View (>= md) */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-[#EFBDEB] dark:border-[#3B3237]">
                      <TableHead className="text-[#501854] dark:text-[#D4C7E1]">Client Name</TableHead>
                      <TableHead className="text-[#501854] dark:text-[#D4C7E1]">Contact</TableHead>
                      <TableHead className="text-[#501854] dark:text-[#D4C7E1]">Location</TableHead>
                      <TableHead className="text-[#501854] dark:text-[#D4C7E1]">Total Sessions</TableHead>
                      <TableHead className="text-[#501854] dark:text-[#D4C7E1]">Total Spent</TableHead>
                      <TableHead className="text-[#501854] dark:text-[#D4C7E1]">Last Visit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map((c) => (
                      <TableRow key={c.id} className="border-b border-[#EFBDEB]/60 dark:border-[#3B3237]/60">
                        <TableCell className="font-medium text-[#501854] dark:text-[#D4C7E1]">
                          <span className="truncate max-w-[180px] block">{c.name}</span>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs text-[#501854] dark:text-[#D4C7E1] truncate max-w-[180px]">{c.email}</div>
                          <div className="text-[11px] text-[#7E4882] dark:text-[#A695B8] font-light">{c.phone}</div>
                        </TableCell>
                        <TableCell className="text-xs text-[#7E4882] dark:text-[#A695B8]">
                          {c.location}
                        </TableCell>
                        <TableCell className="text-xs font-semibold text-[#501854] dark:text-[#D4C7E1]">
                          {c.totalBookings}
                        </TableCell>
                        <TableCell className="text-xs font-serif font-medium text-[#DB2777]">
                          {c.totalSpent}
                        </TableCell>
                        <TableCell className="text-xs text-[#7E4882] dark:text-[#A695B8]">
                          {c.lastVisit}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </section>

      <ScrollToTop />
      <Footer />
    </div>
  );
};

export default Dashboard;
