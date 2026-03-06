'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function BuildTourTeaser() {
    return (
        <section className="relative overflow-hidden py-24 md:py-32 bg-[#043927] border-b border-white/[0.04] text-white">
            {/* Background gradient overlay */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        'radial-gradient(ellipse at 50% 40%, rgba(6, 95, 58, 0.4) 0%, rgba(4, 57, 39, 0.8) 55%, #02261a 100%)',
                }}
            />
            {/* Subtle noise texture overlay */}
            <div
                className="absolute inset-0 opacity-[0.035] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat',
                    backgroundSize: '128px 128px',
                }}
            />
            {/* Soft vignette */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        'radial-gradient(ellipse at center, transparent 40%, rgba(2,20,12,0.45) 100%)',
                }}
            />

            <div className="max-w-[1400px] mx-auto px-6 lg:px-10 relative z-10 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Left Copy */}
                    <div className="max-w-lg">
                        {/* Eyebrow */}
                        <span className="block text-[10px] tracking-[0.2em] font-nav text-white/50 uppercase mb-5 font-semibold">
                            Bespoke Tour Builder
                        </span>

                        {/* Headline */}
                        <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-display text-white leading-[1.08] mb-4">
                            Craft Your <span className="italic font-light text-antique-gold">Bespoke</span> Journey
                        </h2>

                        {/* Micro-proof line */}
                        <p className="text-sm font-nav text-white/70 tracking-wide mb-8">
                            Handcrafted routes across Sri Lanka — refined by local specialists.
                        </p>

                        {/* Body paragraph */}
                        <p className="text-white/70 font-light text-base md:text-lg leading-relaxed mb-8 max-w-md">
                            Choose the regions you love, add signature experiences, and we refine your itinerary with the right pacing, stays, and transfers—so everything feels effortless from arrival to departure.
                        </p>

                        {/* Assurance bullets */}
                        <ul className="space-y-3.5 mb-10">
                            <li className="flex items-start gap-3 text-sm font-nav tracking-wider text-[#F6F3EE]">
                                <span className="block w-1.5 h-1.5 rounded-full bg-antique-gold mt-1.5 shrink-0" />
                                Private pacing — no rushed checklist days
                            </li>
                            <li className="flex items-start gap-3 text-sm font-nav tracking-wider text-[#F6F3EE]">
                                <span className="block w-1.5 h-1.5 rounded-full bg-antique-gold mt-1.5 shrink-0" />
                                Curated stays &amp; seamless transfers
                            </li>
                            <li className="flex items-start gap-3 text-sm font-nav tracking-wider text-[#F6F3EE]">
                                <span className="block w-1.5 h-1.5 rounded-full bg-antique-gold mt-1.5 shrink-0" />
                                Concierge refinement before you confirm
                            </li>
                        </ul>

                        {/* 2-path CTA */}
                        <div className="flex flex-col gap-6">
                            <Link
                                href="/build-tour"
                                className="glass-hero-cta inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-[11px] font-nav font-semibold tracking-[0.2em] uppercase no-underline group w-fit"
                                style={{ color: '#F6F3EE' }}
                            >
                                Start Building Now
                                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                            </Link>
                            <Link
                                href="/inquire?type=bespoke"
                                className="inline-flex items-center gap-2 text-white/60 hover:text-antique-gold transition-colors duration-300 font-nav text-[10px] tracking-[0.15em] uppercase group w-fit font-semibold"
                            >
                                Prefer concierge planning? Inquire
                                <ArrowRight className="w-3 h-3 transition-transform duration-500 group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>

                    {/* Right Visual — Single Premium Frame */}
                    <div className="relative w-full max-w-[580px] mx-auto lg:ml-auto">
                        {/* Soft shadow behind the frame */}
                        <div className="absolute -inset-6 rounded-2xl bg-black/20 blur-3xl pointer-events-none" />

                        {/* Single clean device frame */}
                        <div className="glass-hero-card group relative rounded-xl overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-1">
                            {/* Browser chrome */}
                            <div className="h-9 border-b border-white/[0.08] flex items-center px-4 gap-1.5 bg-white/[0.03]">
                                <div className="w-2 h-2 rounded-full bg-white/20 group-hover:bg-white/40 transition-colors duration-500" />
                                <div className="w-2 h-2 rounded-full bg-white/20 group-hover:bg-white/40 transition-colors duration-500" />
                                <div className="w-2 h-2 rounded-full bg-white/20 group-hover:bg-white/40 transition-colors duration-500" />
                                <div className="ml-4 h-5 w-40 rounded bg-white/[0.08]" />
                            </div>

                            {/* Builder UI mock */}
                            <div className="relative aspect-[16/10] bg-transparent">
                                {/* Subtle map grid */}
                                <div
                                    className="absolute inset-0 opacity-20"
                                    style={{
                                        backgroundImage:
                                            'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)',
                                        backgroundSize: '20px 20px',
                                    }}
                                />

                                {/* Itinerary sidebar */}
                                <div className="absolute top-5 left-5 w-48 bg-black/40 backdrop-blur-md border border-white/[0.1] p-5 rounded-xl shadow-lg">
                                    <div className="text-[9px] font-nav uppercase tracking-widest text-antique-gold mb-4 font-semibold">
                                        Your Itinerary
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full border border-antique-gold/30 bg-antique-gold/10 flex items-center justify-center text-[9px] text-antique-gold font-semibold">1</div>
                                            <span className="text-xs text-white/90">Colombo</span>
                                        </div>
                                        <div className="h-4 border-l border-dashed border-white/20 ml-3" />
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full border border-antique-gold/30 bg-antique-gold/10 flex items-center justify-center text-[9px] text-antique-gold font-semibold">2</div>
                                            <span className="text-xs text-white/90">Kandy</span>
                                        </div>
                                        <div className="h-4 border-l border-dashed border-white/20 ml-3" />
                                        <div className="flex items-center gap-3 group/item">
                                            <div className="w-6 h-6 rounded-full border border-antique-gold bg-antique-gold/20 flex items-center justify-center text-[9px] text-antique-gold font-semibold shadow-[0_0_10px_rgba(212,175,55,0.3)]">3</div>
                                            <span className="text-xs text-antique-gold font-medium">Galle Fort</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Destination card */}
                                <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-md p-3.5 rounded-xl shadow-2xl w-52 overflow-hidden border border-white/20 group-hover:shadow-[0_15px_35px_rgba(0,0,0,0.4)] transition-all duration-500">
                                    <div className="relative overflow-hidden rounded-lg mb-3">
                                        <Image
                                            src="/images/home/curated-southcoast.png"
                                            alt="Galle coast preview"
                                            width={200}
                                            height={100}
                                            className="w-full h-24 object-cover transform scale-100 group-hover:scale-110 transition-transform duration-[2s] ease-out"
                                        />
                                    </div>
                                    <div className="font-display text-lg text-deep-emerald leading-tight mb-1">Galle</div>
                                    <div className="flex items-center justify-between">
                                        <div className="text-[9px] font-nav uppercase tracking-widest text-deep-emerald/50 font-semibold">
                                            Added to route
                                        </div>
                                        <div className="w-4 h-4 rounded-full bg-deep-emerald/5 flex items-center justify-center">
                                            <ArrowRight className="w-2.5 h-2.5 text-deep-emerald/70" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
