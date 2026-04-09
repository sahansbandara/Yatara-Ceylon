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
    popularity: number;
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
        accent: '#043927',
        placeIds: [
            'colombo-galle-face', 'matale-sigiriya', 'matale-dambulla', 'kandy-tooth',
            'nuwaraeliya-horton', 'nuwaraeliya-bluefield', 'badulla-nine-arches',
            'hambantota-yala', 'matara-mirissa', 'galle-fort',
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
        accent: '#7c3aed',
        placeIds: [
            'anuradhapura-bodhi', 'anuradhapura-ruwanweli', 'anuradhapura-mihintale',
            'matale-sigiriya', 'matale-dambulla', 'polonnaruwa-ruins', 'kandy-tooth', 'kandy-botanical',
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
        accent: '#047857',
        placeIds: [
            'kandy-tooth', 'kandy-knuckles', 'nuwaraeliya-horton',
            'nuwaraeliya-bluefield', 'nuwaraeliya-gregory', 'badulla-nine-arches', 'badulla-little-adams',
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
        accent: '#b45309',
        placeIds: [
            'kegalle-pinnawala', 'polonnaruwa-minneriya', 'hambantota-yala',
            'hambantota-bundala', 'moneragala-galoya', 'ratnapura-sinharaja',
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
        accent: '#0e7490',
        placeIds: [
            'galle-fort', 'galle-unawatuna', 'matara-mirissa', 'matara-hiriketiya',
            'matara-weligama', 'ampara-arugam', 'trinco-nilaveli', 'trinco-pigeon',
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
        accent: '#be185d',
        placeIds: [
            'colombo-galle-face', 'matale-sigiriya', 'kandy-tooth', 'nuwaraeliya-horton', 'galle-fort',
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
        accent: '#be185d',
        placeIds: [
            'colombo-dutch-hospital', 'matale-sigiriya', 'kandy-botanical',
            'nuwaraeliya-gregory', 'badulla-nine-arches', 'matara-mirissa', 'galle-fort',
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
        accent: '#4338ca',
        placeIds: [
            'matale-riverston', 'kandy-knuckles', 'badulla-dunhinda', 'ratnapura-sinharaja',
            'ratnapura-adams-peak', 'moneragala-galoya', 'ampara-kumana', 'kurunegala-yapahuwa',
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
        <section className="py-20 bg-[#f8f6f2] relative overflow-hidden">
            <div className="section-container relative z-10">
                {/* Header */}
                <div className="text-center mb-14">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="h-px w-12 bg-antique-gold/40" />
                        <span className="text-antique-gold text-[10px] tracking-[0.3em] uppercase font-serif flex items-center gap-1.5 font-medium">
                            <Heart className="w-3 h-3" />
                            Traveller Favourites
                        </span>
                        <div className="h-px w-12 bg-antique-gold/40" />
                    </div>
                    <h2 className="font-display text-3xl sm:text-4xl text-deep-emerald mb-3">
                        Popular Tour Plans
                    </h2>
                    <p className="text-deep-emerald/40 text-sm font-light max-w-lg mx-auto">
                        Start from a plan loved by other travellers, then make it yours —
                        add places, remove stops, and customise freely.
                    </p>
                </div>

                {/* Tour Grid — larger cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {POPULAR_TOURS.map((tour) => {
                        const resolved = resolvedPlaces(tour.placeIds);
                        return (
                            <button
                                key={tour.id}
                                onClick={() => setPreviewTour(tour)}
                                className="group rounded-2xl overflow-hidden relative flex flex-col h-[400px] sm:h-[440px] text-left shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:-translate-y-2 hover:shadow-[0_24px_54px_rgba(0,0,0,0.12)] transition-all duration-500 border border-white/10"
                            >
                                {/* Full Background Image */}
                                <div className="absolute inset-0 bg-black">
                                    <img
                                        src={tour.image}
                                        alt={tour.title}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[1.5s] ease-out opacity-90"
                                    />
                                    {/* Elite clean gradients: strong bottom, soft top */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
                                </div>

                                {/* Top Meta */}
                                <div className="relative z-10 w-full p-6 flex justify-end">
                                    <span className="text-[9px] tracking-[0.15em] uppercase font-medium text-white/90 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                                        {tour.duration}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="relative z-10 p-6 flex flex-col mt-auto w-full">
                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {tour.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="text-[10px] tracking-[0.15em] uppercase font-medium text-antique-gold drop-shadow-sm"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Title & Tagline */}
                                    <h3 className="text-2xl font-display text-white group-hover:text-antique-gold transition-colors duration-500 mb-2 leading-snug drop-shadow-md">
                                        {tour.title}
                                    </h3>
                                    <p className="text-white/80 font-light text-sm line-clamp-2 leading-relaxed mb-6 drop-shadow-sm">
                                        {tour.tagline}
                                    </p>

                                    {/* Bottom Meta & Action */}
                                    <div className="pt-5 border-t border-white/20 flex items-center justify-between">
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="w-4 h-4 text-antique-gold" />
                                            <span className="text-white/90 text-xs font-nav font-medium tracking-wide drop-shadow-sm">{resolved.length} stops</span>
                                        </div>
                                        <span className="text-white/60 group-hover:text-white uppercase tracking-widest text-[9px] font-semibold transition-colors duration-300">
                                            View Details →
                                        </span>
                                    </div>
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
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

                    {/* Modal — Light Glass */}
                    <div
                        className="relative w-full max-w-lg bg-white/95 backdrop-blur-2xl border border-deep-emerald/10 rounded-2xl overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header with image */}
                        <div className={`relative p-6 bg-gradient-to-br ${previewTour.gradient}`}>
                            <button
                                onClick={() => setPreviewTour(null)}
                                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white/80 hover:text-white hover:bg-white/30 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            <div className="flex flex-wrap gap-1 mb-3">
                                {previewTour.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-2 py-0.5 rounded text-[9px] font-serif uppercase tracking-wider bg-white/15 text-white"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <h3 className="font-display text-2xl text-white mb-1">{previewTour.title}</h3>
                            <p className="text-white/70 text-sm font-light">{previewTour.tagline}</p>
                            <div className="flex items-center gap-4 mt-3">
                                <span className="text-white/60 text-xs font-serif flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {previewTour.duration}
                                </span>
                                <span className="text-white/60 text-xs font-serif flex items-center gap-1">
                                    <Users className="w-3 h-3" /> {previewTour.popularity}% pick this
                                </span>
                            </div>
                        </div>

                        {/* Places List */}
                        <div className="p-6">
                            <p className="text-deep-emerald/35 text-[10px] uppercase tracking-[0.2em] font-serif mb-3">
                                Included Stops — tap &quot;Use This Plan&quot; to customise
                            </p>
                            <div className="space-y-2 max-h-[260px] overflow-y-auto custom-scrollbar">
                                {resolvedPlaces(previewTour.placeIds).map((place, i) => (
                                    <div
                                        key={place.id}
                                        className="flex items-center gap-3 p-2.5 rounded-lg bg-deep-emerald/[0.03] border border-deep-emerald/[0.06]"
                                    >
                                        <span
                                            className="w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-serif font-bold flex-shrink-0 bg-deep-emerald/10 text-deep-emerald"
                                        >
                                            {i + 1}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-deep-emerald/80 text-sm font-serif truncate">{place.name}</p>
                                            <p className="text-deep-emerald/30 text-[10px] font-light">{place.district}</p>
                                        </div>
                                        {isInStops(place.id) && (
                                            <span className="text-antique-gold/60 text-[9px] font-serif">Already added</span>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => applyTour(previewTour, true)}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-deep-emerald text-white font-serif text-xs uppercase tracking-[0.15em] rounded-full hover:bg-antique-gold hover:text-deep-emerald transition-all duration-300"
                                >
                                    <Sparkles className="w-3.5 h-3.5" />
                                    Use This Plan
                                </button>
                                {stops.length > 0 && (
                                    <button
                                        onClick={() => applyTour(previewTour, false)}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-deep-emerald/5 border border-deep-emerald/10 text-deep-emerald/60 font-serif text-xs uppercase tracking-[0.15em] rounded-full hover:bg-deep-emerald/10 hover:border-deep-emerald/20 transition-all"
                                    >
                                        <MapPin className="w-3.5 h-3.5" />
                                        Add to Current
                                    </button>
                                )}
                            </div>

                            <p className="text-center text-deep-emerald/25 text-[10px] font-light mt-3">
                                You can add or remove any stops after loading
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
