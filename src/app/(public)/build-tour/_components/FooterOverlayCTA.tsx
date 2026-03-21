import { Send, Phone } from 'lucide-react';

export default function FooterOverlayCTA() {
    return (
        <section className="relative py-32 overflow-hidden border-t border-white/10">
            {/* Bright Image Background */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: 'url(/images/footer/footer-bg.webp)' }}
            />

            {/* Liquid Glass overlay - light/bright but ensuring text readability */}
            <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0d] via-[#0a0f0d]/50 to-transparent" />

            <div className="section-container relative z-10 text-center">
                {/* Eyebrow */}
                <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="h-px w-10 bg-antique-gold" />
                    <span className="text-antique-gold drop-shadow-md text-[10px] tracking-[0.3em] uppercase font-serif font-bold">
                        Your Journey Awaits
                    </span>
                    <div className="h-px w-10 bg-antique-gold" />
                </div>

                {/* Headline */}
                <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-5 max-w-3xl mx-auto drop-shadow-xl saturate-150">
                    Ready to Turn Your Dream Into Reality?
                </h2>

                <p className="text-white/90 text-sm sm:text-base font-light max-w-xl mx-auto mb-10 leading-relaxed drop-shadow-md">
                    Share your plan with our concierge team. We&apos;ll refine the route, arrange luxury transfers, and craft a journey uniquely yours.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a
                        href="/inquire?source=build-tour-footer"
                        className="flex items-center gap-2.5 px-8 py-4 bg-antique-gold text-deep-emerald font-serif text-xs uppercase tracking-[0.2em] rounded-lg hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] hover:scale-[1.05] transition-all duration-300 font-bold"
                    >
                        <Send className="w-4 h-4" />
                        Request a Bespoke Proposal
                    </a>
                    <a
                        href="/contact"
                        className="flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white font-serif text-xs uppercase tracking-[0.2em] rounded-lg hover:bg-white/20 hover:border-antique-gold/50 transition-all duration-300 shadow-xl"
                    >
                        <Phone className="w-3.5 h-3.5" />
                        Talk to a Curator
                    </a>
                </div>

                {/* Subtle trust line */}
                <p className="text-white/60 text-[10px] uppercase tracking-[0.3em] mt-12 font-serif font-medium drop-shadow">
                    500+ bespoke journeys crafted · Fixed pricing · No hidden fees
                </p>
            </div>
        </section>
    );
}
