'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Plane, Route, Clock } from 'lucide-react';

const teaserTiles = [
    {
        icon: Plane,
        title: 'Executive Airport Passage',
        description: 'Meet & greet, porter assistance, seamless arrival to vehicle.',
        href: '/transfers/airport-executive',
        image: '/images/transfers/teaser-airport.webp',
    },
    {
        icon: Route,
        title: 'Intercity Executive',
        description: 'Point-to-point luxury between signature destinations.',
        href: '/transfers/intercity-executive',
        image: '/images/transfers/teaser-intercity.webp',
    },
    {
        icon: Clock,
        title: 'On-Demand Chauffeur',
        description: 'Hourly retainers, multi-stop days, premium standby.',
        href: '/transfers/chauffeur-reserve',
        image: '/images/transfers/teaser-chauffeur.webp',
    },
];

export default function TransfersTeaser() {
    return (
        <section className="relative w-full overflow-hidden py-32 md:py-56 bg-[#043927]">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/transfers/transfers-teaser-bg.webp"
                    alt="Luxury Fleet Transfers"
                    fill
                    className="object-cover object-center opacity-30 mix-blend-luminosity transform scale-105"
                    quality={100}
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#021810]/100 via-transparent to-[#021810]/100" />
                <div className="absolute inset-0 bg-black/40" />
            </div>

            <div className="max-w-[1500px] mx-auto px-6 lg:px-10 relative z-10 flex flex-col items-center">
                {/* Section heading */}
                <div className="text-center mb-24 md:mb-32">
                    <span className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-antique-gold/20 bg-black/20 backdrop-blur-md text-[10px] sm:text-xs tracking-[0.25em] font-nav text-antique-gold uppercase mb-8 shadow-[0_0_20px_rgba(212,175,55,0.05)] text-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-antique-gold animate-pulse" />
                        Signature Experiences
                    </span>
                    <h2 className="text-6xl md:text-7xl lg:text-[7rem] font-display text-white mt-4 mb-8 leading-[1.1] drop-shadow-2xl font-light">
                        Transfers, <br className="md:hidden" /><span className="italic text-antique-gold font-serif">Elevated</span>
                    </h2>
                    <p className="text-lg md:text-xl font-nav text-white/70 tracking-wide max-w-3xl mx-auto leading-relaxed font-light">
                        Uncompromising luxury in motion. From exceptional airport arrivals to curated intercity voyages, our fleet redefines the art of travel.
                    </p>
                    <div className="w-px h-24 bg-gradient-to-b from-antique-gold/60 to-transparent mx-auto mt-16" />
                </div>

                {/* Three elite editorial cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 w-full mb-32">
                    {teaserTiles.map((tile, index) => (
                        <Link
                            key={tile.href}
                            href={tile.href}
                            className="group relative flex flex-col p-8 md:p-12 overflow-hidden min-h-[500px] lg:min-h-[650px] bg-[#021810] shadow-2xl transition-transform duration-[1.5s] ease-out hover:-translate-y-4"
                        >
                            {/* Card Background Image */}
                            <Image
                                src={tile.image}
                                alt={tile.title}
                                fill
                                className="object-cover object-center transition-all duration-[2s] ease-out pb-0 group-hover:scale-110 opacity-60 group-hover:opacity-100 mix-blend-luminosity group-hover:mix-blend-normal"
                                sizes="(max-width: 768px) 100vw, 33vw"
                            />
                            
                            {/* Dark vignette layers */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/80 pointer-events-none transition-opacity duration-1000 group-hover:opacity-70" />
                            
                            {/* Hover border effect */}
                            <div className="absolute inset-4 border border-white/10 group-hover:border-antique-gold/30 transition-colors duration-1000 pointer-events-none z-20" />

                            <div className="relative z-10 flex flex-col h-full justify-between">
                                {/* Top: Index & Icon */}
                                <div className="flex justify-between items-start w-full transform transition-all duration-1000 group-hover:translate-x-2">
                                    <span className="text-antique-gold/60 font-serif text-lg italic tracking-widest">0{index + 1}</span>
                                    <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white bg-black/40 backdrop-blur-md group-hover:bg-antique-gold group-hover:border-transparent group-hover:text-[#043927] transition-all duration-700 shadow-xl">
                                        <tile.icon className="w-5 h-5" strokeWidth={1.5} />
                                    </div>
                                </div>

                                {/* Bottom: Content sliding up */}
                                <div className="w-full transform transition-all duration-1000 group-hover:-translate-y-4">
                                    <h3 className="font-display text-3xl lg:text-4xl text-white mb-6 tracking-wide drop-shadow-xl font-light">
                                        {tile.title}
                                    </h3>
                                    
                                    <div className="overflow-hidden">
                                        <p className="text-white/60 text-sm md:text-base font-light leading-relaxed mb-8 drop-shadow-md transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-[1.2s] ease-out h-0 group-hover:h-auto">
                                            {tile.description}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4 text-antique-gold opacity-80 group-hover:opacity-100 transition-opacity duration-1000">
                                        <div className="h-px w-8 bg-antique-gold/50 group-hover:w-16 transition-all duration-1000 ease-out" />
                                        <span className="text-[10px] tracking-[0.2em] uppercase font-nav font-medium">Discover</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center">
                    <Link
                        href="/transfers"
                        className="glass-hero-cta relative overflow-hidden inline-flex items-center gap-3 px-12 py-5 rounded-none text-xs font-nav font-semibold tracking-[0.2em] uppercase no-underline group border border-antique-gold/40 hover:border-antique-gold/80 bg-black/40 backdrop-blur-xl transition-all duration-700 shadow-[0_0_30px_rgba(212,175,55,0.15)]"
                        style={{ color: '#F6F3EE' }}
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-antique-gold/0 via-antique-gold/20 to-antique-gold/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[1.5s] ease-in-out" />
                        <span className="relative z-10">Explore Our Fleet</span>
                        <ArrowRight className="w-4 h-4 text-antique-gold relative z-10 transition-transform duration-700 group-hover:translate-x-2" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
