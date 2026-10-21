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
  LogOut,
  Sparkles,
  CheckCircle,
  XCircle,
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
  cancelBooking,
  getStoredCustomers,
  Booking,
  CustomerRecord,
} from "@/services/bookingStore";
import { getAuthState, logoutArtisan } from "@/services/authStore";
import { triggerHaptic } from "@/services/haptics";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "customers">("overview");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const { user } = getAuthState();

  useEffect(() => {
    // If not authenticated in session, set demo session for instant viewing
    const auth = getAuthState();
    if (!auth.isAuthenticated) {
      // Allow demo viewing or let user sign in
    }
    setBookings(getStoredBookings());
    setCustomers(getStoredCustomers());
  }, []);

  const handleLogout = () => {
    triggerHaptic(12);
    logoutArtisan();
    toast.success("Successfully logged out from Atelier Console.");
    navigate("/login");
  };

  const handleStatusChange = (id: string, newStatus: Booking["status"]) => {
    triggerHaptic(10);
    updateBookingStatus(id, newStatus);
    setBookings(getStoredBookings());
    toast.success(`Booking status changed to ${newStatus}`);
  };

  // Dynamic calculations
  const upcomingCount = bookings.filter((b) => b.status === "Confirmed" || b.status === "Pending").length;
  const totalRevenue = bookings
    .filter((b) => b.status === "Confirmed" || b.status === "Completed")
    .reduce((sum, b) => {
      const num = parseInt(b.servicePrice.replace(/[^\d]/g, ""), 10) || 0;
      return sum + num;
    }, 18500);

  const stats = [
    { icon: Calendar, label: "Upcoming Appointments", value: `${upcomingCount}`, color: "text-neutral-900" },
    { icon: DollarSign, label: "Calculated Revenue", value: `R${totalRevenue.toLocaleString()}`, color: "text-emerald-600" },
    { icon: Users, label: "Total Clientele", value: `${customers.length}`, color: "text-neutral-900" },
    { icon: TrendingUp, label: "Atelier Profile Views", value: "2,340", color: "text-amber-600" },
  ];

  return (
    <div className="bg-[#FAF8F5] text-neutral-900 min-h-screen selection:bg-neutral-900 selection:text-white">
      <Header />

      <section className="pt-36 pb-20 px-6 md:px-12 border-b border-neutral-200/70">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-neutral-200/80 shadow-xs mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-xs uppercase tracking-[0.2em] text-neutral-600 font-semibold">
                  Artisan Console
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-serif text-neutral-950 tracking-tight">
                Master Atelier <span className="italic font-normal">Dashboard</span>
              </h1>
              <p className="text-xs text-neutral-500 mt-1">
                Connected as <span className="font-semibold text-neutral-900">{user?.name || "Thandi Mthembu (Master Artisan)"}</span>
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 border border-neutral-300 text-neutral-700 hover:text-neutral-950 px-4 py-2 rounded-full text-xs uppercase tracking-widest font-semibold transition-all bg-white hover:bg-neutral-50 shadow-2xs active:scale-95"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2.5 mb-10 bg-neutral-200/60 p-1.5 rounded-full w-full sm:w-fit overflow-x-auto no-scrollbar">
            <button
              onClick={() => {
                triggerHaptic(8);
                setActiveTab("overview");
              }}
              className={`whitespace-nowrap px-6 py-2 rounded-full text-xs uppercase tracking-widest font-semibold transition-all ${
                activeTab === "overview"
                  ? "bg-white text-neutral-950 shadow-xs"
                  : "text-neutral-600 hover:text-neutral-950"
              }`}
            >
              Atelier Overview
            </button>
            <button
              onClick={() => {
                triggerHaptic(8);
                setActiveTab("customers");
              }}
              className={`whitespace-nowrap px-6 py-2 rounded-full text-xs uppercase tracking-widest font-semibold transition-all ${
                activeTab === "customers"
                  ? "bg-white text-neutral-950 shadow-xs"
                  : "text-neutral-600 hover:text-neutral-950"
              }`}
            >
              Clientele CRM ({customers.length})
            </button>
          </div>

          {activeTab === "overview" && (
            <div className="space-y-12 animate-in fade-in duration-300">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {stats.map((s, idx) => (
                  <div key={idx} className="p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-2xs">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs uppercase tracking-wider text-neutral-500 font-medium">{s.label}</span>
                      <s.icon size={18} className="text-neutral-400" />
                    </div>
                    <div className={`font-serif text-3xl font-medium ${s.color}`}>
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bookings Table */}
              <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 md:p-8 shadow-xs">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-1 font-semibold">
                      Live Schedule
                    </span>
                    <h2 className="font-serif text-2xl text-neutral-950">Appointments Roster</h2>
                  </div>
                  <span className="text-xs text-neutral-500 font-light">
                    {bookings.length} reservations on file
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium text-neutral-950">
                            <div>{booking.clientName}</div>
                            <div className="text-[11px] text-neutral-400 font-light">{booking.clientEmail}</div>
                          </TableCell>
                          <TableCell>
                            <div>{booking.serviceName}</div>
                            <div className="text-[11px] font-serif text-neutral-600">{booking.servicePrice}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              <Calendar size={13} className="text-neutral-400" />
                              <span>{booking.date}</span>
                            </div>
                            <div className="text-[11px] text-neutral-500">{booking.time}</div>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold ${
                                booking.status === "Confirmed"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : booking.status === "Pending"
                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                  : booking.status === "Completed"
                                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                                  : "bg-neutral-100 text-neutral-600 border border-neutral-200"
                              }`}
                            >
                              {booking.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              {booking.status !== "Confirmed" && booking.status !== "Cancelled" && (
                                <button
                                  onClick={() => handleStatusChange(booking.id, "Confirmed")}
                                  className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                  title="Confirm appointment"
                                >
                                  <CheckCircle size={16} />
                                </button>
                              )}
                              {booking.status === "Confirmed" && (
                                <button
                                  onClick={() => handleStatusChange(booking.id, "Completed")}
                                  className="px-2.5 py-1 text-[11px] font-medium bg-neutral-100 hover:bg-neutral-200 rounded-full text-neutral-800 transition-colors"
                                >
                                  Mark Done
                                </button>
                              )}
                              {booking.status !== "Cancelled" && (
                                <button
                                  onClick={() => handleStatusChange(booking.id, "Cancelled")}
                                  className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                  title="Cancel appointment"
                                >
                                  <XCircle size={16} />
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
            <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 md:p-8 shadow-xs animate-in fade-in duration-300">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-1 font-semibold">
                    Atelier CRM
                  </span>
                  <h2 className="font-serif text-2xl text-neutral-950">Clientele Directory</h2>
                </div>
                <span className="text-xs text-neutral-500 font-light">
                  {customers.length} high-value clients
                </span>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Total Sessions</TableHead>
                      <TableHead>Total Spent</TableHead>
                      <TableHead>Last Visit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-medium text-neutral-950">
                          {c.name}
                        </TableCell>
                        <TableCell>
                          <div className="text-xs">{c.email}</div>
                          <div className="text-[11px] text-neutral-400 font-light">{c.phone}</div>
                        </TableCell>
                        <TableCell className="text-xs text-neutral-600">
                          {c.location}
                        </TableCell>
                        <TableCell className="text-xs font-semibold text-neutral-900">
                          {c.totalBookings}
                        </TableCell>
                        <TableCell className="text-xs font-serif font-medium text-neutral-900">
                          {c.totalSpent}
                        </TableCell>
                        <TableCell className="text-xs text-neutral-500">
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
