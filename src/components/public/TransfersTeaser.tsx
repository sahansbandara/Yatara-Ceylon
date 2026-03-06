'use client';

import Link from 'next/link';
import { ArrowRight, Plane, Route, Clock } from 'lucide-react';

const teaserTiles = [
    {
        icon: Plane,
        title: 'Executive Airport Passage',
        description: 'Meet & greet, porter assistance, seamless arrival to vehicle.',
        href: '/transfers/airport-executive',
    },
    {
        icon: Route,
        title: 'Intercity Executive',
        description: 'Point-to-point luxury between signature destinations.',
        href: '/transfers/intercity-executive',
    },
    {
        icon: Clock,
        title: 'On-Demand Chauffeur',
        description: 'Hourly retainers, multi-stop days, premium standby.',
        href: '/transfers/chauffeur-reserve',
    },
];

export default function TransfersTeaser() {
    return (
        <section className="relative overflow-hidden py-24 md:py-32 bg-[#043927] border-b border-white/[0.04]">
            {/* Background gradient overlay */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        'radial-gradient(ellipse at 50% 40%, rgba(6, 95, 58, 0.4) 0%, rgba(4, 57, 39, 0.8) 55%, #02261a 100%)',
                }}
            />
            {/* Subtle background accents */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-antique-gold/[0.03] rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-antique-gold/[0.02] rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-[1400px] mx-auto px-6 lg:px-10 relative z-10">
                {/* Section heading */}
                <div className="text-center mb-16 md:mb-20">
                    <span className="block text-[10px] tracking-[0.2em] font-nav text-white/50 uppercase mb-4">
                        Private Transport
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-5xl font-display text-white mt-4 mb-5">
                        Transfers, <span className="italic font-light text-antique-gold">Elevated</span>
                    </h2>
                    <p className="text-sm font-nav text-white/70 tracking-wide max-w-xl mx-auto leading-relaxed">
                        Premium vehicles, licensed chauffeurs, and 24/7 concierge — from airport arrival to every destination along the way.
                    </p>
                    <div className="h-px w-20 bg-antique-gold/30 mx-auto mt-10" />
                </div>

                {/* Three tiles */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-14">
                    {teaserTiles.map((tile) => (
                        <Link
                            key={tile.href}
                            href={tile.href}
                            className="glass-hero-card group relative p-8 md:p-10 rounded-[20px]"
                        >
                            {/* Icon */}
                            <div className="mb-8">
                                <div className="w-12 h-12 rounded-full border border-antique-gold/25 flex items-center justify-center text-antique-gold group-hover:border-antique-gold group-hover:bg-antique-gold/10 transition-all duration-300">
                                    <tile.icon className="w-5 h-5 group-hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]" strokeWidth={1.5} />
                                </div>
                            </div>

                            <h3 className="font-display text-xl text-white mb-3 tracking-wide group-hover:text-antique-gold transition-colors duration-300">
                                {tile.title}
                            </h3>
                            <p className="text-white/70 text-sm font-light leading-relaxed mb-6">
                                {tile.description}
                            </p>
                            <div className="flex items-center gap-2 text-antique-gold/70 group-hover:text-antique-gold transition-colors duration-300">
                                <span className="text-[10px] tracking-[0.2em] uppercase font-nav font-medium">Explore</span>
                                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                            </div>
                        </Link>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center mt-12 md:mt-16">
                    <Link
                        href="/transfers"
                        className="glass-hero-cta inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-[11px] font-nav font-semibold tracking-[0.2em] uppercase no-underline group"
                        style={{ color: '#F6F3EE' }}
                    >
                        Explore All Transfers
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
