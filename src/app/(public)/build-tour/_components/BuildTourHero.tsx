'use client';

import Image from 'next/image';
import { MapPin, Sparkles } from 'lucide-react';

export default function BuildTourHero() {
    const scrollToBuilder = () => {
        document.getElementById('trip-builder')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="relative w-full h-[70vh] min-h-[500px] max-h-[700px] overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="/images/build-tour-hero.jpg"
                    alt="Aerial view of Sri Lanka's coastline"
                    fill
                    priority
                    className="object-cover"
                    sizes="100vw"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f0d]/70 via-[#0a0f0d]/40 to-[#0a0f0d]" />
                {/* Topographic texture overlay */}
                <div
                    className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 sm:px-6">
                {/* Eyebrow */}
                <div className="flex items-center gap-2 mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <div className="h-px w-8 bg-antique-gold/50" />
                    <span className="text-antique-gold text-[10px] sm:text-xs tracking-[0.3em] uppercase font-serif">
                        Bespoke Trip Builder
                    </span>
                    <div className="h-px w-8 bg-antique-gold/50" />
                </div>

                {/* Headline */}
                <h1
                    className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.1] mb-5 max-w-3xl animate-fade-in-up"
                    style={{ animationDelay: '0.2s' }}
                >
                    Craft Your
                    <span className="block gradient-text-gold mt-1">Perfect Journey</span>
                </h1>

                {/* Subhead */}
                <p
                    className="text-white/50 text-sm sm:text-base font-light max-w-xl mb-8 leading-relaxed animate-fade-in-up"
                    style={{ animationDelay: '0.3s' }}
                >
                    Select destinations on our interactive map. Drag to reorder.
                    We&apos;ll calculate your route and hand it to a personal curator.
                </p>

                {/* CTAs */}
                <div
                    className="flex flex-col sm:flex-row items-center gap-3 animate-fade-in-up"
                    style={{ animationDelay: '0.4s' }}
                >
                    <button
                        onClick={scrollToBuilder}
                        className="flex items-center gap-2.5 px-8 py-3.5 bg-antique-gold text-deep-emerald font-serif text-xs uppercase tracking-[0.2em] rounded-lg hover:shadow-lg hover:shadow-antique-gold/30 hover:scale-[1.02] transition-all duration-300 font-semibold"
                    >
                        <MapPin className="w-4 h-4" />
                        Start Building
                    </button>
                    <a
                        href="/inquire"
                        className="flex items-center gap-2 px-6 py-3 border border-white/20 text-white/70 font-serif text-xs uppercase tracking-[0.2em] rounded-lg hover:border-antique-gold/40 hover:text-white transition-all duration-300"
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        Request a Proposal
                    </a>
                </div>

                {/* Stats row */}
                <div
                    className="flex items-center gap-6 sm:gap-10 mt-10 animate-fade-in-up"
                    style={{ animationDelay: '0.5s' }}
                >
                    {[
                        { value: '68+', label: 'Curated Places' },
                        { value: '25', label: 'Districts' },
                        { value: '10', label: 'Categories' },
                    ].map((stat) => (
                        <div key={stat.label} className="text-center">
                            <p className="text-antique-gold font-serif text-lg sm:text-xl font-semibold">
                                {stat.value}
                            </p>
                            <p className="text-white/30 text-[9px] sm:text-[10px] uppercase tracking-wider mt-0.5">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-float-soft">
                <div className="w-6 h-10 border border-white/20 rounded-full flex justify-center pt-2">
                    <div className="w-1 h-2 bg-antique-gold/60 rounded-full animate-pulse" />
                </div>
            </div>
        </section>
    );
}
