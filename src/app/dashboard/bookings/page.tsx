'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CalendarCheck, Search, ArrowUpRight, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';

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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-display font-bold tracking-tight text-deep-emerald">Bookings</h1>
                    <p className="text-sm text-gray-500 font-light mt-1">{total} total bookings</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-3">
                <form onSubmit={handleSearch} className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search by name, phone, or booking #..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </form>
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-400" />
                    <select
                        value={statusFilter}
                        onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                        className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-antique-gold/30"
                    >
                        <option value="">All Statuses</option>
                        {STATUSES.filter(Boolean).map(s => (
                            <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="liquid-glass-stat rounded-2xl overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-400">Loading bookings...</div>
                ) : bookings.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">No bookings found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/50">
                                    <th className="text-left px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-gray-400 font-medium">Code</th>
                                    <th className="text-left px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-gray-400 font-medium">Customer</th>
                                    <th className="text-left px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-gray-400 font-medium hidden md:table-cell">Package</th>
                                    <th className="text-left px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-gray-400 font-medium hidden lg:table-cell">Dates</th>
                                    <th className="text-right px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-gray-400 font-medium">Total</th>
                                    <th className="text-right px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-gray-400 font-medium hidden md:table-cell">Paid</th>
                                    <th className="text-right px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-gray-400 font-medium hidden lg:table-cell">Balance</th>
                                    <th className="text-center px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-gray-400 font-medium">Status</th>
                                    <th className="px-4 py-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map(b => (
                                    <tr key={b._id} className="border-b border-gray-50 hover:bg-white/60 transition-colors">
                                        <td className="px-4 py-3">
                                            <span className="font-mono font-semibold text-deep-emerald text-xs">{b.bookingNo}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="font-medium text-deep-emerald text-xs">{b.customerName}</p>
                                            <p className="text-[10px] text-gray-400">{b.phone}</p>
                                        </td>
                                        <td className="px-4 py-3 hidden md:table-cell">
                                            <p className="text-xs text-gray-600 truncate max-w-[150px]">{b.packageId?.title || b.type}</p>
                                        </td>
                                        <td className="px-4 py-3 hidden lg:table-cell">
                                            <p className="text-[10px] text-gray-500">
                                                {b.dates?.from ? new Date(b.dates.from).toLocaleDateString() : '—'}
                                                {b.dates?.to ? ` → ${new Date(b.dates.to).toLocaleDateString()}` : ''}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <span className="text-xs font-semibold text-deep-emerald">${(b.totalCost || 0).toLocaleString()}</span>
                                        </td>
                                        <td className="px-4 py-3 text-right hidden md:table-cell">
                                            <span className="text-xs text-emerald-600">${(b.paidAmount || 0).toLocaleString()}</span>
                                        </td>
                                        <td className="px-4 py-3 text-right hidden lg:table-cell">
                                            <span className={`text-xs ${(b.remainingBalance || 0) > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
                                                ${(b.remainingBalance || 0).toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[b.status] || 'bg-gray-100 text-gray-600'}`}>
                                                {b.status?.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Link href={`/dashboard/bookings/${b._id}`}>
                                                <ArrowUpRight className="h-4 w-4 text-gray-300 hover:text-antique-gold transition-colors" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {total > 20 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="text-xs text-gray-500 hover:text-deep-emerald disabled:opacity-30"
                        >
                            ← Previous
                        </button>
                        <span className="text-xs text-gray-400">Page {page} of {Math.ceil(total / 20)}</span>
                        <button
                            onClick={() => setPage(p => p + 1)}
                            disabled={page >= Math.ceil(total / 20)}
                            className="text-xs text-gray-500 hover:text-deep-emerald disabled:opacity-30"
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
