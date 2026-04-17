import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, HeartPulse, TreePine, Crown } from 'lucide-react';

const brands = [
    {
        icon: Crown,
        name: 'Yatara Ceylon',
        tagline: 'The Art of Sri Lankan Travel',
        description: 'Our flagship brand crafts bespoke tours, group journeys, and destination management services. With over a decade of expertise, Yatara Ceylon is the premier gateway to Sri Lanka — offering everything from cultural immersions and wildlife safaris to luxury coastal escapes.',
        color: '#D4AF37',
        image: '/images/home/curated-kingdoms.png',
        link: '/',
    },
    {
        icon: Sparkles,
        name: 'ArTravele',
        tagline: 'Luxury Redefined',
        description: 'ArTravele curates ultra-premium, bespoke holidays for discerning travellers who seek the extraordinary. Think private villa stays, helicopter transfers, Michelin-quality dining, and exclusive cultural encounters — every detail crafted with impeccable taste and refinement.',
        color: '#C0A062',
        image: '/images/home/signature-heritage.png',
        link: '/packages?tag=luxury',
    },
    {
        icon: HeartPulse,
        name: 'Ayu by Yatara',
        tagline: 'Wellness, Accessible & Medical Tourism',
        description: 'Ayu combines traditional Ayurveda, modern wellness, and accessible tourism into one compassionate brand. From curated Ayurvedic retreats and yoga immersions to medical tourism and specially designed tours for travellers with disabilities — Ayu prioritises your wellbeing above all.',
        color: '#7FB069',
        image: '/images/cat-ayurvedic.png',
        link: '/packages?tag=wellness',
    },
    {
        icon: TreePine,
        name: 'Nature Odyssey',
        tagline: 'Wild. Conscious. Unforgettable.',
        description: 'For nature lovers and thrill-seekers, Nature Odyssey offers eco-conscious wildlife safaris, adventure tours, and immersive nature experiences. From leopard tracking in Yala to bird watching in Sinharaja — discover Sri Lanka\'s breathtaking biodiversity responsibly.',
        color: '#2D6A4F',
        image: '/images/home/signature-wildlife.png',
        link: '/tours/wildlife-adventure',
    },
];

export default function BrandsPage() {
    return (
        <div className="min-h-screen bg-off-white">
            {/* Hero Section */}
            <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
                <Image
                    src="/images/home/signature-ceylon.png"
                    alt="Our Brands"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-deep-emerald/60" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a1f15]/80 via-transparent to-deep-emerald/90" />

                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="text-center max-w-3xl px-4">
                        <span className="inline-block mb-4 text-xs tracking-[0.4em] font-medium text-[#D4AF37] uppercase">
                            A Family of Travel Brands
                        </span>
                        <h1 className="text-5xl md:text-7xl font-display text-white leading-tight">
                            Our<br />
                            <span className="italic font-light text-[#D4AF37]">Brands</span>
                        </h1>
                        <p className="mt-6 text-white/70 font-light text-lg max-w-xl mx-auto">
                            Four specialised brands, one shared passion — crafting extraordinary Sri Lankan experiences for every kind of traveller.
                        </p>
                    </div>
                </div>
            </section>

            {/* Brands */}
            <section className="py-28">
                <div className="max-w-6xl mx-auto px-4 md:px-8">
                    <div className="space-y-20">
                        {brands.map((brand, idx) => (
                            <div
                                key={idx}
                                className={`group grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white rounded-2xl overflow-hidden border border-deep-emerald/5 shadow-sm hover:shadow-xl transition-all duration-500 ${idx % 2 === 1 ? 'lg:direction-rtl' : ''}`}
                            >
                                <div className={`relative h-72 lg:h-auto min-h-[320px] overflow-hidden ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
                                    <Image
                                        src={brand.image}
                                        alt={brand.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                </div>
                                <div className={`p-8 lg:p-12 flex flex-col justify-center ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                                            style={{ backgroundColor: `${brand.color}15`, border: `1px solid ${brand.color}30` }}
                                        >
                                            <brand.icon className="w-6 h-6" style={{ color: brand.color }} strokeWidth={1.5} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-display text-deep-emerald">{brand.name}</h3>
                                            <p className="text-xs tracking-[0.15em] uppercase font-medium" style={{ color: brand.color }}>
                                                {brand.tagline}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-gray-500 font-light leading-relaxed mb-6 text-[15px]">
                                        {brand.description}
                                    </p>
                                    <Link
                                        href={brand.link}
                                        className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase font-semibold transition-colors w-fit"
                                        style={{ color: brand.color }}
                                    >
                                        EXPLORE {brand.name.toUpperCase()}
                                        <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <div className="relative h-[50vh] overflow-hidden">
                <div className="absolute inset-0 bg-fixed bg-cover bg-center" style={{ backgroundImage: "url('/images/home/signature-ceylon.png')" }} />
                <div className="absolute inset-0 bg-deep-emerald/30" />
                <div className="relative z-10 flex items-center justify-center h-full">
                    <div className="text-center">
                        <p className="text-xs tracking-[0.4em] font-medium text-white/80 uppercase mb-4 drop-shadow-lg">
                            Find Your Style of Travel
                        </p>
                        <h3 className="text-3xl md:text-5xl font-display text-white drop-shadow-lg mb-8">
                            Your Journey, <span className="italic text-[#D4AF37]">Your Way</span>
                        </h3>
                        <Link
                            href="/inquire"
                            className="inline-block px-10 py-4 rounded-full bg-[#D4AF37] text-[#0a1f15] text-sm tracking-[0.2em] font-semibold uppercase hover:bg-[#D4AF37]/90 transition-all shadow-lg"
                        >
                            START YOUR JOURNEY
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
