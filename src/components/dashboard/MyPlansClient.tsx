'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Eye, MapPin, Pencil, Trash2 } from 'lucide-react';

export default function MyPlansClient({ initialPlans }: { initialPlans: any[] }) {
    const [plans, setPlans] = useState(initialPlans);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (planId: string) => {
        if (!confirm('Delete this saved plan? You can keep editing in Build Tour before deleting if needed.')) {
            return;
        }

        setDeletingId(planId);
        try {
            const response = await fetch(`/api/plans?id=${planId}`, {
                method: 'DELETE',
            });
            const data = await response.json();

            if (!response.ok) {
                alert(data.error || 'Unable to delete this plan right now.');
                return;
            }

            setPlans((current) => current.filter((plan) => plan._id !== planId));
        } catch (error) {
            console.error(error);
            alert('Unable to delete this plan right now.');
        } finally {
            setDeletingId(null);
        }
    };

    if (plans.length === 0) {
        return (
            <div className="liquid-glass-panel rounded-2xl p-12 text-center text-white">
                <MapPin className="h-12 w-12 text-white/20 mx-auto mb-4" />
                <h3 className="text-lg font-display font-semibold text-off-white mb-2">No Saved Plans</h3>
                <p className="text-sm text-white/40 mb-6">Design your dream Sri Lanka itinerary with our tour builder.</p>
                <Link
                    href="/build-tour"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-deep-emerald font-medium text-sm rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                    Build Your Tour <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2">
            {plans.map((plan: any) => (
                <div key={plan._id} className="liquid-glass-stat rounded-2xl p-6">
                    <div className="flex items-start gap-3 mb-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                            <MapPin className="h-4 w-4 text-amber-400" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-off-white truncate">{plan.title || 'Custom Plan'}</p>
                            <p className="text-[10px] text-white/40 uppercase tracking-wider">{plan.status}</p>
                        </div>
                    </div>

                    {plan.districtsUsed?.length > 0 && (
                        <p className="text-xs text-white/50">{plan.districtsUsed.length} districts selected</p>
                    )}
                    <p className="text-[10px] text-white/30 mt-2">
                        Created {new Date(plan.createdAt).toLocaleDateString()}
                    </p>

                    <div className="mt-5 grid gap-2 sm:grid-cols-3">
                        <Link
                            href={`/dashboard/my-plans/${plan._id}`}
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-white/70 hover:text-antique-gold hover:border-antique-gold/30 transition-all"
                        >
                            <Eye className="h-3.5 w-3.5" />
                            View
                        </Link>
                        <Link
                            href={`/build-tour?planId=${plan._id}`}
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-antique-gold/25 bg-antique-gold/10 px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-antique-gold hover:bg-antique-gold/15 transition-all"
                        >
                            <Pencil className="h-3.5 w-3.5" />
                            Reopen
                        </Link>
                        <button
                            type="button"
                            disabled={deletingId === plan._id}
                            onClick={() => handleDelete(plan._id)}
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-red-300 hover:bg-red-500/15 transition-all disabled:opacity-50"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            {deletingId === plan._id ? 'Deleting' : 'Delete'}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
