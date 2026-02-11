import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import HeroSection from '@/components/public/HeroSection';
import SectionHeading from '@/components/public/SectionHeading';
import PackageCard from '@/components/public/PackageCard';
import DestinationCard from '@/components/public/DestinationCard';
import { ArrowRight, CheckCircle2, Map, Star, ShieldCheck, HeartHandshake } from 'lucide-react';
import connectDB from '@/lib/mongodb';
import Package from '@/models/Package';
import Destination from '@/models/Destination';
import Testimonial from '@/models/Testimonial';

// Fetch data directly in Server Component
async function getFeaturedData() {
    try {
        await connectDB();

        const [packages, destinations, testimonials] = await Promise.all([
            Package.find({ isPublished: true, isDeleted: false })
                .sort({ rating: -1, createdAt: -1 })
                .limit(3)
                .lean(),
            Destination.find({ isPublished: true, isDeleted: false })
                .sort({ createdAt: -1 })
                .limit(4)
                .lean(),
            Testimonial.find({ isPublished: true, isDeleted: false, rating: 5 })
                .sort({ createdAt: -1 })
                .limit(5)
                .lean(),
        ]);

        return {
            packages: JSON.parse(JSON.stringify(packages)),
            destinations: JSON.parse(JSON.stringify(destinations)),
            testimonials: JSON.parse(JSON.stringify(testimonials)),
        };
    } catch (error) {
        console.error("Failed to fetch home page data:", error);
        return {
            packages: [],
            destinations: [],
            testimonials: [],
        };
    }
}

export default async function HomePage() {
    const { packages, destinations, testimonials } = await getFeaturedData();

    return (
        <div className="min-h-screen">
            <HeroSection />

            {/* Destinations Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <SectionHeading
                        title="Popular Destinations"
                        subtitle="Explore Sri Lanka"
                        description="From pristine beaches to misty mountains, discover the island's most captivating locations."
                        className="mb-12"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {destinations.map((dest: any) => (
                            <DestinationCard key={dest._id} destination={dest} />
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <Link href="/destinations">
                            <Button variant="outline" className="border-ocean-600 text-ocean-600 hover:bg-ocean-50">
                                View All Destinations
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-ocean-50 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-sand-50 rounded-full blur-3xl opacity-50" />

                <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <SectionHeading
                                title="Why Choose Ceylon Escapes?"
                                subtitle="The Ceylon Difference"
                                align="left"
                                className="mb-8"
                            />
                            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                                We don't just plan tours; we craft unforgettable experiences tailored to your desires.
                                With local expertise and a passion for hospitality, we show you the Sri Lanka that typical tourists miss.
                            </p>

                            <div className="space-y-6">
                                {[
                                    { icon: checkIcon, title: 'Personalized Itineraries', desc: 'Every trip is unique, designed around your interests and pace.' },
                                    { icon: shieldIcon, title: 'Safety & Comfort', desc: 'Premium vehicles and verified accommodations for peace of mind.' },
                                    { icon: handshakeIcon, title: 'Local Expertise', desc: 'Guidance from experienced locals who know the island inside out.' },
                                ].map((feature, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="flex-shrink-0 h-12 w-12 rounded-full bg-ocean-100 flex items-center justify-center text-ocean-600">
                                            {feature.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-lg">{feature.title}</h4>
                                            <p className="text-gray-500">{feature.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                                <Image
                                    src="https://images.unsplash.com/photo-1534351590666-13e3e9635018?w=800&auto=format&fit=crop&q=60"
                                    alt="Sri Lanka Experience"
                                    width={600}
                                    height={800}
                                    className="object-cover w-full h-[600px]"
                                />
                            </div>
                            <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-xl shadow-xl max-w-xs animate-in slide-in-from-bottom-4 duration-700 delay-300">
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden relative">
                                                <Image src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" fill className="object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-sm">
                                        <p className="font-bold text-gray-900">500+ Happy Travelers</p>
                                        <div className="flex text-yellow-500 text-xs">★★★★★</div>
                                    </div>
                                </div>
                                <p className="text-gray-500 text-xs italic">"Absolute paradise! Best vacation we've ever had thanks to the team."</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Packages */}
            <section className="py-24 bg-ocean-50/50">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <SectionHeading
                        title="Curated Tour Packages"
                        subtitle="Best Sellers"
                        description="Handpicked itineraries that showcase the best of Sri Lanka."
                        className="mb-12"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {packages.map((pkg: any) => (
                            <PackageCard key={pkg._id} pkg={pkg} />
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <Link href="/packages">
                            <Button size="lg" className="bg-ocean-600 hover:bg-ocean-700 text-white px-8 rounded-full shadow-lg shadow-ocean-600/20">
                                Explore All Packages
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-ocean-900 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Create Your Dream Journey</h2>
                    <p className="text-xl text-ocean-100 mb-10 max-w-2xl mx-auto">
                        Don't fit into a box? Build a custom tour plan that perfectly matches your interests, schedule, and budget.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/build-tour">
                            <Button size="lg" className="bg-white text-ocean-900 hover:bg-ocean-50 text-lg px-8 py-6 rounded-full font-bold w-full sm:w-auto">
                                <Map className="mr-2 h-5 w-5" />
                                Build My Tour
                            </Button>
                        </Link>
                        <Link href="/contact">
                            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-6 rounded-full font-bold w-full sm:w-auto">
                                Contact Us
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

const checkIcon = <CheckCircle2 className="h-6 w-6" />;
const shieldIcon = <ShieldCheck className="h-6 w-6" />;
const handshakeIcon = <HeartHandshake className="h-6 w-6" />;
