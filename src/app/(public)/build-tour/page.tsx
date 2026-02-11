import { Metadata } from 'next';
import SectionHeading from '@/components/public/SectionHeading';
import TourBuilderWrapper from '@/components/public/TourBuilderWrapper';
import connectDB from '@/lib/mongodb';
import District from '@/models/District';
import DistrictPlace from '@/models/DistrictPlace';

export const metadata: Metadata = {
    title: 'Build Your Custom Tour | Ceylon Escapes',
    description: 'Create your perfect Sri Lanka itinerary. Customize your destinations, duration, and experiences.',
};

async function getBuilderData() {
    try {
        await connectDB();
        const [districts, places] = await Promise.all([
            District.find().sort({ name: 1 }).lean(),
            DistrictPlace.find({ isActive: true, isDeleted: false }).lean()
        ]);

        return {
            districts: JSON.parse(JSON.stringify(districts)),
            places: JSON.parse(JSON.stringify(places))
        };
    } catch (error) {
        console.error("Failed to fetch builder data:", error);
        return { districts: [], places: [] };
    }
}

export default async function BuildTourPage() {
    const { districts, places } = await getBuilderData();

    return (
        <div className="min-h-screen bg-white">
            <div className="bg-ocean-900 text-white py-20 px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Design Your Dream Holiday</h1>
                <p className="text-xl text-ocean-200 max-w-2xl mx-auto">
                    Tailor-made experiences designed just for you. Tell us what you love, and we'll handle the rest.
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-10 pb-20 relative z-10">
                <TourBuilderWrapper districts={districts} places={places} />
            </div>
        </div>
    );
}
