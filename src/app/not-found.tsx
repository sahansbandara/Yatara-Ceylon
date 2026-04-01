'use client';

import Link from 'next/link';
import { Home, Package2, MessageSquare, ArrowRight } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-off-white flex flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
            {/* Subtle background accent */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-antique-gold/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-deep-emerald/3 rounded-full blur-3xl" />
            </div>

            {/* Main content */}
            <div className="relative z-10 max-w-2xl mx-auto text-center">
                {/* 404 Error Code */}
                <div className="mb-8">
                    <h1 className="text-9xl sm:text-[120px] font-display text-deep-emerald font-light leading-none mb-2">
                        404
                    </h1>
                    <div className="h-1 w-20 bg-antique-gold mx-auto rounded-full" />
                </div>

                {/* Heading */}
                <h2 className="text-3xl sm:text-4xl font-serif text-deep-emerald mb-4">
                    Page Not Found
                </h2>

                {/* Description */}
                <p className="text-base sm:text-lg text-deep-emerald/70 font-nav mb-8 max-w-md mx-auto leading-relaxed">
                    We couldn't find the journey you're looking for. Let us guide you back to explore the wonders of Sri Lanka.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                    {/* Home Button */}
                    <Link
                        href="/"
                        className="group flex items-center gap-3 px-8 py-3.5 bg-deep-emerald hover:bg-deep-emerald/90 text-off-white font-nav font-semibold uppercase tracking-[0.15em] text-sm rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        <Home className="w-4 h-4" />
                        <span>Go Home</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    {/* Browse Packages Button */}
                    <Link
                        href="/journeys"
                        className="group flex items-center gap-3 px-8 py-3.5 bg-antique-gold/10 hover:bg-antique-gold/20 text-deep-emerald font-nav font-semibold uppercase tracking-[0.15em] text-sm rounded-lg transition-all duration-300 border border-antique-gold/30 hover:border-antique-gold/50"
                    >
                        <Package2 className="w-4 h-4" />
                        <span>Browse Journeys</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    {/* Contact Button */}
                    <Link
                        href="/#contact"
                        className="group flex items-center gap-3 px-8 py-3.5 bg-antique-gold/10 hover:bg-antique-gold/20 text-deep-emerald font-nav font-semibold uppercase tracking-[0.15em] text-sm rounded-lg transition-all duration-300 border border-antique-gold/30 hover:border-antique-gold/50"
                    >
                        <MessageSquare className="w-4 h-4" />
                        <span>Contact Us</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Secondary Links */}
                <div className="border-t border-deep-emerald/10 pt-8 mt-8">
                    <p className="text-xs sm:text-sm text-deep-emerald/50 font-nav uppercase tracking-wider mb-4">
                        Explore Our Offerings
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        {[
                            { label: 'Signature Experiences', href: '/#signature-experiences' },
                            { label: 'Transfers', href: '/transfers' },
                            { label: 'Build Your Tour', href: '/build-tour' },
                            { label: 'Destinations', href: '/destinations' },
                        ].map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm text-antique-gold/70 hover:text-antique-gold font-nav hover:underline transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer hint */}
            <div className="relative z-10 mt-16 text-center text-xs sm:text-sm text-deep-emerald/40 font-nav">
                <p>
                    Need help?{' '}
                    <Link href="/#contact" className="text-antique-gold/70 hover:text-antique-gold transition-colors">
                        Get in touch with our concierge
                    </Link>
                </p>
            </div>
        </div>
    );
}
