import Link from 'next/link';
import { Palmtree, Phone, Mail, MapPin } from 'lucide-react';

const quickLinks = [
    { href: '/packages', label: 'Tour Packages' },
    { href: '/destinations', label: 'Destinations' },
    { href: '/build-tour', label: 'Build Your Tour' },
    { href: '/offers', label: 'Offers' },
    { href: '/contact', label: 'Contact Us' },
];

export function Footer() {
    return (
        <footer className="bg-ocean-950 text-ocean-100">
            <div className="section-container py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Palmtree className="h-6 w-6 text-ocean-400" />
                            <span className="font-display text-xl font-bold text-white">
                                Ceylon Escapes
                            </span>
                        </div>
                        <p className="text-ocean-300 text-sm leading-relaxed">
                            Discover the Pearl of the Indian Ocean. We craft unforgettable
                            Sri Lankan experiences with personalized tours, expert guides,
                            and premium service.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-ocean-300 hover:text-white text-sm transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Get in Touch</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm text-ocean-300">
                                <Phone className="h-4 w-4 text-ocean-400 flex-shrink-0" />
                                <span>+94 77 123 4567</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-ocean-300">
                                <Mail className="h-4 w-4 text-ocean-400 flex-shrink-0" />
                                <span>info@ceylonescapes.lk</span>
                            </div>
                            <div className="flex items-start gap-3 text-sm text-ocean-300">
                                <MapPin className="h-4 w-4 text-ocean-400 flex-shrink-0 mt-0.5" />
                                <span>42 Galle Road, Colombo 03, Sri Lanka</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-ocean-800">
                <div className="section-container py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p className="text-xs text-ocean-400">
                        © {new Date().getFullYear()} Ceylon Escapes. All rights reserved.
                    </p>
                    <p className="text-xs text-ocean-500">
                        SLIIT ITP Project | Tour Operator Management System
                    </p>
                </div>
            </div>
        </footer>
    );
}
