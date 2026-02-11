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
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Destinations</h1>
                    <p className="text-muted-foreground">Manage travel destinations and their details.</p>
                </div>
                <Link href="/dashboard/destinations/new">
                    <Button className="bg-ocean-600 hover:bg-ocean-700">
                        <Plus className="mr-2 h-4 w-4" /> Add Destination
                    </Button>
                </Link>
            </div>

            <DestinationTable initialDestinations={destinations} />
        </div>
    );
}
