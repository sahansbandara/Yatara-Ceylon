'use client';

import { Map, Palette, Route } from 'lucide-react';

export default function QuickStartModes() {
    const scrollToId = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };
    const modes = [
        {
            icon: Map,
            title: 'Start from the Map',
            description: 'Already know your regions? Explore the interactive map and build your route.',
            cta: 'Explore Map',
            action: () => scrollToId('planner'),
            image: '/images/build-tour-mode-map.webp',
        },
        {
            icon: Palette,
            title: 'Start from a Travel Style',
            description: 'Tea trails, safari, heritage, honeymoon — pick a theme and we load the best stops.',
            cta: 'Choose a Style',
            action: () => scrollToId('themes'),
            image: '/images/build-tour-mode-style.webp',
        },
        {
            icon: Route,
            title: 'Start from a Ready Route',
            description: 'Load a curated itinerary loved by other travellers, then edit it freely.',
            cta: 'Load a Route',
            action: () => scrollToId('starter-plans'),
            image: '/images/build-tour-mode-route.webp',
        },
    ];

    return (
        <section className="py-12 bg-off-white relative">
            <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {modes.map((mode) => {
                        const Icon = mode.icon;
                        return (
                            <button
                                key={mode.title}
                                onClick={mode.action}
                                className="group rounded-2xl overflow-hidden relative flex flex-col h-[320px] sm:h-[380px] text-left shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:-translate-y-2 hover:shadow-[0_24px_54px_rgba(0,0,0,0.12)] transition-all duration-500 border border-white/10"
                            >
                                {/* Full Background Image */}
                                <div className="absolute inset-0 bg-black">
                                    <img
                                        src={mode.image}
                                        alt={mode.title}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[1.5s] ease-out opacity-90"
                                    />
                                    {/* Elite clean gradients */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
                                </div>

                                <div className="relative z-10 w-full p-8 flex flex-col h-full">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-auto group-hover:border-antique-gold/40 group-hover:bg-antique-gold/20 transition-all duration-500">
                                        <Icon className="w-5 h-5 text-white/90 group-hover:text-antique-gold transition-colors duration-500" />
                                    </div>

                                    <div className="mt-auto">
                                        <h3 className="font-display text-3xl text-white mb-2 group-hover:text-antique-gold transition-colors duration-500 leading-snug drop-shadow-md">
                                            {mode.title}
                                        </h3>
                                        <p className="text-white/80 text-[13px] font-light leading-relaxed mb-6 drop-shadow-sm max-w-[95%]">
                                            {mode.description}
                                        </p>
                                        <span className="text-white/60 group-hover:text-white text-[10px] uppercase tracking-[0.2em] font-semibold transition-colors duration-300 drop-shadow-sm inline-flex items-center gap-2">
                                            {mode.cta} <span className="text-antique-gold text-sm group-hover:translate-x-1 transition-transform">→</span>
                                        </span>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
