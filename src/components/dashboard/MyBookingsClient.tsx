'use client';

import { CalendarCheck, ArrowUpRight, Package as PackageIcon, Clock, CreditCard, CheckCircle2, ShieldAlert, X, AlertTriangle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCurrency, formatPrice } from '@/lib/CurrencyContext';
import { useState } from "react";
import { useRouter } from "next/navigation";

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
    const router = useRouter();
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [cancelModal, setCancelModal] = useState<{ isOpen: boolean; bookingId: string | null; isPaid: boolean; tripStartDate: string | null }>({ isOpen: false, bookingId: null, isPaid: false, tripStartDate: null });

    const [refundReason, setRefundReason] = useState("");
    const [refundMethod, setRefundMethod] = useState("BANK");
    const [bankDetails, setBankDetails] = useState({ accountName: '', accountNumber: '', bankName: '', branch: '' });

    const openCancelModal = (bookingId: string, isPaid: boolean, tripStartDate: string) => {
        setCancelModal({ isOpen: true, bookingId, isPaid, tripStartDate });
        setRefundReason("");
        setRefundMethod("BANK");
        setBankDetails({ accountName: '', accountNumber: '', bankName: '', branch: '' });
    };

    const closeCancelModal = () => {
        setCancelModal({ isOpen: false, bookingId: null, isPaid: false, tripStartDate: null });
    };

    const confirmCancel = async () => {
        if (!cancelModal.bookingId) return;
        const { bookingId } = cancelModal;
        closeCancelModal();

        setActionLoading(bookingId);
        try {
            const diffTime = cancelModal.tripStartDate ? new Date(cancelModal.tripStartDate).getTime() - new Date().getTime() : 0;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const isEligibleForRefund = diffDays >= 5 && cancelModal.isPaid;

            if (isEligibleForRefund && (!refundReason || !refundMethod)) {
                alert("Please fill in the refund reason and method.");
                setActionLoading(null);
                return;
            }

            const res = await fetch(`/api/bookings/${bookingId}/cancel`, { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    reason: refundReason,
                    refundMethod,
                    bankDetails
                })
            });
            if (res.ok) {
                router.refresh();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to process request.");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred. Please try again.");
        } finally {
            setActionLoading(null);
        }
    };

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
                        const hasImage = booking.packageId?.images?.[0];

                        return (
                            <div
                                key={booking._id}
                                className="group relative liquid-glass-panel rounded-2xl overflow-hidden hover:shadow-[0_8px_32px_rgba(212,175,55,0.05)] transition-all duration-500 border border-white/[0.05] hover:border-antique-gold/20 flex flex-col"
                            >
                                {/* Top Image/Status Area */}
                                <div className="relative h-56 w-full bg-[#0a110e] flex-shrink-0 overflow-hidden">
                                    {hasImage ? (
                                        <>
                                            <Image
                                                src={hasImage}
                                                alt={booking.packageId?.title || 'Tour'}
                                                fill
                                                className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-[1.03] transition-transform duration-1000 ease-out"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#061a15] via-[#061a15]/30 to-transparent" />
                                        </>
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 to-[#061a15] flex items-center justify-center">
                                            <CalendarCheck className="h-12 w-12 text-white/20" />
                                        </div>
                                    )}

                                    {/* Status Badge */}
                                    <div className="absolute top-4 right-4 z-10">
                                        <div className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full border bg-black/40 backdrop-blur-md shadow-lg ${statusNode.color}`}>
                                            <StatusIcon className="h-3.5 w-3.5" />
                                            <span className="text-xs font-semibold tracking-wide uppercase">{statusNode.label}</span>
                                        </div>
                                    </div>

                                    {/* Type Badge */}
                                    <div className="absolute top-4 left-4 z-10">
                                        <span className="px-2.5 py-1 bg-black/50 backdrop-blur-md border border-white/20 text-white/90 text-[10px] uppercase tracking-widest rounded-md font-medium">
                                            {booking.type}
                                        </span>
                                    </div>
                                </div>

                                {/* Content Area */}
                                <div className="p-6 flex-1 flex flex-col relative z-20 -mt-8">
                                    <div className="flex justify-between items-end gap-4 mb-5">
                                        <div className="relative z-10 bg-[#061a15]/90 backdrop-blur-md p-3 rounded-xl border border-white/[0.03] shadow-lg w-full">
                                            <p className="text-[10px] text-antique-gold/80 font-mono tracking-wider mb-1">REF: {booking.bookingNo}</p>
                                            <h3 className="text-xl font-display font-semibold text-white group-hover:text-antique-gold transition-colors leading-tight">
                                                {booking.packageId?.title || 'Custom Booking Plan'}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="bg-white/[0.02] border border-white/[0.03] rounded-xl p-4 flex flex-col items-start justify-center group-hover:bg-white/[0.04] transition-colors">
                                            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Travel Dates</p>
                                            <p className="text-sm font-medium text-off-white">
                                                {new Date(booking.dates?.from).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                <span className="text-white/30 mx-1">→</span>
                                                {new Date(booking.dates?.to).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </p>
                                        </div>
                                        <div className="bg-white/[0.02] border border-white/[0.03] rounded-xl p-4 flex flex-col items-start justify-center group-hover:bg-white/[0.04] transition-colors">
                                            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Guests</p>
                                            <p className="text-sm font-medium text-off-white">
                                                {booking.pax} Passenger{booking.pax !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-5 border-t border-white/[0.06] flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-0.5">Total Value</p>
                                            <p className="text-xl font-bold text-white tracking-tight">{formatPrice(booking.totalCost || 0, currency, convertRate)}</p>
                                        </div>

                                        <div className="text-right">
                                            {booking.paidAmount > 0 && (
                                                <p className="text-[11px] font-semibold text-emerald-300 bg-emerald-400/10 px-2 py-0.5 rounded shadow-inner border border-emerald-400/20 inline-block mb-1">
                                                    PAID: {formatPrice(booking.paidAmount || 0, currency, convertRate)}
                                                </p>
                                            )}
                                            {booking.remainingBalance > 0 && (
                                                <p className="text-xs font-medium text-amber-200">
                                                    DUE: {formatPrice(booking.remainingBalance || 0, currency, convertRate)}
                                                </p>
                                            )}
                                        </div>
                                    </div>


                                    {/* Action Buttons */}
                                    {!['CANCELLED', 'REFUND_PENDING', 'REFUNDED', 'COMPLETED'].includes(booking.status) && (
                                        <div className="mt-4 pt-4 border-t border-white/[0.03] flex justify-end">
                                            <button
                                                onClick={() => openCancelModal(booking._id, booking.paidAmount > 0, booking.dates.from)}
                                                disabled={actionLoading === booking._id}
                                                className="text-[11px] font-medium tracking-wider px-4 py-2 border border-red-500/20 text-red-300/80 hover:text-red-300 hover:bg-red-500/10 hover:border-red-500/40 rounded-lg transition-all duration-300 disabled:opacity-50"
                                            >
                                                {actionLoading === booking._id ? "Processing..." : (booking.paidAmount > 0 ? "Request Refund" : "Cancel Booking")}
                                            </button>
                                        </div>
                                    )}
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

            {/* Cancel / Refund Modal */}
            {cancelModal.isOpen && (() => {
                const diffTime = cancelModal.tripStartDate ? new Date(cancelModal.tripStartDate).getTime() - new Date().getTime() : 0;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                const isEligibleForRefund = diffDays >= 5 && cancelModal.isPaid;

                return (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a110e]/80 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-[#121c17] border border-white/10 shadow-2xl rounded-2xl w-full max-w-lg overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-200">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${isEligibleForRefund ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}>
                                            <AlertTriangle className="h-5 w-5" />
                                        </div>
                                        <h3 className="text-xl font-display font-semibold text-white">
                                            {isEligibleForRefund ? 'Request Refund' : 'Cancel Booking'}
                                        </h3>
                                    </div>
                                    <button onClick={closeCancelModal} className="text-white/40 hover:text-white transition-colors">
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                                <div className="text-sm text-gray-300 leading-relaxed mb-6 space-y-4">
                                    {isEligibleForRefund ? (
                                        <p>
                                            Since your trip is {diffDays} days away, you are eligible to request a refund for your advance payment. 
                                            Our finance team will process this request, and your booking will be cancelled immediately.
                                        </p>
                                    ) : (
                                        <p className="text-red-300/80 bg-red-900/10 p-3 rounded-lg border border-red-500/20">
                                            {cancelModal.isPaid 
                                                ? `Your trip starts in less than 5 days (${diffDays} days). Under our policy, cancellations made this close to the start date are not eligible for a refund. You can still cancel the booking.` 
                                                : `Are you sure you want to cancel this booking? This action cannot be undone.`}
                                        </p>
                                    )}
                                </div>

                                {isEligibleForRefund && (
                                    <div className="space-y-4 mb-8">
                                        <div>
                                            <label className="block text-xs font-medium text-white/70 mb-1">Reason for Cancellation *</label>
                                            <textarea 
                                                className="w-full bg-[#0a110e] border border-white/10 rounded-lg p-3 text-white focus:border-antique-gold outline-none text-sm placeholder:text-white/20"
                                                rows={3}
                                                placeholder="Please provide a reason..."
                                                value={refundReason}
                                                onChange={e => setRefundReason(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-white/70 mb-1">Preferred Refund Method *</label>
                                            <select 
                                                className="w-full bg-[#0a110e] border border-white/10 rounded-lg p-3 text-white focus:border-antique-gold outline-none text-sm"
                                                value={refundMethod}
                                                onChange={e => setRefundMethod(e.target.value)}
                                            >
                                                <option value="BANK">Bank Transfer</option>
                                                <option value="CARD">Credit/Debit Card Reversal</option>
                                                <option value="OTHER">Other Method</option>
                                            </select>
                                        </div>

                                        {refundMethod === 'BANK' && (
                                            <div className="grid grid-cols-2 gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                                                <div className="col-span-2">
                                                    <label className="block text-[10px] uppercase font-bold text-white/50 mb-1">Account Name</label>
                                                    <input 
                                                        type="text" 
                                                        className="w-full bg-[#0a110e] border border-white/10 rounded-md p-2.5 text-white text-sm"
                                                        value={bankDetails.accountName}
                                                        onChange={e => setBankDetails({...bankDetails, accountName: e.target.value})}
                                                    />
                                                </div>
                                                <div className="col-span-2">
                                                    <label className="block text-[10px] uppercase font-bold text-white/50 mb-1">Account Number</label>
                                                    <input 
                                                        type="text" 
                                                        className="w-full bg-[#0a110e] border border-white/10 rounded-md p-2.5 text-white text-sm"
                                                        value={bankDetails.accountNumber}
                                                        onChange={e => setBankDetails({...bankDetails, accountNumber: e.target.value})}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] uppercase font-bold text-white/50 mb-1">Bank Name</label>
                                                    <input 
                                                        type="text" 
                                                        className="w-full bg-[#0a110e] border border-white/10 rounded-md p-2.5 text-white text-sm"
                                                        value={bankDetails.bankName}
                                                        onChange={e => setBankDetails({...bankDetails, bankName: e.target.value})}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] uppercase font-bold text-white/50 mb-1">Branch</label>
                                                    <input 
                                                        type="text" 
                                                        className="w-full bg-[#0a110e] border border-white/10 rounded-md p-2.5 text-white text-sm"
                                                        value={bankDetails.branch}
                                                        onChange={e => setBankDetails({...bankDetails, branch: e.target.value})}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="flex gap-3 justify-end mt-6">
                                    <button
                                        onClick={closeCancelModal}
                                        className="px-4 py-2 rounded-lg text-sm font-medium border border-white/10 text-white/70 hover:bg-white/5 hover:text-white transition-all"
                                    >
                                        Go Back
                                    </button>
                                    <button
                                        onClick={confirmCancel}
                                        disabled={isEligibleForRefund && (!refundReason || !refundMethod)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium font-bold uppercase tracking-wider transition-all ${
                                            isEligibleForRefund 
                                                ? 'bg-amber-500 hover:bg-amber-400 text-[#121c17] disabled:bg-amber-500/50 disabled:text-amber-900/50' 
                                                : 'bg-red-500 hover:bg-red-400 text-white disabled:bg-red-500/50'
                                        }`}
                                    >
                                        {isEligibleForRefund ? 'Submit Refund Request' : 'Force Cancel Booking'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
}
