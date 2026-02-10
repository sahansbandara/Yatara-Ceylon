import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

interface DestinationCardProps {
    destination: {
        title: string;
        slug: string;
        images: string[];
        description: string;
    };
    variant?: 'default' | 'tall';
}

export default function DestinationCard({ destination, variant = 'default' }: DestinationCardProps) {
    return (
        <Link href={`/destinations/${destination.slug}`} className="group block relative overflow-hidden rounded-3xl h-full">
            <div className={`relative w-full ${variant === 'tall' ? 'h-[400px]' : 'h-[300px]'} overflow-hidden`}>
                <Image
                    src={destination.images[0] || 'https://images.unsplash.com/photo-1546708773-e57be64fa2e3?w=800&auto=format&fit=crop'}
                    alt={destination.title}
                    fill
                    className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                <div className="absolute bottom-0 left-0 p-6 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex justify-between items-end">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-ocean-200 transition-colors">
                                {destination.title}
                            </h3>
                            <p className="text-gray-300 text-sm line-clamp-2 max-w-[85%] opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                                {destination.description}
                            </p>
                        </div>
                        <div className="bg-white/20 p-2 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-4 group-hover:translate-x-0">
                            <ArrowUpRight className="h-5 w-5 text-white" />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
