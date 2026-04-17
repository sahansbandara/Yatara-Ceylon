import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { MyPlanDetailService } from '@/services/crud.service';
import { verifyToken } from '@/lib/auth';
import { ArrowLeft, CalendarDays, MapPin, Pencil, Compass, TrendingUp, Clock3 } from 'lucide-react';
import curatedPlaces from '@/data/places/sri-lanka.curated.json';

export default async function MyPlanDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get('toms_token')?.value;
    const payload = token ? await verifyToken(token) : null;

    if (!payload?.userId) {
        notFound();
    }

    const plan = await MyPlanDetailService.getPlanById(id, payload.userId, payload.email);
    if (!plan) {
        notFound();
    }

    const placeNameMap = new Map(
        (curatedPlaces as Array<{ id: string; name: string }>).map((place) => [place.id, place.name])
    );

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <Link href="/dashboard/my-plans" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-antique-gold transition-colors mb-3">
                        <ArrowLeft className="h-3 w-3" />
                        Back to My Plans
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-white drop-shadow-sm">
                        {plan.districtsUsed?.length > 1
                            ? `${plan.districtsUsed[0]} to ${plan.districtsUsed[plan.districtsUsed.length - 1]} Odyssey`
                            : plan.districtsUsed?.length === 1
                                ? `${plan.districtsUsed[0]} Explorer`
                                : plan.title || 'Custom Sri Lanka Odyssey'}
                    </h1>
                    <p className="mt-1.5 text-sm text-white/40 font-light flex items-center gap-2">
                        <Compass className="h-3.5 w-3.5 text-antique-gold/60" />
                        Saved itinerary overview and quick reopen access.
                    </p>
                </div>

                <Link
                    href={`/build-tour?planId=${plan._id}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-antique-gold/25 bg-antique-gold/10 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-antique-gold hover:bg-antique-gold/20 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all shrink-0"
                >
                    <Pencil className="h-3.5 w-3.5" />
                    Reopen in Build Tour
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="liquid-glass-stat-dark rounded-2xl p-5 border border-white/[0.03]">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                            <TrendingUp className="h-3.5 w-3.5" />
                        </div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">Status</p>
                    </div>
                    <p className="text-lg font-semibold text-white">{plan.status}</p>
                </div>
                <div className="liquid-glass-stat-dark rounded-2xl p-5 border border-white/[0.03]">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 rounded-lg bg-antique-gold/10 text-antique-gold">
                            <MapPin className="h-3.5 w-3.5" />
                        </div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">Districts</p>
                    </div>
                    <p className="text-lg font-semibold text-white">{plan.districtsUsed?.length || 0} Regions</p>
                </div>
                <div className="liquid-glass-stat-dark rounded-2xl p-5 border border-white/[0.03]">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
                            <Clock3 className="h-3.5 w-3.5" />
                        </div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">Saved On</p>
                    </div>
                    <p className="text-lg font-semibold text-white">{new Date(plan.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
            </div>

            <div className="liquid-glass-panel rounded-3xl p-8 border border-white/[0.05] overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-antique-gold/5 blur-[80px] -mr-32 -mt-32 pointer-events-none" />

                <h2 className="text-xl font-display font-semibold text-white mb-8 relative z-10 flex items-center gap-3">
                    <div className="h-8 w-1 bg-antique-gold rounded-full" />
                    Bespoke Plan Structure
                </h2>

                <div className="space-y-6 relative z-10">
                    {(plan.days || []).length > 0 ? (
                        plan.days.map((day: any) => (
                            <div key={day.dayNo} className="rounded-2xl border border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.04] transition-colors p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3 text-antique-gold">
                                        <div className="p-2 rounded-xl bg-antique-gold/10 border border-antique-gold/20">
                                            <CalendarDays className="h-4 w-4" />
                                        </div>
                                        <span className="text-sm font-bold uppercase tracking-[0.2em]">Day {day.dayNo}</span>
                                    </div>
                                    <span className="text-[10px] text-white/30 uppercase tracking-widest">{(day.places || []).length} Stops Planned</span>
                                </div>

                                <div className="flex flex-wrap gap-2.5">
                                    {(day.places || []).length > 0 ? (
                                        day.places.map((placeId: string) => (
                                            <span key={placeId} className="inline-flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-2 text-xs text-white/80 hover:border-antique-gold/30 hover:bg-antique-gold/5 transition-all group/stop">
                                                <MapPin className="h-3 w-3 text-antique-gold/50 group-hover/stop:text-antique-gold/80 transition-colors" />
                                                {placeNameMap.get(placeId) || placeId}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-xs text-white/20 italic font-light py-2">No selected destinations for this day.</span>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-12 text-center">
                            <Compass className="h-12 w-12 text-white/10 mx-auto mb-4" />
                            <p className="text-sm text-white/30 italic">This saved plan does not yet contain any structured day entries.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
