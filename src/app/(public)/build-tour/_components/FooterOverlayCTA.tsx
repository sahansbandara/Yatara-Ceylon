import { Send, Phone } from 'lucide-react';

export default function FooterOverlayCTA() {
    return (
        <section className="relative py-24 overflow-hidden">
            {/* Dark gradient BG */}
            <div className="absolute inset-0 bg-gradient-to-b from-deep-emerald/40 via-[#021a10] to-[#0a0f0d]" />

            {/* Topographic texture */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='1'%3E%3Cpath d='m0 0 40 20L0 40zm40 20 40 20-40 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />

            {/* Radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.06)_0%,_transparent_70%)]" />

            <div className="section-container relative z-10 text-center">
                {/* Eyebrow */}
                <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="h-px w-10 bg-antique-gold/30" />
                    <span className="text-antique-gold text-[10px] tracking-[0.3em] uppercase font-serif">
                        Your Journey Awaits
                    </span>
                    <div className="h-px w-10 bg-antique-gold/30" />
                </div>

                {/* Headline */}
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mb-5 max-w-2xl mx-auto">
                    Ready to Turn Your Dream Into Reality?
                </h2>

                <p className="text-white/40 text-sm font-light max-w-lg mx-auto mb-10 leading-relaxed">
                    Share your plan with our concierge team. We&apos;ll refine the route, arrange luxury transfers, and craft a journey uniquely yours.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                        href="/inquire?source=build-tour-footer"
                        className="flex items-center gap-2.5 px-8 py-3.5 bg-antique-gold text-deep-emerald font-serif text-xs uppercase tracking-[0.2em] rounded-lg hover:shadow-lg hover:shadow-antique-gold/30 hover:scale-[1.02] transition-all duration-300 font-semibold"
                    >
                        <Send className="w-4 h-4" />
                        Request a Bespoke Proposal
                    </a>
                    <a
                        href="/contact"
                        className="flex items-center gap-2 px-6 py-3 border border-white/15 text-white/60 font-serif text-xs uppercase tracking-[0.2em] rounded-lg hover:border-antique-gold/30 hover:text-white/80 transition-all duration-300"
                    >
                        <Phone className="w-3.5 h-3.5" />
                        Talk to a Curator
                    </a>
                </div>

                {/* Subtle trust line */}
                <p className="text-white/15 text-[9px] uppercase tracking-[0.3em] mt-10 font-serif">
                    500+ bespoke journeys crafted · Fixed pricing · No hidden fees
                </p>
            </div>
        </section>
    );
}
