'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const quotes = [
    {
        text: "The difference between a good trip and an unforgettable one is the people. Yatara's network in Sri Lanka gave us access we never could have arranged ourselves.",
        author: "Sarah & David M.",
        label: "Bespoke Cultural Tour, 2024"
    },
    {
        text: "Immaculate planning, exquisite properties, and a guide who felt like a friend possessing encyclopedic knowledge of the island's wildlife.",
        author: "Jonathan R.",
        label: "Luxury Safari Circuit, 2025"
    }
];

export default function ExperiencesCarousel() {
    const [current, setCurrent] = useState(0);

    const next = () => setCurrent((c) => (c + 1) % quotes.length);
    const prev = () => setCurrent((c) => (c - 1 + quotes.length) % quotes.length);

    return (
        <section className="relative h-[800px] w-full bg-deep-emerald flex items-center justify-center overflow-hidden">
            {/* Full-bleed background */}
            <div className="absolute inset-0 w-full h-full z-0">
                <Image
                    src="/images/home/curated-hillcountry.png" // Placeholder scenic
                    alt="Scenic Sri Lanka"
                    fill
                    sizes="100vw"
                    className="object-cover scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-deep-emerald/90 via-[#0a1f15]/70 to-[#0a1f15]/95" />
            </div>

            {/* Giant watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none z-10 select-none">
                <span className="font-display text-[15rem] md:text-[25rem] text-white tracking-tighter leading-none whitespace-nowrap blur-sm">
                    MOMENTS
                </span>
            </div>

            {/* Quote Carousel */}
            <div className="relative z-20 max-w-4xl mx-auto px-6 text-center">
                <Quote className="w-12 h-12 text-antique-gold/40 mx-auto justify-center mb-10" />

                <div className="relative h-[250px] md:h-[200px] flex items-center justify-center">
                    {quotes.map((q, idx) => (
                        <div
                            key={idx}
                            className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${current === idx
                                    ? 'opacity-100 translate-y-0 visible shadow-none'
                                    : 'opacity-0 translate-y-8 invisible'
                                }`}
                        >
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-display text-white leading-relaxed mb-10 tracking-wide font-light">
                                "{q.text}"
                            </h2>
                            <div>
                                <p className="text-[11px] font-nav font-semibold tracking-[0.2em] text-antique-gold uppercase">
                                    {q.author}
                                </p>
                                <p className="text-[10px] font-nav text-white/50 tracking-widest uppercase mt-2">
                                    {q.label}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Controls */}
                <div className="flex justify-center gap-6 mt-16">
                    <button onClick={prev} className="p-3 rounded-full border border-white/20 text-white/50 hover:text-white hover:border-white transition-all">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={next} className="p-3 rounded-full border border-white/20 text-white/50 hover:text-white hover:border-white transition-all">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </section>
    );
}
