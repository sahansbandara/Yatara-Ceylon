import { Metadata } from 'next';
import SectionHeading from '@/components/public/SectionHeading';
import DestinationCard from '@/components/public/DestinationCard';
import connectDB from '@/lib/mongodb';
import Destination from '@/models/Destination';
import { FilterX } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Destinations | Ceylon Escapes',
    description: 'Explore the most beautiful destinations in Sri Lanka. From the beaches of Mirissa to the heights of Ella.',
};

async function getDestinations() {
    try {
        await connectDB();
        const destinations = await Destination.find({ isPublished: true, isDeleted: false })
            .sort({ title: 1 })
            .lean();
        return JSON.parse(JSON.stringify(destinations));
    } catch (error) {
        console.error("Failed to fetch destinations:", error);
        return [];
    }
}

export default async function DestinationsPage() {
    const destinations = await getDestinations();

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Header */}
                <div className="mb-12">
                    <SectionHeading
                        title="Explore Sri Lanka"
                        subtitle="All Destinations"
                        description="Discover the island's diverse landscapes, from coastal plains to the central highlands."
                    />
                </div>

                {destinations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {destinations.map((dest: any) => (
                            <DestinationCard key={dest._id} destination={dest} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center bg-white rounded-xl p-12 text-center border dashed border-gray-200 h-64">
                        <div className="bg-gray-50 p-4 rounded-full mb-4">
                            <FilterX className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No destinations found</h3>
                        <p className="text-gray-500 max-w-sm">
                            Check back soon for updates.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
