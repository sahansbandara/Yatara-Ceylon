'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CalendarCheck, Search, ArrowUpRight, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { DashboardHero } from '@/components/dashboard/DashboardHero';
import { EmptyStateCard } from '@/components/dashboard/EmptyStateCard';

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

const STATUSES = ['', 'NEW', 'PAYMENT_PENDING', 'CONTACTED', 'ADVANCE_PAID', 'CONFIRMED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

export default function BookingsPage() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        setLoading(true);
        const params = new URLSearchParams({ page: String(page), limit: '20' });
        if (search) params.set('search', search);
        if (statusFilter) params.set('status', statusFilter);

        const res = await fetch(`/api/bookings?${params}`);
        const data = await res.json();
        setBookings(data.bookings || []);
        setTotal(data.total || 0);
        setLoading(false);
    };

    useEffect(() => { fetchBookings(); }, [page, statusFilter]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchBookings();
    };

    return (
        <div className="flex flex-col gap-6">
            <DashboardHero
                title="Bookings"
                subtitle={`${total} total bookings across all statuses`}
            />

            {/* Filters */}
            <div className="liquid-glass-stat-dark rounded-2xl p-4 flex flex-col md:flex-row gap-3">
                <form onSubmit={handleSearch} className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                    <Input
                        placeholder="Search by name, phone, or booking #..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="pl-10 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/25 rounded-xl focus:border-antique-gold/30 focus:ring-antique-gold/10 h-10"
                    />
                </form>
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-white/30 flex-shrink-0" />
                    <select
                        value={statusFilter}
                        onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                        className="text-sm border border-white/[0.08] rounded-xl px-3 py-2 bg-white/[0.04] text-white/80 focus:outline-none focus:ring-2 focus:ring-antique-gold/20 focus:border-antique-gold/30 appearance-none w-full min-w-[140px] h-10"
                    >
                        <option value="">All Statuses</option>
                        {STATUSES.filter(Boolean).map(s => (
                            <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="dashboard-table-glass">
                {loading ? (
                    <div className="p-16 text-center">
                        <div className="inline-flex items-center gap-3">
                            <div className="w-5 h-5 border-2 border-antique-gold/30 border-t-antique-gold rounded-full animate-spin" />
                            <span className="text-sm text-white/40">Loading bookings...</span>
                        </div>
                    </div>
                ) : bookings.length === 0 ? (
                    <EmptyStateCard
                        icon={CalendarCheck}
                        title="No bookings found"
                        description="Try adjusting your search or filter criteria to find what you're looking for."
                    />
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-white/[0.03] border-b border-white/[0.06]">
                                        <th className="text-left px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold">Code</th>
                                        <th className="text-left px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold">Customer</th>
                                        <th className="text-left px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold hidden md:table-cell">Package</th>
                                        <th className="text-left px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold hidden lg:table-cell">Dates</th>
                                        <th className="text-right px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold">Total</th>
                                        <th className="text-right px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold hidden md:table-cell">Paid</th>
                                        <th className="text-right px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold hidden lg:table-cell">Due</th>
                                        <th className="text-center px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold">Status</th>
                                        <th className="px-3 py-3.5"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map((b) => (
                                        <tr key={b._id} className="border-b border-white/[0.04] last:border-b-0 hover:bg-antique-gold/[0.03] transition-colors">
                                            <td className="px-5 py-3.5">
                                                <span className="font-mono font-semibold text-white/75 text-xs">{b.bookingNo}</span>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <p className="font-medium text-white/85 text-xs">{b.customerName}</p>
                                                <p className="text-[10px] text-white/35 mt-0.5">{b.phone}</p>
                                            </td>
                                            <td className="px-5 py-3.5 hidden md:table-cell">
                                                <p className="text-xs text-white/50 truncate max-w-[150px]">{b.packageId?.title || b.type}</p>
                                            </td>
                                            <td className="px-5 py-3.5 hidden lg:table-cell">
                                                <p className="text-[10px] text-white/40">
                                                    {b.dates?.from ? new Date(b.dates.from).toLocaleDateString() : '—'}
                                                    {b.dates?.to ? ` → ${new Date(b.dates.to).toLocaleDateString()}` : ''}
                                                </p>
                                            </td>
                                            <td className="px-5 py-3.5 text-right">
                                                <span className="text-xs font-bold text-white/85">LKR {(b.totalCost || 0).toLocaleString()}</span>
                                            </td>
                                            <td className="px-5 py-3.5 text-right hidden md:table-cell">
                                                <span className="text-xs text-emerald-400/80">LKR {(b.paidAmount || 0).toLocaleString()}</span>
                                            </td>
                                            <td className="px-5 py-3.5 text-right hidden lg:table-cell">
                                                <span className={`text-xs ${(b.remainingBalance || 0) > 0 ? 'text-amber-400/80' : 'text-white/25'}`}>
                                                    LKR {(b.remainingBalance || 0).toLocaleString()}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 text-center">
                                                <span className={`status-pill ${STATUS_MAP[b.status] || 'status-pill-neutral'}`}>
                                                    {b.status?.replace(/_/g, ' ')}
                                                </span>
                                            </td>
                                            <td className="px-3 py-3.5">
                                                <Link href={`/dashboard/bookings/${b._id}`} className="inline-flex p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors">
                                                    <ArrowUpRight className="h-3.5 w-3.5 text-white/25 hover:text-antique-gold transition-colors" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {total > 20 && (
                            <div className="flex items-center justify-between px-5 py-4 border-t border-white/[0.06]">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="text-xs text-white/50 hover:text-antique-gold disabled:opacity-25 font-medium transition-colors px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08]"
                                >
                                    ← Previous
                                </button>
                                <span className="text-[11px] text-white/30">Page {page} of {Math.ceil(total / 20)}</span>
                                <button
                                    onClick={() => setPage(p => p + 1)}
                                    disabled={page >= Math.ceil(total / 20)}
                                    className="text-xs text-white/50 hover:text-antique-gold disabled:opacity-25 font-medium transition-colors px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08]"
                                >
                                    Next →
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
