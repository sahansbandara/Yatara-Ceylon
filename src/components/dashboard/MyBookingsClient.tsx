'use client';

import { CalendarCheck, ArrowUpRight, Package as PackageIcon } from "lucide-react";
import Link from "next/link";
import { useCurrency, formatPrice } from '@/lib/CurrencyContext';

const STATUS_COLORS: Record<string, string> = {
    NEW: 'bg-blue-500/15 text-blue-300',
    PAYMENT_PENDING: 'bg-yellow-500/15 text-yellow-300',
    ADVANCE_PAID: 'bg-emerald-500/15 text-emerald-300',
    CONFIRMED: 'bg-green-500/15 text-green-300',
    ASSIGNED: 'bg-purple-500/15 text-purple-300',
    IN_PROGRESS: 'bg-indigo-500/15 text-indigo-300',
    COMPLETED: 'bg-white/[0.05] text-white/60 border border-white/10',
    CANCELLED: 'bg-red-500/15 text-red-300',
    CONTACTED: 'bg-sky-500/15 text-sky-300',
};

export default function MyBookingsClient({ bookings }: { bookings: any[] }) {
    const { currency, convertRate } = useCurrency();

    return (
        <div className="flex flex-col gap-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-display font-bold tracking-tight text-white drop-shadow-sm">My Bookings</h1>
                    <p className="text-sm text-gray-300 font-light mt-1">Track your travel inquiries and reservations</p>
                </div>
            </div>

            {bookings.length > 0 ? (
                <div className="space-y-4">
                    {bookings.map((booking: any) => (
                        <div
                            key={booking._id}
                            className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] shadow-xl rounded-2xl p-6 flex flex-col md:flex-row md:items-center gap-4 text-off-white hover:bg-white/[0.06] transition-all duration-300"
                        >
                            <div className="flex items-center gap-3 flex-shrink-0">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                    <CalendarCheck className="h-5 w-5 text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-mono font-semibold">{booking.bookingNo}</p>
                                    <p className="text-[10px] text-white/40 uppercase tracking-wider">{booking.type}</p>
                                </div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold">
                                    {booking.packageId?.title || 'Custom Booking'}
                                </p>
                                <p className="text-xs text-white/50 mt-0.5">
                                    {new Date(booking.dates?.from).toLocaleDateString()} → {new Date(booking.dates?.to).toLocaleDateString()} · {booking.pax} pax
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-sm font-bold">{formatPrice(booking.totalCost || 0, currency, convertRate)}</p>
                                    {booking.paidAmount > 0 && (
                                        <p className="text-[10px] font-medium text-emerald-600">Paid: {formatPrice(booking.paidAmount || 0, currency, convertRate)}</p>
                                    )}
                                    {booking.remainingBalance > 0 && (
                                        <p className="text-[10px] font-medium text-orange-600">Due: {formatPrice(booking.remainingBalance || 0, currency, convertRate)}</p>
                                    )}
                                </div>
                                <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold whitespace-nowrap shadow-sm ${STATUS_COLORS[booking.status] || 'bg-white/[0.05] text-white/50 border border-white/10'}`}>
                                    {booking.status?.replace(/_/g, ' ')}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="liquid-glass-panel rounded-2xl p-12 text-center text-white">
                    <PackageIcon className="h-12 w-12 text-white/40 mx-auto mb-4" />
                    <h3 className="text-lg font-display font-semibold mb-2 text-off-white">No Bookings Yet</h3>
                    <p className="text-sm text-gray-300 mb-6">Browse our luxury packages and start your Sri Lankan adventure.</p>
                    <Link
                        href="/packages"
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-deep-emerald font-medium text-sm rounded-lg shadow-lg hover:shadow-xl transition-all"
                    >
                        Explore Packages <ArrowUpRight className="h-4 w-4" />
                    </Link>
                </div>
            )}
        </div>
    );
}
