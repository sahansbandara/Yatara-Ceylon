import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Package from "@/models/Package";
import User from "@/models/User";
import Vehicle from "@/models/Vehicle";
import Partner from "@/models/Partner";
import Payment from "@/models/Payment";
import { Users, Package as PackageIcon, CalendarCheck, DollarSign, Car, Handshake, Clock, CreditCard, ArrowUpRight } from "lucide-react";
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
        ] = await Promise.all([
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
        ]);

        return {
            totalBookings,
            pendingBookings,
            activePackages,
            totalUsers,
            availableVehicles,
            totalPartners,
            totalRevenue: revenueAgg[0]?.total || 0,
            pendingBalances: pendingPaymentsAgg[0]?.total || 0,
            recentBookings: JSON.parse(JSON.stringify(recentBookings)),
        };
    } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        return {
            totalBookings: 0, pendingBookings: 0, activePackages: 0,
            totalUsers: 0, availableVehicles: 0, totalPartners: 0,
            totalRevenue: 0, pendingBalances: 0, recentBookings: [],
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

export default async function DashboardPage() {
    const stats = await getDashboardStats();

    return (
        <div className="flex flex-col gap-6">
            {/* Hero */}
            <DashboardHero
                title="Dashboard"
                subtitle="Operations snapshot — Welcome back to Yatara Ceylon"
                badge="Admin"
            />

            {/* KPI Grid */}
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

            {/* Main Content: Bookings Table + Quick Actions */}
            <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
                {/* Recent Bookings — Hero Table */}
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
                            subtitle={`${stats.availableVehicles} vehicles available`}
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
                        <QuickActionCard
                            href="/dashboard/packages"
                            icon={PackageIcon}
                            title="Manage Packages"
                            subtitle={`${stats.activePackages} active packages`}
                            iconColor="text-purple-400"
                            iconBg="bg-purple-500/10 border-purple-500/20"
                        />
                        <QuickActionCard
                            href="/dashboard/users"
                            icon={Users}
                            title="User Management"
                            subtitle={`${stats.totalUsers} registered users`}
                            iconColor="text-sky-400"
                            iconBg="bg-sky-500/10 border-sky-500/20"
                        />
                    </div>
                </GlassPanel>
            </div>
        </div>
    );
}
