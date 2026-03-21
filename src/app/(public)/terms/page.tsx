'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Scale, ChevronRight } from 'lucide-react';

export default function TermsPage() {
    const lastUpdated = 'March 10, 2026';
    const [activeSection, setActiveSection] = useState('acceptance');

    // Smooth scroll to section
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const y = element.getBoundingClientRect().top + window.scrollY - 120;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    // Update active section on scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { rootMargin: '-150px 0px -60% 0px' }
        );

        const sections = document.querySelectorAll('section[id]');
        sections.forEach((section) => observer.observe(section));

        return () => observer.disconnect();
    }, []);

    const sidebarLinks = [
        { id: 'acceptance', label: '1. Acceptance of Terms' },
        { id: 'booking-contract', label: '2. The Booking Contract' },
        { id: 'pricing-payment', label: '3. Pricing & Payment' },
        { id: 'insurance', label: '4. Travel Insurance' },
        { id: 'liability', label: '5. Limitation of Liability' },
        { id: 'intellectual-property', label: '6. Intellectual Property' },
        { id: 'governing-law', label: '7. Governing Law' },
        { id: 'contact', label: '8. Legal Contact' },
    ];

    return (
        <div className="min-h-screen bg-[#FDFBF7] selection:bg-antique-gold/20">
            {/* Cinematic Hero */}
            <div className="relative h-[55vh] min-h-[450px] w-full flex items-center justify-center overflow-hidden">
                <Image
                    src="/images/policies/terms-hero.webp"
                    alt="Heritage Train in Sri Lanka"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-deep-emerald/75 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-t from-deep-emerald/90 via-deep-emerald/50 to-transparent" />

                <div className="relative z-10 text-center px-4 mt-16 max-w-4xl">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-antique-gold/30 bg-black/10 backdrop-blur-sm mb-6">
                        <Scale className="w-6 h-6 text-antique-gold" strokeWidth={1.5} />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-display text-white mb-4 leading-[1.1]">
                        Terms &amp; <span className="italic font-light text-antique-gold">Conditions</span>
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-white/60 text-xs tracking-[0.2em] font-nav uppercase">
                        <span>Legal / Corporate Doctrine</span>
                        <div className="w-1 h-1 rounded-full bg-antique-gold/50" />
                        <span>Last Updated: {lastUpdated}</span>
                    </div>
                </div>
            </div>

            {/* Split Layout Content */}
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20 md:py-32">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 relative items-start">

                    {/* Sticky Sidebar Navigation */}
                    <aside className="hidden lg:block w-72 shrink-0 sticky top-32">
                        <div className="pb-6 border-b border-deep-emerald/10 mb-6">
                            <h3 className="text-[10px] tracking-[0.25em] font-nav font-semibold text-deep-emerald uppercase">
                                Table of Contents
                            </h3>
                        </div>
                        <nav className="space-y-1">
                            {sidebarLinks.map((link) => (
                                <button
                                    key={link.id}
                                    onClick={() => scrollToSection(link.id)}
                                    className={`w-full flex items-center justify-between py-2.5 px-3 rounded-xl text-sm transition-all duration-300 ${activeSection === link.id
                                        ? 'bg-white/40 border border-white/60 shadow-[0_4px_12px_rgba(0,0,0,0.05)] backdrop-blur-md text-deep-emerald font-medium relative overflow-hidden'
                                        : 'text-gray-500 hover:bg-white/50 hover:text-deep-emerald border border-transparent'
                                        }`}
                                >
                                    {activeSection === link.id && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/50 to-white/0 translate-x-[-100%] animate-[shimmer_2s_infinite]" />
                                    )}
                                    <span className={`font-light tracking-wide relative z-10 ${activeSection === link.id ? 'font-medium' : ''}`}>{link.label}</span>
                                    {activeSection === link.id && <ChevronRight className="w-3.5 h-3.5 text-antique-gold relative z-10" />}
                                </button>
                            ))}
                        </nav>

                        {/* Elite Trust Badge Image */}
                        <div className="mt-12 rounded-2xl overflow-hidden border border-deep-emerald/10 bg-white/50 backdrop-blur-sm shadow-sm relative group">
                            <div className="relative h-40 w-full">
                                <Image
                                    src="/images/policies/terms-badge.webp"
                                    alt="Yatara Ceylon Legal Commitment"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-3 left-4 right-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Scale className="w-4 h-4 text-antique-gold" />
                                        <span className="text-white text-xs font-semibold tracking-wider font-nav">LEGAL BASIS</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4">
                                <p className="text-xs text-gray-500 leading-relaxed font-light">
                                    These terms establish the legal foundation of our commitment to you, ensuring a seamless, prestigious, and legally protected travel experience.
                                </p>
                            </div>
                        </div>
                    </aside>

                    {/* Main Legal Content */}
                    <main className="flex-1 max-w-4xl space-y-16">

                        <div className="prose prose-lg prose-headings:font-display prose-headings:text-deep-emerald prose-headings:font-normal prose-h2:text-3xl prose-h2:mb-6 prose-p:text-gray-600 prose-p:font-light prose-p:leading-[1.8] prose-p:text-[15px] prose-a:text-antique-gold prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-li:text-gray-600 prose-li:font-light prose-li:text-[15px] marker:text-antique-gold">

                            <p className="lead text-xl text-deep-emerald font-display italic mb-12">
                                Welcome to Yatara Ceylon. By accessing our platform and engaging our luxury travel design services, you enter into a binding agreement subject to the following terms.
                            </p>

                            <section id="acceptance" className="scroll-mt-32">
                                <h2>1. Acceptance of Terms</h2>
                                <p>By utilizing the <strong>yataraceylon.me</strong> website, creating a client portfolio account, or remitting a booking deposit, you unequivocally agree to be bound by these Terms and Conditions. Disagreement with any stipulation herein means you must refrain from using our services.</p>
                            </section>

                            <hr className="my-10 border-deep-emerald/5" />

                            <section id="booking-contract" className="scroll-mt-32">
                                <h2>2. The Booking Contract</h2>
                                <p>A formal, legally binding contract between you (the Lead Passenger) and Yatara Ceylon is initiated only when we issue a definitive Booking Confirmation Portfolio and the initial 20% advance payment has successfully cleared into our accounts.</p>
                                <p>The Lead Passenger assumes full financial and communicative responsibility on behalf of all individuals named within the travel itinerary, regardless of age.</p>
                            </section>

                            <hr className="my-10 border-deep-emerald/5" />

                            <section id="pricing-payment" className="scroll-mt-32">
                                <h2>3. Pricing &amp; Payment Mechanics</h2>
                                <p>All quotations are meticulously calculated in United States Dollars (USD) unless explicitly stated otherwise. We guarantee to honor the localized price quoted on your accepted itinerary, shielding you from subsequent currency market fluctuations.</p>
                                <ul>
                                    <li><strong>The Gateway:</strong> All remote payments must be executed via our mandated payment gateway, <strong>PayHere</strong>.</li>
                                    <li><strong>Late Settlements:</strong> Failure to remit the finalized 80% balance 14 days prior to arrival empowers Yatara Ceylon to unilaterally cancel the booking, treating it as a standard customer cancellation under our <Link href="/return-policy">Return Policy</Link>.</li>
                                </ul>
                            </section>

                            <hr className="my-10 border-deep-emerald/5" />

                            <section id="insurance" className="scroll-mt-32">
                                <h2>4. Travel Insurance Requirements</h2>
                                <p>We maintain a stringent policy that comprehensive travel insurance is <strong>mandatory</strong> for all our guests. This coverage must encompass, at minimum: personal injury, medical expenses, emergency repatriation, and loss of luggage.</p>
                                <p>Yatara Ceylon accepts zero financial culpability for expenses or losses resulting from your failure to procure adequate insurance coverage.</p>
                            </section>

                            <hr className="my-10 border-deep-emerald/5" />

                            <section id="liability" className="scroll-mt-32">
                                <h2>5. Limitation of Liability</h2>
                                <p>Yatara Ceylon acts exclusively as an elite coordinating agent. We curate and contract third-party service providers (boutique hotels, private rail operators, regional aviation, specialized guides) who are independent contractors.</p>
                                <p>Consequently, we shall not be held liable for personal injury, illness, property damage, or delays caused by the negligence or default of these independent operators. Our maximum aggregate liability, in the highly improbable event of a proven organizational failure on our part, is strictly capped at the total amount paid to us for the relevant booking.</p>
                            </section>

                            <hr className="my-10 border-deep-emerald/5" />

                            <section id="intellectual-property" className="scroll-mt-32">
                                <h2>6. Intellectual Property Rights</h2>
                                <p>The entirely of the content presented on <strong>yataraceylon.me</strong>—including but not limited to the brand marque, aesthetic design, cinematic photography, proprietary tour itineraries, and written copy—is the exclusive intellectual property of Yatara Ceylon. Unauthorized commercial reproduction, distribution, or derivative exploitation is explicitly prohibited and legally actionable.</p>
                            </section>

                            <hr className="my-10 border-deep-emerald/5" />

                            <section id="governing-law" className="scroll-mt-32">
                                <h2>7. Governing Law &amp; Jurisdiction</h2>
                                <p>These terms, and any dispute or claim arising out of or in connection with them (including non-contractual disputes or claims), shall be governed by and decisively construed in accordance with the laws of the Democratic Socialist Republic of Sri Lanka.</p>
                                <p>Both parties agree to submit to the exclusive jurisdiction of the Commercial High Court of Colombo, Sri Lanka.</p>
                            </section>

                            <hr className="my-10 border-deep-emerald/5" />

                            <section id="contact" className="scroll-mt-32">
                                <h2>8. Legal Contact</h2>
                                <p>For corporate, legal, or partnership inquiries concerning these terms, direct communications to our executive office:</p>
                                <ul className="not-prose space-y-3 mt-4">
                                    <li><a href="mailto:info@yataraceylon.me" className="inline-flex items-center text-sm font-medium text-antique-gold hover:text-deep-emerald transition-colors"><span className="w-16 text-gray-400 font-light">Email</span> info@yataraceylon.me</a></li>
                                    <li><span className="inline-flex items-center text-sm font-medium text-gray-600"><span className="w-16 text-gray-400 font-light">Entity</span> Yatara Ceylon Limited</span></li>
                                </ul>
                            </section>

                        </div>

                        {/* Back to Home CTA */}
                        <div className="pt-12 border-t border-deep-emerald/10 mt-16">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white border border-deep-emerald/10 text-sm font-medium text-deep-emerald hover:bg-deep-emerald hover:text-antique-gold hover:border-deep-emerald transition-all duration-300 shadow-sm"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Return to Homepage
                            </Link>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
