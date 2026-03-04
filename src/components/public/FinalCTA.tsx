'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2, CheckCircle2, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const TRAVEL_MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

const PROOF_CHIPS = [
    'No obligation',
    'Tailored itinerary',
    'Fast response',
];

export default function FinalCTA() {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        travelMonth: '',
    });

    const canSubmit = formData.name.trim() && formData.email.trim();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;
        setLoading(true);
        try {
            const res = await fetch('/api/public/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerName: formData.name,
                    email: formData.email,
                    subject: `Quick Proposal Request — ${formData.name}`,
                    message: [
                        '--- QUICK PROPOSAL REQUEST (Homepage CTA) ---',
                        `Name: ${formData.name}`,
                        `Email / WhatsApp: ${formData.email}`,
                        formData.travelMonth ? `Travel Month: ${formData.travelMonth}` : '',
                    ].filter(Boolean).join('\n'),
                    priority: 'HIGH',
                }),
            });
            if (res.ok) setSubmitted(true);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="relative py-24 md:py-32 overflow-hidden">
            {/* Subtle ivory gradient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#FAF8F5] via-[#F5F0EA] to-[#FAF8F5]" />
            {/* Faint decorative blur accents */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-antique-gold/[0.04] rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-deep-emerald/[0.03] rounded-full blur-3xl pointer-events-none" />

            {/* Thin top divider */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-deep-emerald/10 to-transparent" />

            <div className="relative max-w-[900px] mx-auto px-6">
                {/* Eyebrow badge */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-deep-emerald/5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5 text-antique-gold" />
                        <span className="text-[10px] font-nav font-semibold tracking-widest text-deep-emerald/70 uppercase">
                            Vetted Excellence
                        </span>
                    </div>
                </div>

                {/* Heading */}
                <h2 className="text-center text-4xl md:text-5xl lg:text-6xl font-display text-deep-emerald leading-[1.1] mb-6 tracking-tight">
                    Your Bespoke Journey Begins{' '}
                    <span className="italic font-light text-antique-gold">Here</span>
                </h2>

                {/* Subcopy */}
                <p className="text-center text-deep-emerald/60 font-light text-sm md:text-base leading-relaxed mb-8 max-w-2xl mx-auto">
                    Tell us your dates and travel style. A specialist will refine the route, stays, and pacing — crafted entirely around you.
                </p>

                {/* Micro testimonial */}
                <div className="flex items-center justify-center gap-3 mb-12">
                    <Quote className="w-4 h-4 text-antique-gold/60 shrink-0 rotate-180" />
                    <p className="text-deep-emerald/50 text-sm md:text-base italic font-light">
                        Every detail was flawless — a love letter to Sri Lanka.
                    </p>
                    <span className="text-deep-emerald/40 text-xs font-nav tracking-wide whitespace-nowrap">
                        — Charlotte &amp; James
                    </span>
                </div>

                {/* Main conversion card */}
                <div className="max-w-[680px] mx-auto">
                    {submitted ? (
                        /* Success state */
                        <div className="bg-white/80 backdrop-blur-sm border border-deep-emerald/10 p-8 md:p-10 text-center shadow-sm">
                            <div className="h-14 w-14 rounded-full bg-deep-emerald/10 flex items-center justify-center mx-auto mb-5">
                                <CheckCircle2 className="h-7 w-7 text-deep-emerald" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-2xl font-display text-deep-emerald mb-3">Request Received</h3>
                            <p className="text-deep-emerald/60 font-light text-sm leading-relaxed mb-1">
                                A travel designer will reach out within <strong className="text-deep-emerald font-medium">24–48 hours</strong> with a tailored proposal.
                            </p>
                            <p className="text-deep-emerald/40 font-light text-xs">
                                Confirmation sent to {formData.email}
                            </p>
                        </div>
                    ) : (
                        /* Mini form */
                        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm border border-deep-emerald/10 p-6 md:p-10 shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-nav font-medium text-deep-emerald/60 uppercase tracking-wider">
                                        Name *
                                    </label>
                                    <Input
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Your name"
                                        className="h-11 rounded-none border-deep-emerald/15 focus:border-antique-gold focus:ring-antique-gold/20 font-light bg-white/60 text-sm"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-nav font-medium text-deep-emerald/60 uppercase tracking-wider">
                                        Email / WhatsApp *
                                    </label>
                                    <Input
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="you@email.com"
                                        className="h-11 rounded-none border-deep-emerald/15 focus:border-antique-gold focus:ring-antique-gold/20 font-light bg-white/60 text-sm"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-nav font-medium text-deep-emerald/60 uppercase tracking-wider">
                                        Travel Month
                                    </label>
                                    <select
                                        value={formData.travelMonth}
                                        onChange={(e) => setFormData({ ...formData, travelMonth: e.target.value })}
                                        className="h-11 w-full rounded-none border border-deep-emerald/15 focus:border-antique-gold focus:ring-1 focus:ring-antique-gold/20 font-light bg-white/60 text-sm px-3 text-deep-emerald/80 outline-none appearance-none cursor-pointer"
                                    >
                                        <option value="">Select month</option>
                                        {TRAVEL_MONTHS.map((month) => (
                                            <option key={month} value={month}>{month}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Dual CTA row */}
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <Button
                                    type="submit"
                                    disabled={!canSubmit || loading}
                                    className="w-full sm:w-auto h-[50px] px-10 bg-deep-emerald text-white rounded-none font-nav font-semibold tracking-[0.15em] text-[11px] uppercase transition-all duration-500 hover:bg-antique-gold hover:text-deep-emerald hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none group"
                                >
                                    {loading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <>
                                            Request a Proposal
                                            <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-500 group-hover:translate-x-1" />
                                        </>
                                    )}
                                </Button>

                                <Link
                                    href="/inquire?type=concierge"
                                    className="text-deep-emerald/60 hover:text-antique-gold text-xs font-nav tracking-[0.12em] uppercase transition-colors duration-300 flex items-center gap-1.5 group/link"
                                >
                                    Speak to a Designer
                                    <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover/link:translate-x-0.5" />
                                </Link>
                            </div>
                        </form>
                    )}

                    {/* Proof chips */}
                    {!submitted && (
                        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-6">
                            {PROOF_CHIPS.map((chip, i) => (
                                <span
                                    key={chip}
                                    className="flex items-center gap-1.5 text-[10px] font-nav text-deep-emerald/45 tracking-[0.12em] uppercase"
                                >
                                    {i > 0 && <span className="hidden sm:inline text-deep-emerald/20 -ml-3 mr-1.5">·</span>}
                                    {chip}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Thin bottom divider */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-deep-emerald/10 to-transparent" />
        </section>
    );
}
