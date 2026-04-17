'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqCategories = [
    {
        category: 'General',
        questions: [
            {
                q: 'What types of tours does Yatara Ceylon offer?',
                a: 'We offer a comprehensive range of travel services including tailor-made tours, group tours and excursions, private transfers, MICE (Meetings, Incentives, Conferences, Events) services, wellness retreats, and adventure tours. Every itinerary is customisable to your preferences.',
            },
            {
                q: 'How far in advance should I book?',
                a: 'We recommend booking at least 4–6 weeks in advance for standard tours and 2–3 months for peak season (December–March). Last-minute bookings are possible subject to availability.',
            },
            {
                q: 'Do you offer travel insurance?',
                a: 'Yes, we offer comprehensive travel insurance packages covering medical emergencies, trip cancellations, and luggage protection. We strongly recommend all travellers purchase insurance for peace of mind.',
            },
        ],
    },
    {
        category: 'Booking & Payment',
        questions: [
            {
                q: 'What is your cancellation policy?',
                a: 'Free cancellation is available up to 24 hours on all transport services. For tour packages, cancellation terms vary: full refund up to 30 days before departure, 50% refund 15–30 days before, and no refund within 14 days of departure.',
            },
            {
                q: 'What payment methods do you accept?',
                a: 'We accept Visa, Mastercard, American Express, and bank transfers. Payments can be made in USD, EUR, GBP, or LKR. A 30% deposit secures your booking, with the balance due 14 days before travel.',
            },
            {
                q: 'Can I modify my booking after confirmation?',
                a: 'Yes, modifications are possible subject to availability. Changes requested more than 14 days before travel are usually accommodated at no extra charge. Last-minute changes may incur additional costs.',
            },
        ],
    },
    {
        category: 'Travel in Sri Lanka',
        questions: [
            {
                q: 'Do I need a visa to visit Sri Lanka?',
                a: 'Most nationalities require an Electronic Travel Authorisation (ETA) which can be obtained online. We provide full visa assistance and guidance for all our guests.',
            },
            {
                q: 'What is the best time to visit Sri Lanka?',
                a: 'Sri Lanka is a year-round destination! The west and south coasts are best from November to April, while the east coast shines from May to September. The Cultural Triangle and Hill Country are pleasant throughout the year.',
            },
            {
                q: 'Is Sri Lanka safe for tourists?',
                a: 'Yes, Sri Lanka is widely regarded as one of the safest destinations in South Asia. Our team provides 24/7 on-ground support, and all our chauffeur-guides are trained in guest safety and first aid.',
            },
            {
                q: 'What languages do your guides speak?',
                a: 'Our chauffeur-guides are fluent in English and Sinhala. We also have guides who speak French, German, Italian, Spanish, Japanese, and Mandarin upon request.',
            },
        ],
    },
    {
        category: 'Transport & Fleet',
        questions: [
            {
                q: 'What vehicles are available?',
                a: 'We have a fleet of 200+ vehicles including luxury sedans, SUVs, mini vans, and coaches. All are air-conditioned, well-maintained, and driven by professional chauffeur-guides.',
            },
            {
                q: 'Can I request a specific vehicle type?',
                a: 'Absolutely. When booking, you can specify your preferred vehicle category. We also offer vehicle upgrades and special requests for weddings, corporate events, and VIP transfers.',
            },
        ],
    },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-deep-emerald/10 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between py-5 text-left group"
            >
                <span className="text-deep-emerald font-medium text-[15px] pr-4 group-hover:text-[#D4AF37] transition-colors">
                    {question}
                </span>
                <ChevronDown
                    className={`w-5 h-5 text-deep-emerald/40 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#D4AF37]' : ''}`}
                />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-5' : 'max-h-0'}`}>
                <p className="text-gray-500 font-light text-sm leading-relaxed">{answer}</p>
            </div>
        </div>
    );
}

export default function FAQPage() {
    return (
        <div className="min-h-screen bg-off-white">
            {/* Hero Section */}
            <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
                <Image
                    src="/images/home/curated-kingdoms.png"
                    alt="Frequently Asked Questions"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-deep-emerald/60" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a1f15]/80 via-transparent to-deep-emerald/90" />

                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="text-center max-w-3xl px-4">
                        <span className="inline-block mb-4 text-xs tracking-[0.4em] font-medium text-[#D4AF37] uppercase">
                            Got Questions?
                        </span>
                        <h1 className="text-5xl md:text-7xl font-display text-white leading-tight">
                            Frequently Asked<br />
                            <span className="italic font-light text-[#D4AF37]">Questions</span>
                        </h1>
                    </div>
                </div>
            </section>

            {/* FAQ Content */}
            <section className="py-28">
                <div className="max-w-4xl mx-auto px-4 md:px-8">
                    {faqCategories.map((category, catIdx) => (
                        <div key={catIdx} className="mb-16 last:mb-0">
                            <div className="flex items-center gap-3 mb-6">
                                <HelpCircle className="w-5 h-5 text-[#D4AF37]" strokeWidth={1.5} />
                                <h2 className="text-2xl font-display text-deep-emerald">{category.category}</h2>
                            </div>
                            <div className="bg-white rounded-2xl border border-deep-emerald/5 shadow-sm px-6">
                                {category.questions.map((faq, idx) => (
                                    <FAQItem key={idx} question={faq.q} answer={faq.a} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Still Have Questions */}
            <section className="py-20 bg-deep-emerald">
                <div className="max-w-3xl mx-auto px-4 md:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-display text-white mb-4">
                        Still Have Questions?
                    </h2>
                    <p className="text-white/60 font-light mb-8">
                        Our concierge team is available 24/7 to help you plan your perfect Sri Lankan journey.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/contact"
                            className="inline-block px-8 py-3 rounded-full bg-[#D4AF37] text-[#0a1f15] text-sm tracking-[0.15em] font-semibold uppercase hover:bg-[#D4AF37]/90 transition-all shadow-lg"
                        >
                            CONTACT US
                        </Link>
                        <Link
                            href="/inquire"
                            className="inline-block px-8 py-3 rounded-full border-2 border-white/30 text-white text-sm tracking-[0.15em] font-semibold uppercase hover:bg-white/10 transition-all"
                        >
                            SEND AN INQUIRY
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
