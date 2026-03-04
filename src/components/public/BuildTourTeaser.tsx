'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function BuildTourTeaser() {
    return (
        <section className="py-20 md:py-24 text-white overflow-hidden relative">
            {/* Luxury background: radial gradient + vignette */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        'radial-gradient(ellipse at 50% 40%, #065f3a 0%, #043927 55%, #02261a 100%)',
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
                        <span className="block text-[10px] tracking-[0.2em] font-nav text-antique-gold uppercase mb-5 font-semibold">
                            Bespoke Tour Builder
                        </span>

                        {/* Headline */}
                        <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-display leading-[1.08] mb-4">
                            Craft Your <span className="italic text-antique-gold font-light">Bespoke</span> Journey
                        </h2>

                        {/* Micro-proof line */}
                        <p className="text-white/50 font-light text-sm tracking-wide mb-8">
                            Handcrafted routes across Sri Lanka — refined by local specialists.
                        </p>

                        {/* Body paragraph */}
                        <p className="text-white/70 font-light text-base md:text-lg leading-relaxed mb-8 max-w-md">
                            Choose the regions you love, add signature experiences, and we refine your itinerary with the right pacing, stays, and transfers—so everything feels effortless from arrival to departure.
                        </p>

                        {/* Assurance bullets */}
                        <ul className="space-y-3.5 mb-10">
                            <li className="flex items-start gap-3 text-sm font-nav tracking-wider text-white/90">
                                <span className="block w-1.5 h-1.5 rounded-full bg-antique-gold mt-1.5 shrink-0" />
                                Private pacing — no rushed checklist days
                            </li>
                            <li className="flex items-start gap-3 text-sm font-nav tracking-wider text-white/90">
                                <span className="block w-1.5 h-1.5 rounded-full bg-antique-gold mt-1.5 shrink-0" />
                                Curated stays &amp; seamless transfers
                            </li>
                            <li className="flex items-start gap-3 text-sm font-nav tracking-wider text-white/90">
                                <span className="block w-1.5 h-1.5 rounded-full bg-antique-gold mt-1.5 shrink-0" />
                                Concierge refinement before you confirm
                            </li>
                        </ul>

                        {/* 2-path CTA */}
                        <div className="flex flex-col gap-4">
                            <Link
                                href="/build-tour"
                                className="inline-flex h-13 items-center justify-center px-10 bg-antique-gold hover:bg-white text-deep-emerald transition-colors duration-500 rounded-none font-nav font-semibold tracking-[0.2em] text-[10px] uppercase group w-fit"
                            >
                                Start Building Now
                                <ArrowRight className="w-4 h-4 ml-3 transition-transform duration-500 group-hover:translate-x-1" />
                            </Link>
                            <Link
                                href="/inquire?type=bespoke"
                                className="inline-flex items-center gap-2 text-white/60 hover:text-antique-gold transition-colors duration-300 font-nav text-[11px] tracking-[0.15em] uppercase group w-fit"
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
                        <div className="relative bg-[#0a1f15] rounded-xl shadow-2xl border border-white/[0.08] overflow-hidden">
                            {/* Browser chrome */}
                            <div className="h-9 border-b border-white/[0.06] flex items-center px-4 gap-1.5 bg-black/30">
                                <div className="w-2 h-2 rounded-full bg-white/15" />
                                <div className="w-2 h-2 rounded-full bg-white/15" />
                                <div className="w-2 h-2 rounded-full bg-white/15" />
                                <div className="ml-4 h-5 w-40 rounded bg-white/[0.06]" />
                            </div>

                            {/* Builder UI mock */}
                            <div className="relative aspect-[16/10] bg-[#122a1f]">
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
                                <div className="absolute top-5 left-5 w-44 bg-black/50 backdrop-blur-sm border border-white/[0.08] p-4 rounded-lg">
                                    <div className="text-[9px] font-nav uppercase tracking-widest text-antique-gold/80 mb-3">
                                        Your Itinerary
                                    </div>
                                    <div className="space-y-2.5">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-5 h-5 rounded-full bg-antique-gold/20 flex items-center justify-center text-[8px] text-antique-gold font-semibold">1</div>
                                            <span className="text-xs text-white/80">Colombo</span>
                                        </div>
                                        <div className="h-3 border-l border-dashed border-white/20 ml-2.5" />
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-5 h-5 rounded-full bg-antique-gold/20 flex items-center justify-center text-[8px] text-antique-gold font-semibold">2</div>
                                            <span className="text-xs text-white/80">Kandy</span>
                                        </div>
                                        <div className="h-3 border-l border-dashed border-white/20 ml-2.5" />
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-5 h-5 rounded-full bg-antique-gold/30 flex items-center justify-center text-[8px] text-antique-gold font-semibold">3</div>
                                            <span className="text-xs text-antique-gold">Galle Fort</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Destination card */}
                                <div className="absolute bottom-5 right-5 bg-white text-deep-emerald p-3.5 rounded-lg shadow-xl w-48">
                                    <Image
                                        src="/images/home/curated-southcoast.png"
                                        alt="Galle coast preview"
                                        width={200}
                                        height={100}
                                        className="w-full h-20 object-cover rounded mb-2.5"
                                    />
                                    <div className="font-display text-base leading-tight mb-0.5">Galle</div>
                                    <div className="text-[9px] font-nav uppercase tracking-widest text-deep-emerald/40">
                                        Added to route
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
