'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useRef, useState, useEffect, useCallback } from 'react';
import { tourCategories } from '@/data/tourCategories';

const themeChips = ['Honeymoon', 'Family', 'Wildlife', 'Ayurveda', 'Heritage', 'Beaches'];

export default function TourCategoriesCarousel() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [activeChip, setActiveChip] = useState<string | null>(null);

    const filteredCategories = activeChip
        ? tourCategories.filter(
              (c) =>
                  c.isBespoke ||
                  c.title.toLowerCase().includes(activeChip.toLowerCase()) ||
                  c.tags.some((t) => t.toLowerCase().includes(activeChip.toLowerCase()))
          )
        : tourCategories;

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

    const scrollTo = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return;
        const container = scrollRef.current;
        const firstChild = container.children[0] as HTMLElement | undefined;
        const itemWidth = firstChild?.offsetWidth || 400;
        const gap = 32;
        container.scrollBy({
            left: direction === 'left' ? -(itemWidth + gap) : itemWidth + gap,
            behavior: 'smooth',
        });
    };

    return (
        <section className="py-28 md:py-36 bg-off-white text-deep-emerald relative overflow-hidden">
            {/* Subtle background accents */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-antique-gold/[0.03] rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-deep-emerald/[0.02] rounded-full blur-3xl" />

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                {/* ── Header ── */}
                <div className="mb-8 md:mb-12">
                    <span className="inline-block mb-5 text-[11px] tracking-[0.35em] font-medium text-antique-gold uppercase">
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

                {/* ── Theme Chips ── */}
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
                            onClick={() =>
                                setActiveChip(activeChip === chip ? null : chip)
                            }
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

                {/* ── Controls row: counter + arrows ── */}
                <div className="flex items-center justify-between mb-8">
                    <span className="text-[13px] tracking-[0.1em] text-gray-400 font-medium tabular-nums">
                        {String(currentIndex + 1).padStart(2, '0')} /{' '}
                        {String(filteredCategories.length).padStart(2, '0')}
                    </span>

                    <div className="hidden md:flex items-center gap-3">
                        <button
                            onClick={() => scrollTo('left')}
                            className="w-11 h-11 rounded-full border border-deep-emerald/15 flex items-center justify-center hover:border-antique-gold/50 hover:bg-antique-gold/5 transition-all duration-300"
                            aria-label="Previous"
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                className="text-deep-emerald"
                            >
                                <path
                                    d="M10 12L6 8L10 4"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                        <button
                            onClick={() => scrollTo('right')}
                            className="w-11 h-11 rounded-full border border-deep-emerald/15 flex items-center justify-center hover:border-antique-gold/50 hover:bg-antique-gold/5 transition-all duration-300"
                            aria-label="Next"
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                className="text-deep-emerald"
                            >
                                <path
                                    d="M6 4L10 8L6 12"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* ── Scroll-snap Horizontal Rail ── */}
                <div
                    ref={scrollRef}
                    className="flex gap-8 overflow-x-auto pb-6 snap-x snap-mandatory -mx-6 px-6"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {filteredCategories.map((cat) => (
                        <Link
                            key={cat.title}
                            href={cat.href}
                            className="group block flex-shrink-0 snap-center"
                        >
                            <article
                                className={`relative overflow-hidden rounded-2xl ${
                                    cat.isBespoke
                                        ? 'w-[340px] md:w-[420px] h-[540px] md:h-[580px]'
                                        : 'w-[340px] md:w-[400px] h-[540px] md:h-[580px]'
                                }`}
                            >
                                {/* Image */}
                                <Image
                                    src={cat.image}
                                    alt={cat.title}
                                    fill
                                    sizes="(max-width: 768px) 340px, 420px"
                                    className="object-cover transform group-hover:scale-[1.02] transition-transform duration-1000 ease-out"
                                />

                                {/* Dark gradient overlay — bottom 55% for WCAG AA readability */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                                {/* Content */}
                                <div className="absolute inset-0 flex flex-col justify-end p-7 md:p-8 z-10">
                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 mb-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                        {cat.tags.slice(0, 3).map((tag) => (
                                            <span
                                                key={tag}
                                                className="text-[10px] tracking-[0.2em] uppercase font-medium text-white/70 bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Title — Title Case, NOT ALL CAPS */}
                                    <h3 className="text-2xl md:text-[28px] font-display tracking-wide text-white mb-2.5 leading-tight group-hover:text-antique-gold transition-colors duration-500 drop-shadow-lg">
                                        {cat.title}
                                    </h3>

                                    {/* One-line promise */}
                                    <p className="text-white/75 font-light text-[13px] md:text-sm leading-relaxed mb-5 line-clamp-2">
                                        {cat.promise}
                                    </p>

                                    {/* CTA */}
                                    {cat.isBespoke ? (
                                        <span className="inline-flex items-center gap-2 bg-antique-gold text-deep-emerald px-5 py-2.5 rounded-full text-[11px] tracking-[0.2em] uppercase font-semibold hover:bg-white transition-colors duration-300 w-max">
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
                            </article>
                        </Link>
                    ))}
                </div>

                {/* ── Bottom link ── */}
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
