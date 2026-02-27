import { Star, Quote } from 'lucide-react';
import { testimonials, trustStats } from '@/data/testimonials';

export default function BuildTourTestimonials() {
    return (
        <section className="py-20 bg-gradient-to-b from-[#0a0f0d] to-deep-emerald/40 relative">
            <div className="section-container">
                {/* Header */}
                <div className="text-center mb-14">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="h-px w-12 bg-antique-gold/30" />
                        <span className="text-antique-gold text-[10px] tracking-[0.3em] uppercase font-serif">
                            Guest Stories
                        </span>
                        <div className="h-px w-12 bg-antique-gold/30" />
                    </div>
                    <h2 className="font-display text-3xl sm:text-4xl text-white mb-3">
                        Trusted by Discerning Travellers
                    </h2>
                </div>

                {/* Trust stats */}
                <div className="flex items-center justify-center gap-8 sm:gap-16 mb-14">
                    {trustStats.map((stat) => (
                        <div key={stat.label} className="text-center">
                            <p className="text-antique-gold font-serif text-2xl sm:text-3xl font-semibold">
                                {stat.isFloat ? stat.value.toFixed(1) : stat.value}
                                <span className="text-antique-gold/50 text-lg">{stat.suffix}</span>
                            </p>
                            <p className="text-white/30 text-[9px] sm:text-[10px] uppercase tracking-wider mt-1">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Testimonial cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
                    {testimonials.slice(0, 3).map((t, idx) => (
                        <div
                            key={t.name}
                            className="relative p-6 rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:border-antique-gold/15 transition-all duration-500 group"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            {/* Quote glyph */}
                            <Quote className="w-8 h-8 text-antique-gold/10 mb-4 group-hover:text-antique-gold/20 transition-colors" />

                            {/* Stars */}
                            <div className="flex gap-0.5 mb-3">
                                {Array.from({ length: t.rating }).map((_, i) => (
                                    <Star key={i} className="w-3 h-3 text-antique-gold fill-antique-gold" />
                                ))}
                            </div>

                            {/* Quote */}
                            <p className="text-white/50 text-xs font-light leading-relaxed mb-5 line-clamp-4">
                                &ldquo;{t.quote}&rdquo;
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-antique-gold/10 border border-antique-gold/20 flex items-center justify-center">
                                    <span className="text-antique-gold font-serif text-[10px] font-semibold">
                                        {t.name.charAt(0)}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-white/70 text-xs font-serif">{t.name}</p>
                                    <p className="text-white/25 text-[9px]">{t.country}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
