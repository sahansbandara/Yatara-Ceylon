'use client';

import { useState } from 'react';
import { testimonials } from '@/data/testimonials';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BuildTourTestimonials() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const next = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prev = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <section className="relative py-24 sm:py-32 bg-[#F8F9FA] overflow-hidden">
            {/* Elegant Background Elements */}
            <div className="absolute inset-0 bg-[url('/images/textures/paper-texture.webp')] opacity-40 mix-blend-multiply pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />

            <div className="section-container relative z-10">
                {/* Header */}
                <div className="text-center mb-16 relative">
                    <span className="absolute inset-0 flex justify-center items-center pointer-events-none select-none text-[8rem] sm:text-[12rem] font-serif italic text-black/[0.03] -translate-y-1/2 whitespace-nowrap">
                        real stories
                    </span>
                    <h2 className="font-display text-4xl sm:text-5xl text-[#1A1A1A] relative z-10">
                        Real Experiences
                    </h2>
                </div>

                {/* Carousel */}
                <div className="max-w-4xl mx-auto relative flex items-center justify-center min-h-[300px]">
                    <button
                        onClick={prev}
                        className="absolute left-0 z-20 w-12 h-12 flex items-center justify-center rounded-full border border-black/10 text-black/40 hover:text-black hover:border-black/30 transition-all bg-white shadow-sm"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="w-full px-16 sm:px-24">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="text-center flex flex-col items-center"
                            >
                                <h3 className="font-serif font-bold text-[#1A1A1A] text-lg sm:text-xl mb-6">
                                    “{(testimonials[currentIndex] as any).title || 'An Unforgettable Journey'}”
                                </h3>
                                <p className="text-[#4A4A4A] text-lg sm:text-2xl font-light leading-relaxed mb-10 max-w-3xl">
                                    {testimonials[currentIndex].quote}
                                </p>
                                <div className="flex items-center justify-center gap-4">
                                    <div className="h-px w-8 bg-antique-gold" />
                                    <span className="font-serif font-bold text-[#1A1A1A] uppercase tracking-widest text-xs">
                                        {testimonials[currentIndex].name}
                                    </span>
                                    <div className="h-px w-8 bg-antique-gold" />
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <button
                        onClick={next}
                        className="absolute right-0 z-20 w-12 h-12 flex items-center justify-center rounded-full border border-black/10 text-black/40 hover:text-black hover:border-black/30 transition-all bg-white shadow-sm"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </section>
    );
}
