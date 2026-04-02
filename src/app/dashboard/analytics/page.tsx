import connectDB from "@/lib/mongodb";
import { formatLKR } from '@/lib/currency';
import Booking from "@/models/Booking";
import Payment from "@/models/Payment";
import { DashboardHero } from "@/components/dashboard/DashboardHero";
import { StatCard } from "@/components/dashboard/StatCard";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { CalendarCheck, DollarSign, PackageIcon, TrendingUp } from "lucide-react";
import Package from "@/models/Package";
import AnalyticsDateFilter from "@/components/dashboard/analytics/AnalyticsDateFilter";
import {
  buildMonthBuckets,
  formatDateInput,
  isDateRangePreset,
  resolveDateRangePreset,
} from "@/lib/date-range";

export const revalidate = 0; // Disable static rendering for this page

async function getAnalyticsData(dateFrom: string, dateTo: string) {
  try {
    await connectDB();

    const rangeStart = new Date(`${dateFrom}T00:00:00.000Z`);
    const rangeEnd = new Date(`${dateTo}T23:59:59.999Z`);

    // Fetch Monthly Bookings Volume
    const bookingsByMonth = await Booking.aggregate([
      { 
        $match: { 
          isDeleted: false,
          createdAt: { $gte: rangeStart, $lte: rangeEnd } 
        } 
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 },
          gbv: { $sum: "$totalCost" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // Fetch Monthly Actual Revenue (Payments)
    const revenueByMonth = await Payment.aggregate([
      { 
        $match: { 
          status: 'SUCCESS', 
          type: 'PAYMENT',
          isDeleted: false,
          createdAt: { $gte: rangeStart, $lte: rangeEnd } 
        } 
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          revenue: { $sum: "$amount" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // Fetch Top Packages by Request/Booking Volume
    const topPackages = await Booking.aggregate([
      { 
        $match: { 
          isDeleted: false,
          packageId: { $exists: true, $ne: null },
          createdAt: { $gte: rangeStart, $lte: rangeEnd }
        } 
      },
      {
        $group: {
          _id: "$packageId",
          bookingsCount: { $sum: 1 },
          totalRevenue: { $sum: "$totalCost" }
        }
      },
      { $sort: { bookingsCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "packages",
          localField: "_id",
          foreignField: "_id",
          as: "packageDetails"
        }
      },
      { $unwind: { path: "$packageDetails", preserveNullAndEmptyArrays: true } }
    ]);

    return {
      monthlyBookings: bookingsByMonth,
      monthlyRevenue: revenueByMonth,
      topPackages: topPackages
    };
  } catch (error) {
    console.error("Failed to fetch analytics:", error);
    return {
      monthlyBookings: [],
      monthlyRevenue: [],
      topPackages: []
    };
  }
}

// Helper to fill empty months
function buildFilledMonthsData(
  rawData: any[],
  field: string,
  monthBuckets: Array<{ year: number; month: number; label: string }>,
  defaultValue: number = 0
) {
  return monthBuckets.map((bucket) => {
    const record = rawData.find(
      (row) => row._id?.month === bucket.month && row._id?.year === bucket.year
    );

    return {
      label: bucket.label,
      value: record ? record[field] || defaultValue : defaultValue,
    };
  });
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ months?: string; from?: string; to?: string; preset?: string }>;
}) {
  const params = await searchParams;
  const months = Math.min(Math.max(parseInt(params.months || '6'), 3), 24);
  const fallbackEnd = new Date();
  const fallbackStart = new Date();
  fallbackStart.setMonth(fallbackStart.getMonth() - (months - 1));
  fallbackStart.setDate(1);
  fallbackStart.setHours(0, 0, 0, 0);

  const presetRange = isDateRangePreset(params.preset)
    ? resolveDateRangePreset(params.preset)
    : null;

  const activeFrom = params.from || presetRange?.from || formatDateInput(fallbackStart);
  const activeTo = params.to || presetRange?.to || formatDateInput(fallbackEnd);

  const data = await getAnalyticsData(activeFrom, activeTo);
  const monthBuckets = buildMonthBuckets(activeFrom, activeTo);

  // Format for charts
  const bookingsChartData = buildFilledMonthsData(data.monthlyBookings, 'count', monthBuckets);
  const maxBookings = Math.max(...bookingsChartData.map(d => d.value), 1); // Avoid div by 0

  const revenueChartData = buildFilledMonthsData(data.monthlyRevenue, 'revenue', monthBuckets);
  const maxRevenue = Math.max(...revenueChartData.map(d => d.value), 1000); // Avoid div by 0

  // Quick Stats
  const thisMonthBookings = bookingsChartData[bookingsChartData.length - 1]?.value || 0;
  const lastMonthBookings = bookingsChartData[bookingsChartData.length - 2]?.value || 0;
  
  const thisMonthRevenue = revenueChartData[revenueChartData.length - 1]?.value || 0;
  const lastMonthRevenue = revenueChartData[revenueChartData.length - 2]?.value || 0;

  const getGrowth = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? "Infinite" : "0%";
    const diff = current - previous;
    const pct = (diff / previous) * 100;
    return `${pct > 0 ? '+' : ''}${pct.toFixed(1)}%`;
  };

  const getGrowthColor = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? "text-emerald-400" : "text-slate-400";
    return current >= previous ? "text-emerald-400" : "text-red-400";
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      <DashboardHero
        title="Analytics & Reports"
        subtitle="Performance metrics and growth trends"
        badge="Analytics"
      />

      {/* Date Range Selector */}
      <AnalyticsDateFilter
        currentFrom={activeFrom}
        currentTo={activeTo}
        currentPreset={isDateRangePreset(params.preset) ? params.preset : undefined}
      />

      {/* High-Level Month over Month Stats */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <GlassPanel>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-white/50 uppercase tracking-widest font-semibold mb-1">M-O-M Bookings</p>
              <h3 className="text-3xl font-bold text-white mb-2">{thisMonthBookings}</h3>
              <p className={`text-xs font-semibold ${getGrowthColor(thisMonthBookings, lastMonthBookings)}`}>
                {getGrowth(thisMonthBookings, lastMonthBookings)} vs last month
              </p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <CalendarCheck className="w-5 h-5 text-blue-400" />
            </div>
          </div>
        </GlassPanel>

        <GlassPanel>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-white/50 uppercase tracking-widest font-semibold mb-1">M-O-M Revenue</p>
              <h3 className="text-3xl font-bold text-white mb-2 ml-[-0.2rem]">
                {formatLKR(thisMonthRevenue)}
              </h3>
              <p className={`text-xs font-semibold ${getGrowthColor(thisMonthRevenue, lastMonthRevenue)}`}>
                {getGrowth(thisMonthRevenue, lastMonthRevenue)} vs last month
              </p>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
        </GlassPanel>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Bookings Volume Chart */}
        <GlassPanel title="Bookings Trajectory" subtitle="Inquiries & successful bookings">
          <div className="h-64 flex items-end gap-2 md:gap-4 mt-6 border-b border-white/10 pb-2 relative">
            {/* Y Axis Guide */}
            <div className="absolute left-0 top-0 bottom-0 w-full flex flex-col justify-between z-0 pointer-events-none">
              {[1, 0.75, 0.5, 0.25, 0].map(tier => (
                <div key={tier} className="border-b border-white/[0.03] w-full h-[1px]"></div>
              ))}
            </div>
            
            {bookingsChartData.map((d, i) => {
              const heightPct = (d.value / maxBookings) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col justify-end items-center gap-2 group z-10">
                  <div className="w-full relative flex justify-center">
                    {/* Tooltip */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-[#0f172a] border border-white/10 text-xs px-2 py-1 rounded-md text-white whitespace-nowrap shadow-xl z-20">
                      {d.value} bookings
                    </div>
                    {/* Bar */}
                    <div 
                      className="w-full max-w-[48px] bg-gradient-to-t from-blue-500/20 to-blue-400/80 rounded-t-md transition-all duration-500 group-hover:to-blue-300" 
                      style={{ height: `${Math.max(heightPct, 4)}%` }} // Minimum height to be visible
                    />
                  </div>
                  <span className="text-[10px] text-white/50 font-medium uppercase tracking-wider">{d.label}</span>
                </div>
              );
            })}
          </div>
        </GlassPanel>

        {/* Revenue Volume Chart */}
        <GlassPanel title="Revenue Performance" subtitle="Actual received payments (LKR)">
          <div className="h-64 flex items-end gap-2 md:gap-4 mt-6 border-b border-white/10 pb-2 relative">
             {/* Y Axis Guide */}
             <div className="absolute left-0 top-0 bottom-0 w-full flex flex-col justify-between z-0 pointer-events-none">
              {[1, 0.75, 0.5, 0.25, 0].map(tier => (
                <div key={tier} className="border-b border-white/[0.03] w-full h-[1px]"></div>
              ))}
            </div>

            {revenueChartData.map((d, i) => {
              const heightPct = (d.value / maxRevenue) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col justify-end items-center gap-2 group z-10">
                  <div className="w-full relative flex justify-center">
                    {/* Tooltip */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-[#0f172a] border border-white/10 text-xs px-2 py-1 rounded-md text-white whitespace-nowrap shadow-xl z-20">
                      {formatLKR(d.value)}
                    </div>
                    {/* Bar */}
                    <div 
                      className="w-full max-w-[48px] bg-gradient-to-t from-emerald-500/20 to-emerald-400/80 rounded-t-md transition-all duration-500 group-hover:to-emerald-300" 
                      style={{ height: `${Math.max(heightPct, 4)}%` }} // Minimum height to be visible
                    />
                  </div>
                  <span className="text-[10px] text-white/50 font-medium uppercase tracking-wider">{d.label}</span>
                </div>
              );
            })}
          </div>
        </GlassPanel>
      </div>

      {/* Top Performing Packages */}
      <GlassPanel title="Top Performing Packages" subtitle="Most booked packages all-time">
        {data.topPackages.length > 0 ? (
          <div className="space-y-4">
            {data.topPackages.map((pkg: any, index: number) => (
              <div key={pkg._id} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors overflow-hidden relative">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 z-10 relative">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-antique-gold/10 border border-antique-gold/20 flex items-center justify-center text-antique-gold font-bold">
                      #{index + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white/90">{pkg.packageDetails?.title || "Unknown Package"}</h4>
                      <p className="text-xs text-white/50 mt-1">{pkg.bookingsCount} Total Bookings</p>
                    </div>
                  </div>
                  <div className="md:text-right">
                    <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Gross Booking Value</p>
                    <p className="text-sm font-bold text-white/90">{formatLKR(pkg.totalRevenue || 0)}</p>
                  </div>
                </div>

                {/* Optional background glow for top 1 */}
                {index === 0 && (
                  <div className="absolute top-0 right-0 w-64 h-64 bg-antique-gold/10 blur-[80px] rounded-full pointer-events-none -mt-32 -mr-32" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-white/10 rounded-xl">
            <PackageIcon className="w-8 h-8 mx-auto text-white/20 mb-3" />
            <p className="text-sm text-white/50">No package data available yet.</p>
          </div>
        )}
      </GlassPanel>
    </div>
  );
}
