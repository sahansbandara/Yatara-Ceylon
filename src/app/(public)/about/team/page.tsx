import Image from 'next/image';
import Link from 'next/link';
import { Mail, Linkedin } from 'lucide-react';

const leadership = [
    {
        name: 'Rajitha Perera',
        role: 'Managing Director',
        bio: 'With over 20 years in the tourism industry, Rajitha leads Yatara Ceylon with a vision for world-class Sri Lankan hospitality.',
        image: '/images/about/team/rajitha.webp',
    },
    {
        name: 'Amaya Fernando',
        role: 'Head of Operations',
        bio: 'Amaya oversees all tour operations, ensuring every detail of every journey runs seamlessly from start to finish.',
        image: '/images/about/team/amaya.webp',
    },
    {
        name: 'Dinesh Jayawardena',
        role: 'Head of Sales & Marketing',
        bio: 'Dinesh connects travellers worldwide with authentic Sri Lankan experiences through strategic partnerships and digital innovation.',
        image: '/images/about/team/dinesh.webp',
    },
    {
        name: 'Nadeesha Silva',
        role: 'Head of Bespoke Travel',
        bio: 'Nadeesha and her team craft custom itineraries that transform travel dreams into reality, one journey at a time.',
        image: '/images/about/team/nadeesha.webp',
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        {leadership.map((person, idx) => (
                            <div key={idx} className="group relative overflow-hidden rounded-xl aspect-[2/3] shadow-lg bg-deep-emerald/5">
                                <Image
                                    src={person.image}
                                    alt={person.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                {/* Overlay gradient */}
                                <div className="absolute inset-x-0 bottom-0 top-1/3 bg-gradient-to-t from-[#0a1f15] via-[#0a1f15]/60 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
                                
                                {/* Info Container */}
                                <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end translate-y-12 group-hover:translate-y-0 transition-transform duration-500">
                                    <h3 className="text-xl font-serif text-white mb-1 drop-shadow-md">{person.name}</h3>
                                    <p className="text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] font-medium mb-4">{person.role}</p>
                                    
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
                                        <p className="text-white/80 font-light text-xs leading-relaxed mb-5 line-clamp-4">{person.bio}</p>
                                        <div className="flex gap-3">
                                            <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#0a1f15] transition-colors text-white backdrop-blur-sm">
                                                <Mail className="w-3.5 h-3.5" strokeWidth={2.5} />
                                            </button>
                                            <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#0a1f15] transition-colors text-white backdrop-blur-sm">
                                                <Linkedin className="w-3.5 h-3.5" strokeWidth={2.5} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Department Stats */}
            <section className="relative py-8 md:py-12 bg-[#E3EFE9] overflow-hidden">
                {/* Background Pattern Overlay */}
                <div
                    className="absolute inset-0 z-0 opacity-20 pointer-events-none mix-blend-multiply"
                    style={{
                        backgroundImage: "url('/images/home/curated-bg-pattern.webp')",
                        backgroundSize: '400px',
                        backgroundPosition: 'top left',
                        backgroundRepeat: 'repeat'
                    }}
                />
                <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-display text-deep-emerald">Our Departments</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {departments.map((dept, idx) => (
                            <div key={idx} className="text-center">
                                <p className="text-4xl md:text-5xl font-display text-[#D4AF37] mb-2">{dept.count}</p>
                                <p className="text-deep-emerald font-semibold text-sm mb-1">{dept.name}</p>
                                <p className="text-gray-600 font-light text-xs">{dept.desc}</p>
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

                        <div className="relative rounded-2xl overflow-hidden aspect-[3/2] shadow-2xl group">
                            <Image
                                src="/images/about/team/culture.webp"
                                alt="Yatara Ceylon team culture"
                                fill
                                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 border border-black/5 rounded-2xl pointer-events-none" />
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <div className="relative py-8 md:py-12 w-full overflow-hidden flex items-center justify-center bg-[#E3EFE9]">
                <div
                    className="absolute inset-0 z-0 opacity-20 pointer-events-none mix-blend-multiply"
                    style={{
                        backgroundImage: "url('/images/home/curated-bg-pattern.webp')",
                        backgroundSize: '400px',
                        backgroundPosition: 'top left',
                        backgroundRepeat: 'repeat'
                    }}
                />
                <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto">
                    <p className="inline-block mb-3 md:mb-4 text-xs md:text-sm tracking-[0.4em] font-medium text-[#D4AF37] uppercase drop-shadow-sm">
                        Get in Touch
                    </p>
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif text-deep-emerald font-normal leading-tight tracking-tight mb-8">
                        We&apos;d Love to <span className="italic font-light text-[#D4AF37]">Hear From You</span>
                    </h3>
                    <Link
                        href="/contact"
                        className="inline-block px-10 py-4 rounded-full bg-[#D4AF37] text-[#0a1f15] text-xs md:text-sm tracking-[0.2em] font-semibold uppercase hover:bg-[#D4AF37]/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
                    >
                        CONTACT US
                    </Link>
                </div>
            </div>
        </div>
    );
}
