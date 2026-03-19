'use client';

import { MapPin, Sparkles, Map, Route, Users } from 'lucide-react';

export default function BuildTourHero() {
    const scrollToBuilder = () => {
        document.getElementById('trip-builder')?.scrollIntoView({ behavior: 'smooth' });
    };

    const scrollToStarters = () => {
        document.getElementById('starter-plans')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="relative w-full h-[38vh] min-h-[300px] max-h-[380px] overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: 'url(/images/build-tour-hero.jpg)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f0d]/80 via-[#0a0f0d]/50 to-[#0a0f0d]" />
                {/* Topographic texture */}
                <div
                    className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 sm:px-6">
                {/* Eyebrow */}
                <div className="flex items-center gap-2 mb-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <div className="h-px w-8 bg-antique-gold/50" />
                    <span className="text-antique-gold text-[10px] sm:text-xs tracking-[0.3em] uppercase font-serif">
                        Bespoke Tour Planner
                    </span>
                    <div className="h-px w-8 bg-antique-gold/50" />
                </div>

                {/* Headline */}
                <h1
                    className="font-display text-3xl sm:text-4xl lg:text-5xl text-white leading-[1.1] mb-3 max-w-3xl animate-fade-in-up"
                    style={{ animationDelay: '0.2s' }}
                >
                    Build a Smarter
                    <span className="block gradient-text-gold mt-0.5">Sri Lanka Journey</span>
                </h1>

                {/* Subhead — sharper, product-led */}
                <p
                    className="text-white/45 text-xs sm:text-sm font-light max-w-xl mb-5 leading-relaxed animate-fade-in-up"
                    style={{ animationDelay: '0.3s' }}
                >
                    Explore the island visually, choose regions with confidence, and shape a polished route
                    with pacing, transfers, and concierge-ready planning built in.
                </p>

                {/* CTAs */}
                <div
                    className="flex flex-col sm:flex-row items-center gap-3 animate-fade-in-up"
                    style={{ animationDelay: '0.4s' }}
                >
                    <button
                        onClick={scrollToBuilder}
                        className="flex items-center gap-2.5 px-7 py-3 bg-antique-gold text-deep-emerald font-serif text-xs uppercase tracking-[0.2em] rounded-lg hover:shadow-lg hover:shadow-antique-gold/30 hover:scale-[1.02] transition-all duration-300 font-semibold"
                    >
                        <MapPin className="w-4 h-4" />
                        Start Planning
                    </button>
                    <button
                        onClick={scrollToStarters}
                        className="flex items-center gap-2 px-5 py-3 border border-white/20 text-white/70 font-serif text-xs uppercase tracking-[0.2em] rounded-lg hover:border-antique-gold/40 hover:text-white transition-all duration-300"
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        Use a Starter Route
                    </button>
                </div>

                {/* Trust pills row */}
                <div
                    className="flex items-center flex-wrap justify-center gap-3 sm:gap-5 mt-5 animate-fade-in-up"
                    style={{ animationDelay: '0.5s' }}
                >
                    {[
                        { icon: Map, label: 'Interactive Map' },
                        { icon: Route, label: 'Smart Route Logic' },
                        { icon: MapPin, label: 'Transfer-Ready' },
                        { icon: Users, label: 'Concierge Refinement' },
                    ].map((pill) => (
                        <div key={pill.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/8 bg-white/[0.03]">
                            <pill.icon className="w-3 h-3 text-antique-gold/50" />
                            <span className="text-white/30 text-[9px] uppercase tracking-wider font-nav">{pill.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
