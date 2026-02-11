import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, MapPin, Clock, Calendar, Star, Shield, ArrowRight } from 'lucide-react';
import SectionHeading from '@/components/public/SectionHeading';
import connectDB from '@/lib/mongodb';
import Package from '@/models/Package';

// Force dynamic rendering for detail page
export const dynamic = 'force-dynamic';

async function getPackage(slug: string) {
    await connectDB();
    const pkg = await Package.findOne({ slug, isPublished: true, isDeleted: false }).lean();
    return pkg ? JSON.parse(JSON.stringify(pkg)) : null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const pkg = await getPackage(slug);
    if (!pkg) return { title: 'Package Not Found' };
    return {
        title: `${pkg.title} | Ceylon Escapes`,
        description: pkg.summary,
    };
}

export default async function PackageDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const pkg = await getPackage(slug);

    if (!pkg) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero Header */}
            <div className="relative h-[60vh] w-full">
                <Image
                    src={pkg.images[0] || 'https://images.unsplash.com/photo-1546708773-e57be64fa2e3?w=1200'}
                    alt={pkg.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white px-4">
                        <Badge className="mb-4 bg-ocean-600 hover:bg-ocean-700 text-lg px-4 py-1">
                            {pkg.duration}
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">{pkg.title}</h1>
                        <p className="text-xl text-gray-200 max-w-2xl mx-auto">{pkg.summary}</p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-20 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Overview Card */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tour Overview</h2>
                            <div className="prose max-w-none text-gray-600 leading-relaxed mb-6">
                                <p>{pkg.fullDescription || pkg.summary}</p>
                            </div>

                            <div className="flex flex-wrap gap-4 mt-6">
                                {pkg.tags?.map((tag: string) => (
                                    <Badge key={tag} variant="secondary" className="px-3 py-1 bg-gray-100 text-gray-600">
                                        #{tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Itinerary */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Itinerary</h2>
                            <div className="space-y-6">
                                {pkg.itinerary?.map((day: any) => (
                                    <div key={day.day} className="relative pl-8 border-l-2 border-ocean-100 last:border-0 pb-6">
                                        <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-ocean-500 ring-4 ring-white" />
                                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                            <span className="text-ocean-600">Day {day.day}:</span> {day.title}
                                        </h3>
                                        <p className="text-gray-600 mt-2">{day.description}</p>
                                        {day.activity && (
                                            <div className="mt-3 flex items-center text-sm text-ocean-700 bg-ocean-50 px-3 py-2 rounded-lg w-fit">
                                                <Star className="h-4 w-4 mr-2" />
                                                Highlight: {day.activity}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Inclusions & Exclusions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h3 className="text-lg font-bold text-green-700 mb-4 flex items-center gap-2">
                                    <Check className="h-5 w-5" /> What's Included
                                </h3>
                                <ul className="space-y-3">
                                    {pkg.inclusions?.map((item: string, idx: number) => (
                                        <li key={idx} className="flex items-start gap-2 text-gray-600 text-sm">
                                            <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h3 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2">
                                    <X className="h-5 w-5" /> What's Excluded
                                </h3>
                                <ul className="space-y-3">
                                    {pkg.exclusions?.map((item: string, idx: number) => (
                                        <li key={idx} className="flex items-start gap-2 text-gray-600 text-sm">
                                            <X className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Booking Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            <div className="bg-white rounded-2xl p-6 shadow-xl border border-ocean-100">
                                <div className="text-center mb-6">
                                    <p className="text-gray-500 text-sm uppercase tracking-wide font-semibold">Starting Price</p>
                                    <h3 className="text-4xl font-bold text-ocean-700">
                                        ${pkg.priceMin?.toLocaleString()}
                                    </h3>
                                    <p className="text-xs text-gray-400 mt-1">per person (approx)</p>
                                </div>

                                <div className="space-y-4 border-t border-gray-100 pt-6">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600 flex items-center gap-2">
                                            <Clock className="h-4 w-4" /> Duration
                                        </span>
                                        <span className="font-semibold">{pkg.duration}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600 flex items-center gap-2">
                                            <MapPin className="h-4 w-4" /> Locations
                                        </span>
                                        <span className="font-semibold">{pkg.itinerary?.length || 0} Stops</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600 flex items-center gap-2">
                                            <Shield className="h-4 w-4" /> Type
                                        </span>
                                        <span className="font-semibold capitalize">Standard Tour</span>
                                    </div>
                                </div>

                                <div className="mt-8 space-y-3">
                                    <Link href={`/public/booking-request?packageId=${pkg._id}`} className="block">
                                        <Button className="w-full h-12 text-lg font-bold bg-ocean-600 hover:bg-ocean-700 shadow-lg shadow-ocean-600/20">
                                            Book This Tour
                                        </Button>
                                    </Link>
                                    <Link href="/contact" className="block">
                                        <Button variant="outline" className="w-full h-12 text-ocean-700 border-ocean-200 hover:bg-ocean-50">
                                            Ask a Question
                                        </Button>
                                    </Link>
                                </div>

                                <p className="text-xs text-center text-gray-400 mt-4">
                                    No upfront payment required to request booking.
                                </p>
                            </div>

                            <div className="bg-ocean-50 rounded-xl p-6 border border-ocean-100">
                                <h4 className="font-bold text-ocean-900 mb-2">Need Customization?</h4>
                                <p className="text-sm text-ocean-700 mb-4">
                                    We can tailor this itinerary to your specific needs and preferences.
                                </p>
                                <Link href="/build-tour" className="text-sm font-semibold text-ocean-600 hover:text-ocean-800 flex items-center gap-1">
                                    Build Custom Plan <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
