'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const ROTATING_HEADLINES = [
    'Across Sri Lanka',
    'Built on the Map',
    'Designed For You',
];

const ROTATION_INTERVAL = 6000; // 6 seconds
const FADE_DURATION = 200;      // 200ms crossfade

export default function HeroSection() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const isPaused = useRef(false);
    const prefersReducedMotion = useRef(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Detect prefers-reduced-motion
    useEffect(() => {
        const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
        prefersReducedMotion.current = mql.matches;

        const handler = (e: MediaQueryListEvent) => {
            prefersReducedMotion.current = e.matches;
            if (e.matches && intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
                setActiveIndex(0);
                setIsVisible(true);
            }
        };
        mql.addEventListener('change', handler);
        return () => mql.removeEventListener('change', handler);
    }, []);

    // Rotation timer
    useEffect(() => {
        if (prefersReducedMotion.current) return;

        intervalRef.current = setInterval(() => {
            if (isPaused.current) return;

            // Fade out
            setIsVisible(false);

            // After fade-out completes, swap text and fade in
            setTimeout(() => {
                setActiveIndex((prev) => (prev + 1) % ROTATING_HEADLINES.length);
                setIsVisible(true);
            }, FADE_DURATION);
        }, ROTATION_INTERVAL);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const handleMouseEnter = useCallback(() => { isPaused.current = true; }, []);
    const handleMouseLeave = useCallback(() => { isPaused.current = false; }, []);

    return (
        <section className="relative h-screen min-h-[600px] w-full bg-deep-emerald flex items-center justify-center overflow-hidden">
            {/* Background Video */}
            <div className="absolute inset-0 w-full h-full z-0 bg-[#0a1f15]">
                {/* Fallback Image */}
                <Image
                    src="/images/home/hero-poster.png"
                    alt="Bespoke Sri Lanka Travel"
                    fill
                    priority
                    quality={90}
                    sizes="100vw"
                    className="object-cover scale-[1.15] object-[center_30%]"
                />
                <video
                    src="/Hero-Section.mp4"
                    poster="/images/home/hero-poster.png"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover scale-[1.15] object-[center_30%] z-10 transition-opacity duration-1000"
                    style={{ animation: 'parallaxDrift 30s ease-in-out alternate infinite' }}
                />

                {/* 2-layer Premium Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a1f15]/90 via-transparent to-[#0a1f15]/70 z-10 mix-blend-multiply" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.6)_100%)] z-10" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center mt-12">
                <div className="animate-fade-in-up" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
                    <span className="inline-block tracking-[0.35em] text-[10px] md:text-xs text-antique-gold font-nav uppercase mb-6 drop-shadow-sm font-semibold">
                        Yatara Ceylon
                    </span>

                    {/* Headline with rotating gold line */}
                    <div
                        className="mb-8 max-w-4xl mx-auto animate-fade-in-up"
                        style={{ animationDelay: '200ms', animationFillMode: 'both' }}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        {/* Line 1 — Fixed */}
                        <h1 className="text-4xl md:text-6xl lg:text-[5.5rem] font-display text-white opacity-100 leading-[1.1] tracking-tight drop-shadow-lg">
                            Curated Journeys
                        </h1>

                        {/* Line 2 — Rotating gold line (fixed-height wrapper prevents layout shift) */}
                        <div
                            className="overflow-hidden h-[2.75rem] md:h-[4.5rem] lg:h-[6.5rem]"
                            aria-live="polite"
                            aria-atomic="true"
                        >
                            <span
                                className="inline-block text-4xl md:text-6xl lg:text-[5.5rem] font-display italic text-antique-gold font-light leading-[1.1] tracking-tight drop-shadow-lg"
                                style={{
                                    opacity: isVisible ? 1 : 0,
                                    transform: isVisible ? 'translateY(0)' : 'translateY(6px)',
                                    transition: `opacity ${FADE_DURATION}ms ease, transform ${FADE_DURATION}ms ease`,
                                }}
                            >
                                {ROTATING_HEADLINES[activeIndex]}
                            </span>
                        </div>
                    </div>

                    <p className="text-white/80 font-nav font-light text-xs md:text-sm tracking-[0.2em] max-w-3xl mx-auto mb-10 animate-fade-in-up uppercase drop-shadow-md" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
                        Bespoke itineraries crafted by local specialists.
                    </p>

                    {/* Subtle glass panel behind the CTA area */}
                    <div className="flex flex-col items-center gap-6 animate-fade-in-up max-w-xl mx-auto p-6 md:p-8 rounded-3xl bg-[#0a1f15]/20 backdrop-blur-md border border-white/[0.05]" style={{ animationDelay: '400ms', animationFillMode: 'both' }}>
                        <div className="flex flex-col items-center gap-4">
                            <Link href="/build-tour">
                                <Button
                                    className="relative h-[56px] md:h-14 px-12 liquid-glass-button bg-white/5 backdrop-blur-sm transition-all duration-500 rounded-none font-nav font-semibold tracking-[0.2em] text-xs uppercase group focus-visible:ring-2 focus-visible:ring-antique-gold focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1f15] hover:bg-white/10"
                                >
                                    <span className="relative z-10 flex items-center drop-shadow-md text-white group-hover:text-white transition-colors">
                                        Build Your Tour
                                        <ArrowRight className="w-4 h-4 ml-3 transition-transform duration-500 group-hover:translate-x-2" />
                                    </span>
                                </Button>
                            </Link>

                            <p className="text-[9px] text-white/50 font-nav tracking-[0.15em] uppercase">
                                Get a custom proposal in 24 hours
                            </p>
                        </div>

                        {/* Trust Strip */}
                        <div className="flex items-center gap-4 md:gap-6 text-[9px] md:text-[10px] text-white/70 tracking-[0.2em] font-nav uppercase px-6 py-2 rounded-full border border-white/[0.08] bg-black/20 mt-2" style={{ animationDelay: '600ms', animationFillMode: 'both' }}>
                            <span>500+ Itineraries</span>
                            <span className="w-1 h-1 rounded-full bg-antique-gold/40" />
                            <span>4.9/5 Rating</span>
                            <span className="w-1 h-1 rounded-full bg-antique-gold/40" />
                            <span>Local Specialists</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
