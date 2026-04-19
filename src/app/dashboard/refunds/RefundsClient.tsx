'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatPrice, useCurrency } from '@/lib/CurrencyContext';

interface RefundsClientProps {
    refunds: any[];
    userRole: string;
}

export default function RefundsClient({ refunds: initialRefunds, userRole }: RefundsClientProps) {
    const { currency, convertRate } = useCurrency();
    const [filter, setFilter] = useState('ALL');

    const filteredRefunds = filter === 'ALL' 
        ? initialRefunds 
        : initialRefunds.filter(r => r.status === filter);

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'SUBMITTED': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'UNDER_REVIEW': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'APPROVED': return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'REJECTED': return 'bg-red-500/10 text-red-400 border-red-500/20';
            case 'REFUNDED': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-display font-bold text-white">Refund Requests</h1>
                    <p className="text-sm text-gray-400">Manage cancellation refunds and financial settlements.</p>
                </div>
            </div>

            {/* Filter */}
            <div className="flex flex-wrap gap-2">
                {['ALL', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'REFUNDED'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                            filter === status 
                                ? 'bg-antique-gold/20 text-antique-gold border-antique-gold/30' 
                                : 'bg-transparent text-gray-400 border-white/5 hover:border-white/20'
                        }`}
                    >
                        {status.replace('_', ' ')}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="bg-[#121c17] border border-white/5 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-white/5 text-gray-400 uppercase text-[10px] tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-medium">Booking Ref</th>
                                <th className="px-6 py-4 font-medium">Customer</th>
                                <th className="px-6 py-4 font-medium">Amount</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Date requested</th>
                                <th className="px-6 py-4 font-medium text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredRefunds.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        No refund requests found.
                                    </td>
                                </tr>
                            )}
                            {filteredRefunds.map((refund) => (
                                <tr key={refund._id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-white">{refund.bookingId?.bookingNo}</div>
                                        <div className="text-xs text-gray-400 mt-1">{refund.bookingId?.type}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-white">{refund.customerId?.name}</div>
                                        <div className="text-xs text-gray-400">{refund.customerId?.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-white font-medium">
                                            {formatPrice(refund.requestedAmount, currency, convertRate)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${getStatusColor(refund.status)}`}>
                                            {refund.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 text-xs">
                                        {new Date(refund.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link 
                                            href={`/dashboard/refunds/${refund._id}`}
                                            className="text-antique-gold hover:text-white text-xs font-medium bg-antique-gold/10 hover:bg-antique-gold/20 px-3 py-1.5 rounded transition-colors"
                                        >
                                            Review
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
