import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
    ArrowRight,
    ArrowLeft,
    Check,
    Clock,
    MapPin,
    Users,
    Briefcase,
    Shield,
    ChevronDown,
    Phone,
    MessageCircle,
} from 'lucide-react';
import {
    transferProducts,
    getTransferBySlug,
    getRelatedTransfers,
    vehicleTiers,
    getVehicleTier,
    formatLkr,
} from '@/data/transfers';

/* ───────── Static Params ───────── */
export function generateStaticParams() {
    return transferProducts.map((t) => ({
        slug: t.slug,
    }));
}

/* ───────── Dynamic Metadata ───────── */
export async function generateMetadata(props: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await props.params;
    const transfer = getTransferBySlug(slug);

    if (!transfer) {
        return { title: 'Transfer Not Found' };
    }

    return {
        title: transfer.seoTitle,
        description: transfer.seoDescription,
        openGraph: {
            title: transfer.seoTitle,
            description: transfer.seoDescription,
            type: 'website',
            url: `/transfers/${transfer.slug}`,
        },
    };
}

/* ───────── Type Badge Color ───────── */
function getTypeBadgeClass(type: string): string {
    const map: Record<string, string> = {
        AIRPORT: 'bg-blue-500/20 text-blue-200 border-blue-400/30',
        INTERCITY: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30',
        SCENIC: 'bg-purple-500/20 text-purple-200 border-purple-400/30',
        HOURLY: 'bg-amber-500/20 text-amber-200 border-amber-400/30',
        SAFARI: 'bg-orange-500/20 text-orange-200 border-orange-400/30',
        EVENT: 'bg-pink-500/20 text-pink-200 border-pink-400/30',
    };
    return map[type] || 'bg-white/20 text-white/80 border-white/30';
}

/* ───────── Main Page ───────── */
export default async function TransferDetailPage(props: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await props.params;
    const transfer = getTransferBySlug(slug);

    if (!transfer) {
        notFound();
    }

    const relatedTransfers = getRelatedTransfers(slug);
    const recommendedTier = getVehicleTier(transfer.vehicleTierRecommended);

    return (
        <main className="bg-off-white">
            {/* ═══════════════════════════════════════════
                SECTION 1: HERO
                ═══════════════════════════════════════════ */}
            <section className="bg-deep-emerald text-off-white pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    {/* Breadcrumb */}
                    <nav className="mb-8 flex items-center gap-2 text-sm font-nav">
                        <Link href="/transfers" className="hover:text-antique-gold transition-colors">
                            Transfers
                        </Link>
                        <span className="text-white/40">/</span>
                        <span className="text-antique-gold">{transfer.title}</span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Left — Content */}
                        <div>
                            {/* Type Badge */}
                            <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-nav font-semibold uppercase tracking-[0.15em] border backdrop-blur-sm mb-6 ${getTypeBadgeClass(transfer.transferType)}`}>
                                {transfer.transferType}
                            </span>

                            {/* Title */}
                            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                                {transfer.title}
                            </h1>

                            {/* Subtitle */}
                            <p className="text-xl text-white/80 max-w-xl mb-8 leading-relaxed font-nav font-light">
                                {transfer.subtitle}
                            </p>

                            {/* Key Facts Row */}
                            <div className="flex flex-wrap gap-6 mb-8">
                                <div className="flex items-center gap-2 text-sm font-nav">
                                    <Clock className="w-4 h-4 text-antique-gold" />
                                    <span className="text-white/70">{transfer.duration}</span>
                                </div>
                                {transfer.distanceKm > 0 && (
                                    <div className="flex items-center gap-2 text-sm font-nav">
                                        <MapPin className="w-4 h-4 text-antique-gold" />
                                        <span className="text-white/70">{transfer.distanceKm} km</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-sm font-nav">
                                    <Users className="w-4 h-4 text-antique-gold" />
                                    <span className="text-white/70">Up to {transfer.passengerCapacity} guests</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm font-nav">
                                    <Briefcase className="w-4 h-4 text-antique-gold" />
                                    <span className="text-white/70">{transfer.luggageCapacity} luggage</span>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="mb-8 flex items-baseline gap-3">
                                <span className="text-white/50 text-sm font-nav uppercase tracking-wide">
                                    From
                                </span>
                                <span className="font-serif text-4xl font-bold text-antique-gold">
                                    {formatLkr(transfer.startingPriceLkr)}
                                </span>
                            </div>

                            {/* CTA */}
                            <div className="flex gap-4 items-center">
                                <Link
                                    href="/inquire"
                                    className="bg-antique-gold text-deep-emerald px-8 py-4 font-nav font-bold uppercase tracking-[0.12em] text-sm rounded-lg hover:bg-antique-gold/90 transition-colors inline-flex items-center gap-2"
                                >
                                    Request a Quote
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                                <a
                                    href="https://wa.me/94112345678"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-antique-gold hover:text-white transition-colors font-nav font-semibold flex items-center gap-2 text-sm"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    WhatsApp
                                </a>
                            </div>
                        </div>

                        {/* Right — Hero Image */}
                        <div className="relative h-80 lg:h-auto rounded-xl overflow-hidden">
                            {transfer.heroImage ? (
                                <Image
                                    src={transfer.heroImage}
                                    alt={transfer.title}
                                    fill
                                    className="object-cover rounded-xl"
                                    priority
                                />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-deep-emerald/30 to-deep-emerald/10 rounded-xl flex items-center justify-center">
                                    <span className="text-white/30 font-nav text-sm">Image coming soon</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                SECTION 2: ROUTE OVERVIEW
                ═══════════════════════════════════════════ */}
            <section className="py-16 bg-white border-b border-deep-emerald/5">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-1 p-6 bg-deep-emerald/[0.03] rounded-xl">
                            <p className="text-[10px] font-nav text-antique-gold uppercase tracking-widest font-semibold mb-2">
                                Pickup
                            </p>
                            <p className="font-serif text-lg font-bold text-deep-emerald">
                                {transfer.pickupLabel}
                            </p>
                        </div>
                        <div className="md:col-span-1 p-6 bg-deep-emerald/[0.03] rounded-xl">
                            <p className="text-[10px] font-nav text-antique-gold uppercase tracking-widest font-semibold mb-2">
                                Drop-off
                            </p>
                            <p className="font-serif text-lg font-bold text-deep-emerald">
                                {transfer.dropoffLabel}
                            </p>
                        </div>
                        <div className="md:col-span-1 p-6 bg-deep-emerald/[0.03] rounded-xl">
                            <p className="text-[10px] font-nav text-antique-gold uppercase tracking-widest font-semibold mb-2">
                                Recommended Tier
                            </p>
                            <p className="font-serif text-lg font-bold text-deep-emerald capitalize">
                                {transfer.vehicleTierRecommended}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                SECTION 3: WHAT'S INCLUDED
                ═══════════════════════════════════════════ */}
            <section className="py-20 bg-off-white">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="mb-12">
                        <span className="text-[10px] font-nav text-antique-gold uppercase tracking-widest font-semibold block mb-2">
                            What's Included
                        </span>
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-deep-emerald">
                            Everything You Need
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {transfer.includes.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-4 bg-white rounded-lg border border-deep-emerald/5">
                                <Check className="w-5 h-5 text-antique-gold flex-shrink-0 mt-0.5" />
                                <span className="font-nav text-sm text-deep-emerald/80">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                SECTION 4: VEHICLE OPTIONS
                ═══════════════════════════════════════════ */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="mb-12">
                        <span className="text-[10px] font-nav text-antique-gold uppercase tracking-widest font-semibold block mb-2">
                            Choose Your Vehicle
                        </span>
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-deep-emerald">
                            Vehicle Options
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {vehicleTiers.map((tier) => {
                            const isRecommended = tier.slug === transfer.vehicleTierRecommended;
                            return (
                                <div
                                    key={tier.slug}
                                    className={`relative rounded-xl p-6 transition-all duration-300 ${
                                        isRecommended
                                            ? 'bg-deep-emerald text-white border-2 border-antique-gold shadow-lg'
                                            : 'bg-off-white border border-deep-emerald/10 hover:shadow-md'
                                    }`}
                                >
                                    {isRecommended && (
                                        <span className="absolute -top-3 left-6 px-3 py-1 bg-antique-gold text-deep-emerald text-[10px] font-nav font-bold uppercase tracking-widest rounded-full">
                                            Recommended
                                        </span>
                                    )}

                                    <h3 className={`font-serif text-2xl font-bold mb-1 ${isRecommended ? 'text-white' : 'text-deep-emerald'}`}>
                                        {tier.name}
                                    </h3>
                                    <p className={`text-sm font-nav mb-4 ${isRecommended ? 'text-antique-gold' : 'text-deep-emerald/50'}`}>
                                        {tier.tagline}
                                    </p>

                                    <p className={`text-xs font-nav mb-4 ${isRecommended ? 'text-white/70' : 'text-deep-emerald/60'}`}>
                                        {tier.vehicles}
                                    </p>

                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div>
                                            <span className={`text-xs font-nav uppercase tracking-wide block mb-1 ${isRecommended ? 'text-white/50' : 'text-deep-emerald/40'}`}>
                                                Guests
                                            </span>
                                            <span className={`font-bold ${isRecommended ? 'text-white' : 'text-deep-emerald'}`}>
                                                {tier.maxGuests}
                                            </span>
                                        </div>
                                        <div>
                                            <span className={`text-xs font-nav uppercase tracking-wide block mb-1 ${isRecommended ? 'text-white/50' : 'text-deep-emerald/40'}`}>
                                                Luggage
                                            </span>
                                            <span className={`text-sm ${isRecommended ? 'text-white/80' : 'text-deep-emerald/70'}`}>
                                                {tier.maxLuggage}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        {tier.features.slice(0, 4).map((f, i) => (
                                            <div key={i} className="flex items-center gap-2 text-xs font-nav">
                                                <div className={`w-1.5 h-1.5 rounded-full ${isRecommended ? 'bg-antique-gold' : 'bg-antique-gold/60'}`} />
                                                <span className={isRecommended ? 'text-white/80' : 'text-deep-emerald/60'}>
                                                    {f}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                SECTION 5: WHY CHOOSE THIS TRANSFER
                ═══════════════════════════════════════════ */}
            <section className="py-20 bg-deep-emerald/[0.03]">
                <div className="max-w-4xl mx-auto px-4 md:px-8">
                    <div className="mb-8">
                        <span className="text-[10px] font-nav text-antique-gold uppercase tracking-widest font-semibold block mb-2">
                            Why This Route
                        </span>
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-deep-emerald">
                            Why Choose This Transfer
                        </h2>
                    </div>

                    <p className="text-deep-emerald/70 text-lg font-nav leading-relaxed mb-8">
                        {transfer.whyChoose}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Door-to-door', desc: 'Pickup and drop-off at your exact location' },
                            { label: 'Fixed rate', desc: 'No hidden charges or meter surprises' },
                            { label: 'Local chauffeur', desc: 'Experienced, licensed, background-verified' },
                            { label: 'Premium service', desc: 'Meet & greet, water, luggage handled' },
                        ].map((item) => (
                            <div key={item.label} className="p-4 bg-white rounded-xl border border-deep-emerald/5">
                                <p className="font-nav text-sm font-semibold text-deep-emerald mb-1">{item.label}</p>
                                <p className="text-xs text-deep-emerald/50 font-nav">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                SECTION 6: BOOKING / INQUIRY
                ═══════════════════════════════════════════ */}
            <section className="py-20 bg-deep-emerald text-white">
                <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
                    <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
                        Book This Transfer
                    </h2>
                    <p className="text-white/70 text-lg font-nav mb-10 max-w-2xl mx-auto">
                        Share your travel details and our concierge will confirm availability, vehicle, and final pricing within hours.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                        <Link
                            href={`/inquire?route=${encodeURIComponent(transfer.title)}&price=${transfer.startingPriceLkr}`}
                            className="bg-antique-gold text-deep-emerald px-8 py-4 font-nav font-bold uppercase tracking-[0.12em] text-sm rounded-lg hover:bg-antique-gold/90 transition-colors inline-flex items-center justify-center gap-2"
                        >
                            Request a Quote
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <a
                            href="https://wa.me/94112345678"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border border-antique-gold/30 text-antique-gold px-8 py-4 font-nav font-semibold uppercase tracking-[0.12em] text-sm rounded-lg hover:bg-antique-gold/10 transition-colors inline-flex items-center justify-center gap-2"
                        >
                            <MessageCircle className="w-5 h-5" />
                            WhatsApp Concierge
                        </a>
                    </div>

                    <div className="h-px w-16 bg-antique-gold/40 mx-auto" />
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                SECTION 7: RELATED ROUTES
                ═══════════════════════════════════════════ */}
            {relatedTransfers.length > 0 && (
                <section className="py-20 bg-off-white">
                    <div className="max-w-7xl mx-auto px-4 md:px-8">
                        <div className="mb-12">
                            <span className="text-[10px] font-nav text-antique-gold uppercase tracking-widest font-semibold block mb-2">
                                Continue Exploring
                            </span>
                            <h2 className="font-serif text-3xl md:text-4xl font-bold text-deep-emerald">
                                Related Routes
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedTransfers.map((related) => (
                                <Link
                                    key={related.slug}
                                    href={`/transfers/${related.slug}`}
                                    className="group block bg-white rounded-xl border border-deep-emerald/5 p-6 hover:shadow-lg hover:border-antique-gold/20 transition-all duration-300"
                                >
                                    <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-nav font-semibold uppercase tracking-wider mb-3 border ${getTypeBadgeClass(related.transferType).replace(/text-\w+-\d+/g, '').trim()} text-deep-emerald/50 bg-deep-emerald/5 border-deep-emerald/10`}>
                                        {related.transferType}
                                    </span>
                                    <h3 className="font-serif text-lg font-bold text-deep-emerald mb-2 group-hover:text-antique-gold transition-colors">
                                        {related.title}
                                    </h3>
                                    <div className="flex items-center gap-4 text-xs font-nav text-deep-emerald/50 mb-3">
                                        <span>{related.duration}</span>
                                        {related.distanceKm > 0 && <span>{related.distanceKm} km</span>}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="font-serif font-bold text-deep-emerald">
                                            {formatLkr(related.startingPriceLkr)}
                                        </span>
                                        <ArrowRight className="w-4 h-4 text-antique-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ═══════════════════════════════════════════
                FOOTER NAV
                ═══════════════════════════════════════════ */}
            <section className="py-12 bg-white border-t border-deep-emerald/10">
                <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <Link
                        href="/transfers"
                        className="text-deep-emerald hover:text-antique-gold transition-colors font-nav font-semibold flex items-center gap-2 text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        All Transfers
                    </Link>
                    <Link
                        href="/inquire"
                        className="text-deep-emerald hover:text-antique-gold transition-colors font-nav font-semibold flex items-center gap-2 text-sm"
                    >
                        Request Custom Route
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>
        </main>
    );
}
