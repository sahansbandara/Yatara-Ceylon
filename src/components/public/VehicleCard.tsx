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
        <div className="group bg-white rounded-none overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-off-white/20 flex flex-col h-full">
            {/* Image section */}
            <div className="relative h-56 w-full overflow-hidden bg-gray-100 flex items-center justify-center">
                {vehicle.images && vehicle.images.length > 0 ? (
                    <Image
                        src={vehicle.images[0]}
                        alt={vehicle.model}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <Car className="h-12 w-12 text-gray-300" />
                )}

                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    {vehicle.transferTypes.map(type => (
                        <Badge key={type} className="bg-white/90 text-deep-emerald hover:bg-white font-serif tracking-widest text-[10px] uppercase shadow-sm backdrop-blur-sm rounded-none">
                            {type.replace('_', ' ')}
                        </Badge>
                    ))}
                </div>
            </div>

            {/* Content section */}
            <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-serif text-deep-emerald group-hover:text-antique-gold transition-colors duration-500 line-clamp-1">
                        {vehicle.model}
                    </h3>
                    <div className="text-right">
                        <span className="text-[10px] text-gray-400 font-semibold tracking-widest uppercase block">From</span>
                        <span className="text-lg font-serif text-deep-emerald">{formatPrice(vehicle.dailyRate, currency, convertRate)}</span>
                    </div>
                </div>

                <div className="text-sm font-medium text-gray-500 mb-6">{vehicle.type}</div>

                <div className="grid grid-cols-2 gap-4 mt-auto mb-6">
                    <div className="flex items-center text-gray-600 gap-2">
                        <Users className="h-4 w-4 text-antique-gold" />
                        <span className="text-sm font-light">{vehicle.seats} Seats</span>
                    </div>
                    {vehicle.luggage && (
                        <div className="flex items-center text-gray-600 gap-2">
                            <Briefcase className="h-4 w-4 text-antique-gold" />
                            <span className="text-sm font-light">{vehicle.luggage} Luggage</span>
                        </div>
                    )}
                </div>

                <div className="pt-6 border-t border-gray-100 mt-auto">
                    <Link href={`/contact`} className="block w-full">
                        <Button className="w-full bg-deep-emerald hover:bg-antique-gold text-antique-gold hover:text-deep-emerald rounded-none uppercase font-semibold tracking-widest text-[11px] transition-all duration-500" size="lg">
                            Book Now
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
