import Image from 'next/image';
import Link from 'next/link';
import { Leaf, TreePine, Heart, Globe, Recycle, Users, Shield, Droplets, Award } from 'lucide-react';
import { AnimatedStat } from '@/components/ui/AnimatedStat';

const pillars = [
    {
        icon: TreePine,
        title: 'Environmental Conservation',
        description: 'We actively protect Sri Lanka\'s biodiversity through reforestation projects, wildlife corridor preservation, and partnerships with national parks.',
    },
    {
        icon: Heart,
        title: 'Community Empowerment',
        description: 'We uplift rural communities by sourcing local guides, partnering with village homestays, and directing tourism revenue to local economies.',
    },
    {
        icon: Users,
        title: 'Inclusive Tourism',
        description: 'We ensure travel is accessible to all — designing experiences for travellers with disabilities, elderly guests, and families with special needs.',
    },
    {
        icon: Recycle,
        title: 'Reducing Our Footprint',
        description: 'From carbon-offset vehicles to eliminating single-use plastics across our operations, we are committed to minimising environmental impact.',
    },
];

const initiatives = [
    {
        title: 'Carbon-Neutral Fleet',
        desc: 'Our vehicle fleet includes hybrids and carbon-offset options. We are working towards a fully carbon-neutral fleet by 2030.',
        icon: Leaf,
    },
    {
        title: 'Plastic-Free Operations',
        desc: 'We have eliminated single-use plastics from all tours. Guests receive reusable water bottles and eco-friendly amenities.',
        icon: Droplets,
    },
    {
        title: 'Wildlife Conservation Fund',
        desc: 'A portion of every safari booking is donated to the Sri Lanka Wildlife Conservation Society to protect endangered species.',
        icon: Shield,
    },
    {
        title: 'Community Tourism Project',
        desc: 'Our village immersion experiences directly fund education, healthcare, and infrastructure in rural Sri Lankan communities.',
        icon: Globe,
    },
];

const stats = [
    { value: '5,000+', label: 'Trees Planted' },
    { value: '0', label: 'Single-Use Plastics' },
    { value: '30+', label: 'Community Partners' },
    { value: '2030', label: 'Carbon Neutral Target' },
];

export default function SustainabilityPage() {
    return (
        <div className="min-h-screen bg-off-white">
            {/* Hero Section */}
            <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
                <Image
                    src="/images/home/sustainability-hero.webp"
                    alt="Sustainable tourism in Sri Lanka"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-deep-emerald/60" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a1f15]/80 via-transparent to-deep-emerald/90" />

                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="text-center max-w-3xl px-4">
                        <span className="inline-block mb-4 text-xs tracking-[0.4em] font-medium text-[#D4AF37] uppercase">
                            Responsible Tourism
                        </span>
                        <h1 className="text-5xl md:text-7xl font-display text-white leading-tight">
                            Travel as a Force<br />
                            <span className="italic font-light text-[#D4AF37]">for Good</span>
                        </h1>
                        <p className="mt-6 text-white/70 font-light text-lg max-w-xl mx-auto">
                            We believe tourism can preserve nature, uplift communities, and ensure inclusive travel for all.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission Statement */}
            <section className="py-28">
                <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
                    <Leaf className="w-12 h-12 text-[#D4AF37] mx-auto mb-6" strokeWidth={1} />
                    <h2 className="text-3xl md:text-4xl font-display text-deep-emerald mb-6 leading-relaxed">
                        &ldquo;We are dedicated to preserving Sri Lanka&apos;s natural beauty and cultural heritage for generations to come, while creating meaningful livelihoods for local communities.&rdquo;
                    </h2>
                    <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-6" />
                </div>
            </section>

            {/* Four Pillars */}
            <section className="py-28 bg-white">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-16">
                        <span className="text-xs tracking-[0.3em] text-[#D4AF37] uppercase font-medium">Our Commitment</span>
                        <h2 className="text-4xl md:text-5xl font-display text-deep-emerald mt-3">
                            Four Pillars of Sustainability
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {pillars.map((pillar, idx) => (
                            <div key={idx} className="group p-8 rounded-2xl bg-off-white border border-deep-emerald/5 hover:border-[#D4AF37]/20 transition-all duration-500">
                                <div className="w-14 h-14 rounded-xl bg-deep-emerald/5 border border-deep-emerald/10 flex items-center justify-center mb-6 group-hover:bg-[#D4AF37]/10 group-hover:border-[#D4AF37]/20 transition-all">
                                    <pillar.icon className="w-7 h-7 text-deep-emerald/60 group-hover:text-[#D4AF37] transition-colors" strokeWidth={1.5} />
                                </div>
                                <h3 className="text-2xl font-display text-deep-emerald mb-3">{pillar.title}</h3>
                                <p className="text-gray-500 font-light leading-relaxed">{pillar.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-20 bg-deep-emerald">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="text-center">
                                <p className="text-4xl md:text-5xl font-display text-[#D4AF37] mb-2">
                                    <AnimatedStat value={stat.value} />
                                </p>
                                <p className="text-xs tracking-[0.15em] uppercase text-white/60 font-medium">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Initiatives */}
            <section className="py-28">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-16">
                        <span className="text-xs tracking-[0.3em] text-[#D4AF37] uppercase font-medium">In Action</span>
                        <h2 className="text-4xl md:text-5xl font-display text-deep-emerald mt-3">
                            Our Initiatives
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {initiatives.map((init, idx) => (
                            <div key={idx} className="flex items-start gap-5 group p-6 rounded-2xl bg-white border border-deep-emerald/5 hover:shadow-lg transition-all">
                                <div className="w-11 h-11 rounded-xl bg-deep-emerald/5 border border-deep-emerald/10 flex items-center justify-center shrink-0 group-hover:bg-[#D4AF37]/10 group-hover:border-[#D4AF37]/20 transition-all">
                                    <init.icon className="w-5 h-5 text-deep-emerald/60 group-hover:text-[#D4AF37] transition-colors" strokeWidth={1.5} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-display text-deep-emerald mb-1">{init.title}</h3>
                                    <p className="text-gray-500 font-light text-sm leading-relaxed">{init.desc}</p>
                                </div>
                            </div>
                        ))}
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
                        Travel Responsibly
                    </p>
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif text-deep-emerald font-normal leading-tight tracking-tight mb-8">
                        Journey with <span className="italic font-light text-[#D4AF37]">Purpose</span>
                    </h3>
                    <Link
                        href="/inquire"
                        className="inline-block px-10 py-4 rounded-full bg-[#D4AF37] text-[#0a1f15] text-xs md:text-sm tracking-[0.2em] font-semibold uppercase hover:bg-[#D4AF37]/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
                    >
                        PLAN AN ECO TOUR
                    </Link>
                </div>
            </div>
        </div>
    );
}
