'use client';

import { useState, useMemo, useRef, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Search, MapPin, Calendar, Compass, SlidersHorizontal, X, ChevronRight, Mountain, TreePalm, Building2, Waves, Tent, Heart } from 'lucide-react';
import { DESTINATIONS } from '@/data/destinations';
import DestinationCard from '@/components/public/DestinationCard';
import FeaturedDestinationSpotlight from '@/components/public/FeaturedDestinationSpotlight';

/* ──────────────────────────────────────────────
   Constants & derived data
   ────────────────────────────────────────────── */

const ALL_REGIONS = Array.from(new Set(DESTINATIONS.map((d) => d.region).filter(Boolean))) as string[];

const REGION_ICONS: Record<string, React.ReactNode> = {
    'Cultural Triangle': <Building2 className="h-3.5 w-3.5" />,
    'Hill Country': <Mountain className="h-3.5 w-3.5" />,
    'South Coast': <Waves className="h-3.5 w-3.5" />,
    'West Coast': <TreePalm className="h-3.5 w-3.5" />,
    'East Coast': <Waves className="h-3.5 w-3.5" />,
    'North': <Compass className="h-3.5 w-3.5" />,
    'Wildlife Region': <Tent className="h-3.5 w-3.5" />,
};

const TRAVEL_STYLES = Array.from(
    new Set(DESTINATIONS.flatMap((d) => d.travelStyleTags || []))

).sort();

const regionCounts = ALL_REGIONS.reduce<Record<string, number>>((acc, region) => {
    acc[region] = DESTINATIONS.filter((d) => d.region === region).length;
    return acc;
}, {});

/* Use Sigiriya as the featured spotlight — most iconic Sri Lankan destination */
const featuredDestination = DESTINATIONS.find((d) => d.slug === 'sigiriya') || DESTINATIONS[0];

/* Animation variants */
const staggerContainer = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
};

const cardReveal = {
    hidden: { opacity: 0, y: 32, scale: 0.97 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
};

/* ──────────────────────────────────────────────
   Page Component
   ────────────────────────────────────────────── */

export default function DestinationsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-off-white" />}>
            <DestinationsContent />
        </Suspense>
    );
}

function DestinationsContent() {
    const searchParams = useSearchParams();
    const [activeRegion, setActiveRegion] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeStyle, setActiveStyle] = useState<string | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const filterContainerRef = useRef<HTMLDivElement>(null);

    // Sync state with URL params for navigation from Navbar
    useEffect(() => {
        const regionParam = searchParams.get('region');
        if (regionParam) {
            // E.g. 'hill-country' -> 'Hill Country'
            const normalizedParam = regionParam.toLowerCase().replace(/-/g, ' ');
            const matchedRegion = ALL_REGIONS.find(r => r.toLowerCase().replace(/-/g, ' ') === normalizedParam);
            setActiveRegion(matchedRegion || null);
        } else {
            setActiveRegion(null);
        }
    }, [searchParams]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (filterContainerRef.current && !filterContainerRef.current.contains(event.target as Node)) {
                setShowFilters(false);
            }
        }
        if (showFilters) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showFilters]);

    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start'],
    });
    const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

    /* Filtering */
    const filteredDestinations = useMemo(() => {
        return DESTINATIONS.filter((d) => {
            const matchesRegion = !activeRegion || d.region === activeRegion;
            const matchesSearch =
                !searchQuery ||
                d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                d.description?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStyle =
                !activeStyle || (d.travelStyleTags && d.travelStyleTags.includes(activeStyle));
            return matchesRegion && matchesSearch && matchesStyle;
        });
    }, [activeRegion, searchQuery, activeStyle]);

    const hasActiveFilters = activeRegion || searchQuery || activeStyle;

    const clearFilters = () => {
        setActiveRegion(null);
        setSearchQuery('');
        setActiveStyle(null);
    };

    /* Card height variants for visual rhythm */
    const getCardVariant = (index: number): 'default' | 'tall' | 'featured' => {
        const pattern = index % 6;
        if (pattern === 0) return 'featured';
        if (pattern === 3 || pattern === 5) return 'tall';
        return 'default';
    };

    return (
        <main className="min-h-screen bg-off-white">
            {/* ═══════════════════════════════════════════
                SECTION 1: IMMERSIVE PARALLAX HERO
               ═══════════════════════════════════════════ */}
            <section ref={heroRef} className="relative h-screen min-h-[700px] max-h-[1200px] overflow-hidden">
                {/* Parallax background */}
                <motion.div style={{ y: heroY }} className="absolute inset-0 -top-[10%] h-[120%]">
                    <Image
                        src="/images/districts/destinations-hero.webp"
                        alt="Sri Lanka luxury travel destinations — stunning aerial landscape"
                        fill
                        className="object-cover"
                        sizes="100vw"
                        priority
                        quality={85}
                    />
                </motion.div>

                {/* Gradient overlays for text contrast */}
                <div className="absolute inset-0 bg-black/40 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-off-white to-transparent pointer-events-none" />

                {/* Content */}
                <motion.div
                    style={{ opacity: heroOpacity }}
                    className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 pt-20"
                >
                    <div className="max-w-5xl mx-auto">
                        {/* Micro-label */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.7 }}
                            className="text-[10px] sm:text-[11px] tracking-[0.4em] uppercase text-antique-gold font-sans font-bold mb-6 drop-shadow-md"
                        >
                            Curated Luxury Destinations
                        </motion.p>

                        {/* Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            transition={{ delay: 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                            className="text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] font-display text-white leading-[1.05] mb-8 drop-shadow-[0_4px_32px_rgba(0,0,0,0.8)] font-medium"
                        >
                            Discover Sri Lanka&apos;s
                            <span className="block text-antique-gold font-serif italic mt-2 drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)] font-semibold">Hidden Treasures</span>
                        </motion.h1>

                        {/* Sub-headline */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.7 }}
                            className="text-base sm:text-lg text-white max-w-2xl mx-auto leading-relaxed mb-12 drop-shadow-[0_2px_16px_rgba(0,0,0,0.8)] font-medium"
                        >
                            From mist-covered highlands to golden coastal sanctuaries — each destination
                            handpicked for the discerning traveller.
                        </motion.p>

                        {/* Floating stats bar */}
                        <motion.div
                            initial={{ opacity: 0, y: 24, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: 0.8, duration: 0.7 }}
                            className="inline-flex items-center gap-8 sm:gap-12 px-10 py-5 rounded-[2.5rem] bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl"
                        >
                            <div className="text-center">
                                <p className="text-2xl sm:text-3xl font-display text-white mb-1">{DESTINATIONS.length}</p>
                                <p className="text-[10px] tracking-[0.25em] uppercase text-white/50">Destinations</p>
                            </div>
                            <div className="w-px h-10 bg-white/10" />
                            <div className="text-center">
                                <p className="text-2xl sm:text-3xl font-display text-white mb-1">{ALL_REGIONS.length}</p>
                                <p className="text-[10px] tracking-[0.25em] uppercase text-white/50">Regions</p>
                            </div>
                            <div className="w-px h-10 bg-white/10" />
                            <div className="text-center">
                                <p className="text-2xl sm:text-3xl font-display text-antique-gold mb-1">{TRAVEL_STYLES.length}+</p>
                                <p className="text-[10px] tracking-[0.25em] uppercase text-white/50">Styles</p>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            {/* ═══════════════════════════════════════════
                SECTION 2: FLOATING TOOLBAR — SEARCH + FILTERS
               ═══════════════════════════════════════════ */}
            <div className="sticky top-24 sm:top-28 z-40 px-4 sm:px-6 flex justify-center pointer-events-none mb-12">
                <div ref={filterContainerRef} className={`pointer-events-auto w-full max-w-[800px] bg-white/40 backdrop-blur-3xl border border-deep-emerald/5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] p-1 flex flex-col transition-all duration-500 hover:bg-white/50 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] ${showFilters ? 'rounded-[2rem]' : 'rounded-full'}`}>
                    {/* Top row: search + filter toggle */}
                    <div className="flex items-center gap-2">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-deep-emerald/40" />
                            <input
                                type="text"
                                placeholder="Search destinations…"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 text-sm text-deep-emerald bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-deep-emerald/40 rounded-full"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-deep-emerald/40 hover:text-deep-emerald transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        <div className="w-px h-8 bg-deep-emerald/10 hidden sm:block mx-2" />

                        {/* Result count (desktop only) */}
                        <p className="hidden md:block text-[10px] tracking-[0.15em] text-deep-emerald/40 uppercase whitespace-nowrap mr-2 font-medium">
                            <span className="text-deep-emerald/80">{filteredDestinations.length}</span> of {DESTINATIONS.length}
                        </p>

                        {/* Filter toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex flex-shrink-0 items-center justify-center gap-2 px-6 py-3.5 text-[11px] tracking-[0.15em] font-semibold uppercase rounded-full transition-all duration-300 ${showFilters || hasActiveFilters
                                ? 'bg-deep-emerald text-white shadow-md shadow-deep-emerald/20'
                                : 'bg-transparent text-deep-emerald/70 hover:bg-deep-emerald/5'
                                }`}
                        >
                            <SlidersHorizontal className="h-4 w-4" />
                            <span className="hidden sm:inline">Filters</span>
                            {hasActiveFilters && (
                                <span className="w-1.5 h-1.5 rounded-full bg-antique-gold animate-pulse" />
                            )}
                        </button>
                    </div>

                    {/* Expandable filter panel */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                className="overflow-hidden"
                            >
                                <div className="px-5 pb-3 pt-2.5 border-t border-deep-emerald/5 mt-1 space-y-2.5 max-w-[100vw]">
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-deep-emerald/50">Refine Elements</p>
                                        <AnimatePresence>
                                            {hasActiveFilters && (
                                                <motion.button
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                    onClick={clearFilters}
                                                    className="text-[9px] tracking-[0.15em] text-antique-gold font-bold uppercase hover:text-antique-gold/80 transition-colors"
                                                >
                                                    Clear all
                                                </motion.button>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Region chips */}
                                    <div>
                                        <p className="text-[8px] tracking-[0.25em] uppercase text-deep-emerald/40 mb-2 font-bold">Region</p>
                                        <div className="flex overflow-x-auto whitespace-nowrap gap-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                            {ALL_REGIONS.map((region) => (
                                                <button
                                                    key={region}
                                                    onClick={() => setActiveRegion(activeRegion === region ? null : region)}
                                                    className={`inline-flex flex-shrink-0 items-center gap-1.5 px-2.5 py-1 text-[8.5px] tracking-[0.15em] uppercase rounded-full border transition-all duration-300 ${activeRegion === region
                                                        ? 'bg-deep-emerald text-white border-deep-emerald shadow-lg shadow-deep-emerald/20'
                                                        : 'bg-white/60 text-deep-emerald/70 border-deep-emerald/10 hover:border-deep-emerald/30 hover:bg-white'
                                                        }`}
                                                >
                                                    {REGION_ICONS[region] || <MapPin className="h-3 w-3" />}
                                                    {region}
                                                    <span className={`text-[8px] ml-1 font-bold ${activeRegion === region ? 'text-white/50' : 'text-deep-emerald/30'}`}>
                                                        {regionCounts[region]}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Travel style chips */}
                                    <div>
                                        <p className="text-[8px] tracking-[0.25em] uppercase text-deep-emerald/40 mb-2 font-bold">Travel Style</p>
                                        <div className="flex overflow-x-auto whitespace-nowrap gap-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                            {TRAVEL_STYLES.map((style) => (
                                                <button
                                                    key={style}
                                                    onClick={() => setActiveStyle(activeStyle === style ? null : style)}
                                                    className={`inline-flex flex-shrink-0 px-2.5 py-1 text-[8.5px] tracking-[0.15em] font-semibold uppercase rounded-full border transition-all duration-300 ${activeStyle === style
                                                        ? 'bg-antique-gold/10 text-antique-gold border-antique-gold/30'
                                                        : 'bg-white/60 text-deep-emerald/60 border-deep-emerald/10 hover:border-deep-emerald/30 hover:bg-white'
                                                        }`}
                                                >
                                                    {style}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* ═══════════════════════════════════════════
                SECTION 3: THREE TOP PICKS FOR EDITORIAL LOOK
               ═══════════════════════════════════════════ */}
            {!hasActiveFilters && (
                <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 space-y-16 lg:space-y-24 relative z-20">
                    <FeaturedDestinationSpotlight destination={featuredDestination} badgeLabel="Editor's Pick" />

                    {DESTINATIONS[1] && (
                        <FeaturedDestinationSpotlight destination={DESTINATIONS[1]} badgeLabel="Most Popular" reverse={true} />
                    )}

                    {DESTINATIONS[4] && (
                        <FeaturedDestinationSpotlight destination={DESTINATIONS[4]} badgeLabel="Must Visit" />
                    )}
                </section>
            )}

            {/* ═══════════════════════════════════════════
                SECTION 4: DESTINATION GRID WITH STAGGER
               ═══════════════════════════════════════════ */}
            <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                {/* Section header */}
                <div className="flex flex-col items-center justify-center text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display text-deep-emerald mb-4">
                        {activeRegion ? activeRegion : 'The Complete Collection'}
                    </h2>
                    <div className="w-16 h-px bg-antique-gold/50 mb-4" />
                    <p className="text-sm tracking-[0.1em] uppercase text-deep-emerald/50">
                        {filteredDestinations.length} destination{filteredDestinations.length !== 1 ? 's' : ''} awaiting your discovery
                    </p>
                </div>

                {/* Grid — responsive masonry-inspired */}
                <AnimatePresence mode="wait">
                    {filteredDestinations.length > 0 ? (
                        <motion.div
                            key={`${activeRegion}-${activeStyle}-${searchQuery}`}
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 auto-rows-auto"
                        >
                            {filteredDestinations.map((destination, index) => (
                                <motion.div
                                    key={destination.slug}
                                    variants={cardReveal}
                                    className={
                                        index === 0 && !hasActiveFilters
                                            ? 'sm:col-span-2 sm:row-span-1'
                                            : ''
                                    }
                                >
                                    <DestinationCard
                                        destination={destination}
                                        variant={
                                            index === 0 && !hasActiveFilters
                                                ? 'featured'
                                                : getCardVariant(index)
                                        }
                                        index={index}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center py-20"
                        >
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-deep-emerald/[0.04] mb-4">
                                <Compass className="h-7 w-7 text-deep-emerald/20" />
                            </div>
                            <h3 className="text-lg font-display text-deep-emerald/60 mb-2">
                                No destinations found
                            </h3>
                            <p className="text-sm text-deep-emerald/35 mb-6">
                                Try adjusting your filters or search query
                            </p>
                            <button
                                onClick={clearFilters}
                                className="text-sm text-antique-gold hover:text-antique-gold/80 transition-colors"
                            >
                                Clear all filters
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            {/* ═══════════════════════════════════════════
                SECTION 5: BUILD YOUR TOUR CTA
               ═══════════════════════════════════════════ */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-8">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="relative overflow-hidden rounded-3xl liquid-glass-gold">
                        {/* Decorative gradient orbs */}
                        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-antique-gold/[0.06] blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-deep-emerald/[0.04] blur-3xl pointer-events-none" />

                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 p-8 sm:p-12 lg:p-16">
                            <div className="max-w-lg">
                                <p className="text-[10px] tracking-[0.3em] uppercase text-antique-gold font-medium mb-3">
                                    Bespoke Journeys
                                </p>
                                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display text-deep-emerald leading-tight mb-4">
                                    Can&apos;t find the perfect match?
                                </h2>
                                <p className="text-sm text-deep-emerald/50 leading-relaxed">
                                    Our travel architects craft bespoke itineraries tailored to your pace,
                                    preferences, and dreams. Tell us your vision — we&apos;ll build the journey.
                                </p>
                            </div>

                            <Link
                                href="/build-your-tour"
                                className="group inline-flex items-center gap-3 px-8 py-4 bg-deep-emerald text-white text-xs tracking-[0.2em] font-medium uppercase rounded-full hover:bg-antique-gold transition-all duration-500 shadow-lg shadow-deep-emerald/20 hover:shadow-xl hover:shadow-antique-gold/30 hover:-translate-y-1"
                            >
                                <Heart className="h-4 w-4" />
                                <span>Build Your Tour</span>
                                <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </section>
        </main>
    );
}
