'use client';

import { Star, Quote } from 'lucide-react';
import SectionHeading from './SectionHeading';

const testimonials = [
    {
        name: 'Charlotte & James',
        country: 'United Kingdom',
        quote: 'Yatara didn\'t just plan our honeymoon — they orchestrated a love letter to Sri Lanka. Every detail, from the private tuk-tuk through Galle Fort to sunrise at Sigiriya, was flawless.',
        rating: 5,
    },
    {
        name: 'Marc Delafosse',
        country: 'France',
        quote: 'As someone who has traveled extensively through Asia, I can say the level of personal attention Yatara provides is genuinely rare. Our guide felt like a friend, not a service.',
        rating: 5,
    },
    {
        name: 'Sarah Mitchell',
        country: 'Australia',
        quote: 'We had three children under 10 and Yatara made it effortless. The private vehicle, the curated kid-friendly stops, the concierge checking in daily — it was a dream.',
        rating: 5,
    },
    {
        name: 'Thomas & Anna Weber',
        country: 'Germany',
        quote: 'The fixed-price guarantee gave us peace of mind, and the itinerary exceeded our expectations in every way. We\'re already planning our return.',
        rating: 5,
    },
];

export default function SocialProof() {
    return (
        <section className="py-24 bg-deep-emerald text-off-white relative overflow-hidden">
            {/* Subtle decorative elements */}
            <div className="absolute top-0 left-0 w-80 h-80 bg-antique-gold/5 rounded-full blur-3xl -ml-40 -mt-40" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-antique-gold/5 rounded-full blur-3xl -mr-32 -mb-32" />

            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                <div className="text-center mb-16">
                    <span className="inline-block mb-4 text-xs tracking-[0.2em] font-medium text-antique-gold uppercase">
                        Trusted by Discerning Travelers
                    </span>
                    <h2 className="text-3xl md:text-5xl font-serif text-off-white leading-tight">
                        Voices from <span className="italic font-light">Our Guests</span>
                    </h2>
                    <div className="h-px w-24 bg-antique-gold mt-6 opacity-50 mx-auto" />
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                    {testimonials.map((t, idx) => (
                        <div
                            key={idx}
                            className="relative bg-white/5 backdrop-blur-sm border border-off-white/10 p-8 md:p-10 hover:bg-white/10 transition-all duration-500 group"
                        >
                            <Quote className="absolute top-6 right-6 w-8 h-8 text-antique-gold/15 group-hover:text-antique-gold/30 transition-colors duration-500" />

                            {/* Stars */}
                            <div className="flex gap-1 mb-5">
                                {Array.from({ length: t.rating }).map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-antique-gold text-antique-gold" />
                                ))}
                            </div>

                            <p className="text-off-white/80 font-light leading-relaxed mb-6 italic text-[15px]">
                                &ldquo;{t.quote}&rdquo;
                            </p>

                            <div>
                                <p className="text-antique-gold font-medium text-sm tracking-wide">{t.name}</p>
                                <p className="text-off-white/40 text-xs tracking-[0.15em] uppercase mt-1">{t.country}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Trust Indicators */}
                <div className="border-t border-off-white/10 pt-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
                        <div>
                            <p className="text-3xl font-serif text-antique-gold mb-2">500+</p>
                            <p className="text-xs tracking-[0.2em] uppercase text-off-white/50 font-light">Bespoke Journeys Crafted</p>
                        </div>
                        <div>
                            <p className="text-3xl font-serif text-antique-gold mb-2">4.9 / 5</p>
                            <p className="text-xs tracking-[0.2em] uppercase text-off-white/50 font-light">Average Guest Rating</p>
                        </div>
                        <div>
                            <p className="text-3xl font-serif text-antique-gold mb-2">12+</p>
                            <p className="text-xs tracking-[0.2em] uppercase text-off-white/50 font-light">Years of Excellence</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
