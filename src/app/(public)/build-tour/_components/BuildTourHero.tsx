'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MapPin, Sparkles, Map, Route, Users } from 'lucide-react';

export default function BuildTourHero() {
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start'],
    });
    const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

    const scrollToBuilder = () => {
        document.getElementById('planner')?.scrollIntoView({ behavior: 'smooth' });
    };

    const scrollToStarters = () => {
        document.getElementById('starter-plans')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section ref={heroRef} className="relative h-screen min-h-[700px] max-h-[1200px] overflow-hidden">
            {/* Parallax background */}
            <motion.div style={{ y: heroY }} className="absolute inset-0 -top-[10%] h-[120%]">
                <Image
                    src="/images/build-tour-hero.webp"
                    alt="Sri Lanka bespoke luxury tour planning — scenic aerial view"
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority
                    quality={85}
                />
            </motion.div>

            {/* Gradient overlays for text contrast */}
            <div className="absolute inset-0 bg-black/40 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-off-white to-transparent pointer-events-none" />

            {/* Content */}
            <motion.div
                style={{ opacity: heroOpacity }}
                className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 pt-20"
            >
                <div className="max-w-5xl mx-auto">
                    {/* Micro-label */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.7 }}
                        className="text-[10px] sm:text-[11px] tracking-[0.4em] uppercase text-antique-gold font-sans font-bold mb-6 drop-shadow-md"
                    >
                        Bespoke Tour Planner
                    </motion.p>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{ delay: 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                        className="text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] font-display text-white leading-[1.05] mb-8 drop-shadow-[0_4px_32px_rgba(0,0,0,0.8)] font-medium"
                    >
                        Build a Smarter
                        <span className="block text-antique-gold font-serif italic mt-2 drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)] font-semibold">Sri Lanka Journey</span>
                    </motion.h1>

                    {/* Sub-headline */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.7 }}
                        className="text-base sm:text-lg text-white max-w-2xl mx-auto leading-relaxed mb-12 drop-shadow-[0_2px_16px_rgba(0,0,0,0.8)] font-medium"
                    >
                        Explore the island visually on our interactive map, choose regions with confidence,
                        and shape an elegant route with concierge-ready planning.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.7 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
                    >
                        <button
                            onClick={scrollToBuilder}
                            className="flex items-center gap-2.5 px-8 py-4 bg-antique-gold text-deep-emerald text-[11px] tracking-[0.2em] uppercase font-semibold rounded-full hover:bg-white hover:shadow-lg transition-all duration-300"
                        >
                            <MapPin className="w-4 h-4" />
                            Start Planning
                        </button>
                        <button
                            onClick={scrollToStarters}
                            className="flex items-center gap-2 px-8 py-4 border border-white/30 text-white text-[11px] tracking-[0.2em] uppercase font-semibold rounded-full hover:bg-white/10 transition-all duration-300"
                        >
                            <Sparkles className="w-3.5 h-3.5" />
                            Use a Starter Route
                        </button>
                    </motion.div>

                    {/* Floating stats bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 24, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 1, duration: 0.7 }}
                        className="inline-flex items-center gap-8 sm:gap-12 px-10 py-5 rounded-[2.5rem] bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl"
                    >
                        <div className="text-center">
                            <p className="text-2xl sm:text-3xl font-display text-white mb-1">7</p>
                            <p className="text-[10px] tracking-[0.25em] uppercase text-white/50">Regions</p>
                        </div>
                        <div className="w-px h-10 bg-white/10" />
                        <div className="text-center">
                            <p className="text-2xl sm:text-3xl font-display text-white mb-1">25</p>
                            <p className="text-[10px] tracking-[0.25em] uppercase text-white/50">Districts</p>
                        </div>
                        <div className="w-px h-10 bg-white/10" />
                        <div className="text-center">
                            <p className="text-2xl sm:text-3xl font-display text-antique-gold mb-1">100+</p>
                            <p className="text-[10px] tracking-[0.25em] uppercase text-white/50">Places</p>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}
