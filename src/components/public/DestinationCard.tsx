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

export default function DestinationCard({ destination, variant = 'default', index }: DestinationCardProps) {
    // Elegant, towering proportions
    const minHeightClass =
        variant === 'tall' ? 'min-h-[460px] sm:min-h-[540px]' :
            variant === 'featured' ? 'min-h-[480px] sm:min-h-[600px]' : 'min-h-[380px] sm:min-h-[460px]';

    const heroImage = normalizeImageUrl(destination.images?.[0], `/images/districts/${destination.slug}.jpg`);

    return (
        <Link
            href={`/destinations/${destination.slug}`}
            className="group block relative overflow-hidden rounded-2xl h-full destination-card-shine ring-1 ring-white/[0.05] hover:ring-[#D4AF37]/50 transition-all duration-[800ms] ease-out"
            style={{
                boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
            }}
        >
            <div className={`relative w-full h-full ${minHeightClass} overflow-hidden`}>
                {/* Image */}
                <Image
                    src={heroImage}
                    alt={`${destination.title}, Sri Lanka — luxury destination`}
                    fill
                    className="object-cover transform group-hover:scale-[1.08] group-hover:rotate-[0.5deg] transition-all duration-[1500ms] ease-[0.22,1,0.36,1]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                {/* Smooth cinematic gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#021A10]/95 via-[#021A10]/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-700" />
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#021A10] via-transparent to-transparent opacity-60" />
                <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/60 via-black/20 to-transparent pointer-events-none" />

                {/* Top Tags container */}
                <div className="absolute top-5 inset-x-5 z-10 flex flex-row justify-between items-start gap-4">
                    {/* Region */}
                    {destination.region && (
                        <span className="inline-block px-3 py-1 text-[9px] tracking-[0.25em] uppercase font-semibold text-white bg-black/40 backdrop-blur-md border border-white/20 rounded-full shrink-0">
                            {destination.region}
                        </span>
                    )}

                    {/* Travel styles — always visible */}
                    {destination.travelStyleTags && destination.travelStyleTags.length > 0 && (
                        <div className="flex flex-wrap justify-end gap-1.5 transition-all duration-500 ease-out">
                            {destination.travelStyleTags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-2 py-0.5 text-[8px] tracking-[0.2em] uppercase font-semibold text-antique-gold bg-black/40 backdrop-blur-md border border-antique-gold/40 rounded-full"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Content Overlay — Bottom aligned, animated */}
                <div className="absolute bottom-0 inset-x-0 z-10 p-6 sm:p-8 flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-[0.22,1,0.36,1]">
                    {/* Luxury micro-label */}
                    {destination.luxuryLabel && (
                        <p className="text-[10px] tracking-[0.3em] text-[#D4AF37] font-medium mb-3 uppercase opacity-90">
                            {destination.luxuryLabel}
                        </p>
                    )}

                    {/* Destination name */}
                    <h3 className="text-2xl sm:text-3xl font-display text-white mb-2 group-hover:text-[#D4AF37] transition-colors duration-500 leading-none">
                        {destination.title}
                    </h3>

                    {/* Quick meta row */}
                    <div className="flex items-center gap-4 text-[10px] tracking-[0.15em] text-white/50 uppercase mb-0 group-hover:mb-4 transition-all duration-500 ease-out">
                        {destination.bestSeason && (
                            <span className="flex items-center gap-1.5">
                                <Calendar className="h-3 w-3" />
                                {destination.bestSeason}
                            </span>
                        )}
                        {destination.idealNights && (
                            <span className="flex items-center gap-1.5">
                                <Moon className="h-3 w-3" />
                                {destination.idealNights} nights
                            </span>
                        )}
                    </div>

                    {/* Description — slides up and fades in */}
                    {destination.description && (
                        <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-[0.22,1,0.36,1]">
                            <p className="text-[12px] text-white/60 leading-relaxed overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                <span className="line-clamp-2">{destination.description}</span>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}
