import { Shield, Gem, UserCheck, Clock } from 'lucide-react';

const standards = [
    {
        icon: UserCheck,
        title: 'Verified Private Drivers',
        description: 'Chauffeur-guides rigorously vetted for absolute discretion, safety, and deep local expertise.',
    },
    {
        icon: Gem,
        title: 'Bespoke Planning',
        description: 'Every detail meticulously curated to your exact pace and preferences, ensuring a flawless journey.',
    },
    {
        icon: Clock,
        title: '24/7 Concierge',
        description: 'Round-the-clock dedicated support from our island specialists for complete peace of mind.',
    },
    {
        icon: Shield,
        title: 'Fixed-Price Guarantee',
        description: 'Transparent, premium pricing with zero hidden fees. Pure luxury without compromise.',
    }
];

export default function YataraStandard() {
    return (
        <section className="py-24 bg-off-white border-y border-gray-200/50">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="text-center mb-16">
                    <span className="inline-block mb-3 text-xs tracking-[0.2em] font-medium text-antique-gold uppercase">
                        Uncompromising Quality
                    </span>
                    <h2 className="text-3xl md:text-4xl font-serif text-deep-emerald">
                        The Yatara Standard
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {standards.map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center group">
                            <div className="h-16 w-16 mb-6 rounded-none bg-deep-emerald/5 flex items-center justify-center border border-deep-emerald/10 group-hover:bg-deep-emerald group-hover:border-deep-emerald transition-all duration-500">
                                <item.icon className="h-6 w-6 text-deep-emerald group-hover:text-antique-gold transition-colors duration-500" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-lg font-semibold text-deep-emerald mb-3">
                                {item.title}
                            </h3>
                            <p className="text-sm text-gray-500 font-light leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
