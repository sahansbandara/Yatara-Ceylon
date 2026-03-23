import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Package from "@/models/Package";
import User from "@/models/User";
import Vehicle from "@/models/Vehicle";
import Partner from "@/models/Partner";
import Payment from "@/models/Payment";
import AuditLog from "@/models/AuditLog";
import PartnerRequest from "@/models/PartnerRequest";
import {
  Users,
  Package as PackageIcon,
  CalendarCheck,
  DollarSign,
  Car,
  Handshake,
  Clock,
  CreditCard,
  ArrowUpRight,
  AlertCircle,
  Activity,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import Link from "next/link";
import { DashboardHero } from "@/components/dashboard/DashboardHero";
import { StatCard } from "@/components/dashboard/StatCard";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { EmptyStateCard } from "@/components/dashboard/EmptyStateCard";
import { QuickActionCard } from "@/components/dashboard/QuickActionCard";

async function getDashboardStats() {
  try {
    await connectDB();

    const [
      totalBookings,
      pendingBookings,
      activePackages,
      totalUsers,
      availableVehicles,
      totalPartners,
      revenueAgg,
      pendingPaymentsAgg,
      recentBookings,
      bookingsByStatus,
      revenueByStatus,
      upcomingDepartures,
      pendingPartnerRequests,
      pendingVehicles,
      recentActivityLogs,
    ] = await Promise.all([
      // Existing KPI queries
      Booking.countDocuments({ isDeleted: false }),
      Booking.countDocuments({ isDeleted: false, status: { $in: ['NEW', 'PAYMENT_PENDING', 'CONTACTED'] } }),
      Package.countDocuments({ isPublished: true, isDeleted: false }),
      User.countDocuments({ isDeleted: false }),
      Vehicle.countDocuments({ status: 'AVAILABLE' }),
      Partner.countDocuments({ status: 'ACTIVE' }),
      Payment.aggregate([
        { $match: { status: 'SUCCESS', type: 'PAYMENT', isDeleted: false } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),
      Booking.aggregate([
        { $match: { isDeleted: false, remainingBalance: { $gt: 0 } } },
        { $group: { _id: null, total: { $sum: "$remainingBalance" } } }
      ]),
      Booking.find({ isDeleted: false })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('packageId', 'title')
        .lean(),

      // New: Booking counts by status
      Booking.aggregate([
        { $match: { isDeleted: false } },
        { $group: { _id: "$status", count: { $sum: 1 }, revenue: { $sum: "$totalCost" } } }
      ]),

      // New: Revenue by status
      Booking.aggregate([
        { $match: { isDeleted: false } },
        { $group: { _id: "$status", revenue: { $sum: "$totalCost" }, count: { $sum: 1 } } }
      ]),

      // New: Upcoming departures (next 7 days)
      Booking.find({
        isDeleted: false,
        'dates.from': {
          $gte: new Date(),
          $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
      })
        .sort({ 'dates.from': 1 })
        .limit(5)
        .populate('packageId', 'title')
        .lean(),

      // New: Pending partner requests
      PartnerRequest.countDocuments({ status: 'PENDING' }),

      // New: Pending vehicles (under maintenance/review)
      Vehicle.countDocuments({ status: { $ne: 'AVAILABLE' } }),

      // New: Recent activity logs (last 5)
      AuditLog.find()
        .sort({ at: -1 })
        .limit(5)
        .lean()
    ]);

    return {
      // KPI data
      totalBookings,
      pendingBookings,
      activePackages,
      totalUsers,
      availableVehicles,
      totalPartners,
      totalRevenue: revenueAgg[0]?.total || 0,
      pendingBalances: pendingPaymentsAgg[0]?.total || 0,

      // Tables
      recentBookings: JSON.parse(JSON.stringify(recentBookings)),
      bookingsByStatus: JSON.parse(JSON.stringify(bookingsByStatus)),
      revenueByStatus: JSON.parse(JSON.stringify(revenueByStatus)),
      upcomingDepartures: JSON.parse(JSON.stringify(upcomingDepartures)),
      recentActivityLogs: JSON.parse(JSON.stringify(recentActivityLogs)),

      // Pending approvals
      pendingPartnerRequests,
      pendingVehicles,
    };
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return {
      totalBookings: 0,
      pendingBookings: 0,
      activePackages: 0,
      totalUsers: 0,
      availableVehicles: 0,
      totalPartners: 0,
      totalRevenue: 0,
      pendingBalances: 0,
      recentBookings: [],
      bookingsByStatus: [],
      revenueByStatus: [],
      upcomingDepartures: [],
      recentActivityLogs: [],
      pendingPartnerRequests: 0,
      pendingVehicles: 0,
    };
  }
}

const STATUS_MAP: Record<string, string> = {
  NEW: 'status-pill-info',
  PAYMENT_PENDING: 'status-pill-warning',
  ADVANCE_PAID: 'status-pill-success',
  CONFIRMED: 'status-pill-success',
  ASSIGNED: 'status-pill-purple',
  IN_PROGRESS: 'status-pill-info',
  COMPLETED: 'status-pill-neutral',
  CANCELLED: 'status-pill-danger',
  CONTACTED: 'status-pill-gold',
};

const STATUS_COLORS: Record<string, string> = {
  NEW: 'bg-blue-500/60',
  CONTACTED: 'bg-sky-500/60',
  PAYMENT_PENDING: 'bg-amber-500/60',
  ADVANCE_PAID: 'bg-teal-500/60',
  CONFIRMED: 'bg-emerald-500/60',
  ASSIGNED: 'bg-violet-500/60',
  IN_PROGRESS: 'bg-indigo-500/60',
  COMPLETED: 'bg-slate-500/40',
  CANCELLED: 'bg-red-500/40',
};

// Format today's date nicely
function formatTodayDate(): string {
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
  return today.toLocaleDateString('en-US', options);
}

// Format date for display
function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Format time for audit log
function formatTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  // Calculate total bookings for pipeline
  const totalStatusBookings = stats.bookingsByStatus.reduce((sum: number, b: any) => sum + b.count, 0);

  // Build booking pipeline segments with percentages
  const pipelineSegments = stats.bookingsByStatus.map((b: any) => ({
    status: b._id,
    count: b.count,
    pct: totalStatusBookings > 0 ? (b.count / totalStatusBookings) * 100 : 0,
    color: STATUS_COLORS[b._id as keyof typeof STATUS_COLORS] || 'bg-slate-500/40',
  }));

  // Calculate revenue total for revenue breakdown
  const totalStatusRevenue = stats.revenueByStatus.reduce((sum: number, b: any) => sum + b.revenue, 0);

  // Build revenue segments
  const revenueSegments = stats.revenueByStatus.map((b: any) => ({
    status: b._id,
    revenue: b.revenue,
    pct: totalStatusRevenue > 0 ? (b.revenue / totalStatusRevenue) * 100 : 0,
    color: STATUS_COLORS[b._id as keyof typeof STATUS_COLORS] || 'bg-slate-500/40',
  }));

  const totalPendingApprovals = stats.pendingPartnerRequests + stats.pendingVehicles;

  return (
    <div className="flex flex-col gap-6">
      {/* Hero */}
      <DashboardHero
        title="Command Center"
        subtitle={`${formatTodayDate()} — Overview & operations hub`}
        badge="Admin"
      />

      {/* KPI Grid — Row 1 */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Revenue"
          value={`LKR ${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          accentColor="text-emerald-400"
        />
        <StatCard
          title="Bookings"
          value={stats.totalBookings.toString()}
          icon={CalendarCheck}
          accentColor="text-blue-400"
        />
        <StatCard
          title="Pending"
          value={stats.pendingBookings.toString()}
          icon={Clock}
          accentColor="text-amber-400"
        />
        <StatCard
          title="Packages"
          value={stats.activePackages.toString()}
          icon={PackageIcon}
          accentColor="text-purple-400"
        />
      </div>

      {/* KPI Grid — Row 2 */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Vehicles"
          value={stats.availableVehicles.toString()}
          icon={Car}
          accentColor="text-violet-400"
        />
        <StatCard
          title="Partners"
          value={stats.totalPartners.toString()}
          icon={Handshake}
          accentColor="text-teal-400"
        />
        <StatCard
          title="Balances"
          value={`LKR ${stats.pendingBalances.toLocaleString()}`}
          icon={CreditCard}
          accentColor="text-orange-400"
        />
        <StatCard
          title="Users"
          value={stats.totalUsers.toString()}
          icon={Users}
          accentColor="text-sky-400"
        />
      </div>

      {/* Charts Row — Booking Pipeline & Revenue Breakdown */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Booking Pipeline */}
        <GlassPanel title="Booking Pipeline" subtitle={`${totalStatusBookings} total bookings`}>
          <div className="space-y-4">
            <div className="flex h-10 rounded-lg overflow-hidden border border-white/10">
              {pipelineSegments.length > 0 ? (
                pipelineSegments.map((seg: any) => (
                  <div
                    key={seg.status}
                    style={{ width: `${seg.pct}%` }}
                    className={`${seg.color} flex items-center justify-center relative group transition-opacity hover:opacity-80`}
                    title={`${seg.status}: ${seg.count}`}
                  >
                    {seg.pct > 8 && (
                      <span className="text-[10px] font-bold text-white/90 drop-shadow">
                        {seg.count}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className="w-full bg-slate-500/20 flex items-center justify-center">
                  <span className="text-xs text-white/40">No bookings</span>
                </div>
              )}
            </div>
            <div className="grid gap-2 grid-cols-3">
              {pipelineSegments.slice(0, 6).map((seg: any) => (
                <div key={seg.status} className="text-xs">
                  <div className="text-white/50">{seg.status?.replace(/_/g, ' ')}</div>
                  <div className="text-white/90 font-semibold">{seg.count}</div>
                </div>
              ))}
            </div>
          </div>
        </GlassPanel>

        {/* Revenue by Status */}
        <GlassPanel title="Revenue by Status" subtitle={`LKR ${totalStatusRevenue.toLocaleString()} total`}>
          <div className="space-y-3">
            {revenueSegments.length > 0 ? (
              revenueSegments.map((seg: any) => (
                <div key={seg.status}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-medium text-white/70">{seg.status?.replace(/_/g, ' ')}</span>
                    <span className="text-xs font-bold text-white/90">LKR {(seg.revenue || 0).toLocaleString()}</span>
                  </div>
                  <div className="h-6 rounded-lg bg-white/5 overflow-hidden border border-white/10">
                    <div
                      style={{ width: `${seg.pct}%` }}
                      className={`${seg.color} h-full flex items-center justify-end pr-2 transition-all`}
                    >
                      {seg.pct > 15 && (
                        <span className="text-[9px] font-bold text-white/80">{Math.round(seg.pct)}%</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-white/40">No revenue data available</div>
            )}
          </div>
        </GlassPanel>
      </div>

      {/* Main Content: Recent Bookings + Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Recent Bookings Table */}
        <GlassPanel title="Recent Bookings" actionLabel="View All" actionHref="/dashboard/bookings" noPadding>
          {stats.recentBookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="dashboard-table-glass w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left px-5 py-3 text-[10px] tracking-[0.15em] uppercase text-white/35 font-semibold">Code</th>
                    <th className="text-left px-5 py-3 text-[10px] tracking-[0.15em] uppercase text-white/35 font-semibold">Customer</th>
                    <th className="text-left px-5 py-3 text-[10px] tracking-[0.15em] uppercase text-white/35 font-semibold hidden md:table-cell">Service</th>
                    <th className="text-right px-5 py-3 text-[10px] tracking-[0.15em] uppercase text-white/35 font-semibold">Amount</th>
                    <th className="text-center px-5 py-3 text-[10px] tracking-[0.15em] uppercase text-white/35 font-semibold">Status</th>
                    <th className="px-3 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentBookings.map((booking: any) => (
                    <tr key={booking._id}>
                      <td className="px-5 py-3.5">
                        <span className="font-mono font-semibold text-white/80 text-xs">{booking.bookingNo}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-xs font-medium text-white/85">{booking.customerName}</p>
                      </td>
                      <td className="px-5 py-3.5 hidden md:table-cell">
                        <p className="text-xs text-white/50 truncate max-w-[140px]">{booking.packageId?.title || booking.type}</p>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <span className="text-xs font-bold text-white/90">LKR {(booking.totalCost || 0).toLocaleString()}</span>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`status-pill ${STATUS_MAP[booking.status] || 'status-pill-neutral'}`}>
                          {booking.status?.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-3 py-3.5">
                        <Link href={`/dashboard/bookings/${booking._id}`} className="inline-flex p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors">
                          <ArrowUpRight className="h-3.5 w-3.5 text-white/30 hover:text-antique-gold transition-colors" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyStateCard
              icon={CalendarCheck}
              title="No bookings yet"
              description="New booking requests will appear here in real-time as they come in."
              actionLabel="View Bookings"
              actionHref="/dashboard/bookings"
            />
          )}
        </GlassPanel>

        {/* Quick Actions */}
        <GlassPanel title="Quick Actions">
          <div className="space-y-2">
            <QuickActionCard
              href="/dashboard/bookings"
              icon={CalendarCheck}
              title="Manage Bookings"
              subtitle={`${stats.pendingBookings} pending inquiries`}
              iconColor="text-blue-400"
              iconBg="bg-blue-500/10 border-blue-500/20"
            />
            <QuickActionCard
              href="/dashboard/finance"
              icon={DollarSign}
              title="Finance Overview"
              subtitle={`LKR ${stats.pendingBalances.toLocaleString()} pending`}
              iconColor="text-emerald-400"
              iconBg="bg-emerald-500/10 border-emerald-500/20"
            />
            <QuickActionCard
              href="/dashboard/vehicles"
              icon={Car}
              title="Fleet Status"
              subtitle={`${stats.availableVehicles} available`}
              iconColor="text-violet-400"
              iconBg="bg-violet-500/10 border-violet-500/20"
            />
            <QuickActionCard
              href="/dashboard/partners"
              icon={Handshake}
              title="Partner Network"
              subtitle={`${stats.totalPartners} active partners`}
              iconColor="text-teal-400"
              iconBg="bg-teal-500/10 border-teal-500/20"
            />
          </div>
        </GlassPanel>
      </div>

      {/* Bottom Row: Upcoming Departures + Pending Approvals + Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upcoming Departures */}
        <GlassPanel title="Upcoming Departures" subtitle="Next 7 days" actionLabel="View Calendar" actionHref="/dashboard/bookings?filter=upcoming">
          {stats.upcomingDepartures.length > 0 ? (
            <div className="space-y-3">
              {stats.upcomingDepartures.map((booking: any) => (
                <div key={booking._id} className="p-3 rounded-lg bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] transition-colors">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white/90 truncate">{booking.customerName}</p>
                      <p className="text-xs text-white/50 mt-0.5">{booking.packageId?.title || booking.type}</p>
                      <p className="text-xs font-bold text-emerald-400 mt-1">{formatDate(booking.dates.from)}</p>
                    </div>
                    <Link href={`/dashboard/bookings/${booking._id}`} className="flex-shrink-0">
                      <ArrowUpRight className="h-3.5 w-3.5 text-white/30 hover:text-antique-gold transition-colors" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyStateCard
              icon={CalendarCheck}
              title="No departures soon"
              description="No bookings scheduled for the next 7 days."
            />
          )}
        </GlassPanel>

        {/* Pending Approvals */}
        <GlassPanel title="Pending Approvals" subtitle={`${totalPendingApprovals} items need review`}>
          <div className="space-y-3">
            {stats.pendingPartnerRequests > 0 && (
              <Link href="/dashboard/partners/requests" className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] transition-colors group">
                <div className="p-2 rounded-lg bg-amber-500/15 border border-amber-500/30 flex-shrink-0">
                  <AlertCircle className="h-4 w-4 text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white/90">Partner Requests</p>
                  <p className="text-xs text-white/50 mt-0.5">{stats.pendingPartnerRequests} awaiting review</p>
                </div>
                <ArrowUpRight className="h-3.5 w-3.5 text-white/30 group-hover:text-antique-gold transition-colors flex-shrink-0" />
              </Link>
            )}
            {stats.pendingVehicles > 0 && (
              <Link href="/dashboard/vehicles?filter=pending" className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] transition-colors group">
                <div className="p-2 rounded-lg bg-violet-500/15 border border-violet-500/30 flex-shrink-0">
                  <AlertCircle className="h-4 w-4 text-violet-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white/90">Vehicle Reviews</p>
                  <p className="text-xs text-white/50 mt-0.5">{stats.pendingVehicles} pending status</p>
                </div>
                <ArrowUpRight className="h-3.5 w-3.5 text-white/30 group-hover:text-antique-gold transition-colors flex-shrink-0" />
              </Link>
            )}
            {totalPendingApprovals === 0 && (
              <div className="text-center py-6">
                <div className="inline-flex p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 mb-3">
                  <svg className="h-5 w-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-xs font-medium text-emerald-400">All caught up!</p>
                <p className="text-xs text-white/50 mt-1">No pending approvals</p>
              </div>
            )}
          </div>
        </GlassPanel>

        {/* Recent Activity */}
        <GlassPanel title="Recent Activity" subtitle="Last 5 actions">
          {stats.recentActivityLogs.length > 0 ? (
            <div className="space-y-2.5">
              {stats.recentActivityLogs.map((log: any) => (
                <div key={log._id} className="flex gap-3 p-2.5 rounded-lg bg-white/[0.04] border border-white/10">
                  <div className="flex-shrink-0 pt-0.5">
                    <Activity className="h-3.5 w-3.5 text-white/40" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white/80 truncate capitalize">
                      {log.action?.replace(/_/g, ' ')}
                    </p>
                    <p className="text-xs text-white/40 mt-0.5">
                      {log.entity} {log.entityId ? `(${log.entityId.toString().slice(0, 8)}...)` : ''}
                    </p>
                    <p className="text-xs text-white/30 mt-1">{formatTime(log.at)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <Activity className="h-8 w-8 text-white/20 mx-auto mb-2" />
              <p className="text-xs text-white/40">No recent activity</p>
            </div>
          )}
        </GlassPanel>
      </div>
    </div>
  );
}
