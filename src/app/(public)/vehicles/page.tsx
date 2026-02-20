'use client';

import { Metadata } from 'next';
import { useState } from 'react';
import VehicleCard from '@/components/public/VehicleCard';

const VEHICLE_CATEGORIES = [
    { id: 'all', label: 'All Vehicles' },
    { id: 'airport', label: 'Elite Airport Transfers' },
    { id: 'city', label: 'Sovereign City Tours' },
    { id: 'intercity', label: 'Private Inter-City' },
];

const TRANSFERS = [
    {
        _id: 'v1',
        model: 'Sovereign Sedan — Mercedes-Benz E-Class',
        type: 'Premium Executive Sedan',
        seats: 3,
        luggage: 2,
        dailyRate: 32000,
        images: ['https://images.unsplash.com/photo-1541899481282-d53bffe3c3ea?w=800&auto=format&fit=crop&q=80'],
        transferTypes: ['Airport Pickup', 'Airport Drop', 'VIP Transfer'],
        category: 'airport',
    },
    {
        _id: 'v2',
        model: 'Heritage Cruiser — Toyota Land Cruiser',
        type: 'Luxury SUV',
        seats: 4,
        luggage: 4,
        dailyRate: 28000,
        images: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80'],
        transferTypes: ['Airport Pickup', 'Inter-City', 'Safari Transfer'],
        category: 'airport',
    },
    {
        _id: 'v3',
        model: 'Royal Carriage — Toyota Alphard',
        type: 'Premium Luxury Van',
        seats: 6,
        luggage: 6,
        dailyRate: 35000,
        images: ['https://images.unsplash.com/photo-1619682817481-e994891cd1f5?w=800&auto=format&fit=crop&q=80'],
        transferTypes: ['Airport Pickup', 'Group Transfer', 'Family Tour'],
        category: 'airport',
    },
    {
        _id: 'v4',
        model: 'Elite Voyager — Mercedes-Benz V-Class',
        type: 'Executive Van',
        seats: 6,
        luggage: 5,
        dailyRate: 42000,
        images: ['https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&auto=format&fit=crop&q=80'],
        transferTypes: ['VIP Transfer', 'Corporate Charter'],
        category: 'intercity',
    },
    {
        _id: 'v5',
        model: 'Colombo City Cruiser — BMW 5 Series',
        type: 'City Tour Sedan',
        seats: 3,
        luggage: 2,
        dailyRate: 18000,
        images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop&q=80'],
        transferTypes: ['City Tour', 'Half-Day Tour'],
        category: 'city',
    },
    {
        _id: 'v6',
        model: 'Galle Heritage Drive — Toyota Prado',
        type: 'Luxury City Explorer',
        seats: 5,
        luggage: 3,
        dailyRate: 22000,
        images: ['https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&auto=format&fit=crop&q=80'],
        transferTypes: ['City Tour', 'Full-Day Tour'],
        category: 'city',
    },
    {
        _id: 'v7',
        model: 'Highland Express — Toyota HiAce (Luxury)',
        type: 'Premium Mini Coach',
        seats: 10,
        luggage: 10,
        dailyRate: 48000,
        images: ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80'],
        transferTypes: ['Group Transfer', 'Multi-Day Tour', 'Inter-City'],
        category: 'intercity',
    },
    {
        _id: 'v8',
        model: 'The Ceylon Classic — Restored Fiat 500',
        type: 'Heritage Tuk-Tuk / Classic',
        seats: 2,
        luggage: 1,
        dailyRate: 12000,
        images: ['https://images.unsplash.com/photo-1517026575980-3e1e2dedeab4?w=800&auto=format&fit=crop&q=80'],
        transferTypes: ['City Tour', 'Photo Tour', 'Heritage Experience'],
        category: 'city',
    },
    {
        _id: 'v9',
        model: 'Kandy Royal Express — Lexus LX',
        type: 'Ultra Luxury SUV',
        seats: 4,
        luggage: 3,
        dailyRate: 55000,
        images: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80'],
        transferTypes: ['Airport Drop', 'Inter-City', 'VIP Service'],
        category: 'intercity',
    },
];

export default function VehiclesPage() {
    const [activeCategory, setActiveCategory] = useState('all');

    const filteredVehicles = activeCategory === 'all'
        ? TRANSFERS
        : TRANSFERS.filter(v => v.category === activeCategory);

    return (
        <div className="min-h-screen bg-off-white pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Header */}
                <div className="mb-12 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <span className="inline-block py-1 px-4 text-xs tracking-[0.2em] uppercase font-medium text-antique-gold border border-antique-gold/30 mb-6 bg-deep-emerald/5">
                        Seamless Journeys
                    </span>
                    <h1 className="text-4xl md:text-5xl font-serif text-deep-emerald mb-4">
                        Private Transfers
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
                        Arrive in elegance. Explore our premium fleet of chauffeur-driven vehicles for airport pickups, drops, city tours, and bespoke inter-city transfers.
                    </p>
                </div>

                {/* Category Tabs */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {VEHICLE_CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`px-6 py-2.5 text-xs tracking-[0.15em] uppercase font-medium transition-all duration-300 border
                                ${activeCategory === cat.id
                                    ? 'bg-deep-emerald text-antique-gold border-deep-emerald shadow-lg'
                                    : 'bg-white text-deep-emerald/70 border-deep-emerald/15 hover:border-antique-gold/50 hover:text-deep-emerald'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {filteredVehicles.map((vehicle: any) => (
                        <VehicleCard key={vehicle._id} vehicle={vehicle} />
                    ))}
                </div>
            </div>
        </div>
    );
}
