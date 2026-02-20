import Image from 'next/image';
import Link from 'next/link';
import { Users, Briefcase, Car, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
    return (
        <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
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
                        <Badge key={type} className="bg-white/90 text-ocean-700 hover:bg-white font-medium border-none shadow-sm backdrop-blur-sm">
                            {type.replace('_', ' ')}
                        </Badge>
                    ))}
                </div>
            </div>

            {/* Content section */}
            <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-ocean-600 transition-colors line-clamp-1">
                        {vehicle.model}
                    </h3>
                    <div className="text-right">
                        <span className="text-xs text-gray-500 block">From</span>
                        <span className="text-lg font-bold text-ocean-600">LKR {vehicle.dailyRate.toLocaleString()}</span>
                    </div>
                </div>

                <div className="text-sm font-medium text-gray-500 mb-6">{vehicle.type}</div>

                <div className="grid grid-cols-2 gap-4 mt-auto mb-6">
                    <div className="flex items-center text-gray-600 gap-2">
                        <Users className="h-4 w-4 text-ocean-500" />
                        <span className="text-sm">{vehicle.seats} Seats</span>
                    </div>
                    {vehicle.luggage && (
                        <div className="flex items-center text-gray-600 gap-2">
                            <Briefcase className="h-4 w-4 text-ocean-500" />
                            <span className="text-sm">{vehicle.luggage} Luggage</span>
                        </div>
                    )}
                </div>

                <div className="pt-4 border-t border-gray-100 mt-auto">
                    <Link href={`/booking-request?vehicleId=${vehicle._id}`} className="block w-full">
                        <Button className="w-full bg-ocean-600 hover:bg-ocean-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all" size="lg">
                            Book Now
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
