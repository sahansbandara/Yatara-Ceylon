import { Send, Phone, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function FooterOverlayCTA() {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-8">
            <div className="relative overflow-hidden rounded-3xl liquid-glass-gold">
                {/* Decorative gradient orbs */}
                <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-antique-gold/[0.06] blur-3xl pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-deep-emerald/[0.04] blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 p-8 sm:p-12 lg:p-16">
                    <div className="max-w-lg">
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="w-4 h-4 text-antique-gold" />
                            <p className="text-[10px] tracking-[0.3em] uppercase text-antique-gold font-medium">
                                Your Journey Awaits
                            </p>
                        </div>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display text-deep-emerald leading-tight mb-4">
                            Ready to Turn Your Dream Into Reality?
                        </h2>
                        <p className="text-sm text-deep-emerald/50 leading-relaxed">
                            Share your plan with our concierge team. We&apos;ll refine the route,
                            arrange luxury transfers, and craft a journey uniquely yours.
                        </p>

                        {/* Trust line */}
                        <p className="text-deep-emerald/30 text-[10px] uppercase tracking-[0.2em] mt-6 font-serif">
                            500+ bespoke journeys crafted · Fixed pricing · No hidden fees
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href="/inquire?source=build-tour-footer"
                            className="group inline-flex items-center gap-3 px-8 py-4 bg-deep-emerald text-white text-xs tracking-[0.2em] font-medium uppercase rounded-full hover:bg-antique-gold transition-all duration-500 shadow-lg shadow-deep-emerald/20 hover:shadow-xl hover:shadow-antique-gold/30 hover:-translate-y-1"
                        >
                            <Send className="h-4 w-4" />
                            <span>Request a Bespoke Proposal</span>
                        </Link>
                        <Link
                            href="/contact"
                            className="group inline-flex items-center gap-3 px-8 py-4 border border-deep-emerald/15 text-deep-emerald/60 text-xs tracking-[0.2em] font-medium uppercase rounded-full hover:bg-deep-emerald/5 hover:border-deep-emerald/25 transition-all duration-300"
                        >
                            <Phone className="h-3.5 w-3.5" />
                            <span>Talk to a Curator</span>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
