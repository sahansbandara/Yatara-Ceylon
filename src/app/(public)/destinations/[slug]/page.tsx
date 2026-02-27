import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import PackageCard from '@/components/public/PackageCard';
import connectDB from '@/lib/mongodb';
import Destination from '@/models/Destination';
import Package from '@/models/Package';
import { ArrowLeft, Compass, MapPin, Sparkles } from 'lucide-react';
import { DESTINATION_BY_SLUG } from '@/data/destinations';

export const dynamic = 'force-dynamic';

interface DestinationDetail {
    title: string;
    slug: string;
    description: string;
    longDescription?: string;
    location?: string;
    images?: string[];
}

const districtImage = (slug: string) => `/images/districts/${slug}.svg`;

function toDestinationDetail(raw: any): DestinationDetail {
    return {
        title: raw.title,
        slug: raw.slug,
        description: raw.description,
        longDescription: raw.longDescription,
        location: raw.location,
        images: raw.images,
    };
}

async function getDestination(slug: string) {
    await connectDB();

    const dbDestination: any = await Destination.findOne({ slug, isPublished: true, isDeleted: false }).lean();

    const fallbackDestination = DESTINATION_BY_SLUG[slug] ?? null;

    const destination = dbDestination
        ? toDestinationDetail(JSON.parse(JSON.stringify(dbDestination)))
        : fallbackDestination;

    if (!destination) {
        return null;
    }

    const relatedPackages = dbDestination
        ? await Package.find({
            isPublished: true,
            isDeleted: false,
            $or: [
                { tags: { $in: [new RegExp(destination.title, 'i'), new RegExp(destination.slug, 'i')] } },
                { summary: { $regex: destination.title, $options: 'i' } },
            ],
        })
            .sort({ rating: -1 })
            .limit(3)
            .lean()
        : [];

    return {
        destination,
        relatedPackages: JSON.parse(JSON.stringify(relatedPackages)),
    };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;

    await connectDB();
    const dbDestination: any = await Destination.findOne({ slug, isPublished: true, isDeleted: false }).lean();
    const fallbackDestination = DESTINATION_BY_SLUG[slug] ?? null;
    const destination = dbDestination ? toDestinationDetail(dbDestination) : fallbackDestination;

    if (!destination) {
        return { title: 'Destination Not Found | Yatara Ceylon' };
    }

    return {
        title: `${destination.title} | Yatara Ceylon`,
        description: destination.description,
    };
}

export default async function DestinationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const data = await getDestination(slug);

    if (!data) {
        notFound();
    }

    const { destination, relatedPackages } = data;

    const heroImage = destination.images?.[0] ?? districtImage(destination.slug || slug);
    const galleryImages = destination.images && destination.images.length > 1
        ? destination.images.slice(1)
        : [districtImage(destination.slug || slug), districtImage(destination.slug || slug)];

    return (
        <div className="min-h-screen bg-off-white pb-24">
            <div className="relative h-[65vh] min-h-[460px] w-full overflow-hidden">
                <Image
                    src={heroImage}
                    alt={destination.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep-emerald via-deep-emerald/50 to-black/20" />

                <div className="absolute inset-0">
                    <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex flex-col justify-end pb-12 md:pb-16">
                        <Link href="/destinations" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors w-fit text-sm tracking-[0.1em] uppercase">
                            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Destinations
                        </Link>

                        <div className="max-w-4xl">
                            <span className="inline-flex items-center gap-2 mb-5 py-1.5 px-4 text-[11px] tracking-[0.2em] uppercase border border-antique-gold/35 text-antique-gold bg-black/20 backdrop-blur-sm">
                                <Sparkles className="h-3.5 w-3.5" /> Curated District Guide
                            </span>
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-5 leading-tight">{destination.title}</h1>
                            <div className="flex flex-wrap items-center gap-4 text-white/90">
                                <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" /> {destination.location || 'Sri Lanka'}</span>
                                <span className="hidden md:inline text-antique-gold/70">•</span>
                                <span className="inline-flex items-center gap-2"><Compass className="h-4 w-4" /> Private Journey Ready</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 pt-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2">
                        <div className="rounded-2xl border border-deep-emerald/10 bg-white p-8 md:p-10 mb-10">
                            <h2 className="text-3xl font-serif text-deep-emerald mb-6">About {destination.title}</h2>
                            <p className="text-xl text-deep-emerald/85 font-light mb-6 leading-relaxed">{destination.description}</p>
                            <p className="text-gray-600 font-light leading-relaxed whitespace-pre-wrap">
                                {destination.longDescription || 'Discover signature landscapes, cultural depth, and refined experiences designed around your travel pace. This district can be integrated into a bespoke itinerary with private transfers and curated local access.'}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-2xl font-serif text-deep-emerald mb-5">Gallery</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {galleryImages.map((img: string, idx: number) => (
                                    <div key={`${img}-${idx}`} className="relative h-64 rounded-2xl overflow-hidden border border-deep-emerald/10 bg-white shadow-sm">
                                        <Image
                                            src={img}
                                            alt={`${destination.title} ${idx + 1}`}
                                            fill
                                            className="object-cover hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-deep-emerald/35 to-transparent" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="sticky top-24 rounded-2xl border border-deep-emerald/10 bg-white p-6 md:p-8">
                            <h3 className="text-xl font-serif text-deep-emerald mb-6">Tours Visiting {destination.title}</h3>

                            {relatedPackages.length > 0 ? (
                                <div className="space-y-6">
                                    {relatedPackages.map((pkg: any) => (
                                        <PackageCard key={pkg._id} pkg={pkg} />
                                    ))}
                                    <Link href={`/packages?q=${destination.title}`} className="block pt-2">
                                        <Button variant="outline" className="w-full border-deep-emerald text-deep-emerald hover:bg-deep-emerald hover:text-white">
                                            View All Related Tours
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="rounded-xl border border-antique-gold/30 bg-antique-gold/10 p-5">
                                    <p className="text-gray-600 mb-4 font-light">No specific tours are listed yet for this district.</p>
                                    <Link href="/build-tour">
                                        <Button className="w-full bg-deep-emerald hover:bg-deep-emerald/90 text-antique-gold">
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
