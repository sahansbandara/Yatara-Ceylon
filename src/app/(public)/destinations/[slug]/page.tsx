import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import SectionHeading from '@/components/public/SectionHeading';
import PackageCard from '@/components/public/PackageCard';
import connectDB from '@/lib/mongodb';
import Destination from '@/models/Destination';
import Package from '@/models/Package';
import { MapPin, ArrowLeft } from 'lucide-react';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

async function getDestination(slug: string) {
    await connectDB();
    const dest: any = await Destination.findOne({ slug, isPublished: true, isDeleted: false }).lean();
    if (!dest) return null;

    // Fetch related packages (simple matching by title in tags or summary)
    // Using regex for flexibility
    const relatedPackages = await Package.find({
        isPublished: true,
        isDeleted: false,
        $or: [
            { tags: { $in: [new RegExp(dest.title, 'i'), new RegExp(dest.slug, 'i')] } },
            { summary: { $regex: dest.title, $options: 'i' } }
        ]
    })
        .sort({ rating: -1 })
        .limit(3)
        .lean();

    return {
        destination: JSON.parse(JSON.stringify(dest)),
        relatedPackages: JSON.parse(JSON.stringify(relatedPackages))
    };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    await connectDB();
    const dest: any = await Destination.findOne({ slug, isPublished: true, isDeleted: false }).lean();
    if (!dest) return { title: 'Destination Not Found' };
    return {
        title: `${dest.title} | Ceylon Escapes`,
        description: dest.description,
    };
}

export default async function DestinationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const data = await getDestination(slug);

    if (!data) {
        notFound();
    }

    const { destination, relatedPackages } = data;

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Hero Image */}
            <div className="relative h-[60vh] w-full">
                <Image
                    src={destination.images[0] || 'https://images.unsplash.com/photo-1546708773-e57be64fa2e3?w=1200'}
                    alt={destination.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
                    <div className="max-w-7xl mx-auto">
                        <Link href="/destinations" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
                            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Destinations
                        </Link>
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">{destination.title}</h1>
                        <div className="flex items-center text-white/90 text-lg">
                            <MapPin className="h-5 w-5 mr-2" />
                            {destination.location || 'Sri Lanka'}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Content */}
                    <div className="lg:col-span-2">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">About {destination.title}</h2>
                        <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
                            <p className="text-xl font-medium text-gray-800 mb-6">
                                {destination.description}
                            </p>
                            <div className="whitespace-pre-wrap">
                                {destination.longDescription || "Experience the magic of this incredible destination. From its stunning vistas to its rich cultural heritage, there is something for everyone to discover."}
                            </div>
                        </div>

                        {/* Gallery */}
                        {destination.images && destination.images.length > 1 && (
                            <div className="mt-12">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Gallery</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {destination.images.slice(1).map((img: string, idx: number) => (
                                        <div key={idx} className="relative h-48 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                            <Image
                                                src={img}
                                                alt={`${destination.title} ${idx + 2}`}
                                                fill
                                                className="object-cover hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar / Related Packages */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                Tours Visiting {destination.title}
                            </h3>

                            {relatedPackages.length > 0 ? (
                                <div className="space-y-6">
                                    {relatedPackages.map((pkg: any) => (
                                        <PackageCard key={pkg._id} pkg={pkg} />
                                    ))}
                                    <Link href={`/packages?q=${destination.title}`} className="block text-center mt-4">
                                        <Button variant="outline" className="w-full">
                                            View All Related Tours
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-100">
                                    <p className="text-gray-500 mb-4">No specific tours listed for this destination yet.</p>
                                    <Link href="/build-tour">
                                        <Button className="w-full bg-ocean-600 hover:bg-ocean-700">
                                            Build Custom Tour
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
