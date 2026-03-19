'use client';

import { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const popularPickups = [
    'Colombo Airport (CMB)',
    'Colombo City',
    'Kandy',
    'Galle Fort',
    'Ella',
    'Negombo',
    'Sigiriya',
    'Nuwara Eliya',
];

const popularDropoffs = [
    'Colombo City',
    'Galle Fort',
    'Kandy',
    'Ella',
    'Negombo',
    'Bentota',
    'Hikkaduwa',
    'Yala',
    'Sigiriya',
    'Nuwara Eliya',
    'Trincomalee',
    'Arugam Bay',
];

export default function BookingStrip() {
    const router = useRouter();
    const [pickup, setPickup] = useState('');
    const [dropoff, setDropoff] = useState('');
    const [date, setDate] = useState('');
    const [passengers, setPassengers] = useState('2');
    const [tripType, setTripType] = useState('one-way');

    const handleCheckFare = () => {
        const params = new URLSearchParams();
        if (pickup) params.set('pickup', pickup);
        if (dropoff) params.set('dropoff', dropoff);
        if (date) params.set('date', date);
        if (passengers) params.set('passengers', passengers);
        if (tripType) params.set('type', tripType);
        router.push(`/inquire?${params.toString()}`);
    };

    return (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 md:p-8">
            {/* Trip Type Toggle */}
            <div className="flex gap-2 mb-6">
                {['one-way', 'round-trip', 'hourly'].map((type) => (
                    <button
                        key={type}
                        onClick={() => setTripType(type)}
                        className={`px-4 py-2 rounded-lg text-xs font-nav font-semibold uppercase tracking-[0.1em] transition-all duration-300 ${
                            tripType === type
                                ? 'bg-antique-gold text-deep-emerald'
                                : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                        }`}
                    >
                        {type.replace('-', ' ')}
                    </button>
                ))}
            </div>

            {/* Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Pickup */}
                <div className="lg:col-span-1">
                    <label className="block text-white/60 text-xs font-nav uppercase tracking-widest mb-2">
                        Pickup
                    </label>
                    <select
                        value={pickup}
                        onChange={(e) => setPickup(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white font-nav text-sm focus:outline-none focus:border-antique-gold focus:ring-1 focus:ring-antique-gold/30 transition-all appearance-none cursor-pointer"
                    >
                        <option value="" className="text-deep-emerald">Select pickup</option>
                        {popularPickups.map((loc) => (
                            <option key={loc} value={loc} className="text-deep-emerald">{loc}</option>
                        ))}
                    </select>
                </div>

                {/* Dropoff */}
                <div className="lg:col-span-1">
                    <label className="block text-white/60 text-xs font-nav uppercase tracking-widest mb-2">
                        Drop-off
                    </label>
                    <select
                        value={dropoff}
                        onChange={(e) => setDropoff(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white font-nav text-sm focus:outline-none focus:border-antique-gold focus:ring-1 focus:ring-antique-gold/30 transition-all appearance-none cursor-pointer"
                    >
                        <option value="" className="text-deep-emerald">Select drop-off</option>
                        {popularDropoffs.map((loc) => (
                            <option key={loc} value={loc} className="text-deep-emerald">{loc}</option>
                        ))}
                    </select>
                </div>

                {/* Date */}
                <div className="lg:col-span-1">
                    <label className="block text-white/60 text-xs font-nav uppercase tracking-widest mb-2">
                        Pickup Date
                    </label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white font-nav text-sm focus:outline-none focus:border-antique-gold focus:ring-1 focus:ring-antique-gold/30 transition-all"
                    />
                </div>

                {/* Passengers */}
                <div className="lg:col-span-1">
                    <label className="block text-white/60 text-xs font-nav uppercase tracking-widest mb-2">
                        Passengers
                    </label>
                    <select
                        value={passengers}
                        onChange={(e) => setPassengers(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white font-nav text-sm focus:outline-none focus:border-antique-gold focus:ring-1 focus:ring-antique-gold/30 transition-all appearance-none cursor-pointer"
                    >
                        {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                            <option key={n} value={n} className="text-deep-emerald">
                                {n} {n === 1 ? 'passenger' : 'passengers'}
                            </option>
                        ))}
                    </select>
                </div>

                {/* CTA */}
                <div className="lg:col-span-1 flex items-end">
                    <button
                        onClick={handleCheckFare}
                        className="w-full px-6 py-3 bg-antique-gold text-deep-emerald font-nav font-bold uppercase tracking-[0.15em] text-sm rounded-lg hover:bg-antique-gold/90 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <Search className="w-4 h-4" />
                        Check Fare
                    </button>
                </div>
            </div>
        </div>
    );
}
