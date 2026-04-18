import { FinanceService } from '@/services/finance.service';
import { formatLKR } from "@/lib/currency";
import { DollarSign, TrendingUp, CreditCard, AlertTriangle, ArrowUpRight, Receipt, Clock, CalendarClock, Download } from "lucide-react";
import Link from "next/link";
import { DashboardHero } from "@/components/dashboard/DashboardHero";
import { StatCard } from "@/components/dashboard/StatCard";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { EmptyStateCard } from "@/components/dashboard/EmptyStateCard";
import FinanceDateFilter from "@/components/dashboard/finance/FinanceDateFilter";
import GenerateAuditReportModal from "@/components/dashboard/finance/GenerateAuditReportModal";
import { buildMonthBuckets } from "@/lib/date-range";

export default async function FinancePage({
    searchParams,
}: {
    searchParams: Promise<{ from?: string; to?: string; preset?: string }>;
}) {
    const params = await searchParams;
    const data = await FinanceService.getFinanceData(params.from, params.to);

    const collectionRate = data.totalRevenue > 0 && data.pendingBalances > 0
        ? `${Math.round((data.totalRevenue / (data.totalRevenue + data.pendingBalances)) * 100)}%`
        : data.totalRevenue > 0 ? '100%' : '0%';

    const revenueChartData = params.from && params.to
        ? buildMonthBuckets(params.from, params.to).map((bucket) => {
            const bucketKey = `${bucket.year}-${String(bucket.month).padStart(2, '0')}`;
            const record = data.revenueByMonth.find((month: any) => month._id === bucketKey);

            return {
                label: bucket.label,
                total: record?.total || 0,
                count: record?.count || 0,
            };
        })
        : data.revenueByMonth.map((month: any) => ({
            label: new Date(`${month._id}-01T00:00:00.000Z`).toLocaleString('default', { month: 'short' }),
            total: month.total,
            count: month.count,
        }));

    const maxRevenue = Math.max(...revenueChartData.map((month: any) => month.total), 1);

    const agingTotal = data.aging["0-7"] + data.aging["8-14"] + data.aging["15-30"] + data.aging["30+"];

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <DashboardHero
                    title="Finance"
                    subtitle={`Collection rate: ${collectionRate}`}
                />
                <GenerateAuditReportModal />
            </div>

            {/* Date Range Filter */}
            <FinanceDateFilter
                currentFrom={params.from}
                currentTo={params.to}
                currentPreset={params.preset}
            />

            {/* KPI Cards */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Collected"
                    value={formatLKR(data.totalRevenue)}
                    icon={DollarSign}
                    accentColor="text-emerald-400"
                />
                <StatCard
                    title="Advances"
                    value={formatLKR(data.advancePaid)}
                    icon={TrendingUp}
                    accentColor="text-blue-400"
                    trend={{ value: `${data.advanceCount} bookings`, positive: true }}
                />
                <StatCard
                    title="Pending"
                    value={formatLKR(data.pendingBalances)}
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

            <div className="grid gap-4 md:grid-cols-3">
                <div className="liquid-glass-stat-dark rounded-2xl p-5 border border-white/[0.06]">
                    <p className="text-[11px] font-medium text-white/50 tracking-wide uppercase">Draft Invoices</p>
                    <p className="mt-2 text-2xl font-display font-bold text-amber-300">{data.invoiceSummary.DRAFT}</p>
                    <p className="mt-1 text-xs text-white/35">Awaiting finance finalization</p>
                </div>
                <div className="liquid-glass-stat-dark rounded-2xl p-5 border border-emerald-500/15">
                    <p className="text-[11px] font-medium text-white/50 tracking-wide uppercase">Final Invoices</p>
                    <p className="mt-2 text-2xl font-display font-bold text-emerald-300">{data.invoiceSummary.FINAL}</p>
                    <p className="mt-1 text-xs text-white/35">Actively billable documents</p>
                </div>
                <div className="liquid-glass-stat-dark rounded-2xl p-5 border border-red-500/15">
                    <p className="text-[11px] font-medium text-white/50 tracking-wide uppercase">Void Invoices</p>
                    <p className="mt-2 text-2xl font-display font-bold text-red-300">{data.invoiceSummary.VOID}</p>
                    <p className="mt-1 text-xs text-white/35">Cancelled or superseded bills</p>
                </div>
            </div>

            {/* Revenue Visualization */}
            <GlassPanel title={params.from || params.to ? "Revenue by Month" : "Revenue by Month (Last 6 Months)"}>
                <div className="flex items-end justify-between gap-3 h-48">
                    {revenueChartData.length > 0 ? (
                        revenueChartData.map((month: any, idx: number) => {
                            const height = (month.total / maxRevenue) * 100;
                            return (
                                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                                    <div className="w-full flex items-end justify-center h-32">
                                        <div
                                            className="w-full bg-gradient-to-t from-antique-gold/40 to-antique-gold/20 rounded-t-lg border border-antique-gold/30 transition-all duration-300 hover:from-antique-gold/60 hover:to-antique-gold/40 hover:border-antique-gold/50"
                                            style={{ height: `${height}%`, minHeight: '8px' }}
                                            title={formatLKR(month.total)}
                                        />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] font-semibold text-white/60">{month.label}</p>
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

            {/* Pending Refunds (High Priority) */}
            {data.pendingRefunds && data.pendingRefunds.length > 0 && (
                <GlassPanel
                    title="Action Required: Pending Refunds"
                    subtitle="These bookings have been cancelled but refunds are pending. Please process the refunds and update their status."
                >
                    <div className="space-y-2">
                        {data.pendingRefunds.map((b: any) => (
                            <Link
                                key={b._id}
                                href={`/dashboard/bookings/${b._id}`}
                                className="flex items-center justify-between px-4 py-3 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 transition-all duration-300 group"
                            >
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 text-orange-400" />
                                        <p className="text-xs font-mono font-medium text-white/80">{b.bookingNo}</p>
                                    </div>
                                    <p className="text-[10px] text-white/40 mt-0.5">{b.customerName}</p>
                                </div>
                                <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                                    <div className="text-right">
                                        <p className="text-[10px] text-white/35">Total Cost: {formatLKR(b.totalCost || 0)}</p>
                                        <p className="text-sm font-bold text-orange-400">Refund: {formatLKR(b.paidAmount || 0)}</p>
                                    </div>
                                    <ArrowUpRight className="h-4 w-4 text-orange-400/50 group-hover:text-orange-400 transition-colors" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </GlassPanel>
            )}

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
                                        <p className="text-sm font-bold text-white/85">{formatLKR(p.amount || 0)}</p>
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
                <GlassPanel
                    title="Outstanding Balances"
                    subtitle="Current bookings needing finance follow-up appear first."
                >
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
                                        <p className="text-[10px] text-white/25 mt-0.5">
                                            {b.status}
                                            {b.dates?.from ? ` · departs ${new Date(b.dates.from).toLocaleDateString()}` : ''}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                                        <div className="text-right">
                                            <p className="text-[10px] text-white/35">Paid: {formatLKR(b.paidAmount || 0)}</p>
                                            <p className="text-sm font-bold text-amber-400">Due: {formatLKR(b.remainingBalance || 0)}</p>
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

            <GlassPanel title="Recent Invoices">
                {data.recentInvoices.length > 0 ? (
                    <div className="space-y-2">
                        {data.recentInvoices.map((invoice: any) => (
                            <Link
                                key={invoice._id}
                                href={`/dashboard/finance/invoices/${invoice._id}`}
                                className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-3 transition-all duration-300 hover:bg-white/[0.05] group"
                            >
                                <div className="min-w-0">
                                    <p className="text-xs font-mono font-medium text-white/80">{invoice.invoiceNo}</p>
                                    <p className="mt-0.5 text-[10px] text-white/40">
                                        {(invoice.bookingId as any)?.bookingNo || '—'} · {(invoice.bookingId as any)?.customerName || '—'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-white/85">{formatLKR(invoice.total || 0)}</p>
                                        <span className={`status-pill mt-1 ${invoice.status === 'FINAL' ? 'status-pill-success' : invoice.status === 'VOID' ? 'status-pill-danger' : 'status-pill-warning'}`}>
                                            {invoice.status}
                                        </span>
                                    </div>
                                    <ArrowUpRight className="h-4 w-4 text-white/20 transition-colors group-hover:text-antique-gold" />
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <EmptyStateCard
                        icon={Receipt}
                        title="No invoices generated"
                        description="Finalized and draft invoices will appear here once finance starts billing bookings."
                    />
                )}
            </GlassPanel>
        </div>
    );
}
