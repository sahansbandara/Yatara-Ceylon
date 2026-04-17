'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, Users, Compass } from 'lucide-react';

const ROTATING_HEADLINES = [
    'Across Sri Lanka',
    'Built on the Map',
    'Designed For You',
];

const ROTATION_INTERVAL = 6000;
const FADE_DURATION = 200;

const TRAVEL_MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

const TRAVEL_STYLES = [
    { value: 'culture', label: 'Culture & Heritage' },
    { value: 'wildlife', label: 'Wildlife & Safari' },
    { value: 'beach', label: 'Beach & Coast' },
    { value: 'tea-country', label: 'Tea Country' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'wellness', label: 'Wellness & Spa' },
];

export default function HeroSection() {
    const router = useRouter();
    const [activeIndex, setActiveIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const isPaused = useRef(false);
    const prefersReducedMotion = useRef(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Trip builder state
    const [travelMonth, setTravelMonth] = useState('');
    const [travelers, setTravelers] = useState('');
    const [style, setStyle] = useState('');

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
            setIsVisible(false);
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

    const handleDesignJourney = () => {
        const params = new URLSearchParams();
        if (travelMonth) params.set('month', travelMonth);
        if (travelers) params.set('pax', travelers);
        if (style) params.set('style', style);
        const query = params.toString();
        router.push(`/build-tour${query ? `?${query}` : ''}`);
    };

    return (
        <section className="relative h-screen min-h-[600px] w-full bg-deep-emerald flex items-center justify-center overflow-hidden">
            {/* Background Video */}
            <div className="absolute inset-0 w-full h-full z-0 bg-[#0a1f15]">
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
                    src="https://raw.githubusercontent.com/sahansbandara/Yatara-Ceylon/main/public/Hero-Section.mp4"
                    poster="/images/home/hero-poster.png"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover scale-[1.15] object-[center_30%] z-10 transition-opacity duration-1000"
                    style={{ animation: 'parallaxDrift 30s ease-in-out alternate infinite' }}
                />

                {/* Premium Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a1f15]/90 via-transparent to-[#0a1f15]/70 z-10 mix-blend-multiply" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.6)_100%)] z-10" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center mt-8">
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
                        <h1 className="text-4xl md:text-6xl lg:text-[5.5rem] font-display text-white opacity-100 leading-[1.1] tracking-tight drop-shadow-lg">
                            Curated Journeys
                        </h1>

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

                    <p className="text-white/80 font-nav font-light text-xs md:text-sm tracking-[0.2em] max-w-3xl mx-auto mb-8 animate-fade-in-up uppercase drop-shadow-md" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
                        Bespoke itineraries crafted by local specialists.
                    </p>

                    {/* ═══ Trip Builder Mini-Form ═══ */}
                    <div className="animate-fade-in-up max-w-2xl mx-auto" style={{ animationDelay: '400ms', animationFillMode: 'both' }}>
                        <div className="p-4 md:p-6 rounded-2xl bg-[#0a1f15]/30 backdrop-blur-md border border-white/[0.08]">

                            {/* 3-field row */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                                {/* Travel Month */}
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-antique-gold/60 pointer-events-none" />
                                    <select
                                        value={travelMonth}
                                        onChange={(e) => setTravelMonth(e.target.value)}
                                        className="w-full h-11 pl-9 pr-4 bg-white/[0.07] border border-white/[0.12] text-white text-sm font-nav font-light rounded-lg appearance-none cursor-pointer outline-none focus:border-antique-gold/40 transition-colors"
                                    >
                                        <option value="" className="text-neutral-900">Travel Month</option>
                                        {TRAVEL_MONTHS.map((m) => (
                                            <option key={m} value={m} className="text-neutral-900">{m}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Travelers */}
                                <div className="relative">
                                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-antique-gold/60 pointer-events-none" />
                                    <select
                                        value={travelers}
                                        onChange={(e) => setTravelers(e.target.value)}
                                        className="w-full h-11 pl-9 pr-4 bg-white/[0.07] border border-white/[0.12] text-white text-sm font-nav font-light rounded-lg appearance-none cursor-pointer outline-none focus:border-antique-gold/40 transition-colors"
                                    >
                                        <option value="" className="text-neutral-900">Travelers</option>
                                        {[1, 2, 3, 4, 5, 6, 7, 8, '9+'].map((n) => (
                                            <option key={n} value={String(n)} className="text-neutral-900">{n} {Number(n) === 1 ? 'Traveler' : 'Travelers'}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Style */}
                                <div className="relative">
                                    <Compass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-antique-gold/60 pointer-events-none" />
                                    <select
                                        value={style}
                                        onChange={(e) => setStyle(e.target.value)}
                                        className="w-full h-11 pl-9 pr-4 bg-white/[0.07] border border-white/[0.12] text-white text-sm font-nav font-light rounded-lg appearance-none cursor-pointer outline-none focus:border-antique-gold/40 transition-colors"
                                    >
                                        <option value="" className="text-neutral-900">Travel Style</option>
                                        {TRAVEL_STYLES.map((s) => (
                                            <option key={s.value} value={s.value} className="text-neutral-900">{s.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* CTA row */}
                            <div className="flex items-center justify-center pt-2">
                                <Button
                                    onClick={handleDesignJourney}
                                    className="w-full sm:w-auto h-[50px] px-10 liquid-glass-button bg-white/5 backdrop-blur-sm transition-all duration-500 rounded-lg font-nav font-semibold tracking-[0.2em] text-xs uppercase group focus-visible:ring-2 focus-visible:ring-antique-gold focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1f15] hover:bg-white/10"
                                >
                                    <span className="relative z-10 flex items-center drop-shadow-md text-white group-hover:text-white transition-colors">
                                        Design My Journey
                                        <ArrowRight className="w-4 h-4 ml-3 transition-transform duration-500 group-hover:translate-x-2" />
                                    </span>
                                </Button>
                            </div>
                        </div>

                        {/* Micro-proof line */}
                        <p className="text-[9px] text-white/40 font-nav tracking-[0.15em] uppercase mt-3">
                            Custom proposal delivered within 24 hours
                        </p>

                        {/* Trust Strip */}
                        <div className="flex items-center justify-center gap-4 md:gap-6 text-[9px] md:text-[10px] text-white/60 tracking-[0.2em] font-nav uppercase px-6 py-2 mt-4" style={{ animationDelay: '600ms', animationFillMode: 'both' }}>
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
