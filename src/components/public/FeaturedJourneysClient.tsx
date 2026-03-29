'use client';

import { useState, useMemo, useRef, MouseEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

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

function getRegionLabel(pkg: PackageData): string {
    if (pkg.regions && pkg.regions.length > 0) return pkg.regions[0];
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

// Subdued hover sound
const playHoverSound = () => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.015, ctx.currentTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
        // Audio ctx might throw if interaction missing, ignore silent error
    }
};

function JourneyCard({ pkg }: { pkg: PackageData }) {
    const cardRef = useRef<HTMLAnchorElement>(null);

    const handleMouseMove = (e: MouseEvent<HTMLAnchorElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        cardRef.current.style.setProperty('--mouse-x', `${x}px`);
        cardRef.current.style.setProperty('--mouse-y', `${y}px`);
    };

    const region = getRegionLabel(pkg);
    const styleLabel = getStyleLabel(pkg);
    
    // Get tags excluding duration-related ones
    const allTags = pkg.tags || [];
    const nonDurationTags = allTags.filter(t => !t.toLowerCase().includes('day') && !t.toLowerCase().includes('night') && t.toLowerCase() !== styleLabel.toLowerCase());
    
    // Combine style label and any extra tag
    const displayTags = [styleLabel, ...nonDurationTags].slice(0, 2);

    const defaultDuration = pkg.duration ? pkg.duration.split(' / ').pop() : '';
    const durationTag = allTags.find(t => t.toLowerCase().includes('night')) || defaultDuration;

    return (
        <Link
            href={`/packages/${pkg.slug}`}
            ref={cardRef}
            onMouseEnter={playHoverSound}
            onMouseMove={handleMouseMove}
            className="group relative flex flex-col w-full h-[380px] md:h-[420px] rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] will-change-transform"
            style={{
                '--mouse-x': '150px',
                '--mouse-y': '150px',
            } as React.CSSProperties}
        >
            {/* Background Image - Absolute edges to remove black framing! */}
            <div className="absolute inset-0 w-full h-full">
                <Image
                    src={pkg.images?.[0] || '/images/home/curated-kingdoms.png'}
                    alt={pkg.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transform group-hover:scale-[1.05] transition-transform duration-[1.2s] ease-[cubic-bezier(0.23,1,0.32,1)] origin-center z-0"
                />
            </div>

            {/* Base Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t mix-blend-multiply opacity-80 group-hover:opacity-100 transition-opacity duration-700 from-black/90 via-black/20 to-transparent z-10 pointer-events-none" />

            {/* Liquid Glass Mouse-Follow Overlay */}
            <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-overlay z-10"
                style={{
                    background: `radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.3), transparent 50%)`
                }}
            />

            {/* Inner Border glow on hover */}
            <div className="absolute inset-0 rounded-2xl border border-white/0 group-hover:border-white/20 transition-colors duration-700 pointer-events-none z-10" />

            {/* Top Left Tags */}
            <div className="absolute top-4 left-4 md:top-5 md:left-5 z-20 flex flex-col items-start gap-2 pointer-events-none transform -translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <div className="flex flex-wrap gap-2">
                    {displayTags.map((tag: string) => (
                        <span
                            key={tag}
                            className="text-[9px] md:text-[10px] tracking-[0.15em] uppercase font-medium text-white/90 bg-black/30 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full shadow-lg transition-colors group-hover:border-white/30 group-hover:bg-white/10"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Top Right Duration Tag */}
            {durationTag && (
                <div className="absolute top-4 right-4 md:top-5 md:right-5 z-20 pointer-events-none transform -translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                    <span className="inline-block text-[9px] md:text-[10px] tracking-[0.15em] uppercase font-medium text-antique-gold bg-white/10 backdrop-blur-md border border-antique-gold/40 px-3 py-1.5 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.2)] transition-colors group-hover:border-antique-gold group-hover:bg-white/20">
                        {durationTag}
                    </span>
                </div>
            )}

            {/* Background Glass Plate that slides up */}
            <div className={`absolute inset-x-0 bottom-0 z-10 pointer-events-none transform translate-y-6 group-hover:translate-y-0 transition-all duration-700 ease-out h-[65%]`}>
                <div className="absolute inset-0 bg-white/10 backdrop-blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-t-2xl border-t border-white/20 mix-blend-hard-light" 
                     style={{ maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)' }} />
            </div>

            {/* Bottom Content Area */}
            <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-5 md:p-6 z-20 pointer-events-none transform translate-y-6 group-hover:translate-y-0 transition-all duration-700 ease-out">
                
                <h3 className="font-display tracking-wide text-white leading-tight drop-shadow-lg transition-colors duration-500 text-2xl md:text-3xl mb-2">
                    {pkg.title}
                </h3>

                <p className="text-white/70 group-hover:text-white/95 font-light leading-relaxed mb-4 transition-colors duration-500 text-xs md:text-sm line-clamp-2">
                    {pkg.subtitle || (pkg.description ? pkg.description.split('.')[0] + '.' : 'A carefully curated journey through Sri Lanka.')}
                </p>

                {/* Button */}
                <div className="mt-auto pointer-events-auto overflow-hidden pt-1">
                    <div className="transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-150">
                        <span className="inline-flex items-center gap-2 text-[9px] md:text-[10px] tracking-[0.2em] uppercase font-bold bg-white/10 hover:bg-white text-white hover:text-deep-emerald border border-white/20 px-5 py-2.5 rounded-full backdrop-blur-md transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.1)] group/btn">
                            View Full Itinerary
                            <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default function FeaturedJourneysClient({ packages }: { packages: PackageData[] }) {
    const [activeFilter, setActiveFilter] = useState('All');

    const filtered = useMemo(() =>
        packages.filter(pkg => matchesDurationFilter(pkg, activeFilter)),
        [packages, activeFilter]
    );

    if (packages.length === 0) return null;

    return (
        <section className="py-8 md:py-10 bg-white text-deep-emerald relative overflow-hidden">
            {/* Subtle background accents for empty areas */}
            <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-antique-gold/[0.03] rounded-full blur-3xl transition-transform duration-[10s] hover:scale-110" />

            <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10 w-full overflow-hidden">

                {/* Header Row (Mirroring Signature Experiences layout closely) */}
                <div className="mb-6 w-full text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <span className="inline-block mb-1.5 text-[9px] md:text-[10px] tracking-[0.35em] font-medium text-antique-gold uppercase delay-150 relative">
                            <span className="absolute -left-8 top-1/2 w-6 border-t border-antique-gold/30 hidden md:block"></span>
                            Pre-Curated Packages
                        </span>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-display text-deep-emerald leading-[1.1] mb-2 group">
                            Featured{' '}
                            <span className="italic font-light text-deep-emerald/90 relative inline-block">
                                Journeys
                                <span className="absolute -bottom-1 left-0 w-0 h-px bg-antique-gold transition-all duration-700 group-hover:w-full"></span>
                            </span>
                        </h2>
                    </div>

                    {/* Filter Bar moved next to title on md+ screens to save space */}
                    <div className="flex flex-wrap items-center justify-center md:justify-end gap-2">
                        {DURATION_FILTERS.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-4 py-1.5 text-[9px] font-nav font-semibold tracking-[0.15em] uppercase rounded-full border transition-all duration-300 ${activeFilter === filter
                                    ? 'bg-deep-emerald text-white border-deep-emerald shadow-md'
                                    : 'bg-white text-deep-emerald/60 border-deep-emerald/10 hover:border-deep-emerald/30 hover:text-deep-emerald'
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Styled Swiper Dots (Liquid Glass Effect) */}
                <style>{`
                    .custom-swiper-container .swiper-pagination-bullet {
                        background: rgba(255, 255, 255, 0.4);
                        backdrop-filter: blur(4px);
                        -webkit-backdrop-filter: blur(4px);
                        width: 8px;
                        height: 8px;
                        border: 1px solid rgba(0, 0, 0, 0.1);
                        box-shadow: inset 0 1px 3px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.05);
                        opacity: 1;
                        transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
                    }
                    .custom-swiper-container .swiper-pagination-bullet-active {
                        background: linear-gradient(135deg, rgba(196, 169, 118, 0.9), rgba(196, 169, 118, 0.5)) !important;
                        border-color: rgba(196, 169, 118, 0.3) !important;
                        width: 28px !important;
                        border-radius: 12px !important;
                        box-shadow: inset 0 1px 2px rgba(255,255,255,0.4), 0 4px 10px rgba(196, 169, 118, 0.2) !important;
                        backdrop-filter: blur(8px);
                        -webkit-backdrop-filter: blur(8px);
                    }
                `}</style>

                {/* Carousel */}
                <div className="w-full relative pb-6 custom-swiper-container">
                    {filtered.length > 0 ? (
                        <Swiper
                            modules={[Autoplay, Pagination]}
                            spaceBetween={20}
                            slidesPerView={1}
                            breakpoints={{
                                640: { slidesPerView: 2 },
                                1024: { slidesPerView: 3 },
                            }}
                            autoplay={{ delay: 4000, disableOnInteraction: false }}
                            pagination={{ clickable: true, dynamicBullets: true }}
                            className="!pb-12"
                        >
                            {filtered.map((pkg: PackageData) => (
                                <SwiperSlide key={pkg._id || pkg.slug} className="py-2">
                                    <JourneyCard pkg={pkg} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-deep-emerald/40 font-nav text-sm tracking-wide">
                                No journeys match this filter.{' '}
                                <button onClick={() => setActiveFilter('All')} className="text-antique-gold underline underline-offset-4 pointer-events-auto">
                                    View all
                                </button>
                            </p>
                        </div>
                    )}
                </div>

                {/* Bottom CTA (Consistency with Signature Experiences) */}
                <div className="flex justify-center w-full relative z-20">
                    <Link
                        href="/packages"
                        className="inline-flex items-center justify-center gap-3 text-[10px] md:text-[11px] tracking-[0.2em] uppercase font-semibold text-deep-emerald hover:text-white px-8 py-3.5 md:px-10 md:py-4 rounded-full w-auto bg-white border border-deep-emerald/10 hover:bg-deep-emerald shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition-all duration-500 ease-out"
                    >
                        View All Journeys
                        <ArrowRight className="h-4 w-4 stroke-[2]" />
                    </Link>
                </div>
                
            </div>
        </section>
    );
}

