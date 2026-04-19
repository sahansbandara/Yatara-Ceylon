'use client';

import { useState, useEffect, useCallback } from 'react';
import { formatLKR } from '@/lib/currency';
import Link from 'next/link';
import { Search, Logs, Eye, DollarSign, Clock, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';

const STATUS_STYLES: Record<string, string> = {
    NEW: 'bg-blue-500/15 text-blue-300',
    PAYMENT_PENDING: 'bg-yellow-500/15 text-yellow-300',
    ADVANCE_PAID: 'bg-emerald-500/15 text-emerald-300',
    CONFIRMED: 'bg-green-500/15 text-green-300',
    ASSIGNED: 'bg-purple-500/15 text-purple-300',
    IN_PROGRESS: 'bg-indigo-500/15 text-indigo-300',
    COMPLETED: 'bg-white/10 text-white/60',
    CANCELLED: 'bg-red-500/15 text-red-300',
    CONTACTED: 'bg-sky-500/15 text-sky-300',
    REFUND_PENDING: 'bg-orange-500/15 text-orange-300',
    REFUNDED: 'bg-pink-500/15 text-pink-300',
    BALANCE_PENDING: 'bg-amber-500/15 text-amber-300',
};

const TABS = [
    { key: '', label: 'All', icon: Logs },
    { key: 'NEW', label: 'New', icon: AlertCircle },
    { key: 'PAYMENT_PENDING', label: 'Awaiting Payment', icon: Clock },
    { key: 'ADVANCE_PAID', label: 'Advance Paid', icon: DollarSign },
    { key: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle },
    { key: 'COMPLETED', label: 'Completed', icon: CheckCircle },
    { key: 'CANCELLED', label: 'Cancelled', icon: XCircle },
];

interface Booking {
    _id: string;
    bookingNo: string;
    customerName: string;
    email: string;
    phone: string;
    pax: number;
    dates: { from: string; to: string };
    status: string;
    totalCost: number;
    paidAmount: number;
    remainingBalance: number;
    createdAt: string;
    customPlanId?: any;
    packageId?: any;
}

export default function CustomBookingsClient() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ type: 'CUSTOM', page: String(page), limit: '15' });
            if (statusFilter) params.set('status', statusFilter);
            if (search) params.set('search', search);

            const res = await fetch(`/api/bookings?${params}`);
            const data = await res.json();
            setBookings(data.bookings || []);
            setTotalPages(data.totalPages || 1);
            setTotal(data.total || 0);
        } catch {
            setBookings([]);
        } finally {
            setLoading(false);
        }
    }, [page, statusFilter, search]);

    useEffect(() => { fetchBookings(); }, [fetchBookings]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold tracking-tight text-white drop-shadow-sm">Custom Plan Bookings</h1>
                    <p className="text-sm text-white/40 font-light mt-1">
                        {total} bespoke tour {total === 1 ? 'booking' : 'bookings'}
                    </p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                        placeholder="Search by name, phone, booking no..."
                        className="pl-9 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-off-white placeholder-white/30 w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-antique-gold/30 focus:border-antique-gold/20 transition-all"
                    />
                </div>
            </div>

            {/* Status Tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-glass-dark">
                {TABS.map(tab => {
                    const Icon = tab.icon;
                    const isActive = statusFilter === tab.key;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => { setStatusFilter(tab.key); setPage(1); }}
                            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 border ${
                                isActive
                                    ? 'bg-antique-gold/15 text-antique-gold border-antique-gold/25 shadow-[0_0_12px_rgba(212,175,55,0.1)]'
                                    : 'text-white/40 hover:text-white/60 bg-white/[0.02] hover:bg-white/[0.05] border-white/[0.05]'
                            }`}
                        >
                            <Icon className="h-3.5 w-3.5" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-6 w-6 animate-spin text-antique-gold/60" />
                </div>
            ) : bookings.length === 0 ? (
                <div className="liquid-glass-stat-dark rounded-2xl p-12 text-center">
                    <Logs className="h-10 w-10 text-white/15 mx-auto mb-3" />
                    <p className="text-white/40 text-sm">No custom plan bookings found.</p>
                </div>
            ) : (
                <div className="liquid-glass-stat-dark rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/[0.06]">
                                    <th className="text-left px-4 py-3 text-[10px] text-white/30 uppercase tracking-widest font-semibold">Booking</th>
                                    <th className="text-left px-4 py-3 text-[10px] text-white/30 uppercase tracking-widest font-semibold">Customer</th>
                                    <th className="text-left px-4 py-3 text-[10px] text-white/30 uppercase tracking-widest font-semibold">Dates</th>
                                    <th className="text-right px-4 py-3 text-[10px] text-white/30 uppercase tracking-widest font-semibold">Total</th>
                                    <th className="text-right px-4 py-3 text-[10px] text-white/30 uppercase tracking-widest font-semibold">Paid</th>
                                    <th className="text-right px-4 py-3 text-[10px] text-white/30 uppercase tracking-widest font-semibold">Due</th>
                                    <th className="text-center px-4 py-3 text-[10px] text-white/30 uppercase tracking-widest font-semibold">Status</th>
                                    <th className="text-center px-4 py-3 text-[10px] text-white/30 uppercase tracking-widest font-semibold">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.04]">
                                {bookings.map(b => (
                                    <tr key={b._id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-4 py-3">
                                            <p className="text-xs font-mono font-semibold text-off-white">{b.bookingNo}</p>
                                            <p className="text-[10px] text-white/30 mt-0.5">{new Date(b.createdAt).toLocaleDateString()}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-xs font-medium text-off-white">{b.customerName}</p>
                                            <p className="text-[10px] text-white/30">{b.email || b.phone}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-xs text-white/70">
                                                {b.dates?.from ? new Date(b.dates.from).toLocaleDateString() : '—'} →{' '}
                                                {b.dates?.to ? new Date(b.dates.to).toLocaleDateString() : '—'}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <p className="text-xs font-semibold text-off-white">{formatLKR(b.totalCost || 0)}</p>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <p className="text-xs text-emerald-400">{formatLKR(b.paidAmount || 0)}</p>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <p className={`text-xs font-semibold ${(b.remainingBalance || 0) > 0 ? 'text-orange-400' : 'text-white/40'}`}>
                                                {formatLKR(b.remainingBalance || 0)}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[b.status] || 'bg-white/10 text-white/50'}`}>
                                                {b.status?.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <Link
                                                href={`/dashboard/bookings/${b._id}`}
                                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold text-antique-gold bg-antique-gold/10 hover:bg-antique-gold/20 border border-antique-gold/20 transition-colors"
                                            >
                                                <Eye className="h-3 w-3" /> View
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.06]">
                            <p className="text-[10px] text-white/30">Page {page} of {totalPages}</p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page <= 1}
                                    className="px-3 py-1.5 rounded-lg text-xs text-white/50 bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-30 transition-colors"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page >= totalPages}
                                    className="px-3 py-1.5 rounded-lg text-xs text-white/50 bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-30 transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
