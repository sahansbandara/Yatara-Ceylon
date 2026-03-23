import { Shield, PlaneLanding, Handshake, UserCheck } from 'lucide-react';

const pillars = [
    { icon: Handshake, label: 'Meet & Greet', detail: 'Named greeter at arrivals' },
    { icon: PlaneLanding, label: 'Flight Tracking', detail: 'Delays auto-adjusted' },
    { icon: Shield, label: 'Fixed Fares', detail: 'No surge, no surprises' },
    { icon: UserCheck, label: 'Discreet Service', detail: 'Professional & private' },
];

export default function TransferTrustBar() {
    return (
        <section className="bg-deep-emerald/[0.03] border-y border-deep-emerald/5">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                    {pillars.map((pillar) => {
                        const Icon = pillar.icon;
                        return (
                            <div key={pillar.label} className="flex items-center gap-3 group">
                                <div className="w-12 h-12 flex-shrink-0 bg-antique-gold/10 rounded-xl flex items-center justify-center group-hover:bg-antique-gold/20 transition-colors duration-300">
                                    <Icon className="w-5 h-5 text-antique-gold" />
                                </div>
                                <div>
                                    <p className="font-nav text-sm font-semibold text-deep-emerald">
                                        {pillar.label}
                                    </p>
                                    <p className="text-xs text-deep-emerald/50 font-nav">
                                        {pillar.detail}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
