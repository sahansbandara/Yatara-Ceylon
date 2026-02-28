import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Shield, Clock, Car, Users, MapPin, Star } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Premium Transfers | Yatara Ceylon',
    description: 'Luxury airport transfers, private chauffeur services, and intercity transport across Sri Lanka. Professional drivers, premium fleet, door-to-door comfort.',
};

const services = [
    {
        icon: Car,
        title: 'Airport Transfers',
        description: 'Seamless arrivals and departures from Bandaranaike International Airport. Meet & greet service with complimentary water and Wi-Fi.',
        features: ['24/7 availability', 'Flight tracking', 'Meet & greet', 'Luggage assistance'],
    },
    {
        icon: MapPin,
        title: 'Private Chauffeur',
        description: 'A dedicated English-speaking driver throughout your journey. Your personal guide to the island, available at your pace.',
        features: ['English-speaking', 'Local expertise', 'Flexible itineraries', 'Daily availability'],
    },
    {
        icon: Users,
        title: 'Intercity Transfers',
        description: 'Premium point-to-point transfers between any two destinations in Sri Lanka. Air-conditioned comfort on every route.',
        features: ['Door-to-door', 'All destinations', 'Scenic routes', 'Rest stops included'],
    },
    {
        icon: Shield,
        title: 'Fleet Standards',
        description: 'Every vehicle in our fleet meets international luxury standards — regularly serviced, comprehensively insured, and immaculately maintained.',
        features: ['Full insurance', 'GPS equipped', 'Air conditioned', 'Regular servicing'],
    },
];

const fleetVehicles = [
    { name: 'Premium Sedan', capacity: '2 guests', type: 'Toyota Premio / Axio', ideal: 'Couples & solo travelers' },
    { name: 'Luxury SUV', capacity: '4 guests', type: 'Toyota Prado / Fortuner', ideal: 'Families & small groups' },
    { name: 'Premium Van', capacity: '6–8 guests', type: 'Toyota KDH / Hiace', ideal: 'Groups & extended families' },
    { name: 'Mini Coach', capacity: '12–16 guests', type: 'Rosa / Coaster', ideal: 'Large groups & events' },
];

export default function TransfersPage() {
    return (
        <div className="min-h-screen bg-off-white">
            {/* Hero Banner */}
            <div className="bg-deep-emerald pt-32 pb-20 px-4 md:px-8">
                <div className="max-w-5xl mx-auto text-center">
                    <span className="inline-block py-2 px-6 text-[10px] tracking-[0.4em] uppercase font-medium text-antique-gold border border-antique-gold/30 mb-8">
                        Premium Transport
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-6 leading-tight">
                        Luxury <span className="italic font-light text-antique-gold">Transfers</span>
                    </h1>
                    <p className="text-white/70 text-lg font-light leading-relaxed max-w-2xl mx-auto">
                        Travel Sri Lanka in comfort. From the moment you land to every destination along the way — premium vehicles, professional drivers, seamless service.
                    </p>
                    <div className="h-px w-24 bg-antique-gold/40 mx-auto mt-8" />
                </div>
            </div>

            {/* Services Grid */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {services.map((service) => (
                        <div
                            key={service.title}
                            className="bg-white border border-gray-100 p-8 md:p-10 hover:border-antique-gold/30 hover:shadow-lg transition-all duration-500 group"
                        >
                            <div className="flex items-start gap-5 mb-6">
                                <div className="w-12 h-12 rounded-full bg-deep-emerald/5 flex items-center justify-center shrink-0 group-hover:bg-antique-gold/10 transition-colors">
                                    <service.icon className="w-5 h-5 text-deep-emerald group-hover:text-antique-gold transition-colors" strokeWidth={1.5} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-serif text-deep-emerald mb-2 group-hover:text-antique-gold transition-colors">
                                        {service.title}
                                    </h3>
                                    <p className="text-gray-500 font-light text-sm leading-relaxed">
                                        {service.description}
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 ml-[68px]">
                                {service.features.map((feature) => (
                                    <div key={feature} className="flex items-center gap-2 text-xs text-gray-400 font-nav tracking-wide">
                                        <div className="w-1 h-1 rounded-full bg-antique-gold/60" />
                                        {feature}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Fleet Section */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-20">
                <div className="text-center mb-14">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-antique-gold font-nav font-medium">Our Fleet</span>
                    <h2 className="text-3xl md:text-4xl font-serif text-deep-emerald mt-3 mb-4">
                        Vehicles for Every Journey
                    </h2>
                    <p className="text-gray-500 font-light max-w-xl mx-auto text-sm">
                        Choose from our range of premium vehicles, each maintained to the highest standards.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {fleetVehicles.map((vehicle) => (
                        <div
                            key={vehicle.name}
                            className="bg-white border border-gray-100 p-7 text-center hover:border-antique-gold/30 hover:shadow-md transition-all duration-500"
                        >
                            <div className="w-14 h-14 rounded-full bg-deep-emerald/5 flex items-center justify-center mx-auto mb-4">
                                <Car className="w-6 h-6 text-deep-emerald" strokeWidth={1.5} />
                            </div>
                            <h4 className="font-serif text-lg text-deep-emerald mb-1">{vehicle.name}</h4>
                            <p className="text-xs text-antique-gold font-nav tracking-[0.15em] uppercase mb-3">{vehicle.capacity}</p>
                            <p className="text-sm text-gray-400 font-light mb-1">{vehicle.type}</p>
                            <p className="text-xs text-gray-300 font-light">{vehicle.ideal}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Trust + Stats */}
            <div className="bg-deep-emerald py-16">
                <div className="max-w-5xl mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { value: '5,000+', label: 'Transfers Completed' },
                            { value: '4.9/5', label: 'Guest Rating' },
                            { value: '100%', label: 'On-Time Record' },
                            { value: '24/7', label: 'Availability' },
                        ].map((stat) => (
                            <div key={stat.label}>
                                <div className="text-3xl md:text-4xl font-serif text-antique-gold mb-2">{stat.value}</div>
                                <div className="text-[10px] tracking-[0.2em] uppercase text-white/60 font-nav">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="max-w-4xl mx-auto px-4 md:px-8 py-20 text-center">
                <h3 className="text-2xl md:text-3xl font-serif text-deep-emerald mb-4">Ready to Book Your Transfer?</h3>
                <p className="text-gray-400 font-light mb-8 max-w-lg mx-auto">
                    Whether it&apos;s an airport pickup or a multi-day private driver — our concierge team will arrange everything.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/inquire"
                        className="inline-flex items-center gap-3 px-10 py-4 bg-deep-emerald text-antique-gold hover:bg-deep-emerald/90 border border-antique-gold/30 font-nav uppercase tracking-[0.2em] text-xs transition-all duration-300 shadow-lg"
                    >
                        Request a Quote
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                        href="/build-tour"
                        className="inline-flex items-center gap-3 px-10 py-4 bg-white text-deep-emerald hover:bg-off-white border border-deep-emerald/20 font-nav uppercase tracking-[0.2em] text-xs transition-all duration-300"
                    >
                        Build Custom Tour
                    </Link>
                </div>
            </div>
        </div>
    );
}
