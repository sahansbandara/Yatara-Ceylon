import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, MapPin, Phone, Mail, Instagram, Facebook, Linkedin, Youtube, MessageCircle, Shield, Award, Globe } from 'lucide-react';

/* ─────────────────────────────────────────────
   Trust & Prestige Strip — replaces old CredibilityStrip
   ───────────────────────────────────────────── */
function TrustStrip() {
    const pillars = [
        { stat: '100 %', label: 'Bespoke Itineraries' },
        { stat: '24 / 7', label: 'On-Ground Support' },
        { stat: '10 +', label: 'Years of Excellence' },
    ];

    const credentials = [
        { icon: Shield, label: 'SLTDA Licensed' },
        { icon: Award, label: 'SLAITO Member' },
        { icon: Globe, label: 'PATA Affiliate' },
    ];

    return (
        <section className="relative border-b border-white/[0.06] overflow-hidden">
            {/* Elite Background Image */}
            <div className="absolute inset-0 pointer-events-none">
                <Image
                    src="/images/home/stats-bg-elite.webp"
                    alt=""
                    fill
                    className="object-cover opacity-80"
                    quality={90}
                    sizes="100vw"
                />
                {/* Dark overlay to ensure text readability & blend with page */}
                <div className="absolute inset-0 bg-[#061f14]/40" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#061f14] via-transparent to-[#061f14] opacity-80" />
            </div>

            <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 py-7 text-shadow-sm">
                {/* Concierge promise */}
                <p className="text-center text-[10px] tracking-[0.35em] font-nav font-semibold text-antique-gold/80 uppercase mb-6">
                    One Specialist · End-to-End Execution
                </p>

                {/* Stat pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center mb-6">
                    {pillars.map((p) => (
                        <div key={p.label}>
                            <p className="text-2xl md:text-3xl font-display text-white mb-1">{p.stat}</p>
                            <p className="text-[10px] tracking-[0.18em] font-nav text-white/50 uppercase">{p.label}</p>
                        </div>
                    ))}
                </div>

                {/* Gold divider */}
                <div className="w-24 h-px bg-gradient-to-r from-transparent via-antique-gold/40 to-transparent mx-auto mb-5" />

                {/* Credentials row */}
                <div className="flex items-center justify-center gap-8 md:gap-12 flex-wrap">
                    <span className="text-[9px] tracking-[0.25em] font-nav text-white/30 uppercase">Member of</span>
                    {credentials.map((c) => (
                        <div key={c.label} className="flex items-center gap-2 text-white/45 hover:text-white/65 transition-colors">
                            <c.icon className="w-4 h-4 text-antique-gold/50" strokeWidth={1.5} />
                            <span className="text-[10px] tracking-[0.12em] font-nav uppercase">{c.label}</span>
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
            {/* Trust & prestige strip */}
            <TrustStrip />

            <footer className="relative overflow-hidden text-white">
                {/* Cinematic background image + premium overlay */}
                <div className="absolute inset-0">
                    {/* Desktop image */}
                    <Image
                        src="/images/home/footer-cinematic.webp"
                        alt=""
                        fill
                        className="object-cover hidden md:block"
                        quality={85}
                        priority={true}
                        sizes="100vw"
                    />
                    {/* Mobile image */}
                    <Image
                        src="/images/home/footer-cinematic-mobile.webp"
                        alt=""
                        fill
                        className="object-cover md:hidden"
                        quality={80}
                        priority={true}
                        sizes="100vw"
                    />
                    {/* Minimal overlay to let the already dark image shine through completely */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#07291b]/20 via-transparent to-[#07291b]/40" />
                    {/* Subtle vignette */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
                </div>

                {/* Content with subtle glass blur for readability */}
                <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 pt-12 pb-8 backdrop-blur-[1px]">

                    {/* Elite Separation Line */}
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-antique-gold/60 to-transparent mx-auto mb-12 shadow-[0_0_8px_rgba(212,175,55,0.3)]" />

                    {/* ── Top grid ── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-10">

                        {/* ── Brand + Contact column ── */}
                        <div className="lg:col-span-4">
                            <Link href="/" className="inline-block mb-4 text-2xl font-display tracking-widest text-white">
                                YATARA <span className="text-antique-gold ml-1">CEYLON</span>
                            </Link>
                            <p className="text-white/70 font-light text-sm leading-relaxed mb-6 pr-4 max-w-xs">
                                Curators of bespoke Sri Lankan journeys. We synchronize your travel with the authentic heartbeat of Ceylon.
                            </p>

                            {/* Contact details */}
                            <div className="space-y-3">
                                <div className="flex items-start gap-3 text-sm text-white/70">
                                    <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-antique-gold/70" />
                                    <span className="font-light">Colombo, Sri Lanka</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-white/70">
                                    <Phone className="w-4 h-4 shrink-0 text-antique-gold/70" />
                                    <a href="https://wa.me/94704239802" target="_blank" rel="noopener noreferrer" className="font-light hover:text-white transition-colors duration-300">
                                        +94 70 423 9802 (WhatsApp)
                                    </a>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-white/70">
                                    <Mail className="w-4 h-4 shrink-0 text-antique-gold/70" />
                                    <a href="mailto:info@yataraceylon.com" className="font-light hover:text-white transition-colors duration-300">
                                        info@yataraceylon.com
                                    </a>
                                </div>
                            </div>

                            {/* Social icons — monochrome → gold on hover */}
                            <div className="flex items-center gap-5 mt-5">
                                {[
                                    { href: 'https://wa.me/94704239802', label: 'WhatsApp', icon: <MessageCircle className="w-[18px] h-[18px]" strokeWidth={1.5} /> },
                                    { href: 'https://instagram.com/YataraCeylon', label: 'Instagram', icon: <Instagram className="w-[18px] h-[18px]" strokeWidth={1.5} /> },
                                    { href: 'https://facebook.com/YataraCeylon', label: 'Facebook', icon: <Facebook className="w-[18px] h-[18px]" strokeWidth={1.5} /> },
                                    { href: 'https://linkedin.com/company/YataraCeylon', label: 'LinkedIn', icon: <Linkedin className="w-[18px] h-[18px]" strokeWidth={1.5} /> },
                                    { href: 'https://youtube.com/@YataraCeylon', label: 'YouTube', icon: <Youtube className="w-[18px] h-[18px]" strokeWidth={1.5} /> },
                                    {
                                        href: 'https://tiktok.com/@YataraCeylon', label: 'TikTok',
                                        icon: <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg>,
                                    },
                                ].map((s) => (
                                    <a
                                        key={s.label}
                                        href={s.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={s.label}
                                        className="text-white/35 hover:text-antique-gold transition-colors duration-300"
                                    >
                                        {s.icon}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* ── Journeys column ── */}
                        <div className="lg:col-span-2">
                            <h4 className="text-[10px] tracking-[0.25em] font-nav font-semibold text-antique-gold/70 uppercase mb-5">
                                Journeys
                            </h4>
                            <ul className="space-y-3">
                                <li><Link href="/packages" className="text-sm font-light text-white/80 hover:text-white transition-colors duration-300">The Collection</Link></li>
                                <li><Link href="/tours/cultural" className="text-sm font-light text-white/80 hover:text-white transition-colors duration-300">Cultural Tours</Link></li>
                                <li><Link href="/tours/wildlife-adventure" className="text-sm font-light text-white/80 hover:text-white transition-colors duration-300">Wildlife &amp; Adventure</Link></li>
                                <li><Link href="/tours/experiences" className="text-sm font-light text-white/80 hover:text-white transition-colors duration-300">Experiences</Link></li>
                                <li><Link href="/build-tour" className="text-sm font-light text-white/80 hover:text-white transition-colors duration-300">Bespoke Planning</Link></li>
                            </ul>
                        </div>

                        {/* ── Company column ── */}
                        <div className="lg:col-span-2">
                            <h4 className="text-[10px] tracking-[0.25em] font-nav font-semibold text-antique-gold/70 uppercase mb-5">
                                Company
                            </h4>
                            <ul className="space-y-3">
                                <li><Link href="/about" className="text-sm font-light text-white/80 hover:text-white transition-colors duration-300">Our Story</Link></li>
                                <li><Link href="/about/team" className="text-sm font-light text-white/80 hover:text-white transition-colors duration-300">Our Team</Link></li>
                                <li><Link href="/about/sustainability" className="text-sm font-light text-white/80 hover:text-white transition-colors duration-300">Sustainability</Link></li>
                                <li><Link href="/services" className="text-sm font-light text-white/80 hover:text-white transition-colors duration-300">Services</Link></li>
                                <li><Link href="/faq" className="text-sm font-light text-white/80 hover:text-white transition-colors duration-300">FAQ</Link></li>
                                <li><Link href="/news" className="text-sm font-light text-white/80 hover:text-white transition-colors duration-300">Travel Bites</Link></li>
                                <li><Link href="/contact" className="text-sm font-light text-white/80 hover:text-white transition-colors duration-300">Contact Us</Link></li>
                            </ul>
                        </div>

                        {/* ── Newsletter column — "The Dispatch" ── */}
                        <div className="lg:col-span-4">
                            <h4 className="text-[10px] tracking-[0.25em] font-nav font-semibold text-antique-gold/70 uppercase mb-3">
                                Newsletter
                            </h4>
                            <p className="text-sm font-light text-white/70 mb-4 max-w-xs leading-relaxed">
                                Subscribe for curated itineraries &amp; insider access to luxury Ceylon.
                            </p>

                            {/* Liquid-glass newsletter input */}
                            <form className="relative flex items-center max-w-sm mb-5">
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="w-full rounded-full bg-white/[0.08] backdrop-blur-sm border border-white/[0.15] focus:border-antique-gold/50 focus:bg-white/[0.12] outline-none py-3 pl-5 pr-12 text-sm font-light transition-all duration-300 placeholder:text-white/35 focus:shadow-[0_0_20px_rgba(199,170,110,0.08)]"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-1.5 flex items-center justify-center w-9 h-9 rounded-full bg-antique-gold/20 border border-antique-gold/40 text-antique-gold hover:bg-antique-gold/30 hover:border-antique-gold/50 transition-all duration-300"
                                >
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            </form>

                            {/* Payment Partners — inline in newsletter column like Walkers */}
                            <p className="text-[9px] tracking-[0.2em] font-nav font-semibold text-white/40 uppercase mb-3">
                                Our Payment Partners
                            </p>
                            <div className="flex items-center gap-2 flex-wrap mb-4">
                                <span className="px-3 py-1.5 rounded bg-white flex items-center justify-center min-w-[55px]">
                                    <span className="text-[#1a1f71] font-bold text-sm italic tracking-tight" style={{ fontFamily: 'serif' }}>VISA</span>
                                </span>
                                <span className="px-2.5 py-1.5 rounded bg-white flex items-center justify-center min-w-[55px]">
                                    <svg width="30" height="18" viewBox="0 0 36 22" fill="none">
                                        <circle cx="13" cy="11" r="10" fill="#EB001B" />
                                        <circle cx="23" cy="11" r="10" fill="#F79E1B" />
                                        <path d="M18 3.3a10 10 0 0 1 0 15.4 10 10 0 0 1 0-15.4z" fill="#FF5F00" />
                                    </svg>
                                </span>
                                <span className="px-2.5 py-1.5 rounded bg-white flex items-center justify-center min-w-[55px]">
                                    <span className="text-[#006FCF] font-semibold text-[10px] tracking-tight">SafeKey</span>
                                </span>
                                <span className="px-2.5 py-1.5 rounded bg-white flex items-center justify-center min-w-[55px]">
                                    <span className="text-[#e21836] font-bold text-[10px]">Union</span>
                                    <span className="text-[#00447c] font-bold text-[10px]">Pay</span>
                                </span>
                            </div>

                            {/* Social icons */}
                            <div className="flex items-center gap-5">
                                {[
                                    { href: 'https://facebook.com/YataraCeylon', label: 'Facebook', icon: <Facebook className="w-[18px] h-[18px]" strokeWidth={1.5} /> },
                                    { href: 'https://instagram.com/YataraCeylon', label: 'Instagram', icon: <Instagram className="w-[18px] h-[18px]" strokeWidth={1.5} /> },
                                    { href: 'https://youtube.com/@YataraCeylon', label: 'YouTube', icon: <Youtube className="w-[18px] h-[18px]" strokeWidth={1.5} /> },
                                    { href: 'https://linkedin.com/company/YataraCeylon', label: 'LinkedIn', icon: <Linkedin className="w-[18px] h-[18px]" strokeWidth={1.5} /> },
                                    {
                                        href: 'https://tiktok.com/@YataraCeylon', label: 'TikTok',
                                        icon: <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg>,
                                    },
                                ].map((s) => (
                                    <a
                                        key={s.label}
                                        href={s.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={s.label}
                                        className="text-white/50 hover:text-white transition-colors duration-300"
                                    >
                                        {s.icon}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Bottom bar ── */}
                    <div className="border-t border-white/[0.08] pt-5 flex flex-col md:flex-row items-center justify-between gap-3">
                        <p className="text-[10px] font-nav tracking-[0.15em] text-white/45 uppercase">
                            &copy; {new Date().getFullYear()} Yatara Ceylon. All Rights Reserved.
                        </p>
                        <div className="flex items-center gap-3">
                            <Link href="/terms" className="text-[10px] font-nav tracking-[0.12em] text-white/45 uppercase hover:text-white/70 transition-colors duration-300">
                                Terms &amp; Conditions
                            </Link>
                            <span className="text-white/20 text-[8px]">|</span>
                            <Link href="/privacy" className="text-[10px] font-nav tracking-[0.12em] text-white/45 uppercase hover:text-white/70 transition-colors duration-300">
                                Privacy Policy
                            </Link>
                            <span className="text-white/20 text-[8px]">|</span>
                            <Link href="/sitemap.xml" className="text-[10px] font-nav tracking-[0.12em] text-white/45 uppercase hover:text-white/70 transition-colors duration-300">
                                Sitemap
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
