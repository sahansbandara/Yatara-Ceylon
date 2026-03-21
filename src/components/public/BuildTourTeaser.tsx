'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Compass } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
        }
    }
};

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

export default function BuildTourTeaser() {
    // Parallax scroll setup
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    // Itinerary frame moves down slightly while scrolling down
    const itineraryY = useTransform(scrollYProgress, [0, 1], [-40, 70]);
    // Destination card moves up slightly while scrolling down
    const destinationY = useTransform(scrollYProgress, [0, 1], [50, -60]);

    return (
        <section ref={sectionRef} className="relative overflow-x-clip flex items-center py-12 lg:py-16 bg-off-white">
            {/* Soft warm glow in center */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        'radial-gradient(ellipse at 50% 40%, rgba(212, 175, 55, 0.05) 0%, rgba(249, 248, 246, 0.5) 50%, transparent 100%)',
                }}
            />
            {/* Subtle noise texture overlay */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat',
                    backgroundSize: '128px 128px',
                }}
            />
            
            {/* Top gold separator line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-antique-gold/20 to-transparent" />

            <div className="max-w-[1400px] mx-auto px-6 lg:px-10 relative z-10 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                    {/* Left Copy */}
                    <motion.div 
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-100px" }}
                        className="max-w-xl"
                    >
                        {/* Eyebrow */}
                        <motion.div variants={fadeUp} className="flex items-center gap-4 mb-8">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-antique-gold/10 border border-antique-gold/30">
                                <Compass className="w-4 h-4 text-antique-gold" />
                            </span>
                            <span className="block text-[10px] tracking-[0.3em] font-nav text-antique-gold uppercase font-semibold">
                                The Tailor-Made Experience
                            </span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h2 variants={fadeUp} className="text-5xl md:text-[3.5rem] lg:text-[4.75rem] font-display text-deep-emerald leading-[1.1] tracking-tight mb-6 drop-shadow-sm py-2">
                            Craft Your <br className="hidden lg:block"/>
                            <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-antique-gold to-yellow-600 drop-shadow-none pr-3 pb-3 inline-block">Bespoke</span> Journey
                        </motion.h2>

                        {/* Micro-proof line */}
                        <motion.p variants={fadeUp} className="text-xs font-nav text-deep-emerald/50 tracking-[0.15em] uppercase mb-10 font-semibold">
                            Designed by you, perfected by local specialists.
                        </motion.p>

                        {/* Body paragraph */}
                        <motion.p variants={fadeUp} className="text-deep-emerald/70 font-light text-base md:text-lg leading-relaxed mb-10 max-w-lg">
                            Select the landscapes you want to explore and the experiences that move you. Our travel concierges step in to refine the pacing, handpick elite accommodations, and orchestrate seamless private transfers. 
                        </motion.p>

                        {/* Assurance bullets */}
                        <motion.ul variants={fadeUp} className="space-y-5 mb-14">
                            {[
                                'Private pacing without the compromises of group travel',
                                'Exclusive access and hand-selected luxury boutique stays',
                                'Dedicated on-ground specialist from arrival to departure'
                            ].map((text, i) => (
                                <li key={i} className="flex items-start gap-4 text-sm font-nav tracking-wider text-deep-emerald/80">
                                    <span className="block w-1.5 h-1.5 rounded-full bg-antique-gold mt-1.5 shrink-0 shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
                                    {text}
                                </li>
                            ))}
                        </motion.ul>

                        {/* 2-path CTA */}
                        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-5">
                            {/* Primary Button */}
                            <Link
                                href="/build-tour"
                                className="group relative flex items-center justify-between gap-6 pl-7 sm:pl-8 pr-2 py-2 rounded-full bg-white/90 backdrop-blur-xl border border-white shadow-[0_8px_32px_rgba(10,37,26,0.08)] hover:bg-white hover:shadow-[0_16px_48px_rgba(10,37,26,0.12)] transition-all duration-500"
                            >
                                <span className="text-[10px] sm:text-[11px] font-nav font-bold tracking-[0.2em] uppercase text-deep-emerald">
                                    Start Building Now
                                </span>
                                <div className="w-10 h-10 rounded-full bg-deep-emerald/5 border border-deep-emerald/10 flex items-center justify-center shadow-sm group-hover:scale-105 group-hover:bg-deep-emerald/10 transition-all duration-500">
                                    <ArrowRight className="w-4 h-4 text-deep-emerald group-hover:-rotate-45 transition-transform duration-500" />
                                </div>
                            </Link>

                            {/* Secondary Button */}
                            <Link
                                href="/inquire?type=bespoke"
                                className="group relative flex items-center justify-between gap-6 pl-7 sm:pl-8 pr-2 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-deep-emerald/15 hover:bg-white/40 hover:border-white/60 transition-all duration-500"
                            >
                                <span className="text-[10px] sm:text-[11px] font-nav font-bold tracking-[0.2em] uppercase text-deep-emerald/70 group-hover:text-deep-emerald transition-colors duration-500">
                                    Speak to a specialist
                                </span>
                                <div className="w-10 h-10 rounded-full bg-transparent border border-deep-emerald/15 flex items-center justify-center group-hover:border-white/60 group-hover:bg-white/60 transition-all duration-500">
                                    <ArrowRight className="w-4 h-4 text-deep-emerald/70 group-hover:text-deep-emerald group-hover:-rotate-45 transition-transform duration-500" />
                                </div>
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Right Visual — Stunning Tall Image with Floating Cards */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="relative w-full max-w-[400px] lg:max-w-[480px] aspect-[4/5] mx-auto lg:ml-auto mt-12 lg:mt-0"
                    >
                        {/* The Main Image Container */}
                        <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-[0_30px_60px_rgba(10,37,26,0.15)] group border border-deep-emerald/5">
                            <Image 
                                src="/images/home/bespoke-teaser-main.webp" 
                                alt="Bespoke luxury journey in Sri Lanka"
                                fill
                                className="object-cover transform scale-[1.03] group-hover:scale-[1.08] transition-transform duration-[7000ms] ease-out brightness-95 group-hover:brightness-105"
                            />
                        </div>

                        {/* Floating UI Elements using parallax framer-motion */}
                        
                        {/* Itinerary sidebar */}
                        <motion.div 
                            style={{ y: itineraryY }}
                            className="absolute left-3 sm:left-6 top-4 sm:top-8 z-10 w-44 sm:w-52 bg-white/90 backdrop-blur-xl border border-deep-emerald/5 p-4 sm:p-5 rounded-2xl shadow-[0_20px_40px_rgba(10,37,26,0.08)]"
                        >
                            <div className="text-[8px] font-nav uppercase tracking-[0.2em] text-antique-gold mb-5 font-semibold flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-antique-gold shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
                                Your Blueprint
                            </div>
                            <div className="relative space-y-4">
                                {/* Connecting line */}
                                <div className="absolute top-3 bottom-3 left-[11px] w-px bg-gradient-to-b from-deep-emerald/10 via-antique-gold/40 to-transparent" />
                                
                                {[
                                    { num: '1', city: 'Colombo', status: 'past' },
                                    { num: '2', city: 'Kandy', status: 'past' },
                                    { num: '3', city: 'Galle Fort', status: 'active' }
                                ].map((step, i) => (
                                    <div key={i} className="flex items-center gap-3 relative z-10">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-semibold border ${
                                            step.status === 'active' 
                                                ? 'bg-antique-gold/10 border-antique-gold/30 text-antique-gold' 
                                                : 'bg-white border-deep-emerald/10 text-deep-emerald/40 shadow-sm'
                                        }`}>
                                            {step.num}
                                        </div>
                                        <span className={`text-xs sm:text-sm font-medium tracking-wide ${
                                            step.status === 'active' ? 'text-deep-emerald' : 'text-deep-emerald/50'
                                        }`}>
                                            {step.city}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Destination card */}
                        <motion.div 
                            style={{ y: destinationY }}
                            className="absolute right-3 sm:right-6 bottom-4 sm:bottom-8 z-10 bg-white/95 backdrop-blur-xl p-2.5 sm:p-3 rounded-2xl shadow-[0_20px_40px_rgba(10,37,26,0.08)] w-36 sm:w-48 border border-deep-emerald/5"
                        >
                            <div className="relative overflow-hidden rounded-xl mb-3 aspect-[4/3] group/card ring-1 ring-deep-emerald/5">
                                <Image
                                    src="/images/home/bespoke-galle-card.webp"
                                    alt="Galle coast"
                                    fill
                                    className="object-cover transform group-hover/card:scale-105 transition-transform duration-[4000ms] ease-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-2 left-2 flex items-center gap-2">
                                     <span className="px-1.5 py-0.5 bg-black/40 backdrop-blur-md rounded border border-white/20 text-[7px] uppercase tracking-widest text-white/90">
                                         3 Nights
                                     </span>
                                </div>
                            </div>
                            <div className="px-1.5 pb-1">
                                <div className="font-display text-xl sm:text-2xl text-deep-emerald leading-tight mb-1">Galle</div>
                                <div className="flex items-center justify-between mt-2">
                                    <div className="text-[8px] sm:text-[9px] font-nav uppercase tracking-[0.2em] text-antique-gold font-medium">
                                        Added to route
                                    </div>
                                    <div className="w-5 h-5 rounded-full bg-antique-gold/10 border border-antique-gold/30 flex items-center justify-center">
                                        <ArrowRight className="w-2.5 h-2.5 text-antique-gold" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}

