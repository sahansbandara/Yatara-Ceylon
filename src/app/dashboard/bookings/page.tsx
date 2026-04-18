'use client';

import { formatLKR, formatLKRCompact } from '@/lib/currency';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CalendarCheck, Search, Eye, MessageSquare, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, CheckSquare, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { DashboardHero } from '@/components/dashboard/DashboardHero';
import { EmptyStateCard } from '@/components/dashboard/EmptyStateCard';
import { StatCard } from '@/components/dashboard/StatCard';

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

const STATUS_DISPLAY_NAMES: Record<string, string> = {
    NEW: 'New',
    CONTACTED: 'Contacted',
    PAYMENT_PENDING: 'Payment Pending',
    ADVANCE_PAID: 'Advance Paid',
    CONFIRMED: 'Confirmed',
    ASSIGNED: 'Assigned',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
};

const ALL_STATUSES = ['NEW', 'CONTACTED', 'PAYMENT_PENDING', 'ADVANCE_PAID', 'CONFIRMED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

interface BookingSummary {
    totalBookings: number;
    totalRevenue: number;
    pendingBalance: number;
    avgBookingValue: number;
}

interface StatusCount {
    status: string;
    count: number;
}

export default function BookingsPage() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [hasBalanceDue, setHasBalanceDue] = useState(false);
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [bulkLoading, setBulkLoading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
    const [summary, setSummary] = useState<BookingSummary>({
        totalBookings: 0,
        totalRevenue: 0,
        pendingBalance: 0,
        avgBookingValue: 0,
    });

    // Fetch status counts on mount
    const fetchStatusCounts = async () => {
        try {
            const counts: Record<string, number> = { all: 0 };
            const countPromises = ALL_STATUSES.map(status =>
                fetch(`/api/bookings?status=${status}&limit=1`)
                    .then(r => r.json())
                    .then(data => {
                        counts[status] = data.total || 0;
                        counts.all += data.total || 0;
                        return { status, count: data.total || 0 };
                    })
                    .catch(() => {
                        counts[status] = 0;
                        return { status, count: 0 };
                    })
            );
            await Promise.all(countPromises);
            setStatusCounts(counts);
        } catch (error) {
            console.error('Error fetching status counts:', error);
        }
    };

    // Fetch bookings with current filters
    const fetchBookings = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page: String(page), limit: '20' });
            if (search) params.set('search', search);
            if (statusFilter) params.set('status', statusFilter);
            if (dateFrom) params.set('dateFrom', dateFrom);
            if (dateTo) params.set('dateTo', dateTo);
            if (hasBalanceDue) params.set('hasBalanceDue', 'true');
            if (sortBy) params.set('sortBy', sortBy);
            if (sortOrder) params.set('sortOrder', sortOrder);

            const res = await fetch(`/api/bookings?${params}`);
            const data = await res.json();
            setBookings(data.bookings || []);
            setTotal(data.total || 0);

            // Calculate summary from the fetched bookings
            const filteredBookings = data.bookings || [];
            const totalRevenue = filteredBookings.reduce((sum: number, b: any) => sum + (b.totalCost || 0), 0);
            const pendingBalance = filteredBookings.reduce((sum: number, b: any) => sum + (b.remainingBalance || 0), 0);
            const avgValue = filteredBookings.length > 0 ? totalRevenue / filteredBookings.length : 0;

            setSummary({
                totalBookings: data.total || 0,
                totalRevenue,
                pendingBalance,
                avgBookingValue: avgValue,
            });
        } catch (error) {
            console.error('Error fetching bookings:', error);
            setBookings([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatusCounts();
    }, []);

    useEffect(() => {
        setPage(1);
        fetchBookings();
    }, [statusFilter, search, dateFrom, dateTo, hasBalanceDue, sortBy, sortOrder]);

    useEffect(() => {
        fetchBookings();
    }, [page]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchBookings();
    };

    const handleStatusTabClick = (status: string) => {
        setStatusFilter(status === statusFilter ? '' : status);
    };

    const handleSort = (field: string) => {
        if (sortBy === field) {
            setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('desc');
        }
        setPage(1);
    };

    const SortIcon = ({ field }: { field: string }) => {
        if (sortBy !== field) return <ArrowUpDown className="h-3 w-3 ml-1 opacity-30" />;
        return sortOrder === 'asc'
            ? <ArrowUp className="h-3 w-3 ml-1 text-antique-gold" />
            : <ArrowDown className="h-3 w-3 ml-1 text-antique-gold" />;
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === bookings.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(bookings.map(b => b._id)));
        }
    };

    const handleBulkStatusUpdate = async (newStatus: string) => {
        if (selectedIds.size === 0) return;
        if (!confirm(`Update ${selectedIds.size} booking(s) to "${STATUS_DISPLAY_NAMES[newStatus] || newStatus}"?`)) return;

        setBulkLoading(true);
        try {
            const res = await fetch('/api/bookings/bulk', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookingIds: Array.from(selectedIds), status: newStatus }),
            });
            if (!res.ok) throw new Error('Bulk update failed');
            setSelectedIds(new Set());
            fetchBookings();
            fetchStatusCounts();
        } catch (error) {
            console.error(error);
            alert('Failed to update bookings');
        } finally {
            setBulkLoading(false);
        }
    };

    const maxPage = Math.ceil(total / 20);
    const totalPages = maxPage || 1;

    return (
        <div className="flex flex-col gap-6">
            {/* Hero Section */}
            <DashboardHero
                title="Bookings"
                subtitle={`${statusCounts.all || total} total bookings • ${statusCounts['PAYMENT_PENDING'] || 0} pending payments`}
            />

            {/* Status Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6">
                <button
                    onClick={() => handleStatusTabClick('')}
                    className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                        statusFilter === ''
                            ? 'border-antique-gold text-antique-gold'
                            : 'border-transparent text-white/40 hover:text-white/60'
                    }`}
                >
                    All <span className="text-[11px] text-white/30 ml-1">({statusCounts.all || 0})</span>
                </button>
                {ALL_STATUSES.map(status => (
                    <button
                        key={status}
                        onClick={() => handleStatusTabClick(status)}
                        className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                            statusFilter === status
                                ? 'border-antique-gold text-antique-gold'
                                : 'border-transparent text-white/40 hover:text-white/60'
                        }`}
                    >
                        {STATUS_DISPLAY_NAMES[status]} <span className="text-[11px] text-white/30 ml-1">({statusCounts[status] || 0})</span>
                    </button>
                ))}
            </div>

            {/* KPI Summary Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Bookings"
                    value={summary.totalBookings.toString()}
                    icon={CalendarCheck}
                    accentColor="text-blue-400"
                />
                <StatCard
                    title="Total Revenue"
                    value={formatLKRCompact(summary.totalRevenue)}
                    icon={CalendarCheck}
                    accentColor="text-emerald-400"
                />
                <StatCard
                    title="Pending Balance"
                    value={formatLKRCompact(summary.pendingBalance)}
                    icon={CalendarCheck}
                    accentColor="text-amber-400"
                />
                <StatCard
                    title="Avg Booking Value"
                    value={formatLKRCompact(summary.avgBookingValue)}
                    icon={CalendarCheck}
                    accentColor="text-purple-400"
                />
            </div>

            {/* Filter Bar */}
            <div className="liquid-glass-stat-dark rounded-2xl p-4 flex flex-col lg:flex-row gap-4">
                <form onSubmit={handleSearch} className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                    <Input
                        placeholder="Search by name, phone, or booking #..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="pl-10 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/25 rounded-xl focus:border-antique-gold/30 focus:ring-antique-gold/10 h-10"
                    />
                </form>

                <div className="flex gap-2 lg:gap-3">
                    <input
                        type="date"
                        value={dateFrom}
                        onChange={e => setDateFrom(e.target.value)}
                        className="text-sm border border-white/[0.08] rounded-xl px-3 py-2 bg-white/[0.04] text-white focus:outline-none focus:ring-2 focus:ring-antique-gold/20 focus:border-antique-gold/30 h-10"
                        placeholder="From"
                    />
                    <input
                        type="date"
                        value={dateTo}
                        onChange={e => setDateTo(e.target.value)}
                        className="text-sm border border-white/[0.08] rounded-xl px-3 py-2 bg-white/[0.04] text-white focus:outline-none focus:ring-2 focus:ring-antique-gold/20 focus:border-antique-gold/30 h-10"
                        placeholder="To"
                    />
                    <label className="flex items-center gap-2 px-3 py-2 border border-white/[0.08] rounded-xl bg-white/[0.04] cursor-pointer hover:bg-white/[0.08] transition-colors h-10">
                        <input
                            type="checkbox"
                            checked={hasBalanceDue}
                            onChange={e => setHasBalanceDue(e.target.checked)}
                            className="w-4 h-4 rounded accent-antique-gold"
                        />
                        <span className="text-sm text-white/60">Has balance</span>
                    </label>
                </div>
            </div>

            {/* Bulk Action Bar */}
            {selectedIds.size > 0 && (
                <div className="liquid-glass-stat-dark rounded-2xl p-3 flex items-center gap-3 border border-antique-gold/20 animate-in fade-in">
                    <div className="flex items-center gap-2 px-2">
                        <CheckSquare className="h-4 w-4 text-antique-gold" />
                        <span className="text-xs font-medium text-antique-gold">{selectedIds.size} selected</span>
                    </div>
                    <div className="h-4 w-px bg-white/10" />
                    <span className="text-[10px] text-white/40">Move to:</span>
                    <div className="flex gap-1.5 flex-wrap">
                        {ALL_STATUSES.map(s => (
                            <button
                                key={s}
                                onClick={() => handleBulkStatusUpdate(s)}
                                disabled={bulkLoading}
                                className="px-2.5 py-1 text-[10px] font-medium rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/50 hover:bg-white/[0.08] hover:text-white/70 transition-colors disabled:opacity-30"
                            >
                                {STATUS_DISPLAY_NAMES[s]}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setSelectedIds(new Set())}
                        className="ml-auto p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors"
                        title="Clear selection"
                    >
                        <X className="h-3.5 w-3.5 text-white/30" />
                    </button>
                </div>
            )}

            {/* Main Table */}
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
                                        <th className="px-3 py-3.5 w-10">
                                            <input
                                                type="checkbox"
                                                checked={bookings.length > 0 && selectedIds.size === bookings.length}
                                                onChange={toggleSelectAll}
                                                className="w-3.5 h-3.5 rounded accent-antique-gold cursor-pointer"
                                            />
                                        </th>
                                        <th onClick={() => handleSort('bookingNo')} className="text-left px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold cursor-pointer hover:text-white/50 select-none">
                                            <span className="inline-flex items-center">Code<SortIcon field="bookingNo" /></span>
                                        </th>
                                        <th onClick={() => handleSort('customerName')} className="text-left px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold cursor-pointer hover:text-white/50 select-none">
                                            <span className="inline-flex items-center">Customer<SortIcon field="customerName" /></span>
                                        </th>
                                        <th className="text-left px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold hidden md:table-cell">Package</th>
                                        <th onClick={() => handleSort('dates.from')} className="text-left px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold hidden lg:table-cell cursor-pointer hover:text-white/50 select-none">
                                            <span className="inline-flex items-center">Dates<SortIcon field="dates.from" /></span>
                                        </th>
                                        <th onClick={() => handleSort('totalCost')} className="text-right px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold cursor-pointer hover:text-white/50 select-none">
                                            <span className="inline-flex items-center justify-end">Total<SortIcon field="totalCost" /></span>
                                        </th>
                                        <th onClick={() => handleSort('paidAmount')} className="text-right px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold hidden md:table-cell cursor-pointer hover:text-white/50 select-none">
                                            <span className="inline-flex items-center justify-end">Paid<SortIcon field="paidAmount" /></span>
                                        </th>
                                        <th onClick={() => handleSort('remainingBalance')} className="text-right px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold hidden lg:table-cell cursor-pointer hover:text-white/50 select-none">
                                            <span className="inline-flex items-center justify-end">Due<SortIcon field="remainingBalance" /></span>
                                        </th>
                                        <th onClick={() => handleSort('status')} className="text-center px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold cursor-pointer hover:text-white/50 select-none">
                                            <span className="inline-flex items-center">Status<SortIcon field="status" /></span>
                                        </th>
                                        <th className="text-center px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map((b) => (
                                        <tr key={b._id} className={`border-b border-white/[0.04] last:border-b-0 hover:bg-white/[0.02] transition-colors ${selectedIds.has(b._id) ? 'bg-antique-gold/[0.04]' : ''}`}>
                                            <td className="px-3 py-3.5">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.has(b._id)}
                                                    onChange={() => toggleSelect(b._id)}
                                                    className="w-3.5 h-3.5 rounded accent-antique-gold cursor-pointer"
                                                />
                                            </td>
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
                                                <span className="text-xs font-bold text-white/85">{formatLKR(b.totalCost || 0)}</span>
                                            </td>
                                            <td className="px-5 py-3.5 text-right hidden md:table-cell">
                                                <span className="text-xs text-emerald-400/80">{formatLKR(b.paidAmount || 0)}</span>
                                            </td>
                                            <td className="px-5 py-3.5 text-right hidden lg:table-cell">
                                                <span className={`text-xs ${(b.remainingBalance || 0) > 0 ? 'text-amber-400/80' : 'text-white/25'}`}>
                                                    {formatLKR(b.remainingBalance || 0)}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 text-center">
                                                <span className={`status-pill ${STATUS_MAP[b.status] || 'status-pill-neutral'}`}>
                                                    {STATUS_DISPLAY_NAMES[b.status] || b.status?.replace(/_/g, ' ')}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Link
                                                        href={`/dashboard/bookings/${b._id}`}
                                                        className="inline-flex p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors"
                                                        title="View details"
                                                    >
                                                        <Eye className="h-3.5 w-3.5 text-white/40 hover:text-antique-gold transition-colors" />
                                                    </Link>
                                                    <a
                                                        href={`https://wa.me/${b.phone?.replace(/\D/g, '')}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors"
                                                        title="WhatsApp"
                                                    >
                                                        <MessageSquare className="h-3.5 w-3.5 text-white/40 hover:text-emerald-400 transition-colors" />
                                                    </a>
                                                </div>
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
                                    className="inline-flex items-center gap-1 text-xs text-white/50 hover:text-antique-gold disabled:opacity-25 font-medium transition-colors px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08]"
                                >
                                    <ChevronLeft className="h-3.5 w-3.5" />
                                    Previous
                                </button>

                                <div className="flex items-center gap-1">
                                    {page > 2 && (
                                        <>
                                            <button
                                                onClick={() => setPage(1)}
                                                className="text-xs text-white/40 hover:text-antique-gold px-2.5 py-1.5 rounded hover:bg-white/[0.04] transition-colors"
                                            >
                                                1
                                            </button>
                                            {page > 3 && <span className="text-white/20">...</span>}
                                        </>
                                    )}
                                    {page - 1 > 0 && (
                                        <button
                                            onClick={() => setPage(page - 1)}
                                            className="text-xs text-white/40 hover:text-antique-gold px-2.5 py-1.5 rounded hover:bg-white/[0.04] transition-colors"
                                        >
                                            {page - 1}
                                        </button>
                                    )}
                                    <span className="text-xs text-white/60 px-2.5 py-1.5 font-semibold bg-white/[0.04] rounded">
                                        {page}
                                    </span>
                                    {page + 1 <= totalPages && (
                                        <button
                                            onClick={() => setPage(page + 1)}
                                            className="text-xs text-white/40 hover:text-antique-gold px-2.5 py-1.5 rounded hover:bg-white/[0.04] transition-colors"
                                        >
                                            {page + 1}
                                        </button>
                                    )}
                                    {page < totalPages - 1 && (
                                        <>
                                            {page < totalPages - 2 && <span className="text-white/20">...</span>}
                                            <button
                                                onClick={() => setPage(totalPages)}
                                                className="text-xs text-white/40 hover:text-antique-gold px-2.5 py-1.5 rounded hover:bg-white/[0.04] transition-colors"
                                            >
                                                {totalPages}
                                            </button>
                                        </>
                                    )}
                                </div>

                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page >= totalPages}
                                    className="inline-flex items-center gap-1 text-xs text-white/50 hover:text-antique-gold disabled:opacity-25 font-medium transition-colors px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08]"
                                >
                                    Next
                                    <ChevronRight className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
