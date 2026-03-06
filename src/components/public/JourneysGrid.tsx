'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, SlidersHorizontal } from 'lucide-react';
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

    const filtered = useMemo(() => {
        let result = [...packages];

        // Filter by style
        if (selectedStyle) {
            result = result.filter(p =>
                p.style === selectedStyle ||
                (p.tags || []).some(t => t.toLowerCase() === selectedStyle.toLowerCase())
            );
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

    const featuredJourneys = filtered.filter(p => p.isFeatured).slice(0, 2);
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

            {/* Filter Bar */}
            <div className="sticky top-[72px] z-30 bg-off-white/80 backdrop-blur-lg border-b border-gray-100/60 -mx-6 md:-mx-12 px-6 md:px-12 py-5 mb-12">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
                    {/* Style chips */}
                    <div className="flex flex-wrap gap-2">
                        {STYLE_CHIPS.map(chip => (
                            <button
                                key={chip.value}
                                onClick={() => setSelectedStyle(chip.value)}
                                className={`px-4 py-2 text-[11px] tracking-[0.12em] uppercase font-medium rounded-full border transition-all duration-300
                                    ${selectedStyle === chip.value
                                        ? 'bg-deep-emerald text-white border-deep-emerald'
                                        : 'bg-white text-gray-500 border-gray-200 hover:border-deep-emerald/30 hover:text-deep-emerald'
                                    }`}
                            >
                                {chip.label}
                            </button>
                        ))}
                    </div>

                    {/* Duration segments + Sort */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center bg-white border border-gray-200 rounded-full overflow-hidden">
                            {DURATION_SEGMENTS.map(seg => (
                                <button
                                    key={seg.value}
                                    onClick={() => setSelectedDuration(seg.value)}
                                    className={`px-4 py-2 text-[10px] tracking-[0.1em] uppercase font-medium transition-all duration-300
                                        ${selectedDuration === seg.value
                                            ? 'bg-deep-emerald text-white'
                                            : 'text-gray-500 hover:text-deep-emerald'
                                        }`}
                                >
                                    {seg.label}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-2">
                            <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="text-[11px] tracking-[0.1em] uppercase font-medium text-gray-500 bg-transparent border-none outline-none cursor-pointer"
                            >
                                {SORT_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Row — large editorial cards */}
            {featuredJourneys.length > 0 && (
                <div className="mb-14">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {featuredJourneys.map((pkg) => (
                            <Link key={pkg._id} href={`/packages/${pkg.slug}`} className="group block">
                                <article className="relative rounded-2xl overflow-hidden h-[480px] md:h-[520px]">
                                    <Image
                                        src={pkg.images?.[0] || '/images/home/curated-kingdoms.png'}
                                        alt={pkg.title}
                                        fill
                                        className="object-cover transform group-hover:scale-[1.02] transition-transform duration-[1200ms] ease-out"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                                    {/* Featured badge */}
                                    <div className="absolute top-6 left-6">
                                        <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-antique-gold bg-black/30 backdrop-blur-md px-4 py-1.5 rounded-full border border-antique-gold/30">
                                            Featured
                                        </span>
                                    </div>

                                    {/* Duration badge */}
                                    <div className="absolute top-6 right-6">
                                        <span className="text-[10px] tracking-[0.15em] uppercase font-medium text-white/90 bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                                            {pkg.duration}
                                        </span>
                                    </div>

                                    {/* Content overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {(pkg.tags || []).slice(0, 3).map((tag: string) => (
                                                <span
                                                    key={tag}
                                                    className="text-[9px] tracking-[0.15em] uppercase font-medium text-white/70 bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        <h3 className="text-2xl md:text-3xl font-display text-white mb-3 leading-snug group-hover:text-antique-gold transition-colors duration-500">
                                            {pkg.title}
                                        </h3>
                                        <p className="text-white/60 font-light text-sm line-clamp-2 mb-5 max-w-lg">
                                            {pkg.summary}
                                        </p>

                                        <div className="flex items-center justify-between">
                                            {pkg.priceMin > 0 && (
                                                <div>
                                                    <p className="text-[10px] text-white/40 tracking-widest uppercase mb-0.5">From</p>
                                                    <PackagePriceDisplay priceMin={pkg.priceMin} />
                                                </div>
                                            )}
                                            <span className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.15em] uppercase font-semibold text-white group-hover:text-antique-gold transition-colors duration-300">
                                                Explore Journey
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
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
                                    <Image
                                        src={pkg.images?.[0] || '/images/home/curated-kingdoms.png'}
                                        alt={pkg.title}
                                        fill
                                        className="object-cover transform group-hover:scale-[1.03] transition-transform duration-[1000ms] ease-out"
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
