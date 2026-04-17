'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const categories = [
    {
        title: 'HERITAGE TOURS',
        image: '/images/home/signature-heritage.png',
        href: '/packages?tag=heritage',
    },
    {
        title: 'WILDLIFE SAFARI',
        image: '/images/home/tour-wildlife.png',
        href: '/packages?tag=wildlife',
    },
    {
        title: 'HONEYMOON TOURS',
        image: '/images/home/tour-honeymoon.png',
        href: '/packages?tag=honeymoon',
    },
    {
        title: 'AYURVEDIC RETREATS',
        image: '/images/home/tour-ayurvedic.png',
        href: '/packages?tag=wellness',
    },
    {
        title: 'HILL COUNTRY',
        image: '/images/home/curated-hillcountry.png',
        href: '/packages?tag=hillcountry',
    },
    {
        title: 'COASTAL ESCAPES',
        image: '/images/home/curated-southcoast.png',
        href: '/packages?tag=beach',
    },
];

export default function TourCategories() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const animRef = useRef<number | null>(null);

    // Auto-scroll
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        let speed = 0.5;

        const tick = () => {
            if (!el) return;
            el.scrollLeft += speed;
            // Loop: reset when halfway (since items are doubled)
            if (el.scrollLeft >= el.scrollWidth / 2) {
                el.scrollLeft = 0;
            }
            animRef.current = requestAnimationFrame(tick);
        };

        animRef.current = requestAnimationFrame(tick);

        // Pause on hover
        const pause = () => { speed = 0; };
        const resume = () => { speed = 0.5; };
        el.addEventListener('mouseenter', pause);
        el.addEventListener('mouseleave', resume);

        return () => {
            if (animRef.current) cancelAnimationFrame(animRef.current);
            el.removeEventListener('mouseenter', pause);
            el.removeEventListener('mouseleave', resume);
        };
    }, []);

    const scroll = (dir: number) => {
        scrollRef.current?.scrollBy({ left: dir * 340, behavior: 'smooth' });
    };

    return (
        <section className="py-28 bg-off-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
                    <div>
                        <span className="inline-block mb-3 text-xs tracking-[0.3em] font-medium text-antique-gold uppercase">
                            Explore by Interest
                        </span>
                        <h2 className="text-4xl md:text-5xl font-display text-deep-emerald leading-tight">
                            Tour<br />Categories
                        </h2>
                    </div>
                    <div className="flex items-center gap-6">
                        <p className="text-gray-500 font-light max-w-sm text-[15px] leading-relaxed hidden md:block">
                            From ancient heritage trails to serene wellness retreats, discover your perfect Sri Lankan journey.
                        </p>
                        <Link
                            href="/packages"
                            className="flex items-center gap-3 text-deep-emerald hover:text-antique-gold transition-colors group shrink-0"
                        >
                            <div className="w-10 h-10 rounded-full border-2 border-deep-emerald group-hover:border-antique-gold flex items-center justify-center transition-colors">
                                <Plus className="w-5 h-5" />
                            </div>
                            <span className="text-xs tracking-[0.2em] font-semibold uppercase">EXPLORE</span>
                        </Link>
                    </div>
                </div>

                {/* Navigation Arrows */}
                <div className="flex gap-3 mb-6 justify-end">
                    <button
                        onClick={() => scroll(-1)}
                        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:text-deep-emerald hover:border-deep-emerald transition-all"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => scroll(1)}
                        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:text-deep-emerald hover:border-deep-emerald transition-all"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Scrolling Cards */}
            <div
                ref={scrollRef}
                className="flex gap-5 overflow-x-auto scrollbar-none px-4 md:px-8 pb-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {[...categories, ...categories].map((cat, idx) => (
                    <Link
                        key={idx}
                        href={cat.href}
                        className="flex-shrink-0 w-[280px] md:w-[320px] group relative"
                    >
                        <div className="relative rounded-2xl overflow-hidden aspect-[3/4] shadow-lg">
                            <Image
                                src={cat.image}
                                alt={cat.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-deep-emerald/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                <div className="flex items-center gap-3 text-white">
                                    <Plus className="w-5 h-5" />
                                    <span className="text-xs tracking-[0.2em] font-semibold uppercase">EXPLORE</span>
                                </div>
                            </div>

                            {/* Title at bottom */}
                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                <h3 className="text-white font-display text-lg tracking-wide">
                                    {cat.title}
                                </h3>
                                <div className="h-0.5 w-12 bg-antique-gold mt-2 group-hover:w-20 transition-all duration-500" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
