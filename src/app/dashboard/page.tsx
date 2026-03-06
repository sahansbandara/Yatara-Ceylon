import { Card } from "@/components/ui/card";
import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Package from "@/models/Package";
import User from "@/models/User";
import Vehicle from "@/models/Vehicle";
import Partner from "@/models/Partner";
import Payment from "@/models/Payment";
import { Users, Package as PackageIcon, CalendarCheck, DollarSign, TrendingUp, ArrowUpRight, Car, Handshake, Clock, CreditCard } from "lucide-react";
import Link from "next/link";

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

const statCards = [
    {
        title: 'Total Revenue',
        icon: DollarSign,
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200/50',
        format: (val: number) => `$${val.toLocaleString()}`,
        key: 'totalRevenue' as const,
    },
    {
        title: 'Total Bookings',
        icon: CalendarCheck,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200/50',
        format: (val: number) => val.toString(),
        key: 'totalBookings' as const,
    },
    {
        title: 'Pending Inquiries',
        icon: Clock,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200/50',
        format: (val: number) => val.toString(),
        key: 'pendingBookings' as const,
    },
    {
        title: 'Active Packages',
        icon: PackageIcon,
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200/50',
        format: (val: number) => val.toString(),
        key: 'activePackages' as const,
    },
    {
        title: 'Available Vehicles',
        icon: Car,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200/50',
        format: (val: number) => val.toString(),
        key: 'availableVehicles' as const,
    },
    {
        title: 'Active Partners',
        icon: Handshake,
        color: 'text-teal-600',
        bgColor: 'bg-teal-50',
        borderColor: 'border-teal-200/50',
        format: (val: number) => val.toString(),
        key: 'totalPartners' as const,
    },
    {
        title: 'Pending Balances',
        icon: CreditCard,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200/50',
        format: (val: number) => `$${val.toLocaleString()}`,
        key: 'pendingBalances' as const,
    },
    {
        title: 'Total Users',
        icon: Users,
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-50',
        borderColor: 'border-indigo-200/50',
        format: (val: number) => val.toString(),
        key: 'totalUsers' as const,
    },
];

const STATUS_COLORS: Record<string, string> = {
    NEW: 'bg-blue-100 text-blue-700',
    PAYMENT_PENDING: 'bg-yellow-100 text-yellow-700',
    ADVANCE_PAID: 'bg-emerald-100 text-emerald-700',
    CONFIRMED: 'bg-green-100 text-green-700',
    ASSIGNED: 'bg-purple-100 text-purple-700',
    IN_PROGRESS: 'bg-indigo-100 text-indigo-700',
    COMPLETED: 'bg-gray-100 text-gray-700',
    CANCELLED: 'bg-red-100 text-red-700',
    CONTACTED: 'bg-sky-100 text-sky-700',
};

export default async function DashboardPage() {
    const stats = await getDashboardStats();

    return (
        <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-display font-bold tracking-tight text-white shadow-sm">Dashboard</h1>
                    <p className="text-sm text-gray-400 font-light mt-1">Welcome back to Yatara Ceylon TOMS</p>
                </div>
                <div className="hidden md:flex items-center gap-2 bg-emerald-900/40 border border-emerald-500/30 px-4 py-2 rounded-xl">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs tracking-[0.1em] text-emerald-100 font-medium">Live Overview</span>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div key={card.key} className="liquid-glass-stat-dark p-5 relative group">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-xs font-medium text-gray-300 tracking-wide">{card.title}</p>
                                <div className={`w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center`}>
                                    <Icon className={`h-4 w-4 ${card.color.replace('600', '400')}`} />
                                </div>
                            </div>
                            <p className="text-2xl font-display font-bold text-white drop-shadow-md">{card.format((stats as any)[card.key])}</p>
                        </div>
                    );
                })}
            </div>

            {/* Recent Bookings + Activity */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 liquid-glass-stat-dark p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-display font-semibold text-white drop-shadow-sm">Recent Bookings</h3>
                        <Link href="/dashboard/bookings" className="text-xs tracking-[0.15em] text-emerald-400 uppercase font-medium hover:text-emerald-300 transition-colors">
                            View All →
                        </Link>
                    </div>
                    {stats.recentBookings.length > 0 ? (
                        <div className="space-y-3">
                            {stats.recentBookings.map((booking: any) => (
                                <Link
                                    key={booking._id}
                                    href={`/dashboard/bookings/${booking._id}`}
                                    className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors group"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-mono font-semibold text-gray-200">{booking.bookingNo}</span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[booking.status] || 'bg-gray-800 text-gray-300'}`}>
                                                {booking.status?.replace(/_/g, ' ')}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1 truncate">
                                            {booking.customerName} <span className="text-gray-600">·</span> {booking.packageId?.title || booking.type}
                                        </p>
                                    </div>
                                    <div className="text-right flex-shrink-0 ml-4">
                                        <p className="text-sm font-semibold text-white">${(booking.totalCost || 0).toLocaleString()}</p>
                                        {booking.paidAmount > 0 && (
                                            <p className="text-[10px] text-emerald-400">Paid: ${(booking.paidAmount || 0).toLocaleString()}</p>
                                        )}
                                    </div>
                                    <ArrowUpRight className="h-4 w-4 text-gray-500 group-hover:text-emerald-400 ml-2 transition-colors" />
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 font-light italic">No bookings yet. They will appear here in real-time.</p>
                    )}
                </div>

                {/* Quick Stats */}
                <div className="col-span-3 liquid-glass-stat-dark p-6">
                    <h3 className="text-lg font-display font-semibold text-white drop-shadow-sm mb-6">Quick Actions</h3>
                    <div className="space-y-3">
                        <Link
                            href="/dashboard/bookings"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors"
                        >
                            <CalendarCheck className="h-5 w-5 text-blue-400" />
                            <div>
                                <p className="text-sm font-medium text-gray-200">Manage Bookings</p>
                                <p className="text-xs text-gray-400">{stats.pendingBookings} pending inquiries</p>
                            </div>
                        </Link>
                        <Link
                            href="/dashboard/finance"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors"
                        >
                            <DollarSign className="h-5 w-5 text-emerald-400" />
                            <div>
                                <p className="text-sm font-medium text-gray-200">Finance Overview</p>
                                <p className="text-xs text-gray-400">${stats.pendingBalances.toLocaleString()} pending balances</p>
                            </div>
                        </Link>
                        <Link
                            href="/dashboard/vehicles"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors"
                        >
                            <Car className="h-5 w-5 text-purple-400" />
                            <div>
                                <p className="text-sm font-medium text-gray-200">Fleet Status</p>
                                <p className="text-xs text-gray-400">{stats.availableVehicles} vehicles available</p>
                            </div>
                        </Link>
                        <Link
                            href="/dashboard/partners"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors"
                        >
                            <Handshake className="h-5 w-5 text-teal-400" />
                            <div>
                                <p className="text-sm font-medium text-gray-200">Partner Network</p>
                                <p className="text-xs text-gray-400">{stats.totalPartners} active partners</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
