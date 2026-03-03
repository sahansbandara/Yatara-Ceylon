'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useRef, useState, useEffect, useCallback } from 'react';

interface SignaturePackage {
    _id: string;
    title: string;
    slug: string;
    summary: string;
    duration: string;
    tags: string[];
    highlights: string[];
    images: string[];
    priceMin: number;
}

// Fallback static journeys (used when DB has < 3 published packages)
const fallbackJourneys: SignaturePackage[] = [
    {
        _id: 'bespoke',
        title: 'Bespoke Tour',
        slug: 'build-tour',
        summary: 'Tell us your dates and pace. We build the itinerary.',
        duration: 'Your Timeline',
        tags: ['Tailor-Made', 'Private', 'Concierge'],
        highlights: ['Fully customized itinerary', 'Private guide & vehicle', 'Handpicked boutique stays'],
        images: ['/images/home/curated-kingdoms.png'],
        priceMin: 0,
    },
    {
        _id: 'hill-country',
        title: 'The Hill Country Odyssey',
        slug: 'packages',
        summary: 'Misty tea plantations, colonial bungalows, and cascading waterfalls with private guiding.',
        duration: '7 Days / 6 Nights',
        tags: ['Slow Travel', 'Couples', 'Scenic Rail'],
        highlights: ['Premium tea bungalow stay', 'Reserved-seat scenic train', 'Tea blending session'],
        images: ['/images/home/curated-hillcountry.png'],
        priceMin: 0,
    },
    {
        _id: 'southern-coast',
        title: 'Southern Coast Serenity',
        slug: 'packages',
        summary: 'Private villas, secluded golden beaches, and the heritage of Galle Fort.',
        duration: '8 Days / 7 Nights',
        tags: ['Beach', 'Luxury', 'Romance'],
        highlights: ['Beachfront villa stay', 'Galle Fort sunset walk', 'Private dining experience'],
        images: ['/images/home/curated-southcoast.png'],
        priceMin: 0,
    },
    {
        _id: 'ancient-kingdoms',
        title: 'Ancient Kingdom Trails',
        slug: 'packages',
        summary: 'UNESCO heritage with private guiding — Sigiriya, Polonnaruwa, and sacred Kandy without crowds.',
        duration: '6 Days / 5 Nights',
        tags: ['Heritage', 'Private Guide', 'Boutique'],
        highlights: ['Sigiriya sunrise option', 'Polonnaruwa private tour', 'Kandy sacred evening'],
        images: ['/images/home/curated-kingdoms.png'],
        priceMin: 0,
    },
    {
        _id: 'wildlife-safari',
        title: 'Wildlife & Safari Circuit',
        slug: 'packages',
        summary: 'Private safari encounters and southern-coast villa luxury for couples and photographers.',
        duration: '8 Days / 7 Nights',
        tags: ['Wildlife', 'Photography', 'Luxury'],
        highlights: ['Private jeep safari drives', 'Beachfront villa stay', 'Whale watching (seasonal)'],
        images: ['/images/home/signature-wildlife.png'],
        priceMin: 0,
    },
];

const themeChips = ['Honeymoon', 'Family', 'Wildlife', 'Wellness', 'Heritage', 'Beaches'];

export default function CuratedCollection() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [journeys, setJourneys] = useState<SignaturePackage[]>(fallbackJourneys);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [activeChip, setActiveChip] = useState<string | null>(null);

    // Fetch published packages from DB
    useEffect(() => {
        async function fetchPackages() {
            try {
                const res = await fetch('/api/packages?published=true&limit=6');
                if (res.ok) {
                    const data = await res.json();
                    if (data.packages && data.packages.length >= 3) {
                        // Prepend bespoke tile then DB packages
                        const bespokeTile = fallbackJourneys[0];
                        const dbPackages = data.packages.map((pkg: any) => ({
                            _id: pkg._id,
                            title: pkg.title,
                            slug: pkg.slug,
                            summary: pkg.summary,
                            duration: pkg.duration,
                            tags: pkg.tags || [],
                            highlights: pkg.highlights || [],
                            images: pkg.images || [],
                            priceMin: pkg.priceMin || 0,
                        }));
                        setJourneys([bespokeTile, ...dbPackages]);
                    }
                }
            } catch {
                // Keep fallback journeys
            }
        }
        fetchPackages();
    }, []);

    const totalSlides = journeys.length;

    const updateCurrentIndex = useCallback(() => {
        if (!scrollRef.current) return;
        const container = scrollRef.current;
        const scrollLeft = container.scrollLeft;
        const itemWidth = container.children[0]?.clientWidth || 400;
        const gap = 32;
        const index = Math.round(scrollLeft / (itemWidth + gap));
        setCurrentIndex(Math.min(index, totalSlides - 1));
    }, [totalSlides]);

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;
        container.addEventListener('scroll', updateCurrentIndex, { passive: true });
        return () => container.removeEventListener('scroll', updateCurrentIndex);
    }, [updateCurrentIndex]);

    const scrollTo = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return;
        const container = scrollRef.current;
        const itemWidth = container.children[0]?.clientWidth || 400;
        const gap = 32;
        container.scrollBy({
            left: direction === 'left' ? -(itemWidth + gap) : (itemWidth + gap),
            behavior: 'smooth',
        });
    };

    const filteredJourneys = activeChip
        ? journeys.filter(j => j._id === 'bespoke' || j.tags.some(t => t.toLowerCase().includes(activeChip.toLowerCase())))
        : journeys;

    return (
        <section className="py-28 md:py-36 bg-off-white text-deep-emerald relative overflow-hidden">
            {/* Subtle background accents */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-antique-gold/[0.03] rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-deep-emerald/[0.02] rounded-full blur-3xl" />

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                {/* Header */}
                <div className="mb-8 md:mb-12">
                    <span className="inline-block mb-5 text-[11px] tracking-[0.35em] font-medium text-antique-gold uppercase">
                        Handpicked Itineraries
                    </span>
                    <h2 className="text-4xl md:text-6xl font-display text-deep-emerald leading-[1.1] mb-5">
                        Signature <span className="italic font-light">Experiences</span>
                    </h2>
                    <p className="text-gray-500 font-light text-base md:text-lg max-w-xl leading-relaxed">
                        Handpicked itineraries designed around pace, privacy, and purpose.
                        Choose a travel style. We tailor the rest.
                    </p>
                    <div className="h-px w-20 bg-gradient-to-r from-antique-gold to-transparent mt-7" />
                </div>

                {/* Theme chips */}
                <div className="flex flex-wrap gap-2.5 mb-10">
                    <button
                        onClick={() => setActiveChip(null)}
                        className={`text-[11px] tracking-[0.15em] uppercase font-medium px-4 py-2 rounded-full border transition-all duration-300 ${
                            !activeChip
                                ? 'bg-deep-emerald text-white border-deep-emerald'
                                : 'bg-transparent text-deep-emerald/70 border-deep-emerald/20 hover:border-deep-emerald/40'
                        }`}
                    >
                        All Styles
                    </button>
                    {themeChips.map((chip) => (
                        <button
                            key={chip}
                            onClick={() => setActiveChip(activeChip === chip ? null : chip)}
                            className={`text-[11px] tracking-[0.15em] uppercase font-medium px-4 py-2 rounded-full border transition-all duration-300 ${
                                activeChip === chip
                                    ? 'bg-deep-emerald text-white border-deep-emerald'
                                    : 'bg-transparent text-deep-emerald/70 border-deep-emerald/20 hover:border-deep-emerald/40'
                            }`}
                        >
                            {chip}
                        </button>
                    ))}
                </div>

                {/* Controls row */}
                <div className="flex items-center justify-between mb-8">
                    {/* Progress indicator */}
                    <span className="text-[13px] tracking-[0.1em] text-gray-400 font-medium tabular-nums">
                        {String(currentIndex + 1).padStart(2, '0')} / {String(filteredJourneys.length).padStart(2, '0')}
                    </span>

                    {/* Navigation */}
                    <div className="hidden md:flex items-center gap-3">
                        <button
                            onClick={() => scrollTo('left')}
                            className="w-11 h-11 rounded-full border border-deep-emerald/15 flex items-center justify-center hover:border-antique-gold/50 hover:bg-antique-gold/5 transition-all duration-300"
                            aria-label="Previous"
                        >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-deep-emerald">
                                <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                        <button
                            onClick={() => scrollTo('right')}
                            className="w-11 h-11 rounded-full border border-deep-emerald/15 flex items-center justify-center hover:border-antique-gold/50 hover:bg-antique-gold/5 transition-all duration-300"
                            aria-label="Next"
                        >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-deep-emerald">
                                <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Scroll-snap horizontal rail */}
                <div
                    ref={scrollRef}
                    className="flex gap-8 overflow-x-auto pb-6 snap-x snap-mandatory -mx-6 px-6"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {filteredJourneys.map((journey, index) => (
                        <article
                            key={journey._id}
                            className={`group relative overflow-hidden rounded-2xl flex-shrink-0 snap-center cursor-pointer ${
                                index === 0 && journey._id === 'bespoke'
                                    ? 'w-[340px] md:w-[420px] h-[540px] md:h-[580px]'
                                    : 'w-[340px] md:w-[400px] h-[540px] md:h-[580px]'
                            }`}
                        >
                            {/* Image */}
                            <Image
                                src={journey.images[0] || '/images/home/curated-kingdoms.png'}
                                alt={journey.title}
                                fill
                                className="object-cover transform group-hover:scale-[1.02] transition-transform duration-1000 ease-out"
                            />

                            {/* Dark gradient overlay — bottom 50% for readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                            {/* Content overlay */}
                            <div className="absolute inset-0 flex flex-col justify-end p-7 md:p-8 z-10">
                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                    {journey.tags.slice(0, 3).map((tag) => (
                                        <span
                                            key={tag}
                                            className="text-[10px] tracking-[0.2em] uppercase font-medium text-white/70 bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Title — Title Case, not ALL CAPS */}
                                <h3 className="text-2xl md:text-[28px] font-display tracking-wide text-white mb-2.5 leading-tight group-hover:text-antique-gold transition-colors duration-500 drop-shadow-lg">
                                    {journey.title}
                                </h3>

                                {/* One-line promise */}
                                <p className="text-white/75 font-light text-[13px] md:text-sm leading-relaxed mb-4 line-clamp-2">
                                    {journey.summary}
                                </p>

                                {/* Duration + meta */}
                                {journey.duration && journey._id !== 'bespoke' && (
                                    <p className="text-[11px] tracking-[0.15em] uppercase text-white/50 font-medium mb-5">
                                        {journey.duration}
                                    </p>
                                )}

                                {/* CTA */}
                                <Link
                                    href={journey._id === 'bespoke' ? '/build-tour' : (journey.slug === 'packages' ? '/packages' : `/packages/${journey.slug}`)}
                                    className="inline-flex items-center text-[11px] tracking-[0.2em] uppercase font-semibold transition-all duration-300 w-max group/cta"
                                >
                                    {journey._id === 'bespoke' ? (
                                        <span className="flex items-center gap-2 bg-antique-gold text-deep-emerald px-5 py-2.5 rounded-full hover:bg-white transition-colors duration-300">
                                            <Sparkles className="w-3.5 h-3.5" />
                                            Design My Trip
                                        </span>
                                    ) : (
                                        <span className="text-antique-gold hover:text-white flex items-center gap-2 transform translate-y-1 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                                            Explore This Style <ArrowRight className="h-3.5 w-3.5 group-hover/cta:translate-x-1 transition-transform" />
                                        </span>
                                    )}
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Bottom link */}
                <div className="mt-12 flex justify-center">
                    <Link
                        href="/packages"
                        className="inline-flex items-center gap-3 text-[11px] tracking-[0.25em] uppercase font-semibold text-deep-emerald hover:text-antique-gold transition-colors duration-300 border-b border-deep-emerald/20 hover:border-antique-gold/40 pb-1"
                    >
                        View All Signature Journeys
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
