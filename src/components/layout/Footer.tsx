import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, Instagram, Facebook, Twitter, ArrowRight } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-deep-emerald text-off-white/80 border-t border-antique-gold/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

                    {/* Brand & Story */}
                    <div className="col-span-1 lg:col-span-1">
                        <div className="mb-6">
                            <Image
                                src="/images/logo.svg"
                                alt="Yatara Ceylon Logo"
                                width={180}
                                height={36}
                                className="object-contain h-9 w-auto brightness-0 invert opacity-90"
                            />
                        </div>
                        <p className="text-sm font-light leading-relaxed mb-6 pe-4">
                            Curators of bespoke Sri Lankan journeys. We synchronize your travel with the authentic heartbeat of Ceylon, delivering uncompromising luxury and profound heritage.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="h-10 w-10 rounded-full border border-antique-gold/30 flex items-center justify-center hover:bg-antique-gold hover:text-deep-emerald transition-all duration-300">
                                <Instagram className="h-4 w-4" />
                            </a>
                            <a href="#" className="h-10 w-10 rounded-full border border-antique-gold/30 flex items-center justify-center hover:bg-antique-gold hover:text-deep-emerald transition-all duration-300">
                                <Facebook className="h-4 w-4" />
                            </a>
                            <a href="#" className="h-10 w-10 rounded-full border border-antique-gold/30 flex items-center justify-center hover:bg-antique-gold hover:text-deep-emerald transition-all duration-300">
                                <Twitter className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    {/* Explore Links */}
                    <div>
                        <h4 className="text-antique-gold font-serif text-lg font-semibold tracking-widest uppercase mb-6">Explore</h4>
                        <ul className="space-y-4">
                            {[
                                { href: '/packages', label: 'The Curated Collection' },
                                { href: '/destinations', label: 'Destinations' },
                                { href: '/build-tour', label: 'Bespoke Planning' },
                                { href: '/vehicles', label: 'Private Transfers' },
                                { href: '/guide', label: 'Sri Lanka Guide' },
                                { href: '/inquire', label: 'Request a Proposal' },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm font-light hover:text-antique-gold tracking-wide transition-colors flex items-center group"
                                    >
                                        <span className="w-0 h-[1px] bg-antique-gold mr-0 group-hover:w-4 group-hover:mr-2 transition-all duration-300"></span>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-antique-gold font-serif text-lg font-semibold tracking-widest uppercase mb-6">Contact</h4>
                        <ul className="space-y-4 font-light text-sm">
                            <li className="flex items-start gap-4">
                                <MapPin className="h-5 w-5 text-antique-gold shrink-0 mt-0.5" strokeWidth={1.5} />
                                <span>142 Sir James Peiris Mawatha,<br />Colombo 02, Sri Lanka</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <Phone className="h-5 w-5 text-antique-gold shrink-0" strokeWidth={1.5} />
                                <span>+94 77 123 4567</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <Mail className="h-5 w-5 text-antique-gold shrink-0" strokeWidth={1.5} />
                                <span>concierge@yataraceylon.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-antique-gold font-serif text-lg font-semibold tracking-widest uppercase mb-6">The Dispatch</h4>
                        <p className="text-sm font-light mb-4 text-off-white/80 leading-relaxed">
                            Subscribe to receive exclusive itineraries and insider access to luxury Ceylon.
                        </p>
                        <form className="relative mt-2">
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="w-full bg-black/20 border border-off-white/20 h-12 pl-4 pr-12 focus:outline-none focus:border-antique-gold focus:ring-1 focus:ring-antique-gold rounded-none text-sm font-light placeholder:text-off-white/40 transition-all"
                                required
                            />
                            <button
                                type="submit"
                                className="absolute right-0 top-0 bottom-0 px-4 text-antique-gold hover:text-off-white hover:bg-antique-gold/20 transition-all duration-300"
                            >
                                <ArrowRight className="h-5 w-5" />
                            </button>
                        </form>
                    </div>

                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-off-white/10 bg-black/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs font-light tracking-wider">
                        &copy; {new Date().getFullYear()} Yatara Ceylon. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-xs font-light tracking-wider">
                        <Link href="#" className="hover:text-antique-gold transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-antique-gold transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
