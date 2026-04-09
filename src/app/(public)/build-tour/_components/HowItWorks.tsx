import { MapPin, Layers, Send } from 'lucide-react';

export default function HowItWorks() {
    const steps = [
        {
            icon: MapPin,
            step: '01',
            title: 'Choose Regions',
            description: 'Explore 7 signature regions and 25 districts on the interactive map.',
        },
        {
            icon: Layers,
            step: '02',
            title: 'Add & Reorder Places',
            description: 'Build your itinerary with drag-and-drop. We calculate routes automatically.',
        },
        {
            icon: Send,
            step: '03',
            title: 'Refine with Concierge',
            description: 'Send your plan to our team. We polish transfers, pacing, and luxury details.',
        },
    ];

    return (
        <section className="py-16 bg-off-white relative">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                {/* Section label */}
                <div className="flex items-center justify-center gap-3 mb-10">
                    <div className="h-px w-10 bg-antique-gold/40" />
                    <span className="text-antique-gold text-[10px] tracking-[0.3em] uppercase font-serif font-medium">
                        How It Works
                    </span>
                    <div className="h-px w-10 bg-antique-gold/40" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {steps.map((step) => {
                        const Icon = step.icon;
                        return (
                            <div
                                key={step.step}
                                className="rounded-2xl p-6 text-center group bg-white/60 backdrop-blur-xl border border-deep-emerald/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:border-antique-gold/25 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-500"
                            >
                                <div className="w-11 h-11 rounded-full bg-deep-emerald/[0.06] border border-deep-emerald/10 flex items-center justify-center mx-auto mb-4 group-hover:border-antique-gold/30 group-hover:bg-antique-gold/10 transition-all duration-500">
                                    <Icon className="w-5 h-5 text-deep-emerald/40 group-hover:text-antique-gold transition-colors duration-500" />
                                </div>
                                <span className="text-antique-gold/50 text-[9px] uppercase tracking-[0.25em] font-nav block mb-2">
                                    Step {step.step}
                                </span>
                                <h3 className="font-serif text-sm text-deep-emerald mb-2">
                                    {step.title}
                                </h3>
                                <p className="text-deep-emerald/40 text-[11px] font-light leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
