import { Suspense } from 'react';
import { Metadata } from 'next';
import SectionHeading from '@/components/public/SectionHeading';
import VehicleCard from '@/components/public/VehicleCard';
import VehicleFilters from '@/components/public/VehicleFilters';
import connectDB from '@/lib/mongodb';
import Vehicle from '@/models/Vehicle';
import { FilterX } from 'lucide-react';
import { VehicleStatus } from '@/lib/constants';

export const metadata: Metadata = {
    title: 'Transfers & Vehicles | Ceylon Escapes',
    description: 'Safe and comfortable transfers across Sri Lanka. Airport pickups, drops, and city tours.',
};

async function getAvailableVehicles(searchParams: { [key: string]: string | string[] | undefined }) {
    await connectDB();

    const filter: any = { isDeleted: false, status: VehicleStatus.AVAILABLE };

    // Server-side filtering by transfer type
    const transferType = searchParams.transferType as string;
    if (transferType && transferType !== 'all') {
        filter.transferTypes = transferType;
    }

    const vehicles = await Vehicle.find(filter).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(vehicles));
}

export default async function VehiclesPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const params = await searchParams;
    const vehicles = await getAvailableVehicles(params);

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Header */}
                <div className="mb-12">
                    <SectionHeading
                        title="Transfers & Fleet"
                        description="Professional drivers and comfortable vehicles for your travel needs."
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Filters Sidebar */}
                    <div className="hidden lg:block lg:col-span-1">
                        <Suspense fallback={<div>Loading filters...</div>}>
                            <VehicleFilters />
                        </Suspense>
                    </div>

                    {/* Packages Grid */}
                    <div className="lg:col-span-3">
                        {vehicles.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {vehicles.map((vehicle: any) => (
                                    <VehicleCard
                                        key={vehicle._id}
                                        vehicle={vehicle}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center bg-white rounded-xl p-12 text-center border dashed border-gray-200">
                                <div className="bg-gray-50 p-4 rounded-full mb-4">
                                    <FilterX className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No vehicles found</h3>
                                <p className="text-gray-500 max-w-sm">
                                    Try adjusting your filters to see more results.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
