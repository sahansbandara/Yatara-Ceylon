import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import PackageCard from '@/components/public/PackageCard';
import connectDB from '@/lib/mongodb';
import Destination from '@/models/Destination';
import Package from '@/models/Package';
import { ArrowLeft, Calendar, Clock, MapPin, Sparkles, Star, Plane, Mountain, ChevronRight } from 'lucide-react';
import { DESTINATION_BY_SLUG } from '@/data/destinations';

export const dynamic = 'force-dynamic';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toDestinationDetail(raw: any) {
    return {
        title: raw.title,
        slug: raw.slug,
        description: raw.description,
        longDescription: raw.longDescription,
        location: raw.location,
        images: raw.images,
        region: raw.region,
        luxuryLabel: raw.luxuryLabel,
        bestSeason: raw.bestSeason,
        idealNights: raw.idealNights,
        travelTimeFromColombo: raw.travelTimeFromColombo,
        travelStyleTags: raw.travelStyleTags,
        highlights: raw.highlights,
        experiences: raw.experiences,
        itinerary: raw.itinerary,
        stayStyles: raw.stayStyles,
        nearestAirport: raw.nearestAirport,
        elevation: raw.elevation,
        gallery: raw.gallery,
    };
}

async function getDestination(slug: string) {
    await connectDB();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dbDestination: any = await Destination.findOne({ slug, isPublished: true, isDeleted: false }).lean();
    const fallbackDestination = DESTINATION_BY_SLUG[slug] ?? null;

    const destination = dbDestination
        ? toDestinationDetail(JSON.parse(JSON.stringify(dbDestination)))
        : fallbackDestination
            ? toDestinationDetail(fallbackDestination)
            : null;

    if (!destination) return null;

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dbDestination: any = await Destination.findOne({ slug, isPublished: true, isDeleted: false }).lean();
    const fallbackDestination = DESTINATION_BY_SLUG[slug] ?? null;
    const dest = dbDestination || fallbackDestination;

    if (!dest) return { title: 'Destination Not Found | Yatara Ceylon' };

    return {
        title: `${dest.title} — Luxury Sri Lanka | Yatara Ceylon`,
        description: dest.description,
    };
}

export default async function DestinationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const data = await getDestination(slug);

    if (!data) notFound();

    const { destination, relatedPackages } = data;
    const districtImage = (s: string) => `/images/districts/${s}.jpg`;

    const heroImage = destination.images?.[0] ?? districtImage(destination.slug || slug);
    const galleryImages = destination.gallery?.length
        ? destination.gallery
        : destination.images && destination.images.length > 1
            ? destination.images.slice(1)
            : [districtImage(slug)];

    return (
        <div className="min-h-screen bg-[#f8f7f4] pb-24">
            {/* ── Cinematic Hero ── */}
            <div className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
                <Image
                    src={heroImage}
                    alt={`${destination.title}, Sri Lanka — cinematic landscape`}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#021a10] via-[#021a10]/40 to-black/10" />

                <div className="absolute inset-0">
                    <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex flex-col justify-end pb-12 md:pb-16">
                        <Link
                            href="/destinations"
                            className="inline-flex items-center text-white/60 hover:text-white mb-6 transition-colors w-fit text-[12px] tracking-[0.15em] uppercase"
                        >
                            <ArrowLeft className="h-3.5 w-3.5 mr-2" /> All Destinations
                        </Link>

                        <div className="max-w-4xl">
                            {/* Region + vibe tag */}
                            <div className="flex items-center gap-3 mb-4">
                                {destination.region && (
                                    <span className="inline-flex items-center gap-1.5 py-1 px-3 text-[10px] tracking-[0.2em] uppercase text-white/70 bg-white/[0.06] backdrop-blur-md border border-white/[0.1] rounded-full">
                                        <MapPin className="h-3 w-3" /> {destination.region}
                                    </span>
                                )}
                                {destination.luxuryLabel && (
                                    <span className="inline-flex items-center gap-1.5 py-1 px-3 text-[10px] tracking-[0.2em] uppercase text-[#D4AF37]/80 bg-[#D4AF37]/[0.06] backdrop-blur-md border border-[#D4AF37]/15 rounded-full">
                                        <Sparkles className="h-3 w-3" /> {destination.luxuryLabel}
                                    </span>
                                )}
                            </div>

                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-5 leading-[1.05]">
                                {destination.title}
                            </h1>

                            {/* Quick fact badges */}
                            <div className="flex flex-wrap items-center gap-3">
                                {destination.bestSeason && (
                                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 liquid-glass-panel rounded-full text-[10px] tracking-[0.12em] text-white/70 uppercase">
                                        <Calendar className="h-3 w-3 text-[#D4AF37]/70" /> Best: {destination.bestSeason}
                                    </span>
                                )}
                                {destination.idealNights && (
                                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 liquid-glass-panel rounded-full text-[10px] tracking-[0.12em] text-white/70 uppercase">
                                        <Clock className="h-3 w-3 text-[#D4AF37]/70" /> Stay: {destination.idealNights} nights
                                    </span>
                                )}
                                {destination.travelStyleTags && destination.travelStyleTags.length > 0 && (
                                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 liquid-glass-panel rounded-full text-[10px] tracking-[0.12em] text-white/70 uppercase">
                                        <Star className="h-3 w-3 text-[#D4AF37]/70" /> {destination.travelStyleTags.slice(0, 3).join(' · ')}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 pt-14">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* ── Main Content ── */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* The Essence */}
                        <section>
                            <h2 className="text-2xl md:text-3xl font-serif text-[#043927] mb-5">The Essence</h2>
                            <p className="text-lg text-[#043927]/80 font-light leading-relaxed mb-4">
                                {destination.description}
                            </p>
                            <p className="text-gray-500 font-light leading-relaxed whitespace-pre-wrap">
                                {destination.longDescription || 'Discover signature landscapes, cultural depth, and refined experiences designed around your travel pace. This district can be integrated into a bespoke itinerary with private transfers and curated local access.'}
                            </p>
                        </section>

                        {/* Highlights */}
                        {destination.highlights && destination.highlights.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-serif text-[#043927] mb-5">Highlights</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {destination.highlights.map((h: string, i: number) => (
                                        <div
                                            key={i}
                                            className="flex items-start gap-3 p-4 rounded-xl border border-[#043927]/8 bg-white hover:border-[#D4AF37]/25 transition-colors duration-300"
                                        >
                                            <ChevronRight className="h-4 w-4 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                                            <span className="text-sm text-[#043927]/75 font-light">{h}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Suggested Itinerary */}
                        {destination.itinerary && destination.itinerary.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-serif text-[#043927] mb-5">Suggested Itinerary</h2>
                                <div className="space-y-4">
                                    {destination.itinerary.map((day: { dayTitle: string; activities: string[] }, i: number) => (
                                        <div key={i} className="rounded-xl border border-[#043927]/8 bg-white p-5">
                                            <h4 className="text-sm tracking-[0.12em] uppercase text-[#D4AF37] font-medium mb-3">{day.dayTitle}</h4>
                                            <ul className="space-y-1.5">
                                                {day.activities.map((a: string, j: number) => (
                                                    <li key={j} className="text-sm text-gray-500 font-light flex items-start gap-2">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/40 mt-1.5 flex-shrink-0" />
                                                        {a}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Experiences */}
                        {destination.experiences && destination.experiences.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-serif text-[#043927] mb-5">Signature Experiences</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    {destination.experiences.map((exp: { title: string; description: string; image?: string }, i: number) => (
                                        <div key={i} className="rounded-2xl border border-[#043927]/8 bg-white overflow-hidden hover:border-[#D4AF37]/25 transition-colors duration-300">
                                            {exp.image && (
                                                <div className="relative h-40 overflow-hidden">
                                                    <Image src={exp.image} alt={exp.title} fill className="object-cover" />
                                                </div>
                                            )}
                                            <div className="p-5">
                                                <h4 className="text-sm font-medium text-[#043927] mb-1.5">{exp.title}</h4>
                                                <p className="text-xs text-gray-400 font-light leading-relaxed">{exp.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Where to Stay */}
                        {destination.stayStyles && destination.stayStyles.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-serif text-[#043927] mb-5">Where to Stay</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {destination.stayStyles.map((stay: { title: string; description: string }, i: number) => (
                                        <div key={i} className="rounded-xl border border-[#043927]/8 bg-white p-5 hover:border-[#D4AF37]/25 transition-colors duration-300">
                                            <h4 className="text-sm font-medium text-[#043927] mb-2">{stay.title}</h4>
                                            <p className="text-xs text-gray-400 font-light leading-relaxed mb-3">{stay.description}</p>
                                            <Link href="/inquire" className="text-[10px] tracking-[0.15em] uppercase text-[#D4AF37] hover:text-[#D4AF37]/80 transition-colors">
                                                Ask Concierge →
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Practical Info */}
                        {(destination.travelTimeFromColombo || destination.nearestAirport || destination.elevation) && (
                            <section>
                                <h2 className="text-2xl font-serif text-[#043927] mb-5">Practical Intelligence</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {destination.travelTimeFromColombo && (
                                        <div className="rounded-xl border border-[#043927]/8 bg-white p-5 flex items-start gap-3">
                                            <Clock className="h-4 w-4 text-[#D4AF37] mt-0.5" />
                                            <div>
                                                <p className="text-[10px] tracking-[0.15em] uppercase text-gray-400 mb-1">From Colombo</p>
                                                <p className="text-sm text-[#043927] font-light">{destination.travelTimeFromColombo}</p>
                                            </div>
                                        </div>
                                    )}
                                    {destination.nearestAirport && (
                                        <div className="rounded-xl border border-[#043927]/8 bg-white p-5 flex items-start gap-3">
                                            <Plane className="h-4 w-4 text-[#D4AF37] mt-0.5" />
                                            <div>
                                                <p className="text-[10px] tracking-[0.15em] uppercase text-gray-400 mb-1">Nearest Airport</p>
                                                <p className="text-sm text-[#043927] font-light">{destination.nearestAirport}</p>
                                            </div>
                                        </div>
                                    )}
                                    {destination.elevation && (
                                        <div className="rounded-xl border border-[#043927]/8 bg-white p-5 flex items-start gap-3">
                                            <Mountain className="h-4 w-4 text-[#D4AF37] mt-0.5" />
                                            <div>
                                                <p className="text-[10px] tracking-[0.15em] uppercase text-gray-400 mb-1">Elevation</p>
                                                <p className="text-sm text-[#043927] font-light">{destination.elevation}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        {/* Gallery */}
                        <section>
                            <h2 className="text-2xl font-serif text-[#043927] mb-5">Gallery</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {galleryImages.map((img: string, idx: number) => (
                                    <div key={`${img}-${idx}`} className="relative h-64 rounded-2xl overflow-hidden border border-[#043927]/8 bg-white shadow-sm group">
                                        <Image
                                            src={img}
                                            alt={`${destination.title} — gallery ${idx + 1}`}
                                            fill
                                            className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#021a10]/25 to-transparent" />
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* ── Sticky Sidebar — Inquiry + Related Tours ── */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            {/* Inquiry Panel */}
                            <div className="rounded-2xl border border-[#043927]/10 bg-white p-6 md:p-7">
                                <h3 className="text-lg font-serif text-[#043927] mb-1">Plan {destination.title} in comfort</h3>
                                <p className="text-[11px] text-gray-400 font-light mb-5">Our concierge will craft your itinerary within 24 hours.</p>
                                <div className="space-y-3 mb-5">
                                    <Link href="/inquire" className="block">
                                        <Button className="w-full h-11 bg-[#043927] hover:bg-[#043927]/90 text-white text-[11px] tracking-[0.15em] uppercase rounded-full font-medium shadow-md">
                                            Send to Concierge
                                        </Button>
                                    </Link>
                                    <Link href="/build-tour" className="block">
                                        <Button variant="outline" className="w-full h-11 border-[#043927]/15 text-[#043927] text-[11px] tracking-[0.15em] uppercase rounded-full font-medium hover:bg-[#043927]/5">
                                            Build Bespoke Tour
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            {/* Related Tours */}
                            <div className="rounded-2xl border border-[#043927]/10 bg-white p-6 md:p-7">
                                <h3 className="text-base font-serif text-[#043927] mb-4">Tours Visiting {destination.title}</h3>

                                {relatedPackages.length > 0 ? (
                                    <div className="space-y-5">
                                        {relatedPackages.map((pkg: any) => (
                                            <PackageCard key={pkg._id} pkg={pkg} />
                                        ))}
                                        <Link href={`/packages?q=${destination.title}`} className="block pt-1">
                                            <Button variant="outline" className="w-full border-[#043927]/15 text-[#043927] hover:bg-[#043927] hover:text-white text-[11px] tracking-[0.12em] uppercase rounded-full">
                                                View All Related Tours
                                            </Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/[0.04] p-4">
                                        <p className="text-gray-500 mb-3 text-sm font-light">No specific tours listed yet for this district.</p>
                                        <Link href="/build-tour">
                                            <Button className="w-full bg-[#043927] hover:bg-[#043927]/90 text-[#D4AF37] text-[11px] tracking-[0.12em] uppercase rounded-full">
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
        </div>
    );
}
