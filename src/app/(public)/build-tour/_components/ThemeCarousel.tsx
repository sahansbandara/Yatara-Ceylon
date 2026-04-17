'use client';

import { Compass, Star, Gem } from 'lucide-react';
import Image from 'next/image';

interface FeaturedPackage {
    title: string;
    description: string;
    image: string;
    tags: string[];
    placeIds: string[];
}

interface SupportingPackage {
    title: string;
    description: string;
    image: string;
    tags: string[];
    placeIds: string[];
}

const featuredPackages: FeaturedPackage[] = [
    {
        title: "Most Visited Places",
        description: "Discover Sri Lanka’s iconic highlights and most-loved journeys.",
        image: "/images/themes/7-day-signature.webp",
        tags: ["MOST VISITED", "ICONIC"],
        placeIds: ['colombo-galle-face', 'matale-sigiriya', 'kandy-tooth', 'nuwaraeliya-horton', 'badulla-nine-arches', 'hambantota-yala', 'galle-fort'],
    },
    {
        title: "Hidden Gems",
        description: "Uncover quieter, more exclusive escapes beyond the usual trail.",
        image: "/images/themes/honeymoon-edit.webp",
        tags: ["HIDDEN GEMS", "PRIVATE"],
        placeIds: ['moneragala-madulsima-mini-worlds-end', 'puttalam-kalpitiya', 'moneragala-galoya', 'badulla-haputale', 'matara-mirissa'],
    },
];

const supportingPackages: SupportingPackage[] = [
    {
        title: "Heritage Journeys",
        description: "Ancient cities, sacred temples, and cultural depth.",
        image: "/images/themes/heritage-triangle.webp",
        tags: ["CULTURAL"],
        placeIds: ['matale-sigiriya', 'matale-dambulla', 'anuradhapura-bodhi', 'anuradhapura-ruwanweli', 'polonnaruwa-ruins', 'anuradhapura-mihintale'],
    },
    {
        title: "Wildlife & Safari",
        description: "Leopards, elephants, and untouched wilderness.",
        image: "/images/themes/safari-wildlife.webp",
        tags: ["WILDLIFE"],
        placeIds: ['hambantota-yala', 'hambantota-bundala', 'polonnaruwa-minneriya', 'puttalam-wilpattu', 'moneragala-galoya', 'kegalle-pinnawala'],
    },
    {
        title: "Tea & Highlands",
        description: "Cool hills, tea estates, and scenic calm.",
        image: "/images/themes/tea-highlands.webp",
        tags: ["SCENIC"],
        placeIds: ['nuwaraeliya-horton', 'nuwaraeliya-bluefield', 'nuwaraeliya-gregory', 'badulla-nine-arches', 'badulla-little-adams', 'kandy-knuckles'],
    },
    {
        title: "Coastal Escape",
        description: "Beachfront stays and relaxed tropical routes.",
        image: "/images/themes/coastal-luxury.webp",
        tags: ["COASTAL"],
        placeIds: ['galle-fort', 'matara-mirissa', 'galle-unawatuna', 'galle-hikkaduwa', 'kalutara-bentota-beach'],
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
        <section id="theme-shortcuts" className="py-20 lg:py-24 bg-off-white relative overflow-hidden">
            <div className="section-container relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="h-px w-12 bg-antique-gold/40" />
                        <span className="text-antique-gold text-[10px] tracking-[0.3em] uppercase font-serif font-medium">
                            HANDPICKED ITINERARIES
                        </span>
                        <div className="h-px w-12 bg-antique-gold/40" />
                    </div>
                    <h2 className="font-display text-3xl sm:text-4xl text-deep-emerald mb-3">
                        Signature Experiences
                    </h2>
                    <p className="text-deep-emerald/60 text-sm font-light max-w-lg mx-auto">
                        Choose between Sri Lanka’s iconic highlights and quieter, more exclusive escapes.
                    </p>
                </div>

                {/* Row 1: Featured Packages */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {featuredPackages.map((pkg) => (
                        <button
                            key={pkg.title}
                            onClick={() => addThemePlaces(pkg.placeIds)}
                            className="group rounded-2xl overflow-hidden relative flex flex-col min-h-[420px] lg:min-h-[500px] shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:-translate-y-2 hover:shadow-[0_24px_54px_rgba(0,0,0,0.12)] transition-all duration-500 border border-white/10 text-left [transform:translateZ(0)] w-full block"
                        >
                            {/* Full Background Image */}
                            <div className="absolute inset-0 bg-black rounded-2xl overflow-hidden [transform:translateZ(0)]">
                                <Image
                                    src={pkg.image}
                                    alt={pkg.title}
                                    fill
                                    priority
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    className="object-cover transform group-hover:scale-105 transition-transform duration-[1.5s] ease-out opacity-90"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
                            </div>

                            {/* Top Meta */}
                            <div className="relative z-10 w-full p-6 flex flex-wrap gap-2 justify-start items-start">
                                {pkg.tags.map((tag, i) => (
                                    <span key={i} className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] tracking-[0.1em] uppercase font-bold shadow-lg backdrop-blur-md border ${i === 0
                                        ? 'bg-antique-gold/90 text-deep-emerald border-antique-gold/20'
                                        : 'bg-deep-emerald/90 text-antique-gold border-deep-emerald/20'
                                        }`}>
                                        {i === 0 ? <Star className="w-3 h-3 fill-deep-emerald text-deep-emerald" /> : <Gem className="w-3 h-3 text-antique-gold" />}
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Content */}
                            <div className="relative z-10 p-6 flex flex-col mt-auto w-full">
                                <h3 className="font-display text-white mb-2 group-hover:text-antique-gold transition-colors duration-500 leading-snug drop-shadow-md text-3xl">
                                    {pkg.title}
                                </h3>
                                <p className="text-white/80 text-sm font-light mb-4 line-clamp-2 leading-relaxed drop-shadow-sm">
                                    {pkg.description}
                                </p>

                                {/* Bottom Meta & Action */}
                                <div className="pt-5 border-t border-white/20 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <Compass className="w-4 h-4 text-antique-gold" />
                                        <span className="text-white/90 text-xs font-nav font-medium tracking-wide drop-shadow-sm uppercase">
                                            Signature Route
                                        </span>
                                    </div>
                                    <div
                                        className="px-5 py-2.5 bg-white/10 border border-white/30 text-white group-hover:bg-white group-hover:text-deep-emerald rounded-xl transition-all duration-500 uppercase tracking-widest text-[9px] font-semibold backdrop-blur-sm"
                                    >
                                        Load Theme
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Row 2: Supporting Packages */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mt-6">
                    {supportingPackages.map((pkg) => (
                        <button
                            key={pkg.title}
                            onClick={() => addThemePlaces(pkg.placeIds)}
                            className="group rounded-2xl overflow-hidden relative flex flex-col min-h-[260px] lg:min-h-[300px] shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:-translate-y-2 hover:shadow-[0_24px_54px_rgba(0,0,0,0.12)] transition-all duration-500 border border-white/10 text-left [transform:translateZ(0)] w-full block"
                        >
                            {/* Full Background Image */}
                            <div className="absolute inset-0 bg-black rounded-2xl overflow-hidden [transform:translateZ(0)]">
                                <Image
                                    src={pkg.image}
                                    alt={pkg.title}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                                    className="object-cover transform group-hover:scale-105 transition-transform duration-[1.5s] ease-out opacity-80"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                            </div>

                            {/* Top Meta */}
                            <div className="relative z-10 w-full p-5 flex justify-start items-start">
                                {pkg.tags.map((tag, i) => (
                                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] tracking-[0.1em] uppercase font-bold shadow-lg backdrop-blur-md border bg-white/10 text-white border-white/20">
                                        <Gem className="w-3 h-3 text-white" />
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Content */}
                            <div className="relative z-10 p-5 flex flex-col mt-auto w-full">
                                <h3 className="font-display text-white mb-2 group-hover:text-antique-gold transition-colors duration-500 leading-snug drop-shadow-md text-xl">
                                    {pkg.title}
                                </h3>
                                <p className="text-white/70 text-xs font-light mb-4 line-clamp-2 leading-relaxed drop-shadow-sm">
                                    {pkg.description}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}
