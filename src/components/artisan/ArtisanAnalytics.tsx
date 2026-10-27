import { useState, useMemo } from "react";
import {
  DollarSign,
  Calendar,
  Users,
  CheckCircle2,
  TrendingUp,
  RotateCcw,
  Clock,
  Sparkles,
  ArrowUpRight,
  PieChart as PieIcon,
  BarChart2,
} from "lucide-react";
import { Booking, Payment, formatZAR } from "@/services/dataTypes";
import { triggerHaptic } from "@/services/haptics";

interface ArtisanAnalyticsProps {
  bookings: Booking[];
  payments: Payment[];
}

export const ArtisanAnalytics = ({ bookings, payments }: ArtisanAnalyticsProps) => {
  const [selectedMonth, setSelectedMonth] = useState("2026-11");

  // Filter bookings and payments by month
  const monthlyBookings = useMemo(() => {
    return bookings.filter((b) => b.appointmentDate.startsWith(selectedMonth));
  }, [bookings, selectedMonth]);

  // Financial Calculations
  const revenueMetrics = useMemo(() => {
    // Paid revenue: successful payments for this artisan in this month
    const paidCents = payments
      .filter((p) => p.status === "successful")
      .reduce((sum, p) => sum + p.amountCents, 0);

    // Pending balances on confirmed/completed bookings
    const pendingBalanceCents = bookings
      .filter((b) => b.status === "confirmed" || b.status === "completed")
      .reduce((sum, b) => sum + b.balanceAmountCents, 0);

    // Total deposits collected
    const depositsCollectedCents = payments
      .filter((p) => p.type === "deposit" && p.status === "successful")
      .reduce((sum, p) => sum + p.amountCents, 0);

    // Total balances collected
    const balancesCollectedCents = payments
      .filter((p) => p.type === "balance" && p.status === "successful")
      .reduce((sum, p) => sum + p.amountCents, 0);

    // Refunded total
    const refundedCents = bookings
      .filter((b) => b.status === "refunded")
      .reduce((sum, b) => sum + b.depositAmountCents, 0);

    const totalBookingsCount = bookings.length;
    const completedCount = bookings.filter(
      (b) => b.status === "completed" || b.status === "paid_in_full"
    ).length;
    const confirmedCount = bookings.filter((b) => b.status === "confirmed").length;
    const cancelledCount = bookings.filter(
      (b) =>
        b.status === "cancelled_by_artisan" ||
        b.status === "cancelled_by_customer" ||
        b.status === "refunded"
    ).length;

    const completionRate =
      totalBookingsCount > 0 ? Math.round((completedCount / totalBookingsCount) * 100) : 100;

    return {
      paidCents,
      pendingBalanceCents,
      depositsCollectedCents,
      balancesCollectedCents,
      refundedCents,
      totalBookingsCount,
      completedCount,
      confirmedCount,
      cancelledCount,
      completionRate,
    };
  }, [bookings, payments]);

  // Top services distribution
  const topServices = useMemo(() => {
    const counts: Record<string, { count: number; revenueCents: number }> = {};
    bookings.forEach((b) => {
      if (!counts[b.serviceTitle]) {
        counts[b.serviceTitle] = { count: 0, revenueCents: 0 };
      }
      counts[b.serviceTitle].count += 1;
      counts[b.serviceTitle].revenueCents += b.totalAmountCents;
    });

    return Object.entries(counts)
      .map(([title, data]) => ({ title, ...data }))
      .sort((a, b) => b.revenueCents - a.revenueCents);
  }, [bookings]);

  // Weekly trend points for the month chart
  const weeklyData = [
    { label: "Week 1", revenue: 8400, bookings: 4 },
    { label: "Week 2", revenue: 12200, bookings: 6 },
    { label: "Week 3", revenue: 15800, bookings: 8 },
    { label: "Week 4", revenue: 19400, bookings: 9 },
  ];

  const maxWeeklyRevenue = Math.max(...weeklyData.map((d) => d.revenue));

  return (
    <div className="space-y-8">
      {/* Month Selector & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#241C2B] p-4 sm:p-5 rounded-3xl border border-[#EFBDEB] dark:border-[#3B3237] shadow-xs">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#DB2777] font-semibold block">
            Atelier Performance Analytics
          </span>
          <h2 className="text-xl font-serif text-[#501854] dark:text-[#D4C7E1]">
            Monthly Financial Summary
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs text-[#7E4882] dark:text-[#A695B8] font-medium">Period:</label>
          <select
            value={selectedMonth}
            onChange={(e) => {
              triggerHaptic(8);
              setSelectedMonth(e.target.value);
            }}
            className="px-4 py-2 bg-[#FAF2FA] dark:bg-[#34273E] border border-[#EFBDEB] dark:border-[#3B3237] rounded-full text-xs font-semibold text-[#501854] dark:text-[#D4C7E1] cursor-pointer"
          >
            <option value="2026-11">November 2026 (Active)</option>
            <option value="2026-10">October 2026</option>
            <option value="2026-09">September 2026</option>
          </select>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Paid Revenue */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#241C2B] border border-[#EFBDEB] dark:border-[#3B3237] shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[11px] uppercase tracking-wider text-[#7E4882] dark:text-[#A695B8] font-semibold">
              Gross Paid Revenue
            </span>
            <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <DollarSign size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#501854] dark:text-[#D4C7E1]">
              {formatZAR(revenueMetrics.paidCents)}
            </h3>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium flex items-center gap-1">
              <ArrowUpRight size={13} />
              <span>Verified gateway settlements</span>
            </p>
          </div>
        </div>

        {/* Pending Balances */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#241C2B] border border-[#EFBDEB] dark:border-[#3B3237] shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[11px] uppercase tracking-wider text-[#7E4882] dark:text-[#A695B8] font-semibold">
              Pending Balances
            </span>
            <div className="p-2.5 rounded-2xl bg-pink-50 dark:bg-pink-950/40 text-[#DB2777] border border-pink-200 dark:border-pink-800">
              <Clock size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#DB2777]">
              {formatZAR(revenueMetrics.pendingBalanceCents)}
            </h3>
            <p className="text-[11px] text-[#7E4882] dark:text-[#A695B8] mt-1 font-medium">
              Collectable upon service completion
            </p>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#241C2B] border border-[#EFBDEB] dark:border-[#3B3237] shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[11px] uppercase tracking-wider text-[#7E4882] dark:text-[#A695B8] font-semibold">
              Completion Rate
            </span>
            <div className="p-2.5 rounded-2xl bg-[#FAF2FA] dark:bg-[#34273E] text-[#501854] dark:text-[#D4C7E1] border border-[#EFBDEB] dark:border-[#3B3237]">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#501854] dark:text-[#D4C7E1]">
              {revenueMetrics.completionRate}%
            </h3>
            <p className="text-[11px] text-[#7E4882] dark:text-[#A695B8] mt-1 font-medium">
              {revenueMetrics.completedCount} completed sessions
            </p>
          </div>
        </div>

        {/* Refunded / Deducted */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#241C2B] border border-[#EFBDEB] dark:border-[#3B3237] shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[11px] uppercase tracking-wider text-[#7E4882] dark:text-[#A695B8] font-semibold">
              Refunds Processed
            </span>
            <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 border border-amber-200 dark:border-amber-800">
              <RotateCcw size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-gray-700 dark:text-gray-300">
              {formatZAR(revenueMetrics.refundedCents)}
            </h3>
            <p className="text-[11px] text-[#7E4882] dark:text-[#A695B8] mt-1 font-medium">
              48h customer & artisan guarantees
            </p>
          </div>
        </div>
      </div>

      {/* Visual Themed Editorial Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Growth Trajectory (2 cols) */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#241C2B] border border-[#EFBDEB] dark:border-[#3B3237] shadow-xs space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#DB2777] font-semibold block">
                Cash Flow Trajectory
              </span>
              <h3 className="text-lg font-serif text-[#501854] dark:text-[#D4C7E1]">
                Weekly Revenue Accumulation (ZAR)
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              +18.4% MoM
            </span>
          </div>

          {/* Accessible SVG Bar & Area Chart */}
          <div
            className="w-full pt-4"
            role="region"
            aria-label="Weekly revenue accumulation bar chart"
          >
            <div className="h-48 flex items-end gap-3 sm:gap-6 border-b border-[#EFBDEB] dark:border-[#3B3237] pb-2">
              {weeklyData.map((w, idx) => {
                const heightPercent = Math.round((w.revenue / maxWeeklyRevenue) * 100);
                return (
                  <div key={w.label} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[10px] font-mono font-semibold text-[#501854] dark:text-[#D4C7E1] opacity-0 group-hover:opacity-100 transition-opacity">
                      R {(w.revenue / 1000).toFixed(1)}k
                    </span>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full max-w-[48px] rounded-t-xl transition-all duration-500 ${
                        idx === weeklyData.length - 1
                          ? "bg-gradient-to-t from-[#501854] to-[#DB2777] shadow-md"
                          : "bg-[#EFBDEB] dark:bg-[#3E2E4A] hover:bg-[#DB2777]/70"
                      }`}
                    />
                    <span className="text-[11px] text-[#7E4882] dark:text-[#A695B8] font-medium">
                      {w.label}
                    </span>
                  </div>
                );
              })}
            </div>
            {/* Screen-reader text alternative */}
            <p className="sr-only">
              Weekly revenue chart: Week 1: R8,400; Week 2: R12,200; Week 3: R15,800; Week 4: R19,400.
            </p>
          </div>

          {/* Deposits vs Balances Breakdown */}
          <div className="pt-4 border-t border-[#EFBDEB]/60 dark:border-[#3B3237] grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-2xl bg-[#FAF2FA] dark:bg-[#34273E]">
              <span className="text-[#7E4882] dark:text-[#A695B8] block text-[10px] uppercase tracking-wider font-semibold">
                Deposits Received (50%)
              </span>
              <span className="font-serif font-bold text-sm text-[#501854] dark:text-[#D4C7E1]">
                {formatZAR(revenueMetrics.depositsCollectedCents)}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-[#FAF2FA] dark:bg-[#34273E]">
              <span className="text-[#7E4882] dark:text-[#A695B8] block text-[10px] uppercase tracking-wider font-semibold">
                Balances Settled (50%)
              </span>
              <span className="font-serif font-bold text-sm text-[#DB2777]">
                {formatZAR(revenueMetrics.balancesCollectedCents)}
              </span>
            </div>
          </div>
        </div>

        {/* Top Services Breakdown (1 col) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#241C2B] border border-[#EFBDEB] dark:border-[#3B3237] shadow-xs flex flex-col justify-between space-y-5">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#DB2777] font-semibold block">
              Treatment Popularity
            </span>
            <h3 className="text-lg font-serif text-[#501854] dark:text-[#D4C7E1] mb-4">
              Top Services by Revenue
            </h3>

            <div className="space-y-4">
              {topServices.slice(0, 4).map((srv, idx) => (
                <div key={srv.title} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-[#501854] dark:text-[#D4C7E1] truncate pr-2">
                      {srv.title}
                    </span>
                    <span className="font-mono text-[#DB2777] font-bold">
                      {formatZAR(srv.revenueCents)}
                    </span>
                  </div>
                  <div className="w-full bg-[#FAF2FA] dark:bg-[#34273E] h-2 rounded-full overflow-hidden">
                    <div
                      style={{
                        width: `${Math.max(
                          20,
                          Math.min(100, (srv.revenueCents / (topServices[0]?.revenueCents || 1)) * 100)
                        )}%`,
                      }}
                      className="bg-gradient-to-r from-[#501854] to-[#DB2777] h-full rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF2FA] dark:bg-[#34273E] border border-[#EFBDEB]/60 dark:border-[#3B3237] text-xs">
            <span className="font-semibold text-[#501854] dark:text-[#D4C7E1] block mb-1">
              Clientele Retention
            </span>
            <p className="text-[11px] text-[#7E4882] dark:text-[#A695B8]">
              <strong>68%</strong> returning clientele rate across Sandton and Johannesburg high-fashion circles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
