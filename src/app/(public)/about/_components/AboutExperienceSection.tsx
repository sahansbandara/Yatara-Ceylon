'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

export default function AboutExperienceSection() {
    const sectionRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 40,
        damping: 20,
        restDelta: 0.001
    });

    const leftFrameY = useTransform(smoothProgress, [0, 1], ['25%', '-25%']);
    const rightFrameY = useTransform(smoothProgress, [0, 1], ['-25%', '25%']);
    const leftImageY = useTransform(smoothProgress, [0, 1], ['-15%', '15%']);
    const rightImageY = useTransform(smoothProgress, [0, 1], ['15%', '-15%']);

    return (
        <section ref={sectionRef} className="py-32 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
                    {/* Left Parallax Window */}
                    <div className="hidden lg:block relative w-full h-[500px]">
                        <motion.div style={{ y: leftFrameY }} className="absolute inset-0 z-10 rounded-2xl overflow-hidden shadow-xl">
                            <motion.div style={{ y: leftImageY }} className="absolute inset-0 w-full h-[130%] -top-[15%] will-change-transform">
                                <Image
                                    src="/images/about/about-experience-left.webp"
                                    alt="Yatara experience"
                                    fill
                                    className="object-cover"
                                />
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Left Image - Mobile Stand-in */}
                    <div className="relative rounded-2xl overflow-hidden aspect-[3/4] shadow-xl lg:hidden">
                        <Image
                            src="/images/about/about-experience-left.webp"
                            alt="Yatara experience"
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Center Text */}
                    <div className="flex flex-col justify-center z-20">
                        <h2 className="text-2xl md:text-3xl font-display text-deep-emerald mb-6 leading-snug">
                            Experience the enchantment of Sri Lanka with Yatara Ceylon...
                        </h2>
                        <p className="text-gray-500 font-light leading-relaxed mb-6 text-[15px]">
                            Yatara Ceylon has been at the forefront of the Sri Lankan tourism industry for over a decade of excellence, organizing inbound tours for couples on holiday or honeymoon, for individual adventurers and nature lovers, as well as for special interest and incentive holiday groups.
                        </p>
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-center gap-3 text-deep-emerald text-sm font-medium">
                                <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
                                A pioneer in bespoke Sri Lankan tourism
                            </li>
                            <li className="flex items-center gap-3 text-deep-emerald text-sm font-medium">
                                <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
                                Trusted partner for leading global travel brands
                            </li>
                            <li className="flex items-center gap-3 text-deep-emerald text-sm font-medium">
                                <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
                                Award-winning customer service excellence
                            </li>
                        </ul>
                        <Link
                            href="/inquire"
                            className="flex items-center gap-3 text-deep-emerald hover:text-[#D4AF37] transition-colors group w-fit"
                        >
                            <div className="w-10 h-10 rounded-full border-2 border-deep-emerald group-hover:border-[#D4AF37] flex items-center justify-center transition-colors">
                                <span className="text-xl leading-none">+</span>
                            </div>
                            <span className="text-xs tracking-[0.2em] font-semibold uppercase">ABOUT US</span>
                        </Link>
                    </div>

                    {/* Right Parallax Window */}
                    <div className="hidden lg:block relative w-full h-[500px]">
                        <motion.div style={{ y: rightFrameY }} className="absolute inset-0 z-10 rounded-2xl overflow-hidden shadow-xl lg:mt-24">
                            <motion.div style={{ y: rightImageY }} className="absolute inset-0 w-full h-[130%] -top-[15%] will-change-transform">
                                <Image
                                    src="/images/about/about-experience-right.webp"
                                    alt="Sri Lanka coastline"
                                    fill
                                    className="object-cover"
                                />
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Right Image - Mobile Stand-in */}
                    <div className="relative rounded-2xl overflow-hidden aspect-[3/4] shadow-xl lg:hidden">
                        <Image
                            src="/images/about/about-experience-right.webp"
                            alt="Sri Lanka coastline"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
