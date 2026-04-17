import Image from 'next/image';
import Link from 'next/link';
import { Shield, Leaf, Wifi, Snowflake, Users, Car, Bus, Truck } from 'lucide-react';
import { AnimatedStat } from '@/components/ui/AnimatedStat';

const vehicleCategories = [
    {
        icon: Car,
        name: 'Luxury Sedans',
        description: 'Premium sedans for couples and VIP transfers. Toyota Camry, Mercedes E-Class, and BMW 5 Series.',
        capacity: '1–2 Passengers',
        image: '/images/home/signature-ceylon.png',
    },
    {
        icon: Car,
        name: 'SUVs & Crossovers',
        description: 'Spacious 4x4 vehicles ideal for hill-country drives and safari excursions. Toyota Prado, Mitsubishi Outlander.',
        capacity: '2–4 Passengers',
        image: '/images/home/signature-wildlife.png',
    },
    {
        icon: Truck,
        name: 'Mini Vans',
        description: 'Comfortable mini vans for families and small groups. Toyota KDH, Hyundai H1 with ample luggage space.',
        capacity: '4–8 Passengers',
        image: '/images/home/heritage-story.png',
    },
    {
        icon: Bus,
        name: 'Luxury Coaches',
        description: 'Full-size coaches for large groups and conferences. Modern, air-conditioned, with reclining seats and PA systems.',
        capacity: '20–45 Passengers',
        image: '/images/home/curated-kingdoms.png',
    },
];

const fleetFeatures = [
    { icon: Snowflake, title: 'Air Conditioned', desc: 'Every vehicle is fully climate-controlled for comfort in tropical weather.' },
    { icon: Wifi, title: 'Wi-Fi Equipped', desc: 'Stay connected with complimentary Wi-Fi on all premium transfers.' },
    { icon: Shield, title: 'Fully Insured', desc: 'Comprehensive insurance coverage on every vehicle in our fleet.' },
    { icon: Leaf, title: 'Eco-Friendly', desc: 'Our fleet includes hybrid and carbon-offset vehicles for greener travel.' },
    { icon: Users, title: 'Professional Drivers', desc: 'Trained, multilingual chauffeur-guides with deep local knowledge.' },
    { icon: Car, title: 'Well Maintained', desc: 'Rigorous maintenance schedules and daily inspections before every trip.' },
];

const stats = [
    { value: '200+', label: 'Vehicles' },
    { value: '100+', label: 'Chauffeur Guides' },
    { value: '24/7', label: 'Support' },
    { value: '0', label: 'Compromise on Quality' },
];

export default function FleetPage() {
    return (
        <div className="min-h-screen bg-off-white">
            {/* Hero Section */}
            <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
                <Image
                    src="/images/home/signature-ceylon.png"
                    alt="Yatara Ceylon Fleet"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-deep-emerald/60" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a1f15]/80 via-transparent to-deep-emerald/90" />

                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="text-center max-w-3xl px-4">
                        <span className="inline-block mb-4 text-xs tracking-[0.4em] font-medium text-[#D4AF37] uppercase">
                            200+ Premium Vehicles
                        </span>
                        <h1 className="text-5xl md:text-7xl font-display text-white leading-tight">
                            Our<br />
                            <span className="italic font-light text-[#D4AF37]">Fleet</span>
                        </h1>
                        <p className="mt-6 text-white/70 font-light text-lg max-w-xl mx-auto">
                            One of Sri Lanka&apos;s largest private fleets — luxury sedans, SUVs, mini vans, and coaches, all meticulously maintained.
                        </p>
                    </div>
                </div>
            </section>

            {/* Vehicle Categories */}
            <section className="py-28">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-16">
                        <span className="text-xs tracking-[0.3em] text-[#D4AF37] uppercase font-medium">Our Vehicles</span>
                        <h2 className="text-4xl md:text-5xl font-display text-deep-emerald mt-3">
                            Choose Your Ride
                        </h2>
                        <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-6" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {vehicleCategories.map((vehicle, idx) => (
                            <div key={idx} className="group flex flex-col md:flex-row bg-white rounded-2xl overflow-hidden border border-deep-emerald/5 shadow-sm hover:shadow-xl transition-all duration-500">
                                <div className="relative w-full md:w-48 h-48 md:h-auto shrink-0">
                                    <Image src={vehicle.image} alt={vehicle.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                </div>
                                <div className="p-6 flex flex-col justify-center">
                                    <div className="flex items-center gap-3 mb-3">
                                        <vehicle.icon className="w-5 h-5 text-[#D4AF37]" strokeWidth={1.5} />
                                        <h3 className="text-xl font-display text-deep-emerald">{vehicle.name}</h3>
                                    </div>
                                    <p className="text-gray-500 font-light text-sm leading-relaxed mb-3">{vehicle.description}</p>
                                    <span className="text-xs tracking-[0.15em] uppercase text-[#D4AF37] font-medium">{vehicle.capacity}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-20 bg-deep-emerald">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="text-center">
                                <p className="text-4xl md:text-5xl font-display text-[#D4AF37] mb-2">
                                    <AnimatedStat value={stat.value} />
                                </p>
                                <p className="text-xs tracking-[0.15em] uppercase text-white/60 font-medium">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Fleet Features */}
            <section className="py-28 bg-white">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-16">
                        <span className="text-xs tracking-[0.3em] text-[#D4AF37] uppercase font-medium">Fleet Standards</span>
                        <h2 className="text-4xl md:text-5xl font-display text-deep-emerald mt-3">
                            Why Our Fleet Stands Out
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {fleetFeatures.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-5 group">
                                <div className="w-11 h-11 rounded-xl bg-deep-emerald/5 border border-deep-emerald/10 flex items-center justify-center shrink-0 group-hover:bg-[#D4AF37]/10 group-hover:border-[#D4AF37]/20 transition-all">
                                    <feature.icon className="w-5 h-5 text-deep-emerald/60 group-hover:text-[#D4AF37] transition-colors" strokeWidth={1.5} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-display text-deep-emerald mb-1">{feature.title}</h3>
                                    <p className="text-gray-500 font-light text-sm leading-relaxed">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <div className="relative h-[50vh] overflow-hidden">
                <div className="absolute inset-0 bg-fixed bg-cover bg-center" style={{ backgroundImage: "url('/images/home/signature-heritage.png')" }} />
                <div className="absolute inset-0 bg-deep-emerald/30" />
                <div className="relative z-10 flex items-center justify-center h-full">
                    <div className="text-center">
                        <p className="text-xs tracking-[0.4em] font-medium text-white/80 uppercase mb-4 drop-shadow-lg">
                            Book Your Transfer
                        </p>
                        <h3 className="text-3xl md:text-5xl font-display text-white drop-shadow-lg mb-8">
                            Travel in <span className="italic text-[#D4AF37]">Style & Comfort</span>
                        </h3>
                        <Link
                            href="/transfers"
                            className="inline-block px-10 py-4 rounded-full bg-[#D4AF37] text-[#0a1f15] text-sm tracking-[0.2em] font-semibold uppercase hover:bg-[#D4AF37]/90 transition-all shadow-lg"
                        >
                            VIEW TRANSFERS
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
