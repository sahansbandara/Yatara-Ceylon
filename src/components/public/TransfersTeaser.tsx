'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, PlaneLanding, BadgeDollarSign, Users, Headphones } from 'lucide-react';
import { transferCategoryCards } from '@/data/transfers';
import { useCurrency, formatPrice } from '@/lib/CurrencyContext';

/* ─── Only show 3 flagship categories on the homepage ─── */
const flagshipCategories = transferCategoryCards.slice(0, 3);

/* ─── Category-to-route mapping ─── */
const categoryRoutes: Record<string, string> = {
    airport: '/transfers/airport-concierge',
    intercity: '/transfers/intercity-executive',
    hourly: '/transfers/on-demand-chauffeur',
    safari: '/transfers/safari-national-park',
    evening: '/transfers/evening-event-chauffeur',
    'cruise-rail-vip': '/transfers/cruise-rail-vip',
};

/* ─── Trust pills ─── */
const trustPills = [
    { icon: PlaneLanding, label: 'Meet & Greet' },
    { icon: BadgeDollarSign, label: 'Fixed Pricing' },
    { icon: Users, label: 'Professional Chauffeurs' },
    { icon: Headphones, label: '24/7 Concierge' },
];

export default function TransfersTeaser() {
    const { currency, convertRate } = useCurrency();

    return (
        <section className="relative w-full overflow-hidden py-28 md:py-40 bg-[#E3EFE9] text-deep-emerald">
            {/* Background Pattern Overlay */}
            <div
                className="absolute inset-0 z-0 opacity-30 pointer-events-none mix-blend-multiply"
                style={{
                    backgroundImage: "url('/images/home/curated-bg-pattern.webp')",
                    backgroundSize: '400px',
                    backgroundPosition: 'top left',
                    backgroundRepeat: 'repeat'
                }}
            />
            {/* Subtle background accents */}
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-antique-gold/[0.03] rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-deep-emerald/[0.02] rounded-full blur-3xl" />

            <div className="max-w-[1400px] mx-auto px-6 lg:px-10 relative z-10">
                {/* ─── Section heading ─── */}
                <div className="text-center mb-8">
                    <span className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-deep-emerald/20 bg-white/50 backdrop-blur-md text-[10px] sm:text-xs tracking-[0.25em] font-nav text-deep-emerald uppercase mb-6 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-deep-emerald animate-pulse" />
                        Private Transfers
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-display text-deep-emerald mt-4 mb-6 leading-[1.1] font-bold">
                        Seamless Ground Transport{' '}
                        <br className="hidden md:block" />
                        <span className="italic font-light">Across Sri Lanka</span>
                    </h2>
                    <p className="text-base md:text-lg font-light text-gray-500 tracking-wide max-w-2xl mx-auto leading-relaxed">
                        Airport arrivals, intercity routes, and chauffeured day use — each transfer is designed for
                        comfort, punctuality, and privacy.
                    </p>
                </div>

                {/* ─── Trust pills ─── */}
                <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
                    {trustPills.map((pill) => {
                        const Icon = pill.icon;
                        return (
                            <div
                                key={pill.label}
                                className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-md border border-deep-emerald/10 shadow-sm rounded-full hover:bg-white transition-colors"
                            >
                                <Icon className="w-3.5 h-3.5 text-deep-emerald" />
                                <span className="text-deep-emerald/80 text-[11px] font-nav font-semibold tracking-wide uppercase">
                                    {pill.label}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* ─── 3 Flagship Cards ─── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
                    {flagshipCategories.map((cat) => {
                        const Icon = cat.icon;
                        const href = categoryRoutes[cat.slug] || '/transfers';

                        return (
                            <Link
                                key={cat.slug}
                                href={href}
                                className="group relative flex flex-col overflow-hidden min-h-[460px] lg:min-h-[520px] bg-[#021810] shadow-2xl transition-transform duration-700 ease-out hover:-translate-y-2 rounded-xl"
                            >
                                {/* Card Background Image */}
                                <Image
                                    src={cat.image}
                                    alt={cat.title}
                                    fill
                                    className="object-cover object-center transition-all duration-[2s] ease-out group-hover:scale-105 opacity-50 group-hover:opacity-75"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30 pointer-events-none transition-opacity duration-700 group-hover:from-black/80" />

                                <div className="relative z-10 flex flex-col h-full justify-between p-7 md:p-8">
                                    {/* Top: Icon */}
                                    <div className="flex justify-between items-start">
                                        <span className="inline-block px-3 py-1 bg-antique-gold/15 backdrop-blur-sm border border-antique-gold/25 rounded-full text-antique-gold text-[9px] font-nav font-semibold uppercase tracking-[0.2em]">
                                            {cat.bestFor}
                                        </span>
                                        <div className="w-11 h-11 rounded-full border border-white/15 flex items-center justify-center text-white bg-black/30 backdrop-blur-md group-hover:bg-antique-gold group-hover:border-transparent group-hover:text-[#043927] transition-all duration-500">
                                            <Icon className="w-5 h-5" strokeWidth={1.5} />
                                        </div>
                                    </div>

                                    {/* Bottom: Content */}
                                    <div>
                                        <h3 className="font-serif text-2xl lg:text-[1.7rem] text-white font-bold mb-3 leading-tight">
                                            {cat.title}
                                        </h3>
                                        <p className="text-white/60 text-sm font-nav leading-relaxed mb-5 line-clamp-2">
                                            {cat.subtitle}
                                        </p>

                                        {/* Info Bar */}
                                        <div className="border-t border-white/10 pt-4">
                                            <div className="grid grid-cols-3 gap-3 text-xs font-nav">
                                                <div>
                                                    <span className="text-antique-gold uppercase tracking-widest font-semibold block mb-1 text-[10px]">
                                                        From
                                                    </span>
                                                    <span className="text-white font-semibold">
                                                        {formatPrice(cat.startingFromLkr, currency, convertRate)}
                                                    </span>
                                                </div>
                                                <div className="text-center">
                                                    <span className="text-antique-gold uppercase tracking-widest font-semibold block mb-1 text-[10px]">
                                                        Duration
                                                    </span>
                                                    <span className="text-white/80">
                                                        {cat.typicalDuration}
                                                    </span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-antique-gold uppercase tracking-widest font-semibold block mb-1 text-[10px]">
                                                        View
                                                    </span>
                                                    <span className="text-white/80 group-hover:text-antique-gold transition-colors">
                                                        Explore →
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* ─── Bottom CTAs ─── */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/transfers"
                        className="inline-flex items-center gap-3 px-10 py-4 bg-deep-emerald text-white font-nav font-semibold uppercase tracking-[0.15em] text-sm rounded-lg hover:bg-antique-gold hover:text-deep-emerald transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                        Explore All Transfer Services
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                        href="/vehicles"
                        className="inline-flex items-center gap-2 px-10 py-4 border border-deep-emerald/30 text-deep-emerald font-nav font-semibold uppercase tracking-[0.15em] text-sm rounded-lg hover:border-deep-emerald hover:bg-deep-emerald/5 transition-all duration-300"
                    >
                        View Fleet
                    </Link>
                </div>
            </div>
        </section>
    );
}
