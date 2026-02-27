'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { testimonials, trustStats } from '@/data/testimonials';

import 'swiper/css';
import 'swiper/css/effect-fade';

/* ─── Animated Counter (reused pattern) ─── */
function AnimatedCounter({ value, suffix, isFloat }: { value: number; suffix: string; isFloat?: boolean }) {
    const [display, setDisplay] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true); },
            { threshold: 0.3 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!visible) return;
        const step = value / 40;
        let current = 0;
        const timer = setInterval(() => {
            current += step;
            if (current >= value) {
                current = value;
                clearInterval(timer);
            }
            setDisplay(isFloat ? parseFloat(current.toFixed(1)) : Math.floor(current));
        }, 30);
        return () => clearInterval(timer);
    }, [visible, value, isFloat]);

    return (
        <div ref={ref}>
            <p className="text-4xl font-display text-antique-gold mb-2 tracking-tight">
                {display}{suffix}
            </p>
        </div>
    );
}

export default function TestimonialsOverlay() {
    const swiperRef = useRef<SwiperType | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const goPrev = useCallback(() => {
        swiperRef.current?.slidePrev();
    }, []);

    const goNext = useCallback(() => {
        swiperRef.current?.slideNext();
    }, []);

    return (
        <section className="relative overflow-hidden">
            {/* Background image with dark overlay */}
            <div className="absolute inset-0">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: "url('/images/home/testimonials-bg.png')" }}
                />
                <div className="absolute inset-0 bg-deep-emerald/90" />
                <div className="absolute inset-0 bg-gradient-to-b from-deep-emerald/60 via-transparent to-deep-emerald/80" />
            </div>

            {/* Giant watermark word (Walkers pattern) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                <span className="text-[8rem] md:text-[12rem] lg:text-[16rem] font-display font-bold text-white/[0.03] uppercase tracking-wider whitespace-nowrap">
                    real stories
                </span>
            </div>

            <div className="relative z-10 py-24 md:py-28">
                <div className="max-w-5xl mx-auto px-4 md:px-8">
                    {/* Section Heading */}
                    <div className="text-center mb-16">
                        <span className="inline-block mb-4 text-xs tracking-[0.3em] font-medium text-antique-gold uppercase">
                            Real Stories · Real Experiences
                        </span>
                        <h2 className="text-4xl md:text-6xl font-display text-off-white leading-tight">
                            Voices from <span className="italic font-light text-antique-gold">Our Guests</span>
                        </h2>
                    </div>

                    {/* Testimonial Carousel */}
                    <div className="relative max-w-3xl mx-auto">
                        {/* Navigation Arrows */}
                        <button
                            onClick={goPrev}
                            aria-label="Previous testimonial"
                            className="absolute -left-4 md:-left-16 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-antique-gold hover:border-antique-gold/50 transition-all z-20 backdrop-blur-sm bg-white/5"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={goNext}
                            aria-label="Next testimonial"
                            className="absolute -right-4 md:-right-16 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-antique-gold hover:border-antique-gold/50 transition-all z-20 backdrop-blur-sm bg-white/5"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>

                        {/* Swiper fade carousel */}
                        <Swiper
                            modules={[EffectFade, Autoplay]}
                            effect="fade"
                            fadeEffect={{ crossFade: true }}
                            autoplay={{ delay: 6000, disableOnInteraction: false }}
                            loop
                            onSwiper={(swiper) => { swiperRef.current = swiper; }}
                            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                            className="testimonial-swiper"
                        >
                            {testimonials.map((t, idx) => (
                                <SwiperSlide key={idx}>
                                    <div className="text-center px-4 md:px-12">
                                        <Quote className="w-12 h-12 text-antique-gold/20 mx-auto mb-8" />

                                        {/* Stars */}
                                        <div className="flex gap-1.5 justify-center mb-8">
                                            {Array.from({ length: t.rating }).map((_, i) => (
                                                <Star key={i} className="w-5 h-5 fill-antique-gold text-antique-gold" />
                                            ))}
                                        </div>

                                        {/* Quote */}
                                        <p className="text-off-white/90 font-light leading-relaxed text-xl md:text-2xl italic mb-10 min-h-[120px]">
                                            &ldquo;{t.quote}&rdquo;
                                        </p>

                                        {/* Author */}
                                        <div className="flex items-center justify-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-antique-gold/20 border border-antique-gold/30 flex items-center justify-center text-antique-gold font-display text-lg">
                                                {t.name[0]}
                                            </div>
                                            <div className="text-left">
                                                <p className="text-antique-gold font-medium text-base tracking-wide">{t.name}</p>
                                                <p className="text-off-white/40 text-xs tracking-[0.15em] uppercase mt-0.5">{t.country}</p>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {/* Dot Indicators */}
                        <div className="flex gap-2.5 justify-center mt-12">
                            {testimonials.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => swiperRef.current?.slideToLoop(idx)}
                                    aria-label={`Go to testimonial ${idx + 1}`}
                                    className={`h-1.5 rounded-full transition-all duration-500 ${idx === activeIndex
                                        ? 'bg-antique-gold w-8'
                                        : 'bg-white/20 w-1.5 hover:bg-white/40'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Animated Trust Stats */}
                    <div className="border-t border-off-white/10 pt-16 mt-20">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                            {trustStats.map((stat, idx) => (
                                <div key={idx} className="group">
                                    <AnimatedCounter value={stat.value} suffix={stat.suffix} isFloat={stat.isFloat} />
                                    <p className="text-xs tracking-[0.2em] uppercase text-off-white/40 font-light group-hover:text-off-white/60 transition-colors">
                                        {stat.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
