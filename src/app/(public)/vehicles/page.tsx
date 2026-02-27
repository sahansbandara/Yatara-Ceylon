'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
    CheckCircle2,
    Clock3,
    ShieldCheck,
    Sparkles,
    Star,
} from 'lucide-react';
import VehicleCard from '@/components/public/VehicleCard';

type VehicleCategoryId = 'all' | 'airport' | 'city' | 'intercity';

interface VehicleCategory {
    id: VehicleCategoryId;
    label: string;
}

interface TransferVehicle {
    _id: string;
    model: string;
    type: string;
    seats: number;
    luggage: number;
    dailyRate: number;
    images: string[];
    transferTypes: string[];
    category: Exclude<VehicleCategoryId, 'all'>;
}

const VEHICLE_CATEGORIES: VehicleCategory[] = [
    { id: 'all', label: 'All Vehicles' },
    { id: 'airport', label: 'Elite Airport Transfers' },
    { id: 'city', label: 'Sovereign City Tours' },
    { id: 'intercity', label: 'Private Inter-City' },
];

const TRANSFERS: TransferVehicle[] = [
    {
        _id: 'v1',
        model: 'Sovereign Sedan - Mercedes-Benz E-Class',
        type: 'Premium Executive Sedan',
        seats: 3,
        luggage: 2,
        dailyRate: 32000,
        images: ['/images/vehicles/executive-sedan.svg'],
        transferTypes: ['Airport Pickup', 'Airport Drop', 'VIP Transfer'],
        category: 'airport',
    },
    {
        _id: 'v2',
        model: 'Heritage Cruiser - Toyota Land Cruiser',
        type: 'Luxury SUV',
        seats: 4,
        luggage: 4,
        dailyRate: 28000,
        images: ['/images/vehicles/luxury-suv.svg'],
        transferTypes: ['Airport Pickup', 'Inter-City', 'Safari Transfer'],
        category: 'airport',
    },
    {
        _id: 'v3',
        model: 'Royal Carriage - Toyota Alphard',
        type: 'Premium Luxury Van',
        seats: 6,
        luggage: 6,
        dailyRate: 35000,
        images: ['/images/vehicles/premium-van.svg'],
        transferTypes: ['Airport Pickup', 'Group Transfer', 'Family Tour'],
        category: 'airport',
    },
    {
        _id: 'v4',
        model: 'Elite Voyager - Mercedes-Benz V-Class',
        type: 'Executive Van',
        seats: 6,
        luggage: 5,
        dailyRate: 42000,
        images: ['/images/vehicles/executive-van.svg'],
        transferTypes: ['VIP Transfer', 'Corporate Charter'],
        category: 'intercity',
    },
    {
        _id: 'v5',
        model: 'Colombo City Cruiser - BMW 5 Series',
        type: 'City Tour Sedan',
        seats: 3,
        luggage: 2,
        dailyRate: 18000,
        images: ['/images/vehicles/city-sedan.svg'],
        transferTypes: ['City Tour', 'Half-Day Tour'],
        category: 'city',
    },
    {
        _id: 'v6',
        model: 'Galle Heritage Drive - Toyota Prado',
        type: 'Luxury City Explorer',
        seats: 5,
        luggage: 3,
        dailyRate: 22000,
        images: ['/images/vehicles/city-suv.svg'],
        transferTypes: ['City Tour', 'Full-Day Tour'],
        category: 'city',
    },
    {
        _id: 'v7',
        model: 'Highland Express - Toyota HiAce (Luxury)',
        type: 'Premium Mini Coach',
        seats: 10,
        luggage: 10,
        dailyRate: 48000,
        images: ['/images/vehicles/mini-coach.svg'],
        transferTypes: ['Group Transfer', 'Multi-Day Tour', 'Inter-City'],
        category: 'intercity',
    },
    {
        _id: 'v8',
        model: 'The Ceylon Classic - Restored Fiat 500',
        type: 'Heritage Classic',
        seats: 2,
        luggage: 1,
        dailyRate: 12000,
        images: ['/images/vehicles/classic-car.svg'],
        transferTypes: ['City Tour', 'Photo Tour', 'Heritage Experience'],
        category: 'city',
    },
    {
        _id: 'v9',
        model: 'Kandy Royal Express - Lexus LX',
        type: 'Ultra Luxury SUV',
        seats: 4,
        luggage: 3,
        dailyRate: 55000,
        images: ['/images/vehicles/ultra-suv.svg'],
        transferTypes: ['Airport Drop', 'Inter-City', 'VIP Service'],
        category: 'intercity',
    },
];

const SERVICE_HIGHLIGHTS = [
    {
        title: 'Licensed Chauffeurs',
        description: 'English-speaking, hospitality-trained professionals for every route.',
        icon: ShieldCheck,
    },
    {
        title: 'Always On Time',
        description: 'Live tracking and flight monitoring for precise airport coordination.',
        icon: Clock3,
    },
    {
        title: 'Premium Comfort',
        description: 'Sanitized interiors, bottled water, Wi-Fi support, and climate control.',
        icon: Sparkles,
    },
    {
        title: 'Top-Rated Service',
        description: 'Trusted by families, executives, and private groups across Sri Lanka.',
        icon: Star,
    },
];

const BOOKING_STEPS = [
    'Share your itinerary, pickup point, and passenger count.',
    'Receive vehicle options with transparent pricing and inclusions.',
    'Confirm your transfer and receive driver details in advance.',
    'Travel with dedicated support available throughout your journey.',
];

const INCLUSIONS = [
    'Professional chauffeur and fuel',
    'Highway tolls and parking for transfer routes',
    'Air-conditioned premium vehicle',
    '24/7 WhatsApp support during service',
];

const EXCLUSIONS = [
    'Attraction tickets and guide fees',
    'Overtime hours beyond agreed package',
    'Out-of-route detours not in itinerary',
    'Meals and personal expenses',
];

export default function VehiclesPage() {
    const [activeCategory, setActiveCategory] = useState<VehicleCategoryId>('all');

    const filteredVehicles = useMemo(
        () =>
            activeCategory === 'all'
                ? TRANSFERS
                : TRANSFERS.filter((vehicle) => vehicle.category === activeCategory),
        [activeCategory],
    );

    return (
        <div className="min-h-screen bg-off-white pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="mb-20 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-3xl mx-auto">
                    <span className="inline-block py-1.5 px-5 text-xs tracking-[0.2em] uppercase font-medium text-antique-gold border border-antique-gold/30 mb-8 bg-deep-emerald/5">
                        Seamless Journeys
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-deep-emerald mb-6 leading-tight">
                        Private Transfers
                    </h1>
                    <p className="text-gray-600 text-lg font-light leading-relaxed">
                        Arrive in elegance. Explore our premium chauffeur-driven fleet for airport pickups, city tours,
                        and bespoke inter-city transfers across Sri Lanka.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
                    {SERVICE_HIGHLIGHTS.map(({ title, description, icon: Icon }) => (
                        <article
                            key={title}
                            className="rounded-2xl border border-deep-emerald/10 bg-white/80 p-6 backdrop-blur-sm"
                        >
                            <div className="w-11 h-11 rounded-xl bg-deep-emerald/5 border border-deep-emerald/10 flex items-center justify-center mb-4">
                                <Icon className="h-5 w-5 text-antique-gold" />
                            </div>
                            <h2 className="text-deep-emerald font-semibold tracking-wide mb-2">{title}</h2>
                            <p className="text-sm text-gray-600 font-light leading-relaxed">{description}</p>
                        </article>
                    ))}
                </div>

                <div className="flex flex-wrap justify-center gap-4 mb-6">
                    {VEHICLE_CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`px-8 py-3.5 text-[11px] tracking-[0.2em] uppercase font-semibold transition-all duration-500 border ${
                                activeCategory === cat.id
                                    ? 'bg-deep-emerald text-antique-gold border-deep-emerald shadow-lg'
                                    : 'bg-white text-deep-emerald/70 border-deep-emerald/15 hover:border-antique-gold/50 hover:text-deep-emerald hover:bg-off-white/50'
                            }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                <p className="text-center text-sm tracking-[0.2em] uppercase text-deep-emerald/60 mb-12">
                    {filteredVehicles.length} vehicle classes available
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 lg:gap-10 max-w-5xl mx-auto mb-24">
                    {filteredVehicles.map((vehicle) => (
                        <VehicleCard key={vehicle._id} vehicle={vehicle} />
                    ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-8 items-stretch mb-16">
                    <section className="rounded-2xl border border-deep-emerald/10 bg-white p-8 md:p-10">
                        <h3 className="text-2xl md:text-3xl font-serif text-deep-emerald mb-6">How Booking Works</h3>
                        <ul className="space-y-4">
                            {BOOKING_STEPS.map((step) => (
                                <li key={step} className="flex items-start gap-3 text-gray-700">
                                    <CheckCircle2 className="h-5 w-5 text-antique-gold mt-0.5 flex-shrink-0" />
                                    <span className="font-light leading-relaxed">{step}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className="rounded-2xl border border-deep-emerald/10 bg-deep-emerald text-white p-8 md:p-10">
                        <h3 className="text-2xl md:text-3xl font-serif text-antique-gold mb-6">Service Details</h3>
                        <div className="grid md:grid-cols-2 gap-8 text-sm">
                            <div>
                                <p className="uppercase tracking-[0.2em] text-antique-gold/80 mb-4">Included</p>
                                <ul className="space-y-3">
                                    {INCLUSIONS.map((item) => (
                                        <li key={item} className="font-light text-white/90 leading-relaxed">
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <p className="uppercase tracking-[0.2em] text-antique-gold/80 mb-4">Not Included</p>
                                <ul className="space-y-3">
                                    {EXCLUSIONS.map((item) => (
                                        <li key={item} className="font-light text-white/80 leading-relaxed">
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>

                <section className="rounded-2xl border border-antique-gold/30 bg-antique-gold/10 p-8 md:p-10 text-center max-w-4xl mx-auto">
                    <h3 className="text-2xl md:text-3xl font-serif text-deep-emerald mb-4">
                        Need A Tailored Chauffeur Plan?
                    </h3>
                    <p className="text-gray-700 font-light leading-relaxed mb-8 max-w-2xl mx-auto">
                        Tell us your route, dates, and travel style. We will prepare the right vehicle mix for couples,
                        families, or corporate delegations.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/inquire"
                            className="inline-flex items-center justify-center px-8 py-4 bg-deep-emerald text-antique-gold border border-antique-gold/40 text-xs tracking-[0.2em] uppercase font-semibold transition-colors hover:bg-deep-emerald/90"
                        >
                            Request Proposal
                        </Link>
                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center px-8 py-4 bg-white text-deep-emerald border border-deep-emerald/20 text-xs tracking-[0.2em] uppercase font-semibold transition-colors hover:bg-off-white"
                        >
                            Contact Concierge
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
