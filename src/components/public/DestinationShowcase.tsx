'use client';

import Image from 'next/image';
import { MapPin, Mountain, Waves, TreePine, Landmark, Sun } from 'lucide-react';

const highlights = [
    { icon: Landmark, value: '8', label: 'UNESCO Heritage Sites' },
    { icon: TreePine, value: '26', label: 'National Parks' },
    { icon: Waves, value: '1,340 km', label: 'Coastline' },
    { icon: Mountain, value: '2,524 m', label: 'Highest Peak' },
    { icon: Sun, value: '365', label: 'Days of Adventure' },
    { icon: MapPin, value: '25', label: 'Curated Districts' },
];

const destinations = [
    { name: 'Sigiriya', image: '/dest_sigiriya_1772209095319.png' },
    { name: 'Galle', image: '/dest_galle_1772208964474.png' },
    { name: 'Ella', image: '/dest_ella_1772208997823.png' },
    { name: 'Colombo', image: '/dest_colombo_1772208944465.png' },
    { name: 'Trincomalee', image: '/dest_trincomalee_1772209175854.png' },
    { name: 'Nuwara Eliya', image: '/dest_nuwara_eliya_1772209058658.png' },
    { name: 'Yala', image: '/dest_yala_1772209015430.png' },
    { name: 'Anuradhapura', image: '/dest_anuradhapura_1772209111479.png' },
];

export default function DestinationShowcase() {
    return (
        <section className="relative overflow-hidden">
            {/* Why Sri Lanka — Full-width background image section */}
            <div className="relative py-32">
                {/* Background image */}
                <div className="absolute inset-0">
                    <Image
                        src="/images/home/curated-kingdoms.png"
                        alt="Sri Lanka aerial view"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-deep-emerald/85" />
                    <div className="absolute inset-0 bg-gradient-to-b from-deep-emerald/40 via-transparent to-deep-emerald/90" />
                </div>

                <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 text-off-white">
                    <div className="text-center mb-20">
                        <span className="inline-block mb-4 text-xs tracking-[0.3em] font-medium text-antique-gold uppercase">
                            The Pearl of the Indian Ocean
                        </span>
                        <h2 className="text-4xl md:text-6xl font-display text-off-white leading-tight">
                            Why <span className="italic font-light text-antique-gold">Sri Lanka</span>?
                        </h2>
                        <p className="text-off-white/60 font-light max-w-2xl mx-auto mt-6 text-[15px] leading-relaxed">
                            A compact island with extraordinary diversity — ancient civilizations, tropical rainforests,
                            pristine beaches, and endemic wildlife, all within a few hours of each other.
                        </p>
                    </div>

                    {/* Stats Grid — Glassmorphic cards */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
                        {highlights.map((h, idx) => (
                            <div key={idx} className="group relative rounded-2xl p-6 text-center bg-white/5 backdrop-blur-md border border-white/10 hover:border-antique-gold/30 hover:bg-white/10 transition-all duration-500">
                                {/* Glow effect on hover */}
                                <div className="absolute inset-0 rounded-2xl bg-antique-gold/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 scale-125" />

                                <div className="w-12 h-12 rounded-xl bg-antique-gold/10 border border-antique-gold/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-antique-gold/20 group-hover:border-antique-gold/40 transition-all duration-500">
                                    <h.icon className="w-5 h-5 text-antique-gold" strokeWidth={1.5} />
                                </div>
                                <p className="text-2xl font-display text-off-white mb-1">{h.value}</p>
                                <p className="text-[10px] tracking-[0.15em] uppercase text-off-white/40 font-light">{h.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Auto-scrolling Destination Strip */}
            <div className="bg-deep-emerald py-10 overflow-hidden">
                <div className="marquee-strip">
                    {[...destinations, ...destinations].map((dest, idx) => (
                        <div key={idx} className="flex-shrink-0 w-[300px] mx-3 group relative rounded-2xl overflow-hidden h-[220px]">
                            <Image
                                src={dest.image}
                                alt={dest.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-deep-emerald/80 via-transparent to-transparent" />
                            <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between">
                                <p className="text-white font-display text-lg tracking-wide">{dest.name}</p>
                                <div className="w-7 h-7 rounded-full border border-white/30 flex items-center justify-center text-white/60 group-hover:text-antique-gold group-hover:border-antique-gold/50 transition-all">
                                    <MapPin className="w-3.5 h-3.5" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
