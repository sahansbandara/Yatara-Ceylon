'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock, MapPin, Compass } from 'lucide-react';

interface PackageData {
    _id?: string;
    slug: string;
    title: string;
    subtitle?: string;
    description?: string;
    duration?: string;
    images?: string[];
    tags?: string[];
    highlights?: string[];
    regions?: string[];
    travelStyle?: string;
    priceUSD?: number;
}

const DURATION_FILTERS = ['All', '5–7 Days', '8–12 Days', '12+ Days'];

function parseDurationDays(dur?: string): number {
    if (!dur) return 0;
    const match = dur.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
}

function matchesDurationFilter(pkg: PackageData, filter: string): boolean {
    if (filter === 'All') return true;
    const days = parseDurationDays(pkg.duration);
    if (filter === '5–7 Days') return days >= 5 && days <= 7;
    if (filter === '8–12 Days') return days >= 8 && days <= 12;
    if (filter === '12+ Days') return days > 12;
    return true;
}

function getOutcomeBullets(pkg: PackageData): string[] {
    // Use highlights if available, otherwise generate from description
    if (pkg.highlights && pkg.highlights.length >= 3) {
        return pkg.highlights.slice(0, 3);
    }
    // Fallback bullets based on tags
    const bullets: string[] = [];
    if (pkg.tags?.some(t => t.toLowerCase().includes('cultur'))) bullets.push('Immerse in centuries-old heritage sites');
    if (pkg.tags?.some(t => t.toLowerCase().includes('wild'))) bullets.push('Encounter wildlife in their natural habitat');
    if (pkg.tags?.some(t => t.toLowerCase().includes('beach'))) bullets.push('Unwind on pristine untouched coastlines');
    if (pkg.tags?.some(t => t.toLowerCase().includes('tea') || t.toLowerCase().includes('hill'))) bullets.push('Wander through misty tea plantations');
    if (pkg.tags?.some(t => t.toLowerCase().includes('well'))) bullets.push('Restore with authentic Ayurvedic treatments');
    if (pkg.tags?.some(t => t.toLowerCase().includes('advent'))) bullets.push('Experience heart-pumping adventures');
    // Pad to 3
    while (bullets.length < 3) {
        const defaults = ['Private transfers throughout', 'Handpicked boutique stays', 'Dedicated concierge support'];
        bullets.push(defaults[bullets.length] || 'Curated by local specialists');
    }
    return bullets.slice(0, 3);
}

function getRegionLabel(pkg: PackageData): string {
    if (pkg.regions && pkg.regions.length > 0) return pkg.regions[0];
    // Infer from tags
    const regionTags = ['Cultural Triangle', 'South Coast', 'Hill Country', 'East Coast', 'North', 'West Coast', 'Colombo'];
    for (const r of regionTags) {
        if (pkg.tags?.some(t => t.toLowerCase().includes(r.toLowerCase()))) return r;
    }
    return 'Sri Lanka';
}

function getStyleLabel(pkg: PackageData): string {
    if (pkg.travelStyle) return pkg.travelStyle;
    if (pkg.tags?.some(t => t.toLowerCase().includes('luxury'))) return 'Luxury';
    if (pkg.tags?.some(t => t.toLowerCase().includes('advent'))) return 'Adventure';
    if (pkg.tags?.some(t => t.toLowerCase().includes('cultur'))) return 'Cultural';
    if (pkg.tags?.some(t => t.toLowerCase().includes('wild'))) return 'Wildlife';
    if (pkg.tags?.some(t => t.toLowerCase().includes('well'))) return 'Wellness';
    return 'Bespoke';
}

export default function FeaturedJourneysClient({ packages }: { packages: PackageData[] }) {
    const [activeFilter, setActiveFilter] = useState('All');

    const filtered = useMemo(() =>
        packages.filter(pkg => matchesDurationFilter(pkg, activeFilter)),
        [packages, activeFilter]
    );

    if (packages.length === 0) return null;

    return (
        <section className="pt-12 pb-20 md:pt-16 md:pb-28 bg-[#E3EFE9] text-deep-emerald relative overflow-hidden">
            {/* Background Pattern Overlay */}
            <div
                className="absolute inset-0 z-0 opacity-30 pointer-events-none mix-blend-multiply"
                style={{
                    backgroundImage: "url('/images/home/curated-bg-pattern.webp')",
                    backgroundSize: '400px',
                    backgroundPosition: 'top left',
                    backgroundRepeat: 'repeat'
                }}
            />

            <div className="max-w-[1400px] mx-auto relative z-10">

                {/* Header Row */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div className="max-w-xl">
                        <span className="block text-[10px] tracking-[0.2em] font-nav text-deep-emerald/50 uppercase mb-4">
                            Handpicked Experiences
                        </span>
                        <h2 className="text-4xl md:text-5xl font-display text-deep-emerald leading-tight mb-6">
                            Featured <span className="italic font-light">Journeys</span>
                        </h2>
                        <p className="text-deep-emerald/60 font-light text-sm md:text-base leading-relaxed">
                            Curated itineraries crafted by our local experts, balancing iconic landmarks with hidden gems and unparalleled luxury.
                        </p>
                    </div>

                    <Link
                        href="/packages"
                        className="inline-flex items-center gap-3 text-[10px] tracking-[0.2em] font-nav font-semibold text-deep-emerald hover:text-antique-gold uppercase transition-colors group shrink-0"
                    >
                        View All Journeys
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* Filter Bar */}
                <div className="flex flex-wrap items-center gap-2 mb-12">
                    {DURATION_FILTERS.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-5 py-2 text-[10px] font-nav font-semibold tracking-[0.15em] uppercase rounded-full border transition-all duration-300 ${activeFilter === filter
                                ? 'bg-deep-emerald text-white border-deep-emerald'
                                : 'bg-white text-deep-emerald/60 border-deep-emerald/10 hover:border-deep-emerald/30 hover:text-deep-emerald'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                    <span className="text-[10px] font-nav text-deep-emerald/30 tracking-wide ml-2">
                        {filtered.length} journeys
                    </span>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filtered.map((pkg: PackageData) => {
                        const outcomes = getOutcomeBullets(pkg);
                        const region = getRegionLabel(pkg);
                        const styleLabel = getStyleLabel(pkg);

                        return (
                            <Link
                                key={pkg._id || pkg.slug}
                                href={`/packages/${pkg.slug}`}
                                className="group relative flex flex-col h-full bg-white/60 backdrop-blur-xl rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(17,61,51,0.12)] transition-all duration-700 border border-white/60 hover:border-white/80"
                            >
                                {/* Inner glossy reflection border */}
                                <div className="absolute inset-0 rounded-2xl pointer-events-none border border-white/40 mix-blend-overlay z-20"></div>
                                {/* Card Image */}
                                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                                    <Image
                                        src={pkg.images?.[0] || '/images/home/curated-kingdoms.png'}
                                        alt={pkg.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                                    />
                                    {/* Style badge */}
                                    <div className="absolute top-4 left-4 z-20">
                                        <span className="px-3 py-1 bg-black/40 backdrop-blur-md text-white text-[9px] font-nav tracking-widest uppercase rounded-sm border border-white/10">
                                            {styleLabel}
                                        </span>
                                    </div>
                                </div>

                                {/* Card Content Container */}
                                <div className="p-6 md:p-8 flex flex-col flex-1 relative z-10 bg-white">
                                    
                                    {/* Top Section: Meta */}
                                    <div className="flex items-center gap-2.5 text-deep-emerald/60 mb-3">
                                        <div className="flex items-center gap-1.5 font-nav text-[9px] uppercase tracking-[0.15em] font-medium">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>{pkg.duration || 'Custom'}</span>
                                        </div>
                                        <span className="w-1 h-1 rounded-full bg-deep-emerald/30" />
                                        <div className="flex items-center gap-1.5 font-nav text-[9px] uppercase tracking-[0.15em] font-medium">
                                            <MapPin className="w-3.5 h-3.5" />
                                            <span>{region}</span>
                                        </div>
                                    </div>

                                    {/* Middle Section: Title, Subtitle & Facts */}
                                    <div className="flex flex-col flex-1">
                                        <h3 className="text-2xl md:text-3xl font-display text-deep-emerald group-hover:text-antique-gold transition-colors duration-500 mb-2 leading-tight">
                                            {pkg.title}
                                        </h3>

                                        <p className="text-[14px] italic text-deep-emerald/60 font-light line-clamp-2 mb-6">
                                            {pkg.subtitle || (pkg.description ? pkg.description.split('.')[0] + '.' : 'A carefully curated journey through Sri Lanka.')}
                                        </p>

                                        <ul className="space-y-3.5 mb-8">
                                            {outcomes.map((bullet, i) => (
                                                <li key={i} className="flex items-start gap-4 text-[13px] text-deep-emerald/80 font-light leading-relaxed">
                                                    <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-antique-gold/60 shrink-0" />
                                                    {bullet}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Bottom Section */}
                                    <div className="mt-auto pt-6 flex flex-row items-center w-full">
                                        <div className="w-full flex items-center justify-between px-5 py-3 border border-deep-emerald/20 group-hover:border-antique-gold rounded-md transition-all duration-500 ease-out bg-transparent group-hover:bg-antique-gold/5">
                                            <span className="text-[10px] font-nav font-medium tracking-[0.2em] uppercase text-deep-emerald/80 group-hover:text-antique-gold transition-colors duration-500">
                                                View Full Itinerary
                                            </span>
                                            <ArrowRight className="w-3.5 h-3.5 text-deep-emerald/50 group-hover:text-antique-gold transform group-hover:translate-x-1 transition-all duration-500 ease-out" strokeWidth={1.5} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Empty state */}
                {filtered.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-deep-emerald/40 font-nav text-sm tracking-wide">
                            No journeys match this filter.{' '}
                            <button onClick={() => setActiveFilter('All')} className="text-antique-gold underline underline-offset-4">
                                View all
                            </button>
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
