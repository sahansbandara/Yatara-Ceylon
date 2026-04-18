'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
        <div className={`relative group border-b border-black/10 transition-colors duration-500 ${isOpen ? 'border-black/30' : 'hover:border-black/20'}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-6 flex items-center text-left focus:outline-none"
            >
                <div className="flex-1 pr-6">
                    <h3 className={`text-[15px] md:text-[17px] font-display transition-colors duration-500 leading-snug tracking-wide ${isOpen ? 'text-[#043927]' : 'text-[#2a2a2a] group-hover:text-black'} font-light`}>
                        {question}
                    </h3>
                </div>

                <div className="shrink-0 relative flex items-center justify-center w-6 h-6 transition-transform duration-500">
                    <div className={`absolute transition-all duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] ${isOpen ? 'rotate-180 opacity-0 scale-50' : 'rotate-0 opacity-100 scale-100'}`}>
                        <Plus className="w-4 h-4 text-black/40 font-light" strokeWidth={1} />
                    </div>
                    <div className={`absolute transition-all duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] ${isOpen ? 'rotate-0 opacity-100 scale-100' : '-rotate-180 opacity-0 scale-50'}`}>
                        <Minus className="w-4 h-4 text-[#043927]" strokeWidth={1} />
                    </div>
                </div>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="pb-8 pr-12 pt-0">
                            <p className="text-[#6a6a6a] font-sans font-light leading-[1.8] text-[13px] md:text-[14px]">
                                {answer}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function FAQPage() {
    return (
        <div className="min-h-screen bg-[#F9F8F6]">
            {/* Hero Section */}
            {/* To update this image realistically using 'generate_image', use a prompt like:
                "A cinematic, high-end photography of a serene Sri Lankan tea plantation or ancient ruins covered in mist at dawn. Luxurious, calming atmosphere, deep rich greens."
             */}
            <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
                <Image
                    src="/images/faq/faq-hero.webp"
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
            <section className="py-20 lg:py-28 relative overflow-hidden font-sans">
                {/* Background Image */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <Image
                        src="/images/backgrounds/elite-bg.webp"
                        alt="Premium Background"
                        fill
                        className="object-cover opacity-30"
                        quality={90}
                    />
                </div>

                <div className="max-w-4xl mx-auto px-4 md:px-8 relative z-10">
                    {faqCategories.map((category, catIdx) => (
                        <div key={catIdx} className="mb-24 lg:mb-32 last:mb-0">
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="mb-8"
                            >
                                <h2 className="text-3xl md:text-4xl font-display text-[#043927] mb-4">
                                    {category.category}
                                </h2>
                                <div className="w-16 h-px bg-[#D4AF37]/50" />
                            </motion.div>
                            <div className="w-full flex flex-col">
                                {category.questions.map((faq, idx) => (
                                    <FAQItem key={idx} question={faq.q} answer={faq.a} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Still Have Questions */}
            <section className="py-20 bg-[#E3EFE9] text-deep-emerald relative overflow-hidden">
                {/* Background Pattern Overlay */}
                <div
                    className="absolute inset-0 z-0 opacity-20 pointer-events-none mix-blend-multiply"
                    style={{
                        backgroundImage: "url('/images/home/curated-bg-pattern.webp')",
                        backgroundSize: '400px',
                        backgroundPosition: 'top left',
                        backgroundRepeat: 'repeat'
                    }}
                />

                <div className="max-w-3xl mx-auto px-4 md:px-8 text-center relative z-10">
                    <h2 className="text-3xl md:text-4xl font-display text-deep-emerald mb-4">
                        Still Have Questions?
                    </h2>
                    <p className="text-deep-emerald/70 font-light mb-8">
                        Our concierge team is available 24/7 to help you plan your perfect Sri Lankan journey.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                        <Link
                            href="/contact"
                            className="inline-block px-8 py-3 rounded-full bg-[#D4AF37] text-[#0a1f15] text-sm tracking-[0.15em] font-semibold uppercase hover:bg-[#D4AF37]/90 transition-all shadow-lg"
                        >
                            CONTACT US
                        </Link>
                        <Link
                            href="/inquire"
                            className="inline-block px-8 py-3 rounded-full border-2 border-deep-emerald/30 text-deep-emerald text-sm tracking-[0.15em] font-semibold uppercase hover:bg-deep-emerald/5 transition-all"
                        >
                            SEND AN INQUIRY
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
