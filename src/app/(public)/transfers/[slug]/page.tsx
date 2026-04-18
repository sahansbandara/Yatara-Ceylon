import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { WHATSAPP_LINK } from '@/lib/whatsapp';
import Image from 'next/image';
import {
    ArrowRight,
    ArrowLeft,
    Check,
    Clock,
    MapPin,
    Users,
    Briefcase,
    MessageCircle,
} from 'lucide-react';
import {
    transferProducts,
    getTransferBySlug,
    getRelatedTransfers,
    vehicleTiers,
    formatLkr,
} from '@/data/transfers';
import { JsonLd, buildTransferProduct, buildBreadcrumb } from '@/lib/jsonLd';
import { DEFAULT_IMAGE_BLUR_DATA_URL } from '@/lib/image-utils';

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

    const breadcrumb = buildBreadcrumb([
        { name: 'Home', url: '/' },
        { name: 'Transfers', url: '/transfers' },
        { name: transfer.title, url: `/transfers/${transfer.slug}` },
    ]);

    const relatedTransfers = getRelatedTransfers(slug);

    return (
        <div className="min-h-screen bg-off-white">
            {/* ─── SEO Structured Data ─── */}
            <JsonLd data={buildTransferProduct(transfer)} />
            <JsonLd data={breadcrumb} />
            
            {/* ═══════════════════════════════════════════
                HERO SECTION
                ═══════════════════════════════════════════ */}
            <div className="relative h-[55vh] md:h-[65vh] w-full">
                {transfer.heroImage ? (
                    <Image 
                        src={transfer.heroImage} 
                        alt={transfer.title} 
                        fill 
                        className="object-cover" 
                        priority 
                        sizes="100vw"
                        placeholder="blur"
                        blurDataURL={DEFAULT_IMAGE_BLUR_DATA_URL}
                    />
                ) : (
                    <div className="absolute inset-0 bg-deep-emerald" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

                <div className="absolute inset-0 flex items-end">
                    <div className="max-w-7xl mx-auto px-6 md:px-12 pb-12 md:pb-16 w-full">
                        {/* Tag */}
                        <div className="flex flex-wrap gap-2 mb-5">
                            <span className="text-[10px] tracking-[0.2em] uppercase font-medium text-white/80 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/15">
                                {transfer.transferType}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif text-white mb-4 leading-[1.1] drop-shadow-lg max-w-3xl font-bold">
                            {transfer.title}
                        </h1>
                        <p className="text-white/70 font-light text-base md:text-lg max-w-2xl leading-relaxed">
                            {transfer.subtitle}
                        </p>

                        <div className="flex flex-wrap items-center gap-6 mt-6 text-white/60 text-sm">
                            <span className="flex items-center gap-2 font-nav">
                                <Clock className="w-4 h-4 text-antique-gold" />
                                {transfer.duration}
                            </span>
                            {transfer.distanceKm > 0 && (
                                <span className="flex items-center gap-2 font-nav">
                                    <MapPin className="w-4 h-4 text-antique-gold" />
                                    {transfer.distanceKm} km
                                </span>
                            )}
                            <span className="flex items-center gap-2 font-nav">
                                <Users className="w-4 h-4 text-antique-gold" />
                                Up to {transfer.passengerCapacity} guests
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════
                MAIN CONTENT GRID
                ═══════════════════════════════════════════ */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 mt-10 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    
                    {/* LEFT SIDE (Main Info) */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Pickup / Drop-off Snapshot (Like Signature Moments) */}
                        <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-gray-100/80">
                            <div className="flex items-center gap-3 mb-6">
                                <MapPin className="w-5 h-5 text-antique-gold" />
                                <h2 className="text-xl md:text-2xl font-serif font-bold text-deep-emerald">Route Details</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3 p-4 rounded-xl bg-off-white/80 border border-gray-100/50">
                                    <span className="text-antique-gold text-lg leading-none mt-0.5">&#9670;</span>
                                    <div>
                                        <p className="text-[10px] font-nav uppercase tracking-[0.2em] text-deep-emerald/50 font-semibold mb-1">Pickup Point</p>
                                        <p className="text-sm font-semibold text-deep-emerald leading-relaxed">{transfer.pickupLabel}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-4 rounded-xl bg-off-white/80 border border-gray-100/50">
                                    <span className="text-antique-gold text-lg leading-none mt-0.5">&#9670;</span>
                                    <div>
                                        <p className="text-[10px] font-nav uppercase tracking-[0.2em] text-deep-emerald/50 font-semibold mb-1">Drop-off Point</p>
                                        <p className="text-sm font-semibold text-deep-emerald leading-relaxed">{transfer.dropoffLabel}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Overview */}
                        <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-gray-100/80">
                            <h2 className="text-xl md:text-2xl font-serif font-bold text-deep-emerald mb-5">Journey Overview</h2>
                            <div className="prose prose-gray max-w-none text-gray-500 font-light leading-relaxed text-[15px]">
                                <p>{transfer.whyChoose || transfer.subtitle}</p>
                            </div>
                        </div>

                        {/* Vehicle Options */}
                        <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-gray-100/80">
                            <h2 className="text-xl md:text-2xl font-serif font-bold text-deep-emerald mb-8">Vehicle Options</h2>
                            <div className="space-y-6">
                                {vehicleTiers.map((tier) => {
                                    const isRecommended = tier.slug === transfer.vehicleTierRecommended;
                                    return (
                                        <div key={tier.slug} className={`relative p-6 rounded-2xl border ${isRecommended ? 'border-antique-gold/40 bg-antique-gold/[0.02]' : 'border-gray-100 bg-white'}`}>
                                            {isRecommended && (
                                                <div className="absolute -top-3 left-6 px-3 py-1 bg-antique-gold text-white text-[9px] font-nav font-bold uppercase tracking-[0.15em] rounded-full shadow-sm">
                                                    Recommended
                                                </div>
                                            )}
                                            <h3 className="text-lg font-serif font-bold text-deep-emerald mb-1">{tier.name}</h3>
                                            <p className="text-sm text-gray-500 font-light mb-4">{tier.vehicles}</p>
                                            
                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Users className="w-4 h-4 text-antique-gold/70" /> {tier.maxGuests} Guests max
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Briefcase className="w-4 h-4 text-antique-gold/70" /> {tier.maxLuggage} Luggage max
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                {tier.features.slice(0, 3).map((f, i) => (
                                                    <div key={i} className="flex items-start gap-2 text-[13px] text-gray-500 font-light">
                                                        <Check className="w-3.5 h-3.5 text-antique-gold mt-0.5 flex-shrink-0" />
                                                        {f}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Inclusions */}
                        {transfer.includes && transfer.includes.length > 0 && (
                            <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100/80">
                                <h3 className="text-base font-serif font-bold text-deep-emerald mb-5 flex items-center gap-2.5">
                                    <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center">
                                        <Check className="h-3.5 w-3.5 text-green-600" />
                                    </div>
                                    What&apos;s Included
                                </h3>
                                <ul className="space-y-3">
                                    {transfer.includes.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-2.5 text-gray-500 text-sm font-light">
                                            <Check className="h-3.5 w-3.5 text-green-500 mt-1 flex-shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* RIGHT SIDE (Sidebar) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            {/* Booking Card */}
                            <div className="bg-white rounded-2xl p-7 shadow-lg border border-gray-100/80">
                                <div className="mb-6">
                                    <p className="text-[10px] tracking-[0.2em] font-medium text-gray-400 uppercase mb-1">Transfer Starting Price</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-sm text-gray-400 font-medium">FROM</span>
                                        <span className="font-serif text-3xl font-bold text-deep-emerald">{formatLkr(transfer.startingPriceLkr)}</span>
                                    </div>
                                </div>

                                <div className="space-y-3.5 border-t border-gray-100 pt-5 mb-6">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-400 font-light flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-antique-gold/60" /> Duration
                                        </span>
                                        <span className="text-deep-emerald font-medium text-[13px]">{transfer.duration}</span>
                                    </div>
                                    {transfer.distanceKm > 0 && (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-400 font-light flex items-center gap-2">
                                                <MapPin className="h-4 w-4 text-antique-gold/60" /> Distance
                                            </span>
                                            <span className="text-deep-emerald font-medium text-[13px]">{transfer.distanceKm} km</span>
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-400 font-light flex items-center gap-2">
                                            <Users className="h-4 w-4 text-antique-gold/60" /> Type
                                        </span>
                                        <span className="text-deep-emerald font-medium text-[13px]">Private Transfer</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Link href={`/inquire?route=${encodeURIComponent(transfer.title)}&price=${transfer.startingPriceLkr}`} className="block">
                                        <button className="w-full h-12 text-[12px] tracking-[0.15em] uppercase font-bold bg-deep-emerald hover:bg-deep-emerald/90 text-antique-gold rounded-xl shadow-lg transition-all duration-300">
                                            Request a Quote
                                        </button>
                                    </Link>
                                    <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="block">
                                        <button className="w-full h-11 text-[11px] tracking-[0.15em] uppercase text-deep-emerald border border-deep-emerald/15 hover:bg-off-white rounded-xl transition-all duration-300 flex items-center justify-center gap-2">
                                            <MessageCircle className="w-4 h-4" /> WhatsApp Concierge
                                        </button>
                                    </a>
                                </div>
                            </div>

                            {/* Need It Tailored */}
                            <div className="bg-deep-emerald rounded-2xl p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-antique-gold/[0.08] rounded-full blur-2xl" />
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-3">
                                        <MessageCircle className="w-4 h-4 text-antique-gold" />
                                        <span className="text-[10px] tracking-[0.2em] uppercase text-antique-gold font-medium">Bespoke</span>
                                    </div>
                                    <h4 className="font-serif font-bold text-white text-lg mb-2">Need It Tailored?</h4>
                                    <p className="text-white/50 text-sm font-light mb-4 leading-relaxed">
                                        We can add sightseeing stops, detour routes, or wait-times to match your plans anywhere in Sri Lanka.
                                    </p>
                                    <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase font-semibold text-antique-gold hover:text-white transition-colors duration-300">
                                        Ask Our Concierge <ArrowRight className="h-3.5 w-3.5" />
                                    </a>
                                </div>
                            </div>

                            {/* The Yatara Standard */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/80">
                                <h4 className="text-base font-serif font-bold text-deep-emerald mb-4">The Yatara Standard</h4>
                                <div className="space-y-3">
                                    {[
                                        'Door-to-door direct service',
                                        'Fixed rate, no hidden charges',
                                        'Background-verified chauffeur',
                                        'Complimentary bottled water',
                                        'Meet & greet luggage assist'
                                    ].map((opt) => (
                                        <div key={opt} className="flex items-start gap-2.5 text-[12px] text-gray-500 font-light">
                                            <span className="text-antique-gold leading-none mt-0.5">+</span>
                                            {opt}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════
                RELATED ROUTES
                ═══════════════════════════════════════════ */}
            {relatedTransfers.length > 0 && (
                <div className="max-w-7xl mx-auto px-6 md:px-12 mt-16 pb-24">
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-deep-emerald mb-8">Related Routes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {relatedTransfers.map((related) => (
                            <Link key={related.slug} href={`/transfers/${related.slug}`} className="group block">
                                <div className="rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100/80 h-full flex flex-col">
                                    <div className="relative h-[220px] overflow-hidden">
                                        <Image
                                            src={related.heroImage || '/images/home/curated-kingdoms.png'}
                                            alt={related.title}
                                            fill
                                            className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                        <div className="absolute bottom-3 left-3">
                                            <span className="text-[10px] tracking-[0.15em] uppercase font-medium text-white/80 bg-white/15 backdrop-blur-sm px-2.5 py-1 rounded-full text-center">
                                                {related.duration}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-5 flex flex-col flex-grow">
                                        <h3 className="font-serif font-bold text-deep-emerald text-lg mb-2 group-hover:text-antique-gold transition-colors">{related.title}</h3>
                                        <p className="text-sm text-gray-500 font-light line-clamp-2 mb-4">{related.subtitle}</p>
                                        
                                        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase tracking-[0.1em] text-gray-400 mb-0.5">From</span>
                                                <span className="font-serif font-bold text-deep-emerald text-[15px]">{formatLkr(related.startingPriceLkr)}</span>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-antique-gold" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
