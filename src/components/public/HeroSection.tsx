'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Calendar, Compass, Users } from 'lucide-react';

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

const TRAVEL_STYLES = [
    { value: 'heritage', label: 'Heritage & Culture' },
    { value: 'wildlife', label: 'Wildlife & Safari' },
    { value: 'beach', label: 'Beach & Coast' },
    { value: 'wellness', label: 'Wellness & Retreats' },
    { value: 'adventure', label: 'Adventure & Active' },
    { value: 'family', label: 'Family Journeys' },
];

const HERO_PROOF = [
    'Private journeys only',
    'Tailored concept within 24 hours',
    'Island-wide concierge planning',
];

function HeroField({
    icon: Icon,
    value,
    onChange,
    children,
    label,
}: {
    icon: typeof Calendar;
    value: string;
    onChange: (value: string) => void;
    children: React.ReactNode;
    label: string;
}) {
    return (
        <label className="group relative block">
            <span className="mb-2 block text-[10px] font-nav font-semibold uppercase tracking-[0.22em] text-white/60">
                {label}
            </span>
            <div className="pointer-events-none absolute left-4 top-[52px] -translate-y-1/2 text-antique-gold/70">
                <Icon className="h-4 w-4" strokeWidth={1.6} />
            </div>
            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="h-14 w-full appearance-none rounded-2xl border border-white/12 bg-white/[0.07] pl-11 pr-4 text-sm font-light tracking-normal text-white outline-none transition duration-300 hover:border-white/20 focus:border-antique-gold/50 focus:bg-white/10"
            >
                {children}
            </select>
        </label>
    );
}

export default function HeroSection() {
    const router = useRouter();
    const [travelMonth, setTravelMonth] = useState('');
    const [travelers, setTravelers] = useState('');
    const [style, setStyle] = useState('');

    const handleDesignJourney = () => {
        const params = new URLSearchParams();

        if (travelMonth) params.set('month', travelMonth);
        if (travelers) params.set('pax', travelers);
        if (style) params.set('style', style);

        const query = params.toString();
        router.push(`/build-tour${query ? `?${query}` : ''}`);
    };

    return (
        <section className="relative isolate flex min-h-[88vh] items-end overflow-hidden bg-deep-emerald pt-28 md:pt-36">
            <div className="absolute inset-0">
                <Image
                    src="/images/home/journey-dawn.webp"
                    alt="Luxury journey through Sri Lanka"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover object-center"
                />
                <video
                    src="/Hero-Section.mp4"
                    poster="/images/home/journey-dawn.webp"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover object-center opacity-80 animate-[parallaxDrift_30s_ease-in-out_alternate_infinite]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,19,13,0.92)_0%,rgba(2,19,13,0.72)_40%,rgba(2,19,13,0.35)_100%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,19,13,0.55)_0%,rgba(2,19,13,0.18)_38%,rgba(2,19,13,0.82)_100%)]" />
            </div>

            <div className="home-section-inner relative z-10 pb-14 md:pb-20">
                <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,420px)] lg:items-end">
                    <div className="max-w-3xl">
                        <p className="mb-5 text-[10px] font-nav font-semibold uppercase tracking-[0.34em] text-antique-gold">
                            Curated Private Travel
                        </p>
                        <h1 className="max-w-3xl text-4xl font-display leading-[1.02] tracking-tight text-white md:text-6xl lg:text-[5.3rem]">
                            Curated Journeys Across Sri Lanka,
                            <span className="block font-light italic text-antique-gold">
                                designed around you
                            </span>
                        </h1>
                        <p className="mt-6 max-w-2xl text-base font-light leading-relaxed tracking-normal text-white/80 md:text-lg">
                            Bespoke itineraries, private transfers, and handpicked stays shaped by local specialists who know how the island should feel at every pace.
                        </p>

                        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                            <button
                                type="button"
                                onClick={handleDesignJourney}
                                className="inline-flex items-center justify-center gap-3 rounded-full bg-antique-gold px-7 py-3.5 text-xs font-nav font-semibold uppercase tracking-[0.18em] text-deep-emerald transition duration-300 hover:bg-antique-gold/90"
                            >
                                Design My Journey
                                <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
                            </button>
                            <Link
                                href="/packages"
                                className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-3.5 text-xs font-nav font-semibold uppercase tracking-[0.18em] text-white transition duration-300 hover:border-antique-gold/50 hover:text-antique-gold"
                            >
                                Explore Journeys
                            </Link>
                        </div>

                        <div className="mt-8 flex flex-wrap gap-3">
                            {HERO_PROOF.map((item) => (
                                <span
                                    key={item}
                                    className="rounded-full border border-white/14 bg-white/[0.06] px-4 py-2 text-[10px] font-nav font-medium uppercase tracking-[0.16em] text-white/70 backdrop-blur-sm"
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-[28px] border border-white/12 bg-[linear-gradient(180deg,rgba(7,27,20,0.72)_0%,rgba(5,20,15,0.82)_100%)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl md:p-7">
                        <div className="mb-6 flex items-center justify-between gap-4">
                            <div>
                                <p className="text-[10px] font-nav font-semibold uppercase tracking-[0.28em] text-antique-gold/90">
                                    Start With Your Pace
                                </p>
                                <h2 className="mt-2 text-2xl font-display tracking-tight text-white">
                                    Build the outline
                                </h2>
                            </div>
                            <span className="rounded-full border border-antique-gold/20 bg-antique-gold/10 px-3 py-1 text-[10px] font-nav font-semibold uppercase tracking-[0.2em] text-antique-gold">
                                24h concept
                            </span>
                        </div>

                        <div className="space-y-4">
                            <HeroField
                                icon={Calendar}
                                label="Travel month"
                                value={travelMonth}
                                onChange={setTravelMonth}
                            >
                                <option value="" className="text-neutral-900">
                                    Select month
                                </option>
                                {TRAVEL_MONTHS.map((month) => (
                                    <option key={month} value={month} className="text-neutral-900">
                                        {month}
                                    </option>
                                ))}
                            </HeroField>

                            <HeroField
                                icon={Users}
                                label="Travelers"
                                value={travelers}
                                onChange={setTravelers}
                            >
                                <option value="" className="text-neutral-900">
                                    Number of guests
                                </option>
                                {[1, 2, 3, 4, 5, 6, '7+'].map((count) => (
                                    <option key={count} value={String(count)} className="text-neutral-900">
                                        {count} {count === 1 ? 'Traveler' : 'Travelers'}
                                    </option>
                                ))}
                            </HeroField>

                            <HeroField
                                icon={Compass}
                                label="Travel style"
                                value={style}
                                onChange={setStyle}
                            >
                                <option value="" className="text-neutral-900">
                                    Choose a direction
                                </option>
                                {TRAVEL_STYLES.map((travelStyle) => (
                                    <option
                                        key={travelStyle.value}
                                        value={travelStyle.value}
                                        className="text-neutral-900"
                                    >
                                        {travelStyle.label}
                                    </option>
                                ))}
                            </HeroField>
                        </div>

                        <button
                            type="button"
                            onClick={handleDesignJourney}
                            className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-5 py-4 text-xs font-nav font-semibold uppercase tracking-[0.2em] text-deep-emerald transition duration-300 hover:bg-antique-gold"
                        >
                            Design My Journey
                            <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
                        </button>

                        <p className="mt-4 text-sm font-light leading-relaxed tracking-normal text-white/62">
                            Tell us how you want Sri Lanka to feel. We shape the route, handpick the stays, and return with a private concept.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
