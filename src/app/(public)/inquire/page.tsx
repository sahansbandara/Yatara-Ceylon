import { Metadata } from 'next';
import InquireForm from '@/components/public/InquireForm';
import { Shield, Clock, MessageCircle, Sparkles, MapPin, Star, Phone } from 'lucide-react';
import Image from 'next/image';

import { transferProducts } from '@/data/transfers';
import SignatureRouteCard from '@/components/public/transfers/SignatureRouteCard';

export const metadata: Metadata = {
    title: 'Request a Curated Proposal | Yatara Ceylon',
    description: 'Tell us your travel vision and our Sri Lanka concierge team will craft a fully bespoke itinerary within 2 hours. Private transfers, handpicked stays, 24/7 support.',
};

const promises = [
    {
        icon: Clock,
        title: 'Response within 2 hours',
        description: 'Our travel designers are based in Sri Lanka and respond fast — by email or WhatsApp, your choice.',
    },
    {
        icon: Shield,
        title: 'Fixed-price guarantee',
        description: 'No hidden fees, no surprises. Your quoted price is your final price, always.',
    },
    {
        icon: MessageCircle,
        title: '24/7 concierge support',
        description: 'From the moment you confirm through your last day on the island, we\'re one message away.',
    },
];

const stats = [
    { value: '2,500+', label: 'Happy Travellers' },
    { value: '98%', label: 'Satisfaction Rate' },
    { value: '24/7', label: 'Concierge Support' },
    { value: '<2hrs', label: 'Avg. Response' },
];

interface InquirePageProps {
    searchParams: Promise<{ type?: string; journey?: string; pickup?: string; dropoff?: string; date?: string; passengers?: string }>;
}

import { getSessionUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function InquirePage({ searchParams }: InquirePageProps) {
    const user = await getSessionUser();
    if (!user) {
        redirect('/auth/login?callbackUrl=/inquire');
    }

    const params = await searchParams;
    const inquiryType = params.type || 'proposal';
    const journeySlug = params.journey || '';

    const isConcierge = inquiryType === 'concierge';
    const isSearch = !!(params.pickup || params.dropoff || params.passengers || params.date);

    let matchedRoutes: typeof transferProducts = [];

    if (isSearch || params.type === 'one-way' || params.type === 'round-trip') {
        const searchPickup = params.pickup?.toLowerCase() || '';
        const searchDropoff = params.dropoff?.toLowerCase() || '';
        const searchPax = params.passengers ? parseInt(params.passengers) : 1;

        matchedRoutes = transferProducts.filter(t => {
            const matchesPickup = searchPickup ? t.pickupLabel.toLowerCase().includes(searchPickup) || t.title.toLowerCase().includes(searchPickup) : true;
            const matchesDropoff = searchDropoff ? t.dropoffLabel.toLowerCase().includes(searchDropoff) || t.title.toLowerCase().includes(searchDropoff) : true;
            const matchesCapacity = t.passengerCapacity >= searchPax;
            return matchesPickup && matchesDropoff && matchesCapacity;
        });

        if (matchedRoutes.length === 0 && (searchPickup || searchDropoff)) {
            matchedRoutes = transferProducts.filter(t => {
                const matchesPickup = searchPickup ? t.pickupLabel.toLowerCase().includes(searchPickup) || t.title.toLowerCase().includes(searchPickup) : false;
                const matchesDropoff = searchDropoff ? t.dropoffLabel.toLowerCase().includes(searchDropoff) || t.title.toLowerCase().includes(searchDropoff) : false;
                const matchesCapacity = t.passengerCapacity >= searchPax;
                return (matchesPickup || matchesDropoff) && matchesCapacity;
            });
        }

        if (matchedRoutes.length === 0) {
            matchedRoutes = transferProducts.filter(t => t.passengerCapacity >= searchPax);
        }

        matchedRoutes = matchedRoutes.slice(0, 3);
    }

    return (
        <div className="min-h-screen bg-[#f8f7f4] relative overflow-hidden">
            {/* ═══════ HERO SECTION ═══════ */}
            <section className="relative h-[50vh] min-h-[420px] flex items-end overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src="/images/inquire/inquire-hero.webp"
                        alt="Sri Lanka luxury concierge service"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-deep-emerald/60 via-deep-emerald/40 to-[#f8f7f4]" />
                    <div className="absolute inset-0 bg-gradient-to-r from-deep-emerald/30 to-transparent" />
                </div>

                {/* Hero Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full pb-16">
                    <span className="inline-flex items-center gap-2 py-1.5 px-4 text-[10px] tracking-[0.25em] uppercase font-medium text-antique-gold border border-antique-gold/30 mb-6 backdrop-blur-md bg-white/10">
                        <Sparkles className="w-3 h-3" />
                        {isConcierge ? 'Personal Concierge' : isSearch ? 'Matched Transfer Options' : 'Concierge Services'}
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-4 max-w-2xl leading-[1.15]">
                        {isConcierge ? 'Speak to a Designer' : isSearch ? 'Your Travel Options' : 'Request a Curated Proposal'}
                    </h1>
                    <p className="text-white/70 max-w-lg font-light leading-relaxed text-base md:text-lg">
                        {isConcierge
                            ? 'Connect directly with a travel designer who will guide your journey from the first conversation.'
                            : isSearch
                                ? 'We found these premium routes based on your search. Fill the form below to confirm.'
                                : 'Tailored journeys. Private transfers. Handpicked stays. 24/7 concierge.'}
                    </p>
                </div>
            </section>

            {/* ═══════ STATS BAR ═══════ */}
            <section className="relative z-20 -mt-6 max-w-5xl mx-auto px-4 md:px-8">
                <div className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.08)] px-6 py-5 flex items-center justify-between divide-x divide-deep-emerald/10">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="flex-1 text-center px-3">
                            <p className="text-xl md:text-2xl font-serif text-deep-emerald">{stat.value}</p>
                            <p className="text-[10px] md:text-xs tracking-[0.15em] uppercase text-gray-400 mt-0.5">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══════ MATCHED ROUTES (Search mode) ═══════ */}
            {isSearch && matchedRoutes.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 md:px-8 mt-16">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-serif text-deep-emerald">Recommended for You</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {matchedRoutes.map((route) => (
                            <SignatureRouteCard
                                key={route.slug}
                                from={route.pickupLabel}
                                to={route.dropoffLabel}
                                title={route.title}
                                slug={route.slug}
                                transferType={route.transferType}
                                duration={route.duration}
                                distance={`${route.distanceKm} km`}
                                startingPriceLkr={route.startingPriceLkr}
                                vehicleTier={
                                    route.vehicleTierRecommended.charAt(0).toUpperCase() +
                                    route.vehicleTierRecommended.slice(1)
                                }
                                includes={['Meet & greet', 'Private chauffeur', 'Bottled water']}
                                image={route.heroImage}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* ═══════ MAIN CONTENT: Promise + Form ═══════ */}
            <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20">
                    
                    {/* ─── LEFT COLUMN: Sidebar ─── */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Our Promise */}
                        <div className="sticky top-28">
                            <div className="mb-10">
                                <span className="text-[10px] tracking-[0.25em] uppercase text-antique-gold font-medium mb-3 block">Why Choose Us</span>
                                <h3 className="text-3xl font-serif text-deep-emerald mb-3">Our Promise</h3>
                                <p className="text-gray-500 font-light leading-relaxed">
                                    Every journey we craft is an original composition — never a template.
                                    Share your vision, and we&apos;ll turn it into an unforgettable Sri Lankan experience.
                                </p>
                            </div>

                            {/* Promise Cards */}
                            <div className="space-y-5">
                                {promises.map((p, idx) => (
                                    <div key={idx} className="group relative bg-white/60 backdrop-blur-lg border border-white/80 p-5 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-0.5">
                                        {/* Hover glow */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-antique-gold/5 to-deep-emerald/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                        <div className="relative flex items-start gap-4">
                                            <div className="h-11 w-11 bg-deep-emerald/5 flex items-center justify-center text-antique-gold shrink-0 border border-deep-emerald/10 group-hover:bg-deep-emerald/10 transition-colors duration-300">
                                                <p.icon className="h-5 w-5" strokeWidth={1.5} />
                                            </div>
                                            <div>
                                                <h4 className="font-serif text-deep-emerald mb-1 text-[15px]">{p.title}</h4>
                                                <p className="text-gray-400 font-light text-sm leading-relaxed">{p.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Trust badges */}
                            <div className="mt-8 flex items-center gap-6 text-gray-400">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-3.5 h-3.5 text-antique-gold" />
                                    <span className="text-[11px] tracking-wider uppercase">Sri Lanka Based</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Star className="w-3.5 h-3.5 text-antique-gold" />
                                    <span className="text-[11px] tracking-wider uppercase">5-Star Reviews</span>
                                </div>
                            </div>

                            {/* WhatsApp CTA */}
                            <div className="border-t border-gray-200/60 pt-8 mt-8">
                                <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-4">Prefer to chat?</p>
                                <a
                                    href="https://wa.me/94704239802"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group/wa inline-flex items-center gap-3 text-sm text-deep-emerald border border-deep-emerald/20 px-6 py-3.5 hover:bg-deep-emerald hover:text-white hover:border-deep-emerald transition-all duration-300"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    WhatsApp Us Directly
                                </a>
                                <div className="flex items-center gap-2 mt-4">
                                    <Phone className="w-3 h-3 text-gray-400" />
                                    <span className="text-xs text-gray-400 font-light">+94 70 423 9802</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ─── RIGHT COLUMN: Form ─── */}
                    <div className="lg:col-span-3">
                        <InquireForm inquiryType={isSearch ? 'transfer' : inquiryType} journeySlug={journeySlug} />
                    </div>
                </div>
            </section>
        </div>
    );
}
