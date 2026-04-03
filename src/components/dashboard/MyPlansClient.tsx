'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowUpRight, Eye, MapPin, Pencil, Trash2, CalendarDays, Compass, X } from 'lucide-react';

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
            <div className="liquid-glass-panel border-antique-gold/10 rounded-3xl p-12 text-center text-white relative overflow-hidden animate-in fade-in duration-500">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-antique-gold/5 via-transparent to-transparent opacity-50" />
                <Compass className="h-16 w-16 text-antique-gold/40 mx-auto mb-6 relative z-10" />
                <h3 className="text-2xl font-display font-semibold mb-3 text-white relative z-10">No Saved Plans</h3>
                <p className="text-sm text-gray-400 mb-8 max-w-md mx-auto relative z-10">Design your dream Sri Lanka itinerary with our bespoke tour builder.</p>
                <Link
                    href="/build-tour"
                    className="relative z-10 inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-antique-gold to-[#c59b27] hover:from-[#c59b27] hover:to-[#b0891e] text-[#061a15] font-semibold text-sm rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all duration-300 transform hover:-translate-y-0.5"
                >
                    Build Your Tour <ArrowUpRight className="h-4 w-4" />
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {plans.map((plan: any) => (
                    <div
                        key={plan._id}
                        className="group relative liquid-glass-panel rounded-2xl overflow-hidden hover:shadow-[0_8px_32px_rgba(212,175,55,0.05)] transition-all duration-500 border border-white/[0.05] hover:border-antique-gold/20 flex flex-col bg-[#061a15]/40"
                    >
                        {/* Status Badge */}
                        <div className="absolute top-4 right-4 z-10">
                            <span className="px-2.5 py-1 bg-black/50 backdrop-blur-md border border-antique-gold/30 text-antique-gold drop-shadow-sm text-[10px] uppercase tracking-widest rounded-md font-semibold">
                                {plan.status}
                            </span>
                        </div>

                        {/* Content Area */}
                        <div className="p-6 flex-1 flex flex-col relative z-20">
                            <div className="flex items-start gap-4 mb-6 pr-20">
                                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-antique-gold/20 to-antique-gold/5 border border-antique-gold/30 flex items-center justify-center text-antique-gold shadow-[0_0_15px_rgba(212,175,55,0.15)] flex-shrink-0">
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-display font-semibold text-white group-hover:text-antique-gold transition-colors leading-tight">
                                        {plan.districtsUsed?.length > 1
                                            ? `${plan.districtsUsed[0]} to ${plan.districtsUsed[plan.districtsUsed.length - 1]} Odyssey`
                                            : plan.districtsUsed?.length === 1
                                                ? `${plan.districtsUsed[0]} Explorer`
                                                : plan.title || 'Custom Sri Lanka Odyssey'}
                                    </h3>
                                    <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
                                        <CalendarDays className="h-3 w-3" />
                                        Created {new Date(plan.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>

                            {/* Districts List */}
                            <div className="bg-white/[0.02] border border-white/[0.03] rounded-xl p-4 mb-6 group-hover:bg-white/[0.04] transition-colors">
                                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2 flex items-center gap-1">
                                    <Compass className="h-3 w-3" />
                                    {plan.districtsUsed?.length || 0} Districts Selected
                                </p>
                                {plan.districtsUsed?.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {plan.districtsUsed.map((district: string) => (
                                            <span
                                                key={district}
                                                className="inline-flex items-center px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-white/80 font-medium"
                                            >
                                                {district}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm font-medium text-white/30 italic">No districts assigned.</p>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-auto flex items-center gap-3">
                                <Link
                                    href={`/dashboard/my-plans/${plan._id}`}
                                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70 hover:text-white hover:border-white/30 hover:bg-white/10 transition-all duration-300"
                                >
                                    <Eye className="h-3.5 w-3.5" />
                                    View
                                </Link>
                                <Link
                                    href={`/build-tour?planId=${plan._id}`}
                                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-antique-gold/25 bg-antique-gold/10 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-antique-gold hover:bg-antique-gold/20 hover:shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all duration-300"
                                >
                                    <Pencil className="h-3.5 w-3.5" />
                                    Reopen
                                </Link>
                                <button
                                    type="button"
                                    disabled={deletingId === plan._id}
                                    onClick={() => handleDelete(plan._id)}
                                    className="inline-flex items-center justify-center p-3 rounded-xl border border-red-400/20 bg-red-500/10 text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-all duration-300 disabled:opacity-50"
                                    title="Delete Plan"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
