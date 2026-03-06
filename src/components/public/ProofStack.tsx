'use client';

import { ShieldCheck, Clock, BadgeCheck, Lock } from 'lucide-react';
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
    },
    {
        icon: Clock,
        title: 'Concierge SLA',
        headline: 'Response within 2 hours',
        description:
            'Your on-trip WhatsApp concierge is available around the clock. Route changes, restaurant bookings, and weather pivots—handled instantly.',
        badge: '24/7 Support',
    },
    {
        icon: ShieldCheck,
        title: 'Fixed-Price Guarantee',
        headline: 'No hidden fees, ever',
        description:
            'All-inclusive pricing with a detailed day-by-day breakdown before you confirm. What you see is what you pay—including transfers, stays, and experiences.',
        badge: 'Transparent Pricing',
    },
    {
        icon: Lock,
        title: 'Privacy & Discretion',
        headline: 'Your journey, your space',
        description:
            'Private transfers, exclusive access arrangements, and no shared group itineraries. Your travel details remain completely confidential.',
        badge: 'Private Service',
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
            className="relative overflow-hidden py-24 md:py-32 bg-[#043927] border-b border-white/[0.04]"
        >
            {/* Background gradient overlay */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        'radial-gradient(ellipse at 50% 40%, rgba(6, 95, 58, 0.4) 0%, rgba(4, 57, 39, 0.8) 55%, #02261a 100%)',
                }}
            />

            <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10">

                {/* Header */}
                <motion.div
                    style={{ opacity, y }}
                    className="text-center mb-16 md:mb-20 will-change-transform"
                >
                    <span className="block text-[10px] tracking-[0.2em] font-nav text-white/50 uppercase mb-4">
                        The Proof
                    </span>
                    <h2 className="text-4xl md:text-5xl font-display text-white leading-tight mb-4">
                        Why Travelers{' '}
                        <span className="italic font-light text-antique-gold">Trust Us</span>
                    </h2>
                    <p className="text-sm font-nav text-white/70 tracking-wide max-w-xl mx-auto">
                        Not marketing promises — operational commitments backed by policy.
                    </p>
                </motion.div>

                {/* 4-column grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {PROOF_PILLARS.map((pillar, idx) => (
                        <div
                            key={idx}
                            className="glass-hero-card group relative flex flex-col p-8 md:p-10 rounded-[20px]"
                        >
                            {/* Badge */}
                            <span className="absolute top-4 right-4 text-[8px] font-nav font-semibold tracking-[0.15em] uppercase text-antique-gold bg-antique-gold/[0.08] px-2.5 py-1 rounded-full border border-antique-gold/20">
                                {pillar.badge}
                            </span>

                            {/* Icon */}
                            <div className="mb-8">
                                <div className="w-12 h-12 rounded-full border border-antique-gold/25 flex items-center justify-center text-antique-gold group-hover:border-antique-gold group-hover:bg-antique-gold/10 transition-all duration-300">
                                    <pillar.icon className="w-5 h-5 group-hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]" strokeWidth={1.5} />
                                </div>
                            </div>

                            {/* Content */}
                            <h3 className="text-lg font-display text-white mb-1 tracking-wide group-hover:text-antique-gold transition-colors duration-300">
                                {pillar.title}
                            </h3>
                            <p className="text-sm font-semibold text-[#F6F3EE] mb-3">
                                {pillar.headline}
                            </p>
                            <p className="text-sm font-light leading-relaxed text-white/70">
                                {pillar.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Bottom assurance */}
                <div className="mt-14 pt-8 border-t border-white/[0.08] flex flex-wrap justify-center gap-x-10 gap-y-3">
                    {[
                        'Licensed Operation',
                        'Insured Vehicles',
                        'Verified Accommodations',
                        'Data Privacy Compliant',
                    ].map((item) => (
                        <span
                            key={item}
                            className="text-[10px] font-nav tracking-[0.18em] uppercase text-white/40 font-medium"
                        >
                            {item}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}
