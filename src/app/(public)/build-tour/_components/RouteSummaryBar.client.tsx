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

    // Trip pace
    const tripPace: TripPace = stops.length <= 3 ? 'Relaxed' : stops.length <= 6 ? 'Balanced' : 'Fast';

    // Formatting
    const uniqueDistricts = new Set(stops.map((s) => s.place.district));
    const totalVisitMinutes = stops.reduce((sum, s) => sum + (s.place.estimatedVisitMinutes || 60), 0);

    if (stops.length < 2) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center px-8 py-16">
                <div className="w-16 h-16 rounded-2xl bg-white/3 border border-white/5 flex items-center justify-center mb-5">
                    <Route className="w-7 h-7 text-white/15" strokeWidth={1.2} />
                </div>
                <h3 className="font-serif text-white/50 text-sm tracking-wide mb-2">
                    Route Summary
                </h3>
                <p className="text-white/20 text-[10px] font-light leading-relaxed max-w-[220px]">
                    Add at least <span className="text-antique-gold/50">2 stops</span> to see your route details and estimated travel times.
                </p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col overflow-y-auto custom-scrollbar">
            {/* Pace indicator */}
            <div className="px-5 pt-5 pb-4 border-b border-white/5">
                <div className="flex items-center gap-2 mb-3">
                    <Gauge className="w-3.5 h-3.5 text-antique-gold/60" />
                    <span className="text-[10px] font-serif uppercase tracking-[0.2em] text-white/35">
                        Trip Pace
                    </span>
                </div>
                <div className="flex gap-2">
                    {(['Relaxed', 'Balanced', 'Fast'] as TripPace[]).map((pace) => (
                        <span
                            key={pace}
                            className={`px-3 py-1.5 rounded-full text-[9px] font-serif uppercase tracking-widest transition-all ${tripPace === pace
                                    ? 'bg-antique-gold/20 text-antique-gold border border-antique-gold/30'
                                    : 'bg-white/3 text-white/20 border border-white/5'
                                }`}
                        >
                            {pace}
                        </span>
                    ))}
                </div>
                {tripPace === 'Fast' && (
                    <div className="flex items-center gap-1.5 mt-3 text-amber-400/70">
                        <AlertTriangle className="w-3 h-3" />
                        <span className="text-[9px] font-light">Consider spreading across multiple days</span>
                    </div>
                )}
            </div>

            {/* Stats grid */}
            <div className="px-5 py-4 border-b border-white/5">
                {routeLoading ? (
                    <div className="flex items-center justify-center py-6">
                        <div className="w-5 h-5 border-2 border-antique-gold/20 border-t-antique-gold rounded-full animate-spin" />
                        <span className="ml-3 text-white/30 text-[10px] font-serif">Calculating route...</span>
                    </div>
                ) : estimate ? (
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/3 rounded-lg p-3.5 border border-white/5">
                            <div className="flex items-center gap-1.5 mb-1.5">
                                <Route className="w-3 h-3 text-antique-gold/60" />
                                <span className="text-[8px] uppercase tracking-wider text-white/25">Distance</span>
                            </div>
                            <p className="text-white/80 font-serif text-lg">
                                ~{estimate.totalKm}
                                <span className="text-[10px] text-white/30 font-light ml-1">km</span>
                            </p>
                        </div>
                        <div className="bg-white/3 rounded-lg p-3.5 border border-white/5">
                            <div className="flex items-center gap-1.5 mb-1.5">
                                <Clock className="w-3 h-3 text-antique-gold/60" />
                                <span className="text-[8px] uppercase tracking-wider text-white/25">Drive Time</span>
                            </div>
                            <p className="text-white/80 font-serif text-lg">
                                ~{estimate.totalHours}
                                <span className="text-[10px] text-white/30 font-light ml-1">hrs</span>
                            </p>
                        </div>
                        <div className="bg-white/3 rounded-lg p-3.5 border border-white/5">
                            <div className="flex items-center gap-1.5 mb-1.5">
                                <MapPin className="w-3 h-3 text-antique-gold/60" />
                                <span className="text-[8px] uppercase tracking-wider text-white/25">Stops</span>
                            </div>
                            <p className="text-white/80 font-serif text-lg">
                                {stops.length}
                                <span className="text-[10px] text-white/30 font-light ml-1">places</span>
                            </p>
                        </div>
                        <div className="bg-white/3 rounded-lg p-3.5 border border-white/5">
                            <div className="flex items-center gap-1.5 mb-1.5">
                                <Clock className="w-3 h-3 text-antique-gold/60" />
                                <span className="text-[8px] uppercase tracking-wider text-white/25">Visit Time</span>
                            </div>
                            <p className="text-white/80 font-serif text-lg">
                                ~{Math.round(totalVisitMinutes / 60)}
                                <span className="text-[10px] text-white/30 font-light ml-1">hrs</span>
                            </p>
                        </div>
                    </div>
                ) : null}
            </div>

            {/* Itinerary summary */}
            <div className="px-5 py-4 border-b border-white/5">
                <h4 className="text-[10px] uppercase tracking-[0.2em] font-serif text-white/30 mb-3">
                    Itinerary Order
                </h4>
                <div className="space-y-2.5">
                    {stops.map((stop, idx) => (
                        <div key={stop.stopId} className="flex items-start gap-3">
                            <div className="flex flex-col items-center flex-shrink-0">
                                <div className="w-6 h-6 bg-antique-gold/15 text-antique-gold flex items-center justify-center font-serif text-[10px] rounded-full border border-antique-gold/25">
                                    {idx + 1}
                                </div>
                                {idx < stops.length - 1 && (
                                    <div className="w-px h-5 bg-antique-gold/10 mt-1" />
                                )}
                            </div>
                            <div className="pt-0.5">
                                <p className="font-serif text-white/80 text-[12px]">{stop.place.name}</p>
                                <p className="text-white/25 text-[9px]">{stop.place.district}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Districts covered */}
            <div className="px-5 py-4 border-b border-white/5">
                <h4 className="text-[10px] uppercase tracking-[0.2em] font-serif text-white/30 mb-2">
                    Districts Covered
                </h4>
                <div className="flex flex-wrap gap-1.5">
                    {Array.from(uniqueDistricts).map((d) => (
                        <span key={d} className="px-2 py-1 bg-white/3 border border-white/5 rounded text-[9px] text-white/40 font-serif">
                            {d}
                        </span>
                    ))}
                </div>
            </div>

            {/* Disclaimer + CTA */}
            <div className="px-5 py-4 mt-auto">
                <p className="text-white/15 text-[9px] font-light tracking-wider mb-4 leading-relaxed">
                    Estimated route via district centres. Your personal concierge will confirm exact routing, transfers, and timings.
                </p>
                <button
                    onClick={() => {
                        const itinerary = stops.map((s) => s.place.name).join(', ');
                        const districts = Array.from(uniqueDistricts).join(', ');
                        const params = new URLSearchParams({ itinerary, districts, source: 'build-tour' });
                        window.location.href = `/inquire?${params.toString()}`;
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-antique-gold text-deep-emerald font-serif text-[11px] uppercase tracking-[0.2em] rounded-lg hover:shadow-lg hover:shadow-antique-gold/30 transition-all font-semibold"
                >
                    <Send className="w-3.5 h-3.5" />
                    Request Proposal
                </button>
            </div>
        </div>
    );
}
