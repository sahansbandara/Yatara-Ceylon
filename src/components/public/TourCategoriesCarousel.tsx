'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState, useEffect, useCallback } from 'react';
import { tourCategories } from '@/data/tourCategories';

export default function TourCategoriesCarousel() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [centerIndex, setCenterIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const filteredCategories = tourCategories;
    const totalSlides = filteredCategories.length;

    // Repeat items multiple times to create a robust infinite scroll buffer
    const NUM_SETS = 15;
    const displayCategories = Array(NUM_SETS).fill(filteredCategories).flat();
    const MID_SET = Math.floor(NUM_SETS / 2);

    // Determine which card is closest to the center of the viewport
    const updateCenterCard = useCallback(() => {
        if (!scrollRef.current) return;
        const container = scrollRef.current;
        const containerRect = container.getBoundingClientRect();
        const containerCenter = containerRect.left + containerRect.width / 2;

        let closestIdx = 0;
        let closestDist = Infinity;

        Array.from(container.children).forEach((child, idx) => {
            const childRect = child.getBoundingClientRect();
            const childCenter = childRect.left + childRect.width / 2;
            const dist = Math.abs(containerCenter - childCenter);
            if (dist < closestDist) {
                closestDist = dist;
                closestIdx = idx;
            }
        });

        setCenterIndex(closestIdx);
        setCurrentIndex(closestIdx % totalSlides); // map actual index back to dot

        // Loop back safely if the user swipes manually too close to edges
        const firstChild = container.children[0] as HTMLElement | undefined;
        const secondChild = container.children[1] as HTMLElement | undefined;
        if (firstChild && secondChild) {
            const itemOffset = secondChild.offsetLeft - firstChild.offsetLeft;

            // If nearing the end of our buffer on the right
            if (container.scrollLeft > itemOffset * (totalSlides * (NUM_SETS - 2))) {
                container.scrollLeft = itemOffset * (totalSlides * MID_SET) + (container.scrollLeft % (itemOffset * totalSlides));
            }
            // If nearing the start of our buffer on the left
            else if (container.scrollLeft < itemOffset * (totalSlides * 2)) {
                container.scrollLeft = itemOffset * (totalSlides * MID_SET) + (container.scrollLeft % (itemOffset * totalSlides));
            }
        }

    }, [totalSlides, NUM_SETS, MID_SET]);

    const initRef = useRef(false);
    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        if (!initRef.current) {
            setTimeout(() => {
                const firstChild = container.children[0] as HTMLElement | undefined;
                const secondChild = container.children[1] as HTMLElement | undefined;
                if (!firstChild) return;

                const itemOffset = secondChild ? secondChild.offsetLeft - firstChild.offsetLeft : (firstChild.offsetWidth + 32);

                // Jump to the start of the middle set
                const scrollPos = itemOffset * (totalSlides * MID_SET);
                container.scrollLeft = scrollPos;

                initRef.current = true;
            }, 100);
        }

        container.addEventListener('scroll', updateCenterCard, { passive: true });
        // Run once on mount to set initial center
        updateCenterCard();
        return () => container.removeEventListener('scroll', updateCenterCard);
    }, [updateCenterCard, totalSlides, MID_SET]);

    const scrollTo = (direction: 'left' | 'right' | 'start') => {
        if (!scrollRef.current) return;
        const container = scrollRef.current;
        const firstChild = container.children[0] as HTMLElement | undefined;
        const secondChild = container.children[1] as HTMLElement | undefined;
        const itemOffset = secondChild ? secondChild.offsetLeft - (firstChild?.offsetLeft || 0) : (firstChild?.offsetWidth || 400) + 32;

        if (direction === 'start') {
            container.scrollLeft = itemOffset * (totalSlides * MID_SET);
            return;
        }

        container.scrollBy({
            left: direction === 'left' ? -itemOffset : itemOffset,
            behavior: 'smooth',
        });
    };

    // Auto-scroll loop
    useEffect(() => {
        if (isHovered) return;

        const timer = setInterval(() => {
            if (scrollRef.current) {
                const container = scrollRef.current;
                // If we've reached the very end of the duplicated scroll area, snap back to the start invisibly
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

                {/* Carousel Container (Dark Green Background Zone) */}
                <div className="relative group/carousel -mx-6 md:-mx-12 pt-8">

                    {/* Background Highlight wrapping the package row full-width */}
                    <div className="absolute top-0 bottom-0 left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] bg-[#D1E5DB]/70 -z-10 pointer-events-none hidden md:block" />

                    {/* Left Navigation - Nude Glass Circle */}
                    <button
                        onClick={() => scrollTo('left')}
                        className="absolute left-2 md:left-5 lg:left-7 top-[40%] md:top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-deep-emerald/60 hover:bg-white/45 hover:text-deep-emerald shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-300 hover:scale-110"
                        aria-label="Previous"
                    >
                        <ChevronLeft className="w-5 h-5 stroke-[2]" />
                    </button>

                    {/* Right Navigation - Nude Glass Circle */}
                    <button
                        onClick={() => scrollTo('right')}
                        className="absolute right-2 md:right-5 lg:right-7 top-[40%] md:top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-deep-emerald/60 hover:bg-white/45 hover:text-deep-emerald shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-300 hover:scale-110"
                        aria-label="Next"
                    >
                        <ChevronRight className="w-5 h-5 stroke-[2]" />
                    </button>

                    {/* ── Scroll-snap Horizontal Rail ── */}
                    <div
                        ref={scrollRef}
                        className="flex gap-6 md:gap-8 overflow-x-auto pt-10 pb-6 snap-x snap-mandatory px-[max(1.5rem,calc(50vw-140px))] md:px-[max(3rem,calc(50vw-165px))] lg:px-[max(3rem,calc(50vw-185px))] scrollbar-none relative z-10"
                        style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none'
                        }}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onTouchStart={() => setIsHovered(true)}
                        onTouchEnd={() => setIsHovered(false)}
                    >
                        {displayCategories.map((cat, idx) => {
                            const topTags = cat.tags.filter((t: string) => !t.toLowerCase().includes('night')).slice(0, 2);
                            const durationTag = cat.tags.find((t: string) => t.toLowerCase().includes('night'));

                            return (
                                <div
                                    key={`${idx}-${cat.title}`}
                                    className={`relative rounded-[32px] overflow-hidden cursor-pointer flex-shrink-0 snap-center group w-[300px] md:w-[380px] lg:w-[430px] h-[420px] md:h-[520px] lg:h-[600px]`}
                                    style={{
                                        transform: idx === centerIndex ? 'scale(1.08)' : 'scale(0.9)',
                                        opacity: 1,
                                        transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                                    }}
                                >
                                    {/* Image */}
                                    <Image
                                        src={cat.image}
                                        alt={cat.title}
                                        fill
                                        sizes="(max-width: 768px) 300px, (max-width: 1024px) 400px, 500px"
                                        className="object-cover transform group-hover:scale-[1.02] transition-transform duration-1000 ease-out"
                                    />

                                    {/* Dark gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent mix-blend-multiply opacity-90 transition-opacity duration-500 group-hover:opacity-100" />

                                    {/* Top Left Tags */}
                                    <div className="absolute top-6 left-6 md:top-8 md:left-8 z-20 flex flex-col items-start gap-2 pointer-events-none">
                                        <div className="flex flex-wrap gap-2.5">
                                            {topTags.map((tag: string) => (
                                                <span
                                                    key={tag}
                                                    className="text-[10px] md:text-[11px] tracking-[0.15em] uppercase font-medium text-white bg-white/20 backdrop-blur-md border border-white/30 px-[16px] py-[6px] rounded-full shadow-sm"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-7 md:p-8 z-10 pointer-events-none">
                                        {durationTag && (
                                            <div className="mb-4">
                                                <span className="inline-block text-[10px] md:text-[11px] tracking-[0.15em] uppercase font-medium text-white bg-white/20 backdrop-blur-md border border-white/30 px-[16px] py-[6px] rounded-full shadow-sm">
                                                    {durationTag}
                                                </span>
                                            </div>
                                        )}

                                        <h3 className="text-2xl md:text-[28px] font-display tracking-wide text-white mb-2.5 leading-tight group-hover:text-antique-gold transition-colors duration-500 drop-shadow-lg">
                                            {cat.title}
                                        </h3>

                                        <p className="text-white/80 font-light text-[13px] md:text-sm leading-relaxed mb-5 line-clamp-2">
                                            {cat.promise}
                                        </p>

                                        <div className="mt-auto pointer-events-auto">
                                            {cat.isBespoke ? (
                                                <Link href={cat.href}>
                                                    <span className="inline-flex items-center gap-2 text-antique-gold hover:text-white text-[11px] tracking-[0.2em] uppercase font-semibold transition-colors duration-300 cursor-pointer">
                                                        <Sparkles className="w-3.5 h-3.5" />
                                                        Design My Trip
                                                    </span>
                                                </Link>
                                            ) : (
                                                <Link href={cat.href}>
                                                    <span className="text-antique-gold hover:text-white flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase font-semibold transform translate-y-1 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 cursor-pointer">
                                                        Explore This Style{' '}
                                                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                                                    </span>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Naked Glassy Pagination Dots Inside Dark Green Overlay */}
                    <div className="flex justify-center items-center gap-3 relative z-20 pb-8 mt-2">
                        {Array.from({ length: totalSlides }).map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    const container = scrollRef.current;
                                    const firstChild = container?.children[0] as HTMLElement | undefined;
                                    const secondChild = container?.children[1] as HTMLElement | undefined;
                                    if (!firstChild) return;

                                    const itemOffset = secondChild ? secondChild.offsetLeft - firstChild.offsetLeft : (firstChild.offsetWidth + 32);

                                    const currentSetBaseOffset = Math.floor(centerIndex / totalSlides) * totalSlides;
                                    let targetIdx = currentSetBaseOffset + idx;
                                    if (targetIdx >= displayCategories.length) targetIdx = idx;

                                    container?.scrollTo({
                                        left: targetIdx * itemOffset,
                                        behavior: 'smooth'
                                    });
                                }}
                                className={`rounded-full transition-all duration-500 shadow-sm ${idx === currentIndex
                                    ? 'h-2.5 w-8 bg-white/40 backdrop-blur-md border border-white/60' // active glass
                                    : 'h-2.5 w-2.5 bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/50' // inactive clear
                                    }`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* ── Bottom Controls (View All Button Separate) ── */}
                <div className="mt-12 flex justify-center px-4 md:px-0 relative z-20">
                    <Link
                        href="/packages"
                        className="inline-flex items-center justify-center gap-3 text-[11px] tracking-[0.2em] uppercase font-semibold text-deep-emerald/70 px-8 py-4 md:px-10 md:py-4 rounded-full w-full md:w-auto bg-gradient-to-br from-white/25 via-white/15 to-white/10 backdrop-blur-xl border border-white/35 shadow-[0_4px_24px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.4)] hover:from-white/35 hover:via-white/25 hover:to-white/15 hover:text-deep-emerald hover:shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.5)] hover:border-antique-gold/30 hover:scale-[1.02] transition-all duration-300"
                    >
                        View All Signature Journeys
                        <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
