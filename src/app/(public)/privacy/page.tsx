import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description: 'Privacy policy for Yatara Ceylon — how we collect, use, and protect your personal information.',
};

export default function PrivacyPolicyPage() {
    const lastUpdated = 'March 2026';

    return (
        <div className="min-h-screen bg-off-white">
            {/* Hero */}
            <section className="relative bg-deep-emerald py-20 md:py-28 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a1f15]/90 to-deep-emerald/95" />
                <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 text-center">
                    <ShieldCheck className="w-8 h-8 text-[#D4AF37] mx-auto mb-4" strokeWidth={1.5} />
                    <h1 className="text-4xl md:text-6xl font-display text-white leading-tight mb-3">
                        Privacy <span className="italic font-light text-[#D4AF37]">Policy</span>
                    </h1>
                    <p className="text-white/50 text-sm">Last updated: {lastUpdated}</p>
                </div>
            </section>

            {/* Content */}
            <section className="py-16 md:py-24">
                <div className="max-w-3xl mx-auto px-4 md:px-8 space-y-12">

                    <PolicySection title="1. Introduction">
                        <p>Yatara Ceylon (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is committed to protecting the privacy and security of your personal information. This Privacy Policy explains how we collect, use, and safeguard information when you use our website <strong>yataraceylon.me</strong> and related services.</p>
                    </PolicySection>

                    <PolicySection title="2. Information We Collect">
                        <p>When you make a booking or inquiry, we may collect:</p>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li><strong>Personal details:</strong> Full name, email address, phone number</li>
                            <li><strong>Address information:</strong> Street address, city, country</li>
                            <li><strong>Travel details:</strong> Travel dates, number of passengers, special requirements</li>
                            <li><strong>Account credentials:</strong> Email and password (encrypted) if you create an account</li>
                            <li><strong>Usage data:</strong> Pages visited, browser type, IP address, cookies</li>
                        </ul>
                        <p className="mt-2"><strong>We do NOT collect or store payment card details.</strong> All payments are processed securely through our payment gateway partner, PayHere (payhere.lk), which is PCI-DSS compliant.</p>
                    </PolicySection>

                    <PolicySection title="3. How We Use Your Information">
                        <p>We use your personal information to:</p>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li>Process and manage your travel bookings</li>
                            <li>Communicate with you about your reservations</li>
                            <li>Send booking confirmations, reminders, and itinerary updates</li>
                            <li>Provide customer support and respond to inquiries</li>
                            <li>Improve our website and services</li>
                            <li>Send promotional communications (only with your consent)</li>
                            <li>Comply with legal obligations</li>
                        </ul>
                    </PolicySection>

                    <PolicySection title="4. Payment Processing">
                        <p>Payments are processed by <strong>PayHere (Digital Commerce (Pvt) Ltd)</strong>, a licensed payment gateway in Sri Lanka. When you make a payment:</p>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li>You are redirected to PayHere&apos;s secure checkout page</li>
                            <li>Card details are entered directly on PayHere&apos;s platform</li>
                            <li>We receive only a transaction confirmation — never your card numbers</li>
                            <li>PayHere is certified under PCI-DSS Level 1 standards</li>
                        </ul>
                    </PolicySection>

                    <PolicySection title="5. Cookies &amp; Tracking">
                        <p>Our website uses cookies and similar technologies to:</p>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li><strong>Essential cookies:</strong> Maintain your session and preferences</li>
                            <li><strong>Analytics cookies:</strong> Understand how visitors interact with our site (Google Analytics)</li>
                            <li><strong>Chat widget:</strong> Provide live chat support (Tawk.to)</li>
                        </ul>
                        <p className="mt-2">You can manage cookie preferences through your browser settings.</p>
                    </PolicySection>

                    <PolicySection title="6. Data Sharing">
                        <p>We do <strong>not</strong> sell, rent, or trade your personal information. We may share your information with:</p>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li><strong>Service providers:</strong> Hotels, transport partners, and tour operators necessary to fulfil your booking</li>
                            <li><strong>Payment processor:</strong> PayHere, for payment processing only</li>
                            <li><strong>Legal authorities:</strong> Where required by Sri Lankan law or to protect our legitimate interests</li>
                        </ul>
                    </PolicySection>

                    <PolicySection title="7. Data Security">
                        <p>We implement appropriate technical and organisational measures to protect your data, including:</p>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li>SSL/TLS encryption for all data transmission</li>
                            <li>Encrypted password storage</li>
                            <li>Access controls limiting data access to authorised staff only</li>
                            <li>Regular security reviews of our systems</li>
                        </ul>
                    </PolicySection>

                    <PolicySection title="8. Data Retention">
                        <p>We retain your personal information for as long as necessary to provide services and comply with legal requirements. Booking records are retained for a minimum of <strong>3 years</strong> for accounting and regulatory purposes. You may request earlier deletion of non-essential data.</p>
                    </PolicySection>

                    <PolicySection title="9. Your Rights">
                        <p>You have the right to:</p>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li>Access the personal information we hold about you</li>
                            <li>Request correction of inaccurate data</li>
                            <li>Request deletion of your data (subject to legal obligations)</li>
                            <li>Withdraw consent for marketing communications at any time</li>
                            <li>Lodge a complaint with the relevant data protection authority</li>
                        </ul>
                    </PolicySection>

                    <PolicySection title="10. Third-Party Links">
                        <p>Our website may contain links to third-party websites (e.g. social media, partner hotels). We are not responsible for the privacy practices of these external sites. We encourage you to read their privacy policies.</p>
                    </PolicySection>

                    <PolicySection title="11. Children&apos;s Privacy">
                        <p>Our services are not directed at children under 16. We do not knowingly collect personal information from children. If you believe we have inadvertently collected data from a minor, please contact us immediately.</p>
                    </PolicySection>

                    <PolicySection title="12. Contact Us">
                        <p>For any privacy-related queries or to exercise your data rights, contact us at:</p>
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
