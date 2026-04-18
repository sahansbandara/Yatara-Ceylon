'use client';

import Image from 'next/image';
import { Users, Briefcase } from 'lucide-react';
import { DEFAULT_IMAGE_BLUR_DATA_URL } from '@/lib/image-utils';

interface FleetTierCardProps {
    name: string;
    tagline: string;
    vehicles: string;
    maxGuests: number;
    maxLuggage: string;
    features: string[];
    image: string;
    idealFor: string;
    useCases: string[];
}

export default function FleetTierCard({
    name,
    tagline,
    vehicles,
    maxGuests,
    maxLuggage,
    features,
    image,
    idealFor,
    useCases,
}: FleetTierCardProps) {
    return (
        <div className="group h-auto min-h-[500px] flex flex-col bg-white overflow-hidden rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] transition-all duration-500 hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] border border-deep-emerald/5 hover:border-antique-gold/30">
            {/* Top: Image Section */}
            <div className="relative h-[220px] w-full shrink-0 overflow-hidden bg-deep-emerald/5">
                {image ? (
                    <Image
                        src={image}
                        alt={`${name} tier vehicle`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        quality={80}
                        placeholder="blur"
                        blurDataURL={DEFAULT_IMAGE_BLUR_DATA_URL}
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-deep-emerald/30 text-sm font-nav">Image coming soon</span>
                    </div>
                )}
                
                {/* Subtle gradient just for the badge */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent opacity-60" />

                {/* Top Badge: Best For */}
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-[9px] font-nav text-white uppercase tracking-widest font-semibold shadow-sm">
                        Best for {idealFor.split(',')[0]}
                    </span>
                </div>
            </div>

            {/* Bottom: Content Section */}
            <div className="p-6 flex flex-col flex-1">
                <div className="mb-3">
                    <h3 className="font-serif text-3xl font-bold text-deep-emerald group-hover:text-antique-gold transition-colors duration-300">{name}</h3>
                    <p className="text-antique-gold text-sm font-nav italic mt-1">{tagline}</p>
                </div>

                <p className="text-deep-emerald/70 text-xs font-nav mb-6 line-clamp-2">{vehicles}</p>

                {/* Capacity Info Box */}
                <div className="flex flex-row items-center justify-between mb-6 bg-[#F4F8F6] border border-deep-emerald/5 rounded-xl py-3 px-4">
                    <div className="flex flex-col items-center flex-1 border-r border-deep-emerald/5">
                        <span className="text-[9px] text-deep-emerald/50 font-nav uppercase tracking-widest block mb-1">
                            Guests
                        </span>
                        <div className="flex items-center gap-1.5 text-deep-emerald">
                            <Users className="w-3.5 h-3.5 text-antique-gold" />
                            <span className="text-sm font-semibold font-nav">Up to {maxGuests}</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-center flex-1">
                        <span className="text-[9px] text-deep-emerald/50 font-nav uppercase tracking-widest block mb-1">
                            Luggage
                        </span>
                        <div className="flex items-center gap-1.5 text-deep-emerald">
                            <Briefcase className="w-3.5 h-3.5 text-antique-gold" />
                            <span className="text-sm font-semibold font-nav">{maxLuggage}</span>
                        </div>
                    </div>
                </div>

                {/* Features & Uses */}
                <div className="mt-auto">
                    <div className="mb-4 flex flex-wrap gap-2.5">
                        {features.slice(0, 3).map((feature, index) => (
                            <div key={index} className="flex items-center gap-1.5 text-[11px] text-deep-emerald/80 font-nav whitespace-nowrap">
                                <div className="w-1 h-1 rounded-full bg-antique-gold flex-shrink-0" />
                                {feature}
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {useCases.map((useCase, idx) => (
                            <span
                                key={idx}
                                className="inline-block px-2.5 py-1 bg-antique-gold/5 border border-antique-gold/10 rounded-md text-[9px] font-nav text-deep-emerald/70 uppercase tracking-widest"
                            >
                                {useCase}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
