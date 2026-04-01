import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Moon } from 'lucide-react';
import { normalizeImageUrl } from '@/lib/image-utils';

interface DestinationCardProps {
    destination: {
        title: string;
        slug: string;
        images: string[];
        description: string;
        luxuryLabel?: string;
        region?: string;
        bestSeason?: string;
        idealNights?: string;
        travelStyleTags?: string[];
    };
    variant?: 'default' | 'tall' | 'featured';
    index?: number;
}

export default function DestinationCard({ destination, variant = 'default' }: DestinationCardProps) {
    const heightClass = variant === 'tall' ? 'h-[480px]' : variant === 'featured' ? 'h-[420px]' : 'h-[380px]';
    const heroImage = normalizeImageUrl(destination.images?.[0], `/images/districts/${destination.slug}.jpg`);

    return (
        <Link
            href={`/destinations/${destination.slug}`}
            className="group block relative overflow-hidden rounded-3xl h-full destination-card-shine ring-1 ring-white/[0.08] hover:ring-[#D4AF37]/30 transition-all duration-700"
            style={{
                boxShadow: '0 8px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
            }}
        >
            <div className={`relative w-full ${heightClass} overflow-hidden`}>
                {/* Image */}
                <Image
                    src={heroImage}
                    alt={`${destination.title}, Sri Lanka — luxury destination`}
                    fill
                    className="object-cover transform group-hover:scale-[1.03] transition-transform duration-[1200ms] ease-out"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#021a10]/90 via-[#021a10]/20 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-700" />

                {/* Region tag — top left */}
                {destination.region && (
                    <div className="absolute top-4 left-4 z-10">
                        <span className="inline-block px-3 py-1 text-[9px] tracking-[0.25em] uppercase font-medium text-white/70 bg-white/[0.08] backdrop-blur-md border border-white/[0.1] rounded-full">
                            {destination.region}
                        </span>
                    </div>
                )}

                {/* Travel style tags — top right, visible on hover */}
                {destination.travelStyleTags && destination.travelStyleTags.length > 0 && (
                    <div className="absolute top-4 right-4 z-10 flex flex-wrap gap-1.5 justify-end max-w-[140px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        {destination.travelStyleTags.slice(0, 2).map((tag) => (
                            <span
                                key={tag}
                                className="px-2 py-0.5 text-[8px] tracking-[0.15em] uppercase text-[#D4AF37]/80 bg-[#D4AF37]/[0.08] backdrop-blur-md border border-[#D4AF37]/15 rounded-full"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Glass info panel — bottom */}
                <div className="absolute bottom-0 left-0 right-0 z-10">
                    <div className="liquid-glass-panel rounded-t-2xl px-5 py-4 md:px-6 md:py-5">
                        {/* Destination name */}
                        <h3 className="text-xl lg:text-[22px] font-serif text-white mb-1 group-hover:text-[#D4AF37] transition-colors duration-500 leading-tight">
                            {destination.title}
                        </h3>

                        {/* Luxury micro-label */}
                        {destination.luxuryLabel && (
                            <p className="text-[11px] tracking-[0.12em] text-[#D4AF37]/70 font-light mb-2 uppercase">
                                {destination.luxuryLabel}
                            </p>
                        )}

                        {/* Description — reveals on hover */}
                        {destination.description && (
                            <p className="text-[11px] text-white/35 leading-relaxed line-clamp-2 mb-2.5 max-h-0 group-hover:max-h-[40px] overflow-hidden transition-all duration-500 ease-out opacity-0 group-hover:opacity-100">
                                {destination.description}
                            </p>
                        )}

                        {/* Quick meta row */}
                        <div className="flex items-center gap-3 text-[10px] tracking-[0.1em] text-white/45 uppercase">
                            {destination.bestSeason && (
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {destination.bestSeason}
                                </span>
                            )}
                            {destination.idealNights && (
                                <span className="flex items-center gap-1">
                                    <Moon className="h-3 w-3" />
                                    {destination.idealNights} nights
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
