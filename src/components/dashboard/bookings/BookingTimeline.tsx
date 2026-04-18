'use client';

import { useEffect, useState } from 'react';
import { Clock, UserCircle, ArrowRight, CheckCircle2, AlertCircle, Truck, CreditCard, XCircle } from 'lucide-react';

interface TimelineEntry {
    _id: string;
    action: string;
    meta?: Record<string, unknown>;
    at: string;
    actor: { name: string; email: string };
}

const ACTION_CONFIG: Record<string, { icon: typeof Clock; color: string; label: string }> = {
    CREATE: { icon: CheckCircle2, color: 'text-emerald-400', label: 'Created' },
    STATUS_CHANGE: { icon: ArrowRight, color: 'text-blue-400', label: 'Status Changed' },
    ASSIGN: { icon: Truck, color: 'text-purple-400', label: 'Assignment Updated' },
    UPDATE: { icon: AlertCircle, color: 'text-amber-400', label: 'Updated' },
    DELETE: { icon: XCircle, color: 'text-red-400', label: 'Deleted' },
    PAYMENT: { icon: CreditCard, color: 'text-emerald-400', label: 'Payment Recorded' },
    PAYMENT_RECORDED: { icon: CreditCard, color: 'text-emerald-400', label: 'Payment Recorded' },
    PAYMENT_VOIDED: { icon: XCircle, color: 'text-red-400', label: 'Payment Voided' },
    INVOICE_CREATED: { icon: AlertCircle, color: 'text-amber-400', label: 'Invoice Drafted' },
    INVOICE_FINALIZED: { icon: CheckCircle2, color: 'text-blue-400', label: 'Invoice Finalized' },
    INVOICE_VOIDED: { icon: XCircle, color: 'text-red-400', label: 'Invoice Voided' },
};

function formatMoney(value: unknown) {
    return typeof value === 'number' ? `LKR ${value.toLocaleString()}` : '';
}

function getActionDisplay(entry: TimelineEntry) {
    const config = ACTION_CONFIG[entry.action] || { icon: Clock, color: 'text-white/40', label: entry.action };
    let detail = '';

    if (entry.action === 'STATUS_CHANGE' && entry.meta?.status) {
        detail = `→ ${String(entry.meta.status).replace(/_/g, ' ')}`;
    } else if (entry.action === 'ASSIGN' && entry.meta) {
        const parts: string[] = [];
        if (entry.meta.assignedStaffId) parts.push('Staff assigned');
        if (entry.meta.assignedVehicleId) parts.push('Vehicle assigned');
        detail = parts.join(', ');
    } else if (entry.action.startsWith('INVOICE_') && entry.meta) {
        const invoiceNo = entry.meta.invoiceNo ? String(entry.meta.invoiceNo) : 'Invoice';
        const total = formatMoney(entry.meta.total);
        detail = [invoiceNo, total].filter(Boolean).join(' · ');
    } else if (entry.action.startsWith('PAYMENT_') && entry.meta) {
        const amount = formatMoney(entry.meta.amount);
        const method = entry.meta.method ? String(entry.meta.method) : String(entry.meta.provider || '');
        detail = [amount, method].filter(Boolean).join(' · ');
    }

    return { ...config, detail };
}

export default function BookingTimeline({ bookingId }: { bookingId: string }) {
    const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/bookings/${bookingId}/timeline`)
            .then(r => r.json())
            .then(data => setTimeline(data.timeline || []))
            .catch(() => setTimeline([]))
            .finally(() => setLoading(false));
    }, [bookingId]);

    if (loading) {
        return (
            <div className="p-6 text-center">
                <div className="inline-flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-antique-gold/30 border-t-antique-gold rounded-full animate-spin" />
                    <span className="text-xs text-white/40">Loading timeline...</span>
                </div>
            </div>
        );
    }

    if (timeline.length === 0) {
        return (
            <p className="text-sm text-gray-400 italic py-2">No activity recorded yet.</p>
        );
    }

    return (
        <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[15px] top-2 bottom-2 w-px bg-white/[0.06]" />

            <div className="space-y-4">
                {timeline.map((entry) => {
                    const display = getActionDisplay(entry);
                    const Icon = display.icon;
                    return (
                        <div key={entry._id} className="flex gap-3 relative">
                            <div className={`z-10 flex-shrink-0 w-[31px] h-[31px] rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center ${display.color}`}>
                                <Icon className="h-3.5 w-3.5" />
                            </div>
                            <div className="flex-1 min-w-0 pt-0.5">
                                <div className="flex items-baseline gap-2 flex-wrap">
                                    <span className={`text-xs font-semibold ${display.color}`}>{display.label}</span>
                                    {display.detail && (
                                        <span className="text-xs text-white/50">{display.detail}</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <UserCircle className="h-3 w-3 text-white/20 flex-shrink-0" />
                                    <span className="text-[10px] text-white/35">{entry.actor.name}</span>
                                    <span className="text-[10px] text-white/20">·</span>
                                    <span className="text-[10px] text-white/25">
                                        {new Date(entry.at).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
