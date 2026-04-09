'use client';

import { useBuildTourStore } from '@/lib/trip/store/useBuildTourStore';
import { Route, Clock, Gauge, MapPin, Send, AlertTriangle } from 'lucide-react';
import type { TripPace } from '@/lib/trip/types';

export default function RouteSummaryBar() {
    const stops = useBuildTourStore((s) => s.stops);
    const route = useBuildTourStore((s) => s.route);
    const routeLoading = useBuildTourStore((s) => s.routeLoading);
    const getTripEstimate = useBuildTourStore((s) => s.getTripEstimate);

    const estimate = route || getTripEstimate();
    const tripPace: TripPace = stops.length <= 3 ? 'Relaxed' : stops.length <= 6 ? 'Balanced' : 'Fast';
    const uniqueDistricts = new Set(stops.map((s) => s.place.district));
    const totalVisitMinutes = stops.reduce((sum, s) => sum + (s.place.estimatedVisitMinutes || 60), 0);

    /* ── Empty state ─────────────────────────────────────────── */
    if (stops.length < 2) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center px-8 py-16">
                <div className="w-14 h-14 rounded-2xl bg-deep-emerald/[0.03] border border-deep-emerald/[0.06] flex items-center justify-center mb-4">
                    <Route className="w-6 h-6 text-deep-emerald/15" strokeWidth={1.2} />
                </div>
                <h3 className="font-serif text-deep-emerald/90 text-sm tracking-wide mb-2">
                    Route Summary
                </h3>
                <p className="text-deep-emerald/60 text-[10px] font-light leading-relaxed max-w-[220px]">
                    Add at least <span className="text-antique-gold/60">2 stops</span> to see your route details and estimated travel times.
                </p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col overflow-y-auto custom-scrollbar">
            {/* Pace indicator */}
            <div className="px-4 pt-4 pb-3 border-b border-deep-emerald/[0.06]">
                <div className="flex items-center gap-2 mb-3">
                    <Gauge className="w-3.5 h-3.5 text-antique-gold/50" />
                    <span className="text-[9px] font-nav uppercase tracking-[0.2em] text-deep-emerald/40">
                        Trip Pace
                    </span>
                </div>
                <div className="flex gap-2">
                    {(['Relaxed', 'Balanced', 'Fast'] as TripPace[]).map((pace) => (
                        <span
                            key={pace}
                            className={`px-3 py-1.5 rounded-full text-[8px] font-nav uppercase tracking-widest transition-all duration-300 ${tripPace === pace
                                ? 'bg-antique-gold/15 text-antique-gold border border-antique-gold/25 shadow-sm shadow-antique-gold/10'
                                : 'bg-deep-emerald/[0.03] text-deep-emerald/60 border border-deep-emerald/[0.06]'
                                }`}
                        >
                            {pace}
                        </span>
                    ))}
                </div>
                {tripPace === 'Fast' && (
                    <div className="flex items-center gap-1.5 mt-2.5 text-amber-600/60">
                        <AlertTriangle className="w-3 h-3" />
                        <span className="text-[9px] font-light">Consider spreading across multiple days</span>
                    </div>
                )}
            </div>

            {/* Stats grid */}
            <div className="px-4 py-3 border-b border-deep-emerald/[0.06]">
                {routeLoading ? (
                    <div className="flex items-center justify-center py-6">
                        <div className="w-5 h-5 border-2 border-antique-gold/20 border-t-antique-gold rounded-full animate-spin" />
                        <span className="ml-3 text-deep-emerald/60 text-[10px] font-nav">Calculating route...</span>
                    </div>
                ) : estimate ? (
                    <div className="grid grid-cols-2 gap-2.5">
                        {[
                            { icon: Route, label: 'Distance', value: `~${estimate.totalKm}`, unit: 'km' },
                            { icon: Clock, label: 'Drive Time', value: `~${estimate.totalHours}`, unit: 'hrs' },
                            { icon: MapPin, label: 'Stops', value: `${stops.length}`, unit: 'places' },
                            { icon: Clock, label: 'Visit Time', value: `~${Math.round(totalVisitMinutes / 60)}`, unit: 'hrs' },
                        ].map((stat) => {
                            const Icon = stat.icon;
                            return (
                                <div key={stat.label} className="bg-deep-emerald/[0.02] rounded-xl p-3 border border-deep-emerald/[0.05] hover:border-deep-emerald/[0.10] transition-colors">
                                    <div className="flex items-center gap-1.5 mb-1.5">
                                        <Icon className="w-3 h-3 text-antique-gold/50" />
                                        <span className="text-[7px] uppercase tracking-wider text-deep-emerald/60 font-nav">{stat.label}</span>
                                    </div>
                                    <p className="text-deep-emerald/80 font-serif text-lg leading-none">
                                        {stat.value}
                                        <span className="text-[9px] text-deep-emerald/60 font-light ml-1">{stat.unit}</span>
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                ) : null}
            </div>

            {/* Itinerary summary */}
            <div className="px-4 py-3 border-b border-deep-emerald/[0.06]">
                <h4 className="text-[9px] uppercase tracking-[0.2em] font-nav text-deep-emerald/60 mb-2.5">
                    Itinerary Order
                </h4>
                <div className="space-y-2">
                    {stops.map((stop, idx) => (
                        <div key={stop.stopId} className="flex items-start gap-2.5">
                            <div className="flex flex-col items-center flex-shrink-0">
                                <div className="w-5 h-5 bg-antique-gold/10 text-antique-gold flex items-center justify-center font-serif text-[9px] rounded-full border border-antique-gold/20">
                                    {idx + 1}
                                </div>
                                {idx < stops.length - 1 && (
                                    <div className="w-px h-4 bg-antique-gold/8 mt-0.5" />
                                )}
                            </div>
                            <div className="pt-0.5">
                                <p className="font-serif text-deep-emerald/80 text-[11px] leading-tight">{stop.place.name}</p>
                                <p className="text-deep-emerald/60 text-[8px] font-nav">{stop.place.district}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Districts covered */}
            <div className="px-4 py-3 border-b border-deep-emerald/[0.06]">
                <h4 className="text-[9px] uppercase tracking-[0.2em] font-nav text-deep-emerald/60 mb-2">
                    Districts Covered
                </h4>
                <div className="flex flex-wrap gap-1.5">
                    {Array.from(uniqueDistricts).map((d) => (
                        <span key={d} className="px-2 py-1 bg-deep-emerald/[0.04] border border-deep-emerald/[0.06] rounded-lg text-[8px] text-deep-emerald/80 font-nav">
                            {d}
                        </span>
                    ))}
                </div>
            </div>

            {/* Disclaimer + CTA */}
            <div className="px-4 py-3 mt-auto">
                <p className="text-deep-emerald/50 text-[8px] font-light tracking-wider mb-3 leading-relaxed">
                    Estimated route via district centres. Your personal concierge will confirm exact routing, transfers, and timings.
                </p>
                <button
                    onClick={() => {
                        const itinerary = stops.map((s) => s.place.name).join(', ');
                        const districts = Array.from(uniqueDistricts).join(', ');
                        const params = new URLSearchParams({ itinerary, districts, source: 'build-tour' });
                        window.location.href = `/inquire?${params.toString()}`;
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-antique-gold text-deep-emerald font-serif text-[11px] uppercase tracking-[0.2em] rounded-lg hover:shadow-lg hover:shadow-antique-gold/30 hover:scale-[1.01] transition-all font-semibold"
                >
                    <Send className="w-3.5 h-3.5" />
                    Request Proposal
                </button>
            </div>
        </div>
    );
}
