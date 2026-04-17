'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Shield, ChevronRight } from 'lucide-react';

export default function PrivacyPolicyPage() {
    const lastUpdated = 'March 10, 2026';
    const [activeSection, setActiveSection] = useState('information-collection');

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
        { id: 'information-collection', label: '1. Information Collection' },
        { id: 'data-usage', label: '2. Usage of Data' },
        { id: 'payment-security', label: '3. Payment Security' },
        { id: 'data-sharing', label: '4. Third-Party Sharing' },
        { id: 'cookies', label: '5. Cookies & Tracking' },
        { id: 'retention', label: '6. Data Retention' },
        { id: 'your-rights', label: '7. Your Privacy Rights' },
        { id: 'contact', label: '8. Contact the Data Controller' },
    ];

    return (
        <div className="min-h-screen bg-[#FDFBF7] selection:bg-antique-gold/20">
            {/* Cinematic Hero */}
            <div className="relative h-[55vh] min-h-[450px] w-full flex items-center justify-center overflow-hidden">
                <Image
                    src="/images/policies/privacy-hero.webp"
                    alt="Privacy and Security"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-deep-emerald/75 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-t from-deep-emerald/90 via-deep-emerald/50 to-transparent" />

                <div className="relative z-10 text-center px-4 mt-16 max-w-4xl">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-antique-gold/30 bg-black/10 backdrop-blur-sm mb-6">
                        <Shield className="w-6 h-6 text-antique-gold" strokeWidth={1.5} />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-display text-white mb-4 leading-[1.1]">
                        Privacy <span className="italic font-light text-antique-gold">Policy</span>
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-white/60 text-xs tracking-[0.2em] font-nav uppercase">
                        <span>Legal / Data Security</span>
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
                                    src="/images/policies/privacy-badge.webp"
                                    alt="Yatara Ceylon Trust & Security"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-3 left-4 right-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Shield className="w-4 h-4 text-antique-gold" />
                                        <span className="text-white text-xs font-semibold tracking-wider font-nav">CONFIDENTIAL</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4">
                                <p className="text-xs text-gray-500 leading-relaxed font-light">
                                    Your privacy is our highest priority. We employ enterprise-grade security and adhere to strict data protection standards to ensure your information remains completely confidential.
                                </p>
                            </div>
                        </div>
                    </aside>

                    {/* Main Legal Content */}
                    <main className="flex-1 max-w-4xl space-y-16">

                        <div className="prose prose-lg prose-headings:font-display prose-headings:text-deep-emerald prose-headings:font-normal prose-h2:text-3xl prose-h2:mb-6 prose-p:text-gray-600 prose-p:font-light prose-p:leading-[1.8] prose-p:text-[15px] prose-a:text-antique-gold prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-li:text-gray-600 prose-li:font-light prose-li:text-[15px] marker:text-antique-gold">

                            <p className="lead text-xl text-deep-emerald font-display italic mb-12">
                                At Yatara Ceylon, we curate exclusive travel experiences while fiercely protecting the privacy and personal data of our esteemed clientele. This policy outlines how we collect, process, and safeguard your information.
                            </p>

                            <section id="information-collection" className="scroll-mt-32">
                                <h2>1. Information We Collect</h2>
                                <p>To perfectly tailor your journey, we collect essential personal parameters. This is done with your explicit consent when you interact with our concierge, application, or website.</p>
                                <ul>
                                    <li><strong>Identity Data:</strong> Full name, date of birth, passport details, and nationality (required for hotel bookings and transport permits).</li>
                                    <li><strong>Contact Data:</strong> Primary email address, billing address, and direct telephone/WhatsApp numbers.</li>
                                    <li><strong>Preference Data:</strong> Dietary requirements, medical conditions relevant to travel, room preferences, and specific lifestyle requirements to ensure a flawless experience.</li>
                                    <li><strong>Technical Data:</strong> IP address, browser type, device identifiers, and anonymous usage telemetry collected via our digital platforms.</li>
                                </ul>
                            </section>

                            <hr className="my-10 border-deep-emerald/5" />

                            <section id="data-usage" className="scroll-mt-32">
                                <h2>2. How We Use Your Data</h2>
                                <p>We process your data exclusively to deliver our luxury services and maintain our high standards of hospitality. Specifically, your data is utilized to:</p>
                                <ul>
                                    <li>Fulfill your booking, secure accommodations, and arrange ground transportation.</li>
                                    <li>Communicate itinerary updates, payment links, and critical journey advisories.</li>
                                    <li>Personalize your experience (e.g., ensuring dietary needs are met at all partner restaurants).</li>
                                    <li>Comply with statutory obligations under Sri Lankan law regarding foreign tourists.</li>
                                </ul>
                            </section>

                            <hr className="my-10 border-deep-emerald/5" />

                            <section id="payment-security" className="scroll-mt-32">
                                <h2>3. Payment Security &amp; PayHere</h2>
                                <p>Yatara Ceylon operates a strict <strong>Zero-Knowledge Payment Protocol</strong>. We do not digitally collect, process, or store your credit card numbers, CVV codes, or banking passwords on our servers.</p>
                                <p>All financial transactions are seamlessly securely routed to <strong>PayHere</strong>, a Central Bank of Sri Lanka approved and PCI-DSS compliant payment gateway. When you make a payment, you interact directly with sophisticated banking infrastructure designed to protect your financial assets.</p>
                            </section>

                            <hr className="my-10 border-deep-emerald/5" />

                            <section id="data-sharing" className="scroll-mt-32">
                                <h2>4. Third-Party Sharing</h2>
                                <p>We operate under strict confidentiality. We do not sell, trade, or recklessly share your data with advertisers. However, to execute your journey, necessary operational data is securely transmitted to our verified partners on a <em>need-to-know</em> basis:</p>
                                <ul>
                                    <li><strong>Boutique Hotels &amp; Villas:</strong> Names, passport details, and dietary preferences for check-in and bespoke service.</li>
                                    <li><strong>Private Chauffeurs:</strong> Contact numbers and precise itinerary details to ensure seamless transfers.</li>
                                    <li><strong>Legal Authorities:</strong> If legally compelled by a court of law or government mandate within the Democratic Socialist Republic of Sri Lanka.</li>
                                </ul>
                            </section>

                            <hr className="my-10 border-deep-emerald/5" />

                            <section id="cookies" className="scroll-mt-32">
                                <h2>5. Cookies &amp; Tracking Technology</h2>
                                <p>Our luxury digital platform employs minimal cookies to ensure technical functionality and observe aggregate user interactions. We use these purely to refine our website's performance and design. You retain the absolute right to configure your browser to decline all cookies, though this may restrict certain bespoke features of our site.</p>
                            </section>

                            <hr className="my-10 border-deep-emerald/5" />

                            <section id="retention" className="scroll-mt-32">
                                <h2>6. Data Retention Protocols</h2>
                                <p>Your personal data is retained only for the duration required to fulfill the purposes detailed in this policy, including post-journey support and satisfying imperative legal, accounting, or reporting requirements. Standard financial transaction records are retained for a stipulated period of seven years as per corporate law.</p>
                            </section>

                            <hr className="my-10 border-deep-emerald/5" />

                            <section id="your-rights" className="scroll-mt-32">
                                <h2>7. Your Privacy Rights</h2>
                                <p>We recognize and respect global data protection standards, extending the following rights to our international clientele:</p>
                                <ul>
                                    <li><strong>The Right to Access:</strong> You may request a comprehensive dossier of the personal data we hold associated with you.</li>
                                    <li><strong>The Right to Rectification:</strong> You may instantaneously request the correction of any inaccurate or incomplete data.</li>
                                    <li><strong>The Right to Erasure:</strong> Also known as "the right to be forgotten", you may request the deletion of your personal data, subject strictly to our overriding legal retention obligations.</li>
                                </ul>
                            </section>

                            <hr className="my-10 border-deep-emerald/5" />

                            <section id="contact" className="scroll-mt-32">
                                <h2>8. Contact the Data Controller</h2>
                                <p>For all inquiries, formal requests concerning your data, or to enact your privacy rights, please contact our dedicated data privacy office:</p>
                                <ul className="not-prose space-y-3 mt-4">
                                    <li><a href="mailto:info@yataraceylon.me" className="inline-flex items-center text-sm font-medium text-antique-gold hover:text-deep-emerald transition-colors"><span className="w-16 text-gray-400 font-light">Email</span> info@yataraceylon.me</a></li>
                                    <li><span className="inline-flex items-center text-sm font-medium text-gray-600"><span className="w-16 text-gray-400 font-light">Address</span> Yatara Ceylon Headquarters, Colombo, Sri Lanka</span></li>
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
