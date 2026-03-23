import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const EXPERIENCES = [
    {
        title: 'Heritage & Culture',
        description:
            'Ancient capitals, sacred sites, and private guiding through the island’s most storied landscapes.',
        label: 'For slow discovery',
        href: '/packages?style=heritage',
        image: '/images/home/cat-heritage.webp',
    },
    {
        title: 'Wildlife & Nature',
        description:
            'Leopard country, misty tea hills, and natural encounters paced around privacy and comfort.',
        label: 'For immersive travel',
        href: '/packages?style=wildlife',
        image: '/images/home/cat-wildlife.webp',
    },
    {
        title: 'Coast & Wellness',
        description:
            'Beachfront seclusion, restorative stays, and coastal routes designed for ease, space, and calm.',
        label: 'For restorative escapes',
        href: '/packages?style=beach',
        image: '/images/home/cat-coastal.webp',
    },
];

export default function SignatureExperiences() {
    return (
        <section className="home-section-shell bg-off-white">
            <div className="home-section-inner">
                <div className="mb-12 max-w-2xl">
                    <p className="home-kicker">Signature Experiences</p>
                    <h2 className="home-heading mt-4">
                        Three clear ways to begin the journey
                    </h2>
                    <p className="home-copy mt-5">
                        This is the emotional entry point. Choose the rhythm that feels most like you, then let the itinerary become more precise from there.
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {EXPERIENCES.map((experience) => (
                        <Link
                            key={experience.title}
                            href={experience.href}
                            className="group relative overflow-hidden rounded-[28px] bg-deep-emerald"
                        >
                            <div className="relative aspect-[4/5]">
                                <Image
                                    src={experience.image}
                                    alt={experience.title}
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 33vw"
                                    className="object-cover transition duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,19,14,0.08)_0%,rgba(3,19,14,0.62)_55%,rgba(3,19,14,0.92)_100%)]" />
                            </div>

                            <div className="absolute inset-x-0 bottom-0 z-10 p-6 md:p-7">
                                <p className="text-[10px] font-nav font-semibold uppercase tracking-[0.28em] text-antique-gold">
                                    {experience.label}
                                </p>
                                <h3 className="mt-3 text-3xl font-display tracking-tight text-white">
                                    {experience.title}
                                </h3>
                                <p className="mt-4 text-sm font-light leading-relaxed tracking-normal text-white/70">
                                    {experience.description}
                                </p>
                                <div className="mt-6 inline-flex items-center gap-2 text-[11px] font-nav font-semibold uppercase tracking-[0.2em] text-white transition duration-300 group-hover:text-antique-gold">
                                    Explore this direction
                                    <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
