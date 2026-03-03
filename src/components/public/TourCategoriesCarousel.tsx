'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useRef, useState, useEffect, useCallback } from 'react';
import { tourCategories } from '@/data/tourCategories';

export default function TourCategoriesCarousel() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const filteredCategories = tourCategories;
    const totalSlides = filteredCategories.length;

    const updateCurrentIndex = useCallback(() => {
        if (!scrollRef.current) return;
        const container = scrollRef.current;
        const scrollLeft = container.scrollLeft;
        const firstChild = container.children[0] as HTMLElement | undefined;
        const itemWidth = firstChild?.offsetWidth || 400;
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

    const scrollTo = (direction: 'left' | 'right' | 'start') => {
        if (!scrollRef.current) return;
        const container = scrollRef.current;
        const firstChild = container.children[0] as HTMLElement | undefined;
        const itemWidth = firstChild?.offsetWidth || (window.innerWidth < 768 ? 280 : 360);
        const gap = 32;

        if (direction === 'start') {
            container.scrollTo({ left: 0, behavior: 'smooth' });
            return;
        }

        container.scrollBy({
            left: direction === 'left' ? -(itemWidth + gap) : itemWidth + gap,
            behavior: 'smooth',
        });
    };

    // Auto-scroll loop
    useEffect(() => {
        if (isHovered) return;

        const timer = setInterval(() => {
            if (scrollRef.current) {
                const container = scrollRef.current;
                if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
                    scrollTo('start');
                } else {
                    scrollTo('right');
                }
            }
        }, 3500);

        return () => clearInterval(timer);
    }, [isHovered]);

    return (
        <section className="py-20 md:py-28 bg-[#E3EFE9] text-deep-emerald relative overflow-hidden">
            {/* Subtle background accents */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-antique-gold/[0.03] rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-deep-emerald/[0.02] rounded-full blur-3xl" />

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                {/* ── Header ── */}
                <div className="mb-6 md:mb-10">
                    <span className="inline-block mb-4 text-[11px] tracking-[0.35em] font-medium text-antique-gold uppercase">
                        Handpicked Itineraries
                    </span>
                    <h2 className="text-4xl md:text-6xl font-display text-deep-emerald leading-[1.1] mb-5">
                        Signature{' '}
                        <span className="italic font-light">Experiences</span>
                    </h2>
                    <p className="text-gray-500 font-light text-base md:text-lg max-w-xl leading-relaxed">
                        Handpicked itineraries designed around pace, privacy, and purpose.
                        <br className="hidden md:block" />
                        Choose a travel style. We tailor the rest.
                    </p>
                    <div className="h-px w-20 bg-gradient-to-r from-antique-gold to-transparent mt-7" />
                </div>

                {/* ── Spacer ── */}
                <div className="mb-4"></div>

                {/* Carousel Container */}
                <div className="relative group/carousel -mx-6 md:-mx-16 lg:-mx-20 py-8">

                    {/* Background Highlight wrapping the package row full-width */}
                    <div className="absolute top-0 bottom-0 left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] bg-[#D1E5DB]/70 -z-10 pointer-events-none hidden md:block" />

                    {/* Left Navigation - Nude Glass Circle */}
                    <button
                        onClick={() => scrollTo('left')}
                        className="absolute left-2 md:left-5 lg:left-7 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-deep-emerald/60 hover:bg-white/45 hover:text-deep-emerald shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-300 hover:scale-110"
                        aria-label="Previous"
                    >
                        <ChevronLeft className="w-5 h-5 stroke-[2]" />
                    </button>

                    {/* Right Navigation - Nude Glass Circle */}
                    <button
                        onClick={() => scrollTo('right')}
                        className="absolute right-2 md:right-5 lg:right-7 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-deep-emerald/60 hover:bg-white/45 hover:text-deep-emerald shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-300 hover:scale-110"
                        aria-label="Next"
                    >
                        <ChevronRight className="w-5 h-5 stroke-[2]" />
                    </button>

                    {/* ── Scroll-snap Horizontal Rail ── */}
                    <div
                        ref={scrollRef}
                        className="flex gap-6 md:gap-8 overflow-x-auto pb-4 snap-x snap-mandatory px-10 md:px-20 lg:px-24 scrollbar-none"
                        style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none'
                        }}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onTouchStart={() => setIsHovered(true)}
                        onTouchEnd={() => setIsHovered(false)}
                    >
                        {filteredCategories.map((cat) => (
                            <Link
                                key={cat.title}
                                href={cat.href}
                                className="group block flex-shrink-0 snap-center"
                            >
                                <div
                                    className="relative rounded-[32px] overflow-hidden cursor-pointer flex-shrink-0 snap-center transition-all duration-[600ms] group w-[280px] md:w-[360px] lg:w-[420px] h-[480px] md:h-[580px]"
                                >
                                    {/* Image */}
                                    <Image
                                        src={cat.image}
                                        alt={cat.title}
                                        fill
                                        sizes="(max-width: 768px) 280px, (max-width: 1024px) 360px, 420px"
                                        className="object-cover transform group-hover:scale-[1.02] transition-transform duration-1000 ease-out"
                                    />

                                    {/* Dark gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent mix-blend-multiply opacity-90 transition-opacity duration-500 group-hover:opacity-100" />

                                    {/* Top Left Tags */}
                                    <div className="absolute top-6 left-6 md:top-8 md:left-8 z-20 flex flex-col items-start gap-2 pointer-events-none">
                                        <div className="flex gap-2">
                                            {cat.tags.slice(0, 2).map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="text-[10px] md:text-[11px] tracking-[0.15em] uppercase font-medium text-white/90 bg-[#5c4a3d]/50 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/20 shadow-sm"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        {cat.tags.length > 2 && (
                                            <div className="flex">
                                                <span className="text-[10px] md:text-[11px] tracking-[0.15em] uppercase font-medium text-white/90 bg-[#5c4a3d]/50 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/20 shadow-sm">
                                                    {cat.tags[2]}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-7 md:p-8 z-10 pointer-events-none">
                                        <h3 className="text-2xl md:text-[28px] font-display tracking-wide text-white mb-2.5 leading-tight group-hover:text-antique-gold transition-colors duration-500 drop-shadow-lg">
                                            {cat.title}
                                        </h3>

                                        <p className="text-white/80 font-light text-[13px] md:text-sm leading-relaxed mb-5 line-clamp-2">
                                            {cat.promise}
                                        </p>

                                        <div className="mt-auto pointer-events-auto">
                                            {cat.isBespoke ? (
                                                <span className="inline-flex items-center gap-2 text-antique-gold hover:text-white text-[11px] tracking-[0.2em] uppercase font-semibold transition-colors duration-300">
                                                    <Sparkles className="w-3.5 h-3.5" />
                                                    Design My Trip
                                                </span>
                                            ) : (
                                                <span className="text-antique-gold hover:text-white flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase font-semibold transform translate-y-1 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                                                    Explore This Style{' '}
                                                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* ── Bottom Controls (Pagination & View All combined) ── */}
                <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6 px-4 md:px-0">
                    {/* Liquid Glass Pagination Dots */}
                    <div className="flex items-center gap-2.5 order-2 md:order-1 px-5 py-3 rounded-full bg-white/15 backdrop-blur-lg border border-white/30 shadow-[0_4px_24px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.3)]">
                        {Array.from({ length: totalSlides }).map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    const container = scrollRef.current;
                                    const firstChild = container?.children[0] as HTMLElement | undefined;
                                    const itemWidth = firstChild?.offsetWidth || 400;
                                    const gap = 32;
                                    container?.scrollTo({
                                        left: idx * (itemWidth + gap),
                                        behavior: 'smooth'
                                    });
                                }}
                                className={`h-2.5 rounded-full transition-all duration-500 ${idx === currentIndex
                                    ? 'w-8 bg-deep-emerald/50 shadow-[0_0_8px_rgba(4,57,39,0.15)]'
                                    : 'w-2.5 bg-deep-emerald/15 hover:bg-deep-emerald/30'
                                }`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>

                    {/* Liquid Glass View All Button */}
                    <Link
                        href="/packages"
                        className="order-1 md:order-2 inline-flex items-center justify-center gap-3 text-[11px] tracking-[0.2em] uppercase font-semibold text-deep-emerald/70 px-8 py-4 md:px-10 md:py-4 rounded-full w-full md:w-auto bg-gradient-to-br from-white/25 via-white/15 to-white/10 backdrop-blur-xl border border-white/35 shadow-[0_4px_24px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.4)] hover:from-white/35 hover:via-white/25 hover:to-white/15 hover:text-deep-emerald hover:shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.5)] hover:border-antique-gold/30 hover:scale-[1.02] transition-all duration-300"
                    >
                        View All Signature Journeys
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
