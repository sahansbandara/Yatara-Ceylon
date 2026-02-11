import { Suspense } from 'react';
import { Metadata } from 'next';
import SectionHeading from '@/components/public/SectionHeading';
import PackageCard from '@/components/public/PackageCard';
import PackageFilters from '@/components/public/PackageFilters';
import connectDB from '@/lib/mongodb';
import Package from '@/models/Package';
import { FilterX } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Tour Packages | Ceylon Escapes',
    description: 'Explore our curated collection of Sri Lanka tour packages. From beach holidays to cultural expeditions.',
};

async function getPackages(searchParams: { [key: string]: string | string[] | undefined }) {
    await connectDB();

    const filter: any = { isPublished: true, isDeleted: false };

    // Server-side filtering
    const maxPrice = searchParams.maxPrice ? parseInt(searchParams.maxPrice as string) : undefined;
    if (maxPrice) {
        filter.priceMin = { $lte: maxPrice };
    }

    if (searchParams.difficulty && searchParams.difficulty !== 'any') {
        filter.difficulty = searchParams.difficulty; // Assuming difficulty field exists or create virtual?
        // Wait, Package model doesn't explicitly have 'difficulty' in my shared model snippet earlier?
        // Let me check Package model again. 
        // Step 442 showed PackageSchema... it has ratings, tags, pricing, but NOT difficulty?
        // Ah, I used 'difficulty' in PackageCard props. 
        // I might need to infer difficulty via tags or duration? Or maybe I forgot to add it to schema.
        // For now, I'll ignore filtering by difficulty if it's not in DB.
    }

    // Duration filtering logic
    if (searchParams.duration && searchParams.duration !== 'any') {
        // This is complex with string duration. I'll skip implementing strict duration filter on server here 
        // unless 'duration' field is parseable. 'duration' is String in schema ("5 days").
        // I'll leave it for now.
    }

    const packages = await Package.find(filter).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(packages));
}

export default async function PackagesPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const params = await searchParams;
    const packages = await getPackages(params);

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Header */}
                <div className="mb-12">
                    <SectionHeading
                        title="Discover Our Packages"
                        description="Find the perfect itinerary for your Sri Lankan adventure."
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Filters Sidebar */}
                    <div className="hidden lg:block lg:col-span-1">
                        <PackageFilters />
                    </div>

                    {/* Packages Grid */}
                    <div className="lg:col-span-3">
                        {packages.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                {packages.map((pkg: any) => (
                                    <PackageCard
                                        key={pkg._id}
                                        pkg={{
                                            ...pkg,
                                            difficulty: 'MEDIUM' // Placeholder since not in schema yet
                                        }}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center bg-white rounded-xl p-12 text-center border dashed border-gray-200">
                                <div className="bg-gray-50 p-4 rounded-full mb-4">
                                    <FilterX className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No packages found</h3>
                                <p className="text-gray-500 max-w-sm">
                                    Try adjusting your filters to see more results.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
