'use client';

import { DollarSign, FileText, RefreshCcw } from 'lucide-react';

interface FinanceStatsProps {
    revenue: number;
    pendingInvoices: number;
    totalRefunds: number;
}

export default function FinanceStats({ revenue, pendingInvoices, totalRefunds }: FinanceStatsProps) {
    return (
        <div className="grid gap-5 md:grid-cols-3 mb-8">
            {/* Total Revenue */}
            <div className="liquid-glass-stat-dark p-6 rounded-2xl border border-white/[0.08] shadow-2xl relative overflow-hidden group hover:border-antique-gold/20 transition-all duration-500 hover:shadow-[0_0_30px_rgba(212,175,55,0.05)]">
                <div className="flex flex-row items-center justify-between pb-4">
                    <h3 className="text-[13px] font-semibold uppercase tracking-wider text-white/60">Total Revenue</h3>
                    <div className="h-10 w-10 rounded-full bg-antique-gold/10 flex items-center justify-center border border-antique-gold/20 shadow-[0_0_15px_rgba(212,175,55,0.15)] group-hover:scale-110 transition-transform duration-500">
                        <DollarSign className="h-5 w-5 text-antique-gold drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]" />
                    </div>
                </div>
                <div>
                    <div className="text-3xl font-bold tracking-tight text-white mb-1">
                        Rs {(revenue ?? 0).toLocaleString()}
                    </div>
                    <p className="text-xs font-medium text-white/40">Lifetime earnings</p>
                </div>
            </div>

            {/* Pending Invoices */}
            <div className="liquid-glass-stat-dark p-6 rounded-2xl border border-white/[0.08] shadow-2xl relative overflow-hidden group hover:border-blue-400/20 transition-all duration-500 hover:shadow-[0_0_30px_rgba(96,165,250,0.05)]">
                <div className="flex flex-row items-center justify-between pb-4">
                    <h3 className="text-[13px] font-semibold uppercase tracking-wider text-white/60">Draft Invoices</h3>
                    <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-400/20 shadow-[0_0_15px_rgba(96,165,250,0.15)] group-hover:scale-110 transition-transform duration-500">
                        <FileText className="h-5 w-5 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
                    </div>
                </div>
                <div>
                    <div className="text-3xl font-bold tracking-tight text-white mb-1">
                        {pendingInvoices}
                    </div>
                    <p className="text-xs font-medium text-white/40">Invoices pending finalization</p>
                </div>
            </div>

            {/* Total Refunds */}
            <div className="liquid-glass-stat-dark p-6 rounded-2xl border border-white/[0.08] shadow-2xl relative overflow-hidden group hover:border-red-400/20 transition-all duration-500 hover:shadow-[0_0_30px_rgba(248,113,113,0.05)]">
                <div className="flex flex-row items-center justify-between pb-4">
                    <h3 className="text-[13px] font-semibold uppercase tracking-wider text-white/60">Total Refunds</h3>
                    <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center border border-red-400/20 shadow-[0_0_15px_rgba(248,113,113,0.15)] group-hover:scale-110 transition-transform duration-500">
                        <RefreshCcw className="h-5 w-5 text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.5)]" />
                    </div>
                </div>
                <div>
                    <div className="text-3xl font-bold tracking-tight text-white mb-1">
                        Rs {(totalRefunds ?? 0).toLocaleString()}
                    </div>
                    <p className="text-xs font-medium text-white/40">Processed refunds</p>
                </div>
            </div>
        </div>
    );
}
