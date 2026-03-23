'use client';

import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

const FAQ_ITEMS = [
    {
        question: 'Do you customize every trip?',
        answer:
            'Yes. The sample journeys are starting points, not fixed departures. Every itinerary can be reshaped around pace, travel style, regions, and the level of support you want on the ground.',
    },
    {
        question: 'Are your transfers private?',
        answer:
            'Yes. Transfers are handled as private, chauffeur-led services and stay distinct from the multi-day journey planning flow, so you can add them without turning the trip into a shared itinerary.',
    },
    {
        question: 'Can multiple regions be combined?',
        answer:
            'Absolutely. Cultural sites, tea country, safari, and coast can all sit within one route. The key is sequencing them properly so the journey feels balanced instead of rushed.',
    },
    {
        question: 'Is accommodation included?',
        answer:
            'It can be. We present stays as part of the private itinerary concept when they fit the route, and everything is itemized clearly before you confirm.',
    },
    {
        question: 'How does payment work?',
        answer:
            'Once the itinerary is confirmed, a 20% advance secures the plan and the remaining balance follows the final booking terms shared with your proposal.',
    },
    {
        question: 'How quickly do you respond?',
        answer:
            'For new private itinerary requests, the goal is a first concept within 24 hours, followed by direct refinement with a travel specialist instead of a generic booking queue.',
    },
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section className="home-section-shell bg-[#f3f6f2]">
            <div className="home-section-inner">
                <div className="grid gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start">
                    <div className="max-w-xl">
                        <p className="home-kicker">FAQ</p>
                        <h2 className="home-heading mt-4">
                            Objection handling works better near the end of the page
                        </h2>
                        <p className="home-copy mt-5">
                            These are the questions that matter most when a guest is deciding whether to move from interest into a real inquiry.
                        </p>

                        <div className="mt-8 rounded-[28px] border border-deep-emerald/8 bg-white p-6 shadow-[0_14px_36px_rgba(4,57,39,0.05)]">
                            <p className="text-[10px] font-nav font-semibold uppercase tracking-[0.24em] text-antique-gold">
                                What the inquiry unlocks
                            </p>
                            <ul className="mt-4 space-y-3 text-sm font-light leading-relaxed tracking-normal text-deep-emerald/70">
                                <li>Private itinerary concept shaped around your pace</li>
                                <li>Stay, transfer, and routing logic handled together</li>
                                <li>Direct follow-up from a travel specialist within 24 hours</li>
                            </ul>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {FAQ_ITEMS.map((item, index) => {
                            const isOpen = openIndex === index;

                            return (
                                <article
                                    key={item.question}
                                    className="overflow-hidden rounded-[28px] border border-deep-emerald/8 bg-white shadow-[0_14px_36px_rgba(4,57,39,0.05)]"
                                >
                                    <button
                                        type="button"
                                        onClick={() => setOpenIndex(isOpen ? -1 : index)}
                                        className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left"
                                    >
                                        <span className="text-lg font-display tracking-tight text-deep-emerald">
                                            {item.question}
                                        </span>
                                        <span className="rounded-full border border-antique-gold/20 bg-antique-gold/10 p-2 text-antique-gold">
                                            {isOpen ? (
                                                <Minus className="h-4 w-4" />
                                            ) : (
                                                <Plus className="h-4 w-4" />
                                            )}
                                        </span>
                                    </button>

                                    {isOpen && (
                                        <div className="px-6 pb-6">
                                            <p className="text-sm font-light leading-relaxed tracking-normal text-deep-emerald/70">
                                                {item.answer}
                                            </p>
                                        </div>
                                    )}
                                </article>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
