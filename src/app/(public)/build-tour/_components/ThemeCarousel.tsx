'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y } from 'swiper/modules';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { useBuildTourStore } from '@/lib/trip/store/useBuildTourStore';
import type { Place } from '@/lib/trip/types';

import 'swiper/css';
import 'swiper/css/navigation';

interface TourTheme {
    title: string;
    subtitle: string;
    gradient: string;
    placeIds: string[];
}

const THEMES: TourTheme[] = [
    {
        title: 'Tea & Highlands',
        subtitle: 'Misty peaks, emerald plantations, and colonial charm',
        gradient: 'from-emerald-900/80 via-emerald-800/60 to-transparent',
        placeIds: ['nuwaraeliya-horton', 'nuwaraeliya-bluefield', 'nuwaraeliya-gregory', 'badulla-nine-arches', 'badulla-little-adams', 'kandy-knuckles'],
    },
    {
        title: 'Wildlife Safari',
        subtitle: 'Leopards, elephants, and untouched wilderness',
        gradient: 'from-amber-900/80 via-amber-800/60 to-transparent',
        placeIds: ['hambantota-yala', 'hambantota-bundala', 'polonnaruwa-minneriya', 'puttalam-wilpattu', 'moneragala-galoya', 'kegalle-pinnawala'],
    },
    {
        title: 'Heritage Triangle',
        subtitle: 'Ancient kingdoms, sacred temples, and UNESCO wonders',
        gradient: 'from-purple-900/80 via-purple-800/60 to-transparent',
        placeIds: ['matale-sigiriya', 'matale-dambulla', 'anuradhapura-bodhi', 'anuradhapura-ruwanweli', 'polonnaruwa-ruins', 'anuradhapura-mihintale'],
    },
    {
        title: 'Coastal Luxury',
        subtitle: 'Pristine beaches, surf breaks, and golden sunsets',
        gradient: 'from-cyan-900/80 via-cyan-800/60 to-transparent',
        placeIds: ['galle-unawatuna', 'matara-mirissa', 'matara-hiriketiya', 'trinco-nilaveli', 'ampara-arugam', 'galle-fort'],
    },
    {
        title: '7-Day Signature',
        subtitle: 'The essential Sri Lanka — coast to highlands',
        gradient: 'from-[#043927]/80 via-[#043927]/60 to-transparent',
        placeIds: ['colombo-galle-face', 'matale-sigiriya', 'kandy-tooth', 'nuwaraeliya-horton', 'badulla-nine-arches', 'hambantota-yala', 'galle-fort'],
    },
];

export default function ThemeCarousel() {
    const places = useBuildTourStore((s) => s.places);
    const addStop = useBuildTourStore((s) => s.addStop);
    const isInStops = useBuildTourStore((s) => s.isInStops);

    const addThemePlaces = (placeIds: string[]) => {
        placeIds.forEach((id) => {
            const place = places.find((p: Place) => p.id === id);
            if (place && !isInStops(place.id)) {
                addStop(place);
            }
        });
        // Scroll to builder
        document.getElementById('trip-builder')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="py-20 bg-[#0a0f0d] relative overflow-hidden">
            {/* Topographic overlay */}
            <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z' fill='%23D4AF37' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                }}
            />

            <div className="section-container relative z-10">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="h-px w-12 bg-antique-gold/30" />
                        <span className="text-antique-gold text-[10px] tracking-[0.3em] uppercase font-serif">
                            Curated Journeys
                        </span>
                        <div className="h-px w-12 bg-antique-gold/30" />
                    </div>
                    <h2 className="font-display text-3xl sm:text-4xl text-white mb-3">
                        Not sure where to start?
                    </h2>
                    <p className="text-white/40 text-sm font-light max-w-md mx-auto">
                        Choose a theme and we&apos;ll pre-fill your itinerary with our top picks.
                    </p>
                </div>

                {/* Swiper */}
                <div className="relative">
                    <Swiper
                        modules={[Navigation, A11y]}
                        spaceBetween={20}
                        slidesPerView={1.15}
                        navigation={{
                            prevEl: '.theme-prev',
                            nextEl: '.theme-next',
                        }}
                        breakpoints={{
                            640: { slidesPerView: 1.5 },
                            768: { slidesPerView: 2.2 },
                            1024: { slidesPerView: 3 },
                        }}
                        className="!overflow-visible"
                    >
                        {THEMES.map((theme) => {
                            const themePlaces = theme.placeIds
                                .map((id) => places.find((p: Place) => p.id === id))
                                .filter(Boolean) as Place[];

                            return (
                                <SwiperSlide key={theme.title}>
                                    <div className="relative rounded-xl overflow-hidden border border-white/5 group h-[320px] transition-all duration-500 hover:border-antique-gold/20">
                                        {/* Gradient BG */}
                                        <div className={`absolute inset-0 bg-gradient-to-t ${theme.gradient}`} />
                                        <div className="absolute inset-0 bg-[#0a0f0d]/40" />

                                        {/* Content */}
                                        <div className="relative z-10 h-full flex flex-col justify-end p-5">
                                            <h3 className="font-serif text-xl text-white mb-1">{theme.title}</h3>
                                            <p className="text-white/40 text-xs font-light mb-4 leading-relaxed">
                                                {theme.subtitle}
                                            </p>

                                            {/* Featured places */}
                                            <div className="flex flex-wrap gap-1 mb-4">
                                                {themePlaces.slice(0, 4).map((p) => (
                                                    <span
                                                        key={p.id}
                                                        className="flex items-center gap-1 px-2 py-0.5 bg-white/5 rounded text-[8px] text-white/40 font-serif"
                                                    >
                                                        <MapPin className="w-2 h-2" />
                                                        {p.name}
                                                    </span>
                                                ))}
                                                {themePlaces.length > 4 && (
                                                    <span className="px-2 py-0.5 text-[8px] text-antique-gold/50 font-serif">
                                                        +{themePlaces.length - 4} more
                                                    </span>
                                                )}
                                            </div>

                                            {/* Add all CTA */}
                                            <button
                                                onClick={() => addThemePlaces(theme.placeIds)}
                                                className="w-full flex items-center justify-center gap-2 py-2.5 bg-antique-gold/10 border border-antique-gold/20 text-antique-gold/80 font-serif text-[10px] uppercase tracking-[0.2em] rounded-lg hover:bg-antique-gold/20 hover:border-antique-gold/40 transition-all"
                                            >
                                                <MapPin className="w-3 h-3" />
                                                Add to Trip
                                            </button>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>

                    {/* Navigation buttons */}
                    <button className="theme-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-10 h-10 rounded-full bg-deep-emerald/80 border border-antique-gold/20 flex items-center justify-center text-antique-gold hover:bg-deep-emerald transition-all hidden lg:flex">
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button className="theme-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-10 h-10 rounded-full bg-deep-emerald/80 border border-antique-gold/20 flex items-center justify-center text-antique-gold hover:bg-deep-emerald transition-all hidden lg:flex">
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </section>
    );
}
