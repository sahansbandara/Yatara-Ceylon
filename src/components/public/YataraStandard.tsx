'use client';

import Image from 'next/image';
import { Shield, Gem, UserCheck, Clock, Check } from 'lucide-react';

const standards = [
    {
        icon: UserCheck,
        title: 'Verified Private Drivers',
        description: 'Chauffeur-guides rigorously vetted for absolute discretion, safety, and deep local expertise.',
    },
    {
        icon: Gem,
        title: 'Bespoke Planning',
        description: 'Every detail meticulously curated to your exact pace and preferences, ensuring a flawless journey.',
    },
    {
        icon: Clock,
        title: '24/7 Concierge',
        description: 'Round-the-clock dedicated support from our island specialists for complete peace of mind.',
    },
    {
        icon: Shield,
        title: 'Fixed-Price Guarantee',
        description: 'Transparent, premium pricing with zero hidden fees. Pure luxury without compromise.',
    }
];

export default function YataraStandard() {
    return (
        <section className="py-32 bg-off-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left — Image */}
                    <div className="relative">
                        <div className="relative rounded-2xl overflow-hidden aspect-[4/5] shadow-2xl">
                            <Image
                                src="/images/home/heritage-story.png"
                                alt="Yatara Ceylon luxury service"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-deep-emerald/60 via-transparent to-transparent" />

                            {/* Glass overlay badge */}
                            <div className="absolute bottom-6 left-6 right-6">
                                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5">
                                    <p className="text-antique-gold text-xs tracking-[0.3em] uppercase font-medium mb-1">Since 2012</p>
                                    <p className="text-white font-display text-xl">Crafting Sri Lanka&apos;s Finest Journeys</p>
                                </div>
                            </div>
                        </div>

                        {/* Decorative gold accent */}
                        <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-antique-gold/30 rounded-tl-2xl" />
                        <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-antique-gold/30 rounded-br-2xl" />
                    </div>

                    {/* Right — Content */}
                    <div>
                        <span className="inline-block mb-4 text-xs tracking-[0.3em] font-medium text-antique-gold uppercase">
                            Uncompromising Quality
                        </span>
                        <h2 className="text-4xl md:text-5xl font-display text-deep-emerald mb-6 leading-tight">
                            The Yatara Standard
                        </h2>
                        <p className="text-gray-500 font-light leading-relaxed mb-12 text-[15px]">
                            Every journey is personally overseen by our founding team. We don&apos;t just plan trips — we craft experiences that reveal the soul of Sri Lanka.
                        </p>

                        {/* Trust Points */}
                        <div className="space-y-8">
                            {standards.map((item, idx) => (
                                <div key={idx} className="flex gap-5 group">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 rounded-xl bg-deep-emerald/5 border border-deep-emerald/10 flex items-center justify-center group-hover:bg-antique-gold/10 group-hover:border-antique-gold/20 transition-all duration-500">
                                            <item.icon className="w-5 h-5 text-deep-emerald group-hover:text-antique-gold transition-colors duration-500" strokeWidth={1.5} />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-display font-semibold text-deep-emerald mb-1.5 group-hover:text-antique-gold transition-colors duration-300">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 font-light leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
