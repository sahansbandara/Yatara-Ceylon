import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, RotateCcw } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Return & Refund Policy',
    description: 'Return, cancellation and refund policy for Yatara Ceylon travel bookings.',
};

export default function ReturnPolicyPage() {
    const lastUpdated = 'March 2026';

    return (
        <div className="min-h-screen bg-off-white">
            {/* Hero */}
            <section className="relative bg-deep-emerald py-20 md:py-28 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a1f15]/90 to-deep-emerald/95" />
                <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 text-center">
                    <RotateCcw className="w-8 h-8 text-[#D4AF37] mx-auto mb-4" strokeWidth={1.5} />
                    <h1 className="text-4xl md:text-6xl font-display text-white leading-tight mb-3">
                        Return &amp; <span className="italic font-light text-[#D4AF37]">Refund Policy</span>
                    </h1>
                    <p className="text-white/50 text-sm">Last updated: {lastUpdated}</p>
                </div>
            </section>

            {/* Content */}
            <section className="py-16 md:py-24">
                <div className="max-w-3xl mx-auto px-4 md:px-8 space-y-12">

                    <PolicySection title="1. Advance Payment">
                        <p>All bookings require a <strong>20% advance payment</strong> to confirm your reservation. This advance is processed securely through our payment partner, PayHere.</p>
                        <p>The remaining balance (80%) is due <strong>prior to the commencement of your journey</strong>, unless otherwise agreed in writing.</p>
                    </PolicySection>

                    <PolicySection title="2. Cancellation by the Customer">
                        <p>If you wish to cancel your booking, the following refund schedule applies based on the notice given before your scheduled departure date:</p>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm border-collapse mt-2">
                                <thead>
                                    <tr className="bg-deep-emerald/5">
                                        <th className="text-left py-3 px-4 font-semibold text-deep-emerald border border-deep-emerald/10">Notice Period</th>
                                        <th className="text-left py-3 px-4 font-semibold text-deep-emerald border border-deep-emerald/10">Refund</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-600">
                                    <tr><td className="py-3 px-4 border border-deep-emerald/10">30+ days before departure</td><td className="py-3 px-4 border border-deep-emerald/10">Full refund of advance (minus processing fees)</td></tr>
                                    <tr className="bg-deep-emerald/[0.02]"><td className="py-3 px-4 border border-deep-emerald/10">15–29 days before departure</td><td className="py-3 px-4 border border-deep-emerald/10">50% of advance refunded</td></tr>
                                    <tr><td className="py-3 px-4 border border-deep-emerald/10">7–14 days before departure</td><td className="py-3 px-4 border border-deep-emerald/10">25% of advance refunded</td></tr>
                                    <tr className="bg-deep-emerald/[0.02]"><td className="py-3 px-4 border border-deep-emerald/10">Less than 7 days</td><td className="py-3 px-4 border border-deep-emerald/10">No refund</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="text-sm text-gray-400 mt-2">All cancellations must be submitted in writing via email to <a href="mailto:info@yataraceylon.com" className="text-[#D4AF37] underline">info@yataraceylon.com</a>.</p>
                    </PolicySection>

                    <PolicySection title="3. Cancellation by Yatara Ceylon">
                        <p>In the unlikely event that we need to cancel a booking, we will offer you the choice of:</p>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li>A full refund of all payments made, or</li>
                            <li>An alternative journey of equivalent value</li>
                        </ul>
                    </PolicySection>

                    <PolicySection title="4. Modifications">
                        <p>Booking modifications requested <strong>more than 14 days before travel</strong> are generally accommodated at no additional charge, subject to availability. Changes requested within 14 days of travel may incur supplementary costs.</p>
                    </PolicySection>

                    <PolicySection title="5. Force Majeure">
                        <p>In the event of circumstances beyond our control — including but not limited to natural disasters, pandemics, civil unrest, or government travel restrictions — Yatara Ceylon will work with you to rearrange your itinerary or issue a credit for future travel. Standard cancellation penalties will be waived in such cases.</p>
                    </PolicySection>

                    <PolicySection title="6. Refund Processing">
                        <p>Approved refunds will be processed within <strong>7–14 business days</strong> to the original payment method. PayHere processing fees (if any) are non-refundable.</p>
                    </PolicySection>

                    <PolicySection title="7. Transport &amp; Transfer Services">
                        <p>Private transfers and vehicle hire services can be cancelled free of charge up to <strong>24 hours before the scheduled pick-up time</strong>. Cancellations within 24 hours are non-refundable.</p>
                    </PolicySection>

                    <PolicySection title="8. Contact Us">
                        <p>For cancellation or refund requests, please contact us:</p>
                        <ul className="space-y-1 text-gray-600">
                            <li>Email: <a href="mailto:info@yataraceylon.com" className="text-[#D4AF37] underline">info@yataraceylon.com</a></li>
                            <li>WhatsApp: <a href="https://wa.me/94704239802" className="text-[#D4AF37] underline">+94 70 423 9802</a></li>
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
