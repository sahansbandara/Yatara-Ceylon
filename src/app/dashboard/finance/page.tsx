import connectDB from "@/lib/mongodb";
import Payment from "@/models/Payment";
import Booking from "@/models/Booking";
import { DollarSign, TrendingUp, CreditCard, AlertTriangle, ArrowUpRight, Receipt } from "lucide-react";
import Link from "next/link";
import { DashboardHero } from "@/components/dashboard/DashboardHero";
import { StatCard } from "@/components/dashboard/StatCard";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { EmptyStateCard } from "@/components/dashboard/EmptyStateCard";

async function getFinanceData() {
    try {
        await connectDB();
        const [
            totalRevenueAgg,
            pendingBalancesAgg,
            advancePaidAgg,
            recentPayments,
            bookingsWithBalance,
        ] = await Promise.all([
            Payment.aggregate([
                { $match: { status: 'SUCCESS', type: 'PAYMENT', isDeleted: false } },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ]),
            Booking.aggregate([
                { $match: { isDeleted: false, remainingBalance: { $gt: 0 } } },
                { $group: { _id: null, total: { $sum: "$remainingBalance" }, count: { $sum: 1 } } }
            ]),
            Booking.aggregate([
                { $match: { isDeleted: false, paidAmount: { $gt: 0 } } },
                { $group: { _id: null, total: { $sum: "$paidAmount" }, count: { $sum: 1 } } }
            ]),
            Payment.find({ isDeleted: false })
                .sort({ createdAt: -1 })
                .limit(10)
                .populate('bookingId', 'bookingNo customerName')
                .lean(),
            Booking.find({ isDeleted: false, remainingBalance: { $gt: 0 } })
                .sort({ remainingBalance: -1 })
                .limit(10)
                .select('bookingNo customerName totalCost paidAmount remainingBalance status')
                .lean(),
        ]);

        return {
            totalRevenue: totalRevenueAgg[0]?.total || 0,
            pendingBalances: pendingBalancesAgg[0]?.total || 0,
            pendingCount: pendingBalancesAgg[0]?.count || 0,
            advancePaid: advancePaidAgg[0]?.total || 0,
            advanceCount: advancePaidAgg[0]?.count || 0,
            recentPayments: JSON.parse(JSON.stringify(recentPayments)),
            bookingsWithBalance: JSON.parse(JSON.stringify(bookingsWithBalance)),
        };
    } catch {
        return {
            totalRevenue: 0, pendingBalances: 0, pendingCount: 0,
            advancePaid: 0, advanceCount: 0, recentPayments: [], bookingsWithBalance: [],
        };
    }
}

export default async function FinancePage() {
    const data = await getFinanceData();

    const collectionRate = data.totalRevenue > 0 && data.pendingBalances > 0
        ? `${Math.round((data.totalRevenue / (data.totalRevenue + data.pendingBalances)) * 100)}%`
        : data.totalRevenue > 0 ? '100%' : '0%';

    return (
        <div className="flex flex-col gap-6">
            <DashboardHero
                title="Finance"
                subtitle="Payment tracking and financial overview"
            />

            {/* KPI Cards */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Collected"
                    value={`LKR ${data.totalRevenue.toLocaleString()}`}
                    icon={DollarSign}
                    accentColor="text-emerald-400"
                />
                <StatCard
                    title="Advances"
                    value={`LKR ${data.advancePaid.toLocaleString()}`}
                    icon={TrendingUp}
                    accentColor="text-blue-400"
                    trend={{ value: `${data.advanceCount} bookings`, positive: true }}
                />
                <StatCard
                    title="Pending"
                    value={`LKR ${data.pendingBalances.toLocaleString()}`}
                    icon={AlertTriangle}
                    accentColor="text-amber-400"
                    trend={{ value: `${data.pendingCount} due`, positive: false }}
                />
                <StatCard
                    title="Collection Rate"
                    value={collectionRate}
                    icon={CreditCard}
                    accentColor="text-violet-400"
                />
            </div>

            {/* Two Column: Payments + Outstanding */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Payments */}
                <GlassPanel title="Recent Payments">
                    {data.recentPayments.length > 0 ? (
                        <div className="space-y-2">
                            {data.recentPayments.map((p: any) => (
                                <div key={p._id} className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] transition-all duration-300">
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-mono font-medium text-white/80 truncate">{p.orderId}</p>
                                        <p className="text-[10px] text-white/40 mt-0.5">
                                            {(p.bookingId as any)?.bookingNo || '—'} · {(p.bookingId as any)?.customerName || '—'}
                                        </p>
                                        <p className="text-[10px] text-white/25 mt-0.5">{new Date(p.createdAt).toLocaleString()}</p>
                                    </div>
                                    <div className="text-right flex-shrink-0 ml-3">
                                        <p className="text-sm font-bold text-white/85">LKR {(p.amount || 0).toLocaleString()}</p>
                                        <span className={`status-pill mt-1 ${p.status === 'SUCCESS' ? 'status-pill-success' : p.status === 'PENDING' ? 'status-pill-warning' : 'status-pill-danger'}`}>
                                            {p.status} · {p.provider}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyStateCard
                            icon={Receipt}
                            title="No payments recorded"
                            description="Payment transactions will appear here once customers make their first payment."
                        />
                    )}
                </GlassPanel>

                {/* Outstanding Balances */}
                <GlassPanel title="Outstanding Balances">
                    {data.bookingsWithBalance.length > 0 ? (
                        <div className="space-y-2">
                            {data.bookingsWithBalance.map((b: any) => (
                                <Link
                                    key={b._id}
                                    href={`/dashboard/bookings/${b._id}`}
                                    className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] transition-all duration-300 group"
                                >
                                    <div className="min-w-0">
                                        <p className="text-xs font-mono font-medium text-white/80">{b.bookingNo}</p>
                                        <p className="text-[10px] text-white/40 mt-0.5">{b.customerName}</p>
                                    </div>
                                    <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                                        <div className="text-right">
                                            <p className="text-[10px] text-white/35">Paid: LKR {(b.paidAmount || 0).toLocaleString()}</p>
                                            <p className="text-sm font-bold text-amber-400">Due: LKR {(b.remainingBalance || 0).toLocaleString()}</p>
                                        </div>
                                        <ArrowUpRight className="h-4 w-4 text-white/20 group-hover:text-antique-gold transition-colors" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <EmptyStateCard
                            icon={DollarSign}
                            title="All settled"
                            description="All booking balances are fully paid. Great work!"
                        />
                    )}
                </GlassPanel>
            </div>
        </div>
    );
}
