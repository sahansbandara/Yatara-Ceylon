'use client';

import { Map, Palette, Route } from 'lucide-react';

interface QuickStartModesProps {
    onScrollToBuilder: () => void;
    onScrollToThemes: () => void;
    onScrollToStarters: () => void;
}

export default function QuickStartModes({ onScrollToBuilder, onScrollToThemes, onScrollToStarters }: QuickStartModesProps) {
    const modes = [
        {
            icon: Map,
            title: 'Start from the Map',
            description: 'Already know your regions? Explore the interactive map and build your route directly.',
            cta: 'Explore Map',
            action: onScrollToBuilder,
        },
        {
            icon: Palette,
            title: 'Start from a Travel Style',
            description: 'Tea trails, safari, heritage, honeymoon — pick a theme and we load the best stops.',
            cta: 'Choose a Style',
            action: onScrollToThemes,
        },
        {
            icon: Route,
            title: 'Start from a Ready Route',
            description: 'Load a curated itinerary loved by other travellers, then edit it freely.',
            cta: 'Load a Route',
            action: onScrollToStarters,
        },
    ];

    return (
        <section className="py-8 bg-[#0a0f0d] relative">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {modes.map((mode) => {
                        const Icon = mode.icon;
                        return (
                            <button
                                key={mode.title}
                                onClick={mode.action}
                                className="quick-start-card rounded-2xl p-5 text-left group"
                            >
                                <div className="relative z-10">
                                    <div className="w-10 h-10 rounded-xl bg-antique-gold/8 border border-antique-gold/15 flex items-center justify-center mb-3 group-hover:border-antique-gold/40 group-hover:bg-antique-gold/15 transition-all duration-500">
                                        <Icon className="w-5 h-5 text-antique-gold/60 group-hover:text-antique-gold transition-colors duration-500" />
                                    </div>
                                    <h3 className="font-serif text-sm text-white/85 mb-1.5 group-hover:text-white transition-colors">
                                        {mode.title}
                                    </h3>
                                    <p className="text-white/30 text-[10px] font-light leading-relaxed mb-3">
                                        {mode.description}
                                    </p>
                                    <span className="text-antique-gold/60 text-[9px] uppercase tracking-[0.2em] font-serif group-hover:text-antique-gold transition-colors">
                                        {mode.cta} →
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
