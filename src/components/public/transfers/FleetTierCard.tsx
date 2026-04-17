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
        <div className="group h-full overflow-hidden rounded-xl shadow-lg transition-all duration-500 hover:shadow-2xl border border-deep-emerald/10 hover:border-antique-gold/30">
            <div className="relative h-full bg-white flex flex-col">
                {/* Image Container */}
                <div className="relative h-56 w-full overflow-hidden">
                    {image ? (
                        <Image
                            src={image}
                            alt={`${name} tier vehicle`}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            quality={70}
                            placeholder="blur"
                            blurDataURL={DEFAULT_IMAGE_BLUR_DATA_URL}
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-deep-emerald/20 to-deep-emerald/5 flex items-center justify-center">
                            <span className="text-deep-emerald/30 text-sm font-nav">Image coming soon</span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                    {/* Tier Badge */}
                    <div className="absolute bottom-4 left-4">
                        <h3 className="font-serif text-3xl font-bold text-white">{name}</h3>
                        <p className="text-antique-gold text-sm font-nav italic">{tagline}</p>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 flex flex-col">
                    {/* Ideal For */}
                    <div className="mb-4 p-3 bg-antique-gold/5 border border-antique-gold/15 rounded-lg">
                        <p className="text-[10px] font-nav text-antique-gold uppercase tracking-widest font-semibold mb-1">
                            Best For
                        </p>
                        <p className="text-sm text-deep-emerald/80 font-nav">{idealFor}</p>
                    </div>

                    {/* Vehicle Names */}
                    <p className="text-deep-emerald/60 text-xs font-nav mb-4">{vehicles}</p>

                    {/* Capacity Info */}
                    <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-deep-emerald/10">
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-antique-gold" />
                            <div>
                                <span className="text-xs text-deep-emerald/50 font-nav uppercase tracking-wide block">
                                    Guests
                                </span>
                                <span className="text-sm font-serif font-bold text-deep-emerald">
                                    Up to {maxGuests}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-antique-gold" />
                            <div>
                                <span className="text-xs text-deep-emerald/50 font-nav uppercase tracking-wide block">
                                    Luggage
                                </span>
                                <span className="text-sm font-serif font-bold text-deep-emerald">
                                    {maxLuggage}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="mb-4 flex-1">
                        <p className="text-[10px] text-deep-emerald/50 font-nav uppercase tracking-widest font-semibold mb-3">
                            Premium Features
                        </p>
                        <div className="space-y-1.5">
                            {features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm text-deep-emerald/70 font-nav">
                                    <div className="w-1.5 h-1.5 rounded-full bg-antique-gold flex-shrink-0" />
                                    {feature}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Use Cases */}
                    <div className="flex flex-wrap gap-1.5 pt-4 border-t border-deep-emerald/10">
                        {useCases.map((useCase, idx) => (
                            <span
                                key={idx}
                                className="inline-block px-2.5 py-1 bg-deep-emerald/5 rounded-md text-[10px] font-nav text-deep-emerald/50 uppercase tracking-wide"
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
