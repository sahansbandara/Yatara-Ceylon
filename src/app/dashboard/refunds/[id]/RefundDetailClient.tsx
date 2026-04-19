'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrency, formatPrice } from '@/lib/CurrencyContext';
import { ArrowLeft, CheckCircle, XCircle, Info, FileText } from 'lucide-react';
import Link from 'next/link';

interface RefundDetailClientProps {
    refund: any;
    userRole: string;
}

export default function RefundDetailClient({ refund, userRole }: RefundDetailClientProps) {
    const { currency, convertRate } = useCurrency();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    
    // Form states
    const [staffRecommendation, setStaffRecommendation] = useState(refund.staffRecommendation || 'APPROVE');
    const [staffNotes, setStaffNotes] = useState(refund.staffNotes || '');
    const [adminNotes, setAdminNotes] = useState(refund.adminNotes || '');
    const [proofUrl, setProofUrl] = useState(refund.proofUrl || '');

    const handleUpdate = async (payload: any) => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/refunds/${refund._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                router.refresh();
            } else {
                const data = await res.json();
                alert(data.error || 'Update failed');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const isStaff = userRole === 'STAFF';
    const isAdmin = userRole === 'ADMIN';

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Link href="/dashboard/refunds" className="text-sm text-antique-gold flex items-center gap-2 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Refunds
            </Link>

            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-display font-bold text-white">Refund Request</h1>
                    <p className="text-sm text-gray-400">Ref: {refund._id}</p>
                </div>
                <div className="bg-[#121c17] border border-white/10 px-4 py-2 rounded-lg">
                    <span className="text-xs uppercase tracking-widest text-white/50 block">STATUS</span>
                    <span className="text-sm font-bold text-white">{refund.status.replace('_', ' ')}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Col: Customer & Booking Info */}
                <div className="space-y-6">
                    <div className="bg-[#121c17] rounded-xl border border-white/10 p-6">
                        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                            <Info className="w-4 h-4 text-antique-gold"/> Booking Details
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-[10px] uppercase text-white/40">Booking No</p>
                                <p className="text-sm text-white">{refund.bookingId?.bookingNo}</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase text-white/40">Trip Dates</p>
                                <p className="text-sm text-white">
                                    {new Date(refund.bookingId?.dates?.from).toLocaleDateString()} to {new Date(refund.bookingId?.dates?.to).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase text-white/40">Amount Requested</p>
                                <p className="text-lg font-bold text-white">
                                    {formatPrice(refund.requestedAmount, currency, convertRate)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#121c17] rounded-xl border border-white/10 p-6">
                        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-antique-gold"/> Customer Request
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] uppercase text-white/40">Reason</p>
                                <p className="text-sm text-white bg-white/5 p-3 rounded-lg mt-1">{refund.reason}</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase text-white/40">Refund Method</p>
                                <p className="text-sm text-white font-medium">{refund.refundMethod}</p>
                            </div>
                            
                            {refund.refundMethod === 'BANK' && refund.bankDetails && (
                                <div className="grid grid-cols-2 gap-3 text-sm mt-2 p-3 bg-white/[0.02] rounded-lg border border-white/5">
                                    <div>
                                        <p className="text-[10px] text-white/40">Account Name</p>
                                        <p className="text-white">{refund.bankDetails.accountName}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-white/40">Account Number</p>
                                        <p className="text-white">{refund.bankDetails.accountNumber}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-white/40">Bank Name</p>
                                        <p className="text-white">{refund.bankDetails.bankName}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-white/40">Branch</p>
                                        <p className="text-white">{refund.bankDetails.branch}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Col: Admin/Staff Actions */}
                <div className="space-y-6">
                    {/* STAFF SECTION */}
                    {(isStaff || isAdmin) && refund.status === 'SUBMITTED' && (
                        <div className="bg-[#121c17] rounded-xl border border-amber-500/30 p-6 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                            <h3 className="text-sm font-semibold text-amber-500 mb-4">Staff Review Required</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] uppercase text-white/50 block mb-1">Recommendation</label>
                                    <select 
                                        className="w-full bg-[#0a110e] border border-white/10 rounded-lg p-2.5 text-white text-sm focus:border-antique-gold outline-none"
                                        value={staffRecommendation}
                                        onChange={e => setStaffRecommendation(e.target.value)}
                                    >
                                        <option value="APPROVE">Recommend Approval</option>
                                        <option value="PARTIAL">Recommend Partial Refund</option>
                                        <option value="REJECT">Recommend Rejection</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase text-white/50 block mb-1">Staff Notes (Internal)</label>
                                    <textarea 
                                        className="w-full bg-[#0a110e] border border-white/10 rounded-lg p-3 text-white text-sm focus:border-antique-gold outline-none"
                                        rows={3}
                                        value={staffNotes}
                                        onChange={e => setStaffNotes(e.target.value)}
                                    />
                                </div>
                                <button
                                    onClick={() => handleUpdate({ status: 'UNDER_REVIEW', staffRecommendation, staffNotes })}
                                    disabled={isLoading}
                                    className="w-full px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                                >
                                    Submit Review
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Show saved staff notes if already reviewed */}
                    {refund.status !== 'SUBMITTED' && (
                        <div className="bg-[#121c17] rounded-xl border border-white/10 p-6">
                            <h3 className="text-sm font-semibold text-white/70 mb-3">Staff Review Details</h3>
                            <div className="space-y-3">
                                <p className="text-sm text-white">Recommendation: <strong className="text-amber-400">{refund.staffRecommendation}</strong></p>
                                {refund.staffNotes && (
                                    <div className="bg-white/5 p-3 rounded-lg text-sm text-gray-300">
                                        {refund.staffNotes}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ADMIN SECTION - FINAL APPROVAL */}
                    {isAdmin && refund.status === 'UNDER_REVIEW' && (
                        <div className="bg-[#121c17] rounded-xl border border-antique-gold/30 p-6 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-antique-gold"></div>
                            <h3 className="text-sm font-semibold text-antique-gold mb-4">Admin Final Decision</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] uppercase text-white/50 block mb-1">Admin Notes (Optional)</label>
                                    <textarea 
                                        className="w-full bg-[#0a110e] border border-white/10 rounded-lg p-3 text-white text-sm focus:border-antique-gold outline-none"
                                        rows={2}
                                        value={adminNotes}
                                        onChange={e => setAdminNotes(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleUpdate({ status: 'REJECTED', adminNotes })}
                                        disabled={isLoading}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                                    >
                                        <XCircle className="w-4 h-4"/> Reject
                                    </button>
                                    <button
                                        onClick={() => handleUpdate({ status: 'APPROVED', adminNotes })}
                                        disabled={isLoading}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                                    >
                                        <CheckCircle className="w-4 h-4"/> Approve
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* FINANCE SECTION - MARK AS REFUNDED */}
                    {isAdmin && refund.status === 'APPROVED' && (
                        <div className="bg-gradient-to-br from-[#121c17] to-emerald-900/20 rounded-xl border border-emerald-500/30 p-6 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                            <h3 className="text-sm font-semibold text-emerald-400 mb-4">Process Refund Payment</h3>
                            <p className="text-xs text-gray-400 mb-4">
                                Transfer {formatPrice(refund.requestedAmount, currency, convertRate)} to the customer's account and upload proof below to close this request.
                            </p>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] uppercase text-white/50 block mb-1">Payment Proof URL / Ref ID</label>
                                    <input 
                                        type="text"
                                        className="w-full bg-[#0a110e] border border-white/10 rounded-lg p-2.5 text-white text-sm focus:border-emerald-500 outline-none"
                                        value={proofUrl}
                                        onChange={e => setProofUrl(e.target.value)}
                                        placeholder="e.g. TXN-123456 or Image URL"
                                    />
                                </div>
                                <button
                                    onClick={() => handleUpdate({ status: 'REFUNDED', proofUrl })}
                                    disabled={isLoading || !proofUrl.trim()}
                                    className="w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-bold tracking-wide uppercase transition-colors disabled:opacity-50"
                                >
                                    Mark as Refunded
                                </button>
                                <p className="text-[10px] text-emerald-500/70 text-center">
                                    * This will update the Booking balance and create a Ledger entry.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* COMPLETED STATUS SHOWCASE */}
                    {(refund.status === 'REFUNDED' || refund.status === 'REJECTED') && (
                        <div className="bg-[#121c17] rounded-xl border border-white/10 p-6 opacity-80">
                            <h3 className="text-sm font-semibold text-white/70 mb-3">Admin Decision</h3>
                            <div className="space-y-3">
                                {refund.adminNotes && (
                                    <div className="bg-white/5 p-3 rounded-lg text-sm text-gray-300">
                                        {refund.adminNotes}
                                    </div>
                                )}
                                {refund.status === 'REFUNDED' && (
                                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg text-emerald-400 text-sm">
                                        Funds successfully returned to customer. <br />
                                        <span className="text-xs opacity-70">Proof: {refund.proofUrl}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
