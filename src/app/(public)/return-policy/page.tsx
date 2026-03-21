'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, RotateCcw, ChevronRight, Shield } from 'lucide-react';

export default function ReturnPolicyPage() {
    const lastUpdated = 'March 10, 2026';
    const [activeSection, setActiveSection] = useState('advance-payment');

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
            { rootMargin: '-150px 0px -60% 0px' } // Adjust to trigger earlier when scrolling
        );

        const sections = document.querySelectorAll('section[id]');
        sections.forEach((section) => observer.observe(section));

        return () => observer.disconnect();
    }, []);

    const sidebarLinks = [
        { id: 'advance-payment', label: '1. Advance Payment' },
        { id: 'cancellation-by-customer', label: '2. Cancellation by Customer' },
        { id: 'cancellation-by-yatara', label: '3. Cancellation by Yatara Ceylon' },
        { id: 'modifications', label: '4. Modifications' },
        { id: 'force-majeure', label: '5. Force Majeure' },
        { id: 'refund-processing', label: '6. Refund Processing' },
        { id: 'transport-services', label: '7. Transport Services' },
        { id: 'contact', label: '8. Contact Us' },
    ];

    return (
        <div className="min-h-screen bg-[#FDFBF7] selection:bg-antique-gold/20">
            {/* Cinematic Hero */}
            <div className="relative h-[55vh] min-h-[450px] w-full flex items-center justify-center overflow-hidden">
                <Image
                    src="/images/policies/return-hero.webp"
                    alt="Sri Lankan Tea Estate"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-deep-emerald/70 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-t from-deep-emerald/90 via-deep-emerald/40 to-transparent" />

                <div className="relative z-10 text-center px-4 mt-16 max-w-4xl">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-antique-gold/30 bg-black/10 backdrop-blur-sm mb-6">
                        <RotateCcw className="w-6 h-6 text-antique-gold" strokeWidth={1.5} />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-display text-white mb-4 leading-[1.1]">
                        Return &amp; Refund <span className="italic font-light text-antique-gold">Policy</span>
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-white/60 text-xs tracking-[0.2em] font-nav uppercase">
                        <span>Legal</span>
                        <div className="w-1 h-1 rounded-full bg-antique-gold/50" />
                        <span>Last Updated: {lastUpdated}</span>
                    </div>
                </div>
            </div>

            {/* Split Layout Content */}
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20 md:py-32">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 relative items-start">

                    {/* Sticky Sidebar Navigation (Left Column) */}
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
                                    src="/images/policies/return-badge.webp"
                                    alt="Yatara Ceylon Trust & Security"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-3 left-4 right-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Shield className="w-4 h-4 text-antique-gold" />
                                        <span className="text-white text-xs font-semibold tracking-wider font-nav">GUARANTEE</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4">
                                <p className="text-xs text-gray-500 leading-relaxed font-light">
                                    Yatara Ceylon is a licensed Sri Lankan travel operator. Our policies are crafted to provide absolute clarity, security, and fairness for our distinguished guests.
                                </p>
                            </div>
                        </div>
                    </aside>

                    {/* Main Legal Content (Right Column) */}
                    <main className="flex-1 max-w-4xl space-y-16">

                        <div className="prose prose-lg prose-headings:font-display prose-headings:text-deep-emerald prose-headings:font-normal prose-h2:text-3xl prose-h2:mb-6 prose-p:text-gray-600 prose-p:font-light prose-p:leading-[1.8] prose-p:text-[15px] prose-a:text-antique-gold prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-li:text-gray-600 prose-li:font-light prose-li:text-[15px] marker:text-antique-gold">

                            <p className="lead text-xl text-deep-emerald font-display italic mb-12">
                                We believe in transparency and establishing a foundation of trust before your journey begins. Please review our comprehensive policies regarding payment, cancellation, and refunds.
                            </p>

                            <section id="advance-payment" className="scroll-mt-32">
                                <h2>1. Advance Payment</h2>
                                <p>To secure and confirm your tailormade itinerary, private transfer, or luxury package, Yatara Ceylon requires a <strong>20% non-refundable advance payment</strong> at the time of booking. This advance is immediately utilized to block highly sought-after boutique hotel inventory and commit premium private transport strictly to your dates.</p>
                                <p>The remaining 80% balance is invariably due <strong>14 days prior to your scheduled arrival</strong> in Sri Lanka, or immediately if the booking is made within 14 days of travel. Our operations team will issue a secure payment link via PayHere for this final settlement.</p>
                            </section>

                            <hr className="my-10 border-deep-emerald/5" />

                            <section id="cancellation-by-customer" className="scroll-mt-32">
                                <h2>2. Cancellation by the Customer</h2>
                                <p>We understand that circumstances may force a change of plans. To cancel a confirmed booking, formal written notice must be submitted to our concierge team at <a href="mailto:info@yataraceylon.me">info@yataraceylon.me</a>.</p>
                                <p>The following tiered refund schedule applies to the <em>total value</em> of the booking, based on the notice period provided prior to your arrival date:</p>

                                <div className="not-prose my-8 overflow-hidden rounded-2xl border border-deep-emerald/10 shadow-sm">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-[#0a1f15] text-white font-nav tracking-[0.1em] text-[11px] uppercase">
                                            <tr>
                                                <th className="py-4 px-6 font-medium">Notice Period</th>
                                                <th className="py-4 px-6 font-medium">Refund Eligibility</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-deep-emerald/5 bg-white text-gray-600 font-light">
                                            <tr className="hover:bg-gray-50 transition-colors">
                                                <td className="py-4 px-6 font-medium text-deep-emerald">30+ Days before arrival</td>
                                                <td className="py-4 px-6">Full refund of advance (less 3.5% gateway processing fees)</td>
                                            </tr>
                                            <tr className="hover:bg-gray-50 transition-colors">
                                                <td className="py-4 px-6 font-medium text-deep-emerald">15 – 29 Days before arrival</td>
                                                <td className="py-4 px-6">50% of the advance amount remains refundable</td>
                                            </tr>
                                            <tr className="hover:bg-gray-50 transition-colors">
                                                <td className="py-4 px-6 font-medium text-deep-emerald">7 – 14 Days before arrival</td>
                                                <td className="py-4 px-6">25% of the advance amount remains refundable</td>
                                            </tr>
                                            <tr className="hover:bg-gray-50 transition-colors">
                                                <td className="py-4 px-6 font-medium text-deep-emerald">Less than 7 Days (or no-show)</td>
                                                <td className="py-4 px-6">No refund. 100% cancellation penalty applies.</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <p className="text-sm text-gray-500 italic">Note: Peak season bookings (Dec 15 - Jan 15) may be subject to stricter non-refundable conditions dictated by our hotel partners. You will be explicitly notified of these if they apply to your itinerary.</p>
                            </section>

                            <hr className="my-10 border-deep-emerald/5" />

                            <section id="cancellation-by-yatara" className="scroll-mt-32">
                                <h2>3. Cancellation by Yatara Ceylon</h2>
                                <p>While exceedingly rare, we reserve the right to cancel a booking due to extraordinary operational failures or supplier bankruptcy. Should this occur, you will be offered the choice of:</p>
                                <ul>
                                    <li>A complete, 100% refund of all payments made to Yatara Ceylon.</li>
                                    <li>An alternative journey of identical or superior value.</li>
                                </ul>
                                <p>We do not accept liability for consequential losses you may incur, such as non-refundable international airfares or visa fees.</p>
                            </section>

                            <hr className="my-10 border-deep-emerald/5" />

                            <section id="modifications" className="scroll-mt-32">
                                <h2>4. Modifications to Journey</h2>
                                <p>We welcome itinerary modifications requested <strong>more than 14 days before travel</strong>, and do not charge administrative fees to process them. However, you will be liable for any net increase in cost (such as upgrading a room category or switching to a premium vehicle).</p>
                                <p>Changes requested within 14 days of travel are treated as partial cancellations and re-bookings, inevitably subject to availability and potential penalty charges from our regional suppliers.</p>
                            </section>

                            <hr className="my-10 border-deep-emerald/5" />

                            <section id="force-majeure" className="scroll-mt-32">
                                <h2>5. Force Majeure</h2>
                                <p>In the event of circumstances entirely beyond human control—including but not limited to severe natural disasters, global pandemics, civil unrest, or sovereign government travel restrictions—Yatara Ceylon will waive standard cancellation penalties.</p>
                                <p>Our primary directive in such scenarios is to <strong>rearrange your itinerary or issue an open-ended credit note</strong> for future travel valid for 24 months, rather than issue cash refunds, as funds may already be irretrievably committed to suppliers.</p>
                            </section>

                            <hr className="my-10 border-deep-emerald/5" />

                            <section id="refund-processing" className="scroll-mt-32">
                                <h2>6. Refund Processing Logistics</h2>
                                <p>All approved refunds are strictly processed backward through the original method of transaction (via PayHere to your original credit/debit card). We cannot remit refunds to alternative bank accounts or distinct cards to comply with international Anti-Money Laundering (AML) standards.</p>
                                <p>Please allow <strong>7 to 14 business days</strong> for the funds to reflect in your account, dependent solely on your card issuer's clearing cycle. Gateway processing fees (typically 3.5%) levied by PayHere are generally non-recoverable and non-refundable.</p>
                            </section>

                            <hr className="my-10 border-deep-emerald/5" />

                            <section id="transport-services" className="scroll-mt-32">
                                <h2>7. Transport &amp; Transfer Services</h2>
                                <p>For bookings comprising purely of point-to-point private transfers (e.g., Airport to Galle), cancellation is entirely free of charge until <strong>24 hours prior to the scheduled pick-up time</strong>. Cancellations invoked within 24 hours of pick-up are non-refundable.</p>
                            </section>

                            <hr className="my-10 border-deep-emerald/5" />

                            <section id="contact" className="scroll-mt-32">
                                <h2>8. Contact the Concierge</h2>
                                <p>For all inquiries regarding cancellations, or to formally request a modification or refund, please liaise with your dedicated travel designer or our central desk:</p>
                                <ul className="not-prose space-y-3 mt-4">
                                    <li><a href="mailto:info@yataraceylon.me" className="inline-flex items-center text-sm font-medium text-antique-gold hover:text-deep-emerald transition-colors"><span className="w-16 text-gray-400 font-light">Email</span> info@yataraceylon.me</a></li>
                                    <li><a href="https://wa.me/94704239802" className="inline-flex items-center text-sm font-medium text-antique-gold hover:text-deep-emerald transition-colors"><span className="w-16 text-gray-400 font-light">Phone</span> +94 70 423 9802 (WhatsApp)</a></li>
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
