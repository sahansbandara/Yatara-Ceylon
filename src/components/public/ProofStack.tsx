'use client';

import { ShieldCheck, Clock, BadgeCheck, Lock } from 'lucide-react';
import Image from 'next/image';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const PROOF_PILLARS = [
    {
        icon: BadgeCheck,
        title: 'Verified Guides',
        headline: 'Licensed, vetted, multi-lingual',
        description:
            'Every driver-guide is registered with the Sri Lanka Tourism Development Authority and carries verified credentials.',
        badge: 'SLTDA Registered',
        image: '/images/proof/verified-guides.webp',
    },
    {
        icon: Clock,
        title: 'Concierge SLA',
        headline: 'Response within 2 hours',
        description:
            'Your on-trip WhatsApp concierge is available around the clock. Route changes, restaurant bookings, and weather pivots—handled instantly.',
        badge: '24/7 Support',
        image: '/images/proof/concierge-sla.webp',
    },
    {
        icon: ShieldCheck,
        title: 'Fixed-Price Guarantee',
        headline: 'No hidden fees, ever',
        description:
            'All-inclusive pricing with a detailed day-by-day breakdown before you confirm. What you see is what you pay—including transfers, stays, and experiences.',
        badge: 'Transparent Pricing',
        image: '/images/proof/fixed-price.webp',
    },
    {
        icon: Lock,
        title: 'Privacy & Discretion',
        headline: 'Your journey, your space',
        description:
            'Private transfers, exclusive access arrangements, and no shared group itineraries. Your travel details remain completely confidential.',
        badge: 'Private Service',
        image: '/images/proof/privacy.webp',
    },
];

export default function ProofStack() {
    const sectionRef = useRef<HTMLElement>(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    });

    const opacity = useTransform(scrollYProgress, [0.05, 0.2], [0, 1]);
    const y = useTransform(scrollYProgress, [0.05, 0.2], [32, 0]);

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden py-6 md:py-8 bg-[#F9F9F8] border-b border-black/[0.04]"
        >
            <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    style={{ opacity, y }}
                    className="text-center mb-6 md:mb-8 will-change-transform"
                >
                    <span className="block text-[10px] tracking-[0.2em] font-sans font-bold text-black/40 uppercase mb-4">
                        The Proof
                    </span>
                    <h2 className="text-3xl md:text-[40px] lg:text-[44px] font-sans font-medium text-black leading-[1.1] mb-5 tracking-tight">
                        Why Travelers <span className="font-bold">Trust Us</span>
                    </h2>
                    <p className="text-[15px] md:text-[17px] font-sans text-black/70 max-w-2xl mx-auto leading-relaxed font-medium">
                        Not marketing promises — operational commitments backed by policy.
                    </p>
                </motion.div>

                {/* 4-column grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
                    {PROOF_PILLARS.map((pillar, idx) => (
                        <div
                            key={idx}
                            className="group relative flex flex-col p-6 lg:p-7 rounded-[24px] overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 border border-black/5 h-full min-h-[350px] lg:min-h-[380px] transform-gpu"
                            style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}
                        >
                            {/* Background Image */}
                            <div className="absolute inset-0 z-0">
                                <Image
                                    src={pillar.image}
                                    alt={pillar.title}
                                    fill
                                    className="object-cover transform scale-100 group-hover:scale-110 transition-transform duration-2s ease-out will-change-transform"
                                />
                                {/* Permanent Dark Overlay for Text Readability */}
                                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80 z-10" />
                            </div>

                            {/* Content Wrapper */}
                            <div className="relative z-30 flex flex-col h-full items-start text-left">
                                {/* Icon / Top Row */}
                                <div className="flex justify-between w-full items-start mb-auto pb-8">
                                    <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white bg-black/20 backdrop-blur-md shadow-sm group-hover:bg-white/30 transition-all duration-500">
                                        <pillar.icon className="w-5 h-5 focus:outline-none" strokeWidth={1.5} />
                                    </div>

                                    <span className="text-[9px] font-sans font-bold tracking-[0.15em] uppercase text-white bg-black/20 px-3 py-1.5 rounded-full border border-white/20 group-hover:bg-white/30 transition-all duration-500 backdrop-blur-md">
                                        {pillar.badge}
                                    </span>
                                </div>

                                {/* Text Content */}
                                <div className="mt-auto w-full">
                                    <p className="text-xs font-sans font-bold text-white/70 uppercase tracking-[0.15em] mb-2 drop-shadow-sm">
                                        {pillar.headline}
                                    </p>
                                    <h3 className="text-[22px] lg:text-[24px] font-sans font-bold text-white mb-3 tracking-tight drop-shadow-md">
                                        {pillar.title}
                                    </h3>
                                    <p className="text-[14px] leading-relaxed text-white/90 font-medium font-sans drop-shadow-sm">
                                        {pillar.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom assurance */}
                <div className="mt-12 pt-6 border-t border-black/[0.06] flex flex-wrap justify-center gap-x-10 gap-y-4">
                    {[
                        'Licensed Operation',
                        'Insured Vehicles',
                        'Verified Accommodations',
                        'Data Privacy Compliant',
                    ].map((item) => (
                        <span
                            key={item}
                            className="text-[10px] font-sans tracking-[0.18em] uppercase text-black/40 font-bold"
                        >
                            {item}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}
