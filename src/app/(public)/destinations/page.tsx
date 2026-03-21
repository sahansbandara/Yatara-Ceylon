'use client';

import { useState, useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
    const [activeRegion, setActiveRegion] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeStyle, setActiveStyle] = useState<string | null>(null);
    const [showFilters, setShowFilters] = useState(false);

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
            <section ref={heroRef} className="relative h-[85vh] min-h-[600px] max-h-[900px] overflow-hidden">
                {/* Parallax background */}
                <motion.div style={{ y: heroY }} className="absolute inset-0 -top-[10%] h-[120%]">
                    <Image
                        src="/images/districts/sigiriya.webp"
                        alt="Sri Lanka destinations — aerial view of Sigiriya Rock Fortress"
                        fill
                        className="object-cover"
                        sizes="100vw"
                        priority
                        quality={85}
                    />
                </motion.div>

                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-deep-emerald/60 via-deep-emerald/30 to-deep-emerald/80" />
                <div className="absolute inset-0 bg-gradient-to-r from-deep-emerald/50 via-transparent to-transparent" />

                {/* Content */}
                <motion.div
                    style={{ opacity: heroOpacity }}
                    className="relative z-10 h-full flex flex-col justify-end pb-16 sm:pb-20 lg:pb-24"
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                        {/* Micro-label */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.7 }}
                            className="text-[10px] sm:text-[11px] tracking-[0.35em] uppercase text-antique-gold/80 font-sans font-medium mb-4"
                        >
                            Curated Luxury Destinations
                        </motion.p>

                        {/* Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            transition={{ delay: 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display text-white leading-[1.05] mb-4 max-w-3xl"
                        >
                            Discover Sri Lanka&apos;s
                            <span className="block text-antique-gold/90">Hidden Treasures</span>
                        </motion.h1>

                        {/* Sub-headline */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.7 }}
                            className="text-sm sm:text-base text-white/55 max-w-xl leading-relaxed font-light mb-10"
                        >
                            From mist-covered highlands to golden coastal sanctuaries — each destination
                            handpicked for the discerning traveller.
                        </motion.p>

                        {/* Floating stats bar */}
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.7 }}
                            className="inline-flex items-center gap-6 sm:gap-8 px-6 py-3.5 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(4,57,39,0.6) 0%, rgba(4,57,39,0.45) 50%, rgba(2,40,26,0.6) 100%)', backdropFilter: 'blur(24px) saturate(180%)', WebkitBackdropFilter: 'blur(24px) saturate(180%)', border: '1px solid rgba(212,175,55,0.12)', boxShadow: '0 8px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.06)' }}
                        >
                            <div className="text-center">
                                <p className="text-xl sm:text-2xl font-display text-white">{DESTINATIONS.length}</p>
                                <p className="text-[9px] tracking-[0.2em] uppercase text-white/40 mt-0.5">Destinations</p>
                            </div>
                            <div className="w-px h-8 bg-white/10" />
                            <div className="text-center">
                                <p className="text-xl sm:text-2xl font-display text-white">{ALL_REGIONS.length}</p>
                                <p className="text-[9px] tracking-[0.2em] uppercase text-white/40 mt-0.5">Regions</p>
                            </div>
                            <div className="w-px h-8 bg-white/10" />
                            <div className="text-center">
                                <p className="text-xl sm:text-2xl font-display text-antique-gold">{TRAVEL_STYLES.length}+</p>
                                <p className="text-[9px] tracking-[0.2em] uppercase text-white/40 mt-0.5">Styles</p>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Bottom fade */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-off-white to-transparent z-10" />
            </section>

            {/* ═══════════════════════════════════════════
                SECTION 2: STICKY TOOLBAR — SEARCH + FILTERS
               ═══════════════════════════════════════════ */}
            <div className="sticky top-0 z-40 bg-off-white/80 backdrop-blur-2xl border-b border-deep-emerald/[0.06]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    {/* Top row: search + filter toggle */}
                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-deep-emerald/30" />
                            <input
                                type="text"
                                placeholder="Search destinations…"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 text-sm text-deep-emerald placeholder:text-deep-emerald/30 liquid-glass-input rounded-xl"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-deep-emerald/30 hover:text-deep-emerald/60 transition-colors"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>

                        {/* Filter toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-4 py-2.5 text-xs tracking-[0.1em] uppercase rounded-xl border transition-all duration-300 ${
                                showFilters || hasActiveFilters
                                    ? 'bg-deep-emerald text-white border-deep-emerald'
                                    : 'bg-transparent text-deep-emerald/60 border-deep-emerald/10 hover:border-deep-emerald/25'
                            }`}
                        >
                            <SlidersHorizontal className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Filters</span>
                            {hasActiveFilters && (
                                <span className="w-1.5 h-1.5 rounded-full bg-antique-gold animate-pulse" />
                            )}
                        </button>

                        {/* Result count */}
                        <p className="hidden md:block text-[11px] tracking-[0.1em] text-deep-emerald/35 uppercase whitespace-nowrap">
                            Showing <span className="text-deep-emerald/60 font-medium">{filteredDestinations.length}</span> of {DESTINATIONS.length}
                        </p>

                        {/* Clear filters */}
                        <AnimatePresence>
                            {hasActiveFilters && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    onClick={clearFilters}
                                    className="text-[11px] tracking-[0.1em] text-antique-gold uppercase hover:text-antique-gold/80 transition-colors whitespace-nowrap"
                                >
                                    Clear all
                                </motion.button>
                            )}
                        </AnimatePresence>
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
                                <div className="pt-4 pb-1 space-y-4">
                                    {/* Region chips */}
                                    <div>
                                        <p className="text-[10px] tracking-[0.2em] uppercase text-deep-emerald/35 mb-2.5 font-medium">Region</p>
                                        <div className="flex flex-wrap gap-2">
                                            {ALL_REGIONS.map((region) => (
                                                <button
                                                    key={region}
                                                    onClick={() => setActiveRegion(activeRegion === region ? null : region)}
                                                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] tracking-[0.1em] uppercase rounded-full border transition-all duration-300 ${
                                                        activeRegion === region
                                                            ? 'bg-deep-emerald text-white border-deep-emerald shadow-lg shadow-deep-emerald/20'
                                                            : 'bg-transparent text-deep-emerald/50 border-deep-emerald/10 hover:border-deep-emerald/25 hover:text-deep-emerald/70'
                                                    }`}
                                                >
                                                    {REGION_ICONS[region] || <MapPin className="h-3.5 w-3.5" />}
                                                    {region}
                                                    <span className={`text-[9px] ml-0.5 ${activeRegion === region ? 'text-white/50' : 'text-deep-emerald/25'}`}>
                                                        {regionCounts[region]}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Travel style chips */}
                                    <div>
                                        <p className="text-[10px] tracking-[0.2em] uppercase text-deep-emerald/35 mb-2.5 font-medium">Travel Style</p>
                                        <div className="flex flex-wrap gap-2">
                                            {TRAVEL_STYLES.map((style) => (
                                                <button
                                                    key={style}
                                                    onClick={() => setActiveStyle(activeStyle === style ? null : style)}
                                                    className={`px-3 py-1 text-[10px] tracking-[0.12em] uppercase rounded-full border transition-all duration-300 ${
                                                        activeStyle === style
                                                            ? 'bg-antique-gold/20 text-antique-gold border-antique-gold/40'
                                                            : 'bg-transparent text-deep-emerald/40 border-deep-emerald/8 hover:border-deep-emerald/20'
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
                SECTION 3: FEATURED DESTINATION SPOTLIGHT
               ═══════════════════════════════════════════ */}
            {!hasActiveFilters && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
                    <FeaturedDestinationSpotlight destination={featuredDestination} />
                </section>
            )}

            {/* ═══════════════════════════════════════════
                SECTION 4: DESTINATION GRID WITH STAGGER
               ═══════════════════════════════════════════ */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Section header */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-display text-deep-emerald">
                            {activeRegion ? activeRegion : 'All Destinations'}
                        </h2>
                        <p className="text-sm text-deep-emerald/40 mt-1">
                            {filteredDestinations.length} destination{filteredDestinations.length !== 1 ? 's' : ''} to explore
                        </p>
                    </div>
                </div>

                {/* Grid — responsive masonry-inspired */}
                <AnimatePresence mode="wait">
                    {filteredDestinations.length > 0 ? (
                        <motion.div
                            key={`${activeRegion}-${activeStyle}-${searchQuery}`}
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6 auto-rows-auto"
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
                                className="group inline-flex items-center gap-3 px-8 py-4 bg-deep-emerald text-white text-sm tracking-[0.15em] uppercase rounded-2xl hover:bg-deep-emerald/90 transition-all duration-500 shadow-lg shadow-deep-emerald/20 hover:shadow-xl hover:shadow-deep-emerald/30 hover:-translate-y-0.5"
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
