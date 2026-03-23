import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MapPinned, Route, SlidersHorizontal } from 'lucide-react';

const PLANNER_STEPS = [
    'Choose your regions and must-feel moments',
    'Set the pace for culture, coast, wildlife, or retreat',
    'Receive a route concept refined by a local specialist',
];

const DISTRICTS = ['Kandy', 'Nuwara Eliya', 'Ella', 'Galle'];

export default function BuildTourTeaser() {
    return (
        <section className="home-section-shell bg-off-white">
            <div className="home-section-inner">
                <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(360px,480px)] lg:items-center">
                    <div className="max-w-2xl">
                        <p className="home-kicker">Bespoke Journey Builder</p>
                        <h2 className="home-heading mt-4">
                            The map-led planner should feel like the differentiator it is
                        </h2>
                        <p className="home-copy mt-5">
                            This is where Yatara Ceylon becomes more than a collection of sample journeys. Guests can start from geography, travel mood, and pacing, then move into a tailored route without losing the premium feel.
                        </p>

                        <div className="mt-8 grid gap-4">
                            {PLANNER_STEPS.map((step, index) => (
                                <div
                                    key={step}
                                    className="flex items-start gap-4 rounded-[24px] border border-deep-emerald/8 bg-white p-5 shadow-[0_12px_30px_rgba(4,57,39,0.04)]"
                                >
                                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-antique-gold/30 bg-antique-gold/10 text-[11px] font-nav font-semibold uppercase tracking-[0.18em] text-antique-gold">
                                        0{index + 1}
                                    </span>
                                    <p className="pt-1 text-sm font-light leading-relaxed tracking-normal text-deep-emerald/70">
                                        {step}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 flex flex-wrap items-center gap-4">
                            <Link
                                href="/build-tour"
                                className="inline-flex items-center gap-3 rounded-full bg-deep-emerald px-7 py-3.5 text-xs font-nav font-semibold uppercase tracking-[0.18em] text-white transition duration-300 hover:bg-deep-emerald/92"
                            >
                                Design My Journey
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            <p className="text-xs font-nav uppercase tracking-[0.16em] text-deep-emerald/40">
                                Private itinerary concept within 24 hours
                            </p>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="relative overflow-hidden rounded-[34px] border border-white/60 bg-[linear-gradient(160deg,#062018_0%,#0b2d23_52%,#113d33_100%)] p-6 shadow-[0_24px_80px_rgba(4,57,39,0.18)]">
                            <div className="absolute inset-0">
                                <Image
                                    src="/images/home/bespoke-teaser-main.webp"
                                    alt="Bespoke Sri Lanka route planning"
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 40vw"
                                    className="object-cover opacity-20"
                                />
                                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,18,14,0.2)_0%,rgba(4,18,14,0.8)_100%)]" />
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-[10px] font-nav font-semibold uppercase tracking-[0.28em] text-antique-gold">
                                            Planner Preview
                                        </p>
                                        <h3 className="mt-2 text-3xl font-display tracking-tight text-white">
                                            Build by district
                                        </h3>
                                    </div>
                                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-antique-gold backdrop-blur-sm">
                                        <MapPinned className="h-5 w-5" />
                                    </div>
                                </div>

                                <div className="mt-8 grid gap-4 md:grid-cols-2">
                                    <div className="rounded-[26px] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm">
                                        <div className="flex items-center gap-2 text-[10px] font-nav font-semibold uppercase tracking-[0.24em] text-white/60">
                                            <MapPinned className="h-3.5 w-3.5 text-antique-gold" />
                                            Selected districts
                                        </div>
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {DISTRICTS.map((district) => (
                                                <span
                                                    key={district}
                                                    className="rounded-full border border-antique-gold/20 bg-antique-gold/10 px-3 py-1.5 text-[10px] font-nav font-semibold uppercase tracking-[0.16em] text-antique-gold"
                                                >
                                                    {district}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="rounded-[26px] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm">
                                        <div className="flex items-center gap-2 text-[10px] font-nav font-semibold uppercase tracking-[0.24em] text-white/60">
                                            <SlidersHorizontal className="h-3.5 w-3.5 text-antique-gold" />
                                            Route profile
                                        </div>
                                        <div className="mt-4 space-y-3 text-sm font-light tracking-normal text-white/70">
                                            <p>9 nights · two travelers · private chauffeur</p>
                                            <p>Culture through the highlands into the south coast</p>
                                            <p>Balanced pacing with quiet mornings and longer coastal stays</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-5 rounded-[26px] border border-white/10 bg-black/18 p-5 backdrop-blur-sm">
                                    <div className="flex items-center gap-2 text-[10px] font-nav font-semibold uppercase tracking-[0.24em] text-white/60">
                                        <Route className="h-3.5 w-3.5 text-antique-gold" />
                                        Curated route logic
                                    </div>
                                    <p className="mt-4 text-sm font-light leading-relaxed tracking-normal text-white/70">
                                        Colombo arrival → cultural triangle → tea country → southern coast, with stays and transfer timing adjusted around how long you actually want to linger.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
