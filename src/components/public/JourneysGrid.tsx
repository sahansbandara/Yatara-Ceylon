'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
// Using native <img> instead of next/image to handle potentially invalid URLs from DB
import { ArrowRight, SlidersHorizontal, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PackagePriceDisplay from './PackagePriceDisplay';

interface JourneyPackage {
    _id: string;
    title: string;
    slug: string;
    summary?: string;
    description?: string;
    priceMin: number;
    duration: string;
    durationDays?: number;
    type?: string;
    style?: string;
    images: string[];
    tags?: string[];
    highlights?: string[];
    isFeatured?: boolean;
}

interface JourneysGridProps {
    packages: JourneyPackage[];
    initialStyle?: string;
    initialDuration?: string;
}

const STYLE_CHIPS = [
    { value: '', label: 'All' },
    { value: 'luxury', label: 'Luxury' },
    { value: 'wellness', label: 'Wellness' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'wildlife', label: 'Wildlife' },
    { value: 'heritage', label: 'Heritage' },
    { value: 'experiences', label: 'Experiences' },
    { value: 'family', label: 'Family' },
    { value: 'beach', label: 'Beach' },
    { value: 'marine', label: 'Marine' },
];

const DURATION_SEGMENTS = [
    { value: '', label: 'Any' },
    { value: '5-7', label: '5–7 Days' },
    { value: '8-10', label: '8–10 Days' },
    { value: '11-14', label: '11–14 Days' },
];

const SORT_OPTIONS = [
    { value: 'featured', label: 'Featured' },
    { value: 'price', label: 'Price' },
    { value: 'duration', label: 'Duration' },
];

export default function JourneysGrid({ packages, initialStyle = '', initialDuration = '' }: JourneysGridProps) {
    const [selectedStyle, setSelectedStyle] = useState(initialStyle);
    const [selectedDuration, setSelectedDuration] = useState(initialDuration);
    const [sortBy, setSortBy] = useState('featured');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const filterContainerRef = useRef<HTMLDivElement>(null);

    // Sync state with props when URL navigation happens via Navbar
    useEffect(() => {
        setSelectedStyle(initialStyle);
    }, [initialStyle]);

    useEffect(() => {
        setSelectedDuration(initialDuration);
    }, [initialDuration]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (filterContainerRef.current && !filterContainerRef.current.contains(event.target as Node)) {
                setShowFilters(false);
            }
        }
        if (showFilters) document.addEventListener('mousedown', handleClickOutside);
        else document.removeEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showFilters]);

    const hasActiveFilters = selectedStyle || selectedDuration || searchQuery;

    const clearFilters = () => {
        setSelectedStyle('');
        setSelectedDuration('');
        setSearchQuery('');
        setSortBy('featured');
    };

    const filtered = useMemo(() => {
        let result = [...packages];

        // Filter by style
        if (selectedStyle) {
            const lowerSelectedStyle = selectedStyle.toLowerCase();
            result = result.filter(p => {
                const styleMatches = p.style && p.style.toLowerCase() === lowerSelectedStyle;
                const tagMatches = (p.tags || []).some((t: string) => {
                    const l = t.toLowerCase();
                    if (lowerSelectedStyle === 'cultural' && l === 'culture') return true;
                    if (lowerSelectedStyle === 'family' && l === 'families') return true;
                    return l === lowerSelectedStyle;
                });
                return styleMatches || tagMatches;
            });
        }

        // Filter by duration range
        if (selectedDuration) {
            const [minStr, maxStr] = selectedDuration.split('-');
            const min = parseInt(minStr);
            const max = parseInt(maxStr);
            if (!isNaN(min) && !isNaN(max)) {
                result = result.filter(p => {
                    if (p.durationDays) return p.durationDays >= min && p.durationDays <= max;
                    // Fallback: parse from duration string
                    const match = p.duration?.match(/(\d+)/);
                    if (match) {
                        const days = parseInt(match[1]);
                        return days >= min && days <= max;
                    }
                    return true;
                });
            }
        }

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.title.toLowerCase().includes(query) ||
                (p.slug && p.slug.toLowerCase().includes(query)) ||
                (p.summary && p.summary.toLowerCase().includes(query)) ||
                (p.tags || []).some(t => t.toLowerCase().includes(query))
            );
        }

        // Sort
        if (sortBy === 'price') {
            result.sort((a, b) => a.priceMin - b.priceMin);
        } else if (sortBy === 'duration') {
            result.sort((a, b) => (a.durationDays || 0) - (b.durationDays || 0));
        } else {
            // Featured first, then by creation order
            result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        }

        return result;
    }, [packages, selectedStyle, selectedDuration, sortBy]);

    const [highlighted, setHighlighted] = useState({ popular: null, affordable: null, luxury: null } as any);

    const featuredJourneys = useMemo(() => {
        if (filtered.length === 0) return [];

        // Find most popular (fallback to featured or first item)
        const popular = filtered.find(p => p.slug === 'curated-kingdoms') ||
            filtered.find(p => p.isFeatured) ||
            filtered[0];

        // Find most affordable
        const affordable = [...filtered]
            .filter(p => p._id !== popular._id && p.priceMin > 0)
            .sort((a, b) => a.priceMin - b.priceMin)[0];

        // Find most luxury
        const luxury = [...filtered]
            .filter(p => p._id !== popular._id && p._id !== affordable?._id)
            .sort((a, b) => b.priceMin - a.priceMin)[0];

        return [popular, affordable, luxury].filter(Boolean);
    }, [filtered]);

    const standardJourneys = filtered.filter(p => !featuredJourneys.some(f => f._id === p._id));

    return (
        <>
            {/* Credibility strip */}
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mb-12 text-[11px] tracking-[0.18em] uppercase text-gray-400 font-light">
                <span className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-antique-gold" />
                    Private driver
                </span>
                <span className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-antique-gold" />
                    Handcrafted itineraries
                </span>
                <span className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-antique-gold" />
                    Concierge support
                </span>
            </div>

            {/* Floating Toolbar — Search + Filters */}
            <div className="sticky top-24 sm:top-28 z-40 px-4 sm:px-6 flex justify-center pointer-events-none mb-12">
                <div ref={filterContainerRef} className={`pointer-events-auto w-full max-w-[800px] bg-white/40 backdrop-blur-3xl border border-deep-emerald/5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] p-1 flex flex-col transition-all duration-500 hover:bg-white/50 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] ${showFilters ? 'rounded-[2rem]' : 'rounded-full'}`}>
                    {/* Top row: search + filter toggle */}
                    <div className="flex items-center gap-2">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-deep-emerald/40" />
                            <input
                                type="text"
                                placeholder="Search journeys…"
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
                            <span className="text-deep-emerald/80">{filtered.length}</span> of {packages.length}
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
                                <div className="px-5 pb-5 pt-3 border-t border-deep-emerald/5 mt-1 max-w-[100vw] flex flex-col gap-5">
                                    <div className="flex justify-between items-center">
                                        <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-deep-emerald/50">Refine Journeys</p>
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

                                    {/* Duration segments */}
                                    <div>
                                        <p className="text-[8px] tracking-[0.25em] uppercase text-deep-emerald/40 mb-2 font-bold">Duration</p>
                                        <div className="flex flex-wrap gap-2">
                                            {DURATION_SEGMENTS.map(seg => (
                                                <button
                                                    key={seg.value}
                                                    onClick={() => setSelectedDuration(seg.value)}
                                                    className={`inline-flex flex-shrink-0 px-3 py-1.5 text-[9px] tracking-[0.15em] font-semibold uppercase rounded-full border transition-all duration-300 ${selectedDuration === seg.value
                                                        ? 'bg-deep-emerald text-white border-deep-emerald shadow-lg shadow-deep-emerald/20'
                                                        : 'bg-white/60 text-deep-emerald/70 border-deep-emerald/10 hover:border-deep-emerald/30 hover:bg-white'
                                                        }`}
                                                >
                                                    {seg.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Travel style chips */}
                                    <div>
                                        <p className="text-[8px] tracking-[0.25em] uppercase text-deep-emerald/40 mb-2 font-bold">Travel Style</p>
                                        <div className="flex flex-wrap gap-2">
                                            {STYLE_CHIPS.map(chip => (
                                                <button
                                                    key={chip.value}
                                                    onClick={() => setSelectedStyle(chip.value)}
                                                    className={`inline-flex flex-shrink-0 px-3 py-1.5 text-[9px] tracking-[0.15em] font-semibold uppercase rounded-full border transition-all duration-300 ${selectedStyle === chip.value
                                                        ? 'bg-antique-gold/10 text-antique-gold border-antique-gold/30'
                                                        : 'bg-white/60 text-deep-emerald/60 border-deep-emerald/10 hover:border-deep-emerald/30 hover:bg-white'
                                                        }`}
                                                >
                                                    {chip.label}
                                                </button>
                                            ))}
                                    </div>
                                    </div>

                                    {/* Sort Dropdown */}
                                    <div>
                                        <p className="text-[8px] tracking-[0.25em] uppercase text-deep-emerald/40 mb-2 font-bold">Sort By</p>
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="w-full sm:w-auto px-4 py-2 text-[10px] tracking-[0.15em] uppercase font-semibold text-deep-emerald bg-white/60 border border-deep-emerald/10 rounded-full hover:border-deep-emerald/30 transition-colors focus:outline-none"
                                        >
                                            {SORT_OPTIONS.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Highlighted Section — 3-row, 2-column grid */}
            {featuredJourneys.length > 0 && (
                <div className="mb-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-3 gap-6 lg:h-[760px]">
                        {/* Most Popular (2x2) */}
                        {featuredJourneys[0] && (
                            <Link href={`/packages/${featuredJourneys[0].slug}`} className="group relative block rounded-2xl overflow-hidden lg:col-span-2 lg:row-span-2 h-[400px] lg:h-full">
                                <img
                                    src={featuredJourneys[0].images?.[0] || '/images/home/curated-kingdoms.png'}
                                    alt={featuredJourneys[0].title}
                                    className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-[1.03] transition-transform duration-1200 ease-out"
                                />
                                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                                <div className="absolute top-6 left-6">
                                    <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-white bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                                        Most Popular
                                    </span>
                                </div>
                                <div className="absolute top-6 right-6">
                                    <span className="text-[10px] tracking-[0.15em] uppercase font-medium text-white/90 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                                        {featuredJourneys[0].duration}
                                    </span>
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-10">
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {(featuredJourneys[0].tags || []).slice(0, 3).map((tag: string) => (
                                            <span key={tag} className="text-[9px] tracking-[0.15em] uppercase font-medium text-white/70 bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <h3 className="text-3xl lg:text-4xl font-display text-white mb-3 group-hover:text-antique-gold transition-colors duration-500">
                                        {featuredJourneys[0].title}
                                    </h3>
                                    <div className="flex items-center justify-between">
                                        <p className="text-white/60 font-light text-sm line-clamp-2 max-w-xl">
                                            {featuredJourneys[0].summary}
                                        </p>
                                        <div className="flex-shrink-0 text-right">
                                            {featuredJourneys[0].priceMin > 0 && (
                                                <PackagePriceDisplay priceMin={featuredJourneys[0].priceMin} variant="white" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )}

                        {/* Most Affordable (1x1) */}
                        {featuredJourneys[1] && (
                            <Link href={`/packages/${featuredJourneys[1].slug}`} className="group relative block rounded-2xl overflow-hidden lg:col-span-1 lg:row-span-1 h-[320px] lg:h-full">
                                <img
                                    src={featuredJourneys[1].images?.[0] || '/images/home/curated-kingdoms.png'}
                                    alt={featuredJourneys[1].title}
                                    className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-[1.03] transition-transform duration-1200 ease-out"
                                />
                                <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                <div className="absolute top-5 left-5">
                                    <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-white bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                                        Most Affordable
                                    </span>
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <h3 className="text-xl font-display text-white mb-2 group-hover:text-antique-gold transition-colors duration-500 line-clamp-1">
                                        {featuredJourneys[1].title}
                                    </h3>
                                    <div className="flex items-end justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[11px] text-white/70 tracking-wider">
                                                {featuredJourneys[1].duration}
                                            </span>
                                        </div>
                                        {featuredJourneys[1].priceMin > 0 && (
                                            <PackagePriceDisplay priceMin={featuredJourneys[1].priceMin} variant="white" />
                                        )}
                                    </div>
                                </div>
                            </Link>
                        )}

                        {/* Most Luxury (1x1) */}
                        {featuredJourneys[2] && (
                            <Link href={`/packages/${featuredJourneys[2].slug}`} className="group relative block rounded-2xl overflow-hidden lg:col-span-1 lg:row-span-1 h-[320px] lg:h-full">
                                <img
                                    src={featuredJourneys[2].images?.[0] || '/images/home/curated-kingdoms.png'}
                                    alt={featuredJourneys[2].title}
                                    className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-[1.03] transition-transform duration-1200 ease-out"
                                />
                                <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                <div className="absolute top-5 left-5">
                                    <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-white bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                                        Most Luxury
                                    </span>
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <h3 className="text-xl font-display text-white mb-2 group-hover:text-antique-gold transition-colors duration-500 line-clamp-1">
                                        {featuredJourneys[2].title}
                                    </h3>
                                    <div className="flex items-end justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[11px] text-white/70 tracking-wider">
                                                {featuredJourneys[2].duration}
                                            </span>
                                        </div>
                                        {featuredJourneys[2].priceMin > 0 && (
                                            <PackagePriceDisplay priceMin={featuredJourneys[2].priceMin} variant="white" />
                                        )}
                                    </div>
                                </div>
                            </Link>
                        )}
                    </div>
                </div>
            )}

            {/* Standard Grid — consistent 4:3 ratio, calm layout */}
            {standardJourneys.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {standardJourneys.map((pkg) => (
                        <Link key={pkg._id} href={`/packages/${pkg.slug}`} className="group block">
                            <article className="rounded-2xl overflow-hidden bg-white border border-gray-100/80 flex flex-col h-full hover:shadow-lg hover:shadow-black/[0.04] transition-all duration-500">
                                {/* Image — 4:3 ratio */}
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <img
                                        src={pkg.images?.[0] || '/images/home/curated-kingdoms.png'}
                                        alt={pkg.title}
                                        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-[1.03] transition-transform duration-1000 ease-out"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                                    {/* Duration badge */}
                                    <div className="absolute top-4 right-4">
                                        <span className="text-[10px] tracking-[0.12em] uppercase font-medium text-white/90 bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                                            {pkg.duration}
                                        </span>
                                    </div>
                                </div>

                                {/* Content — minimal and calm */}
                                <div className="p-6 md:p-7 flex flex-col flex-grow">
                                    {/* Tags — max 3, quiet */}
                                    {(pkg.tags || []).length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mb-3">
                                            {(pkg.tags || []).slice(0, 3).map((tag: string) => (
                                                <span
                                                    key={tag}
                                                    className="text-[9px] tracking-[0.12em] uppercase font-medium text-antique-gold/80"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <h3 className="text-lg font-display text-deep-emerald group-hover:text-antique-gold transition-colors duration-500 mb-2.5 leading-snug">
                                        {pkg.title}
                                    </h3>

                                    <p className="text-gray-400 font-light text-[13px] line-clamp-2 leading-relaxed mb-auto">
                                        {pkg.summary}
                                    </p>

                                    {/* Footer */}
                                    <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between">
                                        {pkg.priceMin > 0 ? (
                                            <PackagePriceDisplay priceMin={pkg.priceMin} />
                                        ) : (
                                            <span className="text-[11px] text-gray-400 tracking-wider uppercase">On request</span>
                                        )}
                                        <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase font-semibold text-deep-emerald group-hover:text-antique-gold transition-colors duration-300">
                                            Explore
                                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                                        </span>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            )}

            {/* Empty state */}
            {filtered.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-gray-400 font-light text-lg mb-4">No journeys match your filters.</p>
                    <button
                        onClick={() => { setSelectedStyle(''); setSelectedDuration(''); }}
                        className="text-[11px] tracking-[0.15em] uppercase font-semibold text-antique-gold hover:text-deep-emerald transition-colors"
                    >
                        Clear all filters
                    </button>
                </div>
            )}
        </>
    );
}
