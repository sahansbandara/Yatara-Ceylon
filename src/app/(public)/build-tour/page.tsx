import { Metadata } from 'next';
import SectionHeading from '@/components/public/SectionHeading';
import TourBuilderWrapper from '@/components/public/TourBuilderWrapper';
import BespokeMapSection from '@/components/public/BespokeMapSection';
import connectDB from '@/lib/mongodb';
import District from '@/models/District';
import DistrictPlace from '@/models/DistrictPlace';

export const metadata: Metadata = {
    title: 'Bespoke Planning | Yatara Ceylon',
    description: 'Design your perfect Sri Lanka itinerary. Select districts on our interactive map and curate a luxury journey tailored to you.',
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
        <div className="min-h-screen bg-off-white">
            {/* Hero Banner */}
            <div className="relative bg-deep-emerald text-off-white py-24 px-4 text-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-deep-emerald via-[#043927] to-emerald-950" />
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
                <div className="relative z-10">
                    <span className="inline-block py-1 px-4 text-xs tracking-[0.2em] uppercase font-medium text-antique-gold border border-antique-gold/30 mb-6 bg-black/20 backdrop-blur-sm">
                        Your Journey, Your Way
                    </span>
                    <h1 className="text-4xl md:text-5xl font-serif mb-4 tracking-wide">
                        Bespoke Planning
                    </h1>
                    <p className="text-xl text-off-white/80 max-w-2xl mx-auto font-light leading-relaxed">
                        Click on any district to discover its treasures. Select the places that call to you, and we&apos;ll craft an extraordinary journey.
                    </p>
                </div>
            </div>

            {/* Interactive Map Section */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-10 pb-8 relative z-10">
                <BespokeMapSection />
            </div>

            {/* Detailed Tour Builder */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
                <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-serif text-deep-emerald mb-3">
                        Or Build Step by Step
                    </h2>
                    <p className="text-gray-500 font-light text-sm max-w-lg mx-auto">
                        Prefer a guided experience? Use our step-by-step builder to select destinations, accommodations, and transfers.
                    </p>
                </div>
                <TourBuilderWrapper districts={districts} places={places} />
            </div>
        </div>
    );
}
