'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Label } from '@/components/ui/label';

export default function VehicleFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentFilter = searchParams.get('transferType') || 'all';

    const updateFilter = (type: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (type === 'all') {
            params.delete('transferType');
        } else {
            params.set('transferType', type);
        }
        router.push(`/vehicles?${params.toString()}`);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h3 className="font-bold text-gray-900 mb-4">Filter Transfers</h3>

            <div className="space-y-4">
                <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-700">Category</Label>

                    <div className="space-y-2">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="transferType"
                                checked={currentFilter === 'all'}
                                onChange={() => updateFilter('all')}
                                className="h-4 w-4 text-ocean-600 focus:ring-ocean-500"
                            />
                            <span className="text-sm text-gray-600">All Vehicles</span>
                        </label>

                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="transferType"
                                checked={currentFilter === 'AIRPORT_PICKUP'}
                                onChange={() => updateFilter('AIRPORT_PICKUP')}
                                className="h-4 w-4 text-ocean-600 focus:ring-ocean-500"
                            />
                            <span className="text-sm text-gray-600">Airport Pickup</span>
                        </label>

                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="transferType"
                                checked={currentFilter === 'AIRPORT_DROP'}
                                onChange={() => updateFilter('AIRPORT_DROP')}
                                className="h-4 w-4 text-ocean-600 focus:ring-ocean-500"
                            />
                            <span className="text-sm text-gray-600">Airport Drop</span>
                        </label>

                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="transferType"
                                checked={currentFilter === 'CITY_TOUR'}
                                onChange={() => updateFilter('CITY_TOUR')}
                                className="h-4 w-4 text-ocean-600 focus:ring-ocean-500"
                            />
                            <span className="text-sm text-gray-600">City Tour</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
