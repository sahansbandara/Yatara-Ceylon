import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Terms & Conditions',
    description: 'Terms and conditions for using Yatara Ceylon travel services and website.',
};

export default function TermsPage() {
    const lastUpdated = 'March 2026';

    return (
        <div className="min-h-screen bg-off-white">
            {/* Hero */}
            <section className="relative bg-deep-emerald py-20 md:py-28 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a1f15]/90 to-deep-emerald/95" />
                <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 text-center">
                    <FileText className="w-8 h-8 text-[#D4AF37] mx-auto mb-4" strokeWidth={1.5} />
                    <h1 className="text-4xl md:text-6xl font-display text-white leading-tight mb-3">
                        Terms &amp; <span className="italic font-light text-[#D4AF37]">Conditions</span>
                    </h1>
                    <p className="text-white/50 text-sm">Last updated: {lastUpdated}</p>
                </div>
            </section>

            {/* Content */}
            <section className="py-16 md:py-24">
                <div className="max-w-3xl mx-auto px-4 md:px-8 space-y-12">

                    <PolicySection title="1. Acceptance of Terms">
                        <p>By accessing or using the Yatara Ceylon website (<strong>yataraceylon.me</strong>) and services, you agree to be bound by these Terms &amp; Conditions. If you do not agree, please do not use our services.</p>
                    </PolicySection>

                    <PolicySection title="2. About Us">
                        <p>Yatara Ceylon is a Sri Lankan travel and tour operator providing curated travel experiences, private transfers, bespoke tour planning, and MICE services. We are licensed by the Sri Lanka Tourism Development Authority (SLTDA).</p>
                    </PolicySection>

                    <PolicySection title="3. Booking &amp; Reservations">
                        <ul className="list-disc list-inside space-y-2 text-gray-600">
                            <li>A booking is confirmed once a <strong>20% advance payment</strong> is successfully processed through our payment gateway (PayHere).</li>
                            <li>The remaining <strong>80% balance</strong> must be settled before the commencement of your journey, unless otherwise agreed.</li>
                            <li>All prices are quoted in <strong>Sri Lankan Rupees (LKR)</strong> unless otherwise specified. Currency conversions are for indicative purposes only.</li>
                            <li>We reserve the right to adjust prices due to currency fluctuations, fuel surcharges, or government tax changes — you will be notified before any adjustments.</li>
                        </ul>
                    </PolicySection>

                    <PolicySection title="4. Payment">
                        <ul className="list-disc list-inside space-y-2 text-gray-600">
                            <li>Payments are processed securely through <strong>PayHere</strong> (Digital Commerce (Pvt) Ltd), a licensed Sri Lankan payment gateway.</li>
                            <li>We accept <strong>Visa, Mastercard, and local bank payments</strong> through PayHere.</li>
                            <li>Yatara Ceylon does not store your credit/debit card details. All payment data is handled exclusively by PayHere in compliance with PCI-DSS standards.</li>
                            <li>By making a payment, you confirm that you are the authorised cardholder or have the cardholder&apos;s permission.</li>
                        </ul>
                    </PolicySection>

                    <PolicySection title="5. Cancellation &amp; Refunds">
                        <p>Cancellations and refunds are governed by our <Link href="/return-policy" className="text-[#D4AF37] underline">Return &amp; Refund Policy</Link>. Key points:</p>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li>30+ days notice: Full advance refund (minus processing fees)</li>
                            <li>15–29 days: 50% refund</li>
                            <li>7–14 days: 25% refund</li>
                            <li>Less than 7 days: No refund</li>
                        </ul>
                    </PolicySection>

                    <PolicySection title="6. Itinerary &amp; Services">
                        <ul className="list-disc list-inside space-y-2 text-gray-600">
                            <li>We make every effort to deliver itineraries as described. However, schedules may be adjusted due to weather, road conditions, site closures, or other circumstances beyond our control.</li>
                            <li>Hotel substitutions of <strong>equivalent or higher standard</strong> may be made when a listed property is unavailable.</li>
                            <li>Entrance fees to national parks, heritage sites, and other attractions are included only where expressly stated in the itinerary.</li>
                        </ul>
                    </PolicySection>

                    <PolicySection title="7. Passenger Responsibilities">
                        <ul className="list-disc list-inside space-y-2 text-gray-600">
                            <li>You are responsible for ensuring valid passports, visas (including the Sri Lanka ETA), and travel insurance.</li>
                            <li>You must follow all local laws and regulations, and respect cultural customs at religious sites.</li>
                            <li>We are not liable for losses arising from your failure to carry appropriate documentation.</li>
                        </ul>
                    </PolicySection>

                    <PolicySection title="8. Liability">
                        <ul className="list-disc list-inside space-y-2 text-gray-600">
                            <li>Yatara Ceylon acts as an intermediary for hotels, transport, and activity providers. Liability for third-party services is limited to the terms of our agreements with those providers.</li>
                            <li>We shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services.</li>
                            <li>Our total liability for any claim shall not exceed the total value of the booking in question.</li>
                            <li>We strongly recommend that all travellers purchase comprehensive travel insurance covering medical emergencies, trip cancellation, and personal belongings.</li>
                        </ul>
                    </PolicySection>

                    <PolicySection title="9. Intellectual Property">
                        <p>All content on this website — including text, photographs, logos, design, and code — is the property of Yatara Ceylon and protected by Sri Lankan and international copyright laws. You may not reproduce, distribute, or use any content without our prior written consent.</p>
                    </PolicySection>

                    <PolicySection title="10. User Accounts">
                        <ul className="list-disc list-inside space-y-2 text-gray-600">
                            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                            <li>You agree to provide accurate information when creating an account or making a booking.</li>
                            <li>We reserve the right to suspend or terminate accounts that violate these terms.</li>
                        </ul>
                    </PolicySection>

                    <PolicySection title="11. Privacy">
                        <p>Your use of our services is also governed by our <Link href="/privacy" className="text-[#D4AF37] underline">Privacy Policy</Link>, which describes how we collect, use, and protect your personal information.</p>
                    </PolicySection>

                    <PolicySection title="12. Governing Law">
                        <p>These Terms &amp; Conditions are governed by and construed in accordance with the laws of the <strong>Democratic Socialist Republic of Sri Lanka</strong>. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of Sri Lanka.</p>
                    </PolicySection>

                    <PolicySection title="13. Changes to Terms">
                        <p>We may update these Terms &amp; Conditions from time to time. Changes will be posted on this page with an updated revision date. Your continued use of the website after changes constitutes acceptance of the revised terms.</p>
                    </PolicySection>

                    <PolicySection title="14. Contact Us">
                        <p>For questions about these terms, please contact us:</p>
                        <ul className="space-y-1 text-gray-600">
                            <li>Email: <a href="mailto:info@yataraceylon.com" className="text-[#D4AF37] underline">info@yataraceylon.com</a></li>
                            <li>WhatsApp: <a href="https://wa.me/94704239802" className="text-[#D4AF37] underline">+94 70 423 9802</a></li>
                            <li>Address: Colombo, Sri Lanka</li>
                        </ul>
                    </PolicySection>

                    {/* Back */}
                    <div className="pt-8 border-t border-deep-emerald/10">
                        <Link href="/" className="inline-flex items-center gap-2 text-sm text-deep-emerald hover:text-[#D4AF37] transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Back to Home
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

function PolicySection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div>
            <h2 className="text-xl md:text-2xl font-display text-deep-emerald mb-4">{title}</h2>
            <div className="space-y-3 text-gray-600 font-light text-[15px] leading-relaxed">
                {children}
            </div>
        </div>
    );
}
