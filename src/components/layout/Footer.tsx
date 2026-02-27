import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, Instagram, Facebook, Twitter, ArrowRight } from 'lucide-react';

export function Footer() {
    return (
        <footer className="relative overflow-hidden">
            {/* Background Image with parallax effect */}
            <div className="absolute inset-0">
                <div
                    className="absolute inset-0 bg-fixed bg-cover bg-center"
                    style={{ backgroundImage: "url('/images/home/footer-bg.png')" }}
                />
                <div className="absolute inset-0 bg-[#051a10]/90" />
            </div>

            <div className="relative z-10">
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
                            <p className="text-sm font-light leading-relaxed mb-6 pe-4 text-white/60">
                                Curators of bespoke Sri Lankan journeys. We synchronize your travel with the authentic heartbeat of Ceylon, delivering uncompromising luxury and profound heritage.
                            </p>
                            <div className="flex gap-3">
                                {[Instagram, Facebook, Twitter].map((Icon, i) => (
                                    <a key={i} href="#" className="h-10 w-10 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:border-[#D4AF37]/50 hover:bg-white/10 transition-all duration-300 group">
                                        <Icon className="h-4 w-4 text-white/50 group-hover:text-[#D4AF37] transition-colors" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Explore Links */}
                        <div>
                            <h4 className="text-[#D4AF37] font-display text-lg font-semibold tracking-widest uppercase mb-6">Explore</h4>
                            <ul className="space-y-4">
                                {[
                                    { href: '/packages', label: 'The Curated Collection' },
                                    { href: '/destinations', label: 'Destinations' },
                                    { href: '/build-tour', label: 'Bespoke Planning' },
                                    { href: '/vehicles', label: 'Private Transfers' },
                                    { href: '/guide', label: 'Sri Lanka Guide' },
                                    { href: '/about', label: 'About Us' },
                                    { href: '/inquire', label: 'Request a Proposal' },
                                ].map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-sm font-light text-white/60 hover:text-[#D4AF37] tracking-wide transition-colors flex items-center group"
                                        >
                                            <span className="w-0 h-[1px] bg-[#D4AF37] mr-0 group-hover:w-4 group-hover:mr-2 transition-all duration-300"></span>
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h4 className="text-[#D4AF37] font-display text-lg font-semibold tracking-widest uppercase mb-6">Contact</h4>
                            <ul className="space-y-4 font-light text-sm text-white/60">
                                <li className="flex items-start gap-4">
                                    <MapPin className="h-5 w-5 text-[#D4AF37] shrink-0 mt-0.5" strokeWidth={1.5} />
                                    <span>142 Sir James Peiris Mawatha,<br />Colombo 02, Sri Lanka</span>
                                </li>
                                <li className="flex items-center gap-4">
                                    <Phone className="h-5 w-5 text-[#D4AF37] shrink-0" strokeWidth={1.5} />
                                    <span>+94 77 123 4567</span>
                                </li>
                                <li className="flex items-center gap-4">
                                    <Mail className="h-5 w-5 text-[#D4AF37] shrink-0" strokeWidth={1.5} />
                                    <span>concierge@yataraceylon.com</span>
                                </li>
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div>
                            <h4 className="text-[#D4AF37] font-display text-lg font-semibold tracking-widest uppercase mb-6">The Dispatch</h4>
                            <p className="text-sm font-light mb-4 text-white/60 leading-relaxed">
                                Subscribe to receive exclusive itineraries and insider access to luxury Ceylon.
                            </p>
                            <form className="relative mt-2">
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    className="w-full h-12 pl-4 pr-12 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-white text-sm font-light placeholder:text-white/25 focus:border-[#D4AF37]/40 focus:outline-none transition-all"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="absolute right-1 top-1 bottom-1 px-3 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-all duration-300 flex items-center justify-center"
                                >
                                    <ArrowRight className="h-5 w-5" />
                                </button>
                            </form>
                        </div>

                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-xs font-light tracking-wider text-white/40">
                            &copy; {new Date().getFullYear()} Yatara Ceylon. All rights reserved.
                        </p>
                        <div className="flex items-center gap-3 text-[10px] tracking-wider text-white/30 uppercase">
                            <span>We Accept:</span>
                            <span className="px-2 py-1 border border-white/10 rounded text-white/40 font-medium">Visa</span>
                            <span className="px-2 py-1 border border-white/10 rounded text-white/40 font-medium">Mastercard</span>
                            <span className="px-2 py-1 border border-white/10 rounded text-white/40 font-medium">Amex</span>
                            <span className="px-2 py-1 border border-white/10 rounded text-white/40 font-medium">PayPal</span>
                        </div>
                        <div className="flex gap-6 text-xs font-light tracking-wider text-white/40">
                            <Link href="/privacy" className="hover:text-[#D4AF37] transition-colors">Privacy Policy</Link>
                            <span className="text-white/20">|</span>
                            <Link href="/terms" className="hover:text-[#D4AF37] transition-colors">Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
