'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectFade } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

const testimonials = [
    {
        title: "10 day tour",
        quote: "Our tour escort was very capable on educating us on all practices. We have to say a big thank you to Sampath, Kelum, Rasika and Hirunika for a most educational and exciting tour. Sampath and Kelum imparted so much information to us and answered any questions we put to them. Fantastic tour guides! We always felt safe and nothing was too much trouble for this team. They even decorated the bus with balloons and streamers to celebrate our granddaughter's birthday and also organised a cake and the band to sing happy birthday to her at Golden Crown in Kandy. It's a birthday she will never forget.",
        author: "Ms.Karin De silva",
        rating: 5,
    },
    {
        title: "BEYOND OUR EXPECTATIONS",
        quote: "The personalized touch Yatara Ceylon offered transformed our family vacation. The boutique hotels they selected were hidden gems, and the wildlife safari was truly a once-in-a-lifetime experience for our children.",
        author: "The Miller Family, Australia",
        rating: 5,
    },
    {
        title: "AUTHENTIC SRI LANKA",
        quote: "What set them apart was how immersed we felt in the culture. Cooking with a local family in Kandy and the private train ride views were magical. Truly a five-star, stress-free adventure.",
        author: "Elena Rossi, Italy",
        rating: 5,
    },
];

export default function RealExperiencesSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const swiperRef = useRef<SwiperType | null>(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    });

    const girlParallaxY = useTransform(scrollYProgress, [0, 1], ['15%', '-5%']);
    const watermarkParallaxY = useTransform(scrollYProgress, [0, 1], ['5vh', '-10vh']);

    return (
        <section ref={sectionRef} className="relative w-full min-h-[900px] xl:min-h-[1050px] 2xl:min-h-[1200px] bg-white text-black overflow-hidden flex flex-col pt-[15vh] pb-[10vh]">
            
            {/* ── Background Layer ── */}
            {/* To adjust background image positioning (up/down), edit object-[center_60%] below */}
            <div className="absolute inset-0 w-full h-full pointer-events-none">
                <Image
                    src="/images/home/testimonials-bg.webp"
                    alt="Scenic Sri Lanka landscape with traveler"
                    fill
                    sizes="100vw"
                    className="object-cover object-[center_60%]"
                    quality={90}
                    priority
                />
            </div>

            {/* Top gradient to blend image into the white page above, providing a canvas for text */}
            <div
                className="absolute inset-x-0 top-0 h-[40vh] z-[1] pointer-events-none"
                style={{
                    background: 'linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0.9) 30%, rgba(255,255,255,0) 100%)',
                }}
            />

            {/* Fixed "real stories" watermark that glides up rapidly */}
            <motion.div 
                className="absolute w-full top-[10%] xl:top-[12%] flex justify-center z-[2] pointer-events-none"
                style={{ y: watermarkParallaxY }}
            >
                {/* To adjust "real stories" size: change the 250px inside fontSize: 'clamp(...)' */}
                <p
                    className="font-sans font-bold text-center text-[#EAEAEA] lowercase select-none"
                    style={{
                        fontSize: 'clamp(100px, 18vw, 250px)',
                        lineHeight: 0.8,
                        letterSpacing: '-0.02em',
                        whiteSpace: 'nowrap'
                    }}
                >
                    real stories
                </p>
            </motion.div>

            {/* Person Overlay Image */}
            {/* To adjust girl size: change the w-[Xpx] and h-[Ypx] Tailwind classes on the motion.div below */}
            {/* You can push her down by editing bottom-[-5%] */}
            <motion.div
                style={{ y: girlParallaxY }}
                className="absolute bottom-[-8%] left-[-5%] md:bottom-[-2%] md:left-[-2%] lg:left-[5%] z-[3] w-[260px] h-[480px] md:w-[380px] md:h-[650px] lg:w-[480px] lg:h-[800px] xl:w-[540px] xl:h-[900px] will-change-transform pointer-events-none"
            >
                <Image
                    src="/images/home/testimonials-person.webp"
                    alt="Traveler enjoying Sri Lanka"
                    fill
                    sizes="(max-width: 768px) 260px, (max-width: 1024px) 380px, (max-width: 1280px) 480px, 540px"
                    className="object-contain object-bottom drop-shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
                    quality={100}
                    priority
                />
            </motion.div>

            {/* ── SCROLLING FOREGROUND ── */}
            {/* mt-[12vh] pushes "Real Experiences" below the top half of "real stories" */}
            {/* Change mt-[...] to push the heading + reviews further UP or DOWN */}
            <div className="relative z-[10] w-full max-w-7xl mx-auto px-4 flex flex-col items-center mt-[12vh] md:mt-[18vh] xl:mt-[22vh]">
                
                {/* Main heading */}
                {/* To adjust "Real Experiences" text size: change the 56px inside fontSize: 'clamp(...)' */}
                <h2 
                    className="font-sans font-bold text-center text-black tracking-tight mb-8 md:mb-12 z-[3] relative"
                    style={{
                        fontSize: 'clamp(36px, 4vw, 56px)'
                    }}
                >
                    Real Experiences
                </h2>

                {/* Swiper slider area */}
                <div className="relative w-full max-w-5xl flex items-center justify-center">
                    {/* Navigation arrows */}
                    <button
                        aria-label="Previous testimonial"
                        onClick={() => swiperRef.current?.slidePrev()}
                        className="hidden md:flex absolute left-0 md:left-4 z-20 w-10 h-10 rounded-full border border-black/30 text-black/70 hover:text-black hover:border-black transition-colors items-center justify-center bg-transparent"
                    >
                        <ChevronLeft className="w-5 h-5 stroke-[1]" />
                    </button>

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
                        className="w-full max-w-3xl"
                    >
                        {testimonials.map((t, i) => (
                            <SwiperSlide key={i}>
                                <div className="text-center px-4 md:px-12 py-4">
                                    {/* Testimonial title */}
                                    <h3 className="font-sans font-bold text-black mb-6 tracking-tight" style={{ fontSize: '16px' }}>
                                        "{t.title}"
                                    </h3>

                                    {/* Testimonial body */}
                                    <p
                                        className="font-sans text-black leading-relaxed mb-6 mx-auto"
                                        style={{
                                            fontSize: 'clamp(14px, 1.6vw, 16px)',
                                            fontWeight: 400,
                                        }}
                                    >
                                        {t.quote}
                                    </p>

                                    {/* Author */}
                                    <p
                                        className="font-sans font-bold text-black tracking-wide"
                                        style={{ fontSize: '14px' }}
                                    >
                                        - {t.author} -
                                    </p>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <button
                        aria-label="Next testimonial"
                        onClick={() => swiperRef.current?.slideNext()}
                        className="hidden md:flex absolute right-0 md:right-4 z-20 w-10 h-10 rounded-full border border-black/30 text-black/70 hover:text-black hover:border-black transition-colors items-center justify-center bg-transparent"
                    >
                        <ChevronRight className="w-5 h-5 stroke-[1]" />
                    </button>
                    
                    {/* Mobile arrows below text */}
                    <div className="md:hidden flex space-x-4 justify-center mt-6 w-full absolute -bottom-16">
                        <button
                            aria-label="Previous testimonial"
                            onClick={() => swiperRef.current?.slidePrev()}
                            className="w-10 h-10 rounded-full border border-black/30 text-black/70 hover:text-black hover:border-black transition-colors flex items-center justify-center bg-transparent"
                        >
                            <ChevronLeft className="w-4 h-4 stroke-[1]" />
                        </button>
                        <button
                            aria-label="Next testimonial"
                            onClick={() => swiperRef.current?.slideNext()}
                            className="w-10 h-10 rounded-full border border-black/30 text-black/70 hover:text-black hover:border-black transition-colors flex items-center justify-center bg-transparent"
                        >
                            <ChevronRight className="w-4 h-4 stroke-[1]" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
