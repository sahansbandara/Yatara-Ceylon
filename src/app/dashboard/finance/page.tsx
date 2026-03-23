import connectDB from "@/lib/mongodb";
import Payment from "@/models/Payment";
import Booking from "@/models/Booking";
import { DollarSign, TrendingUp, CreditCard, AlertTriangle, ArrowUpRight, Receipt, Clock, CalendarClock } from "lucide-react";
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
            revenueByMonth,
            agingBucketsData,
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
            // Revenue by month (last 6 months)
            Payment.aggregate([
                { $match: { status: 'SUCCESS', type: 'PAYMENT', isDeleted: false } },
                { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, total: { $sum: "$amount" }, count: { $sum: 1 } } },
                { $sort: { _id: -1 } },
                { $limit: 6 }
            ]),
            // Aging buckets
            Booking.aggregate([
                { $match: { isDeleted: false, remainingBalance: { $gt: 0 } } },
                { $addFields: { daysOverdue: { $divide: [{ $subtract: [new Date(), "$createdAt"] }, 1000 * 60 * 60 * 24] } } },
                { $facet: {
                    "0-7": [{ $match: { daysOverdue: { $lte: 7 } } }, { $count: "count" }],
                    "8-14": [{ $match: { daysOverdue: { $gt: 7, $lte: 14 } } }, { $count: "count" }],
                    "15-30": [{ $match: { daysOverdue: { $gt: 14, $lte: 30 } } }, { $count: "count" }],
                    "30+": [{ $match: { daysOverdue: { $gt: 30 } } }, { $count: "count" }]
                }}
            ])
        ]);

        const agingData = agingBucketsData[0] || {};

        return {
            totalRevenue: totalRevenueAgg[0]?.total || 0,
            pendingBalances: pendingBalancesAgg[0]?.total || 0,
            pendingCount: pendingBalancesAgg[0]?.count || 0,
            advancePaid: advancePaidAgg[0]?.total || 0,
            advanceCount: advancePaidAgg[0]?.count || 0,
            recentPayments: JSON.parse(JSON.stringify(recentPayments)),
            bookingsWithBalance: JSON.parse(JSON.stringify(bookingsWithBalance)),
            revenueByMonth: JSON.parse(JSON.stringify(revenueByMonth)),
            aging: {
                "0-7": agingData["0-7"]?.[0]?.count || 0,
                "8-14": agingData["8-14"]?.[0]?.count || 0,
                "15-30": agingData["15-30"]?.[0]?.count || 0,
                "30+": agingData["30+"]?.[0]?.count || 0,
            }
        };
    } catch (error) {
        console.error("Finance data fetch error:", error);
        return {
            totalRevenue: 0, pendingBalances: 0, pendingCount: 0,
            advancePaid: 0, advanceCount: 0, recentPayments: [], bookingsWithBalance: [],
            revenueByMonth: [], aging: { "0-7": 0, "8-14": 0, "15-30": 0, "30+": 0 }
        };
    }
}

export default async function FinancePage() {
    const data = await getFinanceData();

    const collectionRate = data.totalRevenue > 0 && data.pendingBalances > 0
        ? `${Math.round((data.totalRevenue / (data.totalRevenue + data.pendingBalances)) * 100)}%`
        : data.totalRevenue > 0 ? '100%' : '0%';

    const maxRevenue = Math.max(...data.revenueByMonth.map((m: any) => m.total), 1);

    const agingTotal = data.aging["0-7"] + data.aging["8-14"] + data.aging["15-30"] + data.aging["30+"];

    return (
        <div className="flex flex-col gap-6">
            <DashboardHero
                title="Finance"
                subtitle={`Collection rate: ${collectionRate}`}
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

            {/* Revenue Visualization */}
            <GlassPanel title="Revenue by Month (Last 6 Months)">
                <div className="flex items-end justify-between gap-3 h-48">
                    {data.revenueByMonth.length > 0 ? (
                        data.revenueByMonth.reverse().map((month: any, idx: number) => {
                            const height = (month.total / maxRevenue) * 100;
                            const monthLabel = new Date(month._id + "-01").toLocaleString('default', { month: 'short' });
                            return (
                                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                                    <div className="w-full flex items-end justify-center h-32">
                                        <div
                                            className="w-full bg-gradient-to-t from-antique-gold/40 to-antique-gold/20 rounded-t-lg border border-antique-gold/30 transition-all duration-300 hover:from-antique-gold/60 hover:to-antique-gold/40 hover:border-antique-gold/50"
                                            style={{ height: `${height}%`, minHeight: '8px' }}
                                            title={`LKR ${month.total.toLocaleString()}`}
                                        />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] font-semibold text-white/60">{monthLabel}</p>
                                        <p className="text-[9px] text-white/40">{month.count} txns</p>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="w-full text-center py-12 text-white/40">No payment data</div>
                    )}
                </div>
            </GlassPanel>

            {/* Aging Buckets */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                <div className="liquid-glass-stat-dark p-5 rounded-lg border border-blue-500/20">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[11px] font-medium text-white/50 tracking-wide uppercase">0-7 Days</p>
                        <Clock className="h-4 w-4 text-blue-400" />
                    </div>
                    <p className="text-2xl font-display font-bold text-blue-400">{data.aging["0-7"]}</p>
                    <span className="status-pill status-pill-info mt-2">Recent</span>
                </div>

                <div className="liquid-glass-stat-dark p-5 rounded-lg border border-amber-500/20">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[11px] font-medium text-white/50 tracking-wide uppercase">8-14 Days</p>
                        <CalendarClock className="h-4 w-4 text-amber-400" />
                    </div>
                    <p className="text-2xl font-display font-bold text-amber-400">{data.aging["8-14"]}</p>
                    <span className="status-pill status-pill-warning mt-2">Caution</span>
                </div>

                <div className="liquid-glass-stat-dark p-5 rounded-lg border border-orange-500/20">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[11px] font-medium text-white/50 tracking-wide uppercase">15-30 Days</p>
                        <AlertTriangle className="h-4 w-4 text-orange-400" />
                    </div>
                    <p className="text-2xl font-display font-bold text-orange-400">{data.aging["15-30"]}</p>
                    <span className="status-pill status-pill-warning mt-2">Overdue</span>
                </div>

                <div className="liquid-glass-stat-dark p-5 rounded-lg border border-red-500/20">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[11px] font-medium text-white/50 tracking-wide uppercase">30+ Days</p>
                        <AlertTriangle className="h-4 w-4 text-red-400" />
                    </div>
                    <p className="text-2xl font-display font-bold text-red-400">{data.aging["30+"]}</p>
                    <span className="status-pill status-pill-danger mt-2">Critical</span>
                </div>
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
