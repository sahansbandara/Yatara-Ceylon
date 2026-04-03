'use client';

import { CalendarCheck, ArrowUpRight, Package as PackageIcon, Clock, CreditCard, CheckCircle2, ShieldAlert } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCurrency, formatPrice } from '@/lib/CurrencyContext';

const STATUS_CONFIG: Record<string, { color: string; icon: any; label: string }> = {
    NEW: { color: 'from-blue-500/20 to-blue-400/10 text-blue-300 border-blue-500/30', icon: Clock, label: 'Pending Review' },
    PAYMENT_PENDING: { color: 'from-yellow-500/20 to-yellow-400/10 text-yellow-300 border-yellow-500/30', icon: CreditCard, label: 'Awaiting Payment' },
    ADVANCE_PAID: { color: 'from-emerald-500/20 to-emerald-400/10 text-emerald-300 border-emerald-500/30', icon: CheckCircle2, label: 'Advance Paid' },
    CONFIRMED: { color: 'from-green-500/20 to-green-400/10 text-green-300 border-green-500/30', icon: CheckCircle2, label: 'Confirmed' },
    ASSIGNED: { color: 'from-purple-500/20 to-purple-400/10 text-purple-300 border-purple-500/30', icon: CalendarCheck, label: 'Guide Assigned' },
    IN_PROGRESS: { color: 'from-indigo-500/20 to-indigo-400/10 text-indigo-300 border-indigo-500/30', icon: CalendarCheck, label: 'In Progress' },
    COMPLETED: { color: 'from-white/10 to-white/5 text-white/70 border-white/20', icon: CheckCircle2, label: 'Completed' },
    CANCELLED: { color: 'from-red-500/20 to-red-400/10 text-red-300 border-red-500/30', icon: ShieldAlert, label: 'Cancelled' },
    CONTACTED: { color: 'from-sky-500/20 to-sky-400/10 text-sky-300 border-sky-500/30', icon: CalendarCheck, label: 'Contacted' },
};

export default function MyBookingsClient({ bookings }: { bookings: any[] }) {
    const { currency, convertRate } = useCurrency();

    return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-display font-bold tracking-tight text-white drop-shadow-sm">My Bookings</h1>
                    <p className="text-sm text-gray-300 font-light mt-1">Track your travel inquiries and reservations</p>
                </div>
            </div>

            {bookings.length > 0 ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {bookings.map((booking: any) => {
                        const statusNode = STATUS_CONFIG[booking.status] || STATUS_CONFIG.NEW;
                        const StatusIcon = statusNode.icon;
                        const hasImage = booking.packageId?.coverImage;

                        return (
                            <div
                                key={booking._id}
                                className="group relative liquid-glass-panel rounded-2xl overflow-hidden hover:shadow-[0_8px_32px_rgba(212,175,55,0.05)] transition-all duration-500 border border-white/[0.05] hover:border-antique-gold/20 flex flex-col"
                            >
                                {/* Top Image/Status Area */}
                                <div className="relative h-40 w-full bg-[#0a110e] flex-shrink-0 overflow-hidden">
                                    {hasImage ? (
                                        <>
                                            <Image
                                                src={booking.packageId.coverImage}
                                                alt={booking.packageId.title}
                                                fill
                                                className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#061a15] via-[#061a15]/40 to-transparent" />
                                        </>
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 to-[#061a15] flex items-center justify-center">
                                            <CalendarCheck className="h-10 w-10 text-white/10" />
                                        </div>
                                    )}

                                    {/* Status Badge */}
                                    <div className="absolute top-4 right-4 z-10">
                                        <div className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full border bg-gradient-to-r backdrop-blur-md shadow-lg ${statusNode.color}`}>
                                            <StatusIcon className="h-3.5 w-3.5" />
                                            <span className="text-xs font-semibold tracking-wide uppercase">{statusNode.label}</span>
                                        </div>
                                    </div>

                                    {/* Type Badge */}
                                    <div className="absolute top-4 left-4 z-10">
                                        <span className="px-2.5 py-1 bg-black/40 backdrop-blur-md border border-white/10 text-white/80 text-[10px] uppercase tracking-widest rounded-md font-medium">
                                            {booking.type}
                                        </span>
                                    </div>
                                </div>

                                {/* Content Area */}
                                <div className="p-6 flex-1 flex flex-col relative z-20">
                                    <div className="flex justify-between items-start gap-4 mb-4">
                                        <div>
                                            <p className="text-[11px] text-antique-gold/70 font-mono tracking-wider mb-1">REF: {booking.bookingNo}</p>
                                            <h3 className="text-lg font-display font-semibold text-white group-hover:text-antique-gold transition-colors leading-tight">
                                                {booking.packageId?.title || 'Custom Booking Plan'}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="bg-white/[0.02] border border-white/[0.03] rounded-xl p-3">
                                            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Travel Dates</p>
                                            <p className="text-sm font-medium text-off-white">
                                                {new Date(booking.dates?.from).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                <span className="text-white/30 mx-1">→</span>
                                                {new Date(booking.dates?.to).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </p>
                                        </div>
                                        <div className="bg-white/[0.02] border border-white/[0.03] rounded-xl p-3">
                                            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Guests</p>
                                            <p className="text-sm font-medium text-off-white">
                                                {booking.pax} Passenger{booking.pax !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-white/[0.06] flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-0.5">Total Value</p>
                                            <p className="text-xl font-bold text-white tracking-tight">{formatPrice(booking.totalCost || 0, currency, convertRate)}</p>
                                        </div>

                                        <div className="text-right">
                                            {booking.paidAmount > 0 && (
                                                <p className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20 inline-block mb-1">
                                                    PAID: {formatPrice(booking.paidAmount || 0, currency, convertRate)}
                                                </p>
                                            )}
                                            {booking.remainingBalance > 0 && (
                                                <p className="text-xs font-medium text-orange-300">
                                                    DUE: {formatPrice(booking.remainingBalance || 0, currency, convertRate)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="liquid-glass-panel border-antique-gold/10 rounded-3xl p-12 text-center text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-antique-gold/5 via-transparent to-transparent opacity-50" />
                    <PackageIcon className="h-16 w-16 text-antique-gold/40 mx-auto mb-6 relative z-10" />
                    <h3 className="text-2xl font-display font-semibold mb-3 text-white relative z-10">No Bookings Yet</h3>
                    <p className="text-sm text-gray-400 mb-8 max-w-md mx-auto relative z-10">You haven't made any reservations. Browse our luxury packages and start crafting your perfect Sri Lankan adventure.</p>
                    <Link
                        href="/packages"
                        className="relative z-10 inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-antique-gold to-[#c59b27] hover:from-[#c59b27] hover:to-[#b0891e] text-[#061a15] font-semibold text-sm rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                        Explore Curated Packages <ArrowUpRight className="h-4 w-4" />
                    </Link>
                </div>
            )}
        </div>
    );
}
