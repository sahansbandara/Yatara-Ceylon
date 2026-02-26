'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Users, Briefcase, Car, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCurrency, formatPrice } from '@/lib/CurrencyContext';

interface VehicleCardProps {
    vehicle: {
        _id: string;
        model: string;
        type: string;
        seats: number;
        luggage?: number;
        dailyRate: number;
        images: string[];
        transferTypes: string[];
    };
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
    const { currency, convertRate } = useCurrency();

    return (
        <div className="group bg-white rounded-none overflow-hidden hover:bg-off-white/50 shadow-sm border border-transparent hover:border-antique-gold/30 transition-all duration-700 flex flex-col h-full">
            {/* Image section */}
            <div className="relative h-[260px] w-full overflow-hidden bg-gray-50 flex items-center justify-center">
                {vehicle.images && vehicle.images.length > 0 ? (
                    <Image
                        src={vehicle.images[0]}
                        alt={vehicle.model}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                    />
                ) : (
                    <Car className="h-12 w-12 text-gray-300" />
                )}

                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    {vehicle.transferTypes.slice(0, 2).map(type => (
                        <Badge key={type} className="bg-white/90 text-deep-emerald hover:bg-white font-serif tracking-widest text-[10px] uppercase shadow-sm backdrop-blur-sm rounded-none px-3 py-1.5">
                            {type.replace('_', ' ')}
                        </Badge>
                    ))}
                </div>
            </div>

            {/* Content section */}
            <div className="p-8 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-serif text-deep-emerald group-hover:text-antique-gold transition-colors duration-500 line-clamp-2 pr-4 leading-snug">
                        {vehicle.model}
                    </h3>
                    <div className="text-right flex-shrink-0">
                        <span className="text-[10px] text-gray-400 font-semibold tracking-widest uppercase block mb-1">From</span>
                        <span className="text-xl font-serif text-deep-emerald">{formatPrice(vehicle.dailyRate, currency, convertRate)}</span>
                    </div>
                </div>

                <div className="text-sm font-medium text-antique-gold/80 mb-8 uppercase tracking-widest">{vehicle.type}</div>

                <div className="grid grid-cols-2 gap-4 mt-auto mb-8">
                    <div className="flex items-center text-gray-600 gap-3">
                        <Users className="h-4 w-4 text-antique-gold" />
                        <span className="text-sm font-light">{vehicle.seats} Seats</span>
                    </div>
                    {vehicle.luggage && (
                        <div className="flex items-center text-gray-600 gap-3">
                            <Briefcase className="h-4 w-4 text-antique-gold" />
                            <span className="text-sm font-light">{vehicle.luggage} Luggage</span>
                        </div>
                    )}
                </div>

                <div className="pt-6 border-t border-gray-100 mt-auto">
                    <Link href={`/inquire`} className="block w-full">
                        <Button variant="outline" className="w-full border-deep-emerald text-deep-emerald hover:bg-deep-emerald hover:text-white rounded-none uppercase font-semibold tracking-widest text-xs transition-all duration-500 h-12" size="lg">
                            Request This Class
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
