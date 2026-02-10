import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Clock, ArrowRight, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface PackageCardProps {
    pkg: {
        title: string;
        slug: string;
        description: string;
        priceMin: number;
        durationDays: number;
        images: string[];
        difficulty: string;
    };
}

export default function PackageCard({ pkg }: PackageCardProps) {
    return (
        <div className="group rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
            {/* Image */}
            <div className="relative h-64 overflow-hidden">
                <Image
                    src={pkg.images[0] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop'}
                    alt={pkg.title}
                    fill
                    className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4">
                    <Badge className="bg-white/90 text-ocean-700 hover:bg-white backdrop-blur-sm font-semibold shadow-sm">
                        {pkg.durationDays} Days
                    </Badge>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-grow">
                <div className="mb-4">
                    <div className="flex items-center gap-2 text-ocean-600 text-xs font-semibold uppercase tracking-wider mb-2">
                        <span className={pkg.difficulty === 'EASY' ? 'text-green-600' : pkg.difficulty === 'MEDIUM' ? 'text-orange-500' : 'text-red-500'}>
                            {pkg.difficulty}
                        </span>
                        <span>•</span>
                        <span>Tour Package</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-ocean-600 transition-colors mb-2 line-clamp-2">
                        {pkg.title}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-2">
                        {pkg.description}
                    </p>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 font-medium uppercase">Starting from</p>
                        <p className="text-2xl font-bold text-ocean-700">
                            ${pkg.priceMin.toLocaleString()}
                        </p>
                    </div>
                    <Link href={`/packages/${pkg.slug}`}>
                        <Button
                            size="icon"
                            className="bg-ocean-100 text-ocean-700 hover:bg-ocean-600 hover:text-white rounded-full transition-colors h-10 w-10"
                        >
                            <ArrowRight className="h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
