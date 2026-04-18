'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
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
        <div className="w-full">
            {/* Trip Type Toggle - Floating softly above the bar */}
            <div className="flex justify-center xl:justify-start gap-2 mb-3 px-4">
                {['one-way', 'round-trip', 'hourly'].map((type) => (
                    <button
                        key={type}
                        onClick={() => setTripType(type)}
                        className={`px-4 py-1.5 rounded-full text-[9px] font-nav font-bold uppercase tracking-[0.2em] transition-all duration-300 ${
                            tripType === type
                                ? 'bg-deep-emerald text-white shadow-md'
                                : 'bg-transparent text-deep-emerald/60 hover:text-deep-emerald hover:bg-white/40'
                        }`}
                    >
                        {type.replace('-', ' ')}
                    </button>
                ))}
            </div>

            {/* The Main Pill Bar */}
            <div className="bg-white/30 backdrop-blur-2xl border border-white/50 shadow-[0_2px_10px_-2px_rgba(31,38,135,0.1)] rounded-[2rem] xl:rounded-full p-2 hover:bg-white/40 transition-colors duration-500">
                <div className="flex flex-col xl:flex-row items-center gap-1">
                    
                    {/* Pickup */}
                    <div className="flex-1 w-full px-4 py-2 hover:bg-white/40 rounded-full transition-colors cursor-pointer group">
                        <label className="block text-deep-emerald/50 text-[8px] font-nav font-bold uppercase tracking-[0.25em] mb-0.5 ml-1 group-hover:text-deep-emerald/80 transition-colors">
                            Pickup Location
                        </label>
                        <select
                            value={pickup}
                            onChange={(e) => setPickup(e.target.value)}
                            className="w-full bg-transparent text-deep-emerald font-nav text-sm focus:outline-none appearance-none cursor-pointer truncate font-medium"
                        >
                            <option value="" className="text-gray-400">Where from?</option>
                            {popularPickups.map((loc) => (
                                <option key={loc} value={loc} className="text-deep-emerald">{loc}</option>
                            ))}
                        </select>
                    </div>

                    <div className="w-full h-px xl:w-px xl:h-10 bg-deep-emerald/10 mx-2" />

                    {/* Dropoff */}
                    <div className="flex-1 w-full px-4 py-2 hover:bg-white/40 rounded-full transition-colors cursor-pointer group">
                        <label className="block text-deep-emerald/50 text-[8px] font-nav font-bold uppercase tracking-[0.25em] mb-0.5 ml-1 group-hover:text-deep-emerald/80 transition-colors">
                            Drop-off Location
                        </label>
                        <select
                            value={dropoff}
                            onChange={(e) => setDropoff(e.target.value)}
                            className="w-full bg-transparent text-deep-emerald font-nav text-sm focus:outline-none appearance-none cursor-pointer truncate font-medium"
                        >
                            <option value="" className="text-gray-400">Where to?</option>
                            {popularDropoffs.map((loc) => (
                                <option key={loc} value={loc} className="text-deep-emerald">{loc}</option>
                            ))}
                        </select>
                    </div>

                    <div className="w-full h-px xl:w-px xl:h-10 bg-deep-emerald/10 mx-2" />

                    {/* Date */}
                    <div className="w-full xl:w-auto min-w-[140px] px-4 py-2 hover:bg-white/40 rounded-full transition-colors cursor-pointer group">
                        <label className="block text-deep-emerald/50 text-[8px] font-nav font-bold uppercase tracking-[0.25em] mb-0.5 ml-1 group-hover:text-deep-emerald/80 transition-colors">
                            Date
                        </label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-transparent text-deep-emerald font-nav text-sm focus:outline-none cursor-pointer font-medium"
                        />
                    </div>

                    <div className="w-full h-px xl:w-px xl:h-10 bg-deep-emerald/10 mx-2" />

                    {/* Guests */}
                    <div className="w-full xl:w-auto min-w-[120px] px-4 py-2 hover:bg-white/40 rounded-full transition-colors cursor-pointer group">
                        <label className="block text-deep-emerald/50 text-[8px] font-nav font-bold uppercase tracking-[0.25em] mb-0.5 ml-1 group-hover:text-deep-emerald/80 transition-colors">
                            Guests
                        </label>
                        <select
                            value={passengers}
                            onChange={(e) => setPassengers(e.target.value)}
                            className="w-full bg-transparent text-deep-emerald font-nav text-sm focus:outline-none appearance-none cursor-pointer font-medium"
                        >
                            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                                <option key={n} value={n} className="text-deep-emerald">
                                    {n} {n === 1 ? 'Guest' : 'Guests'}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* CTA Button */}
                    <div className="w-full xl:w-auto flex-shrink-0 mt-2 xl:mt-0 px-2 lg:px-0">
                        <button
                            onClick={handleCheckFare}
                            className="w-full xl:w-14 h-12 lg:w-32 lg:h-14 bg-deep-emerald text-white rounded-full hover:bg-antique-gold hover:text-deep-emerald transition-all duration-300 flex items-center justify-center p-0 lg:px-6 gap-2 shadow-lg hover:-translate-y-0.5 shadow-deep-emerald/20"
                        >
                            <Search className="w-5 h-5" />
                            <span className="xl:hidden lg:inline text-[10px] font-bold uppercase tracking-widest font-nav">Search</span>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
