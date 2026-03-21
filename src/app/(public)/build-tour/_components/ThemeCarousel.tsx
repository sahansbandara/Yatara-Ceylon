'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y } from 'swiper/modules';
import { ChevronLeft, ChevronRight, MapPin, Clock, Calendar, Compass } from 'lucide-react';
import { useBuildTourStore } from '@/lib/trip/store/useBuildTourStore';
import type { Place } from '@/lib/trip/types';

import 'swiper/css';
import 'swiper/css/navigation';

interface TourTheme {
    title: string;
    subtitle: string;
    gradient: string;
    placeIds: string[];
    image: string;
    duration: string;
    bestSeason: string;
    regions: string[];
    mood: string;
}

const THEMES: TourTheme[] = [
    {
        title: 'Tea & Highlands',
        subtitle: 'Misty peaks, emerald plantations, and colonial charm',
        gradient: 'from-emerald-900 via-emerald-800/60 to-transparent',
        placeIds: ['nuwaraeliya-horton', 'nuwaraeliya-bluefield', 'nuwaraeliya-gregory', 'badulla-nine-arches', 'badulla-little-adams', 'kandy-knuckles'],
        image: '/images/themes/tea-highlands.webp',
        duration: '5–7 days',
        bestSeason: 'Jan–Mar',
        regions: ['Tea Highlands', 'Cultural Triangle'],
        mood: 'Scenic & Serene',
    },
    {
        title: 'Wildlife Safari',
        subtitle: 'Leopards, elephants, and untouched wilderness',
        gradient: 'from-amber-900 via-amber-800/60 to-transparent',
        placeIds: ['hambantota-yala', 'hambantota-bundala', 'polonnaruwa-minneriya', 'puttalam-wilpattu', 'moneragala-galoya', 'kegalle-pinnawala'],
        image: '/images/themes/safari-wildlife.webp',
        duration: '6–8 days',
        bestSeason: 'Feb–Jul',
        regions: ['Wildlife & Safari', 'Cultural Triangle'],
        mood: 'Adventurous & Wild',
    },
    {
        title: 'Heritage Triangle',
        subtitle: 'Ancient kingdoms, sacred temples, and UNESCO wonders',
        gradient: 'from-purple-900 via-purple-800/60 to-transparent',
        placeIds: ['matale-sigiriya', 'matale-dambulla', 'anuradhapura-bodhi', 'anuradhapura-ruwanweli', 'polonnaruwa-ruins', 'anuradhapura-mihintale'],
        image: '/images/themes/heritage-triangle.webp',
        duration: '5–7 days',
        bestSeason: 'Year-round',
        regions: ['Cultural Triangle', 'Northern Heritage'],
        mood: 'Cultural & Historic',
    },
    {
        title: 'Coastal Luxury',
        subtitle: 'Pristine beaches, surf breaks, and golden sunsets',
        gradient: 'from-cyan-900 via-cyan-800/60 to-transparent',
        placeIds: ['galle-unawatuna', 'matara-mirissa', 'matara-hiriketiya', 'trinco-nilaveli', 'ampara-arugam', 'galle-fort'],
        image: '/images/themes/coastal-luxury.webp',
        duration: '7–10 days',
        bestSeason: 'Nov–Apr (South)',
        regions: ['South Coast', 'East Coast'],
        mood: 'Relaxed & Luxurious',
    },
    {
        title: '7-Day Signature',
        subtitle: 'The essential Sri Lanka — coast to highlands',
        gradient: 'from-[#043927] via-[#043927]/60 to-transparent',
        placeIds: ['colombo-galle-face', 'matale-sigiriya', 'kandy-tooth', 'nuwaraeliya-horton', 'badulla-nine-arches', 'hambantota-yala', 'galle-fort'],
        image: '/images/themes/7-day-signature.webp',
        duration: '7 days',
        bestSeason: 'Dec–Mar',
        regions: ['All Major Regions'],
        mood: 'Complete & Balanced',
    },
    {
        title: 'Honeymoon Edit',
        subtitle: 'Romance, privacy, and unforgettable sunset moments',
        gradient: 'from-pink-900 via-pink-800/60 to-transparent',
        placeIds: ['colombo-dutch-hospital', 'matale-sigiriya', 'kandy-botanical', 'nuwaraeliya-gregory', 'badulla-nine-arches', 'matara-mirissa', 'galle-fort'],
        image: '/images/themes/honeymoon-edit.webp',
        duration: '7–8 days',
        bestSeason: 'Dec–Apr',
        regions: ['Tea Highlands', 'South Coast'],
        mood: 'Romantic & Intimate',
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
        document.getElementById('trip-builder')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section id="theme-shortcuts" className="py-16 bg-[#0a0f0d] relative overflow-hidden">
            {/* Topographic overlay */}
            <div
                className="absolute inset-0 opacity-[0.015]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z' fill='%23D4AF37' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                }}
            />

            <div className="section-container relative z-10">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="flex items-center justify-center gap-3 mb-3">
                        <div className="h-px w-12 bg-antique-gold/25" />
                        <span className="text-antique-gold/60 text-[10px] tracking-[0.3em] uppercase font-serif">
                            Curated Journeys
                        </span>
                        <div className="h-px w-12 bg-antique-gold/25" />
                    </div>
                    <h2 className="font-display text-3xl sm:text-4xl text-white mb-2">
                        Not sure where to start?
                    </h2>
                    <p className="text-white/35 text-sm font-light max-w-md mx-auto">
                        Choose a travel theme and we&apos;ll load the best stops into your planner.
                    </p>
                </div>

                {/* Swiper */}
                <div className="relative">
                    <Swiper
                        modules={[Navigation, A11y]}
                        spaceBetween={16}
                        slidesPerView={1.15}
                        navigation={{
                            prevEl: '.theme-prev',
                            nextEl: '.theme-next',
                        }}
                        breakpoints={{
                            640: { slidesPerView: 1.5, spaceBetween: 16 },
                            768: { slidesPerView: 2.2, spaceBetween: 16 },
                            1024: { slidesPerView: 3, spaceBetween: 20 },
                        }}
                        className="!overflow-visible"
                    >
                        {THEMES.map((theme) => {
                            const themePlaces = theme.placeIds
                                .map((id) => places.find((p: Place) => p.id === id))
                                .filter(Boolean) as Place[];

                            return (
                                <SwiperSlide key={theme.title}>
                                    <div className="relative rounded-2xl overflow-hidden border border-white/8 group h-[360px] sm:h-[400px] tour-card-elite">
                                        {/* Background Image */}
                                        <div
                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                                            style={{ backgroundImage: `url(${theme.image})` }}
                                        />
                                        <div className={`absolute inset-0 bg-gradient-to-t ${theme.gradient} opacity-50 group-hover:opacity-70 transition-opacity duration-500`} />
                                        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-[#0a0f0d]/95" />

                                        {/* Content */}
                                        <div className="relative z-10 h-full flex flex-col justify-end p-5 border border-white/5 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] group-hover:border-antique-gold/25 transition-colors duration-500">
                                            {/* Mood badge */}
                                            <span className="text-[8px] font-nav uppercase tracking-wider text-antique-gold/50 mb-1.5">
                                                {theme.mood}
                                            </span>

                                            <h3 className="font-serif text-lg text-white mb-1 group-hover:text-antique-gold/90 transition-colors">
                                                {theme.title}
                                            </h3>
                                            <p className="text-white/35 text-[10px] font-light mb-3 leading-relaxed">
                                                {theme.subtitle}
                                            </p>

                                            {/* Metadata row — duration, season, regions */}
                                            <div className="flex flex-wrap items-center gap-2.5 mb-3 text-[8px] text-white/30 font-nav">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-2.5 h-2.5 text-antique-gold/40" />
                                                    <span>{theme.duration}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-2.5 h-2.5 text-antique-gold/40" />
                                                    <span>{theme.bestSeason}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Compass className="w-2.5 h-2.5 text-antique-gold/40" />
                                                    <span>{theme.regions.join(', ')}</span>
                                                </div>
                                            </div>

                                            {/* Featured places chips */}
                                            <div className="flex flex-wrap gap-1 mb-3">
                                                {themePlaces.slice(0, 3).map((p) => (
                                                    <span
                                                        key={p.id}
                                                        className="flex items-center gap-0.5 px-1.5 py-0.5 bg-white/[0.04] rounded text-[7px] text-white/30 font-nav"
                                                    >
                                                        <MapPin className="w-2 h-2" />
                                                        {p.name}
                                                    </span>
                                                ))}
                                                {themePlaces.length > 3 && (
                                                    <span className="px-1.5 py-0.5 text-[7px] text-antique-gold/40 font-nav">
                                                        +{themePlaces.length - 3} more
                                                    </span>
                                                )}
                                            </div>

                                            {/* Load Theme CTA */}
                                            <button
                                                onClick={() => addThemePlaces(theme.placeIds)}
                                                className="w-full flex items-center justify-center gap-2 py-2.5 bg-antique-gold/8 border border-antique-gold/15 text-antique-gold/70 font-nav text-[9px] uppercase tracking-[0.2em] rounded-lg hover:bg-antique-gold/15 hover:border-antique-gold/35 hover:text-antique-gold transition-all"
                                            >
                                                <Compass className="w-3 h-3" />
                                                Load Theme
                                            </button>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>

                    {/* Navigation buttons */}
                    <button className="theme-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-10 h-10 rounded-full bg-deep-emerald/80 border border-antique-gold/15 flex items-center justify-center text-antique-gold/60 hover:text-antique-gold hover:bg-deep-emerald hover:border-antique-gold/30 transition-all hidden lg:flex backdrop-blur-sm">
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button className="theme-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-10 h-10 rounded-full bg-deep-emerald/80 border border-antique-gold/15 flex items-center justify-center text-antique-gold/60 hover:text-antique-gold hover:bg-deep-emerald hover:border-antique-gold/30 transition-all hidden lg:flex backdrop-blur-sm">
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </section>
    );
}
