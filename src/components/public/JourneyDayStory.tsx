'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const PACKAGES = [
    {
        id: 'luxury',
        type: 'LUXURY TRAVEL',
        title: 'Artisan in Travel,\nCurating Luxury',
        description: 'Experts in tailor-made luxury travel, crafting bespoke journeys that highlight Sri Lanka’s culture, authenticity, and hospitality while offering discerning travelers immersive and off-beat experiences with refined luxury.',
        image: '/images/home/package-luxury.webp',
        href: '/brands/luxury'
    },
    {
        id: 'wellness',
        type: 'WELLNESS TRAVEL',
        title: 'Curating Your\nHealing Journey',
        description: 'Combining wellness, accessible, and medical tourism, prioritizing health, relaxation, and personalized care, ensuring transformative, inclusive journeys focused on well-being for every type of traveler.',
        image: '/images/home/package-wellness.webp',
        href: '/brands/wellness'
    },
    {
        id: 'adventure',
        type: 'ADVENTURE TRAVEL',
        title: 'Escape the\nOrdinary',
        description: 'Experience the world, one journey at a time. Where adventure awaits at every turn. Escape the ordinary and discover paths only a few dare to take.',
        image: '/images/home/package-adventure.webp',
        href: '/brands/adventure'
    },
];

export default function DedicatedBrands() {
    return (
        <section
            className="relative w-full h-[100dvh] min-h-[600px] max-h-[850px] flex flex-col justify-center overflow-hidden py-10"
        >
            {/* Section Background Image */}
            <div className="absolute inset-0 w-full h-full z-0">
                <Image
                    src="/images/home/packages-bg.webp"
                    alt="Yatara Experiences"
                    fill
                    sizes="100vw"
                    className="object-cover transform scale-105"
                    priority
                />
                {/* Global liquid glass overlay to ensure header text readability */}
                <div className="absolute inset-0 bg-[#F9F9F8]/60 backdrop-blur-[6px]" />
            </div>

            <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12 lg:mb-16 will-change-transform w-full"
                >
                    <h2 className="text-3xl md:text-[40px] lg:text-[44px] font-sans font-medium text-black leading-[1.1] mb-4 tracking-tight drop-shadow-sm">
                        A Symphony of <br className="hidden md:block" />
                        <span className="font-bold">Exclusive Experiences</span>
                    </h2>
                    <p className="text-[15px] md:text-[17px] font-sans text-black/80 max-w-3xl mx-auto leading-relaxed font-medium drop-shadow-sm">
                        Yatara offers dedicated brands specializing in luxury, wellness, accessible tourism, and adventure.
                        Whether you seek indulgence, rejuvenation, or thrilling exploration, we create exceptional, tailor-made
                        experiences designed to exceed your expectations.
                    </p>
                </motion.div>

                {/* Grid — 3 moments */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full h-[400px] lg:h-[450px]">
                    {PACKAGES.map((pkg, idx) => (
                        <Link href={pkg.href} key={pkg.id} className="block w-full h-full group">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7, delay: idx * 0.15 }}
                                className="relative w-full h-full rounded-[24px] overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-700 isolate hover:-translate-y-3"
                            >
                                {/* Base Liquid Glass Background */}
                                <div className="absolute inset-0 transition-all duration-700 bg-white/40 backdrop-blur-xl border border-white/50 group-hover:bg-transparent group-hover:backdrop-blur-none group-hover:border-transparent z-0" />

                                {/* Background Image (Hidden by default, Revealed on Hover) */}
                                <div className="absolute inset-0 w-full h-full z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out">
                                    <Image
                                        src={pkg.image}
                                        alt={pkg.title.replace('\n', ' ')}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        className="object-cover transform scale-100 group-hover:scale-105 transition-transform duration-[2s] ease-out brightness-75"
                                    />
                                    {/* Dark overlay so white text reads clearly on hover */}
                                    <div className="absolute inset-0 bg-black/40" />
                                </div>

                                {/* Text Content */}
                                <div className="absolute inset-0 p-8 lg:p-10 flex flex-col items-start text-left z-20 w-full h-full justify-center">

                                    {/* Title */}
                                    <h3
                                        className="text-2xl lg:text-[32px] font-sans font-medium text-black group-hover:text-white transition-colors duration-500 leading-[1.2] mb-6 tracking-tight drop-shadow-sm group-hover:drop-shadow-md"
                                        dangerouslySetInnerHTML={{ __html: pkg.title.replace('\n', '<br/>') }}
                                    />

                                    {/* Description */}
                                    <p className="text-[#222222] group-hover:text-white/95 transition-colors duration-500 font-sans text-[14px] lg:text-[15px] leading-relaxed mb-auto pr-4 drop-shadow-sm group-hover:drop-shadow-md">
                                        {pkg.description}
                                    </p>

                                    {/* Bottom Button matching Walkers style */}
                                    <div className="mt-8 flex items-center gap-4 text-[#063364] group-hover:text-white transition-colors duration-500 font-sans text-[12px] uppercase tracking-wider font-bold">
                                        <div className="w-8 h-8 rounded-full bg-white/70 backdrop-blur-md group-hover:bg-white border border-black/10 group-hover:border-transparent text-black group-hover:text-[#063364] flex items-center justify-center shadow-sm transition-all duration-500">
                                            <span className="text-xl leading-none mb-[2px] font-light">+</span>
                                        </div>
                                        {pkg.type}
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>

            </div>
        </section>
    );
}
