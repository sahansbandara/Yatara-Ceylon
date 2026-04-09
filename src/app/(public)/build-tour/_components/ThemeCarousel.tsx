'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y } from 'swiper/modules';
import { ChevronLeft, ChevronRight, MapPin, Clock, Calendar, Compass } from 'lucide-react';
import type { Place } from '@/lib/trip/types';
import curatedPlacesRaw from '@/data/places/sri-lanka.curated.json';

import 'swiper/css';
import 'swiper/css/navigation';

const curatedPlaces = curatedPlacesRaw as unknown as Place[];

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
    const addThemePlaces = (placeIds: string[]) => {
        window.dispatchEvent(
            new CustomEvent('yatara:load-tour', {
                detail: { placeIds, replace: true },
            })
        );
        document.getElementById('planner')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section id="theme-shortcuts" className="py-20 bg-off-white relative overflow-hidden">
            <div className="section-container relative z-10">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="h-px w-12 bg-antique-gold/40" />
                        <span className="text-antique-gold text-[10px] tracking-[0.3em] uppercase font-serif font-medium">
                            Curated Journeys
                        </span>
                        <div className="h-px w-12 bg-antique-gold/40" />
                    </div>
                    <h2 className="font-display text-3xl sm:text-4xl text-deep-emerald mb-3">
                        Not sure where to start?
                    </h2>
                    <p className="text-deep-emerald/40 text-sm font-light max-w-md mx-auto">
                        Choose a travel theme and we&apos;ll load the best stops into your planner.
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
                            640: { slidesPerView: 1.5, spaceBetween: 16 },
                            768: { slidesPerView: 2.2, spaceBetween: 20 },
                            1024: { slidesPerView: 3, spaceBetween: 24 },
                        }}
                        className="!overflow-visible"
                    >
                        {THEMES.map((theme) => {
                            const themePlaces = theme.placeIds
                                .map((id) => curatedPlaces.find((p: Place) => p.id === id))
                                .filter(Boolean) as Place[];

                            return (
                                <SwiperSlide key={theme.title}>
                                    <div className="group rounded-2xl overflow-hidden relative flex flex-col h-[400px] sm:h-[440px] shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:-translate-y-2 hover:shadow-[0_24px_54px_rgba(0,0,0,0.12)] transition-all duration-500 border border-white/10 text-left">
                                        {/* Full Background Image */}
                                        <div className="absolute inset-0 bg-black">
                                            <img
                                                src={theme.image}
                                                alt={theme.title}
                                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[1.5s] ease-out opacity-90"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                                            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
                                        </div>

                                        {/* Top Meta */}
                                        <div className="relative z-10 w-full p-6 flex justify-end">
                                            <span className="text-[9px] tracking-[0.15em] uppercase font-medium text-white/90 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-sm">
                                                {theme.duration}
                                            </span>
                                        </div>

                                        {/* Content */}
                                        <div className="relative z-10 p-6 flex flex-col mt-auto w-full">
                                            {/* Mood badge */}
                                            <span className="text-[8px] font-nav uppercase tracking-[0.15em] text-antique-gold font-medium mb-2 drop-shadow-sm">
                                                {theme.mood}
                                            </span>

                                            <h3 className="font-display text-2xl text-white mb-2 group-hover:text-antique-gold transition-colors duration-500 leading-snug drop-shadow-md">
                                                {theme.title}
                                            </h3>
                                            <p className="text-white/80 text-sm font-light mb-4 line-clamp-2 leading-relaxed drop-shadow-sm">
                                                {theme.subtitle}
                                            </p>

                                            {/* Bottom Meta & Action */}
                                            <div className="pt-5 border-t border-white/20 flex items-center justify-between">
                                                <div className="flex items-center gap-1.5">
                                                    <Compass className="w-4 h-4 text-antique-gold" />
                                                    <span className="text-white/90 text-xs font-nav font-medium tracking-wide truncate max-w-[140px] drop-shadow-sm">
                                                        {theme.regions[0]}
                                                        {theme.regions.length > 1 && ' +'}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => addThemePlaces(theme.placeIds)}
                                                    className="px-5 py-2.5 border border-white/30 text-white hover:bg-white hover:text-deep-emerald rounded-xl transition-all duration-500 uppercase tracking-widest text-[9px] font-semibold backdrop-blur-sm"
                                                >
                                                    Load Theme
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>

                    {/* Navigation buttons — light themed */}
                    <button className="theme-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-10 h-10 rounded-full bg-white/80 backdrop-blur-xl border border-deep-emerald/10 flex items-center justify-center text-deep-emerald/50 hover:text-deep-emerald hover:bg-white hover:border-deep-emerald/20 transition-all hidden lg:flex shadow-lg">
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button className="theme-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-10 h-10 rounded-full bg-white/80 backdrop-blur-xl border border-deep-emerald/10 flex items-center justify-center text-deep-emerald/50 hover:text-deep-emerald hover:bg-white hover:border-deep-emerald/20 transition-all hidden lg:flex shadow-lg">
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </section>
    );
}
