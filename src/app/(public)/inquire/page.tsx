import { Metadata } from 'next';
import InquireForm from '@/components/public/InquireForm';
import { Shield, Clock, MessageCircle } from 'lucide-react';

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

interface InquirePageProps {
    searchParams: Promise<{ type?: string; journey?: string; pickup?: string; dropoff?: string; date?: string; passengers?: string }>;
}

export default async function InquirePage({ searchParams }: InquirePageProps) {
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

        // Strict match first
        matchedRoutes = transferProducts.filter(t => {
            const matchesPickup = searchPickup ? t.pickupLabel.toLowerCase().includes(searchPickup) || t.title.toLowerCase().includes(searchPickup) : true;
            const matchesDropoff = searchDropoff ? t.dropoffLabel.toLowerCase().includes(searchDropoff) || t.title.toLowerCase().includes(searchDropoff) : true;
            const matchesCapacity = t.passengerCapacity >= searchPax;

            // if neither pickup nor dropoff is provided, just matching capacity is not enough to consider it a "strict" match unless we want all.
            // But if it's a search, we assume they passed something.
            return matchesPickup && matchesDropoff && matchesCapacity;
        });

        // Loose match fallback (just pickup or dropoff)
        if (matchedRoutes.length === 0 && (searchPickup || searchDropoff)) {
            matchedRoutes = transferProducts.filter(t => {
                const matchesPickup = searchPickup ? t.pickupLabel.toLowerCase().includes(searchPickup) || t.title.toLowerCase().includes(searchPickup) : false;
                const matchesDropoff = searchDropoff ? t.dropoffLabel.toLowerCase().includes(searchDropoff) || t.title.toLowerCase().includes(searchDropoff) : false;
                const matchesCapacity = t.passengerCapacity >= searchPax;
                return (matchesPickup || matchesDropoff) && matchesCapacity;
            });
        }

        // Capacity match fallback
        if (matchedRoutes.length === 0) {
            matchedRoutes = transferProducts.filter(t => t.passengerCapacity >= searchPax);
        }

        matchedRoutes = matchedRoutes.slice(0, 3);
    }

    return (
        <div className="min-h-screen bg-gray-50/50 pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Header */}
                <div className="mb-16 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <span className="inline-block py-1 px-4 text-xs tracking-[0.2em] uppercase font-medium text-antique-gold border border-antique-gold/30 mb-6 bg-deep-emerald/5">
                        {isConcierge ? 'Personal Concierge' : isSearch ? 'Matched Transfer Options' : 'Concierge Services'}
                    </span>
                    <h1 className="text-4xl md:text-5xl font-serif text-deep-emerald mb-4">
                        {isConcierge ? 'Speak to a Designer' : isSearch ? 'Your Travel Options' : 'Request a Curated Proposal'}
                    </h1>
                    <p className="text-gray-500 max-w-2xl mx-auto font-light leading-relaxed">
                        {isConcierge
                            ? 'Connect directly with a travel designer who will guide your journey from the first conversation.'
                            : isSearch 
                                ? 'We found these premium routes based on your search. Fill the form below to confirm.'
                                : 'Tailored journeys. Private transfers. 24/7 concierge.'}
                    </p>
                    <p className="text-antique-gold text-xs tracking-[0.15em] uppercase mt-4 font-medium">
                        Reply within 2 hours · No obligation · Fully bespoke
                    </p>
                </div>

                {isSearch && matchedRoutes.length > 0 && (
                    <div className="mb-16">
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
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
                    {/* Left: Concierge Promise */}
                    <div className="lg:col-span-2 space-y-10">
                        <div>
                            <h3 className="text-2xl font-serif text-deep-emerald mb-3">Our Promise</h3>
                            <p className="text-gray-500 font-light leading-relaxed">
                                Every journey we craft is an original composition — never a template.
                                Share your vision, and we&apos;ll turn it into an unforgettable Sri Lankan experience.
                            </p>
                        </div>

                        <div className="space-y-8">
                            {promises.map((p, idx) => (
                                <div key={idx} className="flex items-start gap-5">
                                    <div className="h-12 w-12 rounded-none bg-deep-emerald/5 flex items-center justify-center text-antique-gold shrink-0 border border-deep-emerald/10">
                                        <p.icon className="h-5 w-5" strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <h4 className="font-serif text-deep-emerald mb-1">{p.title}</h4>
                                        <p className="text-gray-400 font-light text-sm leading-relaxed">{p.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* WhatsApp fallback */}
                        <div className="border-t border-gray-200 pt-8">
                            <p className="text-xs tracking-[0.15em] uppercase text-gray-400 mb-3">Prefer to chat?</p>
                            <a
                                href="https://wa.me/94704239802"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 text-sm text-deep-emerald hover:text-antique-gold transition-colors border border-deep-emerald/20 px-5 py-3 hover:border-antique-gold/30"
                            >
                                <MessageCircle className="w-4 h-4" />
                                WhatsApp Us Directly
                            </a>
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div className="lg:col-span-3">
                        <InquireForm inquiryType={isSearch ? 'transfer' : inquiryType} journeySlug={journeySlug} />
                    </div>
                </div>
            </div>
        </div>
    );
}
