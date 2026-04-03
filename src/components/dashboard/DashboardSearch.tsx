'use client';

import { useState, useMemo } from 'react';
import { Search, Package, MapPin, CalendarCheck, ArrowRight, X } from 'lucide-react';
import Link from 'next/link';

interface Booking {
    _id: string;
    bookingNo: string;
    customerName: string;
    status: string;
    totalCost?: number;
    type?: string;
    packageId?: { title: string } | null;
}

interface DashboardSearchProps {
    bookings: Booking[];
}

export default function DashboardSearch({ bookings }: DashboardSearchProps) {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const results = useMemo(() => {
        if (!query.trim()) return null;
        const q = query.toLowerCase();

        const matchedBookings = bookings.filter(
            (b) =>
                b.bookingNo?.toLowerCase().includes(q) ||
                b.customerName?.toLowerCase().includes(q) ||
                b.packageId?.title?.toLowerCase().includes(q) ||
                b.type?.toLowerCase().includes(q) ||
                b.status?.toLowerCase().replace(/_/g, ' ').includes(q)
        );

        return { bookings: matchedBookings };
    }, [query, bookings]);

    const showDropdown = isFocused && query.trim().length > 0;

    return (
        <div className="relative w-full max-w-md">
            <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <input
                    type="text"
                    placeholder="Search bookings, packages, destinations..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                    className="w-full h-10 pl-10 pr-10 rounded-xl bg-white/[0.06] border border-white/[0.1] text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-antique-gold/25 focus:border-antique-gold/30 transition-all"
                />
                {query && (
                    <button
                        onClick={() => setQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <X className="h-3.5 w-3.5 text-white/40" />
                    </button>
                )}
            </div>

            {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 rounded-xl bg-[#1a1a2e]/95 backdrop-blur-xl border border-white/[0.08] shadow-2xl shadow-black/40 z-50 overflow-hidden max-h-[400px] overflow-y-auto">
                    {/* Quick Navigation Links */}
                    <div className="px-4 pt-3 pb-2 border-b border-white/[0.06]">
                        <p className="text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold mb-2">
                            Search in
                        </p>
                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                            <Link
                                href="/dashboard/packages"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[11px] text-white/60 hover:text-antique-gold hover:border-antique-gold/30 transition-all whitespace-nowrap flex-shrink-0"
                            >
                                <Package className="h-3 w-3" />
                                Packages
                                <ArrowRight className="h-2.5 w-2.5" />
                            </Link>
                            <Link
                                href="/dashboard/destinations"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[11px] text-white/60 hover:text-antique-gold hover:border-antique-gold/30 transition-all whitespace-nowrap flex-shrink-0"
                            >
                                <MapPin className="h-3 w-3" />
                                Destinations
                                <ArrowRight className="h-2.5 w-2.5" />
                            </Link>
                        </div>
                    </div>

                    {/* Booking Results */}
                    <div className="px-4 pt-3 pb-2">
                        <p className="text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold mb-2 flex items-center gap-1.5">
                            <CalendarCheck className="h-3 w-3" />
                            Bookings
                            {results && (
                                <span className="text-antique-gold/70 ml-1">
                                    ({results.bookings.length})
                                </span>
                            )}
                        </p>

                        {results && results.bookings.length > 0 ? (
                            <div className="space-y-1">
                                {results.bookings.slice(0, 5).map((booking) => (
                                    <Link
                                        key={booking._id}
                                        href={`/dashboard/bookings/${booking._id}`}
                                        className="flex items-center justify-between p-2.5 rounded-lg hover:bg-white/[0.06] transition-colors group"
                                    >
                                        <div className="flex flex-col">
                                            <span className="text-xs font-medium text-white/80 group-hover:text-white transition-colors">
                                                {booking.customerName}
                                            </span>
                                            <span className="text-[10px] text-white/40 mt-0.5">
                                                {booking.bookingNo} · {booking.packageId?.title || booking.type}
                                            </span>
                                        </div>
                                        <span className="text-[10px] uppercase tracking-wider text-white/40 px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08]">
                                            {booking.status?.replace(/_/g, ' ')}
                                        </span>
                                    </Link>
                                ))}
                                {results.bookings.length > 5 && (
                                    <Link
                                        href="/dashboard/bookings"
                                        className="block text-center text-[11px] text-antique-gold/70 hover:text-antique-gold py-2 transition-colors"
                                    >
                                        View all {results.bookings.length} results →
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="py-6 text-center">
                                <p className="text-sm text-white/50 font-medium">Not Found</p>
                                <p className="text-xs text-white/30 mt-1">
                                    No bookings match &ldquo;{query}&rdquo;
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
