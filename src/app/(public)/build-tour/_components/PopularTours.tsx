'use client';

import { useState } from 'react';
import { useBuildTourStore } from '@/lib/trip/store/useBuildTourStore';
import { MapPin, Clock, Users, Star, ChevronRight, Sparkles, Heart, X } from 'lucide-react';
import type { Place } from '@/lib/trip/types';

/* ──────────────────────────────────────────────────────────────
   Popular Tour Plans — community-favourite builds that users
   can click to pre-fill the builder, then customise freely.
   ────────────────────────────────────────────────────────────── */

interface PopularTour {
    id: string;
    title: string;
    tagline: string;
    duration: string;
    popularity: number;      // % (display only)
    gradient: string;
    accent: string;
    placeIds: string[];
    tags: string[];
    image: string;
}

const POPULAR_TOURS: PopularTour[] = [
    {
        id: 'grand-circuit',
        title: 'The Grand Circuit',
        tagline: 'Coast to highlands — the essential Sri Lanka in 10 stops',
        duration: '10–12 days',
        popularity: 94,
        gradient: 'from-[#043927] via-[#043927]/60 to-transparent',
        accent: '#D4AF37',
        placeIds: [
            'colombo-galle-face',
            'matale-sigiriya',
            'matale-dambulla',
            'kandy-tooth',
            'nuwaraeliya-horton',
            'nuwaraeliya-bluefield',
            'badulla-nine-arches',
            'hambantota-yala',
            'matara-mirissa',
            'galle-fort',
        ],
        tags: ['Most Popular', 'Best of Sri Lanka'],
        image: '/images/tours/grand-circuit.webp',
    },
    {
        id: 'cultural-immersion',
        title: 'Heritage & Temple Trail',
        tagline: 'Ancient kingdoms, sacred temples & UNESCO treasures',
        duration: '6–8 days',
        popularity: 87,
        gradient: 'from-purple-900 via-purple-800/60 to-transparent',
        accent: '#c084fc',
        placeIds: [
            'anuradhapura-bodhi',
            'anuradhapura-ruwanweli',
            'anuradhapura-mihintale',
            'matale-sigiriya',
            'matale-dambulla',
            'polonnaruwa-ruins',
            'kandy-tooth',
            'kandy-botanical',
        ],
        tags: ['Cultural', 'Heritage'],
        image: '/images/tours/heritage-temple.webp',
    },
    {
        id: 'hill-country-escape',
        title: 'Hill Country & Rail',
        tagline: 'Tea plantations, misty peaks & the famous train ride',
        duration: '5–7 days',
        popularity: 82,
        gradient: 'from-emerald-900 via-emerald-800/60 to-transparent',
        accent: '#34d399',
        placeIds: [
            'kandy-tooth',
            'kandy-knuckles',
            'nuwaraeliya-horton',
            'nuwaraeliya-bluefield',
            'nuwaraeliya-gregory',
            'badulla-nine-arches',
            'badulla-little-adams',
        ],
        tags: ['Scenic', 'Train Ride'],
        image: '/images/tours/hill-country.webp',
    },
    {
        id: 'wildlife-adventure',
        title: 'Wildlife & Safari Circuit',
        tagline: 'Leopards, elephants & untouched wilderness across 4 parks',
        duration: '7–9 days',
        popularity: 79,
        gradient: 'from-amber-900 via-amber-800/60 to-transparent',
        accent: '#fbbf24',
        placeIds: [
            'kegalle-pinnawala',
            'polonnaruwa-minneriya',
            'hambantota-yala',
            'hambantota-bundala',
            'moneragala-galoya',
            'ratnapura-sinharaja',
        ],
        tags: ['Wildlife', 'Nature'],
        image: '/images/tours/wildlife-safari.webp',
    },
    {
        id: 'coastal-bliss',
        title: 'Coastal Bliss',
        tagline: 'Pristine beaches from south coast to the east',
        duration: '8–10 days',
        popularity: 76,
        gradient: 'from-cyan-900 via-cyan-800/60 to-transparent',
        accent: '#22d3ee',
        placeIds: [
            'galle-fort',
            'galle-unawatuna',
            'matara-mirissa',
            'matara-hiriketiya',
            'matara-weligama',
            'ampara-arugam',
            'trinco-nilaveli',
            'trinco-pigeon',
        ],
        tags: ['Beach', 'Surfing'],
        image: '/images/tours/coastal-bliss.webp',
    },
    {
        id: 'quick-highlights',
        title: 'Quick Highlights',
        tagline: 'Short on time? Hit the must-sees in under a week',
        duration: '4–5 days',
        popularity: 73,
        gradient: 'from-rose-900 via-rose-800/60 to-transparent',
        accent: '#fb7185',
        placeIds: [
            'colombo-galle-face',
            'matale-sigiriya',
            'kandy-tooth',
            'nuwaraeliya-horton',
            'galle-fort',
        ],
        tags: ['Short Trip', 'Essentials'],
        image: '/images/tours/quick-highlights.webp',
    },
    {
        id: 'honeymoon-luxe',
        title: 'Honeymoon Luxe',
        tagline: 'Romance, privacy & unforgettable sunset moments',
        duration: '7–8 days',
        popularity: 71,
        gradient: 'from-pink-900 via-pink-800/60 to-transparent',
        accent: '#f472b6',
        placeIds: [
            'colombo-dutch-hospital',
            'matale-sigiriya',
            'kandy-botanical',
            'nuwaraeliya-gregory',
            'badulla-nine-arches',
            'matara-mirissa',
            'galle-fort',
        ],
        tags: ['Romantic', 'Luxury'],
        image: '/images/tours/honeymoon-luxe.webp',
    },
    {
        id: 'off-beaten-path',
        title: 'Off the Beaten Path',
        tagline: 'Hidden gems & secret spots most tourists never see',
        duration: '8–10 days',
        popularity: 68,
        gradient: 'from-indigo-900 via-indigo-800/60 to-transparent',
        accent: '#818cf8',
        placeIds: [
            'matale-riverston',
            'kandy-knuckles',
            'badulla-dunhinda',
            'ratnapura-sinharaja',
            'ratnapura-adams-peak',
            'moneragala-galoya',
            'ampara-kumana',
            'kurunegala-yapahuwa',
        ],
        tags: ['Adventure', 'Hidden Gems'],
        image: '/images/tours/off-beaten.webp',
    },
];

export default function PopularTours() {
    const places = useBuildTourStore((s) => s.places);
    const addStop = useBuildTourStore((s) => s.addStop);
    const clearStops = useBuildTourStore((s) => s.clearStops);
    const isInStops = useBuildTourStore((s) => s.isInStops);
    const stops = useBuildTourStore((s) => s.stops);

    const [previewTour, setPreviewTour] = useState<PopularTour | null>(null);

    const resolvedPlaces = (placeIds: string[]) =>
        placeIds.map((id) => places.find((p: Place) => p.id === id)).filter(Boolean) as Place[];

    const applyTour = (tour: PopularTour, replace: boolean) => {
        if (replace) clearStops();
        tour.placeIds.forEach((id) => {
            const place = places.find((p: Place) => p.id === id);
            if (place && !isInStops(place.id)) {
                addStop(place);
            }
        });
        setPreviewTour(null);
        document.getElementById('trip-builder')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="py-20 bg-[#0a0f0d] relative overflow-hidden">
            {/* Subtle pattern */}
            <div
                className="absolute inset-0 opacity-[0.015]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />

            <div className="section-container relative z-10">
                {/* Header */}
                <div className="text-center mb-14">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="h-px w-12 bg-antique-gold/30" />
                        <span className="text-antique-gold text-[10px] tracking-[0.3em] uppercase font-serif flex items-center gap-1.5">
                            <Heart className="w-3 h-3" />
                            Traveller Favourites
                        </span>
                        <div className="h-px w-12 bg-antique-gold/30" />
                    </div>
                    <h2 className="font-display text-3xl sm:text-4xl text-white mb-3">
                        Popular Tour Plans
                    </h2>
                    <p className="text-white/40 text-sm font-light max-w-lg mx-auto">
                        Start from a plan loved by other travellers, then make it yours —
                        add places, remove stops, and customise freely.
                    </p>
                </div>

                {/* Tour Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {POPULAR_TOURS.map((tour) => {
                        const resolved = resolvedPlaces(tour.placeIds);
                        return (
                            <button
                                key={tour.id}
                                onClick={() => setPreviewTour(tour)}
                                className="group relative rounded-2xl overflow-hidden border border-white/10 text-left transition-all duration-500 hover:-translate-y-2 hover:scale-[1.03] hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
                            >
                                {/* Background Image */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                                    style={{ backgroundImage: `url(${tour.image})` }}
                                />
                                {/* BG Gradient & Liquid Glass Effect */}
                                <div className={`absolute inset-0 bg-gradient-to-t ${tour.gradient} opacity-40 group-hover:opacity-60 transition-opacity duration-500`} />
                                <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-transparent to-[#0a0f0d]/90" />

                                {/* Content Layer with Glass Border */}
                                <div className="relative z-10 p-6 flex flex-col h-full min-h-[300px] border border-white/5 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] group-hover:border-antique-gold/30 transition-colors duration-500">
                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {tour.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-2 py-0.5 rounded text-[8px] font-serif uppercase tracking-wider border"
                                                style={{
                                                    color: tour.accent,
                                                    borderColor: `${tour.accent}30`,
                                                    backgroundColor: `${tour.accent}08`,
                                                }}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Title & Tagline */}
                                    <h3 className="font-serif text-lg text-white mb-1 group-hover:text-antique-gold/90 transition-colors">
                                        {tour.title}
                                    </h3>
                                    <p className="text-white/35 text-[11px] font-light leading-relaxed mb-auto">
                                        {tour.tagline}
                                    </p>

                                    {/* Meta */}
                                    <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white/5">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3 text-white/25" />
                                            <span className="text-white/40 text-[10px] font-serif">{tour.duration}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3 text-white/25" />
                                            <span className="text-white/40 text-[10px] font-serif">{resolved.length} stops</span>
                                        </div>
                                        <div className="flex items-center gap-1 ml-auto">
                                            <Users className="w-3 h-3 text-white/25" />
                                            <span className="text-white/40 text-[10px] font-serif">{tour.popularity}%</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Hover arrow */}
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ChevronRight className="w-4 h-4 text-antique-gold/60" />
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── Preview Modal ───────────────────────────────────── */}
            {previewTour && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                    onClick={() => setPreviewTour(null)}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

                    {/* Modal */}
                    <div
                        className="relative w-full max-w-lg bg-[#0d1210] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className={`relative p-6 bg-gradient-to-br ${previewTour.gradient}`}>
                            <button
                                onClick={() => setPreviewTour(null)}
                                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/30 text-white/60 hover:text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            <div className="flex flex-wrap gap-1 mb-3">
                                {previewTour.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-2 py-0.5 rounded text-[9px] font-serif uppercase tracking-wider"
                                        style={{
                                            color: previewTour.accent,
                                            backgroundColor: `${previewTour.accent}15`,
                                        }}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <h3 className="font-display text-2xl text-white mb-1">{previewTour.title}</h3>
                            <p className="text-white/50 text-sm font-light">{previewTour.tagline}</p>
                            <div className="flex items-center gap-4 mt-3">
                                <span className="text-white/40 text-xs font-serif flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {previewTour.duration}
                                </span>
                                <span className="text-white/40 text-xs font-serif flex items-center gap-1">
                                    <Users className="w-3 h-3" /> {previewTour.popularity}% pick this
                                </span>
                            </div>
                        </div>

                        {/* Places List */}
                        <div className="p-6">
                            <p className="text-white/30 text-[10px] uppercase tracking-[0.2em] font-serif mb-3">
                                Included Stops — tap "Use This Plan" to customise
                            </p>
                            <div className="space-y-2 max-h-[260px] overflow-y-auto custom-scrollbar">
                                {resolvedPlaces(previewTour.placeIds).map((place, i) => (
                                    <div
                                        key={place.id}
                                        className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.02] border border-white/5"
                                    >
                                        <span
                                            className="w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-serif font-bold flex-shrink-0"
                                            style={{
                                                color: previewTour.accent,
                                                backgroundColor: `${previewTour.accent}12`,
                                            }}
                                        >
                                            {i + 1}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white/80 text-sm font-serif truncate">{place.name}</p>
                                            <p className="text-white/25 text-[10px] font-light">{place.district}</p>
                                        </div>
                                        {isInStops(place.id) && (
                                            <span className="text-antique-gold/50 text-[9px] font-serif">Already added</span>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => applyTour(previewTour, true)}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-antique-gold/10 border border-antique-gold/30 text-antique-gold font-serif text-xs uppercase tracking-[0.15em] rounded-lg hover:bg-antique-gold/20 hover:border-antique-gold/50 transition-all"
                                >
                                    <Sparkles className="w-3.5 h-3.5" />
                                    Use This Plan
                                </button>
                                {stops.length > 0 && (
                                    <button
                                        onClick={() => applyTour(previewTour, false)}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 text-white/60 font-serif text-xs uppercase tracking-[0.15em] rounded-lg hover:bg-white/10 hover:border-white/20 transition-all"
                                    >
                                        <MapPin className="w-3.5 h-3.5" />
                                        Add to Current
                                    </button>
                                )}
                            </div>

                            <p className="text-center text-white/20 text-[10px] font-light mt-3">
                                You can add or remove any stops after loading
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
