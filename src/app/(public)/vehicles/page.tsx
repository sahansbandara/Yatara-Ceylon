'use client';

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
        images: ['/images/home/heritage-story.png'], // Stand-in for Sedan
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
        images: ['/images/home/curated-hillcountry.png'], // Stand-in for SUV
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
        images: ['/images/home/pkg_classic_ceylon.png'], // Stand-in for Van
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
        images: ['/images/home/pkg_classic_ceylon.png'],
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
        images: ['/images/home/heritage-story.png'],
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
        images: ['/images/home/curated-hillcountry.png'],
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
        images: ['/images/home/pkg_classic_ceylon.png'],
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
        images: ['/images/home/curated-southcoast.png'],
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
        images: ['/images/home/curated-hillcountry.png'],
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
        <div className="min-h-screen bg-off-white pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Header */}
                <div className="mb-20 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-3xl mx-auto">
                    <span className="inline-block py-1.5 px-5 text-xs tracking-[0.2em] uppercase font-medium text-antique-gold border border-antique-gold/30 mb-8 bg-deep-emerald/5">
                        Seamless Journeys
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-deep-emerald mb-6 leading-tight">
                        Private Transfers
                    </h1>
                    <p className="text-gray-600 text-lg font-light leading-relaxed">
                        Arrive in elegance. Explore our premium fleet of chauffeur-driven vehicles for airport pickups, drops, city tours, and bespoke inter-city transfers.
                    </p>
                </div>

                {/* Category Tabs */}
                <div className="flex flex-wrap justify-center gap-4 mb-16">
                    {VEHICLE_CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`px-8 py-3.5 text-[11px] tracking-[0.2em] uppercase font-semibold transition-all duration-500 border
                                ${activeCategory === cat.id
                                    ? 'bg-deep-emerald text-antique-gold border-deep-emerald shadow-lg'
                                    : 'bg-white text-deep-emerald/70 border-deep-emerald/15 hover:border-antique-gold/50 hover:text-deep-emerald hover:bg-off-white/50'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 lg:gap-10 max-w-5xl mx-auto">
                    {filteredVehicles.map((vehicle: any) => (
                        <VehicleCard key={vehicle._id} vehicle={vehicle} />
                    ))}
                </div>
            </div>
        </div>
    );
}
