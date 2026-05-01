'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { tourCategories } from '@/data/tourCategories';
import { MouseEvent, useRef } from 'react';

// Soft, premium synthetic click sound
const playHoverSound = () => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Very high but soft attack ping (bubbles/glass sound)
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
        // Ignore Audio context restrictions (expected on strict browsers before interaction)
    }
};

function TourCard({ cat, idx }: { cat: any; idx: number }) {
    const cardRef = useRef<HTMLAnchorElement>(null);

    const handleMouseMove = (e: MouseEvent<HTMLAnchorElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        cardRef.current.style.setProperty('--mouse-x', `${x}px`);
        cardRef.current.style.setProperty('--mouse-y', `${y}px`);
    };

    const isBespoke = cat.isBespoke;
    const topTags = cat.tags.filter((t: string) => !t.toLowerCase().includes('night')).slice(0, 2);
    const durationTag = cat.tags.find((t: string) => t.toLowerCase().includes('night'));

    return (
        <Link
            href={cat.href}
            ref={cardRef}
            onMouseEnter={playHoverSound}
            onMouseMove={handleMouseMove}
            className={`relative rounded-2xl overflow-hidden group w-full block shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-700 ease-expo will-change-transform
                ${isBespoke ? 'md:col-span-2 md:row-span-2 bg-black' : 'bg-stone-900'}
            `}
            style={{
                // Default center values
                '--mouse-x': '150px',
                '--mouse-y': '150px',
            } as React.CSSProperties}
        >
            {/* Image */}
            <Image
                src={cat.image}
                alt={cat.title}
                fill
                sizes={
                    isBespoke
                    ? "(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 800px"
                    : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 400px"
                }
                className="object-cover transform group-hover:scale-[1.05] transition-transform duration-1.2s ease-expo origin-center"
            />

            {/* Base Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t mix-blend-multiply opacity-80 group-hover:opacity-100 transition-opacity duration-700 ${
                isBespoke 
                ? 'from-[#051F10]/95 via-[#051F10]/30 to-transparent'
                : 'from-black/90 via-black/20 to-transparent'
            }`} />

            {/* Liquid Glass Mouse-Follow Overlay */}
            <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-overlay"
                style={{
                    background: `radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.3), transparent 50%)`
                }}
            />

            {/* Inner Border glow on hover */}
            <div className="absolute inset-0 rounded-3xl border border-white/0 group-hover:border-white/20 transition-colors duration-700 pointer-events-none" />

            {/* Top Left Tags */}
            <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20 flex flex-col items-start gap-2 pointer-events-none transform -translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <div className="flex flex-wrap gap-2">
                    {topTags.map((tag: string) => (
                        <span
                            key={tag}
                            className={`text-[9px] md:text-[10px] tracking-[0.15em] uppercase font-medium text-white/90 bg-black/30 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full shadow-lg transition-colors group-hover:border-white/30 group-hover:bg-white/10 
                            ${isBespoke ? 'group-hover:text-antique-gold group-hover:border-antique-gold/40 cursor-pointer' : ''}`}
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Top Right Duration Tag */}
            {durationTag && (
                <div className="absolute top-4 right-4 md:top-6 md:right-6 z-20 pointer-events-none transform -translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                    <span className="inline-block text-[9px] md:text-[10px] tracking-[0.15em] uppercase font-medium text-antique-gold bg-white/10 backdrop-blur-md border border-antique-gold/40 px-3 py-1.5 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.2)] transition-colors group-hover:border-antique-gold group-hover:bg-white/20">
                        {durationTag}
                    </span>
                </div>
            )}

            {/* Background Glass Plate that slides up (Strictly 75% Height or 100% for Bespoke) */}
            <div className={`absolute inset-x-0 bottom-0 z-10 pointer-events-none transform translate-y-6 group-hover:translate-y-0 transition-all duration-700 ease-out ${
                isBespoke ? 'h-full' : 'h-[75%]'
            }`}>
                <div className="absolute inset-0 bg-white/10 backdrop-blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-t-2xl border-t border-white/20 mix-blend-hard-light" 
                     style={{ maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)' }} />
            </div>

            {/* Main Text Content */}
            <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-6 md:p-8 z-20 pointer-events-none transform translate-y-6 group-hover:translate-y-0 transition-all duration-700 ease-out">

                <h3 className={`font-display tracking-wide text-white leading-tight drop-shadow-lg transition-colors duration-500 ${
                    isBespoke ? 'text-3xl md:text-5xl lg:text-6xl mb-3' : 'text-2xl md:text-3xl mb-2'
                }`}>
                    {cat.title}
                </h3>

                <p className={`text-white/70 group-hover:text-white/95 font-light leading-relaxed mb-4 transition-colors duration-500 ${
                    isBespoke 
                    ? 'text-sm md:text-base max-w-lg' 
                    : 'text-xs md:text-sm line-clamp-2'
                }`}>
                    {cat.promise}
                </p>

                <div className="mt-auto pointer-events-auto overflow-hidden pt-2">
                    <div className="transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-150">
                        {isBespoke ? (
                            <span className="inline-flex items-center gap-2 text-[9px] md:text-[10px] tracking-[0.2em] uppercase font-bold bg-white/10 hover:bg-white text-white hover:text-deep-emerald border border-white/20 px-5 py-2.5 rounded-full backdrop-blur-md transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                                <Sparkles className="w-3.5 h-3.5" />
                                Design My Trip
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-2 text-[9px] md:text-[10px] tracking-[0.2em] uppercase font-bold bg-white/10 hover:bg-white text-white hover:text-deep-emerald border border-white/20 px-5 py-2.5 rounded-full backdrop-blur-md transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.1)] group/btn">
                                Explore Journey
                                <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default function TourCategoriesCarousel() {
    const displayCategories = tourCategories;

    return (
        <section className="py-10 md:py-12 bg-[#E3EFE9] text-deep-emerald relative overflow-hidden">
            {/* Background Pattern Overlay */}
            <div
                className="absolute inset-0 z-0 opacity-20 pointer-events-none mix-blend-multiply"
                style={{
                    backgroundImage: "url('/images/home/curated-bg-pattern.webp')",
                    backgroundSize: '400px',
                    backgroundPosition: 'top left',
                    backgroundRepeat: 'repeat'
                }}
            />

            {/* Subtle background accents */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-antique-gold/[0.03] rounded-full blur-3xl transition-transform duration-10s hover:scale-110" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-deep-emerald/[0.02] rounded-full blur-3xl transition-transform duration-10s hover:scale-110" />

            <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 relative z-10 w-full flex flex-col items-center">
                {/* ── Header ── */}
                <div className="mb-8 md:mb-12 w-full text-center md:text-left flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                    <div>
                        <span className="inline-block mb-2 text-[9px] md:text-[10px] tracking-[0.35em] font-medium text-antique-gold uppercase delay-150">
                            Handpicked Itineraries
                        </span>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-display text-deep-emerald leading-[1.1]">
                            Signature{' '}
                            <span className="italic font-light">Experiences</span>
                        </h2>
                    </div>
                    
                    <p className="text-gray-500 font-light text-xs md:text-sm max-w-sm md:text-right leading-relaxed mb-1">
                        Designed around pace, privacy, and purpose. Choose your style. We tailor the rest.
                    </p>
                </div>

                {/* ── Grid Container ── */}
                {/* We use 4 rows, 3 columns. */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[280px] sm:auto-rows-[220px] lg:auto-rows-[240px] gap-3 md:gap-5 lg:gap-6 w-full mx-auto">
                    {displayCategories.map((cat, idx) => (
                        <TourCard key={`${idx}-${cat.title}`} cat={cat} idx={idx} />
                    ))}
                </div>

                {/* ── Bottom Controls ── */}
                <div className="mt-6 flex justify-center w-full relative z-20">
                    <Link
                        href="/packages"
                        className="inline-flex items-center justify-center gap-3 text-[10px] md:text-[11px] tracking-[0.2em] uppercase font-semibold text-deep-emerald hover:text-white px-8 py-3.5 md:px-10 md:py-4 rounded-full w-auto bg-white/30 backdrop-blur-md border border-deep-emerald/10 hover:bg-deep-emerald shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition-all duration-500 ease-out"
                    >
                        View All Signature Journeys
                        <ArrowRight className="h-4 w-4 stroke-[2]" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
