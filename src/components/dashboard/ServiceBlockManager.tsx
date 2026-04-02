'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarRange, Loader2, Trash2, AlertTriangle, CheckCircle2, MinusCircle, Wrench, User, MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ServiceBlockReasons } from '@/lib/constants';

interface PartnerServiceBlock {
    _id: string;
    from: string;
    to: string;
    reason: string;
}

const REASON_META: Record<string, { label: string; colorClass: string; icon: typeof Wrench }> = {
    BOOKING: { label: 'Booking Reserved', colorClass: 'text-blue-400', icon: CalendarRange },
    RENOVATION: { label: 'Under Renovation', colorClass: 'text-amber-400', icon: Wrench },
    PERSONAL: { label: 'Personal Use', colorClass: 'text-neutral-400', icon: User },
    OTHER: { label: 'Other', colorClass: 'text-white/50', icon: MoreHorizontal },
};

type FeedbackState = 'idle' | 'success' | 'error';

export default function ServiceBlockManager({
    serviceId,
    initialBlocks,
    hideTitle = false,
}: {
    serviceId: string;
    initialBlocks: PartnerServiceBlock[];
    hideTitle?: boolean;
}) {
    const [blocks, setBlocks] = useState<PartnerServiceBlock[]>(initialBlocks || []);
    const [loading, setLoading] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<FeedbackState>('idle');
    const [errorMsg, setErrorMsg] = useState('');
    const router = useRouter();

    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [reason, setReason] = useState<string>('RENOVATION');

    const showFeedback = (state: FeedbackState, msg = '') => {
        setFeedback(state);
        setErrorMsg(msg);
        setTimeout(() => setFeedback('idle'), 3500);
    };

    const handleAddBlock = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!from || !to) { showFeedback('error', 'Both dates are required.'); return; }
        if (new Date(to) < new Date(from)) { showFeedback('error', 'End date must be after start date.'); return; }

        setLoading(true);
        try {
            const res = await fetch('/api/partner-service-blocks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ serviceId, from, to, reason }),
            });
            const data = await res.json();
            if (res.ok) {
                setBlocks((prev) => [data.block, ...prev]);
                setFrom('');
                setTo('');
                setReason('RENOVATION');
                showFeedback('success');
                router.refresh();
            } else {
                showFeedback('error', data.error || 'Failed to add block. Please try again.');
            }
        } catch {
            showFeedback('error', 'Network error — block was not saved.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBlock = async (blockId: string) => {
        if (!confirm('Remove this availability block?')) return;
        setDeletingId(blockId);
        try {
            const res = await fetch(`/api/partner-service-blocks/${blockId}`, { method: 'DELETE' });
            if (res.ok) {
                setBlocks((prev) => prev.filter((b) => b._id !== blockId));
                router.refresh();
            } else {
                alert('Failed to remove block. Please try again.');
            }
        } catch {
            alert('Network error — block was not removed.');
        } finally {
            setDeletingId(null);
        }
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className={hideTitle ? '' : 'mt-4'}>
            {!hideTitle && (
                <div className="mb-4">
                    <h2 className="text-base font-semibold text-white mb-0.5">Service Availability Blocks</h2>
                    <p className="text-white/40 text-xs">
                        Temporarily remove this service from bookings without deleting it.
                    </p>
                </div>
            )}

            {/* Add Block Form */}
            <div className="mb-5">
                <p className="text-[10px] font-semibold text-white/40 mb-3 uppercase tracking-[0.15em]">Block a Period</p>
                <form onSubmit={handleAddBlock} className="flex flex-col gap-3">

                    {/* Date inputs with labels */}
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] text-white/40 uppercase tracking-wider font-medium">From</label>
                            <div className="relative">
                                <Input
                                    id={`from-${serviceId}`}
                                    type="date"
                                    required
                                    min={today}
                                    value={from}
                                    onChange={(e) => setFrom(e.target.value)}
                                    className="w-full bg-transparent border border-white/10 text-white/80 focus-visible:ring-1 focus-visible:ring-antique-gold/50 rounded-lg h-9 text-[12px] [color-scheme:dark] pl-8"
                                />
                                <CalendarRange className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30 pointer-events-none" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] text-white/40 uppercase tracking-wider font-medium">To</label>
                            <div className="relative">
                                <Input
                                    id={`to-${serviceId}`}
                                    type="date"
                                    required
                                    min={from || today}
                                    value={to}
                                    onChange={(e) => setTo(e.target.value)}
                                    className="w-full bg-transparent border border-white/10 text-white/80 focus-visible:ring-1 focus-visible:ring-antique-gold/50 rounded-lg h-9 text-[12px] [color-scheme:dark] pl-8"
                                />
                                <CalendarRange className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Reason Select with label */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] text-white/40 uppercase tracking-wider font-medium">Reason</label>
                        <Select value={reason} onValueChange={setReason}>
                            <SelectTrigger className="w-full bg-black/20 border border-white/10 text-white/80 hover:bg-white/[0.02] hover:border-white/20 focus-visible:ring-1 focus-visible:ring-antique-gold/50 h-9 rounded-lg text-[12px] transition-all">
                                <SelectValue placeholder="Select reason" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1a2018] border-white/[0.08] text-white rounded-xl shadow-2xl">
                                {Object.entries(REASON_META).map(([key, meta]) => {
                                    const Icon = meta.icon;
                                    return (
                                        <SelectItem
                                            key={key}
                                            value={key}
                                            className="focus:bg-white/[0.05] focus:text-antique-gold cursor-pointer text-[12px] py-2"
                                        >
                                            <span className="flex items-center gap-2">
                                                <Icon className={`h-3.5 w-3.5 ${meta.colorClass}`} />
                                                {meta.label}
                                            </span>
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Feedback banner */}
                    {feedback !== 'idle' && (
                        <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-medium transition-all ${
                            feedback === 'success'
                                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                                : 'bg-red-500/10 border border-red-500/20 text-red-400'
                        }`}>
                            {feedback === 'success'
                                ? <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
                                : <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                            }
                            <span>{feedback === 'success' ? 'Block applied successfully.' : errorMsg}</span>
                        </div>
                    )}

                    {/* Submit */}
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-9 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] hover:brightness-110 text-[#08110d] shadow-[0_4px_15px_rgba(212,175,55,0.15)] font-semibold text-[12px] tracking-wide transition-all disabled:opacity-60"
                    >
                        {loading ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin text-[#08110d]/60" /> : <MinusCircle className="mr-1.5 h-3.5 w-3.5" />}
                        Apply Block
                    </Button>
                </form>
            </div>

            {/* Block History */}
            {blocks.length > 0 && (
                <div>
                    <p className="text-[10px] font-semibold text-white/30 mb-2 uppercase tracking-[0.15em]">
                        Block History ({blocks.length})
                    </p>
                    <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-0.5 custom-scrollbar">
                        {blocks.map((block) => {
                            const meta = REASON_META[block.reason] || REASON_META.OTHER;
                            const Icon = meta.icon;
                            const isDeleting = deletingId === block._id;
                            return (
                                <div
                                    key={block._id}
                                    className="group flex items-center justify-between gap-2 border border-white/[0.05] bg-white/[0.015] hover:bg-white/[0.03] px-3 py-2 rounded-lg transition-all"
                                >
                                    <div className="flex items-center gap-2 min-w-0">
                                        <Icon className={`h-3 w-3 flex-shrink-0 ${meta.colorClass}`} />
                                        <div className="min-w-0">
                                            <p className={`text-[10px] font-semibold uppercase tracking-wider truncate ${meta.colorClass}`}>
                                                {meta.label}
                                            </p>
                                            <p className="text-[10px] text-white/40 mt-0.5">
                                                {format(new Date(block.from), 'MMM d')} – {format(new Date(block.to), 'MMM d, yyyy')}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteBlock(block._id)}
                                        disabled={isDeleting}
                                        className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md text-white/20 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                                        title="Remove block"
                                    >
                                        {isDeleting
                                            ? <Loader2 className="h-3 w-3 animate-spin" />
                                            : <Trash2 className="h-3 w-3" />
                                        }
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {blocks.length === 0 && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-white/[0.04] bg-white/[0.01]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400/60 flex-shrink-0" />
                    <p className="text-[11px] text-white/30">No blocks applied — service is fully available.</p>
                </div>
            )}
        </div>
    );
}
