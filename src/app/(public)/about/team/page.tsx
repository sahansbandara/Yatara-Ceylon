import Image from 'next/image';
import Link from 'next/link';
import { Mail, Linkedin } from 'lucide-react';

const leadership = [
    {
        name: 'Rajitha Perera',
        role: 'Managing Director',
        bio: 'With over 20 years in the tourism industry, Rajitha leads Yatara Ceylon with a vision for world-class Sri Lankan hospitality.',
        image: '/images/home/hero-poster.png',
    },
    {
        name: 'Amaya Fernando',
        role: 'Head of Operations',
        bio: 'Amaya oversees all tour operations, ensuring every detail of every journey runs seamlessly from start to finish.',
        image: '/images/home/hero-poster.png',
    },
    {
        name: 'Dinesh Jayawardena',
        role: 'Head of Sales & Marketing',
        bio: 'Dinesh connects travellers worldwide with authentic Sri Lankan experiences through strategic partnerships and digital innovation.',
        image: '/images/home/hero-poster.png',
    },
    {
        name: 'Nadeesha Silva',
        role: 'Head of Bespoke Travel',
        bio: 'Nadeesha and her team craft custom itineraries that transform travel dreams into reality, one journey at a time.',
        image: '/images/home/hero-poster.png',
    },
];

const departments = [
    { name: 'Tour Planning', count: '15+', desc: 'Expert planners crafting bespoke itineraries' },
    { name: 'Chauffeur Guides', count: '100+', desc: 'Multilingual guides with deep local knowledge' },
    { name: 'Fleet Operations', count: '20+', desc: 'Maintaining our fleet of 200+ vehicles' },
    { name: 'Customer Support', count: '10+', desc: 'Round-the-clock concierge and support' },
];

export default function TeamPage() {
    return (
        <div className="min-h-screen bg-off-white">
            {/* Hero Section */}
            <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
                <Image
                    src="/images/home/heritage-story.png"
                    alt="Yatara Ceylon Team"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-deep-emerald/60" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a1f15]/80 via-transparent to-deep-emerald/90" />

                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="text-center max-w-3xl px-4">
                        <span className="inline-block mb-4 text-xs tracking-[0.4em] font-medium text-[#D4AF37] uppercase">
                            The People Behind Your Journey
                        </span>
                        <h1 className="text-5xl md:text-7xl font-display text-white leading-tight">
                            Meet Our<br />
                            <span className="italic font-light text-[#D4AF37]">Team</span>
                        </h1>
                        <p className="mt-6 text-white/70 font-light text-lg max-w-xl mx-auto">
                            A passionate team of travel experts, chauffeur-guides, and hospitality professionals dedicated to making every journey exceptional.
                        </p>
                    </div>
                </div>
            </section>

            {/* Leadership Team */}
            <section className="py-28">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-16">
                        <span className="text-xs tracking-[0.3em] text-[#D4AF37] uppercase font-medium">Leadership</span>
                        <h2 className="text-4xl md:text-5xl font-display text-deep-emerald mt-3">
                            Our Leadership Team
                        </h2>
                        <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-6" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {leadership.map((person, idx) => (
                            <div key={idx} className="group text-center">
                                <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden mb-6 border-2 border-deep-emerald/10 group-hover:border-[#D4AF37]/30 transition-all shadow-lg">
                                    <Image
                                        src={person.image}
                                        alt={person.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                                <h3 className="text-xl font-display text-deep-emerald mb-1">{person.name}</h3>
                                <p className="text-xs tracking-[0.15em] uppercase text-[#D4AF37] font-medium mb-3">{person.role}</p>
                                <p className="text-gray-500 font-light text-sm leading-relaxed mb-4">{person.bio}</p>
                                <div className="flex justify-center gap-3">
                                    <button className="w-8 h-8 rounded-full bg-deep-emerald/5 flex items-center justify-center hover:bg-[#D4AF37]/10 transition-colors">
                                        <Mail className="w-4 h-4 text-deep-emerald/50" />
                                    </button>
                                    <button className="w-8 h-8 rounded-full bg-deep-emerald/5 flex items-center justify-center hover:bg-[#D4AF37]/10 transition-colors">
                                        <Linkedin className="w-4 h-4 text-deep-emerald/50" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Department Stats */}
            <section className="py-20 bg-deep-emerald">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-display text-white">Our Departments</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {departments.map((dept, idx) => (
                            <div key={idx} className="text-center">
                                <p className="text-4xl md:text-5xl font-display text-[#D4AF37] mb-2">{dept.count}</p>
                                <p className="text-white font-medium text-sm mb-1">{dept.name}</p>
                                <p className="text-white/50 font-light text-xs">{dept.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Culture Section */}
            <section className="py-28 bg-white">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-xs tracking-[0.3em] text-[#D4AF37] uppercase font-medium">Our Culture</span>
                            <h2 className="text-4xl md:text-5xl font-display text-deep-emerald mt-3 mb-6 leading-tight">
                                Passionate About <span className="italic text-[#D4AF37]">Ceylon</span>
                            </h2>
                            <p className="text-gray-500 font-light leading-relaxed mb-6 text-[15px]">
                                At Yatara Ceylon, we are more than a travel company — we are storytellers, explorers, and hosts. Every member of our team shares a deep love for Sri Lanka and a commitment to sharing its magic with the world.
                            </p>
                            <p className="text-gray-500 font-light leading-relaxed mb-8 text-[15px]">
                                Our multilingual chauffeur-guides are the heart of every tour, combining local expertise with warm hospitality to create connections that last a lifetime.
                            </p>
                            <Link
                                href="/careers"
                                className="inline-block px-8 py-3 rounded-full border-2 border-deep-emerald text-deep-emerald text-sm tracking-[0.15em] font-semibold uppercase hover:bg-deep-emerald hover:text-white transition-all"
                            >
                                JOIN OUR TEAM
                            </Link>
                        </div>

                        <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-xl">
                            <Image
                                src="/images/home/signature-wildlife.png"
                                alt="Yatara Ceylon team culture"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <div className="relative h-[50vh] overflow-hidden">
                <div className="absolute inset-0 bg-fixed bg-cover bg-center" style={{ backgroundImage: "url('/images/home/signature-ceylon.png')" }} />
                <div className="absolute inset-0 bg-deep-emerald/30" />
                <div className="relative z-10 flex items-center justify-center h-full">
                    <div className="text-center">
                        <p className="text-xs tracking-[0.4em] font-medium text-white/80 uppercase mb-4 drop-shadow-lg">
                            Get in Touch
                        </p>
                        <h3 className="text-3xl md:text-5xl font-display text-white drop-shadow-lg mb-8">
                            We&apos;d Love to <span className="italic text-[#D4AF37]">Hear From You</span>
                        </h3>
                        <Link
                            href="/contact"
                            className="inline-block px-10 py-4 rounded-full bg-[#D4AF37] text-[#0a1f15] text-sm tracking-[0.2em] font-semibold uppercase hover:bg-[#D4AF37]/90 transition-all shadow-lg"
                        >
                            CONTACT US
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
