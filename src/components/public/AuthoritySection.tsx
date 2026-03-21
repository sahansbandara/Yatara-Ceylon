'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Plus } from 'lucide-react';

export default function AuthoritySection() {
    const sectionRef = useRef<HTMLDivElement>(null);

    // Using "start end" to "end start" means the progress goes from 0 to 1
    // as the section enters the bottom of the screen and leaves the top.
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    });

    /* ── Smooth Spring Parallax ── */
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 40,
        damping: 20,
        restDelta: 0.001
    });

    // Parallax Effects: The numbers represent the movement in percentages.
    const leftFrameY = useTransform(smoothProgress, [0, 1], ['25%', '-25%']);
    const rightFrameY = useTransform(smoothProgress, [0, 1], ['-25%', '25%']);
    const leftImageY = useTransform(smoothProgress, [0, 1], ['-15%', '15%']);
    const rightImageY = useTransform(smoothProgress, [0, 1], ['15%', '-15%']);

    return (
        <section
            ref={sectionRef}
            className="relative bg-white pt-10 md:pt-16 pb-20 md:pb-28 lg:pb-32 overflow-hidden" 
        >
            <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20 relative z-10 flex flex-col items-center">                    {/* Massive 2-Tone Headline */}
                    <div
                        // 👉 ADJUST GAP BETWEEN TITLE AND IMAGES:
                        // Change 'mb-8' and 'lg:mb-12' to make the space smaller or larger
                        className="text-center mb-8 lg:mb-12 z-20 flex flex-col items-center justify-center"
                    >
                        <h2 className="font-sans leading-[1.1] tracking-tight">
                            {/* 👉 ADJUST TOP TITLE SIZE HERE: (text-[size] text-[size]) */}
                            <span className="block text-[1.5rem] md:text-[2rem] lg:text-[2.25rem] text-neutral-800 font-normal mb-1">
                                Sri Lanka&rsquo;s Premier
                            </span>
                            {/* 👉 ADJUST MAIN HIGHLIGHT TEXT SIZE HERE: */}
                            <span className="block text-[2.25rem] md:text-[3.25rem] lg:text-[4.25rem] font-bold text-black tracking-tight">
                                Luxury Travel Curators
                            </span>
                        </h2>
                    </div>

                    {/* ═══ Clean Asymmetric Grid ═══ */}
                    {/* 👉 ADJUST GAP BETWEEN COLUMNS: Use gap-8 or gap-12 here */}
                    <div className="w-full flex flex-col lg:flex-row items-center lg:items-center justify-between gap-6 lg:gap-8">

                        {/* ── Left Parallax Window (Portrait) ── */}
                        {/* 👉 ADJUST LEFT IMAGE SIZE: Change w-[26%] width below */}
                        <motion.div style={{ y: leftFrameY }} className="w-[80%] md:w-[60%] lg:w-[26%] overflow-visible hidden lg:block">
                            {/* 👉 ADJUST IMAGE ASPECT RATIO: 'aspect-[4/5]' means taller. Change to aspect-square or similar if needed */}
                            <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl flex-shrink-0 shadow-black/10 z-10">
                                <motion.div
                                    style={{ y: leftImageY }}
                                    className="absolute inset-0 w-full h-[130%] -top-[15%] will-change-transform"
                                >
                                    <Image
                                        src="/images/home/authority-left.webp"
                                        alt="A traveler experiencing Sri Lanka's scenic beauty"
                                        fill
                                        sizes="(max-width: 1024px) 80vw, 30vw"
                                        className="object-cover"
                                        priority
                                    />
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* ── Center Text Content ── */}
                        {/* 👉 ADJUST CENTER BOX SIZE: Change w-[40%] width below */}
                        <div
                            className="w-full lg:w-[40%] z-30 flex flex-col px-4 lg:px-0"
                        >
                            {/* 👉 ADJUST HEADER FONT SIZE HERE */}
                            <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-neutral-900 mb-4 lg:mb-5 leading-snug font-serif">
                                Experience the enchantment of Sri Lanka with Yatara Ceylon...
                            </h3>

                            <p className="text-neutral-600 text-sm md:text-[15px] lg:text-base leading-[1.65] mb-5 lg:mb-6 font-light">
                                Yatara Ceylon sets the absolute standard in the Sri Lankan premium tourism industry. We organize deeply bespoke journeys for individuals, couples on holiday, and distinguished groups who demand exclusive experiences, extreme privacy, and unparalleled immersion.
                            </p>

                            <ul className="space-y-3 mb-6 lg:mb-8">
                                <li className="flex items-start gap-4 text-neutral-800 text-sm md:text-[15px]">
                                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#CFB53B] shrink-0" />
                                    Exclusive access to Sri Lanka&rsquo;s finest luxury portfolio
                                </li>
                                <li className="flex items-start gap-4 text-neutral-800 text-sm md:text-[15px]">
                                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#CFB53B] shrink-0" />
                                    Trusted regional partner for global elite travel brands
                                </li>
                            </ul>

                            <div className="flex items-center">
                                <Link
                                    href="/about"
                                    className="group inline-flex items-center gap-4 transition-all duration-500"
                                >
                                    <span className="relative flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#113d33] group-hover:bg-[#CFB53B] transition-colors duration-500 shadow-md">
                                        <Plus className="w-4 h-4 lg:w-5 lg:h-5 text-white" strokeWidth={2.5} />
                                    </span>
                                    <span className="text-[11px] lg:text-[12px] tracking-[0.2em] font-bold text-[#113d33] group-hover:text-[#CFB53B] uppercase transition-colors duration-500">
                                        About Us
                                    </span>
                                </Link>
                            </div>
                        </div>

                        {/* ── Mobile/Tablet Images ── */}
                        <div className="w-full flex lg:hidden gap-4 mt-6 px-4">
                            <div className="relative w-1/2 aspect-[4/5] rounded-2xl overflow-hidden shadow-xl shadow-black/10">
                                <Image
                                    src="/images/home/authority-left.webp"
                                    alt="Traveler scenic beauty"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="relative w-1/2 aspect-[4/5] rounded-2xl overflow-hidden shadow-xl shadow-black/10 mt-6">
                                <Image
                                    src="/images/home/authority-right.webp"
                                    alt="Aerial coastline"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>

                        {/* ── Right Parallax Window (Landscape, Float Right) ── */}
                        {/* 👉 ADJUST RIGHT IMAGE SIZE: Change w-[28%] width below */}
                        <motion.div style={{ y: rightFrameY }} className="w-[80%] md:w-[60%] lg:w-[28%] hidden lg:block lg:mt-12">
                            {/* 👉 ADJUST IMAGE ASPECT RATIO: 'aspect-[4/3]' means wider */}
                            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-xl shadow-black/5 z-10 lg:ml-auto">
                                <motion.div
                                    style={{ y: rightImageY }}
                                    className="absolute inset-0 w-full h-[130%] -top-[15%] will-change-transform"
                                >
                                    <Image
                                        src="/images/home/authority-right.webp"
                                        alt="Aerial view of Sri Lanka's pristine coastline"
                                        fill
                                        sizes="(max-width: 1024px) 90vw, 40vw"
                                        className="object-cover"
                                    />
                                </motion.div>
                            </div>
                        </motion.div>

                    </div>
            </div>
        </section>
    );
}
