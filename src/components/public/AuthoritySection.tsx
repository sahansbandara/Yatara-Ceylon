'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Plus } from 'lucide-react';

export default function AuthoritySection() {
    const sectionRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    });

    /* ── Subtle parallax ── */
    const leftY = useTransform(scrollYProgress, [0, 1], [30, -30]);
    const rightY = useTransform(scrollYProgress, [0, 1], [-20, 20]);
    const leftScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.02, 1, 0.99]);
    const rightScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.99, 1, 1.01]);
    const textOpacity = useTransform(scrollYProgress, [0.08, 0.28], [0, 1]);
    const textY = useTransform(scrollYProgress, [0.08, 0.28], [24, 0]);

    return (
        <section
            ref={sectionRef}
            className="relative py-24 md:py-32 lg:py-40 bg-[#FCFBF9] overflow-hidden"
        >
            {/* Barely-there warmth */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-[#F8F6F2]/40 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">

                {/* ═══ Full-width headline (Walkers-style, above grid) ═══ */}
                <motion.div
                    style={{ opacity: textOpacity, y: textY }}
                    className="text-center mb-16 md:mb-20 lg:mb-24 will-change-transform"
                >
                    <h2 className="text-[2.5rem] md:text-[3.5rem] lg:text-[4.25rem] font-display text-deep-emerald leading-[1.05] tracking-tight">
                        Sri Lanka&rsquo;s Premier
                        <br />
                        <span className="text-deep-emerald/80">Private Travel Curators</span>
                    </h2>
                </motion.div>

                {/* ═══ 3-column grid (images + content) ═══ */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-10 items-start">

                    {/* ── Left Image (portrait) ── */}
                    <motion.div
                        style={{ y: leftY, scale: leftScale }}
                        className="lg:col-span-4 order-2 lg:order-1 will-change-transform"
                    >
                        <div className="relative aspect-[2/3] w-full max-w-[340px] mx-auto lg:mx-0 rounded-2xl overflow-hidden">
                            <Image
                                src="/images/home/authority-left.webp"
                                alt="A traveler experiencing Sri Lanka's scenic beauty"
                                fill
                                sizes="(max-width: 1024px) 80vw, 28vw"
                                className="object-cover"
                            />
                        </div>
                    </motion.div>

                    {/* ── Center Text ── */}
                    <motion.div
                        style={{ opacity: textOpacity }}
                        className="lg:col-span-4 order-1 lg:order-2 flex flex-col justify-center lg:pt-6 will-change-transform"
                    >
                        {/* Bold subheading */}
                        <p className="text-base md:text-lg font-semibold text-neutral-800 mb-5 leading-snug">
                            Experience the enchantment of Sri Lanka with Yatara Ceylon…
                        </p>

                        {/* Body — darker, readable */}
                        <p className="text-neutral-600 text-[15px] md:text-base leading-[1.75] mb-8">
                            Yatara Ceylon has been crafting private journeys across Sri Lanka for discerning travelers—organizing bespoke tours for couples, families, adventurers, and cultural enthusiasts, as well as curated group experiences and corporate retreats.
                        </p>

                        {/* Proof bullets — specific, credible */}
                        <ul className="space-y-2.5 mb-10">
                            <li className="flex items-start gap-3 text-neutral-700 text-[15px] leading-relaxed">
                                <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-neutral-900 shrink-0" />
                                Curated stays across Sri Lanka&rsquo;s finest boutique portfolio
                            </li>
                            <li className="flex items-start gap-3 text-neutral-700 text-[15px] leading-relaxed">
                                <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-neutral-900 shrink-0" />
                                Trusted partner for leading global travel experiences
                            </li>
                        </ul>

                        {/* ── Liquid Glass CTA (Walkers circle-icon style, elevated) ── */}
                        <div className="flex items-center gap-4">
                            <Link
                                href="/about"
                                className="group inline-flex items-center gap-3.5 transition-all duration-300"
                            >
                                {/* Glass circle icon */}
                                <span className="relative flex items-center justify-center w-11 h-11 rounded-full bg-deep-emerald/90 backdrop-blur-md border border-white/20 shadow-lg shadow-deep-emerald/20 group-hover:bg-deep-emerald group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-deep-emerald/30 transition-all duration-300">
                                    <Plus className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
                                </span>
                                {/* Label */}
                                <span className="text-[12px] tracking-[0.2em] uppercase font-semibold text-deep-emerald group-hover:text-deep-emerald/80 transition-colors duration-300">
                                    About Us
                                </span>
                            </Link>
                        </div>
                    </motion.div>

                    {/* ── Right Image (landscape) ── */}
                    <motion.div
                        style={{ y: rightY, scale: rightScale }}
                        className="lg:col-span-4 order-3 lg:mt-16 will-change-transform"
                    >
                        <div className="relative aspect-[4/3] w-full max-w-[480px] mx-auto lg:ml-auto rounded-2xl overflow-hidden">
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
