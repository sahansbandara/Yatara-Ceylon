'use client';

import { useState } from 'react';
import { testimonials } from '@/data/testimonials';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BuildTourTestimonials() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

    return (
        <section className="relative py-20 bg-[#0a0f0d] overflow-hidden">
            {/* Subtle warm-stone background overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0d1410] to-[#0a0f0d]" />

            <div className="section-container relative z-10">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-3">
                        <div className="h-px w-10 bg-antique-gold/20" />
                        <span className="text-antique-gold/50 text-[9px] tracking-[0.3em] uppercase font-serif">
                            Traveller Stories
                        </span>
                        <div className="h-px w-10 bg-antique-gold/20" />
                    </div>
                    <h2 className="font-display text-3xl sm:text-4xl text-white">
                        Real Experiences
                    </h2>
                </div>

                {/* Testimonial Carousel */}
                <div className="max-w-3xl mx-auto relative flex items-center justify-center min-h-[200px]">
                    <button
                        onClick={prev}
                        className="absolute left-0 z-20 w-10 h-10 flex items-center justify-center rounded-full border border-white/8 text-white/25 hover:text-antique-gold hover:border-antique-gold/30 transition-all bg-white/[0.02] backdrop-blur-sm"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div className="w-full px-14 sm:px-20">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.4, ease: 'easeOut' }}
                                className="text-center flex flex-col items-center"
                            >
                                <Quote className="w-6 h-6 text-antique-gold/20 mb-4" />
                                <p className="text-white/60 text-base sm:text-lg font-light leading-relaxed mb-6 max-w-2xl">
                                    {testimonials[currentIndex].quote}
                                </p>
                                <div className="flex items-center justify-center gap-3">
                                    <div className="h-px w-6 bg-antique-gold/30" />
                                    <span className="font-serif font-semibold text-white/70 uppercase tracking-widest text-[10px]">
                                        {testimonials[currentIndex].name}
                                    </span>
                                    <div className="h-px w-6 bg-antique-gold/30" />
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <button
                        onClick={next}
                        className="absolute right-0 z-20 w-10 h-10 flex items-center justify-center rounded-full border border-white/8 text-white/25 hover:text-antique-gold hover:border-antique-gold/30 transition-all bg-white/[0.02] backdrop-blur-sm"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Dots indicator */}
                <div className="flex justify-center gap-1.5 mt-6">
                    {testimonials.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-antique-gold/60 w-4' : 'bg-white/10 hover:bg-white/20'}`}
                        />
                    ))}
                </div>

                {/* Concierge tie-in */}
                <p className="text-center text-white/15 text-[9px] font-light tracking-wider mt-6">
                    Every journey starts with a plan — our concierge team refines it into something extraordinary.
                </p>
            </div>
        </section>
    );
}
