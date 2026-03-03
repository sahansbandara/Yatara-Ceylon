'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useRef, useState, useEffect, useCallback } from 'react';
import { tourCategories } from '@/data/tourCategories';

const themeChips = ['Honeymoon', 'Family', 'Wildlife', 'Ayurveda', 'Heritage', 'Beaches'];

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
        const gap = 24;
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
        const itemWidth = firstChild?.offsetWidth || (window.innerWidth < 768 ? 300 : 420);
        const gap = 24;

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
        if (isHovered) return; // Pause auto-scroll on hover

        const timer = setInterval(() => {
            if (scrollRef.current) {
                // If we are at the end, scroll back to start
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

                {/* ── Controls Row (Progress + Navigation) ── */}
                <div className="flex items-center justify-between mb-8">
                    {/* Progress indicator */}
                    <span className="text-[13px] tracking-[0.1em] text-gray-400 font-medium tabular-nums">
                        {String(currentIndex + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
                    </span>

                    {/* Nude Circle Navigation Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        <button
                            onClick={() => scrollTo('left')}
                            className="w-11 h-11 rounded-full border border-deep-emerald/15 flex items-center justify-center hover:border-antique-gold/50 hover:bg-antique-gold/5 transition-all duration-300"
                            aria-label="Previous"
                        >
                            <ChevronLeft className="w-5 h-5 text-deep-emerald" />
                        </button>
                        <button
                            onClick={() => scrollTo('right')}
                            className="w-11 h-11 rounded-full border border-deep-emerald/15 flex items-center justify-center hover:border-antique-gold/50 hover:bg-antique-gold/5 transition-all duration-300"
                            aria-label="Next"
                        >
                            <ChevronRight className="w-5 h-5 text-deep-emerald" />
                        </button>
                    </div>
                </div>

                {/* Carousel Container — full-bleed for maximum card visibility */}
                <div className="relative -mx-6 md:-mx-12">

                    {/* ── Scroll-snap Horizontal Rail ── */}
                    <div
                        ref={scrollRef}
                        className="flex gap-5 md:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory px-4 md:px-6 scrollbar-none"
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
                                className="group block flex-shrink-0 snap-start"
                            >
                                <div
                                    className="relative rounded-[24px] overflow-hidden cursor-pointer flex-shrink-0 transition-all duration-[600ms] group w-[300px] md:w-[380px] lg:w-[420px] xl:w-[440px] h-[480px] md:h-[580px]"
                                >
                                    {/* Image */}
                                    <Image
                                        src={cat.image}
                                        alt={cat.title}
                                        fill
                                        sizes="(max-width: 768px) 300px, (max-width: 1024px) 380px, 440px"
                                        className="object-cover transform group-hover:scale-[1.02] transition-transform duration-1000 ease-out"
                                    />

                                    {/* Dark gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent mix-blend-multiply opacity-90 transition-opacity duration-500 group-hover:opacity-100" />

                                    {/* Top Left Tags */}
                                    <div className="absolute top-5 left-5 md:top-6 md:left-6 z-20 flex flex-col items-start gap-2 pointer-events-none">
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
                                    <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-6 md:p-7 z-10 pointer-events-none">
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
                <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Pagination Dots — Liquid Glass */}
                    <div className="flex items-center gap-2.5 order-2 md:order-1 bg-white/10 backdrop-blur-xl border border-white/30 shadow-[0_4px_24px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.2)] rounded-full px-4 py-2.5">
                        {Array.from({ length: totalSlides }).map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    const container = scrollRef.current;
                                    const firstChild = container?.children[0] as HTMLElement | undefined;
                                    const itemWidth = firstChild?.offsetWidth || 400;
                                    const gap = 24;
                                    container?.scrollTo({
                                        left: idx * (itemWidth + gap),
                                        behavior: 'smooth'
                                    });
                                }}
                                className={`rounded-full transition-all duration-500 ${idx === currentIndex
                                    ? 'w-8 h-3 bg-white/50 border border-white/60 shadow-[0_0_8px_rgba(255,255,255,0.3),inset_0_1px_0_rgba(255,255,255,0.4)]'
                                    : 'w-3 h-3 bg-white/15 border border-white/25 hover:bg-white/30 hover:border-white/40'
                                    }`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>

                    {/* View All Button — Liquid Glass */}
                    <Link
                        href="/packages"
                        className="order-1 md:order-2 inline-flex items-center justify-center gap-3 text-[11px] tracking-[0.2em] uppercase font-semibold text-deep-emerald bg-white/15 backdrop-blur-xl border-2 border-white/40 shadow-[0_4px_24px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.3),0_0_0_1px_rgba(255,255,255,0.1)] px-8 py-4 md:px-10 md:py-4 rounded-full hover:bg-white/25 hover:border-white/60 hover:text-deep-emerald hover:shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.4)] hover:scale-[1.02] transition-all duration-300 w-full md:w-auto"
                    >
                        View All Signature Journeys
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
