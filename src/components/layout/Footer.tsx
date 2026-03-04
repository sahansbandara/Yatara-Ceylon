import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, MapPin, Phone, Mail, Instagram, Facebook, Linkedin } from 'lucide-react';

/* ─────────────────────────────────────────────
   Credibility strip shown above the main footer
   ───────────────────────────────────────────── */
function CredibilityStrip() {
    const pillars = [
        { stat: '100 %', label: 'Bespoke Itineraries' },
        { stat: '24 / 7', label: 'On-Ground Support' },
        { stat: '10 +', label: 'Years of Excellence' },
    ];

    return (
        <section className="relative bg-[#07291b] border-b border-white/5">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-10">
                {/* Section label */}
                <p className="text-center text-[10px] tracking-[0.3em] font-nav font-semibold text-antique-gold/70 uppercase mb-8">
                    The Yatara Standard
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                    {pillars.map((p) => (
                        <div key={p.label}>
                            <p className="text-2xl md:text-3xl font-display text-white mb-1">{p.stat}</p>
                            <p className="text-[11px] tracking-[0.15em] font-nav text-white/50 uppercase">{p.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────
   Main Footer
   ───────────────────────────────────────────── */
export function Footer() {
    return (
        <>
            {/* Credibility strip */}
            <CredibilityStrip />

            <footer className="relative overflow-hidden text-white">
                {/* Background image + overlay */}
                <div className="absolute inset-0">
                    <Image
                        src="/images/home/footer-bg.png"
                        alt=""
                        fill
                        className="object-cover"
                        quality={75}
                        priority={false}
                    />
                    {/* dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#07291b]/95 via-[#0a1f15]/90 to-[#0a1f15]/95" />
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 pt-20 pb-10">

                    {/* ── Top grid ── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">

                        {/* ── Brand + Contact column ── */}
                        <div className="lg:col-span-4">
                            <Link href="/" className="inline-block mb-6 text-2xl font-display tracking-widest text-white">
                                YATARA <span className="text-antique-gold ml-1">CEYLON</span>
                            </Link>
                            <p className="text-white/60 font-light text-sm leading-relaxed mb-8 pr-4 max-w-xs">
                                Curators of bespoke Sri Lankan journeys. We synchronize your travel with the authentic heartbeat of Ceylon.
                            </p>

                            {/* Contact details */}
                            <div className="space-y-3">
                                <div className="flex items-start gap-3 text-sm text-white/60">
                                    <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-antique-gold/70" />
                                    <span className="font-light">Colombo, Sri Lanka</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-white/60">
                                    <Phone className="w-4 h-4 shrink-0 text-antique-gold/70" />
                                    <a href="tel:+94112345678" className="font-light hover:text-white transition-colors">
                                        +94 11 234 5678
                                    </a>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-white/60">
                                    <Mail className="w-4 h-4 shrink-0 text-antique-gold/70" />
                                    <a href="mailto:info@yataraceylon.com" className="font-light hover:text-white transition-colors">
                                        info@yataraceylon.com
                                    </a>
                                </div>
                            </div>

                            {/* Social icons */}
                            <div className="flex items-center gap-4 mt-6">
                                <a
                                    href="https://instagram.com/yataraceylon"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Instagram"
                                    className="text-white/40 hover:text-antique-gold transition-colors"
                                >
                                    <Instagram className="w-[18px] h-[18px]" strokeWidth={1.5} />
                                </a>
                                <a
                                    href="https://facebook.com/yataraceylon"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Facebook"
                                    className="text-white/40 hover:text-antique-gold transition-colors"
                                >
                                    <Facebook className="w-[18px] h-[18px]" strokeWidth={1.5} />
                                </a>
                                <a
                                    href="https://linkedin.com/company/yataraceylon"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="LinkedIn"
                                    className="text-white/40 hover:text-antique-gold transition-colors"
                                >
                                    <Linkedin className="w-[18px] h-[18px]" strokeWidth={1.5} />
                                </a>
                            </div>
                        </div>

                        {/* ── Journeys column ── */}
                        <div className="lg:col-span-2">
                            <h4 className="text-[10px] tracking-[0.2em] font-nav font-semibold text-white/40 uppercase mb-6">
                                Journeys
                            </h4>
                            <ul className="space-y-4">
                                <li><Link href="/packages" className="text-sm font-light text-white/70 hover:text-white transition-colors">The Collection</Link></li>
                                <li><Link href="/tours/cultural" className="text-sm font-light text-white/70 hover:text-white transition-colors">Cultural Tours</Link></li>
                                <li><Link href="/tours/wildlife-adventure" className="text-sm font-light text-white/70 hover:text-white transition-colors">Wildlife &amp; Adventure</Link></li>
                                <li><Link href="/tours/experiences" className="text-sm font-light text-white/70 hover:text-white transition-colors">Experiences</Link></li>
                                <li><Link href="/build-tour" className="text-sm font-light text-white/70 hover:text-white transition-colors">Bespoke Planning</Link></li>
                                <li><Link href="/destinations" className="text-sm font-light text-white/70 hover:text-white transition-colors">Destinations</Link></li>
                            </ul>
                        </div>

                        {/* ── Company column ── */}
                        <div className="lg:col-span-2">
                            <h4 className="text-[10px] tracking-[0.2em] font-nav font-semibold text-white/40 uppercase mb-6">
                                Company
                            </h4>
                            <ul className="space-y-4">
                                <li><Link href="/about" className="text-sm font-light text-white/70 hover:text-white transition-colors">Our Story</Link></li>
                                <li><Link href="/about/team" className="text-sm font-light text-white/70 hover:text-white transition-colors">Our Team</Link></li>
                                <li><Link href="/about/sustainability" className="text-sm font-light text-white/70 hover:text-white transition-colors">Sustainability</Link></li>
                                <li><Link href="/services" className="text-sm font-light text-white/70 hover:text-white transition-colors">Services</Link></li>
                                <li><Link href="/mice" className="text-sm font-light text-white/70 hover:text-white transition-colors">MICE &amp; Events</Link></li>
                                <li><Link href="/careers" className="text-sm font-light text-white/70 hover:text-white transition-colors">Careers</Link></li>
                            </ul>
                        </div>

                        {/* ── Newsletter column ── */}
                        <div className="lg:col-span-4">
                            <h4 className="text-[10px] tracking-[0.2em] font-nav font-semibold text-white/40 uppercase mb-6">
                                The Dispatch
                            </h4>
                            <p className="text-sm font-light text-white/60 mb-5 max-w-xs">
                                Subscribe for curated itineraries &amp; insider access to luxury Ceylon.
                            </p>

                            {/* Pill input */}
                            <form className="relative flex items-center max-w-sm">
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    className="w-full rounded-full bg-white/[0.07] border border-white/15 focus:border-antique-gold/60 outline-none py-3 pl-5 pr-12 text-sm font-light transition-all placeholder:text-white/30 focus:bg-white/[0.1]"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-1.5 flex items-center justify-center w-8 h-8 rounded-full bg-antique-gold/20 border border-antique-gold/40 text-antique-gold hover:bg-antique-gold/30 transition-colors"
                                >
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            </form>

                            {/* Quick resources */}
                            <div className="mt-8">
                                <h4 className="text-[10px] tracking-[0.2em] font-nav font-semibold text-white/40 uppercase mb-4">
                                    Resources
                                </h4>
                                <ul className="space-y-3">
                                    <li><Link href="/faq" className="text-sm font-light text-white/70 hover:text-white transition-colors">FAQ</Link></li>
                                    <li><Link href="/news" className="text-sm font-light text-white/70 hover:text-white transition-colors">Travel Bites</Link></li>
                                    <li><Link href="/contact" className="text-sm font-light text-white/70 hover:text-white transition-colors">Contact Us</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* ── Bottom bar ── */}
                    <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
                        {/* Copyright */}
                        <p className="text-[10px] font-nav tracking-widest text-white/40 uppercase">
                            &copy; {new Date().getFullYear()} Yatara Ceylon. All Rights Reserved.
                        </p>

                        {/* Legal links */}
                        <div className="flex items-center gap-6">
                            <Link href="/terms" className="text-[10px] font-nav tracking-widest text-white/40 uppercase hover:text-white/70 transition-colors">
                                Terms &amp; Conditions
                            </Link>
                            <Link href="/privacy" className="text-[10px] font-nav tracking-widest text-white/40 uppercase hover:text-white/70 transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="/sitemap.xml" className="text-[10px] font-nav tracking-widest text-white/40 uppercase hover:text-white/70 transition-colors">
                                Sitemap
                            </Link>
                        </div>

                        {/* Payment logos */}
                        <div className="flex items-center gap-2 text-[10px] font-nav tracking-widest text-white/30 uppercase">
                            <span className="mr-1">We accept</span>
                            <span className="px-2 py-0.5 rounded border border-white/10 text-white/40 text-[9px]">Visa</span>
                            <span className="px-2 py-0.5 rounded border border-white/10 text-white/40 text-[9px]">Mastercard</span>
                            <span className="px-2 py-0.5 rounded border border-white/10 text-white/40 text-[9px]">Amex</span>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
