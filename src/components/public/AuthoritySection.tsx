'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function AuthoritySection() {
    const sectionRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    });

    /* ── Subtle, restrained parallax (luxury = restraint) ── */
    const leftY = useTransform(scrollYProgress, [0, 1], [30, -30]);
    const rightY = useTransform(scrollYProgress, [0, 1], [-20, 20]);
    const leftScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.02, 1, 0.99]);
    const rightScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.99, 1, 1.01]);

    /* ── Text fade ── */
    const textOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);
    const textY = useTransform(scrollYProgress, [0.1, 0.3], [24, 0]);

    return (
        <section
            ref={sectionRef}
            className="relative py-24 md:py-32 lg:py-40 bg-[#FCFBF9] overflow-hidden"
        >
            {/* Very faint warmth — barely visible */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-[#F8F6F2]/40 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">

                    {/* ── Left Image (portrait) ── */}
                    <motion.div
                        style={{ y: leftY, scale: leftScale }}
                        className="lg:col-span-4 order-2 lg:order-1 will-change-transform"
                    >
                        <div className="relative aspect-[2/3] w-full max-w-[380px] mx-auto lg:mx-0 rounded-3xl overflow-hidden">
                            <Image
                                src="/images/home/authority-left.webp"
                                alt="A traveler experiencing Sri Lanka's scenic beauty"
                                fill
                                sizes="(max-width: 1024px) 80vw, 33vw"
                                className="object-cover"
                            />
                        </div>
                    </motion.div>

                    {/* ── Center Text ── */}
                    <motion.div
                        style={{ opacity: textOpacity, y: textY }}
                        className="lg:col-span-4 order-1 lg:order-2 flex flex-col justify-center will-change-transform"
                    >
                        {/* Tag */}
                        <span className="text-[10px] tracking-[0.3em] font-medium text-antique-gold/70 uppercase mb-5">
                            Curated Private Travel&ensp;·&ensp;Sri Lanka
                        </span>

                        {/* Headline — large, tight, authoritative */}
                        <h2 className="text-[2.25rem] md:text-[2.75rem] lg:text-[3.25rem] font-display text-deep-emerald leading-[1.05] mb-4">
                            Sri Lanka&rsquo;s Private
                            <br />
                            Travel Curators
                        </h2>

                        {/* Bold subheading — Walkers-style authority voice */}
                        <p className="text-[15px] md:text-base font-semibold text-neutral-800 mb-4">
                            Experience Sri Lanka with Yatara Ceylon…
                        </p>

                        {/* Body — darker, shorter, high-contrast */}
                        <p className="text-neutral-600 text-[15px] leading-relaxed mb-8 max-w-[22rem]">
                            Bespoke itineraries crafted with refined stays, seamless logistics, and a concierge-led approach—paced for comfort, curated for meaning.
                        </p>

                        {/* Proof bullets — specific, credible */}
                        <ul className="space-y-2.5 mb-10">
                            <li className="flex items-start gap-3 text-neutral-700 text-sm leading-relaxed">
                                <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-deep-emerald shrink-0" />
                                Curated stays across Sri Lanka&rsquo;s top boutique portfolio
                            </li>
                            <li className="flex items-start gap-3 text-neutral-700 text-sm leading-relaxed">
                                <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-deep-emerald shrink-0" />
                                Private driver-guide + vetted specialists on every journey
                            </li>
                            <li className="flex items-start gap-3 text-neutral-700 text-sm leading-relaxed">
                                <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-deep-emerald shrink-0" />
                                24/7 concierge support from arrival to departure
                            </li>
                        </ul>

                        {/* CTA — 1 button + 1 text link (luxury restraint) */}
                        <div className="flex items-center gap-8">
                            <Link
                                href="/about"
                                className="inline-flex items-center gap-2.5 text-[11px] tracking-[0.2em] uppercase font-semibold text-white bg-deep-emerald px-7 py-3.5 rounded-full hover:bg-deep-emerald/90 transition-colors duration-300 group"
                            >
                                About Yatara
                                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                            </Link>

                            <Link
                                href="/inquire"
                                className="text-[11px] tracking-[0.15em] uppercase font-medium text-neutral-500 hover:text-deep-emerald transition-colors duration-300"
                            >
                                Inquire →
                            </Link>
                        </div>
                    </motion.div>

                    {/* ── Right Image (landscape) ── */}
                    <motion.div
                        style={{ y: rightY, scale: rightScale }}
                        className="lg:col-span-4 order-3 will-change-transform"
                    >
                        <div className="relative aspect-[3/2] w-full max-w-[520px] mx-auto lg:ml-auto rounded-2xl overflow-hidden shadow-sm">
                            <Image
                                src="/images/home/authority-right.webp"
                                alt="Aerial view of Sri Lanka's pristine coastline"
                                fill
                                sizes="(max-width: 1024px) 90vw, 33vw"
                                className="object-cover"
                            />
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
