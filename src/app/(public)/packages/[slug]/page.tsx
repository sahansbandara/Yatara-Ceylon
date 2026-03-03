import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Check, X, Clock, MapPin, Star, ArrowRight, Sparkles, Users, Compass } from 'lucide-react';
import connectDB from '@/lib/mongodb';
import Package from '@/models/Package';

export const dynamic = 'force-dynamic';

const MOCK_PACKAGES = [
    {
        _id: 'p1',
        title: 'The Ramayana Heritage Trail',
        slug: 'ramayana-heritage-trail',
        summary: 'A spiritual and cultural odyssey tracing the ancient Ramayana saga across sacred temples, mystical caves, and legendary landmarks.',
        fullDescription: 'Trace the legendary footsteps of the Ramayana across Sri Lanka\'s most sacred and breathtaking sites. From the ancient temples of Nuwara Eliya to the coastal shrines of Trincomalee, this journey weaves mythology with natural wonder in an experience found nowhere else on earth.',
        priceMin: 128000,
        priceMax: 195000,
        duration: '6 Days / 5 Nights',
        images: ['/images/home/signature-heritage.png', '/images/home/pkg_ramayana_1772119639135.png'],
        tags: ['Families', 'Pilgrims', 'Culture'],
        highlights: ['Key temple circuit with comfortable routing', 'Private guide days', 'Upgraded stays for recovery', 'Sacred evening ceremonies'],
        itinerary: [
            { day: 1, title: 'Arrival & Colombo', description: 'Begin your journey with a welcome at the airport and a transfer to Colombo.', activity: 'Galle Face Green Walk' },
            { day: 2, title: 'Sacred Temples', description: 'Visit the revered temples central to the Ramayana epic.', activity: 'Temple Visit' },
        ],
        inclusions: ['Luxury accommodation', 'Private chauffeur-guide', 'Daily breakfast', 'Entrance fees to Ramayana sites'],
        exclusions: ['International flights', 'Lunch & dinner', 'Personal expenses'],
    },
    {
        _id: 'p2',
        title: 'Ceylon Highlights Express',
        slug: 'ceylon-highlights-express',
        summary: 'The essential Sri Lanka in seven unforgettable days — tea country, wildlife, and golden coastline.',
        fullDescription: 'An essential 7-day immersion through Sri Lanka\'s crown jewels — from Sigiriya\'s lion fortress to Galle\'s colonial charm. Ideal for first-time visitors, couples, and families.',
        priceMin: 155000,
        priceMax: 280000,
        duration: '7 Days / 6 Nights',
        images: ['/images/home/pkg_ceylon_express_1772119662402.png'],
        tags: ['First-Time Visitors', 'Couples', 'Families'],
        highlights: ['Sigiriya sunrise option', 'Scenic train segment', 'Galle Fort walk with local storyteller'],
        itinerary: [
            { day: 1, title: 'Arrival & Negombo', description: 'Rest after your flight in the coastal town of Negombo.', activity: 'Beach Sunset' },
            { day: 2, title: 'Cultural Triangle', description: 'Journey to the ancient kingdoms.', activity: 'Sigiriya Rock Climb' },
        ],
        inclusions: ['4-star boutique stays', 'Private AC vehicle', 'Breakfast & dinner', 'Safari jeep'],
        exclusions: ['Flights', 'Visas', 'Travel insurance'],
    },
    {
        _id: 'p3',
        title: 'Heritage & Wildlife Adventure',
        slug: 'heritage-wildlife-adventure',
        summary: 'Ancient kingdoms by morning, leopard safaris by dusk — the ultimate Sri Lanka dual experience.',
        fullDescription: 'The ultimate Sri Lanka experience — from UNESCO heritage sites to thrilling safari encounters at Yala National Park. Designed for wildlife lovers and history buffs alike.',
        priceMin: 195000,
        priceMax: 350000,
        duration: '7 Days / 6 Nights',
        images: ['/images/home/signature-wildlife.png', '/images/home/pkg_heritage_wildlife_1772119687299.png'],
        tags: ['Wildlife Lovers', 'History Buffs'],
        highlights: ['Private jeep safari drives', 'UNESCO site access', 'Boutique lodge stays', 'Wildlife photography opportunities'],
        itinerary: [
            { day: 1, title: 'Arrival', description: 'Welcome to Sri Lanka.', activity: 'Transfer to Hotel' },
            { day: 5, title: 'Yala National Park', description: 'Experience the thrill of the wild.', activity: 'Leopard Safari' },
        ],
        inclusions: ['Luxury resort stays', 'Private naturalist guide', 'All park fees', 'Half-board meals'],
        exclusions: ['Camera permits', 'Gratuities', 'Extra safaris'],
    },
];

async function getPackage(slug: string) {
    try {
        await connectDB();
        const pkg = await Package.findOne({ slug, isPublished: true, isDeleted: false }).lean();
        if (pkg) {
            return JSON.parse(JSON.stringify(pkg));
        }
    } catch {
        // Fall through to mock
    }
    const mockPkg = MOCK_PACKAGES.find(p => p.slug === slug);
    return mockPkg || null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const pkg = await getPackage(slug);
    if (!pkg) return { title: 'Package Not Found' };
    return {
        title: `${pkg.title} | Yatara Ceylon`,
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
        <div className="min-h-screen bg-off-white pb-24">
            {/* Hero */}
            <div className="relative h-[55vh] md:h-[65vh] w-full">
                <Image
                    src={pkg.images?.[0] || '/images/home/curated-kingdoms.png'}
                    alt={pkg.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

                <div className="absolute inset-0 flex items-end">
                    <div className="max-w-7xl mx-auto px-6 md:px-12 pb-12 md:pb-16 w-full">
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-5">
                            {pkg.tags?.map((tag: string) => (
                                <span key={tag} className="text-[10px] tracking-[0.2em] uppercase font-medium text-white/80 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/15">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-display text-white mb-4 leading-[1.1] drop-shadow-lg max-w-3xl">
                            {pkg.title}
                        </h1>
                        <p className="text-white/70 font-light text-base md:text-lg max-w-2xl leading-relaxed">
                            {pkg.summary}
                        </p>

                        {/* Quick meta strip */}
                        <div className="flex flex-wrap items-center gap-6 mt-6 text-white/60 text-sm">
                            {pkg.duration && (
                                <span className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-antique-gold" />
                                    {pkg.duration}
                                </span>
                            )}
                            {pkg.itinerary?.length > 0 && (
                                <span className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-antique-gold" />
                                    {pkg.itinerary.length} Destinations
                                </span>
                            )}
                            <span className="flex items-center gap-2">
                                <Compass className="w-4 h-4 text-antique-gold" />
                                Private Guide
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gallery Strip */}
            {pkg.images && pkg.images.length > 1 && (
                <div className="max-w-7xl mx-auto px-6 md:px-12 -mt-6 mb-8 relative z-10">
                    <div className="grid grid-cols-3 gap-3 md:gap-4">
                        {pkg.images.slice(1, 4).map((img: string, idx: number) => (
                            <div key={idx} className="relative aspect-[4/3] rounded-xl overflow-hidden group/gallery">
                                <Image
                                    src={img}
                                    alt={`${pkg.title} gallery ${idx + 1}`}
                                    fill
                                    className="object-cover transform group-hover/gallery:scale-[1.03] transition-transform duration-700 ease-out"
                                />
                                <div className="absolute inset-0 bg-black/5 group-hover/gallery:bg-black/0 transition-colors duration-500" />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-6 md:px-12 -mt-2 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Signature Moments */}
                        {pkg.highlights && pkg.highlights.length > 0 && (
                            <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-gray-100/80">
                                <div className="flex items-center gap-3 mb-6">
                                    <Star className="w-5 h-5 text-antique-gold" />
                                    <h2 className="text-xl md:text-2xl font-display text-deep-emerald">Signature Moments</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {pkg.highlights.map((highlight: string, idx: number) => (
                                        <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-off-white/80 border border-gray-100/50">
                                            <span className="text-antique-gold text-lg leading-none mt-0.5">&#9670;</span>
                                            <p className="text-sm text-gray-600 font-light leading-relaxed">{highlight}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Overview */}
                        <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-gray-100/80">
                            <h2 className="text-xl md:text-2xl font-display text-deep-emerald mb-5">Journey Overview</h2>
                            <div className="prose prose-gray max-w-none text-gray-500 font-light leading-relaxed text-[15px]">
                                <p>{pkg.fullDescription || pkg.summary}</p>
                            </div>

                            {/* Ideal For tags */}
                            {pkg.tags && pkg.tags.length > 0 && (
                                <div className="mt-8 pt-6 border-t border-gray-100">
                                    <p className="text-[11px] tracking-[0.2em] uppercase text-gray-400 font-medium mb-3">Ideal For</p>
                                    <div className="flex flex-wrap gap-2">
                                        {pkg.tags.map((tag: string) => (
                                            <span key={tag} className="text-[11px] tracking-[0.1em] uppercase font-medium text-deep-emerald/70 bg-deep-emerald/[0.04] px-3 py-1.5 rounded-full border border-deep-emerald/10">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Itinerary */}
                        {pkg.itinerary && pkg.itinerary.length > 0 && (
                            <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-gray-100/80">
                                <h2 className="text-xl md:text-2xl font-display text-deep-emerald mb-8">Day-by-Day Itinerary</h2>
                                <div className="space-y-0">
                                    {pkg.itinerary.map((day: any, idx: number) => (
                                        <div key={day.day} className={`relative pl-10 pb-8 ${idx < pkg.itinerary.length - 1 ? 'border-l border-antique-gold/20 ml-3' : 'ml-3'}`}>
                                            {/* Timeline dot */}
                                            <div className="absolute -left-[7px] top-0 w-3.5 h-3.5 rounded-full bg-antique-gold/20 border-2 border-antique-gold ring-4 ring-white" />

                                            <div className="mb-1">
                                                <span className="text-[11px] tracking-[0.15em] uppercase text-antique-gold font-semibold">Day {day.day}</span>
                                            </div>
                                            <h3 className="text-lg font-display text-deep-emerald mb-2">
                                                {day.title}
                                            </h3>
                                            {day.description && (
                                                <p className="text-sm text-gray-500 font-light leading-relaxed">{day.description}</p>
                                            )}
                                            {day.activity && (
                                                <div className="mt-3 inline-flex items-center text-[11px] tracking-[0.1em] uppercase text-antique-gold bg-antique-gold/[0.06] px-3 py-1.5 rounded-full border border-antique-gold/15">
                                                    <Star className="h-3 w-3 mr-1.5" />
                                                    {day.activity}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Inclusions & Exclusions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {pkg.inclusions && pkg.inclusions.length > 0 && (
                                <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100/80">
                                    <h3 className="text-base font-display text-deep-emerald mb-5 flex items-center gap-2.5">
                                        <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center">
                                            <Check className="h-3.5 w-3.5 text-green-600" />
                                        </div>
                                        What&apos;s Included
                                    </h3>
                                    <ul className="space-y-3">
                                        {pkg.inclusions.map((item: string, idx: number) => (
                                            <li key={idx} className="flex items-start gap-2.5 text-gray-500 text-sm font-light">
                                                <Check className="h-3.5 w-3.5 text-green-500 mt-1 flex-shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {pkg.exclusions && pkg.exclusions.length > 0 && (
                                <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100/80">
                                    <h3 className="text-base font-display text-deep-emerald mb-5 flex items-center gap-2.5">
                                        <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center">
                                            <X className="h-3.5 w-3.5 text-red-500" />
                                        </div>
                                        What&apos;s Excluded
                                    </h3>
                                    <ul className="space-y-3">
                                        {pkg.exclusions.map((item: string, idx: number) => (
                                            <li key={idx} className="flex items-start gap-2.5 text-gray-500 text-sm font-light">
                                                <X className="h-3.5 w-3.5 text-red-400 mt-1 flex-shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            {/* Booking Card */}
                            <div className="bg-white rounded-2xl p-7 shadow-lg border border-gray-100/80">
                                <div className="mb-6">
                                    <p className="text-[11px] tracking-[0.2em] uppercase text-gray-400 font-medium mb-1">Starting from</p>
                                    <h3 className="text-3xl font-display text-deep-emerald">
                                        LKR {pkg.priceMin?.toLocaleString()}
                                    </h3>
                                    {pkg.priceMax > 0 && pkg.priceMax !== pkg.priceMin && (
                                        <p className="text-xs text-gray-400 font-light mt-1">
                                            up to LKR {pkg.priceMax?.toLocaleString()} per person
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-3.5 border-t border-gray-100 pt-5 mb-6">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-400 font-light flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-antique-gold/60" /> Duration
                                        </span>
                                        <span className="text-deep-emerald font-medium text-[13px]">{pkg.duration}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-400 font-light flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-antique-gold/60" /> Stops
                                        </span>
                                        <span className="text-deep-emerald font-medium text-[13px]">{pkg.itinerary?.length || 0} Destinations</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-400 font-light flex items-center gap-2">
                                            <Users className="h-4 w-4 text-antique-gold/60" /> Style
                                        </span>
                                        <span className="text-deep-emerald font-medium text-[13px]">Private Tour</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Link href={`/public/booking-request?packageId=${pkg._id}`} className="block">
                                        <Button className="w-full h-12 text-[12px] tracking-[0.15em] uppercase font-semibold bg-deep-emerald hover:bg-deep-emerald/90 text-antique-gold border border-antique-gold/20 rounded-xl shadow-lg transition-all duration-300">
                                            Request This Journey
                                        </Button>
                                    </Link>
                                    <Link href="/contact" className="block">
                                        <Button variant="outline" className="w-full h-11 text-[11px] tracking-[0.15em] uppercase text-deep-emerald border-deep-emerald/15 hover:bg-off-white rounded-xl transition-all duration-300">
                                            Ask a Question
                                        </Button>
                                    </Link>
                                </div>

                                <p className="text-[11px] text-center text-gray-400 mt-4 font-light">
                                    No upfront payment required. We respond within 24 hours.
                                </p>
                            </div>

                            {/* Bespoke CTA */}
                            <div className="bg-deep-emerald rounded-2xl p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-antique-gold/[0.08] rounded-full blur-2xl" />
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Sparkles className="w-4 h-4 text-antique-gold" />
                                        <span className="text-[10px] tracking-[0.2em] uppercase text-antique-gold font-medium">Bespoke</span>
                                    </div>
                                    <h4 className="font-display text-white text-lg mb-2">Need It Tailored?</h4>
                                    <p className="text-white/50 text-sm font-light mb-4 leading-relaxed">
                                        We can adjust pace, duration, and stays to match your vision.
                                    </p>
                                    <Link
                                        href="/build-tour"
                                        className="inline-flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase font-semibold text-antique-gold hover:text-white transition-colors duration-300"
                                    >
                                        Design My Trip <ArrowRight className="h-3.5 w-3.5" />
                                    </Link>
                                </div>
                            </div>

                            {/* Upgrade Options */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/80">
                                <h4 className="text-sm font-display text-deep-emerald mb-4">Upgrade Options</h4>
                                <div className="space-y-3">
                                    {['Private jeep safari upgrade', 'Villa/suite room upgrade', 'Helicopter scenic transfer', 'Private dining experience'].map((opt) => (
                                        <div key={opt} className="flex items-start gap-2.5 text-[12px] text-gray-500 font-light">
                                            <span className="text-antique-gold leading-none mt-0.5">+</span>
                                            {opt}
                                        </div>
                                    ))}
                                </div>
                                <p className="text-[10px] text-gray-400 mt-3 font-light">Priced on request</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
