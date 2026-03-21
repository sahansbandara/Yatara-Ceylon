'use client';

import { useMemo } from 'react';
import { MapPin, Plus, Check, Sparkles, Car, Clock, ChevronRight, Globe } from 'lucide-react';
import { useBuildTourStore } from '@/lib/trip/store/useBuildTourStore';
import { ALL_CATEGORIES, CATEGORY_LABELS, getCategoryColor } from '@/lib/trip/types';
import { getDistrictById, formatTransferPrice, ALL_DISTRICTS } from '@/lib/districts';
import { SIGNATURE_REGIONS, DISTRICT_TO_REGION, getRegionById } from '@/lib/regions';
import type { PlaceCategory, Place } from '@/lib/trip/types';

interface ConciergePanelProps {
    activeRegionId: string | null;
    onSelectRegion: (id: string | null) => void;
}

export default function ConciergePanel({ activeRegionId, onSelectRegion }: ConciergePanelProps) {
    const stops = useBuildTourStore((s) => s.stops);
    const places = useBuildTourStore((s) => s.places);
    const filters = useBuildTourStore((s) => s.filters);
    const toggleCategory = useBuildTourStore((s) => s.toggleCategory);
    const addStop = useBuildTourStore((s) => s.addStop);
    const isInStops = useBuildTourStore((s) => s.isInStops);
    const route = useBuildTourStore((s) => s.route);

    const selectedDistrict = filters.district
        ? ALL_DISTRICTS.find((d) => d.name.toLowerCase() === filters.district!.toLowerCase())
        : null;

    const activeRegion = activeRegionId ? getRegionById(activeRegionId) : null;

    const districtPlaces = useMemo(() => {
        if (!selectedDistrict) return [];
        return places.filter(
            (p) => p.districtId === selectedDistrict.id ||
                p.district.toLowerCase() === selectedDistrict.name.toLowerCase()
        );
    }, [places, selectedDistrict]);

    const stopsDistricts = useMemo(() => {
        return new Set(stops.map((s) => s.place.district));
    }, [stops]);

    return (
        <div className="h-full flex flex-col overflow-hidden">
            {/* ── Journey Summary Card — glass effect ────────── */}
            <div className="px-4 pt-4 pb-3">
                <div className="rounded-xl border border-antique-gold/[0.08] bg-antique-gold/[0.03] p-4 relative overflow-hidden">
                    {/* Subtle gold gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-antique-gold/[0.04] via-transparent to-transparent pointer-events-none" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="w-3.5 h-3.5 text-antique-gold/60" />
                            <span className="text-[10px] text-antique-gold/70 uppercase tracking-[0.25em] font-nav font-medium">
                                Trip Snapshot
                            </span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <p className="text-white/80 font-serif text-lg leading-none">{stops.length}</p>
                                <p className="text-white/25 text-[8px] uppercase tracking-wider mt-1 font-nav">Stops</p>
                            </div>
                            <div>
                                <p className="text-white/80 font-serif text-lg leading-none">{stopsDistricts.size}</p>
                                <p className="text-white/25 text-[8px] uppercase tracking-wider mt-1 font-nav">Districts</p>
                            </div>
                            <div>
                                <p className="text-white/80 font-serif text-lg leading-none">
                                    {route ? `~${route.totalKm}` : '—'}
                                </p>
                                <p className="text-white/25 text-[8px] uppercase tracking-wider mt-1 font-nav">km</p>
                            </div>
                        </div>
                        {/* Concierge note */}
                        {stops.length >= 2 && (
                            <div className="mt-3 pt-3 border-t border-white/5">
                                <p className="text-antique-gold/40 text-[9px] font-light italic">
                                    {stops.length <= 4 ? 'Relaxed pace — ideal for luxury travel' :
                                     stops.length <= 7 ? 'Balanced route — good coverage with comfort' :
                                     'Dense itinerary — consider spreading across more days'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Content Area ────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-4 pb-4 custom-scrollbar">
                {/* State 1: No region — region cards with glass hover */}
                {!activeRegionId && !selectedDistrict && (
                    <div className="space-y-2.5">
                        <div className="flex items-center gap-2 mb-1">
                            <Globe className="w-3 h-3 text-white/20" />
                            <span className="text-[9px] text-white/30 uppercase tracking-[0.2em] font-nav">
                                Choose a Region
                            </span>
                        </div>
                        {SIGNATURE_REGIONS.map((region) => (
                            <button
                                key={region.id}
                                onClick={() => onSelectRegion(region.id)}
                                className="w-full text-left rounded-xl region-card-glass p-3.5 group"
                            >
                                <div className="flex items-start justify-between relative z-10">
                                    <div className="flex-1">
                                        <p className="font-serif text-[13px] text-white/85 group-hover:text-white transition-colors">
                                            {region.name}
                                        </p>
                                        <p className="text-white/30 text-[10px] mt-0.5 font-light leading-relaxed">
                                            {region.tagline}
                                        </p>
                                        <div className="flex items-center gap-1 mt-2">
                                            <span className="text-[8px] text-antique-gold/40 font-nav uppercase tracking-wider">
                                                {region.districtIds.length} districts
                                            </span>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-antique-gold/50 transition-colors mt-1 flex-shrink-0" />
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {/* State 2: Region selected, no district */}
                {activeRegion && !selectedDistrict && (
                    <div className="space-y-2.5">
                        <button
                            onClick={() => onSelectRegion(null)}
                            className="flex items-center gap-1.5 text-[9px] text-antique-gold/50 hover:text-antique-gold font-nav uppercase tracking-wider transition-colors mb-1"
                        >
                            ← All Regions
                        </button>
                        <div className="mb-3">
                            <h3 className="font-serif text-base text-white/90">{activeRegion.name}</h3>
                            <p className="text-white/30 text-[10px] mt-0.5 font-light">{activeRegion.tagline}</p>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                            <MapPin className="w-3 h-3 text-white/20" />
                            <span className="text-[9px] text-white/30 uppercase tracking-[0.2em] font-nav">
                                Select a District on the Map
                            </span>
                        </div>
                        {activeRegion.districtIds.map((dId) => {
                            const district = getDistrictById(dId);
                            if (!district) return null;
                            return (
                                <div
                                    key={dId}
                                    className="rounded-xl region-card-glass p-3.5"
                                >
                                    <p className="font-serif text-[13px] text-white/80">{district.name}</p>
                                    <p className="text-antique-gold/40 text-[10px] mt-0.5 font-light italic">{district.luxuryLabel}</p>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {district.gems.slice(0, 3).map((gem) => (
                                            <span key={gem} className="px-2 py-0.5 bg-white/[0.04] rounded text-[8px] text-white/35 font-nav">
                                                {gem}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* State 3: District selected — places with glass cards */}
                {selectedDistrict && (
                    <div className="space-y-2.5">
                        <button
                            onClick={() => {
                                useBuildTourStore.getState().setDistrictFilter(null);
                            }}
                            className="flex items-center gap-1.5 text-[9px] text-antique-gold/50 hover:text-antique-gold font-nav uppercase tracking-wider transition-colors mb-1"
                        >
                            ← {activeRegion ? activeRegion.name : 'All Regions'}
                        </button>

                        {/* District header — gold accent glass */}
                        <div className="rounded-xl border border-antique-gold/10 bg-antique-gold/[0.03] p-4 mb-2 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-antique-gold/[0.05] via-transparent to-transparent pointer-events-none" />
                            <div className="relative z-10">
                                <p className="font-serif text-base text-white/90">{selectedDistrict.name}</p>
                                <p className="text-antique-gold/50 text-[11px] mt-0.5 font-light italic">{selectedDistrict.luxuryLabel}</p>
                                <div className="flex items-center gap-4 mt-3">
                                    <div className="flex items-center gap-1.5 text-white/30">
                                        <Car className="w-3 h-3" />
                                        <span className="text-[9px] font-nav">from {formatTransferPrice(selectedDistrict.transferStart)}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-white/30">
                                        <MapPin className="w-3 h-3" />
                                        <span className="text-[9px] font-nav">{districtPlaces.length} places</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Signature Gems */}
                        <div className="mb-2">
                            <span className="text-[9px] text-white/25 uppercase tracking-[0.2em] font-nav">Signature Gems</span>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                {selectedDistrict.gems.map((gem) => (
                                    <span key={gem} className="px-2.5 py-1 bg-antique-gold/[0.06] border border-antique-gold/10 rounded-lg text-[9px] text-antique-gold/60 font-nav">
                                        {gem}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Category filters */}
                        <div className="mb-2">
                            <span className="text-[9px] text-white/25 uppercase tracking-[0.2em] font-nav">Filter by Interest</span>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                {ALL_CATEGORIES.slice(0, 6).map((cat) => {
                                    const isActive = filters.categories.includes(cat);
                                    const color = getCategoryColor(cat);
                                    return (
                                        <button
                                            key={cat}
                                            onClick={() => toggleCategory(cat)}
                                            className={`px-2.5 py-1 rounded-full text-[8px] uppercase tracking-wider font-nav transition-all duration-200 ${isActive
                                                ? 'shadow-sm'
                                                : 'bg-white/5 text-white/35 hover:bg-white/8 hover:text-white/55 border border-white/5'
                                            }`}
                                            style={isActive ? { backgroundColor: color + '20', color, borderColor: color + '35', border: '1px solid' } : undefined}
                                        >
                                            {CATEGORY_LABELS[cat]}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Place cards — with glass hover popup effect */}
                        <div className="space-y-1.5">
                            {districtPlaces.map((place) => {
                                const inStops = isInStops(place.id);
                                const color = getCategoryColor(place.category);
                                if (filters.categories.length > 0 && !filters.categories.includes(place.category)) return null;

                                return (
                                    <div
                                        key={place.id}
                                        className={`group rounded-xl p-3 cursor-pointer place-card-glass ${inStops ? 'in-trip' : ''}`}
                                        onClick={() => !inStops && addStop(place)}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                                        style={{ backgroundColor: color }}
                                                    />
                                                    <p className="font-serif text-[12px] text-white/85 truncate">{place.name}</p>
                                                </div>
                                                <p className="text-white/30 text-[9px] mt-1 line-clamp-2 font-light leading-relaxed pl-3.5">
                                                    {place.teaser}
                                                </p>
                                                <div className="flex items-center gap-3 mt-1.5 pl-3.5">
                                                    <span className="text-[7px] uppercase tracking-wider font-nav" style={{ color: color + '99' }}>
                                                        {CATEGORY_LABELS[place.category as PlaceCategory] || place.category}
                                                    </span>
                                                    <div className="flex items-center gap-1 text-white/20">
                                                        <Clock className="w-2.5 h-2.5" />
                                                        <span className="text-[8px] font-nav">
                                                            {place.estimatedVisitMinutes < 60
                                                                ? `${place.estimatedVisitMinutes}m`
                                                                : `${Math.floor(place.estimatedVisitMinutes / 60)}h${place.estimatedVisitMinutes % 60 > 0 ? ` ${place.estimatedVisitMinutes % 60}m` : ''}`
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex-shrink-0 ml-2">
                                                {inStops ? (
                                                    <div className="w-7 h-7 rounded-full bg-antique-gold/10 flex items-center justify-center">
                                                        <Check className="w-3 h-3 text-antique-gold/70" />
                                                    </div>
                                                ) : (
                                                    <button
                                                        className="w-7 h-7 rounded-full bg-white/[0.04] flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-antique-gold/15 transition-all duration-300"
                                                        onClick={(e) => { e.stopPropagation(); addStop(place); }}
                                                    >
                                                        <Plus className="w-3 h-3 text-white/40 hover:text-antique-gold" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
