'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';

const testimonials = [
    {
        quote: "Every detail was flawless. Yatara understood exactly what we wanted from our honeymoon and delivered beyond expectation.",
        author: "Eleanor & James",
        location: "London, UK",
        rating: 5,
        image: "/images/home/curated-southcoast.png" // placeholder
    },
    {
        quote: "The private access to landmarks and the knowledge of our guide transformed a good trip into a life-changing expedition.",
        author: "Marcus T.",
        location: "Sydney, AU",
        rating: 5,
        image: "/images/home/curated-kingdoms.png" // placeholder
    }
];

export default function SocialProof() {
    return (
        <section className="py-20 md:py-24 bg-white border-t border-b border-black/[0.03]">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
                {/* Logo Strip */}
                <div className="mb-20">
                    <p className="text-center text-[10px] tracking-[0.2em] font-nav font-semibold text-deep-emerald/40 uppercase mb-8">
                        Recognized For Excellence
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 grayscale">
                        {/* Placeholder Logos - use real SVGs in production */}
                        <div className="h-8 w-32 bg-gray-300 rounded-sm" />
                        <div className="h-8 w-32 bg-gray-300 rounded-sm" />
                        <div className="h-8 w-32 bg-gray-300 rounded-sm" />
                        <div className="h-8 w-32 bg-gray-300 rounded-sm" />
                    </div>
                </div>

                {/* Testimonials */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">

                    {/* Intro / CTA Side */}
                    <div className="max-w-md">
                        <span className="block text-[10px] tracking-[0.2em] font-nav text-deep-emerald/50 uppercase mb-4">
                            Client Experiences
                        </span>
                        <h2 className="text-3xl md:text-4xl font-display text-deep-emerald leading-tight mb-6">
                            Don't Just Take Our <span className="italic font-light">Word For It</span>
                        </h2>
                        <p className="text-deep-emerald/60 font-light text-sm leading-relaxed mb-8">
                            Over 500 successful itineraries crafted for the world's most discerning travelers. Discover why 98% of our clients return for their next Asian journey.
                        </p>
                        <Link
                            href="/inquire"
                            className="inline-flex items-center gap-3 text-[10px] tracking-[0.2em] font-nav font-semibold text-deep-emerald hover:text-antique-gold uppercase transition-colors group"
                        >
                            Read More Stories
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>

                    {/* Cards Side */}
                    <div className="grid gap-6">
                        {testimonials.map((t, idx) => (
                            <div key={idx} className="bg-[#f9f9f9] p-8 rounded-md border border-black/[0.03] group hover:shadow-lg transition-all duration-500">
                                <div className="flex gap-1 mb-4">
                                    {[...Array(t.rating)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 text-antique-gold fill-antique-gold" />
                                    ))}
                                </div>
                                <p className="text-deep-emerald/80 font-display text-lg leading-relaxed mb-6 italic">
                                    "{t.quote}"
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-500">
                                        <Image
                                            src={t.image}
                                            alt={t.author}
                                            fill
                                            className="object-cover"
                                            sizes="48px"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-nav font-semibold uppercase tracking-wider text-deep-emerald">
                                            {t.author}
                                        </h4>
                                        <p className="text-[10px] font-nav text-deep-emerald/50 tracking-wider">
                                            {t.location}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
