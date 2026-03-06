import connectDB from "@/lib/mongodb";
import Payment from "@/models/Payment";
import Booking from "@/models/Booking";
import { DollarSign, TrendingUp, CreditCard, AlertTriangle, ArrowUpRight } from "lucide-react";
import Link from "next/link";

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

    return (
        <div className="flex flex-col gap-8 text-slate-800">
            <div>
                <h1 className="text-3xl font-display font-bold tracking-tight text-slate-900">Finance Dashboard</h1>
                <p className="text-sm text-slate-500 font-light mt-1">Payment tracking and financial overview</p>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <div className="liquid-glass-stat rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-gray-600">Total Collected</p>
                        <DollarSign className="h-5 w-5 text-emerald-600" />
                    </div>
                    <p className="text-2xl font-display font-bold text-emerald-700">${data.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="liquid-glass-stat rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-gray-600">Advances Received</p>
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="text-2xl font-display font-bold text-blue-700">${data.advancePaid.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{data.advanceCount} bookings with advances</p>
                </div>
                <div className="liquid-glass-stat rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-gray-600">Pending Balances</p>
                        <AlertTriangle className="h-5 w-5 text-orange-600" />
                    </div>
                    <p className="text-2xl font-display font-bold text-orange-700">${data.pendingBalances.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{data.pendingCount} bookings with balance due</p>
                </div>
                <div className="liquid-glass-stat rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-gray-600">Collection Rate</p>
                        <CreditCard className="h-5 w-5 text-purple-600" />
                    </div>
                    <p className="text-2xl font-display font-bold text-purple-700">
                        {data.totalRevenue > 0 && data.pendingBalances > 0
                            ? `${Math.round((data.totalRevenue / (data.totalRevenue + data.pendingBalances)) * 100)}%`
                            : data.totalRevenue > 0 ? '100%' : '0%'}
                    </p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Payments */}
                <div className="liquid-glass-stat rounded-2xl p-6">
                    <h3 className="text-lg font-display font-semibold text-deep-emerald mb-4">Recent Payments</h3>
                    {data.recentPayments.length > 0 ? (
                        <div className="space-y-2">
                            {data.recentPayments.map((p: any) => (
                                <div key={p._id} className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/50 border border-gray-100">
                                    <div>
                                        <p className="text-xs font-mono font-semibold text-deep-emerald">{p.orderId}</p>
                                        <p className="text-[10px] text-gray-400">
                                            {(p.bookingId as any)?.bookingNo || '—'} · {(p.bookingId as any)?.customerName || '—'}
                                        </p>
                                        <p className="text-[10px] text-gray-300">{new Date(p.createdAt).toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-deep-emerald">${(p.amount || 0).toLocaleString()}</p>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${p.status === 'SUCCESS' ? 'bg-green-100 text-green-700' : p.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                            {p.status} · {p.provider}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 italic">No payment records yet.</p>
                    )}
                </div>

                {/* Bookings with Outstanding Balance */}
                <div className="liquid-glass-stat rounded-2xl p-6">
                    <h3 className="text-lg font-display font-semibold text-deep-emerald mb-4">Outstanding Balances</h3>
                    {data.bookingsWithBalance.length > 0 ? (
                        <div className="space-y-2">
                            {data.bookingsWithBalance.map((b: any) => (
                                <Link
                                    key={b._id}
                                    href={`/dashboard/bookings/${b._id}`}
                                    className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/50 border border-gray-100 hover:bg-white/80 transition-colors group"
                                >
                                    <div>
                                        <p className="text-xs font-mono font-semibold text-deep-emerald">{b.bookingNo}</p>
                                        <p className="text-[10px] text-gray-400">{b.customerName}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <p className="text-[10px] text-gray-400">Paid: ${(b.paidAmount || 0).toLocaleString()}</p>
                                            <p className="text-sm font-bold text-orange-600">Due: ${(b.remainingBalance || 0).toLocaleString()}</p>
                                        </div>
                                        <ArrowUpRight className="h-4 w-4 text-gray-300 group-hover:text-antique-gold transition-colors" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 italic">All balances are settled.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
