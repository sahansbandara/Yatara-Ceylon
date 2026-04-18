'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function TransfersHero() {
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start'],
    });

    // Parallax effects
    const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

    return (
        <section ref={heroRef} className="relative h-screen min-h-[700px] max-h-[1200px] overflow-hidden">
            {/* Parallax background */}
            <motion.div style={{ y: heroY }} className="absolute inset-0 -top-[10%] h-[120%]">
                <Image
                    src="/images/transfers/transfers-hero-bg.webp" 
                    alt="Sri Lanka Curated Luxury Private Transfers"
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority
                    quality={85}
                />
            </motion.div>

            {/* Gradient overlays for text contrast */}
            <div className="absolute inset-0 bg-black/50 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-transparent pointer-events-none" />
            <div className="absolute bottom-[-1px] left-0 right-0 h-[100px] bg-gradient-to-t from-off-white to-transparent pointer-events-none" />

            {/* Content */}
            <motion.div
                style={{ opacity: heroOpacity }}
                className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 pt-20 pb-16"
            >
                <div className="max-w-5xl mx-auto">
                    {/* Micro-label */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.7 }}
                        className="text-[10px] sm:text-[11px] tracking-[0.4em] uppercase text-antique-gold font-sans font-bold mb-6 drop-shadow-md"
                    >
                        Premium Private Transfers
                    </motion.p>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{ delay: 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                        className="text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] font-display text-white leading-[1.05] mb-8 drop-shadow-[0_4px_32px_rgba(0,0,0,0.8)] font-medium"
                    >
                        Designed Around <br className="hidden md:block"/>
                        <span className="text-antique-gold font-serif italic drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)] font-semibold">Time, Privacy, & Comfort</span>
                    </motion.h1>

                    {/* Sub-headline */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.7 }}
                        className="text-base sm:text-lg text-white max-w-2xl mx-auto leading-relaxed mb-12 drop-shadow-[0_2px_16px_rgba(0,0,0,0.8)] font-medium"
                    >
                        From seamless airport arrivals to cross-country travel with private chauffeurs, each transfer is orchestrated for the discerning traveller.
                    </motion.p>

                    {/* Floating stats bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 24, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 0.8, duration: 0.7 }}
                        className="inline-flex items-center gap-6 sm:gap-10 px-8 py-4 rounded-[2.5rem] bg-black/40 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]"
                    >
                        <div className="text-center">
                            <p className="text-2xl sm:text-3xl font-display text-white mb-1">6</p>
                            <p className="text-[10px] tracking-[0.25em] uppercase text-white/50">Categories</p>
                        </div>
                        <div className="w-px h-10 bg-white/20" />
                        <div className="text-center">
                            <p className="text-2xl sm:text-3xl font-display text-white mb-1">100%</p>
                            <p className="text-[10px] tracking-[0.25em] uppercase text-white/50">Island-wide</p>
                        </div>
                        <div className="w-px h-10 bg-white/20" />
                        <div className="text-center">
                            <p className="text-2xl sm:text-3xl font-display text-antique-gold mb-1">24/7</p>
                            <p className="text-[10px] tracking-[0.25em] uppercase text-white/50">Concierge</p>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}
