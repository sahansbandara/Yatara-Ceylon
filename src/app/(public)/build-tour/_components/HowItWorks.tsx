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
        <section className="py-12 bg-[#0a0f0d] relative">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                {/* Section label */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="h-px w-10 bg-antique-gold/20" />
                    <span className="text-antique-gold/60 text-[9px] tracking-[0.3em] uppercase font-serif">
                        How It Works
                    </span>
                    <div className="h-px w-10 bg-antique-gold/20" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {steps.map((step) => {
                        const Icon = step.icon;
                        return (
                            <div
                                key={step.step}
                                className="how-step-glass rounded-2xl p-5 text-center group"
                            >
                                <div className="w-10 h-10 rounded-full bg-antique-gold/8 border border-antique-gold/15 flex items-center justify-center mx-auto mb-3">
                                    <Icon className="w-4.5 h-4.5 text-antique-gold/60" />
                                </div>
                                <span className="text-antique-gold/30 text-[9px] uppercase tracking-[0.25em] font-nav block mb-1.5">
                                    Step {step.step}
                                </span>
                                <h3 className="font-serif text-sm text-white/85 mb-1.5">
                                    {step.title}
                                </h3>
                                <p className="text-white/30 text-[10px] font-light leading-relaxed">
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
