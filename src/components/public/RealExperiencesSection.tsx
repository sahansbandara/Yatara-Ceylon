'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectFade } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/effect-fade';

const testimonials = [
    {
        title: 'A Honeymoon Beyond Imagination',
        quote:
            "Yatara didn\u2019t just plan our honeymoon \u2014 they orchestrated a love letter to Sri Lanka. Every detail, from the private tuk-tuk through Galle Fort to sunrise at Sigiriya, was flawless.",
        author: 'Charlotte & James',
        origin: 'United Kingdom',
    },
    {
        title: 'Personal Attention Like No Other',
        quote:
            'As someone who has traveled extensively through Asia, I can say the level of personal attention Yatara provides is genuinely rare. Our guide felt like a friend, not a service.',
        author: 'Marc Delafosse',
        origin: 'France',
    },
    {
        title: 'Effortless Family Adventure',
        quote:
            'We had three children under 10 and Yatara made it effortless. The private vehicle, the curated kid-friendly stops, the concierge checking in daily \u2014 it was a dream.',
        author: 'Sarah Mitchell',
        origin: 'Australia',
    },
    {
        title: 'Exceeded Every Expectation',
        quote:
            "The fixed-price guarantee gave us peace of mind, and the itinerary exceeded our expectations in every way. We\u2019re already planning our return.",
        author: 'Thomas & Anna Weber',
        origin: 'Germany',
    },
    {
        title: 'A Culinary Journey of Discovery',
        quote:
            'The attention to culinary detail was extraordinary. Every meal was a discovery \u2014 from street-side hoppers to private dining at a tea estate. Unforgettable.',
        author: 'Yuki Tanaka',
        origin: 'Japan',
    },
];

export default function RealExperiencesSection() {
    const swiperRef = useRef<SwiperType | null>(null);

    return (
        <section className="relative w-full overflow-hidden bg-white">
            {/* ── Top: Testimonials content on white background ── */}
            <div className="relative w-full max-w-4xl mx-auto px-6 pt-20 pb-16">
                {/* Faded "real stories" watermark behind heading */}
                <div className="absolute inset-0 flex items-start justify-center pointer-events-none select-none" style={{ top: '20px' }}>
                    <span
                        className="font-display italic whitespace-nowrap"
                        style={{
                            fontSize: 'clamp(80px, 12vw, 160px)',
                            color: 'rgba(0, 0, 0, 0.08)',
                            fontWeight: 300,
                            lineHeight: 1.2,
                        }}
                    >
                        real stories
                    </span>
                </div>

                {/* Main heading */}
                <h2
                    className="relative text-center font-display text-dark-green mb-12"
                    style={{
                        fontSize: 'clamp(32px, 4vw, 46px)',
                        fontWeight: 300,
                        marginTop: '60px',
                    }}
                >
                    Real Experiences
                </h2>

                {/* Swiper slider with navigation arrows */}
                <div className="relative">
                    <Swiper
                        modules={[Navigation, Autoplay, EffectFade]}
                        effect="fade"
                        fadeEffect={{ crossFade: true }}
                        loop
                        speed={700}
                        autoplay={{ delay: 6000, disableOnInteraction: true }}
                        onSwiper={(swiper) => {
                            swiperRef.current = swiper;
                        }}
                        className="w-full"
                    >
                        {testimonials.map((t, i) => (
                            <SwiperSlide key={i}>
                                <div className="text-center px-10 md:px-16">
                                    {/* Testimonial title */}
                                    <h3
                                        className="font-sans text-dark-green mb-6"
                                        style={{
                                            fontSize: '15px',
                                            fontWeight: 600,
                                        }}
                                    >
                                        &ldquo;{t.title}&rdquo;
                                    </h3>

                                    {/* Testimonial body */}
                                    <blockquote
                                        className="font-sans text-dark-green/80 leading-relaxed mb-8"
                                        style={{
                                            fontSize: '16px',
                                            fontWeight: 400,
                                            lineHeight: '1.7',
                                        }}
                                    >
                                        {t.quote}
                                    </blockquote>

                                    {/* Author */}
                                    <p
                                        className="font-sans text-dark-green"
                                        style={{
                                            fontSize: '15px',
                                            fontWeight: 600,
                                        }}
                                    >
                                        &ndash; {t.author} &ndash;
                                    </p>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Navigation arrows — flanking the testimonial text */}
                    <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-between">
                        <button
                            aria-label="Previous testimonial"
                            onClick={() => swiperRef.current?.slidePrev()}
                            className="pointer-events-auto -ml-4 md:-ml-10 w-10 h-10 rounded-full border border-dark-green/20 text-dark-green/40 hover:text-dark-green hover:border-dark-green/50 transition-all duration-300 flex items-center justify-center bg-transparent"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            aria-label="Next testimonial"
                            onClick={() => swiperRef.current?.slideNext()}
                            className="pointer-events-auto -mr-4 md:-mr-10 w-10 h-10 rounded-full border border-dark-green/20 text-dark-green/40 hover:text-dark-green hover:border-dark-green/50 transition-all duration-300 flex items-center justify-center bg-transparent"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Bottom: Scenic landscape image with person overlay ── */}
            <div className="relative w-full h-[50vh] md:h-[60vh]">
                {/* Background landscape */}
                <Image
                    src="/images/home/testimonials-bg.webp"
                    alt="Scenic Sri Lanka landscape"
                    fill
                    sizes="100vw"
                    className="object-cover"
                    quality={85}
                    loading="lazy"
                />

                {/* Top gradient — smooth blend from white into the image */}
                <div
                    className="absolute inset-x-0 top-0 h-40 pointer-events-none z-[1]"
                    style={{
                        background: 'linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0.6) 40%, rgba(255,255,255,0) 100%)',
                    }}
                />

                {/* Person image — positioned center-left of the landscape */}
                <div className="absolute bottom-0 left-[12%] sm:left-[14%] md:left-[16%] lg:left-[18%] z-[2] w-[220px] h-[340px] sm:w-[260px] sm:h-[400px] md:w-[300px] md:h-[460px] lg:w-[340px] lg:h-[520px]">
                    <Image
                        src="/images/home/testimonials-person.webp"
                        alt="Traveler enjoying Sri Lanka"
                        fill
                        sizes="(max-width: 640px) 200px, (max-width: 768px) 250px, (max-width: 1024px) 300px, 350px"
                        className="object-contain object-bottom"
                        quality={90}
                        loading="lazy"
                    />
                </div>
            </div>
        </section>
    );
}
