'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Calendar, CheckCircle2, Loader2, Mail, User } from 'lucide-react';
import { Input } from '@/components/ui/input';

const TRAVEL_MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

const CTA_PROOF = [
    'Private planning only',
    'Direct specialist follow-up',
    'First concept within 24 hours',
];

export default function FinalCTA() {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        travelMonth: '',
    });

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);

        try {
            await fetch('/api/public/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerName: formData.name || 'Anonymous Guest',
                    email: formData.email || 'no-email@yatara.com',
                    subject: `Homepage Inquiry — ${formData.name || 'Anonymous'}`,
                    message: [
                        '--- HOMEPAGE LUXURY INQUIRY ---',
                        `Name: ${formData.name}`,
                        `Email / WhatsApp: ${formData.email}`,
                        formData.travelMonth ? `Travel Month: ${formData.travelMonth}` : '',
                    ]
                        .filter(Boolean)
                        .join('\n'),
                    priority: 'HIGH',
                }),
            });
        } catch {
            // Keep the experience smooth even if the background ticket request fails.
        } finally {
            setLoading(false);
            setSubmitted(true);
        }
    };

    return (
        <section className="relative overflow-hidden border-t border-deep-emerald/8 bg-[#f8f6f1] py-24 md:py-32">
            <div className="absolute inset-0">
                <Image
                    src="/images/home/cta-minimal-luxury.webp"
                    alt="Luxury Sri Lanka backdrop"
                    fill
                    sizes="100vw"
                    className="object-cover opacity-18"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(248,246,241,0.82)_0%,rgba(248,246,241,0.92)_45%,rgba(248,246,241,1)_100%)]" />
            </div>

            <div className="home-section-inner relative z-10">
                <div className="mx-auto max-w-4xl rounded-[34px] border border-white/70 bg-white/[0.78] p-8 shadow-[0_24px_80px_rgba(4,57,39,0.08)] backdrop-blur-2xl md:p-12">
                    <div className="mx-auto max-w-2xl text-center">
                        <p className="home-kicker">Final Invitation</p>
                        <h2 className="home-heading mt-4">
                            Tell us how you want Sri Lanka to feel
                        </h2>
                        <p className="home-copy mt-5">
                            Share a few details and we’ll return with a private itinerary concept shaped around your pace, priorities, and route.
                        </p>
                    </div>

                    {submitted ? (
                        <div className="mx-auto mt-10 max-w-2xl rounded-[28px] border border-deep-emerald/8 bg-[#f3f6f2] p-8 text-center">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-antique-gold/[0.12] text-antique-gold">
                                <CheckCircle2 className="h-7 w-7" />
                            </div>
                            <h3 className="mt-6 text-3xl font-display tracking-tight text-deep-emerald">
                                Request received
                            </h3>
                            <p className="mt-4 text-sm font-light leading-relaxed tracking-normal text-deep-emerald/70">
                                A travel designer will follow up within 24 hours to refine your route, pacing, and preferred level of support.
                            </p>
                            <Link
                                href="/build-tour"
                                className="mt-8 inline-flex items-center gap-2 rounded-full bg-deep-emerald px-7 py-3.5 text-xs font-nav font-semibold uppercase tracking-[0.18em] text-white transition duration-300 hover:bg-deep-emerald/92"
                            >
                                Open the planner
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="mt-10">
                            <div className="grid gap-4 md:grid-cols-3">
                                <label className="group relative block">
                                    <span className="mb-2 block text-[10px] font-nav font-semibold uppercase tracking-[0.2em] text-deep-emerald/40">
                                        Name
                                    </span>
                                    <span className="pointer-events-none absolute left-4 top-[50px] -translate-y-1/2 text-deep-emerald/35">
                                        <User className="h-4 w-4" />
                                    </span>
                                    <Input
                                        required
                                        value={formData.name}
                                        onChange={(event) =>
                                            setFormData((current) => ({ ...current, name: event.target.value }))
                                        }
                                        placeholder="Your name"
                                        className="h-14 rounded-2xl border-deep-emerald/10 bg-white pl-11 text-sm font-light tracking-normal text-deep-emerald placeholder:text-deep-emerald/30"
                                    />
                                </label>

                                <label className="group relative block">
                                    <span className="mb-2 block text-[10px] font-nav font-semibold uppercase tracking-[0.2em] text-deep-emerald/40">
                                        Email or WhatsApp
                                    </span>
                                    <span className="pointer-events-none absolute left-4 top-[50px] -translate-y-1/2 text-deep-emerald/35">
                                        <Mail className="h-4 w-4" />
                                    </span>
                                    <Input
                                        required
                                        value={formData.email}
                                        onChange={(event) =>
                                            setFormData((current) => ({ ...current, email: event.target.value }))
                                        }
                                        placeholder="How should we reach you?"
                                        className="h-14 rounded-2xl border-deep-emerald/10 bg-white pl-11 text-sm font-light tracking-normal text-deep-emerald placeholder:text-deep-emerald/30"
                                    />
                                </label>

                                <label className="group relative block">
                                    <span className="mb-2 block text-[10px] font-nav font-semibold uppercase tracking-[0.2em] text-deep-emerald/40">
                                        Travel month
                                    </span>
                                    <span className="pointer-events-none absolute left-4 top-[50px] -translate-y-1/2 text-deep-emerald/35">
                                        <Calendar className="h-4 w-4" />
                                    </span>
                                    <select
                                        value={formData.travelMonth}
                                        onChange={(event) =>
                                            setFormData((current) => ({
                                                ...current,
                                                travelMonth: event.target.value,
                                            }))
                                        }
                                        className="h-14 w-full appearance-none rounded-2xl border border-deep-emerald/10 bg-white pl-11 pr-4 text-sm font-light tracking-normal text-deep-emerald outline-none transition duration-300 hover:border-deep-emerald/16 focus:border-antique-gold/50"
                                    >
                                        <option value="">Select month</option>
                                        {TRAVEL_MONTHS.map((month) => (
                                            <option key={month} value={month}>
                                                {month}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </div>

                            <div className="mt-8 flex flex-col items-center gap-5">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="inline-flex items-center gap-3 rounded-full bg-deep-emerald px-8 py-3.5 text-xs font-nav font-semibold uppercase tracking-[0.18em] text-white transition duration-300 hover:bg-deep-emerald/92 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {loading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <>
                                            Design My Journey
                                            <ArrowRight className="h-4 w-4" />
                                        </>
                                    )}
                                </button>

                                <div className="flex flex-wrap justify-center gap-3">
                                    {CTA_PROOF.map((item) => (
                                        <span
                                            key={item}
                                            className="rounded-full border border-deep-emerald/10 bg-[#f3f6f2] px-4 py-2 text-[10px] font-nav font-semibold uppercase tracking-[0.18em] text-deep-emerald/50"
                                        >
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
}
