import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { MyPlanDetailService } from '@/services/crud.service';
import { verifyToken } from '@/lib/auth';
import { ArrowLeft, CalendarDays, MapPin, Pencil } from 'lucide-react';
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
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <Link href="/dashboard/my-plans" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/40 hover:text-antique-gold transition-colors">
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Back to My Plans
                    </Link>
                    <h1 className="mt-3 text-3xl font-display font-bold tracking-tight text-white">{plan.title || 'Custom Plan'}</h1>
                    <p className="mt-1 text-sm text-white/40">Saved itinerary overview and quick reopen access.</p>
                </div>

                <Link
                    href={`/build-tour?planId=${plan._id}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-antique-gold/25 bg-antique-gold/10 px-4 py-2.5 text-xs uppercase tracking-[0.18em] text-antique-gold hover:bg-antique-gold/15 transition-all"
                >
                    <Pencil className="h-3.5 w-3.5" />
                    Reopen in Build Tour
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="liquid-glass-stat rounded-2xl p-5">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">Status</p>
                    <p className="mt-2 text-lg font-semibold text-white">{plan.status}</p>
                </div>
                <div className="liquid-glass-stat rounded-2xl p-5">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">Districts</p>
                    <p className="mt-2 text-lg font-semibold text-white">{plan.districtsUsed?.length || 0}</p>
                </div>
                <div className="liquid-glass-stat rounded-2xl p-5">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">Saved On</p>
                    <p className="mt-2 text-lg font-semibold text-white">{new Date(plan.createdAt).toLocaleDateString()}</p>
                </div>
            </div>

            <div className="liquid-glass-panel rounded-2xl p-6 text-white">
                <h2 className="text-lg font-display font-semibold text-off-white">Plan Structure</h2>
                <div className="mt-5 space-y-4">
                    {(plan.days || []).length > 0 ? (
                        plan.days.map((day: any) => (
                            <div key={day.dayNo} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                                <div className="flex items-center gap-2 text-antique-gold">
                                    <CalendarDays className="h-4 w-4" />
                                    <span className="text-sm font-semibold uppercase tracking-[0.18em]">Day {day.dayNo}</span>
                                </div>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {(day.places || []).length > 0 ? (
                                        day.places.map((placeId: string) => (
                                            <span key={placeId} className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/75">
                                                <MapPin className="h-3 w-3 text-antique-gold/70" />
                                                {placeNameMap.get(placeId) || placeId}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-sm text-white/35">No stops saved for this day.</span>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-white/40">This saved plan does not yet contain any structured day entries.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
