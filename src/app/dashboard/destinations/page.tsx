import { Button } from '@/components/ui/button';
import DestinationTable from '@/components/dashboard/DestinationTable';
import connectDB from '@/lib/mongodb';
import Destination from '@/models/Destination';
import { Plus } from 'lucide-react';
import Link from 'next/link';

async function getDestinations() {
    try {
        await connectDB();
        const destinations = await Destination.find({ isDeleted: false }).sort({ title: 1 }).lean();
        return JSON.parse(JSON.stringify(destinations));
    } catch (error) {
        console.error("Failed to fetch destinations:", error);
        return [];
    }
}

export default async function DestinationsPage() {
    const destinations = await getDestinations();

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white drop-shadow-sm tracking-tight">Destinations</h1>
                    <p className="text-sm text-white/50 mt-1 font-light">Manage travel destinations and their details.</p>
                </div>
                <Link href="/dashboard/destinations/new">
                    <Button className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#0a1f15] font-semibold text-xs tracking-widest rounded-xl transition-all hover:scale-105">
                        <Plus className="mr-2 h-4 w-4" /> Add Destination
                    </Button>
                </Link>
            </div>

            <div className="liquid-glass-stat-dark rounded-2xl p-1 shadow-2xl">
                <DestinationTable initialDestinations={destinations} />
            </div>
        </div>
    );
}
