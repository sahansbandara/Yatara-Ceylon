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
    const leftY = useTransform(scrollYProgress, [0, 1], [40, -40]);
    const rightY = useTransform(scrollYProgress, [0, 1], [-30, 30]);
    const textOpacity = useTransform(scrollYProgress, [0.05, 0.25], [0, 1]);
    const textY = useTransform(scrollYProgress, [0.05, 0.25], [30, 0]);

    return (
        <section
            ref={sectionRef}
            className="relative py-32 md:py-40 lg:py-48 bg-white overflow-hidden"
        >
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 xl:px-24 relative z-10">

                {/* ═══ Walkers-Style Massive Headline ═══ */}
                <motion.div
                    style={{ opacity: textOpacity, y: textY }}
                    className="text-center mb-20 md:mb-32 will-change-transform"
                >
                    <h2 className="text-[3rem] md:text-[4.5rem] lg:text-[5.5rem] font-serif text-neutral-900 leading-[1.05] tracking-tight">
                        Sri Lanka&rsquo;s Premier
                        <br />
                        <span className="font-semibold">Destination Management Company</span>
                    </h2>
                </motion.div>

                {/* ═══ 3-column structured grid (Walkers Style: Image -> Text -> Image) ═══ */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

                    {/* ── Left Image (portrait, pulls up) ── */}
                    <motion.div
                        style={{ y: leftY }}
                        className="lg:col-span-4 order-2 lg:order-1 will-change-transform h-full flex flex-col justify-end"
                    >
                        <div className="relative aspect-[3/4] w-full max-w-[380px] mx-auto lg:mr-auto lg:ml-0 rounded-2xl overflow-hidden shadow-2xl shadow-black/5">
                            <Image
                                src="/images/home/authority-left.webp"
                                alt="A traveler experiencing Sri Lanka's scenic beauty"
                                fill
                                sizes="(max-width: 1024px) 80vw, 30vw"
                                className="object-cover"
                            />
                        </div>
                    </motion.div>

                    {/* ── Center Text (Static) ── */}
                    <div className="lg:col-span-4 order-1 lg:order-2 flex flex-col justify-center">
                        <h3 className="text-lg md:text-xl font-bold text-neutral-900 mb-6 leading-snug">
                            Experience the enchantment of Sri Lanka with Yatara Ceylon...
                        </h3>

                        <p className="text-neutral-600 text-base leading-[1.8] mb-8 font-light">
                            Yatara Ceylon has been crafting private journeys across Sri Lanka for discerning travelers—organizing bespoke tours for couples, families, adventurers, and cultural enthusiasts, as well as curated group experiences and corporate retreats.
                        </p>

                        <ul className="space-y-4 mb-12">
                            <li className="flex items-start gap-4 text-neutral-800 text-base">
                                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-neutral-900 shrink-0" />
                                Curated stays across Sri Lanka&rsquo;s finest boutique portfolio
                            </li>
                            <li className="flex items-start gap-4 text-neutral-800 text-base">
                                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-neutral-900 shrink-0" />
                                Trusted partner for leading global travel experiences
                            </li>
                        </ul>

                        {/* ── Walker Type Solid Button Style ── */}
                        <div className="flex items-center">
                            <Link
                                href="/about"
                                className="group inline-flex items-center gap-4 transition-all duration-300"
                            >
                                <span className="relative flex items-center justify-center w-12 h-12 rounded-full bg-[#1A365D] group-hover:bg-deep-emerald transition-colors duration-300">
                                    <Plus className="w-6 h-6 text-white" strokeWidth={2} />
                                </span>
                                <span className="text-[13px] tracking-[0.15em] font-bold text-neutral-900 group-hover:text-deep-emerald transition-colors duration-300">
                                    ABOUT US
                                </span>
                            </Link>
                        </div>
                    </div>

                    {/* ── Right Image (landscape, pulls down) ── */}
                    <motion.div
                        style={{ y: rightY }}
                        className="lg:col-span-4 order-3 lg:mt-24 will-change-transform h-full flex flex-col justify-start"
                    >
                        <div className="relative aspect-[5/4] w-full max-w-[420px] mx-auto lg:ml-auto lg:mr-0 rounded-2xl overflow-hidden shadow-2xl shadow-black/5">
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
